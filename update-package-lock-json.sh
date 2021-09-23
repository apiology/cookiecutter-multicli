#!/bin/bash -e

# This appears to be safe enough for now.  May need to be revised to
# actually evaluate templates first in the future?

cd '{{cookiecutter.project_slug}}'
rm package-lock.json
npm i
