import Asana from 'asana';
import { omniboxInputEnteredListener } from './omnibox.js';
import {
  actOnInputData, logSuccess, pullSuggestions, Suggestion,
} from '../{{cookiecutter.project_slug}}.js';

jest.mock('../{{cookiecutter.project_slug}}');

afterEach(() => {
  jest.clearAllMocks();
});

test('omniboxInputEnteredListenerNonDefault', async () => {
  const mockActOnInputData = jest.mocked(actOnInputData);
  const mockLogSuccess = jest.mocked(logSuccess);
  const resovledValue = 'foo';
  mockActOnInputData.mockResolvedValue(resovledValue);

  await omniboxInputEnteredListener('{{cookiecutter.project_slug}}:mumble');
  expect(mockActOnInputData).toHaveBeenCalledWith('{{cookiecutter.project_slug}}:mumble');
  expect(mockLogSuccess).toHaveBeenCalledWith(resolvedValue);
});

test('omniboxInputEnteredListenerException', async () => {
  const mockActOnInputData = jest.mocked(actOnInputData);
  const mockLogSuccess = jest.mocked(logSuccess);
  mockActOnInputData.mockRejectedValue('123');

  await expect(omniboxInputEnteredListener('{{cookiecutter.project_slug}}:mumble')).rejects.toMatch('123');
  expect(mockActOnInputData).toHaveBeenCalledWith('{{cookiecutter.project_slug}}:mumble');
  expect(mockLogSuccess).not.toHaveBeenCalled();
});

test('omniboxInputEnteredListenerExceptionWithAlertAvailable', async () => {
  const mockActOnInputData = jest.mocked(actOnInputData);
  const mockLogSuccess = jest.mocked(logSuccess);
  mockActOnInputData.mockRejectedValue('123');

  await expect(omniboxInputEnteredListener('{{cookiecutter.project_slug}}:mumble')).rejects.toMatch('123');
  expect(mockActOnInputData).toHaveBeenCalledWith('{{cookiecutter.project_slug}}:mumble');
  expect(mockLogSuccess).not.toHaveBeenCalled();
});

test('omniboxInputEnteredListenerDefaultEmptyList', async () => {
  const mockActOnInputData = jest.mocked(actOnInputData);
  const mockLogSuccess = jest.mocked(logSuccess);
  const mockPullSuggestions = jest.mocked(pullSuggestions);
  const task = {} as Asana.resources.Tasks.Type;
  mockActOnInputData.mockResolvedValue(task);
  mockPullSuggestions.mockResolvedValue([]);

  await expect(omniboxInputEnteredListener('blah')).rejects.toEqual(new Error('No results for "blah"'));
  expect(mockActOnInputData).not.toHaveBeenCalled();
  expect(mockLogSuccess).not.toHaveBeenCalled();
});

test('omniboxInputEnteredListenerDefaultMultipleItems', async () => {
  const mockActOnInputData = jest.mocked(actOnInputData);
  const mockLogSuccess = jest.mocked(logSuccess);
  const mockPullSuggestions = jest.mocked(pullSuggestions);
  const task = {} as Asana.resources.Tasks.Type;
  mockActOnInputData.mockResolvedValue(task);
  const item1: Suggestion = { url: '{{cookiecutter.project_slug}}:foo', description: 'dfoo', text: 'Foo' };
  const item2: Suggestion = { url: '{{cookiecutter.project_slug}}:bar', description: 'dbar', text: 'Bar' };
  const item3: Suggestion = { url: '{{cookiecutter.project_slug}}:baz', description: 'dbaz', text: 'Baz' };
  mockPullSuggestions.mockResolvedValue([item1, item2, item3]);

  await omniboxInputEnteredListener('foo');
  expect(mockActOnInputData).toHaveBeenCalledWith('{{cookiecutter.project_slug}}:foo');
  expect(mockLogSuccess).toHaveBeenCalledWith(task);
});
