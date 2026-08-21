---
id: ADR-001
title: Fat-Free Framework for the FMS modernisation
project: f3-fms
date: 2026-05-04
status: accepted
---

## Context
Legacy procedural PHP case-management app needed modernising. Production is shared
hosting: no SSH, no Composer, no npm, no build step. Any framework requiring
server-side tooling was off the table.

## Options
**A. Laravel** — familiar, full-featured, matches house conventions. Requires
Composer and a build step on the server. Rejected: too heavy for shared hosting
without build tools.

**B. Fat-Free Framework** — single-file PHP microframework. Vendor locally, upload
via FTP. Far smaller ecosystem, fewer conventions to lean on.

**C. Continue with legacy procedural PHP** — zero migration risk, but the
maintainability problem that started this remains unsolved.

## Decision
Fat-Free Framework. It's the only option that gives structure while surviving the
deployment constraint. Vendor directory built locally and FTP'd.

Migration is incremental — port module by module with the legacy app still serving.

## Consequences
Makes easy: deploying to constrained hosting; gradual migration with no big-bang cut-over.

Makes hard: no Composer on the server means dependency updates are a manual local
build plus upload. Fewer conventions than Laravel, so project structure discipline
must come from us.

Revisit if hosting ever gains SSH/Composer — Laravel becomes viable again and the
incremental port would need re-evaluating.
