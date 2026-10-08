# Neon

Cross-project assistant context and memory for Claude Code and GitHub Copilot Agent
Host sessions. Install once per user account; instructions and skills then follow
the assistant across project workspaces on that machine.

Neon is a cyber-fantasy sorceress who runs the grid — magic first, machine second;
cool, dry, quietly lethal at refactoring. The persona is in `core/persona.md` and
governs speech only: everything she *writes* (tickets, ADRs, docs, decks) stays plain
professional English, and the voice recedes entirely when production is broken or the
debugging goes long.

## How it loads

Run `python3 install.py` after cloning this repository. The installer
adds a managed import to `~/.claude/CLAUDE.md`, registers Claude Code lifecycle
hooks, and installs user-level skills and instructions for Claude Code and Copilot
Agent Host.
Existing unrelated user instructions and Claude settings are preserved.

Claude Code runs the Oni session and persistence hooks. Copilot Agent Host loads
the global instructions and skills, but does not run these lifecycle hooks. Other
assistant harnesses need their own adapter; Copilot sessions must not claim that
records were committed or pushed automatically.

## Layout

    CLAUDE.md              entry point, auto-loaded
    core/
      persona.md           voice, register, hard limits
      principles.md        engineering non-negotiables
      stack.md             environment, tooling, Docker/git conventions
    projects/<name>.md     per-project context
    sessions/<name>.md     project-specific live working state
    plans/<slug>.md        resumable multi-step plans
    tickets/open|done/     work records — problem, story, criteria, changes
    library/
      fixes/               solved problems, searched by symptom
      patterns/            reusable approaches
      decisions/           ADRs
    skills/                auto-triggering capabilities
    hooks/                 lifecycle automation
    templates/             ticket, ADR, library item, project, plan, session

## Skills

| Skill | Fires on |
|---|---|
| `ticket` | Substantive work starting, completing, changing state |
| `prd` | A feature/initiative proposed, needing sign-off before build |
| `adr` | A decision between real alternatives |
| `library` | Before solving something familiar; after solving something reusable |
| `plan` | Multi-step work; "resume", "where were we" |
| `scaffold` | New Laravel classes, to house conventions |
| `recall` | "do you remember", "when did we", "have we" |
| `handoff` | Status reports for other people |
| `deck` | Slide decks |

## Automation

| Hook | When | Does |
|---|---|---|
| `session-start.sh` | Claude Code session start | Syncs from the configured upstream, prints project state + open tickets |
| `auto-persist.sh` | Claude Code turn end | Commits and pushes only Oni records |
| `session-end.sh` | Claude Code session end | Performs a final blocking record commit and push |

Persistence stages only `sessions/`, `plans/`, `tickets/`, `library/`, and `projects/`.
It refuses to run if the Git index already contains staged changes, so unrelated
work is not swept into a memory commit. Commit or push failures are reported.

## New machine

    git clone <remote> ~/Developer/oni
    cd ~/Developer/oni
    python3 install.py

The checkout may live anywhere. Hook paths are resolved from the scripts, and
project notes and session files contain no machine-specific checkout paths. If the
checkout is moved, remove its stale user-level skill links and rerun the installer.
