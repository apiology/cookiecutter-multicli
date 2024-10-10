import 'jest-chrome';
import { ChromeExtensionLogger } from './chrome-extension-logger.js';

test('create class', () => {
  expect(new ChromeExtensionLogger()).not.toBeNull();
});

test('log', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {
    // just used to verify it's called
  });
  new ChromeExtensionLogger().log('test');
  expect(spy).toHaveBeenCalledWith('{{cookiecutter.project_name}}', 'test');
});

test('debug', async () => {
  const spy = jest.spyOn(console, 'debug').mockImplementation(() => {
    // just used to verify it's called
  });
  new ChromeExtensionLogger().debug('test');
  expect(spy).toHaveBeenCalledWith('{{cookiecutter.project_name}}', 'test');
});

test('warn', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {
    // just used to verify it's called
  });
  new ChromeExtensionLogger().warn('test');
  expect(spy).toHaveBeenCalledWith('{{cookiecutter.project_name}}', 'test');
});

test('error', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {
    // just used to verify it's called
  });
  new ChromeExtensionLogger().error('test');
  expect(spy).toHaveBeenCalledWith('{{cookiecutter.project_name}}', 'test');
});
