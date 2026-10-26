# Session state
**Updated**: 2026-10-26
**Project**: squad-brain
**Task**: Squad Brain local POC — S0 and S1 done; S2 next

## Open threads
- Stack runs with `docker compose up -d` in squad_brain; API on 127.0.0.1:8100 (8000 is taken by another project)
- ADR-001 interactive prompt check still manual (one-minute check in a normal session)
- Local Python is 3.9; the S4 bridge needs 3.11+ on the laptop

## Next step
S2: schema migrations (FSD §4 + ADR-007), RLS policies, seed deliverable types, authorize() matrix
