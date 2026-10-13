# Session state

**Updated**: 2026-10-09
**Project**: oni
**Task**: Identify a policy-compliant Hermes client for VPS profiles and local repos

## Open threads
- The local WebUI currently chats through the VPS Gateway and sees only `hermes-agent`; it does not expose VPS profiles.
- Upstream Hermes issue [#125480](https://github.com/NousResearch/hermes-agent/issues/125480) describes the desired local-client/cloud-agent split: local filesystem/terminal with remote inference, sessions, profile config, memory, and skills. It is an open feature request for CLI attach; it states Desktop can discover/connect to Hermes Cloud, but does not establish that Desktop executes against local repositories for a remote profile.
- For self-hosted remote session attach, issue [#87653](https://github.com/NousResearch/hermes-agent/issues/87653) and PR [#87947](https://github.com/NousResearch/hermes-agent/pull/87947) remain open; that design is remote session control, not local filesystem execution.
- Local container use must comply with company policy; do not treat a container as a workaround for a software-install ban.
- No WebUI selector code or VPS command broker has been built or deployed.

## Next step
Verify any official Desktop local-filesystem/remote-profile execution capability against the exact release before recommending a containerized setup.
