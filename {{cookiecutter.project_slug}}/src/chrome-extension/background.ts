/**
 * background module.
 *
 * Initialized when browser extension is loaded.
 */

import { setPlatform } from '../platform.js';
import ChromeExtensionPlatform from './chrome-extension-platform.js';
import { doWork } from '../{{cookiecutter.project_slug}}.js';

setPlatform(new ChromeExtensionPlatform());

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(doWork);
