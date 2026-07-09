#!/usr/bin/env python

import os
import shutil
import subprocess

PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)


def run(*args, **kwargs):
    if len(kwargs) > 0:
        print('running with kwargs', kwargs, ':', *args, flush=True)
    else:
        print('running', *args, flush=True)
    # keep both streams in the same place so that we can weave
    # together what happened on report instead of having them
    # dumped separately
    subprocess.check_call(*args, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, **kwargs)


def remove_file(filepath):
    os.remove(os.path.join(PROJECT_DIRECTORY, filepath))


def remove_directory(filepath):
    shutil.rmtree(filepath)


if __name__ == '__main__':
    # Add bin directory at start of PATH
    os.environ['PATH'] = os.path.join(PROJECT_DIRECTORY, 'bin') + os.pathsep + os.environ['PATH']

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
        remove_file('src/asana-typeahead.test.ts')
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

    if os.environ.get('IN_COOKIECUTTER_PROJECT_UPGRADER', '0') == '1':
        os.environ['SKIP_GIT_CREATION'] = '1'
        os.environ['SKIP_EXTERNAL'] = '1'

    if os.environ.get('SKIP_GIT_CREATION', '0') != '1':
        # Don't run these non-idempotent things when in
        # cookiecutter_project_upgrader, which will run this hook
        # multiple times over its lifetime.
        run(['git', 'init'])
        run(['git', 'add', '-A'])
        run(['git', 'commit', '--allow-empty',
             '--no-verify',
             '-m', 'Initial commit from boilerplate'])
    #
    # (any file addition/modification from the outside world goes here)
    #
    run('./fix.sh')
    # (any lint-based auto-fixes here)
    #
    # (commit here if you brought in any files above)
    #
    # fix.sh installs Node via nvm in a subprocess; reload nvm into this
    # process so make/npm are on PATH for the bake build step.
    nvm_dir = os.environ.get('NVM_DIR', os.path.expanduser('~/.nvm'))
    nvm_sh = os.path.join(nvm_dir, 'nvm.sh')
    if os.path.isfile(nvm_sh):
        os.environ['NVM_DIR'] = nvm_dir
        nvm_path_cmd = (
            f'. "{nvm_sh}" && '
            '(nvm use default >/dev/null 2>&1 || '
            'nvm use >/dev/null 2>&1 || true); '
            'printf %s "$PATH"'
        )
        path_with_nvm = subprocess.check_output(
            ['bash', '-c', nvm_path_cmd],
            text=True,
        )
        os.environ['PATH'] = path_with_nvm
    run(['make', 'build-typecheck'])  # update from bundle updates
    run(['git', 'add', '-A'])
    run(['bundle', 'exec', 'git', 'commit', '--allow-empty', '-m',
         'reformat'])

    if os.environ.get('SKIP_EXTERNAL', '0') != '1':
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
            # if repo doesn't already exist
            if subprocess.call(['gh', 'repo', 'view',
                                '{{ cookiecutter.github_username }}/'
                                '{{ cookiecutter.project_slug }}']) != 0:
                run(['gh', 'repo', 'create',
                     visibility_flag,
                     '--description',
                     description,
                     '--source',
                     '.',
                     '{{ cookiecutter.github_username }}/'
                     '{{ cookiecutter.project_slug }}'])
                run(['gh', 'repo', 'edit',
                     '--allow-update-branch',
                     '--enable-auto-merge',
                     '--delete-branch-on-merge'])
            run(['git', 'push'])
            run(['circleci', 'follow'])
            run(['git', 'branch', '--set-upstream-to=origin/main', 'main'])
