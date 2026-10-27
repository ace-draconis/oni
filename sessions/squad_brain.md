# Session state
**Updated**: 2026-10-27
**Project**: squad-brain
**Task**: Squad Brain local POC — S0–S11 built; only the S8 manual checks remain

## Open threads
- Stack: `docker compose up -d` in squad_brain — api 8100, web 5180, proxy 443 (squad-brain.local.com), worker, db, embedding, Adminer 8180
- Manual, needs sudo: hosts entry + trust Caddy root CA (README "HTTPS at squad-brain.local.com")
- Manual checks pending (S8): interactive share prompt (ADR-001); Claude Desktop via install.py --desktop
- Demo data: Beta Agent v2; PAY-12 and PAY-15 unassigned since the AC-06 move; PAY-15 blocks ONB-4 (shared blocker)
- No local installs (memory: minimize-local-installs)

## Next step
Aniki runs the two S8 manual checks, then close the plan with a completion record
