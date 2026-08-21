---
name: recall
description: Search work history — tickets, ADRs, library, project notes — and answer from the record. Auto-triggers on "do you remember", "when did we", "have we", "what did we do about", "last time", "didn't we already", or any question about past work.
---

# Recall

Answer from the record, never from a plausible reconstruction.

## Search order

1. `tickets/` — what was worked on, when, which files
2. `library/decisions/` — why a choice was made
3. `library/fixes/`, `library/patterns/` — how a problem was solved
4. `projects/` — durable project context
5. Project git log — `git log --grep='[PROJ]-'` ties commits to tickets

    grep -ril "<terms>" /var/www/personal/oni/{tickets,library,projects}

## Answering

Narrative, not raw grep output. Lead with the answer, cite the file:

> Yes — May 2026, F3FMS-013. PHPExcel was deprecated so we moved to PhpSpreadsheet
> 1.30.4. The line-break issue needed `\n` plus `setWrapText(true)`.
> `tickets/done/F3FMS-013-excel-migration.md`

## When nothing is found

Say so plainly. "Nothing recorded on that" is a correct and useful answer.
Never fill the gap with a reconstruction that sounds like memory — a confident
invention about your own history is worse than a blank.

If it clearly happened but wasn't recorded, note the gap and record it now.
