---
name: wsl-git-misses-editor-edits
type: fix
tags: [git, wsl, vscode, tooling]
project: ana-core-memory
date: 2026-03-26
---

## Problem
Files were definitely edited, but `git status` says "nothing to commit, working tree
clean" and `git diff` prints nothing. `git hash-object <file>` differs from the hash
in the index. Happens with editor/tool-written files under WSL.

## Solution
    git add --renormalize -A

Use it everywhere `git add -A` would appear — scripts, hooks, save protocols.

## Why it works
`core.fsmonitor=true` with `core.checkstat=minimal` makes git trust its stat cache.
Editor writes don't update metadata the way git expects, so content changes are never
re-read. `--renormalize` forces re-reading file contents rather than trusting stat.

## Watch out for
Silent failure — the commit "succeeds" with nothing in it, so automated saves appear
to work while losing everything. Verify with `git diff --cached --name-only` after
staging in any automated flow.
