/**
 * @jest-environment jsdom
 */

import { htmlElement, waitForElement, parent } from './dom-utils.js';

afterEach(() => {
  document.body.innerHTML = '';
});

test('htmlElement', async () => {
  document.body.innerHTML = `
<div>
  <div id='foo'>1</div>
  <div id='bar'>2</div>
  <div id='baz'>3</div>
</div>
`;

  const bar: HTMLDivElement = htmlElement('bar', HTMLDivElement);
  expect(bar.textContent).toBe('2');
});

test('htmlElementBadHtmlWrongId', async () => {
  // look for an ID which doesn't exist...

  document.body.innerHTML = `
<div>
  <div id='foo'>1</div>
  <div id='bar'>2</div>
  <div id='baz'>3</div>
</div>
`;
  expect(() => htmlElement('bing', HTMLDivElement)).toThrowError("Couldn't find element with id bing");
});

test('htmlElementBadHtmlWrongElement', async () => {
  // code is expecting this to be an a element, not a div - verify
  // we throw a useful error

  document.body.innerHTML = `
<div>
  <div id='foo'>1</div>
  <div id='bar'>2</div>
  <div id='baz'>3</div>
</div>
`;
  expect(() => htmlElement('foo', HTMLAnchorElement)).toThrowError('element with id foo not an HTMLAnchorElement as expected');
});

test('waitForElementAlreadyExists', async () => {
  document.body.innerHTML = `
<div>
  <div id='foo'>1</div>
  <div id='bar'>2</div>
  <div id='baz'>3</div>
</div>
`;
  const element = await waitForElement('#bar');
  expect(element.textContent).toEqual('2');
});

test('waitForElementAppearsLater', async () => {
  document.body.innerHTML = '';
  const elementPromise = waitForElement('#bar');
  document.body.innerHTML = `
<div>
  <div id='foo'>1</div>
  <div id='bar'>2</div>
  <div id='baz'>3</div>
</div>
`;
  expect((await elementPromise).textContent).toEqual('2');
});

test('parent', async () => {
  document.body.innerHTML = `
<div id='parent'>
  <div id='foo'>1</div>
  <div id='bar'>2</div>
  <div id='baz'>3</div>
</div>
`;
  const bar = await waitForElement('#bar');
  expect(parent(bar).id).toEqual('parent');
});

test('parent not found', async () => {
  expect(() => parent(parent(document.body))).toThrow('parent of element is unexpectedly null');
});
