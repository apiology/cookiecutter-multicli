# {{ cookiecutter.project_name }}

[![CircleCI](https://circleci.com/gh/apiology/{{cookiecutter.project_slug}}.svg?style=svg)](https://circleci.com/gh/apiology/{{cookiecutter.project_slug}})

WARNING: This is not ready for use yet!

{{ cookiecutter.project_short_description }}

## Using

{% if cookiecutter.chrome_extension_options == 'yes' -%}
## Configuration

{% if cookiecutter.asana_api == 'yes' -%}
1. Create a new "Personal access token" in
   [Asana](https://app.asana.com/0/my-apps)
{%- endif %}
1. Set up options directly
   [here](chrome-extension://TBD/options.html)
   or in Chrome | … | More Tools | Extensions | {{ cookiecutter.project_name }} |
   Details | Extension options.
{% if cookiecutter.asana_api == 'yes' -%}
1. Paste in your personal access token.
1. Provide the rest of the configuration and hit 'Save'
{% endif -%}
{% endif -%}
{% if cookiecutter.asana_related == 'yes' -%}
## Legal

Not created, maintained, reviewed, approved, or endorsed by Asana, Inc.

{% endif %}
## Installing

This isn't in the Chrome App Store, so welcome to the Chrome Extension
development experience!

1. Run 'make' to create the bundle with webpack, or 'make start' to
   start webpack in watch mode.
2. Go to [chrome://extensions/](chrome://extensions/)
3. Make sure 'Developer mode' is flipped on in the upper right.
4. Click the 'Load unpacked' button.
5. Choose the [dist](./dist) directory

## Contributions

This project, as with all others, rests on the shoulders of a broad
ecosystem supported by many volunteers doing thankless work, along
with specific contributors.

In particular I'd like to call out:

* [Audrey Roy Greenfeld](https://github.com/audreyfeldroy) for the
  cookiecutter tool and associated examples, which keep my many
  projects building with shared boilerplate with a minimum of fuss.
