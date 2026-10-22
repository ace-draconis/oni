## Project: hos
**Task**: Regression automation plan for the Laravel 5.8 → 9 hops on `upgrade/laravel-13-sentinel` (planning only, nothing run)

## Open threads
- P0 finding: Laravel's CookieValuePrefix (`sha1hmac(name.'v2')|` + value, security release ~6.18.29/7.22) is not stripped by e-invoice `libs/hos-session-auth` (TS) or the .NET HosSessionAuth. Web SSO into e-invoice breaks at the first hop that carries it. Needs a tolerant consumer fix shipped before the L6 hop.
- Proposed gates not yet ticketed: boot/cache smoke, artisan+schedule snapshot, session cookie contract, JWT claim baseline, model serialization snapshot, Blade/mail render snapshots, queue payload compat, deprecation budget, Flysystem/Guzzle contracts, Ziggy parity, differential old-vs-new run, staging smoke.

## Next step
On hold until the Laravel 9 upgrade lands on the branch (Aniki, 2026-10-22). Then re-plan against L9: the risk map above was measured on 5.8.
