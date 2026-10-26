# Session state
**Updated**: 2026-10-26
**Project**: squad-brain
**Task**: Squad Brain local POC — S0–S8 built; real install into ~/.claude awaiting go-ahead

## Open threads
- Real install: needs Aniki's OK and a login identity (demo user or add Aniki to seed). Territory includes repos with gitlab.silentmode.net remotes (e.g. wetstock in personal/repositories) and ~/Developer/work/silentmode
- Manual checks: interactive share prompt (ADR-001); Claude Desktop with `install.py --desktop`
- Stack: `docker compose up -d` in squad_brain (api 8100, worker, db, embedding, Adminer 8180)
- No local installs (memory: minimize-local-installs)

## Next step
After install decision: S9 web back-office (OIDC/dev login, agents/squads/users/move, types, audit)
