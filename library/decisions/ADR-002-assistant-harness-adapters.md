---
id: ADR-002
title: Share core guidance through harness-specific adapters
project: oni
date: 2026-10-08
status: accepted
---

## Context
The shared persona, engineering principles, and project memory need to load across
different assistant harnesses. Each harness has its own user-level instruction,
skill, and lifecycle-hook conventions.

## Options
**A. Duplicate the full guidance into each harness configuration** — each assistant
gets a self-contained native file. Pros: direct loading. Cons: copies drift as the
shared guidance changes.
**B. Keep one canonical core and install small harness-specific adapters** — each
assistant gets native configuration that points back to the shared repository.
Pros: one source of truth. Cons: each supported harness needs an adapter, and
lifecycle capabilities can differ.

## Decision
Use a single canonical Oni repository with a repeatable installer for each supported
harness. Keep Claude Code lifecycle hooks and Copilot Agent Host instructions
separate, and state clearly where automation differs.

## Consequences
Core guidance and skills have one maintained source. Adding another assistant
requires a tested adapter rather than copying the core. Copilot Agent Host does not
run the Claude Code hooks, so its setup cannot promise automatic record persistence.
