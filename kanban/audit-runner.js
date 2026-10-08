const { appendFileSync, mkdirSync, readFileSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { randomUUID } = require('node:crypto');

const root = __dirname;
const auditPath = path.join(root, 'logs', 'audit.jsonl');
const checkoutPath = path.join(root, 'checkout.js');
const expected = {
  stdout: 'Total: $11.00\n',
  stderr: '',
  exitCode: 0,
};
const runId = randomUUID();
let actor = process.env.AUDIT_ACTOR?.trim();

if (!actor) {
  try {
    actor = os.userInfo().username;
  } catch {
    actor = 'unknown';
  }
}

const checkoutSource = readFileSync(checkoutPath, 'utf8');
const taxLineIndex = checkoutSource
  .split(/\r?\n/)
  .findIndex((line) => line.trim() === 'const taxPercent = 20;');
const source = {
  file: 'checkout.js',
  line: taxLineIndex === -1 ? null : taxLineIndex + 1,
};

const command = [process.execPath, checkoutPath];
const execution = spawnSync(command[0], [command[1]], {
  cwd: root,
  encoding: 'utf8',
});
const observed = {
  stdout: execution.stdout ?? '',
  stderr: execution.stderr ?? '',
  exitCode: Number.isInteger(execution.status) ? execution.status : null,
  error: execution.error ? execution.error.message : null,
};
const matched = observed.stdout === expected.stdout
  && observed.stderr === expected.stderr
  && observed.exitCode === expected.exitCode
  && observed.error === null;
const outcome = matched ? 'pass' : 'mismatch';

const report = {
  reportVersion: 1,
  timestamp: new Date().toISOString(),
  runId,
  actor,
  command: command.join(' '),
  stage: 'checkout-output-verification',
  observed,
  expected,
  outcome,
  source,
  rootCause: 'The checkout applies 20% tax although the expected tax rate is 10%.',
  proposedFix: 'Change taxPercent from 20 to 10 in checkout.js.',
  rationale: 'A $10.00 subtotal with 10% tax must total $11.00; 20% currently produces $12.00.',
  auditLog: path.relative(root, auditPath),
};

try {
  mkdirSync(path.dirname(auditPath), { recursive: true });
  appendFileSync(auditPath, `${JSON.stringify(report)}\n`, { encoding: 'utf8' });
} catch (error) {
  report.auditError = error.message;
  report.outcome = 'audit-write-failure';
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (report.outcome !== 'pass') {
  process.exitCode = 1;
}
