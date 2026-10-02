---
id: PETCMP-003
title: Withhold price verdicts we cannot defend
project: dropee_enterprise
status: done
opened: 2026-08-21
closed: 2026-08-21
---

## Title
Withhold price verdicts we cannot defend

## Status
Done — 2026-08-21.

## Problem Statement
We were telling category managers that suppliers were overpriced when we could not
prove it. The price service had stopped standing behind some of its benchmarks, but
the platform kept presenting the withdrawn figures as verdicts. Acting on them
risked challenging a supplier over a price we had already retracted internally.

## User Story
As a category manager, I need a product with no defensible benchmark to show no
verdict at all, so that every price I challenge is one I can substantiate.

## Acceptance Criteria
- A product is judged only while the price service stands behind a benchmark for it.
- A verdict disappears as soon as its benchmark is withdrawn, without waiting for
  anything else to happen.
- Every unjudged product records the fault that prevented judgement, so it can be
  routed to whoever owns that fault.
- Unjudged products are reported separately and never counted as having passed.
- A product that regains a defensible benchmark is judged again, carrying no trace
  of the earlier fault.

## Changes
| File | Change |
|---|---|
| `database/migrations/..._add_uncommon_reason_to_products_table.php` | Store why a price is unavailable, indexed for filtering; the exclusion flag alone cannot separate a rare item from a retracted price |
| `app/Services/PriceEngineService.php` | Mirror the deviation from every response including to null — previously written only alongside a benchmark, which froze a verdict permanently once a group stopped publishing |
| `app/Models/Product.php` | `isBenchmarkWithheld()` and a reason-to-label map, keyed on the absence of a deviation rather than on the exclusion flag |
| `resources/views/common/price_benchmark/_uncommon_reason_badge.blade.php` | New; shows the reason where a price would otherwise be |
| `resources/views/common/price_benchmark/_group_suggested_price.blade.php` | Suppress the group figure for a product with no verdict of its own |
| `resources/views/common/price_benchmark/_group_max_price.blade.php` | Same suppression for the ceiling |
| `resources/views/common/price_benchmark/_deviation_badge.blade.php` | Carry the rule at the point of decision so it is not re-derived from the exclusion flags |
| `app/Services/PriceBenchmarkService.php` | Filters per reason; pass and fail exclude anything with no verdict |
| `app/Widgets/ManagementDashboard/PriceBenchmarkWidget.php` | Dashboard counts split by reason, all gated on the same rule as the display |

## Notes
Whether a product may be judged is decided by one fact: whether the price service
currently supplies a deviation for it. The two exclusion signals each answer half
the question — one covers the product, the other its group — and either alone leaves
stale verdicts standing.

That rule was reached twice over. Keying on the product-level signal was advised and
then retracted by the price service; keying on the recorded reason would have hidden
prices that were sound. Only the deviation survives both.
