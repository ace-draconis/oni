#!/usr/bin/env bash
# Stop — commit whatever Oni recorded this turn. Silent unless something changed.
set -uo pipefail
ONI="/var/www/personal/oni"
cd "$ONI" || exit 0

git add --renormalize -A 2>/dev/null
if git diff --cached --quiet 2>/dev/null; then
  exit 0   # nothing recorded, nothing to say
fi

# Name the commit after what actually changed
changed="$(git diff --cached --name-only | head -3 | xargs -n1 basename 2>/dev/null | paste -sd', ' -)"
git commit -q -m "oni: ${changed}" 2>/dev/null
git push -q origin main 2>/dev/null &
exit 0
