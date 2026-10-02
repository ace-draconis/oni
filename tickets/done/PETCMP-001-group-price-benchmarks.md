---
id: PETCMP-001
title: Benchmark prices against shared price groups
project: dropee_enterprise
status: done
opened: 2026-08-18
closed: 2026-08-21
---

## Title
Benchmark prices against shared price groups

## Status
Done — 2026-08-21.

## Problem Statement
Each product was priced on the market evidence found for that product alone, and
most products do not attract enough of it to support a defensible figure. Products
that are commercially the same item were also priced independently, so identical
goods carried different benchmarks and neither could be defended to a supplier. The
price service moved to pricing equivalent products as one group, pooling their
evidence; the platform continued to read the abandoned per-product figures.

## User Story
As a category manager, I need every product priced on the pooled evidence for all
equivalent products, so that the benchmark I quote is backed by the whole market and
holds for the supplier's competitors too.

## Acceptance Criteria
- Equivalent products share one benchmark, drawn from their pooled market evidence.
- A benchmark states how much evidence supports it, so a weak one can be discounted.
- A revision by the price service reaches every product it affects at once.
- Both acceptable ceilings are available, so a strict and a lenient standard can be
  applied to the same product.
- Withdrawn market prices are retained, so a benchmark can be re-examined after a
  supplier disputes it.
- A product the price service no longer recognises is resubmitted rather than kept
  against a figure with no source.

## Changes
| File | Change |
|---|---|
| `database/migrations/..._create_price_signatures_table.php` | Price groups keyed on the signature string; suggested price, both ceilings and confidence live here |
| `database/migrations/..._create_price_signature_prices_table.php` | Per-market prices within a group; unique per group and source price so a repeat sync updates rather than duplicates |
| `database/migrations/..._add_group_benchmark_fields_to_products_table.php` | Link a product to its group, plus the two deviations that depend on the product's own price |
| `app/Models/PriceSignature.php` | New; price group with `prices` and `activePrices` relations |
| `app/Models/PriceSignaturePrice.php` | New; one market price within a group |
| `app/Services/PriceEngineService.php` | `updateGroupPriceBenchmark()` replaces the per-product write; `syncGroupPrices()` deactivates by excluding the ids just received, so concurrent workers converge |
| `app/Jobs/RetrieveAndStoreProductPrice.php` | Manual refresh writes group pricing and stops writing the retired per-product fields |
| `app/Http/Controllers/MgmtPriceBenchmarkController.php` | Manual refresh returns the group figures the page now shows |
| `app/Services/PriceBenchmarkService.php` | Product query reads group pricing; pass/fail is sign-based against the ceiling, which already embeds the acceptable markup |
| `app/Widgets/ManagementDashboard/PriceBenchmarkWidget.php` | Dashboard counts read group pricing |
| `resources/views/common/price_benchmark/_*.blade.php` | Shared partials for suggested price, ceiling, confidence, deviation and the per-market price table |
| `resources/views/theme_{petronas,ccs,vanilla}/management/price_benchmark/index.blade.php` | Columns split into suggested, ceiling and confidence |

## Notes
Retiring a group's prices by clearing them and re-marking what came back was built
first and rejected. With several workers syncing at once, one worker's clear
overwrote another's re-mark and live prices disappeared with no error raised.

The old per-product price table is still written by the legacy single-product path.
No screen reads it; it can be dropped once that path retires.
