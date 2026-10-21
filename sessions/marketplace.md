# Session state
**Updated**: 2026-10-21
**Project**: marketplace
**Task**: Code wiki generated and verified at 6b0d146 (~/code-wikis/marketplace, CURRENT)

## Open threads
- known-issues.md has 10 High items. H1/H2 hinge on the deployed Postgres role (owner/superuser bypasses RLS since policies are ENABLE-only, never FORCE). Settle with `SELECT current_user, rolbypassrls` plus table ownership on staging/prod.
- H9 (receipts appended to already-submitted SmartPay invoices) is a Constitution IX tax-record issue; worth a Jira ticket.
- H10 depends on the e-invoice receipt_date format and the vhost; needs a sample message to confirm.

## Next step
awaiting direction
