---
id: PETCMP-006
title: Read goods receipt notes from their source documents
project: dropee_enterprise
status: done
opened: 2026-08-24
closed: 2026-09-17
---

## Title
Read goods receipt notes from their source documents

## Status
Done — 2026-09-17.

## Problem Statement
We could not say what had actually been delivered against an order. Goods receipt
notes existed only as scanned documents in staff members' personal drives, and the
one summary anyone maintained covered a tenth of them and was typed by hand. Half a
year of receipts was lost outright when the colleague who owned them left the
company, and nothing could be reconciled against what was ordered.

## User Story
As a finance controller, I need to know what each supplier actually delivered
against an order, so that I can settle invoices against goods received rather than
against what was promised.

## Acceptance Criteria
- Every goods receipt the company holds is readable as data, not only as a scan.
- Each receipt records its line items, quantities accepted and the supplier who
  supplied them, so a delivery can be checked line by line.
- Receipts are attributed to the supplier whose goods they carry, not to whoever
  filed the document.
- Every receipt is held in company-owned storage and survives any individual
  leaving.
- Every order reports, per supplier, what was ordered against what arrived.
- A delivery is reported as complete only when that supplier's own order is
  satisfied, independently of other suppliers on the same order.
- One receipt counts once, however many times the same document was filed.

## Changes
| File | Change |
|---|---|
| `app/Services/Grn/GrnPdfParserService.php` | Read receipt headers and line items from the scanned documents; accept lines whose description runs into the quantity without a separator |
| `app/Services/Grn/GrnDriveArchiveService.php` | File a receipt into the company archive by intake date, and rename one already filed |
| `app/Services/Grn/GrnCompanyOrderResolver.php` | Attribute a receipt to suppliers by the goods it carries; resolve every supplier on a consolidated receipt |
| `app/Services/Grn/GrnFulfilmentReconciler.php` | Reconcile ordered against received per supplier, for one order or the whole corpus |
| `app/Services/Grn/GrnFulfilmentStatus.php` | Roll the per-product reconciliation up to one standing per supplier |
| `app/Models/GrnDocumentParse.php`, `app/Models/GrnDocumentParseLine.php` | The reading of a receipt and its lines |
| `app/Models/GrnDriveDocument.php`, `app/Models/GrnFulfilmentCheck.php` | The archived document and its reconciliation row |
| `app/Console/Commands/Sheets/IndexGrnDriveDocumentsCommand.php` | Index archived documents against their orders without downloading them |
| `app/Console/Commands/Grn/ParseGrnDocumentsCommand.php`, `app/Jobs/ParseGrnDocumentsBatch.php` | Read documents in batches; retire a second reading of a receipt already read |
| `app/Console/Commands/Grn/MigrateGrnArchiveFolderCommand.php`, `app/Jobs/MigrateGrnArchiveBatch.php` | Move historical receipts into company-owned storage |
| `app/Console/Commands/Grn/ConsolidateGrnArchiveFoldersCommand.php` | Merge duplicate archive folders created by concurrent migration |
| `app/Console/Commands/Grn/RenameGrnArchiveFilesCommand.php` | Bring historical filenames onto the naming convention |
| `app/Console/Commands/Grn/CheckGrnFulfilmentCommand.php` | Rebuild the reconciliation across every order |
| `database/migrations/2026_09_09_000002..000005`, `2026_09_10_000003` | Receipt readings, their supplier fields, and their link to orders |
| `database/migrations/2026_08_24_000004`, `2026_09_09_000001`, `2026_09_11_000002` | Archived documents, their order mapping, and their link to the source they were copied from |
| `database/migrations/2026_09_11_000000` | Per-supplier reconciliation of ordered against received |
| `database/migrations/2026_09_10_000001`, `2026_09_10_000002`, `2026_09_15_000000`, `2026_09_15_000001` | Retire duplicate readings so one delivery is counted once |
| `database/migrations/2026_09_14_000001` | Point every reading at the company-owned copy of its document |
| `database/migrations/2026_09_14_000002` | Remove per-receipt completion fields that could not describe a shared document |
| `database/migrations/2026_09_17_000000` | Drop the tables fed by the hand-maintained summary, now superseded |
| `composer.json`, `composer.lock` | Add the PDF reader |

## Notes
Reading the documents directly was measured against sending them to an AI service:
the documents follow one template, and a deterministic reader matched it exactly at
no cost per document.

Completion was first recorded against each receipt. A single receipt routinely
covers several suppliers, so one document cannot carry one completion state — it is
now derived per supplier at the point of display.
