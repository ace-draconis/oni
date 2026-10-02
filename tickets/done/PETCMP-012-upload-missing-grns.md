---
id: PETCMP-012
title: Take in goods receipts that never arrived by email
project: dropee_enterprise
status: done
opened: 2026-09-25
---

## Title
Take in goods receipts that never arrived by email

## Status
Done — 2026-09-25. Verified against a stand-in drive; the first live upload to the shared drive is still to be made.

## Problem Statement
A goods receipt that missed the mailbox never entered the automatic flow. Its delivery could not be confirmed, reconciled or invoiced, and there was no route to add it short of the email arriving. Operations had the document in hand and nowhere to put it.

## User Story
As an operations or finance user, I need to add a goods receipt by hand when its email never came, so that the delivery it records can be confirmed and invoiced like any other.

## Acceptance Criteria
- A goods receipt can be added from its order by uploading the document.
- An uploaded receipt is read, named and filed in the shared drive exactly as an emailed one is.
- A receipt for a different order, or for a supplier it does not deliver, is refused before anything is filed.
- A document that cannot be read as a goods receipt is refused with the reason, and nothing is filed.
- A receipt already on file is not filed a second time.
- Every receipt records whether it arrived by email or by upload, and who uploaded it.
- An uploaded receipt updates the order's delivery standing the moment it is filed.

## Changes
| File | Change |
|---|---|
| `app/Services/Grn/GrnDocumentIngestService.php` | Carry one receipt from arrival to filed — read, name, file, store, rename with its delivery label, copy per supplier, reconcile — shared by email and upload so both file identically |
| `app/Console/Commands/Grn/IngestGrnEmailDocumentsCommand.php` | Hand each emailed document to the shared ingest instead of owning the filing steps; logs its source as email |
| `app/Services/Grn/GrnDriveArchiveService.php` | Add `upload()` for documents not already on Drive, and `fromConfig()` so the drive connection is built in one place |
| `app/Actions/Grn/UploadGrnDocumentAction.php` | Refuse unreadable, wrong-order, wrong-supplier and already-filed documents before filing; ingest and log the rest |
| `app/Exceptions/GrnUploadRejectedException.php` | Each refusal as a named reason, shown to the uploader with nothing filed |
| `app/Http/Requests/UploadGrnDocumentRequest.php` | One PDF, 20 MB at most; open to whoever may work the goods receipt section |
| `app/Http/Controllers/Grn/GrnDocumentUploadController.php` | Accept an upload for a supplier order and pass it to the action |
| `app/Providers/AppServiceProvider.php` | Bind the drive archive, so it can be substituted in tests without touching the real drive |
| `app/Models/GrnIngestLog.php` | Record how a receipt arrived and who uploaded it |
| `database/migrations/2026_09_25_000100_record_how_grn_documents_arrived.php` | Add arrival source and uploader to the intake log; existing rows are marked as email |
| `routes/web_management.php` | Route the upload beside the other goods receipt actions |
| `resources/views/components/fulfillment/petronas/grn_document_parse_section.blade.php` | Upload action and dialog on the goods receipt section |

## Notes
Uploads are refused rather than filed and flagged, unlike email. The uploader can correct the cause, whereas a stray file in the shared drive has to be found and removed by someone else.

Per-supplier copies are now copied from our own archived copy rather than the email source. The contents are identical, and it is the only source an upload has.

The order page is open only to users who hold the Management role, so finance and operations staff without it cannot reach this action. That is a platform access decision outside this work.
