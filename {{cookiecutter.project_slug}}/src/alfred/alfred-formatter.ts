{% if cookiecutter.asana_api == 'yes' -%}
import * as Asana from 'asana';

{% endif -%}
export default class AlfredFormatter {
{%- if cookiecutter.asana_api == 'yes' %}
  formatTask = (task: Asana.resources.Tasks.Type) => {
    if (task.memberships == null) {
      throw new Error('Memberships required to format!');
    }
    const project = task.memberships[0]?.project;

    let membership = '';

    if (task.parent != null) {
      if (task.parent.name == null) {
        throw new Error('Task parent name required to format!');
      }
      membership += ` / ${task.parent.name}`;
    }
    if (project != null) {
      membership += ` (${project.name})`;
    }

    if (task.name == null) {
      throw new Error('Task name required to format!');
    }
    return `${task.name}${membership}`;
  };
{% endif -%}
}
