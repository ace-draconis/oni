# f3-fms

**Repository**: f3-fms (use the checkout open in the current workspace)
**Stack**: Fat-Free Framework, PHP 8.2 (LiteSpeed in prod), MySQL, Docker locally
**Purpose**: Legal case/file management for a law firm — incremental port of the
legacy procedural PHP app in the `fms` repository.

## Conventions
Keep the layered separation from `core/principles.md` even without Laravel's
scaffolding — Actions for single-purpose operations, explicit naming, slim routes.
F3 gives no structure for free; it has to be imposed deliberately.

## Architecture
The legacy app still serves production while modules are ported one at a time. Both
can run simultaneously.

## Gotchas
- **Deployment is FTP.** No SSH, no Composer, no npm on the server. `vendor/` is built
  locally and uploaded. Factor this into every dependency decision.
- Local Docker joins the shared `borong-network` — DB host `borong_mysql`, app on
  8000, phpMyAdmin on 8080. See [[docker-mysql-shared-network]].
- Excel export needs `gd` and `zip` extensions in the image.

## Decisions
- ADR-001 — Fat-Free Framework chosen for shared hosting
