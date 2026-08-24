---
name: ticket
description: Record COMPLETED work as a ticket — problem statement, user story, acceptance criteria, changed files. Use PROACTIVELY once a substantive change is finished and verified; NOT while it is still being explored, measured, or argued about, since a ticket records the change that shipped rather than the search for it. Also triggers on "write a ticket", "log this", "what am I working on", "open tickets", and on work becoming blocked.
---

# Ticket

Work becomes a record automatically. This replaces prose session diaries — the unit
of history is a ticket, not a journal entry.

## Where it goes

**Look for the project's own ticket folder first.** `docs/tickets/`, `tickets/`,
`.tickets/` — if one exists with tickets in it, write there and match what is
already there. A ticket belongs beside the code it describes, where the next
person to open the repo will find it.

Fall back to `oni/tickets/open|done/` only when the project has no folder of its
own. Those two directories are also read by the `recall`, `plan`, `deck` and
`handoff` skills, so keep using them for cross-project work.

**Adopt the house format on sight.** Before writing the first ticket in an
unfamiliar project, read the two or three most recent ones and copy their
headings, filename pattern, and register. Existing convention beats the template
below every time. Check whether the folder is gitignored — if it is, the tickets
are a local record and must not be referenced from committed docs as though
everyone can see them.

## When to write one

**After the work is finished and proven, not while it is being explored.** A ticket
records the change that shipped — not the search that found it.

Aniki's rule, and it is the right one: development completes first, then the
ticket. Writing one at the start bakes the first hypothesis into the acceptance
criteria, and the first hypothesis is routinely wrong. A gate written as "withhold
a benchmark when any member disagrees on price" was measured, found to silence
thousands of groups over a single listing, and replaced by "when a quarter of them
disagree". Opened early, the ticket would have recorded the discarded rule as the
requirement and needed rewriting anyway.

So: no ticket for R&D, spikes, threshold tuning, measurement runs, or anything
still being argued about. Those are worth doing and worth discussing — they are
not worth recording as work.

Write it when:
- the change is complete and verified, and
- the numbers in it will not move again.

Substantive means a bug fixed, a feature built, a migration, a refactor with a
goal. Not: answering a question, reading code, a one-line tweak.

**Development only.** A ticket records a change to this codebase. Deployment,
container configuration, cron entries, infrastructure and anything else living in
another repository do not get tickets here, however much they matter — raise them
in conversation and let Aniki route them.

**One exception.** Development work that is genuinely blocked, and stays that way,
gets a ticket while still open — otherwise nothing records that it is outstanding.
Its Status line says what it is blocked on. Blocked on something outside the
codebase is not this case; there is no development work to record.

Don't ask permission to write one once work is done. Write it, mention it in one
line, move on.

## Filename

Match the project. Two patterns in use:

- `YYYY-MM-DD-kebab-slug.md` — dated by when the work happened. Preferred for a
  project folder; the date orders them and needs no bookkeeping.
- `[PROJ]-[NNN]-slug.md` — project prefix from the directory name, uppercased and
  shortened (`f3-fms` → `F3FMS`), next number = highest existing + 1. Use only
  where tickets need to be *cited* by id in conversation or commits.

## Who reads this

**Management, not engineers.** Most readers have no access to the platform and will
never see the screens involved. They are approving work and tracking whether it
paid off — they are reading Objectives and an Action Plan, written as if the work
has not started.

That rules out most of what is tempting to write:

- **Never describe the interface.** No cards, widgets, tiles, columns, filters,
  labels, positions, layouts, or what a screen looked like before. A reader who
  cannot open the screen learns nothing from it, and a reader who can does not
  need it.
- **Never describe the code.** No classes, jobs, queries, migrations, or how it
  works. That belongs in `## Changes` and in the commit.
- **Never narrate the fault as a story about wrong naming, wrong display, or
  inaccurate figures.** State what the business could not do as a result.
- **Never say "we changed X to Y".** Say what becomes possible.
- **Never present the diagnosis.** No counts of affected rows, no named products or
  groups, no sampled cases, no before-and-after measurements. Those prove the
  problem was real; they do not explain what the business needed. State the
  principle and let the commit carry the proof.

Write instead about:

- **What decision could not be made, or what work could not be assigned**, because
  something was missing or untrustworthy.
- **What data is missing and needs to exist** — and *why that data matters*. This is
  usually the real content of the ticket. "Every unpriced product records which
  fault caused it" is an objective; "the reason is now shown on the row" is not.
- **Who is affected and what it costs them** — buyers, suppliers, category
  managers, the platform.
- **What becomes measurable.** A figure that was unknowable and is now reportable
  is a result management cares about.

The test: read the Problem Statement aloud to someone who has never opened the
platform. If they cannot say what the business was losing, rewrite it.

## Filling it in

Use `templates/ticket.md`, unless the project's own tickets say otherwise.

- **Title** — a name for the work, not a summary of it. Under about sixty
  characters, one clause, no comma joining two halves. Verb first where there is
  one: "Withhold price verdicts we cannot defend", "Run the nightly maintenance
  jobs". If it needs "and" to hold two ideas, either the second belongs in the
  criteria or it is two tickets. Not the mechanism, and not the problem restated
  — the Problem Statement is directly below it and does not want saying twice.
- **Status** — one line of prose: `Done — 2026-08-21.` or `Open. Blocked on the
  container image, which lives outside this repo.` The one thing a reader cannot
  reconstruct from anywhere else, and the reason a folder full of tickets is
  otherwise unsearchable for "what is outstanding".
- **Problem Statement** — framed as what the business cannot
  currently do and what that costs. Lead with the consequence to the business,
  then the cause in one clause. Never phrase the solution here, and never
  describe the screen or the code.

  Before: "Two summary cards used the same words for different things, so their
  figures could not be reconciled."
  After: "We could not say how much of the catalogue we are unable to price, or
  why — so the largest gaps could not be sized or assigned to anyone."

- **User Story** — who needs it and why. If there is no human beneficiary, say so
  plainly rather than inventing a fake role.
- **Acceptance Criteria** — flat statements of the end state.
  Each one a capability or a guarantee the business gains, observable without
  opening the platform. Not checkboxes — a checkbox describes work in progress;
  a ticket outlives that.

  Before: "Every tile drills through to exactly the listings it counted."
  After: "Every reported figure can be opened to the exact products behind it, so
  a number can be challenged and checked."

  Where the work adds data, say what the data enables, not that it is displayed:
  "Each unpriced product carries the reason it cannot be priced, so the fault can
  be routed to the team that owns it."
- **Changes** — file path and, per file, what changed and why. Built from the
  commits that shipped the work, so it lists only files whose changes survived —
  not the ones touched while exploring, reverted, or reformatted by accident.

  Its job is to carry the *why* into Bitbucket, which is the one thing
  `git log --stat` cannot supply: git knows which files changed, only the ticket
  knows what the change was for. Write each line as the sentence you would want
  in the commit body:

  | File | Change |
  |---|---|
  | `app/Actions/RecalculateGroupPriceBenchmarksAction.php` | Withhold a group's benchmark when a quarter of its members disagree on price; blame no member when all of them do |
  | `database/migrations/..._repair_orphaned_uncommon_reasons.php` | Repair rows where the exclusion flag and its reason disagreed — two populations, opposite fixes |

  Where the work is already committed locally, take the paths from
  `git log --stat` for the relevant commits and supply the reasons yourself —
  git has the paths, not the intent. Where it is not yet pushed, this is what the
  commit message is written from.

- **Notes** — only when there is something a reader would otherwise redo: an
  alternative measured and rejected, a decision whose reason is not obvious, an
  open question now answered. Omit the heading entirely if there is nothing.
  Link ADRs as `[[adr-slug]]`.

## Register — plain business English

Write it so someone who has never read the schema understands it. This is what
makes a ticket still readable in six months, when column names have moved.

- **State the principle, not the evidence.** The ticket says what must be true and
  why it matters. It does not prove it. Measurements, counts, sampled products,
  named groups and worked examples are how the problem was diagnosed — they belong
  in the commit, in code comments, and in `## Notes` only where a reader would
  otherwise repeat rejected work.

  Before: "Nearly sixty thousand groups were wide enough for this to bite, and in
  one soft-drink family four prices from three marketplaces covering a
  seven-ringgit range were marked down purely by position, the two ends missing
  agreement with each other by six sen."
  After: "Genuine market prices were being discarded for disagreeing with each
  other when they were all reasonable, so benchmarks rested on less evidence than
  we had actually collected."

- Use a figure only where the figure IS the objective — a target, a limit, a
  service level. "A full refresh completes within the hour" is an objective. "This
  affected sixty thousand groups" is evidence.
- Where a figure is genuinely needed, prefer a proportion: "roughly half the
  catalogue" lands where "ninety thousand listings" does not.
- Name things as the business does: "a listing", "a price group", "the acceptable
  ceiling" — not `raw_products`, `price_signature_id`, `group_max_acceptable_price`.
- No file paths, no class names, no commit hashes, no SQL — **except in
  `## Changes`**, which is addressed to whoever writes the commit, not to a
  future reader of the ticket. Paths and class names belong there and nowhere
  else.
- Describe consequences, not implementations: "the export produced blank price
  columns across the whole file" beats "a column-constrained eager load defeated
  the accessor".

Exact figures and identifiers belong in the commit message and in code comments,
where they sit next to the thing they describe.

## Keep it short

Summary style. A manager should get it in under a minute.

**Hard limits:**
- Problem Statement: **three or four sentences.** Not a paragraph that runs a
  screen.
- Each acceptance criterion: **one line, one sentence.** If it wraps past two
  lines, it is doing two jobs.
- Acceptance criteria: **five to eight.** More than that and the ticket is two.
- Notes: **two sentences per point.** Delete the section if empty.

**No worked examples.** Not one, not the clearest one — none. A specific product,
group, price or before-and-after figure used to illustrate a fault is diagnosis, and
a reader who cannot look it up learns nothing from it.

**Write it tighter:**
- One idea per sentence. Full stop, next sentence.
- Cut every "so that", "which means", "because of this" that opens a second
  clause explaining the first. State the fact; the reader connects it.
- Cut hedges and intensifiers: quietly, genuinely, effectively, actually,
  substantial, far, merely, exactly.
- Cut the second example, the restatement, and the aside in dashes.
- No sentence explaining why the previous sentence matters. If it needs
  defending, it is the wrong sentence.

Before: "Worse, the largest single category lumped together products merely
waiting for better market data with products deliberately withheld because we do
not trust our own figure for them. Those need opposite responses — one wants
patience, the other wants someone to correct our data — and no report separated
them."

After: "Products awaiting market data were counted together with products we
withheld deliberately. The two need opposite action."

When a piece of work will not fit that shape, it is more than one ticket. Split it
by who fixes what, not by how much was typed.

## Lifecycle

Most tickets are written already `Done`, because the work finished before the
ticket started. That is correct, not a shortcut.

A ticket opened for blocked work stays open until the blocker clears, then its
Status line is updated.

In `oni/tickets/`, also `git mv` the file from `open/` to `done/`, since the other
skills read those folders. In a project folder, the Status line is the whole
mechanism — do not invent directories the project does not already use.

Never mark a ticket done while a criterion is unmet. If work is abandoned, say so
in Status and leave it open.

A criterion that was tried and rejected is not an unmet criterion — it was never a
criterion. It belongs in Notes, if anywhere.

## Answering "what am I working on"

Read the ticket folder for the current project — its own first, then
`oni/tickets/open/`. Report title and the criteria not yet met. That is the
answer, not a guess from conversation history.

If a project's tickets carry no status, say so rather than guessing which are
open — and offer to add the line.
