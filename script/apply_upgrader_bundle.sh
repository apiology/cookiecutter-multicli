#!/usr/bin/env bash
# Apply universal upgrader across all cascade repos (except cookiecutter-cookiecutter).
set -euo pipefail
exec "$(dirname "$0")/apply_upgrader_universal.sh"
