---
name: handoff
description: Produce a status or handoff report for other people — what shipped, what is blocked, what is next — published as a shareable Artifact page. Triggers on "status report", "handoff", "write an update", "summarise for the team", "what did we ship".
---

# Handoff

Written for someone who wasn't there. Different audience from a ticket: no
implementation detail unless it changes what the reader should do.

## Source

Real records only — `tickets/done/` in the period, open tickets with unchecked
criteria, relevant ADRs, project git log. Never a narrative assembled from memory.

## Structure

- **Shipped** — what's now working, in user-visible terms. Ticket ids in brackets.
- **In progress** — what's underway and honestly how far along
- **Blocked** — what's stuck, on whom or what. Never soften or omit this; it's the
  section the reader most needs.
- **Next** — what comes after, in priority order

State period and date. Facts, no adjectives. If something slipped, say it slipped.

## Publishing

This has an audience, so publish it — load the `artifact-design` skill, write the
file, call Artifact, hand Ace the link. A report that lives only in terminal
scrollback isn't delivered.

Keep a copy at `diary/handoffs/YYYY-MM-DD-<slug>.md` so it enters the record.
