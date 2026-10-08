# Local Kanban and audit demo

A no-dependency local Node.js CLI for a small work board and append-only audit
trail. Use Node.js 26 or newer. Board state is stored in `data/board.json`;
new board events append to `logs/audit.jsonl` without replacing existing
history. State and test fixtures are local; tests use and remove temporary
directories.

```sh
npm run board -- help
npm run board -- create "Checkout smoke test" --actor coordinator
npm run board -- list
npm run test:board
npm run web
```

The browser board opens at `http://127.0.0.1:4173`. It shows the workflow
columns, ticket details and links, static/QA/review evidence, and the latest
100 audit events. Use **Refresh** to reload data after a CLI action. The web
view is read-only; use the CLI below to make ticket changes. It binds only to
loopback and does not expose the board to the network.

The board flow is **Backlog → Ready → In Progress → Verification → Done**,
with findings moving the original item from Verification to Changes Requested.
Use `move ID Ready` to expose Backlog or Changes Requested work, then
`claim ID ASSIGNEE` to explicitly assign it and start work. Static checks must
pass on the current revision before it can enter Verification. QA and code
review can then approve independently; `done ID` requires both approvals and
the static pass for that same revision. `revise ID` increments the revision
and clears stale static/approval records.

Example finding command (all listed finding details are required):

```sh
npm run board -- finding K-0001 qa \
  --file checkout.js --line 2 \
  --reproduction "Run node checkout.js" \
  --actual 'Total: $12.00' --expected 'Total: $11.00' \
  --why "Tax rate is too high" --fix "Use 10 percent" \
  --rationale "The expected subtotal plus tax is $11.00" --actor qa-agent
```

This records the finding, returns its source ticket to Changes Requested, and
creates a linked bug ticket in Ready assigned to **Neon**. The bug ticket
retains the finding ID, source file and line, reproduction, actual and expected
results, root cause, proposed fix, and rationale. Neon claims it explicitly,
implements a fix, runs `revise ID --reason "Fix applied"` to identify the new
revision, records static-check evidence for that revision, and routes it to
Verification. The original item can separately be moved back to Ready,
claimed, revised, and re-verified.
Use `approve ID qa "evidence"` and `approve ID review "evidence"` to record
approval; `done ID` then checks all completion gates.

Commands support `--actor NAME` and `--reason TEXT` where relevant; finding
details use the flags shown above. The CLI reports invalid inputs/transitions
on stderr with a non-zero exit status. It rejects common credential-like input
patterns and does not copy environment variables into board records.

## Trigger points and handoff boundaries

- A state change (including moving work to Ready) only updates local board and
  audit files. **It does not start, notify, or delegate to Copilot agents.**
- A coordinator/user must explicitly provide or return the QA/review/agent
  result. The responsible actor then claims the ticket and records the result,
  finding, static pass, or approval using the CLI. An audit entry alone is not
  a handoff or notification.
- Record static-check evidence before moving a ticket to Verification. QA and
  review are separate approvals after Verification, and both are required for
  Done.

## Existing checkout audit demo

The pre-existing `npm test` / `npm run smoke` workflow still runs
`audit-runner.js` against `checkout.js` and appends its report to the same
`logs/audit.jsonl`. Its intentional bug is preserved: `taxPercent` is 20 rather
than the expected 10, so the checkout audit currently reports a mismatch and
exits non-zero. Use `npm run test:board` for the Kanban automated tests; do not
interpret the intentionally failing checkout audit as a board test failure.
The separate `npm run audit:handoff -- <runId>` records receipt of an existing
mismatch report and does not trigger a fix.
