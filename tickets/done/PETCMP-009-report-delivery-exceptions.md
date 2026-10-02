---
id: PETCMP-009
title: Report unresolved delivery exceptions to operations daily
project: dropee_enterprise
status: done
opened: 2026-09-17
closed: 2026-09-17
---

## Title
Report unresolved delivery exceptions to operations daily

## Status
Done — 2026-09-17.

## Problem Statement
Nobody could see which deliveries needed chasing. Discrepancies between what was
ordered and what arrived were visible one order at a time, so finding them meant
opening orders at random, and a supplier who delivered short on a closed order was
never chased at all. The work could not be shared out because there was no list.

## User Story
As an operations controller, I need a current list of deliveries that do not
reconcile, so that I can assign each one and track it to closure.

## Acceptance Criteria
- Operations receive a daily list of deliveries that do not reconcile, in the
  system they already work in.
- Each case appears once, identified by the receipt and the product it concerns.
- A case states whether too much arrived, too little arrived on an order now
  closed, or the document contradicts the order it was filed against.
- Deliveries still legitimately in progress are excluded, so the list is work to do
  rather than a status report.
- A case that is resolved leaves the list on the next run.
- Notes added by operations survive each refresh and stay with their case.

## Changes
| File | Change |
|---|---|
| `app/Console/Commands/Grn/ReportGrnIssuesCommand.php` | Publish unresolved delivery exceptions to the operations sheet, one case per row, preserving their notes |
| `app/Console/Commands/Grn/GrnDataIssuesCommand.php` | List misfiled, unreadable and contradictory receipts for investigation |
| `config/services.php` | Where the report is published |

## Notes
Deliveries awaiting their balance were reported at first and made up a third of the
list. An order still open is a delivery in progress, not an exception, and reporting
it buried the cases needing action.

The list is rewritten on each run rather than added to, so it always reflects the
current position.
