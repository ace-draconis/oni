---
id: ADR-003
title: Markdown hub as a separate dependency-light local Node app
project: oni
date: 2026-10-16
status: accepted
---

## Context
Reports, notes, research, todo lists and Oni records were spread across
separate tools. A single local view was needed that renders GitHub-flavoured
Markdown and Mermaid diagrams from several folders, and that can create and
edit notes and todo lists. Markdown files on disk must remain the source of
truth so that git can diff every change. The existing Oni Kanban (`kanban/`)
is a dependency-free Node CLI with a read-only web view over a JSON board and
an append-only audit log.

## Options
**A. Extend the Oni Kanban** — add document views to `kanban/`. Pros: one server. Cons: mixes a gated JSON workflow with free-form Markdown, and the Kanban web view is deliberately read-only.
**B. New plain Node app (`hub/`)** — built-in `http` server, vanilla ES modules, and marked, DOMPurify and Mermaid served from `node_modules`. Pros: no build step, three runtime libraries, same style as the Kanban. Cons: DOM code is written by hand.
**C. Framework app (Vite with Vue or React)** — Pros: component model and hot reload. Cons: build toolchain and more dependencies to maintain for a single-user tool.
**D. Off-the-shelf tool (Obsidian or a static-site generator)** — Pros: no code to maintain. Cons: no control over multiple configured sources, Oni-specific todo handling, or loopback-only access.

## Decision
Option B. It is the smallest stack that meets the requirements. It keeps
Markdown as the only storage format, and it leaves the Kanban's workflow
rules untouched. New notes and todo lists go to `library/notes/` and
`library/todos/`, which the existing persistence hook already commits.

## Consequences
Hub edits are persisted by the Oni hooks without any change to them. The hub
links to the Kanban rather than embedding it. If board data should appear in
the hub later, read `kanban/data/board.json` through a read-only endpoint
instead of merging the apps. Saves are refused when the file changed on disk
since it was opened, which protects records written concurrently by assistant
sessions. Revisit the note and todo locations if `library/` search becomes
noisy. The alternative is top-level `notes/` and `todos/` folders added to the
hook's record paths.
