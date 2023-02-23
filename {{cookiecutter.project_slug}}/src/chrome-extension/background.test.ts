import { chrome } from 'jest-chrome';
import { doWork } from '../{{cookiecutter.project_slug}}.js';
import { setPlatform } from '../platform.js';
import { TestPlatform } from '../__mocks__/test-platform.js';
import { registerEventListeners } from './background.js';

jest.mock('../{{cookiecutter.project_slug}}');

test('registerEventListeners', async () => {
  jest.mocked(doWork);

  setPlatform(new TestPlatform());

  registerEventListeners();

  chrome.browserAction.onClicked.callListeners({} as never);

  expect(doWork).toHaveBeenCalled();
});
