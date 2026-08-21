#!/usr/bin/env bash
# SessionEnd — final flush and push, blocking so nothing is lost on exit.
set -uo pipefail
ONI="/var/www/personal/oni"
cd "$ONI" || exit 0
git add --renormalize -A 2>/dev/null
git diff --cached --quiet 2>/dev/null || git commit -q -m "oni: session end $(date +%F)" 2>/dev/null
git push -q origin main 2>/dev/null
exit 0
