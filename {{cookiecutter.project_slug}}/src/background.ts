/**
 * background module.
 *
 * Initialized when browser extension is loaded.
 */

import { doWork } from './{{cookiecutter.project_slug}}.js';

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(doWork);
