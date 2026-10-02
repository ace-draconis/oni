---
id: PETCMP-013
title: Let each domain choose its goods receipt flow
project: dropee_enterprise
status: done
opened: 2026-09-25
---

## Title
Let each domain choose its goods receipt flow

## Status
Done — 2026-09-25.

## Problem Statement
The automatic goods receipt flow replaced the manual upload outright. A domain could not keep working the old way while the new flow was proven, and going live meant switching every user at once with no way back short of a release.

## User Story
As a platform administrator, I need to choose per domain whether goods receipts are read automatically or uploaded by hand, so that the new flow can be switched on when a domain is ready and off again if it is not.

## Acceptance Criteria
- Each Petronas domain chooses between the automatic goods receipt flow and the manual upload.
- A domain that has never made the choice keeps the manual upload.
- With the automatic flow off, its actions are refused, including from a page opened before the switch.
- The choice is offered only on domains that have the automatic flow.
- Documents keep being read in the background either way, so switching on shows them straight away.

## Changes
| File | Change |
|---|---|
| `Modules/Domain/Entities/Domain.php` | Add the Auto GRN Flow setting, defaulting to the manual upload, and admit it through the settings whitelist |
| `Modules/Domain/Http/Controllers/DomainController.php` | Save the setting with the domain's other settings |
| `Modules/Domain/Resources/views/theme_vanilla/management/_settings_fulfillment.blade.php` | Offer the choice under Fulfillment, on Petronas domains only |
| `app/helpers.php` | `autoGrnFlowEnabled()` — one answer for whether the current domain runs the automatic flow |
| `resources/views/components/fulfillment/petronas/order_detail_section.blade.php` | Show the automatic goods receipt section or the manual upload according to the setting |
| `app/Http/Controllers/Grn/GrnInvoiceController.php` | Refuse invoicing a receipt when the automatic flow is off |
| `app/Http/Controllers/Grn/GrnReceiptCancellationController.php` | Refuse cancelling or restoring a receipt when the automatic flow is off |

## Notes
The default is the manual upload, so a release changes nothing for users until someone switches a domain on. The switch governs goods receipts only; the invoice rules apply either way.
