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

**One exception.** Work that is genuinely blocked and stays that way gets a ticket
while still open — otherwise nothing records that it is outstanding. Its Status
line says what it is blocked on and in whose hands it sits.

Don't ask permission to write one once work is done. Write it, mention it in one
line, move on.

## Filename

Match the project. Two patterns in use:

- `YYYY-MM-DD-kebab-slug.md` — dated by when the work happened. Preferred for a
  project folder; the date orders them and needs no bookkeeping.
- `[PROJ]-[NNN]-slug.md` — project prefix from the directory name, uppercased and
  shortened (`f3-fms` → `F3FMS`), next number = highest existing + 1. Use only
  where tickets need to be *cited* by id in conversation or commits.

## Filling it in

Use `templates/ticket.md`, unless the project's own tickets say otherwise.

- **Title** — one line, what the work achieves. Not the mechanism.
- **Status** — one line of prose: `Done — 2026-08-21.` or `Open. Blocked on the
  container image, which lives outside this repo.` The one thing a reader cannot
  reconstruct from anywhere else, and the reason a folder full of tickets is
  otherwise unsearchable for "what is outstanding".
- **Problem Statement** — the pain, in the words it would be searched for later.
  Never phrase the solution here.
- **User Story** — who needs it and why. If there is no human beneficiary, say so
  plainly rather than inventing a fake role.
- **Acceptance Criteria** — the end state, as flat statements. Observable, and
  true when the work is done: "A group whose members disagree on price publishes
  no benchmark." Not checkboxes — a checkbox describes work in progress; a
  ticket outlives that.
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

- Round and spell out numbers: "overstated by nearly forty thousand", not
  "overstated by 37,908".
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

A ticket nobody finishes reading records nothing. Aim for a screen — one to two
paragraphs of problem, one user story, five or six criteria.

- One paragraph of problem statement. Two only if the second is a genuinely
  separate cause.
- Lead with the consequence, then the cause. Cut the investigation narrative
  entirely — how it was found does not belong in the record.
- Give one exemplifying case, not four. The clearest one earns its place; the
  rest are padding.
- One criterion per outcome. If two criteria are always true or false together,
  they are one criterion.
- No section that restates another. If Notes repeats the problem statement, delete
  it.
- `## Changes` is exempt from the one-screen target. It is a working list, and an
  incomplete one costs a commit message later — one line per file touched, however
  many that is.

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
