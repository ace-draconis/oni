# Session state
**Updated**: 2026-10-26
**Project**: squad-brain
**Task**: Squad Brain local POC — S0–S5 done; S6 (share path) next

## Open threads
- Stack: `docker compose up -d` in squad_brain; API 127.0.0.1:8100 (/mcp, /docs), Adminer 127.0.0.1:8180 (brain_owner)
- Demo seed: `docker compose exec api python -m app.cli.seed_demo`; login with any @squad.test email via squad_client/bin/squad.py
- Tests use squad_brain_test DB; PENDING_TOOLS in tests/test_mcp_contract.py must shrink as tools land
- ADR-001 interactive prompt check still manual
- No local installs (memory: minimize-local-installs)

## Next step
S6: consents (single-use, 5-min, payload hash), share_deliverable with versions/audit/growth/embed job, update_status with expected hints, withdraw
