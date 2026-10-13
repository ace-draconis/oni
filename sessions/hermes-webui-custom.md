# Session state
**Updated**: 2026-10-09
**Project**: hermes-webui-custom
**Task**: Assess safe VPS-profile chat routing for the SSH-tunnel deployment.

## Open threads
- The deployed Gateway API is not profile-scoped. Profile CLI access requires SSH exec, but the existing SSH key and known_hosts are mounted only in the tunnel container; the WebUI has no restricted CLI broker.
- Do not add a selector or expose the root SSH key to the WebUI. The remote CLI supports profile chat, JSONL streaming, query-file stdin, and named-session continuation, but transport, cancellation, and approval integration need a restricted broker design.
- No source or deployment files were changed; no services were restarted. Live inference remains blocked by provider credits.

## Next step
Add and review a loopback-only, allowlisted profile-command broker in the SSH-tunnel trust boundary before implementing UI routing.
