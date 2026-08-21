#!/usr/bin/env bash
# SessionStart — sync memory from other machines, surface where we left off.
set -uo pipefail
ONI="/var/www/personal/oni"
cd "$ONI" || exit 0

git pull --rebase --autostash --quiet origin main 2>/dev/null

echo "<oni-session-state>"
sed -n '1,40p' core/session.md 2>/dev/null

# Open tickets for the project we're actually in
proj="$(basename "${CLAUDE_PROJECT_DIR:-$PWD}")"
open_tickets="$(grep -rl "project: ${proj}" tickets/open 2>/dev/null | head -5)"
if [ -n "$open_tickets" ]; then
  echo ""
  echo "## Open tickets — ${proj}"
  for t in $open_tickets; do
    echo "- $(basename "$t" .md): $(grep -m1 '^title:' "$t" | sed 's/^title: //')"
  done
fi
echo "</oni-session-state>"
