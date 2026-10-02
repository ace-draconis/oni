---
id: PETCMP-015
title: Invoice goods receipts for products ordered on several lines
project: dropee_enterprise
status: done
opened: 2026-09-25
---

## Title
Invoice goods receipts for products ordered on several lines

## Status
Done — 2026-09-25.

## Problem Statement
A goods receipt could not be invoiced when any product on it had been ordered on more than one line, even when the receipt delivered everything ordered. The per-delivery route that once covered this had been withdrawn, so these deliveries could not be invoiced at all. Separately, nothing stopped goods already billed by an older invoice from being billed again against their receipt.

## User Story
As a finance controller, I need to invoice every goods receipt, including those for products ordered on several lines, so that no delivery is left unbilled and none is billed twice.

## Acceptance Criteria
- A receipt that delivers everything still to invoice on a product's lines is invoiced without any extra step.
- A receipt that delivers part of it asks finance to confirm how it splits across the lines, with a suggested split.
- The split must add up to what the receipt accepted, and no line may take more than it has left to invoice.
- Each line records what its receipt allowed it, so the limit holds when the invoice is edited later.
- Goods already invoiced, by any earlier invoice, cannot be invoiced again from their receipt.
- A receipt that cannot be invoiced says why: no delivery raised yet, or nothing left to invoice.

## Changes
| File | Change |
|---|---|
| `app/Services/Grn/GrnInvoiceService.php` | `allocation()` works out how a receipt's goods fall across the supplier's order lines, capped at what has arrived and is not yet invoiced; a partial receipt on several lines takes finance's split; replaces the rule that refused any product on several lines |
| `app/Http/Controllers/Grn/GrnInvoiceController.php` | Accept the confirmed split with the chosen delivery |
| `resources/views/components/fulfillment/petronas/grn_document_parse_section.blade.php` | Invoice action states its reason in the order it must be resolved — no delivery, nothing left, split to confirm — and a dialog to confirm the split |

## Notes
Which order line a receipt settles only matters when the receipt is partial. Refusing every product on several lines blocked receipts that had delivered everything.

Invoices raised before receipts were tied to them do not say which receipt they billed. What can still be billed is therefore measured across every receipt for the product, not per receipt.
