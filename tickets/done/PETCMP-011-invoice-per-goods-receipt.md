---
id: PETCMP-011
title: Invoice each goods receipt once, for what it says arrived
project: dropee_enterprise
status: done
opened: 2026-09-22
---

## Title
Invoice each goods receipt once, for what it says arrived

## Status
Done — 2026-09-25.

## Problem Statement
Nothing ties an invoice to the delivery it bills for. Finance can invoice a
quantity nobody received, invoice the same goods twice, or declare an invoice
final and then raise another. Suppliers can be paid for goods that were rejected
on arrival, and no record connects what was paid to what the buyer confirmed
receiving.

## User Story
As a finance controller, I need each invoice to be tied to one goods receipt and
limited to what that receipt accepted, so that we pay for what arrived and can
show which delivery each payment settles.

## Acceptance Criteria
- An invoice is raised against a single goods receipt for a single supplier, and records both.
- That pairing carries at most one live invoice; a second cannot be raised until the first is withdrawn.
- An invoice raised from a goods receipt can never bill more than that receipt accepted, however it is edited afterwards.
- No invoice line may exceed what was ordered, what was received, or what other live invoices have left, so goods are not paid for twice.
- Raising an invoice requires choosing which delivery it belongs to, so the invoice, the receipt and the delivery agree.
- Every sent invoice has its document, rebuilt from exactly what was sent to the customer's system when it is missing.
- Asking for a document that is not ready yet starts preparing it rather than reporting it missing.
- A withdrawn invoice has no document, cannot be sent again, and cannot have its document produced again.
- Finance and the supplier can both retrieve the document of every live, sent invoice.

## Changes
| File | Change |
|---|---|
| `app/Services/Grn/GrnInvoiceService.php`, `app/Http/Controllers/Grn/GrnInvoiceController.php` | Raise an invoice from one receipt for one supplier, against a chosen delivery; refuse receipts whose goods cannot be allocated to one order line (Ent714-1 to 3) |
| `database/migrations/2026_09_23_000000_tie_invoices_to_goods_receipts.php` | Record the receipt and supplier order on each invoice |
| `app/Http/Controllers/MgmtOrderController.php` | One live invoice per delivery; quantity limits against the order, what was received, and what other invoices left; a withdrawn invoice's document removed and never re-sent |
| `resources/views/theme_petronas/supplier/_invoice_company_order_shipping.blade.php` and related invoice screen partials | One row per product for the invoice being edited, with the supplier order's trial balance (Ent714-4 to 15) |
| `app/Actions/Invoice/RequestInvoicePdfAction.php`, `app/Enums/InvoicePdfAvailability.php` | Answer a document request: ready, being prepared, or why not; queue one rebuild per invoice |
| `app/Jobs/GenerateHistoricalInvoicePdfFromCxmlJob.php` | Activate the invoice's theme before rendering; it had been rendering with the theme's name in place of the theme |
| `app/Http/Controllers/Fulfillment/SupplierFulfillmentController.php` | Supplier document download prepares a missing document instead of reporting it missing |
| `Modules/Punchout/Http/Controllers/InvoiceController.php` | The customer's system cannot fetch a withdrawn invoice's document |
| `app/Models/OrderInvoice.php` | `offersPdfDownload()`: every live, sent invoice offers its document |
| `database/migrations/2026_09_25_000200_record_what_the_goods_receipt_allowed_on_invoice_lines.php` | Each receipt-raised invoice line records what its receipt received and accepted, fixed when raised; existing lines filled from their receipt |
| `app/Models/OrderInvoiceProduct.php`, `app/Services/Grn/GrnInvoiceService.php` | Record those figures when an invoice is raised from a receipt |
| `resources/views/theme_petronas/supplier/_invoice_company_order_shipping.blade.php` | Hold received and accepted to the receipt's figures on the page, stating them under each box |
| `app/helpers.php` | `petronasInvoicingEnabled()` — one answer for whether Petronas' invoice rules apply |

## Notes
The goods receipt becomes the unit of invoicing. The delivery is still recorded,
because an invoice belongs to a shipment as well as to a receipt, and every
existing invoice reaches its supplier only through that link.

Accepted quantity is the limit, not delivered quantity. A quantity check already
exists but is written for another customer's configuration and never runs here;
it also compares against what was shipped rather than what was accepted.

Invoice documents are already produced and can be downloaded, but only one in
nine invoices has one - seventy-five thousand were sent to the customer with no
document kept. The material to rebuild them is retained, so this is recoverable
rather than lost, but only for invoices that were actually sent.

A goods receipt frequently covers several suppliers on one order - one here
covers nine - so the receipt alone does not identify an invoice. The pairing of
receipt and supplier does.

A receipt numbers its own lines from one, covering only what it delivered, so
those numbers diverge from the order's wherever a delivery is partial. The
invoice must carry the receipt's numbering, and has nowhere to record it: line
numbers are held on the order line, shared by every invoice raised against it,
so editing one invoice's numbering today changes every other invoice's too.

The flag marking an invoice as the last for a delivery is recorded and displayed
but governs nothing. Ten invoices carry it.

Two requirements changed during the work. The final-invoice flag was removed for Petronas rather than made to govern, and invoice lines carry the order's line number, which finance confirmed is the number they reconcile against.

A document is produced when an invoice is sent, not before. An unsent invoice is still a draft and has none.
