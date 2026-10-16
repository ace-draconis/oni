---
id: ONI-003
title: Browse and edit Markdown records in one local hub
project: oni
status: done
opened: 2026-10-16
closed: 2026-10-16
---

## Title
Browse and edit Markdown records in one local hub

## Status
Done — 2026-10-16.

## Problem Statement
Reports, notes, research, todo lists and assistant records were kept in
separate tools and folders. Finding and updating them meant switching between
editors and repositories. Diagrams and tables in reports were only readable as
raw text. There was no single place to keep running notes and todo lists that
also stays in version control.

## User Story
As a developer working across several repositories, I need one local view of
my Markdown records with in-place note and todo editing so that I can find,
read and update my work without leaving plain files and git.

## Acceptance Criteria
- [x] Several configured folders can be browsed together, each marked as editable or read-only.
- [x] Markdown renders with tables, task lists and frontmatter, and Mermaid diagrams render as images.
- [x] SVG and bitmap images can be viewed on their own or inside documents.
- [x] Notes can be created and edited from the browser and are saved as Markdown on disk.
- [x] Todo lists can be created, and their items can be added, ticked and removed from the browser.
- [x] An edit made elsewhere is never silently overwritten.
- [x] New notes and todo lists are committed by the existing Oni persistence hook.

## Changes
| File | Change |
|---|---|
| `hub/server.js` | Added a loopback-only HTTP server with a JSON API for listing, reading, saving and creating Markdown, and serving images. |
| `hub/lib/` | Added config loading, path-confined file access with modified-time conflict checks, and new note and todo templates. |
| `hub/public/` | Added the browser UI: source tree, recent files, Markdown and Mermaid rendering, split editor, and todo controls. |
| `hub/hub.config.json` | Configured Oni (writable) and the Sentinel infra reports folder (read-only) as sources. |
| `hub/test/source-files.test.js` | Added tests for listing, path confinement, conflict detection, read-only sources and file creation. |
| `hub/README.md` | Documented running, configuration and persistence. |
| `library/decisions/ADR-003-markdown-hub-as-separate-local-app.md` | Recorded the choice of a separate plain Node app over extending the Kanban. |

## Notes
Mermaid output is not passed through a second DOMPurify sanitisation, because
that strips the node labels. Mermaid's `strict` security level sanitises the
labels itself, and a label containing an HTML event handler was confirmed
inert. The hub source in `hub/` is not covered by the persistence hook and must
be committed by hand.
