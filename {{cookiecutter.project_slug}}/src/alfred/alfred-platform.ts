{% if cookiecutter.options == 'yes' -%}
import { AlfredCache } from './alfred-cache.js';
import { AlfredConfig } from './alfred-config.js';
{% endif -%}
import { AlfredLogger } from './alfred-logger.js';
import { AlfredFormatter } from './alfred-formatter.js';

export class AlfredPlatform {
{%- if cookiecutter.options == 'yes' %}
  config() {
    return new AlfredConfig();
  }

  cache() {
    return new AlfredCache();
  }
{% endif %}
  logger() {
    return new AlfredLogger();
  }

  formatter() {
    return new AlfredFormatter();
  }
}
