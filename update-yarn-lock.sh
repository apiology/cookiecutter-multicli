#!/bin/bash -e

# This appears to be safe enough for now.  May need to be revised to
# actually evaluate templates first in the future?

sed -i.bak -e 's/{{ cookiecutter.project_slug }}/my_fake_package/g' '{{cookiecutter.project_slug}}/package.json'
cd '{{cookiecutter.project_slug}}'
yarn install --no-progress
rm -fr node_modules
cd ..
sed -i.bak -e 's/my_fake_package/{{ cookiecutter.project_slug }}/g' '{{cookiecutter.project_slug}}/package.json'
