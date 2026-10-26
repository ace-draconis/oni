# Squad Brain

**Path**: work/silentmode/repositories/{squad_brain, squad_client}
**Stack**: Python 3.11, FastAPI, SQLAlchemy 2 + asyncpg, Alembic, PostgreSQL 16 + pgvector, TEI (bge-m3), React + TS + Vite; Docker Compose
**Purpose**: Shared squad memory for Claude Code users — one governed agent per squad, deliverables shared on consent, hub for PM/TL.

## Source documents
- Squad Brain PRD v1.0 and FSD v1.0 (provided by Aniki, 2026-10-26). PRD intent wins on conflict.

## Repositories
- `squad_brain` — server (API + MCP), worker, web app (back-office + hub). Deployed as containers.
- `squad_client` — client installed on member laptops. Structured like Oni (CLAUDE.md, core/, skills/, hooks/, installer).
- Local only. No remotes; do not push or suggest pushing until Aniki asks.
- Client installs at user level like Oni (ADR-004); private data in `squad_client/.me/`.
- Spec and ADRs: `squad_brain/docs/{PRD,FSD,DECISIONS}.md`. Plan: `plans/squad-brain-poc.md`.

## Decisions (2026-10-26)
- Model: one shared memory (FSD design). Not a single always-on agent; the Hermes-style agent stays on the roadmap.
- Work items: native in the POC behind a tracker interface; Jira and GitLab adapters later.
- Server stack: FastAPI + PostgreSQL, as in the FSD.
- Hostname: squad-brain.local.com (third-party public domain; replace before pilot TLS, ADR-008).

## Gotchas
- GitLab rotates refresh tokens on use: hooks and the MCP bridge must share one token store with a lock.
- Skill allowlist enforced by client hooks is advisory; the server is the real enforcement point.
- FR-22 server consent lock only proves the request came through the bridge.
