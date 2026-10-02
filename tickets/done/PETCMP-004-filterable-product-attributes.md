---
id: PETCMP-004
title: Store product attributes as filterable data
project: dropee_enterprise
status: done
opened: 2026-08-18
closed: 2026-08-19
---

## Title
Store product attributes as filterable data

## Status
Done — 2026-08-19.

## Problem Statement
Naming quality scores understated the catalogue, so the products most in need of
attention could not be identified. The detected model, size and variant of every
product were being discarded. Buyers also could not narrow the catalogue by what a
product physically is — its size, material or industrial specification — because
none of that was held as data we could search.

## User Story
As a category manager, I need each product's detected model, size, material and
industrial specification held as searchable data, so that the catalogue can be
navigated and assessed by what a product actually is.

## Acceptance Criteria
- Naming quality reflects every attribute the price service reports.
- A product with several materials or colours keeps all of them.
- A specification the price service has never sent before is stored without further
  development work.
- The catalogue can be filtered and counted by any stored attribute.
- Refreshing attributes that have not changed costs nothing.

## Changes
| File | Change |
|---|---|
| `database/migrations/..._create_product_attributes_table.php` | Attribute definitions, one row per name, with a flag for whether it is offered as a filter |
| `database/migrations/..._create_product_attribute_values_table.php` | One row per value so a multi-valued attribute needs no encoding; indexed by attribute and value for filtering |
| `app/Models/ProductAttribute.php` | New; attribute definition |
| `app/Models/ProductAttributeValue.php` | New; one value for one product |
| `app/Models/Product.php` | `attributeValues()` relation |
| `app/Services/PriceEngineService.php` | Read the current response nesting; diff attributes against what is stored so an unchanged refresh writes nothing, and cache definitions per run instead of querying per product |
| `app/Services/ProductNamingScoringService.php` | Model, size and variant checks read the attribute tables; the variant check handles several values |
| `app/Services/ProductExportService.php` | Model column reads the attribute tables |

## Notes
Attributes were first replaced wholesale on every refresh, which rewrote everything
for no change. Diffing brings an unchanged refresh down to no writes at all.

A single combined field was considered for the variable specifications and rejected:
they are intended as catalogue filters, and filtering inside a combined field cannot
use an index at this scale.
