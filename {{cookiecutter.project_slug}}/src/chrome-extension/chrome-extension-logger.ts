export class ChromeExtensionLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message?: any, ...optionalParams: any[]): void {
    console.log('{{ cookiecutter.project_name }}', message, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message?: any, ...optionalParams: any[]): void {
    console.debug('{{ cookiecutter.project_name }}', message, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message?: any, ...optionalParams: any[]): void {
    console.warn('{{ cookiecutter.project_name }}', message, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message?: any, ...optionalParams: any[]): void {
    console.error('{{ cookiecutter.project_name }}', message, ...optionalParams);
  }

  userVisibleStatus = (message: string): void => {
    chrome.omnibox.setDefaultSuggestion({
      description: `<dim>${message}</dim>`,
    });
  };
}
