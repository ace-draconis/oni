---
name: prd
description: Write a Product Requirements Document before a feature is built — problem, goals, non-goals, scope, success metrics. Use PROACTIVELY when a feature or initiative is proposed and needs sign-off before development starts. Also triggers on "write a PRD", "spec this out", "what are we building", "scope this feature".
---

# PRD

A PRD records the *decision to build*, before anything is built. It is the mirror
image of a ticket: a ticket records what shipped after the fact; a PRD records
what was agreed to attempt, before the fact — written from intent, not from code.

## When to write one

Before development starts on anything with real scope: a new feature, a
user-facing change with trade-offs, an initiative spanning more than a couple of
tickets. Not for a one-line fix, a spike, or work whose shape is still being
explored — write `plan` for exploration, `prd` for a proposal ready to be agreed.

Write it when:
- the problem and the desired outcome are both clear, and
- stakeholders need to sign off on scope before engineering time is spent.

Skip it for internal refactors with no product-facing shape, and for anything
small enough that a ticket alone covers it.

## Where it goes

Look for a project's own PRD/docs folder first (`docs/prd/`, `product/`). Fall
back to `oni/tickets/open/` with a `PRD-` filename prefix, or a dedicated
`oni/prds/` folder if one exists, so it sits beside tickets and plans for the
same initiative.

## Who reads this

Stakeholders and engineers who did not have the conversation that produced it —
the same discipline as a ticket, but for something not yet true. Every claim is
a proposal, not a report: write "the app will let a user do X", not "the app
lets a user do X".

## Filling it in

Use `templates/prd.md`.

- **Problem** — what is broken or missing today, and what it costs, in plain
  business language. No solution here.
- **Goals** — the outcomes that count as success. Specific, falsifiable.
- **Non-goals** — explicitly what this does NOT attempt, so scope creep has
  something to point at later. Always include at least one — a PRD with no
  non-goals hasn't actually scoped anything.
- **Users / User stories** — who benefits and how, in "as a X, I need Y so that
  Z" form, same shape as a ticket's User Story.
- **Requirements** — flat, numbered, testable statements of behaviour. Not
  implementation detail — describe what the system must do, not how.
- **Success metrics** — how you'll know it worked, ideally measurable.
- **Open questions** — anything still unresolved that blocks a clean sign-off.
  Delete the section if there are none.

## Register — plain business English, same rules as a ticket

State the principle, not the evidence. No implementation detail, no file paths,
no class names, no screens described. If a stakeholder with no platform access
can't follow it, rewrite it. See `ticket` skill's "Register" section for the
full standard — it applies here identically.

## Keep it short

A PRD a stakeholder can read in five minutes, not fifty. Hard limits:
- Problem: three or four sentences.
- Goals: three to five, one line each.
- Non-goals: at least one, no more than five.
- Requirements: numbered, one behaviour per line, no more than the feature
  actually needs — if it runs past fifteen, the feature is probably two.

## Lifecycle

A PRD is a proposal until agreed. Once approved, it becomes the reference point
for the tickets that implement it — each resulting ticket may cite it
(`[[prd-slug]]`). It is not rewritten as work proceeds; if scope changes
materially, that's a new decision, recorded as an ADR referencing the PRD it
revises, not a silent edit to the original.
