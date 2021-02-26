.PHONY: all clean test help quality
.DEFAULT_GOAL := default

BAKE_OPTIONS=--no-input

define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT


all: test quality

clean: ## remove all built artifacts

default: test ## run default typechecking and tests

test: ## run tests quickly
	pytest

quality: ## run precommit quality checks
	bundle exec overcommit --run

help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

bake: ## generate project using defaults
	cookiecutter $(BAKE_OPTIONS) . --overwrite-if-exists

watch: bake ## generate project using defaults and watch for changes
	watchmedo shell-command -p '*.*' -c 'make bake -e BAKE_OPTIONS=$(BAKE_OPTIONS)' -W -R -D \cookiecutter-chrome-extension/

replay: BAKE_OPTIONS=--replay ## replay last cookiecutter run and watch for changes
replay: watch
	;

update_from_cookiecutter: ## Bring in changes from template project used to create this repo
	git checkout main && bundle exec overcommit --sign && git pull && git checkout -b update-from-upstream-cookiecutter-$$(date +%Y-%m-%d-%H%M)
	git fetch upstream
	git fetch -a
	git merge upstream/main --allow-unrelated-histories || true
	@echo
	@echo "Please resolve any merge conflicts below and push up a PR with:"
	@echo
	@echo '   gh pr create --title "Update from upstream" --body "Automated PR to update from upstream"'
	@echo
	@echo
