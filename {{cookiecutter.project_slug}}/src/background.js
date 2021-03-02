const { doWork } = require('./{{cookiecutter.project_slug}}.js');

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(doWork);
