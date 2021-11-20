const logErrorOrig = (err: string): never => {
  alert(err);
  throw err;
};

// As of 4.4.4, TypeScript's control flow analysis is wonky with
// narrowing and functions that return never.  This is a workaround:
//
// https://github.com/microsoft/TypeScript/issues/36753
export const logError: (err: string) => never = logErrorOrig;

export const logSuccess = (result: string | object): void => console.log('Upvoted task:', result);

// How on God's green earth is there no built-in function to do this?
//
// https://stackoverflow.com/questions/40263803/native-javascript-or-es6-way-to-encode-and-decode-html-entities
export const escapeHTML = (str: string) => {
  const escape = (tag: string): string => {
    const s = ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[tag]);
    if (s == null) {
      logError('Error in regexp logic!');
    }
    return s;
  };
  return str.replace(/[&<>'"]/g, escape);
};

export const pullOmniboxSuggestions = async (text: string) => [{
  content: `some input data for next step, maybe containing ${text}`,
  description: escapeHTML('some human readable text'),
}];

export const actOnInputData = (text: string) => {
  console.log(`Acting upon ${text}`);
  return 'a success message or status';
};
