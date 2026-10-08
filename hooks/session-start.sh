#!/usr/bin/env bash
# SessionStart — sync memory from other machines, surface where we left off.
set -uo pipefail
ONI="${ONI:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
workspace="${CLAUDE_PROJECT_DIR:-${COPILOT_WORKSPACE:-$PWD}}"
project_root="$(git -C "$workspace" rev-parse --show-toplevel 2>/dev/null || printf '%s' "$workspace")"
project_name="$(basename "$project_root")"
project_slug="$(printf '%s' "$project_name" | tr -cs '[:alnum:]_.-' '-')"
cd "$ONI" || {
  printf 'Oni: cannot access the repository at %s\n' "$ONI" >&2
  exit 1
}

if ! git pull --rebase --autostash --quiet; then
  printf 'Oni: failed to sync memory from the configured upstream; continuing with local records.\n' >&2
fi

echo "<oni-session-state>"
printf '## Project: %s\n' "$project_name"
printf '## Live state: sessions/%s.md\n' "$project_slug"
if [ -f "$ONI/sessions/$project_slug.md" ]; then
  sed -n '1,40p' "$ONI/sessions/$project_slug.md"
else
  printf '**Task**: —\n\n## Open threads\n—\n\n## Next step\nawaiting direction\n'
fi

# Open tickets for the project we're actually in
open_tickets="$(grep -rlF "project: ${project_name}" tickets/open 2>/dev/null | head -5)"
if [ -n "$open_tickets" ]; then
  echo ""
  echo "## Open tickets — ${project_name}"
  for t in $open_tickets; do
    echo "- $(basename "$t" .md): $(grep -m1 '^title:' "$t" | sed 's/^title: //')"
  done
fi
echo "</oni-session-state>"
