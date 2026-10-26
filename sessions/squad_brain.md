# Session state
**Updated**: 2026-10-26
**Project**: squad-brain
**Task**: Squad Brain local POC — S0–S3 done; S4 (bridge) next

## Open threads
- Stack: `docker compose up -d` in squad_brain; API 127.0.0.1:8100, Adminer 127.0.0.1:8180 (login brain_owner)
- Demo seed: `docker compose exec api python -m app.cli.seed_demo`; login with any @squad.test email
- ADR-001 interactive prompt check still manual
- Local Python is 3.9; the S4 bridge needs 3.11+ (decide: Homebrew python or uv)

## Next step
S4: bridge in squad_client — dev login + token cache, `squad context` CLI, stdio MCP proxy
