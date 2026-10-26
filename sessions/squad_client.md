# Session state
**Updated**: 2026-10-26
**Project**: squad-brain
**Task**: Squad Brain local POC — S0, S1, S2 done; S3 next

## Open threads
- Stack runs with `docker compose up -d` in squad_brain; API on 127.0.0.1:8100 (8000 is taken by another project)
- ADR-001 interactive prompt check still manual (one-minute check in a normal session)
- Local Python is 3.9; the S4 bridge needs 3.11+ on the laptop

## Next step
S3: auth exchange — GitLab token validation (or local dev login, ADR-009), 15-min JWT, request dependency setting app.squad_id/user_id/cross_read
