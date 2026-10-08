#!/usr/bin/env bash
# SessionEnd — final flush and push, blocking so nothing is lost on exit.
set -uo pipefail
ONI="${ONI:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
exec "$ONI/hooks/persist-records.sh" "oni: session end $(date +%F)"
