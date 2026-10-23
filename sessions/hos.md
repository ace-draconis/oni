## Project: hos
**Task**: Regression automation for `upgrade/laravel-13-sentinel`, now on Laravel 9.52.22 / PHP 8.2 (!4668 + !4685 sync, landed 2026-10-23). Planning only, nothing run.

## Open threads
- Correction to the 2026-10-22 note: HOS says prod 5.5.50 already emits the cookie value prefix (tests/Unit/Config/SessionCookieValueContractTest.php). But e-invoice main's local hos-session-auth lib (TS) and LaravelCookieDecryptor.cs (.NET) do not strip `<40hex>|`. Contradiction unresolved; verify against a real prod cookie / e-invoice SSO logs.
- Already gated on the L9 branch: model date pin + tripwire, Carbon JSON shape, cookie value contract, `acc` claim fixture, tenancy parity suite, queue tenant rebinding, import baseline, removed-API tripwire, route:cache test.
- Still open: view/config cache smoke, artisan+schedule snapshot, mail render snapshots, Flysystem contract, outbound HTTP + Sentry boot, deprecation budget, Blade/visual diff, 5.8-vs-9 differential run, staging smoke, empty hop log, phpstan level 0.
- Cleanups: BaseMailer dead Swift_TransportException catch; BaseReportManager Flysystem v3 error handling.

## Next step
Aniki picks build order for the open gates; split into PS-10341 sub-tickets.
