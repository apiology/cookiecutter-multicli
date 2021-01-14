#!/bin/bash -e

git init
git add .
git commit -m "Initial code from https://github.com/apiology/cookiecutter-chrome-extension"
echo "Run 'hub create [--private]' to create this repo in GitHub, then 'git push' to send up the new main branch"
