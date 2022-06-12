export default abstract class Config {
{%- if cookiecutter.asana_api == 'yes' %}
  abstract fetchAsanaAccessToken(): Promise<string>;

  abstract fetchWorkspaceName(): Promise<string>;
{%- endif %}
  // abstract fetchSomeConfigItem(): Promise<string>;

  validate = async (): Promise<void> => {
{%- if cookiecutter.asana_api == 'yes' %}
    await this.fetchAsanaAccessToken();
    await this.fetchWorkspaceName();
{%- endif %}
    // await fetchSomeConfigItem();
  }
}
