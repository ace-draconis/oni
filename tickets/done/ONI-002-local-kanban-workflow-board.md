---
id: ONI-002
title: Track workflow handoffs on a local Kanban board
project: oni
status: done
opened: 2026-10-08
closed: 2026-10-08
---

## Title
Track workflow handoffs on a local Kanban board

## Status
Done — 2026-10-08.

## Problem Statement
Work moving between implementation, static checks, QA and review could not be
tracked in one place. Findings lacked a consistent path into fix work, making
ownership and verification easy to lose between handoffs. The team needed a
repeatable way to see current work and retain evidence of decisions.

## User story
As a developer coordinating assistant-led work, I need visible workflow states
and recorded handoffs so that findings reach an owner and fixes return through
verification.

## Acceptance criteria
- [x] Work can be tracked from readiness through implementation, verification, requested changes and completion.
- [x] Verification requires static-check evidence for the current revision.
- [x] QA and code review can independently approve the same revision before completion.
- [x] A finding records reproduction, actual and expected results, root cause, proposed fix and rationale.
- [x] Each finding creates linked fix work assigned to Neon and returns its source work for changes.
- [x] The local browser view exposes current tickets, evidence and recent audit activity without external services.
- [x] Board state changes are explicitly separate from agent invocation and notification.

## Changes
| File | Change |
|---|---|
| `kanban/` | Moved the local workflow demo, its existing board state and audit history into Oni. |
| `kanban/board.js` | Enforced ticket lifecycle transitions, revision-specific static checks and approvals, linked findings and audit events. |
| `kanban/server.js` | Added a loopback-only read-only HTTP server for the board and latest audit events. |
| `kanban/public/` | Added a responsive browser view for workflow status, ticket evidence and recent activity. |
| `kanban/test/board.test.js` | Added lifecycle, finding linkage, audit preservation and transition validation tests. |
| `kanban/README.md` | Documented the CLI, browser view, workflow gates and explicit handoff boundaries. |
| `README.md` | Linked the Kanban demo from the Oni repository overview. |

## Notes
The web view is intentionally read-only. Ticket changes use the CLI, and Ready
work requires an explicit coordinator handoff; the board does not launch agents.
