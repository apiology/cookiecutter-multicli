#!/usr/bin/env bash
# Propagate universal upgrader script + Makefile hooks across cascade repos.
set -uo pipefail

ORG=apiology
BRANCH="fix/upgrader-universal-20260710"
CANONICAL_REF="${CANONICAL_REF:-${BRANCH}}"
CANONICAL_REPO="${CANONICAL_REPO:-cookiecutter-cookiecutter}"
WORKTREE_BASE="${WORKTREE_BASE:-${HOME}/.cursor/worktrees}"
SRC_ROOT="${SRC_ROOT:-${HOME}/src}"

repo_dir() {
  local repo=$1
  local src="${SRC_ROOT}/${repo}"
  if [ -d "${src}" ] && [ "$(git -C "${src}" rev-parse --is-inside-work-tree 2>/dev/null || echo false)" = "true" ]; then
    printf '%s\n' "${src}"
    return 0
  fi
  local wt="${WORKTREE_BASE}/${repo}/fix187-upgrader"
  if [ ! -e "${wt}/.git" ] && [ ! -f "${wt}/.git" ]; then
    mkdir -p "${WORKTREE_BASE}/${repo}"
    git -C "${src}" fetch origin main -q
    git -C "${src}" worktree add -B "${BRANCH}" "${wt}" origin/main >/dev/null 2>&1
  fi
  printf '%s\n' "${wt}"
}

REPOS=(
  cookiecutter-chrome-extension cookiecutter-multicli cookiecutter-docker-image
  cookiecutter-pypackage cookiecutter-ruby cookiecutter-gem cookiecutter-rails
  cookiecutter-terraform filer-for-asana upvoter-for-asana plate-spinner-extension
  shortcuts-for-asana wip-limiter docker-circleci docker-circleci-python
  docker-circleci-ruby docker-rubymegamix checkoff plate-spinner
  plate-spinner-rails apiology-tf
)

TEMPLATE_REPOS=(
  cookiecutter-chrome-extension cookiecutter-multicli cookiecutter-docker-image
  cookiecutter-pypackage cookiecutter-ruby cookiecutter-gem cookiecutter-rails
  cookiecutter-terraform
)

# Nested Makefile gets Sorbet hook (stamped into baked apps)
SORBET_NESTED=(cookiecutter-gem cookiecutter-rails cookiecutter-ruby)

# Root Makefile gets Sorbet hook (baked apps)
SORBET_ROOT=(checkoff apiology-tf plate-spinner plate-spinner-rails)

CANON_DIR="${CANON_DIR:-/Users/broz/.cursor/worktrees/cookiecutter-cookiecutter/983e}"
SCRIPT="${CANON_DIR}/bin/cookiecutter_project_upgrader.sh"

fetch_canonical() {
  if [ -f "${SCRIPT}" ]; then
    return 0
  fi
  mkdir -p "${CANON_DIR}/bin"
  gh api "repos/${ORG}/${CANONICAL_REPO}/contents/bin/cookiecutter_project_upgrader.sh?ref=${CANONICAL_REF}" \
    --jq .content | base64 -d >"${SCRIPT}"
}

copy_script() {
  local dest=$1
  mkdir -p "$(dirname "${dest}")"
  cp "${SCRIPT}" "${dest}"
  chmod +x "${dest}"
}

fix_makefile() {
  local file=$1 sorbet_hook=${2:-0}
  python3 - "${file}" "${sorbet_hook}" <<'PY'
import re, sys
path, sorbet = sys.argv[1], sys.argv[2] == "1"
with open(path) as f:
    content = f.read()

update = (
    "update_from_cookiecutter: ## Bring in changes from template project used to create this repo\n"
    "\tbin/cookiecutter_project_upgrader.sh\n"
    "\t@$(MAKE) post_cookiecutter_sync\n"
)
if sorbet:
    post = (
        "post_cookiecutter_sync: ## Ecosystem-specific steps after template sync\n"
        "\tgit checkout --theirs sorbet/rbi/gems || true\n"
        "\tbundle update --conservative json nokogiri rack rexml yard brakeman || true\n"
        "\t( make build && git add Gemfile.lock ) || true\n"
        "\tbin/spoom srb bump || true\n"
    )
else:
    post = (
        "post_cookiecutter_sync: ## Ecosystem-specific steps after template sync (empty by default)\n"
        "\t@:\n"
    )

new_content, n = re.subn(
    r"^update_from_cookiecutter:.*?(?=^[A-Za-z0-9_.-]+:|\Z)",
    update + "\n" + post + "\n",
    content,
    count=1,
    flags=re.M | re.S,
)
if n != 1:
    raise SystemExit(f"update_from_cookiecutter not found in {path}")

if "post_cookiecutter_sync" in content and n == 1:
    new_content, n2 = re.subn(
        r"^post_cookiecutter_sync:.*?(?=^[A-Za-z0-9_.-]+:|\Z)",
        post + "\n",
        new_content,
        count=1,
        flags=re.M | re.S,
    )

if "post_cookiecutter_sync" not in content.split("update_from_cookiecutter")[0]:
    if ".PHONY:" in new_content and "post_cookiecutter_sync" not in new_content.split(".PHONY:")[1].split("\n")[0]:
        new_content = re.sub(
            r"^(\.PHONY:.*?)(update_from_cookiecutter)",
            r"\1post_cookiecutter_sync \2",
            new_content,
            count=1,
            flags=re.M,
        )

with open(path, "w") as f:
    f.write(new_content)
PY
}

run_git() {
  local dir=$1
  shift
  (cd "${dir}" && git -c core.hooksPath=/dev/null "$@")
}

is_in() {
  local needle=$1
  shift
  for x in "$@"; do [ "${x}" = "${needle}" ] && return 0; done
  return 1
}

fetch_canonical

TARGET_REPOS=("${REPOS[@]}")
if [ "$#" -gt 0 ]; then
  TARGET_REPOS=("$@")
fi

for repo in "${TARGET_REPOS[@]}"; do
  dir="$(repo_dir "${repo}")"
  [ -d "${dir}" ] || { echo "SKIP ${repo}: no worktree at ${dir}"; continue; }
  echo "==> ${repo} (${dir})"

  if ! run_git "${dir}" fetch origin main -q; then
    echo "   FAIL fetch"; continue
  fi
  if ! run_git "${dir}" checkout -B "${BRANCH}" origin/main; then
    echo "   FAIL checkout"; continue
  fi

  copy_script "${dir}/bin/cookiecutter_project_upgrader.sh"

  root_sorbet=0
  is_in "${repo}" "${SORBET_ROOT[@]}" && root_sorbet=1
  fix_makefile "${dir}/Makefile" "${root_sorbet}"

  if is_in "${repo}" "${TEMPLATE_REPOS[@]}"; then
    nested_dir="${dir}/{{cookiecutter.project_slug}}"
    copy_script "${nested_dir}/bin/cookiecutter_project_upgrader.sh"
    nested_sorbet=0
    is_in "${repo}" "${SORBET_NESTED[@]}" && nested_sorbet=1
    if [ -f "${nested_dir}/Makefile" ]; then
      fix_makefile "${nested_dir}/Makefile" "${nested_sorbet}"
    fi
  fi

  run_git "${dir}" add bin/cookiecutter_project_upgrader.sh Makefile
  if is_in "${repo}" "${TEMPLATE_REPOS[@]}"; then
    run_git "${dir}" add "{{cookiecutter.project_slug}}/bin/cookiecutter_project_upgrader.sh" "{{cookiecutter.project_slug}}/Makefile" 2>/dev/null || true
  fi

  if run_git "${dir}" diff --cached --quiet; then
    echo "   (no changes)"
    continue
  fi

  run_git "${dir}" commit -m "$(cat <<EOF
Converge on universal cookiecutter upgrader script.

Single bin/cookiecutter_project_upgrader.sh; ecosystem post-sync in Makefile post_cookiecutter_sync.
EOF
)"
  run_git "${dir}" push -u origin "${BRANCH}" || true
  gh pr create --repo "${ORG}/${repo}" --head "${BRANCH}" --title "Converge on universal cookiecutter upgrader script" --body "$(cat <<EOF
## Summary
- Universal \`bin/cookiecutter_project_upgrader.sh\` (matches cookiecutter-cookiecutter).
- \`update_from_cookiecutter\` calls script then \`post_cookiecutter_sync\`.

## Test plan
- [ ] \`script/audit_upgrader_convergence.sh\` passes for this repo
EOF
)" 2>/dev/null || echo "   PR may already exist"
done

echo "Done."
