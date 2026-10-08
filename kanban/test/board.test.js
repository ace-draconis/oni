'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const {
  createTicket,
  moveTicket,
  claimTicket,
  recordStaticPass,
  recordApproval,
  recordFinding,
  reviseTicket,
  completeTicket,
  listBoard,
} = require('../board');

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kanban-board-'));
  const paths = {
    state: path.join(root, 'data', 'board.json'),
    audit: path.join(root, 'logs', 'audit.jsonl'),
  };
  fs.mkdirSync(path.dirname(paths.audit), { recursive: true });
  fs.writeFileSync(paths.audit, '{"preserved":"prior audit record"}\n');
  return { root, paths, options: { actor: 'test-actor' } };
}

function cleanup(root) {
  fs.rmSync(root, { recursive: true, force: true });
}

const validFinding = {
  actor: 'qa-agent',
  type: 'qa',
  file: 'src/checkout.js',
  line: '12',
  reproduction: 'Run node checkout.js with a $10 subtotal.',
  actual: 'Total is $12.00.',
  expected: 'Total is $11.00.',
  why: 'The configured tax rate is twice the intended rate.',
  fix: 'Use the intended 10% rate.',
  rationale: 'The checkout contract specifies 10% tax.',
};

test('finding links a Neon-ready bug, sends source to changes requested, and appends audit', () => {
  const { root, paths, options } = fixture();
  try {
    const originalId = createTicket('Checkout smoke test', options, paths);
    moveTicket(originalId, 'Ready', options, paths);
    claimTicket(originalId, 'smoke-tester', options, paths);
    recordStaticPass(originalId, 'node --check passed', options, paths);
    moveTicket(originalId, 'Verification', options, paths);

    const finding = recordFinding(originalId, validFinding, paths);
    const tickets = listBoard(paths);
    const original = tickets.find((ticket) => ticket.id === originalId);
    const bug = tickets.find((ticket) => ticket.id === finding.bugId);

    assert.equal(original.status, 'Changes Requested');
    assert.ok(original.links.includes(bug.id));
    assert.equal(bug.status, 'Ready');
    assert.equal(bug.assignee, 'Neon');
    assert.ok(bug.links.includes(originalId));
    assert.equal(bug.sourceFinding.ticketId, originalId);
    assert.equal(bug.sourceFinding.sourceFile, validFinding.file);
    assert.equal(bug.sourceFinding.sourceLine, validFinding.line);
    assert.equal(bug.sourceFinding.reproduction, validFinding.reproduction);
    assert.equal(bug.sourceFinding.actual, validFinding.actual);
    assert.equal(bug.sourceFinding.expected, validFinding.expected);
    assert.equal(bug.sourceFinding.why, validFinding.why);
    assert.equal(bug.sourceFinding.proposedFix, validFinding.fix);
    assert.equal(bug.sourceFinding.rationale, validFinding.rationale);

    const audit = fs.readFileSync(paths.audit, 'utf8').trim().split('\n').map(JSON.parse);
    assert.deepEqual(audit[0], { preserved: 'prior audit record' });
    assert.ok(audit.some((entry) => entry.ticketId === originalId && entry.action === 'finding_recorded'));
    assert.ok(audit.some((entry) => entry.ticketId === bug.id && entry.action === 'finding_bug_created'));
    for (const event of audit.slice(1)) {
      assert.ok(event.timestamp);
      assert.ok(event.actor);
      assert.ok(event.ticketId);
      assert.ok(event.action);
      assert.ok(event.revision);
    }
  } finally {
    cleanup(root);
  }
});

test('Done is gated by static pass and QA plus review for the same revision', () => {
  const { root, paths, options } = fixture();
  try {
    const id = createTicket('Lifecycle', options, paths);
    moveTicket(id, 'Ready', options, paths);
    claimTicket(id, 'Neon', options, paths);
    assert.throws(() => moveTicket(id, 'Verification', options, paths), /static pass/);
    recordStaticPass(id, 'lint and typecheck passed', options, paths);
    reviseTicket(id, { ...options, reason: 'Implementation changed' }, paths);
    assert.equal(listBoard(paths)[0].revision, '2');
    assert.throws(() => moveTicket(id, 'Verification', options, paths), /static pass/);
    recordStaticPass(id, 'checks passed for revision 2', options, paths);
    moveTicket(id, 'Verification', options, paths);
    assert.throws(() => completeTicket(id, options, paths), /qa approval/);
    recordApproval(id, 'qa', 'QA passed', options, paths);
    assert.throws(() => completeTicket(id, options, paths), /review approval/);
    recordApproval(id, 'review', 'Review approved', options, paths);
    completeTicket(id, options, paths);
    assert.equal(listBoard(paths)[0].status, 'Done');
  } finally {
    cleanup(root);
  }
});

test('invalid transitions fail without changing the board or audit log', () => {
  const { root, paths, options } = fixture();
  try {
    const id = createTicket('Invalid move', options, paths);
    const before = fs.readFileSync(paths.audit, 'utf8');
    assert.throws(() => moveTicket(id, 'Done', options, paths), /Cannot move/);
    assert.equal(listBoard(paths)[0].status, 'Backlog');
    assert.equal(fs.readFileSync(paths.audit, 'utf8'), before);
  } finally {
    cleanup(root);
  }
});
