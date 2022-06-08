export default abstract class Config {
{%- if cookiecutter.asana_api == 'yes' %}
  abstract fetchAsanaAccessToken(): Promise<string>;

  abstract fetchWorkspaceName(): Promise<string>;
{%- endif %}
  // abstract fetchSomeConfigItem(): Promise<string>;
}
