// https://developer.chrome.com/docs/extensions/mv2/options/

// https://2ality.com/2020/04/classes-as-values-typescript.html
/* eslint-disable @typescript-eslint/no-explicit-any */
type Class<T> = new (...args: any[]) => T;
/* eslint-enable @typescript-eslint/no-explicit-any */

const htmlElement = <T extends HTMLElement>(id: string, clazz: Class<T>): T => {
  const element = document.getElementById(id);
  if (element == null) {
    throw new Error(`Couldn't find element with id ${id}`);
  }
  if (!(element instanceof clazz)) {
    throw new Error(`element with id ${id} not an ${clazz.name} as expected!`);
  }
  return element;
};

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
const saveOptions = () => {
{% if cookiecutter.asana_api == 'yes' -%}
  const asanaAccessToken = tokenElement().value;
  const workspace = workspaceElement().value;
{% endif -%}
  // const example = exampleElement().value;
  chrome.storage.sync.set({
{% if cookiecutter.asana_api == 'yes' -%}
    asanaAccessToken,
    workspace,
{% endif -%}
    // example,
  }, () => {
    // Update status to let user know options were saved.
    statusElement().textContent = 'Options saved.';
    setTimeout(() => {
      statusElement().textContent = '';
    }, 750);
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get({
{% if cookiecutter.asana_api == 'yes' -%}
    asanaAccessToken: null,
    workspace: null,
{% endif -%}
//    example: 'example default value',
  }, (items) => {
{% if cookiecutter.asana_api == 'yes' -%}
    tokenElement().value = items.asanaAccessToken;
    workspaceElement().value = items.workspace;
{% endif -%}
    // exampleElement().value = items.example;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
saveElement().addEventListener('click', saveOptions);
