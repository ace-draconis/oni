const { appendFileSync, readFileSync } = require('node:fs');
const path = require('node:path');

const root = __dirname;
const auditPath = path.join(root, 'logs', 'audit.jsonl');
const runId = process.argv[2];

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

if (process.argv.length !== 3 || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(runId ?? '')) {
  fail('Usage: node audit-handoff.js <valid-runId> (expected a UUID).');
} else {
  let reports;
  try {
    reports = readFileSync(auditPath, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch (error) {
    fail(`Could not read valid audit reports from ${path.relative(root, auditPath)}: ${error.message}`);
  }

  if (reports) {
    const report = reports.find((entry) => entry.runId?.toLowerCase() === runId.toLowerCase());
    if (!report) {
      fail(`No audit report found for runId ${runId}.`);
    } else if (report.outcome !== 'mismatch') {
      fail(`Cannot record handoff for runId ${runId}: outcome is ${report.outcome}, not mismatch.`);
    } else {
      const event = {
        timestamp: new Date().toISOString(),
        runId: report.runId,
        actor: process.env.AUDIT_ACTOR?.trim() || 'Neon (coordinator)',
        event: 'failure_report_received',
        reportedBy: 'smoke-tester-agent',
        source: report.source,
        observed: report.observed,
        expected: report.expected,
        rootCause: report.rootCause,
        proposedFix: report.proposedFix,
        rationale: report.rationale,
        resolution: 'not_applied_demo_intentionally_left_broken',
      };

      try {
        appendFileSync(auditPath, `${JSON.stringify(event)}\n`, { encoding: 'utf8' });
        process.stdout.write(`${JSON.stringify(event)}\n`);
      } catch (error) {
        fail(`Could not append handoff event: ${error.message}`);
      }
    }
  }
}
