# sentinel-hos-workspace

Meta-workspace: root repo holds Claude context (skills, constitution, specs); ~31 independent repos are
cloned under `projects/` (untracked by the root). Load `/<project>-developer` before working in one.

## Local environment

- Shared local infra lives in `projects/infra/compose.yaml` (network `central-infra`). Not a git repo,
  not in `scripts/clone-projects.sh`. Full per-app audit: `projects/infra/LOCAL-SETUP.md` (2026-10-16).
- Docker Desktop VM has 7.7 GB; infra alone uses ~6 GB. In-container Node installs can OOM the VM and
  restart infra Elasticsearch nodes. Prefer host installs or `--memory` caps until memory is raised.
- `audit-localstack-1` holds the `localstack` alias on `central-infra` and host port 4566 — anything
  calling `http://localstack:4566` there hits audit's SNS-only LocalStack.

## Access gaps (as of 2026-10-16)

SSH to `gitlab.silentmode.net:10022` works, but these repos are denied to the user's account:
`slurp/integration/fargate-artisan` (inventory, datalake-exporter), `slurp/integration/laravel-mqtt-auth`
and `slurp/integration/password-validator` (hos), `slurp/forecourt-adapter` (+ invenco, itl) (hub-fcc).
`GITLAB_TOKEN` not exported; npm packages span registry projects 509, 717, 738, 1019.
No `docker login` for `registry.silentmode.net` (hub-ci, cloud-builder images).

## Gotchas

- `inventory` clones onto `ronpos-master-v2` (RONPOS line, Laravel 12); Sentinel uses `master` (Laravel 7).
- `hos` is on branch `sentinel`. Its `ES_REPORT_HOST` default is a real staging URL — always override locally.
- Host PHP 8.5 / Node 26 run almost no lockfile here; use version-matched `php:X-cli` / `node:X` images.
