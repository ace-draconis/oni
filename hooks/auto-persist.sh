#!/usr/bin/env bash
# Stop — persist Oni records without staging project code or user changes.
set -uo pipefail
ONI="${ONI:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
exec "$ONI/hooks/persist-records.sh" "oni: persist recorded work"
