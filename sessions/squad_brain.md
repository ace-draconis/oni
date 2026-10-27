# Session state
**Updated**: 2026-10-27
**Project**: squad-brain
**Task**: Squad Brain local POC — S0–S10 done; S11 (local wrap-up) next

## Open threads
- Stack: `docker compose up -d` in squad_brain — api 8100, web 5180, worker, db, embedding, Adminer 8180
- Hub live at web 5180: /progress, /library, /library/{id}/v/{n} (citation URLs), /work-items drill-down
- Open bug = shared bug whose item is not done; coverage = qa/done items with a shared testcase (migration 0005)
- Demo data: Beta Agent v2; PAY-12 and PAY-15 unassigned since the AC-06 move demo
- Manual checks pending: interactive share prompt (ADR-001); Claude Desktop via install.py --desktop
- No local installs (memory: minimize-local-installs)

## Next step
S11: Caddy internal TLS for squad-brain.local.com; portfolio (v_portfolio, one cross_read row, AC-10) and growth (FR-73); AC sweep + README demo
