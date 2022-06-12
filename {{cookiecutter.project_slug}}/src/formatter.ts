{% if cookiecutter.asana_api == 'yes' -%}
import * as Asana from 'asana';

{% endif -%}
export default abstract class Formatter {
  {% if cookiecutter.asana_api == 'yes' -%}
  abstract formatTask(task: Asana.resources.Tasks.Type): string;

  {% endif -%}
  abstract escapeDescriptionPlainText(text: string): string;
}
