---
id: PETCMP-005
title: Show the enrichment record to management
project: dropee_enterprise
status: done
opened: 2026-08-18
closed: 2026-08-19
---

## Title
Show the enrichment record to management

## Status
Done — 2026-08-19.

## Problem Statement
When a product scored badly on naming quality, nobody could tell why, so the score
could not be acted on or challenged. What the price service believes a product to be
was held but never shown. Part of that record had also stopped being maintained,
leaving fields that looked authoritative but were no longer supplied.

## User Story
As a category manager, I need to see what the price service believes a product is,
so that I can act on a poor quality score instead of only observing it.

## Acceptance Criteria
- Management can see the price service's full view of any product on demand.
- Suppliers cannot see it.
- The record contains only fields the price service still supplies.
- Newly introduced attributes appear without further development work.
- No value is presented to management twice.

## Changes
| File | Change |
|---|---|
| `database/migrations/..._add_price_signature_and_rename_quantity_column...php` | Add the price signature; rename pack quantity to drop the stale prefix |
| `database/migrations/..._rename_generic_type_to_product_type...php` | Three disagreeing type fields collapsed into one upstream |
| `database/migrations/..._drop_deprecated_columns_from_price_engine_metadata.php` | Remove the columns whose data moved to the attribute tables or has no source |
| `app/Models/PriceEngineMetadata.php` | Fillable fields match the slimmed record |
| `resources/views/common/product/_price_engine_metadata_card.blade.php` | New; read-only record that renders whatever attributes exist |
| `resources/views/common/product/_price_engine_metadata_styles.blade.php` | New; styles scoped so nothing leaks into the surrounding form |
| `resources/views/theme_*/management/product/edit.blade.php` | Record included below the description, gated to management |
| `resources/views/theme_*/{management,supplier}/product/edit.blade.php` | Pack-quantity badge removed; the value already appears on the record |

## Notes
The dropped fields can be restored structurally by reversing the migration, but not
their data. They were verified unread across the application first.
