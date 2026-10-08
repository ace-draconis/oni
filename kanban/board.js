#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const ROOT = __dirname;
const DEFAULT_PATHS = {
  state: path.join(ROOT, 'data', 'board.json'),
  audit: path.join(ROOT, 'logs', 'audit.jsonl'),
};
const STATUSES = [
  'Backlog',
  'Ready',
  'In Progress',
  'Verification',
  'Changes Requested',
  'Done',
];
const SECRET_LIKE = /(?:bearer\s+\S+|(?:password|passwd|secret|api[_-]?key|token)\s*[:=]\s*\S+|(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}))/i;

function fail(message) {
  throw new Error(message);
}

function cleanText(value, label, required = true) {
  if (value === undefined || value === '') {
    if (required) fail(`${label} is required.`);
    return '';
  }
  const text = String(value).trim();
  if (!text && required) fail(`${label} cannot be empty.`);
  if (SECRET_LIKE.test(text)) fail(`${label} looks like it may contain a secret; remove it.`);
  return text;
}

function actorFrom(options) {
  let fallback = 'unknown';
  try {
    fallback = os.userInfo().username || fallback;
  } catch { /* Keep a safe non-sensitive default. */ }
  return cleanText(options.actor || process.env.BOARD_ACTOR || fallback, 'Actor');
}

function readState(statePath) {
  if (!fs.existsSync(statePath)) return { version: 1, nextId: 1, tickets: [] };
  let state;
  try {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch (error) {
    fail(`Cannot read board state ${statePath}: ${error.message}`);
  }
  if (state?.version !== 1 || !Number.isInteger(state.nextId) || !Array.isArray(state.tickets)) {
    fail(`Invalid board state in ${statePath}.`);
  }
  return state;
}

function persist(state, statePath) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  const temporary = `${statePath}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
    fs.renameSync(temporary, statePath);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function appendEvents(events, auditPath) {
  fs.mkdirSync(path.dirname(auditPath), { recursive: true });
  const existed = fs.existsSync(auditPath);
  const previousSize = existed ? fs.statSync(auditPath).size : 0;
  try {
    fs.appendFileSync(auditPath, events.map((event) => JSON.stringify(event)).join('\n') + '\n', {
      encoding: 'utf8',
      mode: 0o600,
    });
    return { existed, previousSize };
  } catch (error) {
    if (fs.existsSync(auditPath)) {
      if (existed) fs.truncateSync(auditPath, previousSize);
      else fs.unlinkSync(auditPath);
    }
    throw error;
  }
}

function ticketById(state, id) {
  const ticket = state.tickets.find((item) => item.id === id);
  if (!ticket) fail(`Ticket ${id} not found.`);
  return ticket;
}

function eventFor(ticket, actor, action, options = {}) {
  return {
    timestamp: new Date().toISOString(),
    actor,
    ticketId: ticket.id,
    action,
    ...(options.reason ? { reason: options.reason } : {}),
    ...(options.evidence ? { evidence: options.evidence } : {}),
    revision: ticket.revision,
    ...(options.details || {}),
  };
}

function withBoard(paths, operation) {
  const state = readState(paths.state);
  const events = operation(state);
  const checkpoint = appendEvents(events, paths.audit);
  try {
    persist(state, paths.state);
  } catch (error) {
    try {
      if (checkpoint.existed) fs.truncateSync(paths.audit, checkpoint.previousSize);
      else fs.unlinkSync(paths.audit);
    } catch (rollbackError) {
      fail(`Could not save board state (${error.message}) or roll back audit append (${rollbackError.message}).`);
    }
    throw error;
  }
  return events;
}

function createTicket(title, options = {}, paths = DEFAULT_PATHS) {
  const actor = actorFrom(options);
  const reason = cleanText(options.reason || 'Created from CLI', 'Reason');
  const events = withBoard(paths, (state) => {
    const id = `K-${String(state.nextId++).padStart(4, '0')}`;
    const ticket = {
      id,
      title: cleanText(title, 'Title'),
      status: 'Backlog',
      assignee: null,
      revision: '1',
      staticPass: null,
      approvals: {},
      links: [],
      createdAt: new Date().toISOString(),
    };
    state.tickets.push(ticket);
    return [eventFor(ticket, actor, 'ticket_created', { reason })];
  });
  return events[0].ticketId;
}

function moveTicket(id, destination, options = {}, paths = DEFAULT_PATHS) {
  const actor = actorFrom(options);
  return withBoard(paths, (state) => {
    const ticket = ticketById(state, id);
    const reason = cleanText(options.reason || `Moved from ${ticket.status} to ${destination}`, 'Reason');
    if (!STATUSES.includes(destination)) fail(`Unknown status "${destination}".`);
    const valid = (ticket.status === 'Backlog' && destination === 'Ready')
      || (ticket.status === 'Changes Requested' && destination === 'Ready');
    if (!valid) {
      if (ticket.status === 'In Progress' && destination === 'Verification') {
        if (ticket.staticPass?.revision !== ticket.revision) {
          fail(`A static pass for revision ${ticket.revision} is required before Verification.`);
        }
        ticket.status = destination;
        return [eventFor(ticket, actor, 'moved', { reason, details: { from: 'In Progress', to: destination, evidence: ticket.staticPass.evidence } })];
      }
      fail(`Cannot move ${ticket.id} from ${ticket.status} to ${destination}; use the required workflow command.`);
    }
    const from = ticket.status;
    ticket.status = destination;
    return [eventFor(ticket, actor, 'moved', { reason, details: { from, to: destination } })];
  });
}

function claimTicket(id, assigneeName, options = {}, paths = DEFAULT_PATHS) {
  const actor = actorFrom(options);
  const assignee = cleanText(assigneeName, 'Assignee');
  const reason = cleanText(options.reason || `Claimed by ${assignee}`, 'Reason');
  return withBoard(paths, (state) => {
    const ticket = ticketById(state, id);
    if (ticket.status !== 'Ready' && ticket.status !== 'In Progress') {
      fail(`Cannot claim ${ticket.id} while it is ${ticket.status}; tickets must be Ready or In Progress.`);
    }
    const from = ticket.status;
    ticket.status = 'In Progress';
    ticket.assignee = assignee;
    return [eventFor(ticket, actor, 'claimed', { reason, details: { assignee, from, to: ticket.status } })];
  });
}

function recordStaticPass(id, evidence, options = {}, paths = DEFAULT_PATHS) {
  const actor = actorFrom(options);
  const checked = cleanText(evidence, 'Static-check evidence');
  return withBoard(paths, (state) => {
    const ticket = ticketById(state, id);
    if (ticket.status !== 'In Progress') fail(`Static checks can only be recorded In Progress (currently ${ticket.status}).`);
    ticket.staticPass = { revision: ticket.revision, evidence: checked, actor, timestamp: new Date().toISOString() };
    return [eventFor(ticket, actor, 'static_pass', { evidence: checked })];
  });
}

function recordApproval(id, kind, evidence, options = {}, paths = DEFAULT_PATHS) {
  const actor = actorFrom(options);
  const checked = cleanText(evidence, 'Approval evidence');
  if (!['qa', 'review'].includes(kind)) fail('Approval type must be "qa" or "review".');
  return withBoard(paths, (state) => {
    const ticket = ticketById(state, id);
    if (ticket.status !== 'Verification') fail(`Approvals can only be recorded in Verification (currently ${ticket.status}).`);
    if (ticket.approvals[kind]?.revision === ticket.revision) {
      fail(`${kind} already approved revision ${ticket.revision}.`);
    }
    ticket.approvals[kind] = { revision: ticket.revision, actor, evidence: checked, timestamp: new Date().toISOString() };
    return [eventFor(ticket, actor, `${kind}_approved`, { evidence: checked })];
  });
}

function recordFinding(id, finding, paths = DEFAULT_PATHS) {
  const actor = actorFrom(finding);
  const type = cleanText(finding.type, 'Finding type').toLowerCase();
  if (!['qa', 'review'].includes(type)) fail('Finding type must be "qa" or "review".');
  const detail = {
    sourceFile: cleanText(finding.file, 'Source file'),
    sourceLine: cleanText(finding.line, 'Source line'),
    reproduction: cleanText(finding.reproduction, 'Reproduction'),
    actual: cleanText(finding.actual, 'Actual result'),
    expected: cleanText(finding.expected, 'Expected result'),
    why: cleanText(finding.why, 'Why / root cause'),
    proposedFix: cleanText(finding.fix, 'Proposed fix'),
    rationale: cleanText(finding.rationale, 'Rationale'),
  };
  if (!/^[1-9]\d*$/.test(detail.sourceLine)) fail('Source line must be a positive line number.');
  const reason = cleanText(finding.reason || `${type} finding: ${detail.why}`, 'Reason');
  const findingId = randomUUID();
  let bugId;
  const events = withBoard(paths, (state) => {
    const original = ticketById(state, id);
    if (original.status !== 'Verification') fail(`Findings can only be recorded in Verification (currently ${original.status}).`);
    const from = original.status;
    original.status = 'Changes Requested';
    original.staticPass = null;
    original.approvals = {};
    const bug = {
      id: `K-${String(state.nextId++).padStart(4, '0')}`,
      title: `Fix: ${original.title}`,
      status: 'Ready',
      assignee: 'Neon',
      revision: '1',
      staticPass: null,
      approvals: {},
      links: [original.id],
      createdAt: new Date().toISOString(),
      sourceFinding: {
        id: findingId,
        ticketId: original.id,
        type,
        ...detail,
      },
    };
    original.links.push(bug.id);
    state.tickets.push(bug);
    bugId = bug.id;
    return [
      eventFor(original, actor, 'finding_recorded', {
        reason,
        details: { evidence: detail.reproduction, findingId, findingType: type, bugTicketId: bug.id, from, to: original.status },
      }),
      eventFor(bug, actor, 'finding_bug_created', {
        reason,
        details: { evidence: detail.reproduction, findingId, sourceTicketId: original.id, assignee: 'Neon' },
      }),
    ];
  });
  return { findingId, bugId, events };
}

function reviseTicket(id, options = {}, paths = DEFAULT_PATHS) {
  const actor = actorFrom(options);
  const reason = cleanText(options.reason, 'Reason');
  return withBoard(paths, (state) => {
    const ticket = ticketById(state, id);
    if (!['In Progress', 'Changes Requested'].includes(ticket.status)) {
      fail(`Cannot revise a ticket while it is ${ticket.status}.`);
    }
    const fromRevision = ticket.revision;
    ticket.revision = String(Number(ticket.revision) + 1);
    ticket.staticPass = null;
    ticket.approvals = {};
    if (ticket.status === 'Changes Requested') ticket.status = 'Ready';
    return [eventFor(ticket, actor, 'revision_created', {
      reason,
      details: { fromRevision, status: ticket.status },
    })];
  });
}

function completeTicket(id, options = {}, paths = DEFAULT_PATHS) {
  const actor = actorFrom(options);
  return withBoard(paths, (state) => {
    const ticket = ticketById(state, id);
    const reason = cleanText(options.reason || 'QA and review approved the current revision', 'Reason');
    if (ticket.status !== 'Verification') fail(`Only tickets in Verification can be completed (currently ${ticket.status}).`);
    if (ticket.staticPass?.revision !== ticket.revision) fail('A static pass for the current revision is required.');
    for (const kind of ['qa', 'review']) {
      if (ticket.approvals[kind]?.revision !== ticket.revision) {
        fail(`A ${kind} approval for revision ${ticket.revision} is required.`);
      }
    }
    ticket.status = 'Done';
    return [eventFor(ticket, actor, 'completed', { reason, details: { from: 'Verification', to: 'Done' } })];
  });
}

function listBoard(paths = DEFAULT_PATHS) {
  return readState(paths.state).tickets;
}

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith('--')) {
      positional.push(item);
      continue;
    }
    const key = item.slice(2);
    if (!key || options[key] !== undefined) fail(`Invalid or repeated option ${item}.`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) fail(`Option ${item} requires a value.`);
    options[key] = value;
    i += 1;
  }
  return { positional, options };
}

function validateCommandArgs(command, positional, options) {
  const shapes = {
    create: [1, ['actor', 'reason']],
    list: [0, []],
    move: [2, ['actor', 'reason']],
    claim: [2, ['actor', 'reason']],
    revise: [1, ['actor', 'reason']],
    'static-pass': [2, ['actor']],
    approve: [3, ['actor']],
    finding: [2, ['actor', 'reason', 'file', 'line', 'reproduction', 'actual', 'expected', 'why', 'fix', 'rationale']],
    done: [1, ['actor', 'reason']],
  };
  const shape = shapes[command];
  if (!shape) return;
  if (positional.length !== shape[0]) fail(`Command "${command}" expects ${shape[0]} positional argument(s).`);
  const unexpected = Object.keys(options).find((key) => !shape[1].includes(key));
  if (unexpected) fail(`Option --${unexpected} is not valid for "${command}".`);
}

function help() {
  return `Kanban board (no dependencies)

  npm run board -- create "title" [--actor NAME] [--reason TEXT]
  npm run board -- list
  npm run board -- move ID "Ready" [--actor NAME] [--reason TEXT]
  npm run board -- claim ID ASSIGNEE [--actor NAME] [--reason TEXT]
  npm run board -- revise ID --actor NAME --reason TEXT
  npm run board -- static-pass ID "checks passed" --actor NAME
  npm run board -- approve ID qa|review "evidence" --actor NAME
  npm run board -- finding ID qa|review --file PATH --line N --reproduction TEXT
      --actual TEXT --expected TEXT --why TEXT --fix TEXT --rationale TEXT [--actor NAME]
  npm run board -- done ID [--actor NAME] [--reason TEXT]

Findings create a linked Ready bug assigned to Neon and return the source to
Changes Requested. Board changes never launch or notify agents.
`;
}

function runCli(argv) {
  const command = argv[0];
  if (!command || command === 'help' || command === '--help') {
    process.stdout.write(help());
    return;
  }
  const { positional, options } = parseArgs(argv.slice(1));
  validateCommandArgs(command, positional, options);
  const actorOpts = { actor: options.actor, reason: options.reason };
  let result;
  switch (command) {
    case 'create':
      result = createTicket(positional[0], actorOpts);
      process.stdout.write(`Created ${result}\n`);
      break;
    case 'list': {
      const tickets = listBoard();
      if (!tickets.length) process.stdout.write('Board is empty.\n');
      else for (const ticket of tickets) {
        process.stdout.write(`${ticket.id}  ${ticket.status.padEnd(17)} ${ticket.title}${ticket.assignee ? ` [${ticket.assignee}]` : ''} (rev ${ticket.revision})\n`);
      }
      break;
    }
    case 'move':
      result = moveTicket(positional[0], positional[1], actorOpts);
      process.stdout.write(`Moved ${positional[0]} to ${positional[1]}\n`);
      break;
    case 'claim':
      result = claimTicket(positional[0], positional[1], actorOpts);
      process.stdout.write(`Claimed ${positional[0]} for ${positional[1]}\n`);
      break;
    case 'revise':
      reviseTicket(positional[0], actorOpts);
      process.stdout.write(`Revised ${positional[0]}\n`);
      break;
    case 'static-pass':
      recordStaticPass(positional[0], positional[1], actorOpts);
      process.stdout.write(`Recorded static pass for ${positional[0]}\n`);
      break;
    case 'approve':
      recordApproval(positional[0], positional[1], positional[2], actorOpts);
      process.stdout.write(`Recorded ${positional[1]} approval for ${positional[0]}\n`);
      break;
    case 'finding':
      result = recordFinding(positional[0], {
        ...options,
        actor: options.actor,
        type: positional[1],
      });
      process.stdout.write(`Finding ${result.findingId} created bug ${result.bugId}; ${positional[0]} is Changes Requested\n`);
      break;
    case 'done':
      completeTicket(positional[0], actorOpts);
      process.stdout.write(`Completed ${positional[0]}\n`);
      break;
    default:
      fail(`Unknown command "${command}". Run "npm run board -- help".`);
  }
}

if (require.main === module) {
  try {
    runCli(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  STATUSES,
  createTicket,
  moveTicket,
  claimTicket,
  recordStaticPass,
  recordApproval,
  recordFinding,
  reviseTicket,
  completeTicket,
  listBoard,
  runCli,
};
