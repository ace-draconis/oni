---
id: ONI-001
title: Load shared context across assistant sessions
project: oni
status: done
opened: 2026-10-08
closed: 2026-10-08
---

## Problem
Assistant sessions across repositories did not consistently receive shared guidance
and skills. Setting up another machine depended on manual, path-specific
configuration. Memory saves could include unrelated staged work or fail silently,
while one shared working-state file could be overwritten by another project.

## User story
As a developer working across repositories, I need consistent assistant guidance
and reliable project memory so that conventions and decisions remain available
wherever I work.

## Acceptance criteria
- [x] Claude Code and Copilot Agent Host load shared guidance and skills across project workspaces.
- [x] One repeatable installer preserves unrelated user settings and is safe to rerun.
- [x] Hook paths resolve from the installed repository rather than a fixed machine path.
- [x] Each project has its own live session state.
- [x] Persistence stages only Oni records and refuses to absorb unrelated staged changes.
- [x] Commit and push failures are reported instead of being hidden.
- [x] Plans track execution separately from tickets that record completed work.
- [x] Project notes no longer depend on machine-specific checkout paths.

## Changes
| File | Change |
|---|---|
| `install.py` | Added idempotent Claude Code and Copilot Agent Host user setup. |
| `README.md` | Documented supported harnesses, installation, and persistence boundaries. |
| `CLAUDE.md` | Defined per-project session state and the safe persistence contract. |
| `core/session.md` | Removed the global working-state file. |
| `core/stack.md` | Described the supported development environments without assuming one OS. |
| `hooks/session-start.sh` | Resolve the workspace project, load its state, and surface sync failures. |
| `hooks/auto-persist.sh` | Delegate end-of-turn persistence to the shared safe hook. |
| `hooks/session-end.sh` | Delegate final persistence to the shared safe hook. |
| `hooks/persist-records.sh` | Stage only memory records, protect pre-staged changes, and report failures. |
| `hooks/session-write.md` | Defined the project-specific session-state contract. |
| `sessions/oni.md` | Added the current project’s live state. |
| `templates/session.md` | Added a reusable project session-state template. |
| `templates/plan.md` | Added a reusable plan template. |
| `skills/plan/SKILL.md` | Separated plan execution state from the completed-work ticket. |
| `skills/library/SKILL.md` | Removed the fixed checkout path from library search guidance. |
| `skills/recall/SKILL.md` | Removed the fixed checkout path and included project session state in recall. |
| `projects/f3-fms.md` | Replaced machine-specific checkout paths with repository references. |
| `library/decisions/ADR-002-assistant-harness-adapters.md` | Recorded the shared-core, harness-specific adapter decision. |
| `plans/.gitkeep` | Initialized the central resumable-plans directory. |
| `tickets/open/.gitkeep` | Initialized the open-ticket directory used by startup lookup. |

## Notes
Copilot Agent Host loads global instructions and skills but does not execute Oni's
Claude Code lifecycle hooks. Claude Code runtime loading remains to be verified once
the seat is available.
