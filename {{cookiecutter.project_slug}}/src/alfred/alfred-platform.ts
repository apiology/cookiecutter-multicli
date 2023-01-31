{% if cookiecutter.chrome_extension_options == 'yes' -%}
import { AlfredCache } from './alfred-cache.js';
import { AlfredConfig } from './alfred-config.js';
{% endif -%}
import { AlfredLogger } from './alfred-logger.js';
import { AlfredFormatter } from './alfred-formatter.js';

// needed to create virtual functions implementing an abstract class
// for TypeScript
/* eslint-disable class-methods-use-this */

export class AlfredPlatform {
{%- if cookiecutter.chrome_extension_options == 'yes' %}
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
