/**
 * omnibox module.
 *
 * Contains functions useful to interact with chrome.omnibox API
 */

import { pullSuggestions, Suggestion } from '../{{cookiecutter.project_slug}}.js';
import { escapeHTML } from './chrome-extension-formatter.js';

export const pullOmniboxSuggestions = async (text: string) => {
  const suggestions = await pullSuggestions(text);
  return suggestions.map((suggestion: Suggestion) => ({
    content: suggestion.url,
    description: escapeHTML(suggestion.description),
  }));
};
