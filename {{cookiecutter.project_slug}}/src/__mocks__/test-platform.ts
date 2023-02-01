{% if cookiecutter.options == 'yes' -%}
import { TestConfig } from './test-config.js';
{% endif -%}
import { TestLogger } from './test-logger.js';

export class TestPlatform {
{%- if cookiecutter.options == 'yes' %}
  config = () => new TestConfig();

  cache = () => { throw new Error('not implemented'); };
{% endif %}
  logger = () => new TestLogger();

  formatter = () => { throw new Error('not implemented'); };
}
