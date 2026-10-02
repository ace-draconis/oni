---
id: PETCMP-002
title: Refresh the catalogue in batches
project: dropee_enterprise
status: done
opened: 2026-08-18
closed: 2026-08-20
---

## Title
Refresh the catalogue in batches

## Status
Done — 2026-08-20.

## Problem Statement
A full catalogue refresh took most of a working day, so it was never run to
completion. The naming quality and price verdicts management reviewed were weeks
behind what the price service actually published. Decisions about which products to
fix were made against stale evidence.

## User Story
As a category manager, I need a full catalogue refresh to finish within the hour, so
that what I review reflects what the price service publishes today.

## Acceptance Criteria
- A full catalogue refresh completes within the hour.
- Product details and pricing can be refreshed on separate schedules, since one
  changes far more often than the other.
- A refresh that fails partway is recorded and retried, never lost silently.
- Refreshing unchanged data costs nothing, so a refresh can run as often as needed.
- Quality scores are recalculated independently of the data they score, so a failure
  in one does not force the other to be repeated.
- Price groups the price service cannot resolve by re-running are excluded from
  routine refreshes.

## Changes
| File | Change |
|---|---|
| `app/Services/PriceEngineService.php` | `retrieveProductDetailsBulk()` and `retrieveProductPricesBulk()` over a shared request helper; rows keyed by our own product id so callers never match by position |
| `app/Jobs/SyncProductDetailsBatch.php` | New; one batch per job — a job per product would discard the batching and bury the shared queue |
| `app/Jobs/SyncProductPricesBatch.php` | New; same shape for pricing, with no scoring follow-up since pricing does not affect scores |
| `app/Jobs/ScoreProductsBatch.php` | New; scoring split out so it retries independently of the data it scores |
| `app/Console/Commands/PriceEngine/SyncProductDetailsBulkCommand.php` | New; runs inline or queued, batch size capped to the service limit |
| `app/Console/Commands/PriceEngine/SyncProductPricesBulkCommand.php` | New; `--skip-blocked` leaves out groups that re-running cannot resolve |
| `app/Services/ProductNamingScoringService.php` | `recomputeMany()`; relations and brand qualities read once per batch, scores written in one statement |
| `app/Services/BrandUsageScoringService.php` | `recomputeMany()`; uses the loaded brand relation instead of a lookup per product |
| `app/Models/ProductScore.php` | Bulk score writes retry on deadlock and are ordered so concurrent batches walk the index the same way |
| `app/Models/PriceSignature.php` | Records why a group is not publishing, and which of those states are worth revisiting |
| `database/migrations/..._add_unique_index_to_brands_seo_link.php` | Brand lookups matched a column with no unique constraint, letting concurrent workers create the same brand twice |
| `database/migrations/..._add_pricing_status_to_price_signatures_table.php` | Store the price service's own account of why a group is not publishing |

## Notes
Almost none of the time was spent talking to the price service. Search indexing
rebuilt a payload on every save, brand qualities were looked up once per product,
and attributes were rewritten even when unchanged. Removing those three cut the
per-product cost by roughly three quarters.

Ten simultaneous workers give roughly six times the throughput of one, limited by
shared database and service capacity. Past about five the added contention is not
worth it.

Workers hold their code in memory, so the queue must be restarted after any change
to these paths reaches a machine.
