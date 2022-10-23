// https://2ality.com/2020/04/classes-as-values-typescript.html
/* eslint-disable @typescript-eslint/no-explicit-any */
type Class<T> = new (...args: any[]) => T;
/* eslint-enable @typescript-eslint/no-explicit-any */

export const htmlElement = <T extends HTMLElement>(id: string, clazz: Class<T>): T => {
  const element = document.getElementById(id);
  if (element == null) {
    throw new Error(`Couldn't find element with id ${id}`);
  }
  if (!(element instanceof clazz)) {
    throw new Error(`element with id ${id} not an ${clazz.name} as expected!`);
  }
  return element;
};
