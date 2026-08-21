---
name: ticket
description: Record work as a ticket with problem statement, user story, acceptance criteria, and changed files. Use PROACTIVELY whenever a substantive piece of work begins, completes, or changes state — do not wait to be asked. Also triggers on "write a ticket", "log this", "what am I working on", "close the ticket", "open tickets".
---

# Ticket

Work becomes a record automatically. This replaces prose session diaries — the unit
of history is a ticket, not a journal entry.

## When to open one

Proactively, at the moment substantive work starts. Substantive means: a bug being
fixed, a feature being built, a migration, a refactor with a goal. Not: answering a
question, reading code, a one-line tweak.

Don't ask permission. Open it, mention it in one line, keep working.

## Numbering

`[PROJ]-[NNN]` — project prefix from the directory name, uppercased and shortened
(`f3-fms` → `F3FMS`). Next number = highest existing for that prefix + 1, across
both `tickets/open/` and `tickets/done/`.

Filename: `tickets/open/F3FMS-014-pdf-export-route.md`

## Filling it in

Use `templates/ticket.md`.

- **Problem** — the pain, in the words it would be searched for later. Never phrase
  the solution here.
- **User story** — who needs it and why. If there's no human beneficiary, say so
  plainly rather than inventing a fake role.
- **Acceptance criteria** — observable and testable. "Line breaks preserved in
  exported cells", not "export works properly". Check them off as they land.
- **Changes** — file path and what changed, filled in as you go, not reconstructed
  at the end. Get paths from the actual edits made.

## Lifecycle

`open` → `in-progress` when work starts → `done` when every criterion is checked.
On done: set `closed:` and `git mv` the file to `tickets/done/`.

Never close a ticket with unchecked criteria. If work is abandoned, say so in Notes
and leave it open.

## Answering "what am I working on"

Read `tickets/open/`, filter by the current project, report title and unchecked
criteria. That's the answer — not a guess from conversation history.
