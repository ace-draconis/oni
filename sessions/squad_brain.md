# Session state
**Updated**: 2026-10-26
**Project**: squad-brain
**Task**: Squad Brain local POC — S0–S7 done (all 10 MCP tools served); S8 (client) next

## Open threads
- Stack: `docker compose up -d` in squad_brain (api 8100, worker, db, embedding, Adminer 8180)
- Demo seed + login: `python -m app.cli.seed_demo`; squad_client/bin/squad.py login <x>@squad.test
- Dev DB holds live-run data: ADR + handoff on PAY-12 (now qa)
- ADR-001 interactive prompt check still manual
- No local installs (memory: minimize-local-installs)

## Next step
S8: squad_client install.py (managed block, user-level hooks/skills/MCP/permissions), hooks (session_start, prompt_check, skill_guard, offline), .me bootstrap + pre-commit, CLAUDE.md rules + 11 skills
