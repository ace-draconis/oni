---
id: F3FMS-001
title: Migrate diary Excel export from PHPExcel to PhpSpreadsheet
project: f3-fms
status: done
opened: 2026-05-06
closed: 2026-05-06
---

## Problem
Diary wall export used PHPExcel, abandoned since 2017. Unmaintained, incompatible
with current PHP, and blocking any further work on export.

## User story
As a clerk, I need to export the monthly diary to Excel with formatting intact, so
that I can circulate and file it outside the system.

## Acceptance criteria
- [x] PHPExcel replaced with a maintained library
- [x] Existing `.xls` template still loads
- [x] HTML line breaks preserved inside cells
- [x] Category colour coding retained (cat=1 white, cat=3 black, default grey)
- [x] Styling: Calibri 11pt, no borders, single line spacing between entries
- [x] Dead PDF export path removed

## Changes
| File | Change |
|---|---|
| `app/Actions/DiaryExcelExportAction.php` | Rewritten on PhpSpreadsheet; added `cleanHTML()` |
| `Dockerfile` | Added `gd` and `zip` PHP extensions |
| `composer.json` | +phpoffice/phpspreadsheet 1.30.4 (7 packages, ~10MB vendor) |
| `app/Actions/DiaryPdfExportAction.php` | Deleted |
| `lib/tcpdf/` | Deleted |

## Notes
Lightweight alternatives evaluated and rejected — none load an `.xls` template *and*
support full styling. 10MB vendor footprint accepted as the cost.
Fix recorded: [[php-excel-export-with-template]].

Retrospective ticket — reconstructed from session-9 memory during the Oni migration,
not written live.
