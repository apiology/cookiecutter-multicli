{% if cookiecutter.chrome_extension_options == 'yes' -%}
import { ChromeExtensionCache } from './chrome-extension-cache.js';
import { ChromeExtensionConfig } from './chrome-extension-config.js';
{% endif -%}
import { ChromeExtensionLogger } from './chrome-extension-logger.js';
import { ChromeExtensionFormatter } from './chrome-extension-formatter.js';

export class ChromeExtensionPlatform {
{%- if cookiecutter.chrome_extension_options == 'yes' %}
  config = () => new ChromeExtensionConfig();

  cache = () => new ChromeExtensionCache();
{% endif %}
  logger = () => new ChromeExtensionLogger();

  formatter = () => new ChromeExtensionFormatter();
}
