#!/usr/bin/env python

import os
import shutil
import subprocess

PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)


def remove_file(filepath):
    os.remove(os.path.join(PROJECT_DIRECTORY, filepath))


def remove_directory(filepath):
    shutil.rmtree(filepath)


if __name__ == '__main__':
    if 'no' == '{{ cookiecutter.options }}':
        remove_file('src/config.ts')
        remove_file('src/config.test.ts')
        remove_file('src/__mocks__/test-config.ts')
        remove_file('src/chrome-extension/chrome-extension-config.ts')
        remove_file('src/chrome-extension/chrome-extension-config.test.ts')
        remove_file('src/cache.ts')
        remove_file('src/alfred/alfred-config.ts')
        remove_file('src/alfred/alfred-cache.ts')
        remove_file('src/chrome-extension/chrome-extension-cache.ts')
        remove_file('src/chrome-extension/chrome-extension-cache.test.ts')
        remove_file('src/chrome-extension/options.ts')
        remove_file('src/chrome-extension/options.test.ts')
        remove_file('static/chrome-extension/options.html')

    if 'no' == '{{ cookiecutter.asana_api }}':
        remove_file('src/asana-base.ts')
        remove_file('src/asana-typeahead.ts')
        remove_directory('polyfills')

    if 'no' == '{{ cookiecutter.service_worker }}':
        remove_file('src/chrome-extension/background.ts')
        remove_file('src/chrome-extension/background.test.ts')

    if 'no' == '{{ cookiecutter.content_script }}':
        remove_file('src/chrome-extension/content-script.ts')
        remove_file('src/chrome-extension/content-script.test.ts')

    if 'Not open source' == '{{ cookiecutter.open_source_license }}':
        remove_file('LICENSE')
        remove_file('CONTRIBUTING.rst')

    subprocess.check_call('./fix.sh')
    if os.environ.get('IN_COOKIECUTTER_PROJECT_UPGRADER', '0') == '1':
        os.environ['SKIP_GIT_CREATION'] = '1'
        os.environ['SKIP_GITHUB_AND_CIRCLECI_CREATION'] = '1'

    if os.environ.get('SKIP_GIT_CREATION', '0') != '1':
        # Don't run these non-idempotent things when in
        # cookiecutter_project_upgrader, which will run this hook
        # multiple times over its lifetime.
        subprocess.check_call(['git', 'init'])
        subprocess.check_call(['git', 'add', '-A'])
        subprocess.check_call(['bundle', 'exec', 'overcommit', '--install'])
        subprocess.check_call(['bundle', 'exec', 'overcommit', '--sign'])
        subprocess.check_call(['bundle', 'exec', 'overcommit', '--sign', 'pre-commit'])
        subprocess.check_call(['bundle', 'exec', 'git', 'commit', '-m',
                               'Initial commit from boilerplate'])

    if os.environ.get('SKIP_GITHUB_AND_CIRCLECI_CREATION', '0') != '1':
        if 'none' != '{{ cookiecutter.type_of_github_repo }}':
            if 'private' == '{{ cookiecutter.type_of_github_repo }}':
                visibility_flag = '--private'
            elif 'public' == '{{ cookiecutter.type_of_github_repo }}':
                visibility_flag = '--public'
            else:
                raise RuntimeError('Invalid argument to '
                                   'cookiecutter.type_of_github_repo: '
                                   '{{ cookiecutter.type_of_github_repo }}')
            description = "{{ cookiecutter.project_short_description.replace('\"', '\\\"') }}"
            subprocess.check_call(['gh', 'repo', 'create',
                                   visibility_flag,
                                   '--description',
                                   description,
                                   '--source',
                                   '.',
                                   '{{ cookiecutter.github_username }}/'
                                   '{{ cookiecutter.project_slug }}'])
            subprocess.check_call(['gh', 'repo', 'edit',
                                   '--allow-update-branch',
                                   '--enable-auto-merge',
                                   '--delete-branch-on-merge'])
            subprocess.check_call(['git', 'push'])
            subprocess.check_call(['circleci', 'follow'])
            subprocess.check_call(['git', 'branch', '--set-upstream-to=origin/main', 'main'])
