---
id: PETCMP-007
title: Let operations void mistakenly raised goods receipts
project: dropee_enterprise
status: done
opened: 2026-09-14
closed: 2026-09-15
---

## Title
Let operations void mistakenly raised goods receipts

## Status
Done — 2026-09-15.

## Problem Statement
Warehouse staff raise a goods receipt when a parcel arrives, before its contents are
counted. When the count finds items short or damaged they raise a corrected receipt,
and the balance follows as a later delivery. The first receipt then counts twice
over, so a fully delivered order reports as over-received and nobody could correct
it. Finance and operations could not see the receipts at all, since only one team
had access.

## User Story
As an operations controller, I need to void a goods receipt that was raised before
the goods were counted, so that the delivery record matches what the supplier
actually sent.

## Acceptance Criteria
- Operations can void a goods receipt and give a reason from a fixed list.
- A voided receipt stops counting towards the delivery total, and every later
  receipt on that order is recounted without it.
- A voided receipt stays visible with its documents, so the correction can be
  audited rather than disappearing.
- Voiding is reversible.
- Voiding a receipt affects only the supplier it was voided for, leaving it
  standing for others whose goods share the document.
- Management, finance and operations can all see and act on goods receipts.
- Each supplier sees their own delivery standing on an order, independently of
  other suppliers on it.

## Changes
| File | Change |
|---|---|
| `app/Models/GrnReceiptCancellation.php` | A receipt voided for one supplier, with a reason code and an audit trail |
| `app/Http/Controllers/Grn/GrnReceiptCancellationController.php` | Void a receipt and lift a voiding; verify the receipt belongs to the supplier by the goods it carries |
| `app/Http/Controllers/Grn/GrnDriveDocumentController.php` | Serve a receipt document to any supplier whose goods it carries, not only the one it was filed under |
| `app/Models/User.php` | Grant goods receipt access to management, finance and operations |
| `resources/views/components/fulfillment/grn_document_parse_section.blade.php` | Show each supplier's receipts, their running delivery total, and the standing of their order |
| `resources/views/components/fulfillment/order_detail_section.blade.php` | Open the goods receipt section to the three roles; retire the superseded sections |
| `routes/web_management.php` | Routes for voiding and reinstating a receipt |
| `database/migrations/2026_09_14_000000` | Record a voided receipt per supplier, reversibly |

## Notes
Voiding is recorded per supplier rather than per document. One receipt is routinely
shared by several suppliers, and voiding it for one must leave it standing for the
rest.

Cancelling was initially written as a single attribute change and silently did
nothing on a second attempt. Reinstating is now an explicit operation.
