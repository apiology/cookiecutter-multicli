/**
 * {{cookiecutter.project_slug}} module.
 *
 * {{ cookiecutter.project_short_description }}
 */

import { platform } from './platform.js';

export const logSuccess = (result: string | object): void => {
  const logger = platform().logger();
  logger.log('Upvoted task:', result);
};

export type Suggestion = {
  url: string
  text: string;
  description: string;
}

export const pullSuggestions = async (text: string): Promise<Suggestion[]> => {
  const url = `{{cookiecutter.project_slug}}:${encodeURIComponent(text)}`;
  const description = `Do some random action on "${text}"`;
  return [
    {
      url,
      text,
      description,
    },
  ];
};

export const actOnInputData = async (text: string) => {
  console.log(`Acting upon ${text}`);
  return 'a success message or status';
};
