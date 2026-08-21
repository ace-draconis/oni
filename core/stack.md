# Stack & environment

**Ace** — full-stack developer. Laravel/PHP primary. WSL2 on Linux, VS Code.

## Defaults
- **Framework**: Laravel (PHP). Fat-Free Framework where shared hosting forbids Composer.
- **DB**: MySQL + phpMyAdmin (never Postgres by default)
- **Containers**: Docker for all local dev

## Docker conventions
- Source, configs, env files as bind mounts — hot reload, no rebuilds
- DB data in named volumes, never host-mounted paths
- DB ports NOT exposed to host — internal Docker network only
- phpMyAdmin on 8080
- Keep compose files simple; no container sprawl

## Git — WSL gotcha (critical)
`core.fsmonitor=true` + `core.checkstat=minimal` means git misses editor-written
file changes. `git add -A` silently stages nothing.

Always: `git add --renormalize -A`

## Automation mindset
Prefer automation that removes repetition without adding fragile complexity —
local setup, deploy repeatability, codegen, testing, everything mechanical.
