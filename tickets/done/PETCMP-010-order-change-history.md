---
id: PETCMP-010
title: Record who changed what on an order
project: dropee_enterprise
status: done
opened: 2026-09-18
closed: 2026-09-18
---

## Title
Record who changed what on an order

## Status
Done — 2026-09-18. Records changes made from now on; nothing reconstructs the past.

## Problem Statement
When an order went wrong nobody could say what had happened to it. A delivery date
moved, a quantity was cut, a goods receipt was voided and replaced — and answering
who did any of it meant asking people to remember. Disputes between buyer and
supplier could not be settled from the record, and neither side could see the other
acting on the same order.

## User Story
As a finance controller, I need to see every change made to an order and who made
it, so that a dispute can be settled from the record rather than from recollection.

## Acceptance Criteria
- Every change to an order, its suppliers' parts, its deliveries, its documents and
  its invoices is recorded with who made it and when.
- Documents added, replaced and voided are recorded, including the reason given for
  voiding.
- The record shows which side acted, so a goods receipt raised by our own team is
  distinguishable from proof of delivery supplied by the vendor.
- The record covers an order's whole life, not a recent window.
- A supplier sees the history of their own part of an order and nothing else.
- Management can narrow an order's history to one supplier or one kind of change.
- The record stands alone: it stays readable after the documents it describes are
  removed.

## Changes
| File | Change |
|---|---|
| `database/migrations/2026_09_18_000000_create_order_audits_table.php` | Hold one row per field changed, scoped to both the order and the supplier's part of it |
| `app/Models/OrderAudit.php` | Decide which fields are worth recording, and name them, their sources and their values as the business does |
| `app/Observers/OrderAuditObserver.php` | Capture creates, updates and deletes across every model an order touches, resolving each back to its order and supplier |
| `app/Providers/AppServiceProvider.php` | Observe the order, supplier order, line, delivery, document and invoice models |
| `app/Http/Controllers/MgmtOrderController.php` | Supply an order's full history with the filters it actually has |
| `app/Http/Controllers/SupplierController.php` | Supply one supplier's own history, scoped so buyer-side and other suppliers' activity cannot reach it |
| `resources/views/management/order/_audit_history.blade.php` | Present the history, dropping the supplier column where every row belongs to one supplier |
| `resources/views/theme_*/management/order/order_detail.blade.php` | Show the history on the order page across all five themes |
| `resources/views/theme_*/supplier/company_order.blade.php` | Show the supplier their own history across all five themes |

## Notes
Scoped to the supplier's part of an order rather than the order alone. Order-level
changes such as payment carry no supplier, so a supplier's view excludes them by
construction rather than by a list of fields somebody has to keep in step.

The acting role is stored when the change happens rather than read back from the
user later, because roles change and the distinction between our own team and the
supplier is the point.

Fields are recorded from a fixed list. Delivery records carry dozens of courier API
and synchronisation columns that change constantly, and recording them would bury
the handful of events a person looks for.
