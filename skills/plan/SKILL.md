---
name: plan
description: Turn a plan into tracked, resumable execution with per-step commits. Use when a plan is approved or written, when work spans many steps, or on "start the plan", "resume", "continue the plan", "where were we", "pick up where we left off". Survives context loss and machine switches.
---

# Plan

Multi-step work that survives losing context.

## Creating

On an approved plan, write `tickets/open/[PROJ]-[NNN]-<slug>.md` from
`templates/ticket.md`, with each step as an acceptance-criteria checkbox. The ticket
*is* the plan — one artifact, not two.

Steps must be independently verifiable. "Migrate export to PhpSpreadsheet" is a plan;
"Add GD and zip extensions to Dockerfile" is a step.

## Executing

One step at a time, in order. After each:

1. Tick the checkbox in the ticket
2. Add touched files to the Changes table
3. Commit the *project* repo with the ticket id: `[F3FMS-014] add GD and zip extensions`

The commit prefix is what ties code history to the reasoning. Always include it.

## Resuming

On "resume" or "where were we": read the ticket, find the first unticked box, state
it, continue from there. Don't re-verify completed steps unless something suggests
they broke.

This works after a crash, a context wipe, or a machine switch, because state lives
in the ticket file rather than in conversation.

## Deviating

When execution reveals a step is wrong, say so, propose the correction, amend the
ticket. Don't silently do something other than what's written — the ticket is the
shared record.
