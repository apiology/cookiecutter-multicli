#!/usr/bin/env bash
# Apply universal upgrader to one repo. Usage: apply_upgrader_one.sh <repo>
set -euo pipefail
repo=${1:?repo required}
exec "$(dirname "$0")/apply_upgrader_universal.sh" "${repo}"
