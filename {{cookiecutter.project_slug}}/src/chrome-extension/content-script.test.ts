/**
 * @jest-environment jsdom
 */

// import { someTriggerFunction } from '../{{cookiecutter.project_slug}}.js';
import { registerEventListeners } from './content-script.js';
import { setPlatform } from '../platform.js';
import { TestPlatform } from '../__mocks__/test-platform.js';

jest.mock('../{{cookiecutter.project_slug}}');

test('registerEventListeners', async () => {
  // jest.mocked(shortcutsKeyDownBeforeOthers);

  setPlatform(new TestPlatform());

  registerEventListeners();

  // document.dispatchEvent(new window.KeyboardEvent('keydown'));

  // expect(someTriggerFunction).toHaveBeenCalled();
});
