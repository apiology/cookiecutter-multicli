/**
 * background module.
 *
 * Initialized when browser extension is loaded.
 */

import { setPlatform } from '../platform.js';
import { ChromeExtensionPlatform } from './chrome-extension-platform.js';
import { doWork } from '../{{cookiecutter.project_slug}}.js';

export function registerEventListeners() {
  // Called when the user clicks on the browser action.
  chrome.browserAction.onClicked.addListener(doWork);
}

/* istanbul ignore next */
if (typeof jest === 'undefined') {
  setPlatform(new ChromeExtensionPlatform());
  registerEventListeners();
}
