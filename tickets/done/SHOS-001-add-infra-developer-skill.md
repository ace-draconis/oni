## Title
Add a developer skill for the shared local infra stack

## Status
Done — 2026-10-23.

## Problem Statement
Every Sentinel HOS app depends on one shared local stack of databases, caches, search nodes, queues and AWS emulators. Knowing which service each app needs, which version matches production, and how apps reach it lived only in a long audit document. New sessions repeated diagnoses that had already been made, such as broken service lists and memory limits. Without a skill, an AI session working on local setup started from nothing.

## User Story
As a developer bringing a Sentinel HOS app up locally, I need the shared stack's services, versions, ports and known pitfalls loaded on demand so that I wire the app correctly the first time.

## Acceptance Criteria
- A session can tell which shared service, version and database each app uses.
- A session knows how apps reach the stack (network name, service names, container ports) versus how host tools reach it (mapped ports).
- Known pitfalls are stated up front: memory sizing, the broken Cube Store image, the LocalStack alias clash, port collisions, MQTT protocol versions.
- The skill points to the dated setup audit as the source for per-app status.
- The skill loads with the always-on core profile and is listed in the workspace docs.

## Changes
| File | Change |
|---|---|
| `.claude/skills/infra-developer/SKILL.md` | New skill: service/version/port/consumer table, app wiring examples, conventions for adding services, operating commands, constraints. |
| `CLAUDE.md` | Listed `projects/infra/` under Workspace tools, noting it is committed in the workspace repo, not cloned. |
| `README.md` | Added `infra/` to the Workspace Structure tree under a Local dev group. |
| `scripts/claude-profiles/core.txt` | Added `infra-developer` so it loads in every profile. |

## Notes
Not registered in the review-mr, support-triage, create-rca or rca-create tables: the stack has no GitLab project of its own and is not a production system, so it never appears in a merge request or a support ticket.
