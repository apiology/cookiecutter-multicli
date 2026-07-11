#!/usr/bin/env bash
# Verify universal upgrader convergence across cascade repos.
set -euo pipefail

ORG=apiology
CANONICAL_REF="${CANONICAL_REF:-fix/upgrader-universal-20260710}"
CANONICAL_REPO="${CANONICAL_REPO:-cookiecutter-cookiecutter}"
SCAN_ROOT="${SCAN_ROOT:-${HOME}/src}"

REPOS=(
  cookiecutter-cookiecutter cookiecutter-chrome-extension cookiecutter-multicli
  cookiecutter-docker-image cookiecutter-pypackage cookiecutter-ruby
  cookiecutter-gem cookiecutter-rails cookiecutter-terraform
  filer-for-asana upvoter-for-asana plate-spinner-extension
  shortcuts-for-asana wip-limiter docker-circleci docker-circleci-python
  docker-circleci-ruby docker-rubymegamix checkoff plate-spinner
  plate-spinner-rails apiology-tf
)

TEMPLATE_REPOS=(
  cookiecutter-cookiecutter cookiecutter-chrome-extension cookiecutter-multicli
  cookiecutter-docker-image cookiecutter-pypackage cookiecutter-ruby
  cookiecutter-gem cookiecutter-rails cookiecutter-terraform
)

SORBET_REPOS=(
  cookiecutter-gem cookiecutter-rails cookiecutter-ruby
  checkoff apiology-tf plate-spinner plate-spinner-rails
)

NESTED=" {{cookiecutter.project_slug}}/bin/cookiecutter_project_upgrader.sh"

canonical_sha() {
  gh api "repos/${ORG}/${CANONICAL_REPO}/contents/bin/cookiecutter_project_upgrader.sh?ref=${CANONICAL_REF}" \
    --jq .content | base64 -d | shasum -a 256 | awk '{print $1}'
}

file_sha() {
  shasum -a 256 "$1" | awk '{print $1}'
}

has_worktree_shim() {
  local f=$1
  rg -q 'git-worktree-pointer' "${f}"
  rg -q 'GIT_WORKTREE_SHIM=1' "${f}"
  rg -q 'cleanup_prepare' "${f}"
}

makefile_delegates() {
  local mk=$1
  rg -q 'bin/cookiecutter_project_upgrader\.sh' "${mk}" || return 1
  rg -q 'post_cookiecutter_sync' "${mk}" || return 1
  if rg -q '^update_from_cookiecutter:' "${mk}" -A8 | rg -q 'cookiecutter_project_upgrader --help'; then
    return 1
  fi
  if rg -q '^update_from_cookiecutter:' "${mk}" -A8 | rg -q 'bundle exec overcommit --uninstall'; then
    return 1
  fi
  return 0
}

makefile_has_sorbet_hook() {
  local mk=$1
  rg -q 'spoom srb bump' "${mk}" || rg -q 'sorbet/rbi/gems' "${mk}"
}

script_has_sorbet_tail() {
  local f=$1
  rg -q 'spoom srb bump|sorbet/rbi/gems' "${f}" 2>/dev/null
}

CANON_SHA="$(canonical_sha)"
echo "Canonical SHA (${CANONICAL_REPO}@${CANONICAL_REF}): ${CANON_SHA}"
echo

fail=0
for repo in "${REPOS[@]}"; do
  dir="${SCAN_ROOT}/${repo}"
  root="${dir}/bin/cookiecutter_project_upgrader.sh"
  mk="${dir}/Makefile"
  issues=()

  if [ ! -f "${root}" ]; then
    issues+=("missing root script")
  else
    sha="$(file_sha "${root}")"
    [ "${sha}" = "${CANON_SHA}" ] || issues+=("root script SHA mismatch (${sha:0:12}…)")
    has_worktree_shim "${root}" || issues+=("root script missing worktree shim")
    script_has_sorbet_tail "${root}" && issues+=("root script has sorbet tail (belongs in Makefile)")
  fi

  if [ ! -f "${mk}" ]; then
    issues+=("missing Makefile")
  elif ! makefile_delegates "${mk}"; then
    issues+=("Makefile not delegating to script + post_cookiecutter_sync")
  fi

  is_sorbet=0
  for s in "${SORBET_REPOS[@]}"; do [ "${s}" = "${repo}" ] && is_sorbet=1; done
  if [ "${is_sorbet}" -eq 1 ] && [ -f "${mk}" ] && ! makefile_has_sorbet_hook "${mk}"; then
    issues+=("Sorbet repo missing post_cookiecutter_sync hook")
  fi
  if [ "${is_sorbet}" -eq 0 ] && [ -f "${mk}" ] && makefile_has_sorbet_hook "${mk}"; then
    issues+=("non-Sorbet repo has sorbet hook in Makefile")
  fi

  is_template=0
  for t in "${TEMPLATE_REPOS[@]}"; do [ "${t}" = "${repo}" ] && is_template=1; done
  if [ "${is_template}" -eq 1 ]; then
    nested="${dir}/${NESTED# }"
    if [ ! -f "${nested}" ]; then
      issues+=("missing nested script")
    else
      nsha="$(file_sha "${nested}")"
      [ "${nsha}" = "${CANON_SHA}" ] || issues+=("nested script SHA mismatch")
      script_has_sorbet_tail "${nested}" && issues+=("nested script has sorbet tail")
    fi
    nmk="${dir}/{{cookiecutter.project_slug}}/Makefile"
    if [ -f "${nmk}" ] && ! makefile_delegates "${nmk}"; then
      issues+=("nested Makefile not delegating")
    fi
  fi

  if [ "${#issues[@]}" -eq 0 ]; then
    echo "OK  ${repo}"
  else
    echo "FAIL ${repo}: ${issues[*]}"
    fail=1
  fi
done

exit "${fail}"
