---
name: plan
description: Turn a plan into tracked, resumable execution with per-step commits. Use when a plan is approved or written, when work spans many steps, or on "start the plan", "resume", "continue the plan", "where were we", "pick up where we left off". Survives context loss and machine switches.
---

# Plan

Multi-step work that survives losing context.

## Creating

On an approved plan, write the plan file — steps, each independently verifiable,
ticked off as they land. This is a working checklist and it is expected to change
as the work teaches you something.

Do not open a ticket for a plan. A plan is a hypothesis; a ticket records what
shipped. Baking plan steps into acceptance criteria means recording the first
guess as the requirement, and the first guess is routinely wrong. When the plan
completes, write one ticket from what actually landed, which may differ from the
original plan.

Steps must be independently verifiable. "Migrate export to PhpSpreadsheet" is a plan;
"Add GD and zip extensions to Dockerfile" is a step.

## Executing

One step at a time, in order. After each:

1. Tick the checkbox in the plan.
2. Add touched files to the plan's Changes table.
3. Commit the project repo with the plan slug: `[plan:<slug>] add GD and zip extensions`.

The commit prefix is what ties code history to the reasoning. Always include it.

## Resuming

On "resume" or "where were we": read the relevant plan, find the first unticked
step, state it, and continue. Don't re-verify completed steps unless something
suggests they broke.

This works after a crash, a context wipe, or a machine switch, because state lives
in the plan file rather than in conversation.

## Deviating

When execution reveals a step is wrong, say so, propose the correction, and amend
the plan. Don't silently do something other than what's written — the plan is the
shared record.
