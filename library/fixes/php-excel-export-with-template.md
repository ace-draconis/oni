---
name: php-excel-export-with-template
type: fix
tags: [php, excel, phpspreadsheet, export]
project: f3-fms
date: 2026-05-06
---

## Problem
Needed .xls export from an existing styled template. PHPExcel is abandoned (since
2017). Lighter libraries can't load a template *and* apply full styling.

## Solution
PhpSpreadsheet 1.30.4 via Composer. `IOFactory` to load `templates/diary.xls`,
`Writer\Xls` to write. Docker image needs the `gd` and `zip` PHP extensions.

Line breaks in cells: convert `<br>` to `\n` and call `setWrapText(true)` — either
alone does nothing.

    // case-insensitive br → newline, then decode entities, then strip tags
    $text = preg_replace('/<br\s*\/?>/i', "\n", $html);
    $text = html_entity_decode($text);
    $text = strip_tags($text);

## Why it works
PhpSpreadsheet is the only maintained library supporting both template loading and
full styling control. ~10MB vendor footprint is the cost of that combination.

## Watch out for
Legacy `.xls` needs `Writer\Xls`, not `Xlsx`. Lightweight alternatives (writer-only
libs) were evaluated and rejected — they cannot load templates.
