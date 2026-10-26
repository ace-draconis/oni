# Session state
**Updated**: 2026-10-26
**Project**: squad-brain
**Task**: Squad Brain local POC — S0–S3 done; S4 (client auth script) next

## Open threads
- Stack: `docker compose up -d` in squad_brain; API 127.0.0.1:8100, Adminer 127.0.0.1:8180 (login brain_owner)
- Demo seed: `docker compose exec api python -m app.cli.seed_demo`; login with any @squad.test email
- ADR-001 interactive prompt check still manual
- No local installs (memory: minimize-local-installs). Laptop side is stdlib python3 only (ADR-012)

## Next step
S4: squad_client/squad.py — login, headers (headersHelper), context; stdlib only
