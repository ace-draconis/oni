## Project: hos
**Task**: Regression automation for `upgrade/laravel-13-sentinel`, now on Laravel 9.52.22 / PHP 8.2 (!4668 + !4685 sync, landed 2026-10-23). Planning only, nothing run.

## Open threads
- Correction to the 2026-10-22 note: HOS says prod 5.5.50 already emits the cookie value prefix (tests/Unit/Config/SessionCookieValueContractTest.php). But e-invoice main's local hos-session-auth lib (TS) and LaravelCookieDecryptor.cs (.NET) do not strip `<40hex>|`. Contradiction unresolved; verify against a real prod cookie / e-invoice SSO logs.
- Already gated on the L9 branch: model date pin + tripwire, Carbon JSON shape, cookie value contract, `acc` claim fixture, tenancy parity suite, queue tenant rebinding, import baseline, removed-API tripwire, route:cache test.
- Still open: view/config cache smoke, artisan+schedule snapshot, mail render snapshots, Flysystem contract, outbound HTTP + Sentry boot, deprecation budget, Blade/visual diff, 5.8-vs-9 differential run, staging smoke, empty hop log, phpstan level 0.
- Cleanups: BaseMailer dead Swift_TransportException catch; BaseReportManager Flysystem v3 error handling.

- 2026-10-23 consolidation triage: sentinel-temp tip 1e95f13c7c is already inside the upgrade branch (0 divergence). Of 25 open Sentinel branches: 11 already landed, 8 merge clean, 2 stale regardless of upgrade (PS-10260, PS-10338), 4 need L9 translation (PS-10730 UoM feature; test branches PS-10277, PS-10276, PS-10283). Release lines 2.38.0+3 / 2.37.0+2 fully in temp by ticket.

- 2026-10-23 validated cleanup candidates on upgrade branch: safe = Swift catch (BaseMailer), unused 'cors' alias, fruitcake→native HandleCors + CheckForMaintenanceMode→PreventRequestsDuringMaintenance, Dockerfile.alpine. Needs lock refresh = teratotech repo URLs (+ Dockerfile keyscan line 74). Not for cleanup MR: mail config rename (prod envs set MAIL_DRIVER), money bump (behaviour changes; LocalAccount.php:38 string currency), pragmarx/health (live health endpoint).

## Next step
Decide cutover timing (sentinel-temp → L9 base) and whether to add a CI trial-merge + removed-API scan on sentinel-temp MRs.
