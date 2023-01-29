import { Config } from '../config.js';

export class TestConfig extends Config {
{%- if cookiecutter.asana_api == 'yes' %}
  fetchAsanaAccessToken = async () => { throw new Error('not implemented'); };

  fetchWorkspaceName = async () => { throw new Error('not implemented'); };
{%- endif %}
}
