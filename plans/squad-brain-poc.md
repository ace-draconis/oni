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

### S0 — Spike (ADR-001)
- [x] User-level `ask` rule vs user/project `allow` override: prompt appears or not
- [x] Behaviour under `--dangerously-skip-permissions` and bypass mode
- [-] Remote MCP OAuth against GitLab CE (FR-05) — deferred, ADR-009
- [x] Record findings in ADR-001

### S1 — Server skeleton
- [x] Python project (`pyproject.toml`, ruff, pytest) and app layout `api/ services/ db/`; `actions/ schemas/ mcp/` added when first used
- [x] Settings from env (FSD §12 config) with `.env.example`
- [x] `/healthz` and `/readyz` (database + embedding model) with tests
- [x] Docker Compose: api (127.0.0.1:8100), postgres 16 + pgvector (no host port), Ollama bge-m3 (ADR-010); `/readyz` 200
- [x] Alembic wired with `brain_owner` / `brain_app` roles

### S2 — Schema, RLS, authorization
- [x] Migrations for FSD §4 tables plus ADR-007 amendments
- [x] RLS policies on squad-scoped tables; `audit_log` append-only for `brain_app`
- [x] Seed deliverable types with field schemas (FSD §11)
- [x] `authorize()` with full 4-role matrix unit tests (FR-50)
- [x] Integration test: raw SQL as `brain_app` cannot read another squad (AC-03 DB half)

### S3 — Authentication
- [x] `POST /auth/exchange`: dev identity provider (email) behind `IdentityVerifier`, 15-min JWT (FR-03); GitLab verifier later (ADR-009)
- [x] `403 not_provisioned` for unknown users (FR-04)
- [x] Request dependency that resolves the caller per request (ADR-011) and sets `app.squad_id` / `app.user_id` / `app.cross_read`; audited cross-read helper

### S4 — Client auth script (ADR-012, replaces the bridge)
- [x] Spike: Claude Code HTTP MCP with `headersHelper`; `ask` holds; 401 triggers helper re-run (ADR-012)
- [x] `squad_client/bin/squad.py` (stdlib, Python 3.9+): `login`, `status`, `headers`, `context`, `logout`; JWT cached in `.me/token.json` 0600
- [x] Tests for `squad.py`: 12 unittest cases against a fake brain, plus live run against the real brain

### S5 — MCP read side
- [x] `contracts/mcp_tools.json` frozen, contract test incl. no-transcript and 64 KB cap (FR-40, FR-44)
- [x] Brain `/mcp` streamable HTTP endpoint (MCP SDK in the container), Bearer JWT auth
- [x] `whoami`, `load_agent` (ETag), `list_work_items`, `get_work_item` behind `WorkTracker` (ADR-006)

### S6 — Share path
- [x] Consents: REST two-step (POST /consents + X-Consent-Id, single-use, 5 min, payload hash); MCP records the ask-gated call as consent (ADR-013, AC-04)
- [x] `share_deliverable`, versions, audit, growth, embed job in one transaction (FR-13, FR-21, FR-23)
- [x] `update_status` with workflow, ownership rule, `blocked_at` and expected hints (FR-17, FR-24); `withdraw` (FR-14, AC-09); `list_my_shared` (PR-12)
- [x] Live: headless Claude Code with `ask` refused and wrote nothing (AC-05); approved run shared ADR v1 and moved PAY-12

### S7 — Search and briefing
- [x] Worker container: jobs queue (`SKIP LOCKED`, DB-clock retries, failed after 5), chunker (FR-15), Ollama embeddings
- [x] Hybrid `recall` (vector + FTS candidates, 0.7/0.3 rerank) with citations and 8k cap (FR-41, FR-42); REST /search with 60/min limit (FR-53)
- [x] `briefing` incl. `handoffs_to_me` (AC-14); sessions with 30-min gap (FR-36); REST /me/briefing; squad.py context includes briefing
- [x] Live: dev handoff -> worker embedded -> QA context listed handoff (AC-14) -> QA recall answered with citations (G2)

### S8 — Client (`squad_client`) — thin client, territory, every channel (ADR-014, ADR-015)
- [x] Spikes: plugin route vs installer (plugin `ask` not enforced); PreToolUse deny on MCP tools; SessionStart systemMessage; MCP `instructions` reach the model; Skill tool input shape
- [x] Brain: rendered agent instructions (persona, scope, base rules, skills) for hook and MCP handshake; brain-served skills (11) and client config (territory, min version)
- [x] Brain: Desktop channel read-only by default (X-Squad-Channel)
- [x] Client: territory (company git remote or path prefix), session-start announcement + injection, prompt-check (60 s, ETag, squad-move notice), tool guard (territory + allowlist, FR-34)
- [x] Client: skills synced from the brain at session start; `.me/` bootstrap; pre-commit blocks `.me/` (AC-07); hooks never block Claude Code
- [x] Client: `install.py` (one-time, idempotent, uninstall, `--desktop`); `squad.py mcp-stdio` Desktop bridge
- [x] Live: installer output reviewed in an isolated config; territory session announced + injected + recall with citations; personal repo silent and tools denied; Desktop bridge got persona via instructions with read tools only
- [x] Installed into real `~/.claude` as rafiq.azhar@silentmode.my (TL, Squad Alpha); backup in squad_client/.me/backups/; Oni hooks and other settings preserved; MCP connected
- [ ] Manual: interactive prompt for a share (ADR-001) and Claude Desktop restart check

### S9 — Web back-office
- [x] Admin API, governance-only (FR-66), before/after audit (FR-65): agents + versions (FR-60), squads + assignment (FR-11), users + move with preview/handover/unassign in one tx (FR-18, FR-61), deliverable types, skills catalog (FR-62), audit + CSV, usage incl. recall counter (FR-64, migration 0004)
- [x] React + TS + Vite web app in a container (no local Node): dev login, role-gated nav, all back-office pages
- [x] UI driven with Playwright in Docker: every page, agent v2 via review diff, move dialog; caught and fixed a sign-in re-render bug
- [x] AC-06 live: UI move -> Dina's session start = Beta Agent v2, Alpha items unreadable; move back -> next prompt "Squad changed"

### S10 — Hub
- [x] Squad library: REST list (type, text, work item, author, open-bug severity filters; cursor pages), deliverable page at the citation URL with version history; withdrawn gone (AC-09); cross-squad links audited
- [x] Squad progress from `v_squad_progress` over `v_open_bugs` and `v_item_test_coverage` (security_invoker), every metric linked to the list built from the same view (FR-70, FR-71)
- [x] Live: Playwright as TL Alpha (qa 2 -> 2 rows, blocker PAY-15 22h, library -> ADR v1) and governance -> Beta progress

### S11 — Local wrap-up
- [x] Caddy with internal TLS for `squad-brain.local.com` (proxy container, network alias); verified with the exported root CA. Hosts entry and keychain trust are a manual sudo step (README)
- [x] Portfolio from `v_portfolio` + `v_shared_blockers`, one `cross_read` row per view (live 0 -> 1, AC-10); growth from `v_growth` / `v_growth_records`, person/pm/tl only (FR-73)
- [x] AC sweep (AC-01..AC-12, AC-14) in README with evidence; live AC-02, AC-07, AC-10, AC-11, AC-12. AC-11 found a client defect (double import of squad.py, notices dropped), fixed in squad_client 9795763

Deferred (ADR-009): VM deploy, CI, backup drill, AC-13 performance, multi-OS testing, pilot.

## Changes
| File | Change |
|---|---|
| squad_brain/docs/PRD.md | Added PRD v1.0 |
| squad_brain/docs/FSD.md | Added FSD v1.0 with amendment note |
| squad_brain/docs/DECISIONS.md | ADR-001..008 |
| squad_client/README.md, .gitignore | Initial commit |
| squad_brain/spikes/adr-001/* | Dummy MCP server and scenario runner for ADR-001 |
| squad_brain/pyproject.toml, app/{main,config}.py, app/api/health.py, app/services/{embedding_client,readiness_service}.py, app/db/session.py | Server skeleton |
| squad_brain/alembic.ini, migrations/ | Alembic as brain_owner; 0001 grants brain_app |
| squad_brain/compose.yml, docker/*, .env.example | Stack: api, db, embedding |
| squad_brain/tests/* | healthz, readyz, role and extension checks |
| squad_brain/docs/DECISIONS.md | ADR-001 accepted, ADR-010 added |
| squad_brain/migrations/versions/0002_core_schema.py | FSD §4 + ADR-007 tables, RLS policies, immutable versions, append-only audit |
| squad_brain/migrations/versions/0003_seed_deliverable_types.py | Nine types with JSON Schemas and expected rules |
| squad_brain/app/enums.py, app/authorization/policy.py | Enums and single authorize() decision point |
| squad_brain/tests/{conftest,test_row_level_security,test_deliverable_types_seed,test_authorization_matrix}.py | 110 new tests |
| squad_brain/app/{exceptions.py,db/models.py,db/request_context.py} | Domain errors, ORM models, RLS context and audited cross-read |
| squad_brain/app/services/{token_service,identity_verifier,principal_resolver}.py, app/actions/exchange_token_action.py | JWT, dev identity, per-request caller resolution |
| squad_brain/app/api/{auth,dependencies}.py, app/cli/seed_demo.py | /auth/exchange, /me, demo seed |
| squad_brain/tests/{test_auth_api,test_token_service,test_request_context}.py | 16 new tests |
| squad_brain/docs/DECISIONS.md | ADR-011 |
| squad_brain/spikes/adr-012/*, docs/DECISIONS.md | HTTP MCP spike; ADR-012 supersedes ADR-005 |
| squad_client/bin/squad.py, tests/test_squad_cli.py, README.md | Stdlib client: login, headersHelper, hook context |
| squad_brain/contracts/mcp_tools.json, app/mcp/{contract,endpoint,tools}.py | Frozen 10-tool contract; /mcp streamable HTTP with bearer gate; 4 read tools |
| squad_brain/app/actions/load_agent_action.py, app/services/work_tracker.py, app/schemas/{agent,work_item}.py | Agent resolution (follow_latest, ETag); WorkTracker + NativeWorkTracker |
| squad_brain/app/api/auth.py | GET /api/v1/me/agent with ETag/304 |
| squad_brain/docker/postgres/init_roles.sh, tests/conftest.py, tests/factories.py | Separate squad_brain_test DB; session-scoped MCP fixture |
| squad_brain/tests/test_mcp_{contract,read_tools}.py | 44 tests incl. AC-08 contract |
| squad_client/bin/squad.py | context includes agent |
| squad_brain/app/services/{consent_service,audit_recorder,work_item_workflow}.py | Consent hashing/consume, audit rows, status machine |
| squad_brain/app/actions/{share_deliverable,update_work_item_status,withdraw_deliverable,list_my_shared}_action.py | Write actions |
| squad_brain/app/api/writes.py, app/mcp/tools.py | REST two-step consent endpoints; 4 MCP write/list tools |
| squad_brain/app/db/session.py, app/mcp/endpoint.py | Explicit rollback on failure |
| squad_brain/tests/test_share_path.py, tests/factories.py | 25 tests; factories commit (savepoint release) |
| squad_brain/docs/DECISIONS.md | ADR-013 |
| squad_brain/app/worker/{__main__,job_runner,embed_job}.py, app/services/chunker.py, compose.yml | Worker container, job queue, embedding |
| squad_brain/app/actions/{recall,briefing}_action.py, app/services/{session_tracker,token_budget,rate_limiter}.py | Recall, briefing, sessions, 8k cap, rate limit |
| squad_brain/app/mcp/tools.py, app/api/auth.py | recall/briefing tools; /me/briefing, /search; load_agent touches session |
| squad_brain/tests/{test_chunker,test_search_and_briefing}.py, tests/conftest.py | 23 tests; memoized embeddings (160s -> 39s) |
| squad_client/bin/squad.py | context includes briefing |
| squad_brain/agent/base_rules.md, skills/*/SKILL.md, app/services/{agent_instructions,client_bundle}.py, app/api/client.py | Brain-served agent and skills, client config |
| squad_brain/app/mcp/endpoint.py, app/config.py | Per-caller MCP instructions; Desktop read-only channel; territory settings |
| squad_brain/tests/test_client_channel.py, spikes/plugin-route/ | 9 tests; plugin spike |
| squad_client/bin/{squad,squad_hooks,squad_territory,squad_skills}.py, install.py, githooks/pre-commit | Thin client, hooks, installer, Desktop bridge |
| squad_client/tests/{fake_brain,test_hooks_and_install}.py | 25 tests |
| squad_brain/docs/DECISIONS.md | ADR-014, ADR-015 |
| squad_brain/app/api/admin.py, app/actions/admin/*, app/services/{admin_queries,admin_audit,usage_counter}.py, app/schemas/admin.py | Back-office API |
| squad_brain/migrations/versions/0004_usage_daily.py | Recall usage counter |
| squad_brain/tests/test_admin_api.py | 17 tests incl. FR-18 move + AC-06 server half |
| squad_brain/web/* | Back-office web app + Playwright smoke script |
| squad_brain/migrations/versions/0005_hub_views.py | v_open_bugs, v_item_test_coverage, v_squad_progress (security_invoker) |
| squad_brain/app/api/hub.py, app/services/{hub_queries,squad_read_access}.py, app/schemas/hub.py | Library, deliverable versions, progress, drill-down work items; audited cross-read |
| squad_brain/tests/test_hub_api.py, tests/test_database_roles.py | 10 tests incl. metric = drill-down and view RLS; head 0005 |
| squad_brain/web/src/pages/{Progress,WorkItems,Library,Deliverable}Page.tsx, components/Metric.tsx, e2e/hub.mjs | Hub pages for every role; NoAccessPage removed |
| squad_brain/migrations/versions/0006_portfolio_growth_views.py | v_shared_blockers, v_portfolio, v_growth_records, v_growth |
| squad_brain/app/services/{hub_read_access,portfolio_queries,growth_queries}.py, app/api/hub.py | Portfolio, growth, members; access gates renamed HubReadAccess |
| squad_brain/tests/test_portfolio_growth_api.py | 14 tests |
| squad_brain/web/src/pages/{Portfolio,Growth,GrowthRecords}Page.tsx | Portfolio and growth pages |
| squad_brain/docker/caddy/Caddyfile, compose.yml | proxy service, internal TLS |
| squad_brain/app/cli/seed_demo.py | ONB-4 and the PAY-15 -> ONB-4 shared blocker |
| squad_brain/README.md | HTTPS setup, hub, demo walkthrough, AC sweep |
| squad_client/bin/squad.py, tests/test_hooks_and_install.py | Module alias fix; installed-command offline test |

## Completion record
—
