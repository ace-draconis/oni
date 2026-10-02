---
id: PETCMP-014
title: Keep the new receipt and invoice rules to Petronas
project: dropee_enterprise
status: done
opened: 2026-09-25
---

## Title
Keep the new receipt and invoice rules to Petronas

## Status
Done — 2026-09-25.

## Problem Statement
The goods receipt and invoicing changes built for Petronas also reached the other clients' platforms, which share its screens. Those clients would have lost the final-invoice step they rely on and gained rules they never asked for, without being consulted.

## User Story
As the platform owner, I need the new receipt and invoice rules to apply only to Petronas, so that other clients keep the invoicing they signed off on.

## Acceptance Criteria
- Petronas has the goods receipt section, per-receipt invoicing and the invoice trial balance; other clients do not.
- Other clients keep marking an invoice as final, and the steps that follow from it.
- Invoice quantity limits, one invoice per delivery, and withdrawing a document with its invoice apply to Petronas only.
- Every client keeps the order change history.
- Clients that inherit Petronas' screens do not pick up its versions by inheritance.

## Changes
| File | Change |
|---|---|
| `resources/views/theme_ccs/…`, `resources/views/theme_shell/…` (invoice screen, supplier invoice partials, delivery history) | Returned to their state before the receipt work; only the order history remains |
| `resources/views/components/fulfillment/order_detail_section.blade.php` | Returned to its state before the receipt work, serving every other client |
| `resources/views/components/fulfillment/petronas/` | Petronas' own order section and goods receipt section, under names no other client resolves |
| `resources/views/theme_petronas/management/order/order_detail.blade.php` | Use Petronas' own order section |
| `app/Http/Controllers/MgmtOrderController.php` | `usesPetronasInvoicing()` gates the duplicate-invoice guard, document withdrawal and quantity limits; the final-invoice save is restored for other clients |
| `app/Models/OrderInvoice.php` | Final-invoice flag writable again for the clients that use it |
| `routes/web_management.php` | Final-invoice route restored |

## Notes
Other clients inherit Petronas' screens wherever they have no copy of their own. Petronas' versions therefore carry their own names rather than overriding a shared screen.

Two fixes apply to every client: an empty shipping value no longer fails the save, and the invoice screen loads each invoice's lines once. Both leave behaviour unchanged apart from removing a failure.
