# Development

## fix.sh

If you want to use rbenv/pyenv/etc to manage versions of tools,
there's a `fix.sh` script which may be what you'd like to install
dependencies.

## Overcommit

This project uses [overcommit](https://github.com/sds/overcommit) for
quality checks.  `bundle exec overcommit --install` will install it.

## direnv

This project uses direnv to manage environment variables used during
development.  See the `.envrc` file for detail.

## Run Chrome extension from local checkout

1. Run 'make' to create the bundle with webpack, or 'make start' to
   start webpack in watch mode.
2. Go to [chrome://extensions/](chrome://extensions/)
3. Make sure 'Developer mode' is flipped on in the upper right.
4. Click the 'Load unpacked' button.
5. Choose the [dist/chrome-extension](./dist/chrome-extension) directory

## Run Alfred workflow from local checkout

1. `make`
2. `yarn install`  (only needed once)
3. You should now see the workflow show up in Alfred's configuration.

{% if cookiecutter.asana_api == 'yes' -%}
## Interactive development with Asana API

1. Save off the configured Asana client object in asana-base.ts#fetchClient():
   ```TypeScript
   const w: any = window;
   w.savedClient = fetchedClient;
  ```
2. Open up Extensions | {{cookiecutter.project_name}}
3. Click reload icon
4. Invoke filer on something
5. Save off the client in the Chrome DevTools console before the background session expires:
   ```TypeScript
   client = savedClient;
   ```
6. You can now invoke the methods from [node-asana](https://github.com/Asana/node-asana/tree/master/lib/resources):
   ```TypeScript
   stories = await client.stories.getStoriesForTask('1234);
   ```
{%- endif %}

## Initial release of Alfred package

Walk through these steps:

```sh
git stash && git checkout main && git pull
npm publish
alfy-cleanup
npm install -g alfred-{{cookiecutter.project_slug}} --upgrade
```

Then, load Alfred | Preferences | Workflows |
{{cookiecutter.project_name}}

right click | Edit Details | Description | Copy from README.md |
Category | (set as appropriate) | Save

right click | Export ... | Export | choose this directory | Export

Once done, make a GitHub release with the exported file:

```
new_release=$(npm version --json | jq -r '."alfred-{{cookiecutter.project_slug}}"')
gh release create v${new_release:?} '{{cookiecutter.project_name}}.alfredworkflow'
```

Drop the following markdown into README.md in the 'Installing Alfred workflow' section.

```markdown
Download and double click the latest release's [.alfredworkflow
file](https://github.com/{{cookiecutter.github_username}}/{{cookiecutter.project_slug}}/releases).
```

Remove this section.

## Releasing Alfred package

Related backlog tasks:

* Do npm Alfred release of cookiecutter-multicli projects in CircleCI (after other tests pass)

First, run these commands:

```sh
git stash && git checkout main && git pull && make
last_released_version=$(npm version --json | jq -r '."alfred-{{cookiecutter.project_slug}}"')
git log v${last_released_version:?}..
update_type= # patch/minor/major
npm version ${update_type:?}
git push
git push --tags
npm publish
alfy-cleanup
```

Now, remove your current installation from Alfred on your machine.

Then, install the newly published version via npm:

```sh
npm install --location=global alfred-{{cookiecutter.project_slug}} --upgrade
```

Verify the version installed matches what you just published:

```sh
npm list --location=global | grep alfred-{{cookiecutter.project_slug}}
```

Then, load Alfred | Preferences | Workflows |
{{cookiecutter.project_name}} | right click | Export ... | (type
in version from CLI output) | Export | choose this directory | Export

Once done, make a GitHub release with the exported file (do this in a
new tab):

```sh
cd ../{{cookiecutter.project_slug}}
new_release=$(npm version --json | jq -r '."alfred-{{cookiecutter.project_slug}}"')
gh release create --generate-notes v${new_release:?} '{{cookiecutter.project_name}}.alfredworkflow'
```

Delete your current installation in Alfred again.

open '{{cookiecutter.project_name}}.alfredworkflow' | configure as prompted | Import

[packal](http://www.packal.org/) | Login if needed | Dashboard | {{cookiecutter.project_name}} | Edit current | Workflow File | Remove | Choose File | (.alfredworkflow file) | Upload | Version | (update) | (scroll to bottom) | Submit

## Initial release to packal.org

1. Go through at least the screenshot generation steps of 'Initial
   release to Chrome Web Store'
1. Note down what the existing screenshots are, including the existing
   left and right sides of split screen images: `open
   docs/screenshot-*.png`
1. Plan out what additional screenshots you'd like to have in the
   gallery and what will be reused.
1. Generate 1280x800 (or scaled up) screenshots and save as
   `docs/screenshot-n-raw.png` and so on
1. Stage the screenshot raw files in git.
1. Add any annotations and save `docs/screenshot-n.paint` and so on.
   Open a similar `.paint` from a sibling project to copy and paste
   the annotation text to keep to the same style.
1. Stage the screenshot paint files in git.
1. File | Save As... | png | `docs/screenshot-n.png` (and so on) | Save
1. Image | Adjust Size... | Scale proportionally ☑ | Resample image ☑
   | Get to 1280x800 (or just under if ratio isn't right) | OK
1. Use adjust size to add transparent border until exactly as 1200x800
   (don't 'Scale proportionally' or 'Resample image' this time) | OK
1. Stage `screenshot-n.png` (and so on) in git.
1. Ensure `docs/screenshot-n.png` is scaled to 1280x800 with `file` command
1. Go to the [form](http://www.packal.org/node/add/alfred2-workflow)
1. Workflow Name: {{cookiecutter.project_name}}
1. Version: (take latest version from package.json)
1. Bundle ID: cc.broz.asana.{{cookiecutter.project_slug}}
1. Short description: (take short description from README, drop
   mention of Alfred or Chrome Extension)
1. Icon: (upload static/chrome-extension/apiology-128x128.png) | Upload
1. Workflow file (upload latest release from GitHub) | Upload
1. Worfklow Description: select Text format | markdown | Copy the one
   sentence blurb entered above, then the usage instructions (you may
   need to merge the Chrome and Alfred instructions)
1. Alfred Forum Link | (leave empty for now)
1. Github URL: `https://github.com/{{cookiecutter.github_username}}/{{cookiecutter.project_slug}}`
1. Categories: (fill in)
1. Tags: (fill in - e.g., asana)
1. Applications: (fill in - probably blank)
1. Webservices: (fill in - e.g. Asana)
1. Packal Documentation Page: Leave blank
1. Submit

## Initial release to Chrome Web Store

1. `make clean && make`
1. Load resulting `dist/chrome-extension` directory into local [Chrome](chrome://extensions/) and test.
1. Finalize [promotional image](docs/{{cookiecutter.project_slug}}.paint).
1. Stage the .paint file in git.
1. File | Save As... | png | `{{cookiecutter.project_slug}}-440x280.png` | Save
1. Plan out what screenshots you'd like to have in the gallery
1. Generate 1280x800 (or scaled up) screenshots and save as
   `docs/screenshot-1-raw.png` and so on.
1. Stage the screenshot raw files in git.
1. Add any annotations and save `docs/screenshot-1.paint` and so on.
   Open a similar `.paint` from a sibling project to copy and paste
   the annotation text to keep to the same style.
1. Stage the screenshot paint files in git.
1. File | Save As... | png | `docs/screenshot-1.png` (and so on) | Save
1. Image | Adjust Size... | Scale proportionally ☑ | Resample image ☑
   | Get to 1280x800 (or just under if ratio isn't right) | OK
1. Use adjust size to add transparent border until exactly as 1200x800
   (don't 'Scale proportionally' or 'Resample image' this time) | OK
1. Stage `screenshot-1.png` (and so on) in git.
1. Ensure `docs/screenshot-1.png` is scaled to 1280x800 with `file` command
1. Upload [package.zip](./package.zip) to the [developer dashboard](https://chrome.google.com/u/1/webstore/devconsole/d34ba2e8-8b5a-4417-889e-4047c35522d0) as `apiology-cws` user and save as a draft.
1. Add Description based on README - manually translate from markdown
   to text, but adjust README as needed to try to keep the rest synced
   up.
1. Walk through 'Store listing' items.
1. Fill in answers in 'Privacy practices' section
1. Fill in answers in 'Payments & distribution' section
1. Save draft
1. ... | Preview
1. Review carefully
1. Fix any issues spotted and repeat
1. PR related changes in here
1. Submit for review
1. Wait for approval
1. Update README.md with CWS icon linking to listing after the first paragraph - example: `[![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/tbyBjqi7Zu733AAKA5n4.png)](WEBSTORE LINK HERE)`
1. Replace 'Installing Chrome Extension' in README.md with the CWS icon.
1. Update README.md with screenshots - example: `<img src="./docs/screenshot-1.png" alt="screenshot showing Asana task description and repeating above keystrokes" height="400"/>`
{% if cookiecutter.options == 'yes' -%}
1. Update options.html link in README.md
{% endif -%}
1. Drop this section

## Releasing to Chrome Web Store

1. Update screenshots in `docs/` for any new features
1. Update [README.md](./README.md) with new screenshots
1. PR screenshot updates in
1. `git stash && git checkout main && git pull`
1. Bump the version in `static/chrome-extension/manifest.json` locally.
1. `git commit -m "Bump version" static/chrome-extension/manifest.json`
1. `git push && make clean && make`
1. Update [package.zip](./package.zip) in [developer dashboard](https://chrome.google.com/u/1/webstore/devconsole/d34ba2e8-8b5a-4417-889e-4047c35522d0) as `apiology-cws` user.
1. Upload any new screenshots
1. Update description to match current README.md - manually translate
   from markdown to text.
1. Save draft
1. ... | Preview
1. [Publish](https://developer.chrome.com/docs/webstore/update/)
