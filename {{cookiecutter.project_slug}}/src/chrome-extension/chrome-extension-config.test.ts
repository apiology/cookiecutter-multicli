{%- if cookiecutter.asana_api == 'yes' -%}
import { chrome } from 'jest-chrome';
{% endif -%}
import ChromeExtensionConfig from './chrome-extension-config.js';

test('create class', () => {
  expect(new ChromeExtensionConfig()).not.toBeNull();
});
{%- if cookiecutter.asana_api == 'yes' %}
test('fetchAsanaAccessToken', async () => {
  const fakeChromeStorageSyncGet = (keys: string | string[] | { [key: string]: object } | null,
    callback: (items: { [key: string]: object | string }) => void): void => {
    expect(keys).toEqual(['asanaAccessToken']);
    callback({ asanaAccessToken: '123' });
  };

  chrome.storage.sync.get.mockImplementation(fakeChromeStorageSyncGet);

  const config = new ChromeExtensionConfig();
  expect(await config.fetchAsanaAccessToken()).toEqual('123');
});
{%- endif %}
