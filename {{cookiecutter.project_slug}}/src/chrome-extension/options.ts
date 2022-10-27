// https://developer.chrome.com/docs/extensions/mv2/options/
import { htmlElement } from './dom-utils.js';

const htmlInputElement = (id: string) => htmlElement(id, HTMLInputElement);

const htmlDivElement = (id: string) => htmlElement(id, HTMLDivElement);

const statusElement = () => htmlDivElement('status');

{% if cookiecutter.asana_api == 'yes' -%}
const tokenElement = () => htmlInputElement('token');

const workspaceElement = () => htmlInputElement('workspace');

{% endif -%}
// const example = () => htmlInputElement('example');

const saveElement = () => htmlElement('save', HTMLButtonElement);

// Saves options to chrome.storage
export function saveOptions() {
{%- if cookiecutter.asana_api == 'yes' %}
  const asanaAccessToken = tokenElement().value;
  const workspace = workspaceElement().value;
{%- endif %}
  // const example = exampleElement().value;
  chrome.storage.sync.set({
{%- if cookiecutter.asana_api == 'yes' %}
    asanaAccessToken,
    workspace,
{%- endif %}
    // example,
  }, () => {
    // Update status to let user know options were saved.
    statusElement().textContent = 'Options saved.';
    setTimeout(() => {
      statusElement().textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
export function restoreOptions() {
  chrome.storage.sync.get({
{%- if cookiecutter.asana_api == 'yes' %}
    asanaAccessToken: null,
    workspace: null,
{%- endif %}
    // example: 'example default value',
  }, (items) => {
{%- if cookiecutter.asana_api == 'yes' %}
    tokenElement().value = items.asanaAccessToken;
    workspaceElement().value = items.workspace;
{%- endif %}
    // exampleElement().value = items.example;
  });
}

export function registerEventListeners() {
  document.addEventListener('DOMContentLoaded', restoreOptions);
  saveElement().addEventListener('click', saveOptions);
}

/* istanbul ignore next */
if (typeof jest === 'undefined') {
  registerEventListeners();
}
