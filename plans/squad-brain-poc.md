# Squad Brain POC

**Project**: squad-brain
**Status**: In progress
**Goal**: Local proof of concept on one machine (ADR-009): AC-01..AC-12 and AC-14 demonstrated, built to FSD §14 order as amended by `squad_brain/docs/DECISIONS.md`. Deployment, CI, backups, performance and pilot are out of scope.

Repos: `squad_brain` (server, worker, web, deploy) and `squad_client` (Oni-style user-level client).
Commit prefix: `[plan:squad-brain-poc]`, plus the `FR-xx` the commit implements.
A step is ticked only when its check has been run, not when the code is written.

## Steps

### Setup
- [x] Create local repos `squad_brain` and `squad_client` with initial commits
- [x] Add PRD, FSD and DECISIONS.md (ADR-001..008) to `squad_brain/docs/`
- [ ] Push both repos to GitLab group "Silentmode Squad Brain" (blocked: SSH publickey refused; group path assumed `silentmode-squad-brain`)

### S0 — Spike (ADR-001)
- [ ] User-level `ask` rule vs user/project `allow` override: prompt appears or not
- [ ] Behaviour under `--dangerously-skip-permissions` and bypass mode
- [ ] Remote MCP OAuth against GitLab CE as authorization server (FR-05)
- [ ] Record findings in ADR-001

### S1 — Server skeleton
- [ ] Python project (`pyproject.toml`, ruff, pytest) and app layout: `api/ actions/ services/ schemas/ db/ mcp/`
- [ ] Settings from env (FSD §12 config) with `.env.example`
- [ ] `/healthz` and `/readyz` (DB + TEI reachability) with tests
- [ ] Docker Compose: api, postgres 16 + pgvector (no host port), TEI bge-m3; `docker compose up` passes `/readyz`
- [ ] Alembic wired with `brain_owner` / `brain_app` roles

### S2 — Schema, RLS, authorization
- [ ] Migrations for FSD §4 tables plus ADR-007 amendments
- [ ] RLS policies on squad-scoped tables; `audit_log` append-only for `brain_app`
- [ ] Seed deliverable types with field schemas (FSD §11)
- [ ] `authorize()` with full 4-role matrix unit tests (FR-50)
- [ ] Integration test: raw SQL as `brain_app` cannot read another squad (AC-03 DB half)

### S3 — Authentication
- [ ] `POST /auth/exchange`: validate GitLab token, map user, issue 15-min JWT (FR-03); local dev login fallback (ADR-009)
- [ ] `403 not_provisioned` for unknown users (FR-04)
- [ ] Request dependency that sets `app.squad_id` / `app.cross_read` per transaction

### S4 — Bridge (`squad_client/bridge`)
- [ ] PKCE loopback login, refresh token in keychain, file-locked refresh (ADR-005)
- [ ] `squad context` CLI for hooks
- [ ] stdio MCP proxy exposing the contract tools

### S5 — MCP read side
- [ ] `contracts/mcp_tools.json` frozen, contract test incl. no-transcript and 64 KB cap (FR-40, FR-44)
- [ ] `whoami`, `load_agent` (ETag), `list_work_items`, `get_work_item` behind `WorkTracker` (ADR-006)

### S6 — Share path
- [ ] Consents endpoint and single-use 5-minute hash check (FR-22, AC-04)
- [ ] `share_deliverable`, versions, audit, growth, embed job in one transaction (FR-23)
- [ ] `update_status` with expected hints and `blocked_at` (FR-24); `withdraw` (FR-14, AC-09)

### S7 — Search and briefing
- [ ] Worker: job queue (`SKIP LOCKED`), chunker (FR-15), embeddings
- [ ] Hybrid `recall` with citations and 8k cap (FR-41, FR-42)
- [ ] `briefing` incl. `handoffs_to_me` (AC-14); sessions upsert (FR-36)

### S8 — Client (`squad_client`)
- [ ] `install.py`: managed `<!-- squad:begin -->` block, user-level hooks, skills, MCP, permissions (ADR-004)
- [ ] Hooks: session_start, prompt_check (60 s cache), skill_guard, offline notice (FR-30..34, AC-11)
- [ ] `.me/` bootstrap and pre-commit guard (FR-35, AC-07)
- [ ] `CLAUDE.md` base rules and 11 skills (FR-80..84)
- [ ] Tested install on macOS

### S9 — Web back-office
- [ ] React + TS + Vite app, GitLab OIDC login, role-gated routes (FR-66)
- [ ] Agents (versioned, diff, change note), squads, users and move dialog (FR-60, FR-61, FR-18)
- [ ] Deliverable types editor, skills catalog, audit viewer, usage (FR-62..65)

### S10 — Hub
- [ ] Squad library with version history
- [ ] Squad progress from `v_squad_progress`, every metric linked (FR-70, FR-71)

### S11 — Local wrap-up
- [ ] Caddy with internal TLS for `squad-brain.local.com` via hosts file (ADR-008)
- [ ] Portfolio view with single `cross_read` audit row (AC-10); growth view (FR-73)
- [ ] AC sweep (AC-01..AC-12, AC-14) and demo walkthrough in README

Deferred (ADR-009): VM deploy, CI, backup drill, AC-13 performance, multi-OS testing, pilot.

## Changes
| File | Change |
|---|---|
| squad_brain/docs/PRD.md | Added PRD v1.0 |
| squad_brain/docs/FSD.md | Added FSD v1.0 with amendment note |
| squad_brain/docs/DECISIONS.md | ADR-001..008 |
| squad_client/README.md, .gitignore | Initial commit |

## Completion record
—
