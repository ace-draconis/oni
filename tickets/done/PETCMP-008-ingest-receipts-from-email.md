---
id: PETCMP-008
title: Ingest goods receipts from email without manual handling
project: dropee_enterprise
status: done
opened: 2026-09-10
closed: 2026-09-17
---

## Title
Ingest goods receipts from email without manual handling

## Status
Done — 2026-09-17.

## Problem Statement
Goods receipts arrive by email and were filed into the archive by hand, one at a
time, under a naming convention held in somebody's head. Filing lagged behind
arrival, so the delivery position was days out of date, and a receipt could sit
unrecorded until someone noticed. Suppliers could not find their own deliveries
unless whoever filed the document happened to name it after them.

## User Story
As a finance controller, I need each goods receipt recorded and filed the day it
arrives, so that the delivery position is current without anyone maintaining it.

## Acceptance Criteria
- Goods receipts arriving by email are recorded and filed without manual handling.
- A receipt already recorded is never recorded twice, however often it is sent.
- Each receipt is filed under a name stating its order, the purchase order and the
  supplier, taken from the document itself.
- A receipt covering several suppliers is filed once per supplier, each copy named
  for that supplier, matching how operations file them by hand.
- Each filed copy states which instalment it is and whether that instalment
  completed the supplier's order.
- The instalment stated is that supplier's own position, not the order's, so a
  supplier who has finished is not described as outstanding.
- The delivery position for an order is up to date as soon as its receipt arrives.

## Changes
| File | Change |
|---|---|
| `app/Console/Commands/Grn/IngestGrnEmailDocumentsCommand.php` | Read, record, file and reconcile each arriving receipt; file one named copy per supplier on it |
| `app/Services/Grn/GrnDeliveryLabel.php` | Work out which instalment a delivery is, per supplier, and whether it completed their order |
| `app/Models/GrnIngestLog.php` | Record every receipt taken in, so one is never taken in twice |
| `database/migrations/2026_09_10_000000` | The intake record |
| `config/services.php` | Where receipts arrive and where they are filed |

## Notes
Filing was first attributed to whichever supplier held the order's lowest internal
reference, which credited one supplier with everyone's deliveries. Attribution now
follows the goods on the document.

A delivery's instalment number is only correct when earlier instalments were taken
in first, which holds for receipts arriving in sequence. Historical receipts filed
out of order are not renamed.
