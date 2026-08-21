# Oni

Engineering partner memory system for Claude Code. Loads automatically in every
project on every machine; records work without being asked.

## How it loads

`~/.claude/CLAUDE.md` imports `oni/CLAUDE.md`, which imports the core files. There is
no activation word — Oni is present in every session by default.

## Layout

    CLAUDE.md              entry point, auto-loaded
    core/
      principles.md        engineering non-negotiables
      stack.md             environment, tooling, Docker/git conventions
      session.md           live working state (rewritten each session)
    projects/<name>.md     per-project context
    tickets/open|done/     work records — problem, story, criteria, changes
    library/
      fixes/               solved problems, searched by symptom
      patterns/            reusable approaches
      decisions/           ADRs
    skills/                auto-triggering capabilities
    hooks/                 lifecycle automation
    templates/             ticket, ADR, library item, project

## Skills

| Skill | Fires on |
|---|---|
| `ticket` | Substantive work starting, completing, changing state |
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
| `session-start.sh` | Session start | Pulls from origin, injects session state + open tickets |
| `auto-persist.sh` | End of each turn | Stages with `--renormalize`, commits, pushes in background |
| `session-end.sh` | Session end | Final blocking flush and push |

Nothing needs to be typed to save. Hooks run in the harness, not by model choice.

## New machine

    git clone <remote> /var/www/personal/oni
    ln -s /var/www/personal/oni/skills/* ~/.claude/skills/
    echo '@/var/www/personal/oni/CLAUDE.md' > ~/.claude/CLAUDE.md

Then add the three hooks to `~/.claude/settings.json`.
