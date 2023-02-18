import { chrome } from 'jest-chrome';
import { platform, setPlatform } from './platform.js';
import { TestPlatform } from './__mocks__/test-platform.js';
import { doWork } from './{{cookiecutter.project_slug}}.js';

test('doWork', async () => {
  setPlatform(new TestPlatform());

  doWork({} as chrome.tabs.Tab);

  expect(chrome.tabs.executeScript).toBeCalled();
});
