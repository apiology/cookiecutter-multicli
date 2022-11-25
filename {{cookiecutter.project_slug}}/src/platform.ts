{% if cookiecutter.chrome_extension_options == 'yes' -%}
import { Cache } from './cache.js';
import { Config } from './config.js';
{% endif -%}
import { Logger } from './logger.js';
import { Formatter } from './formatter.js';

interface Platform {
{%- if cookiecutter.chrome_extension_options == 'yes' %}
  config(): Config;

  cache(): Cache;
{% endif %}
  logger(): Logger;

  formatter(): Formatter;
}

let thePlatform: Platform | null = null;

export const platform = (): Platform => {
  if (thePlatform == null) {
    throw Error('Please call setPlatform() before use');
  }
  return thePlatform;
};

export const setPlatform = (newPlatform: Platform) => {
  thePlatform = newPlatform;
};
