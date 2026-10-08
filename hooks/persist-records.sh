#!/usr/bin/env bash
# Commit only Oni's durable records; never absorb staged project or user changes.
set -uo pipefail

ONI="${ONI:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
message="${1:-oni: persist recorded work}"
cd "$ONI" || {
  printf 'Oni: cannot access the repository at %s\n' "$ONI" >&2
  exit 1
}

if ! git diff --cached --quiet; then
  printf 'Oni: refusing to persist because the index already contains staged changes. Commit or unstage them first.\n' >&2
  exit 1
fi

record_paths=(sessions plans tickets library projects)
if ! git add --renormalize -A -- "${record_paths[@]}" ||
   ! git add -A -- "${record_paths[@]}"; then
  printf 'Oni: failed to stage memory records.\n' >&2
  exit 1
fi

if git diff --cached --quiet; then
  exit 0
fi

if ! git commit -m "$message"; then
  printf 'Oni: failed to commit memory records; they remain staged locally.\n' >&2
  exit 1
fi

if ! git push --quiet; then
  printf 'Oni: records were committed locally, but pushing to the configured upstream failed.\n' >&2
  exit 1
fi
