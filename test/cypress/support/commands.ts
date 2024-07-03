/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file contains custom commands for Cypress.
 * Also it can override the existing commands.
 *
 * --------------------------------------------------
 */

import type { EditorConfig, OutputData } from './../../../types/index';
import type EditorJS from '../../../types/index';
import Chainable = Cypress.Chainable;

/**
 * Create a wrapper and initialize the new instance of editor.js
 * Then return the instance
 *
 * @param editorConfig - config to pass to the editor
 * @returns EditorJS - created instance
 */
Cypress.Commands.add('createEditor', (editorConfig: EditorConfig = {}): Chainable<EditorJS> => {
  return cy.window()
    .then((window) => {
      return new Promise((resolve: (instance: EditorJS) => void) => {
        const editorContainer = window.document.createElement('div');

        editorContainer.setAttribute('id', 'editorjs');
        editorContainer.dataset.cy = 'editorjs';
        editorContainer.style.border = '1px dotted #388AE5';

        window.document.body.appendChild(editorContainer);

        const editorInstance: EditorJS = new window.EditorJS(editorConfig);

        editorInstance.isReady.then(() => {
          resolve(editorInstance);
        });
      });
    });
});

/**
 * Paste command to dispatch paste event
 *
 * Usage
 * cy.get('div').paste({'text/plain': 'Text', 'text/html': '<b>Text</b>'})
 *
 * @param data - map with MIME type as a key and data as value
 */
Cypress.Commands.add('paste', {
  prevSubject: true,
}, (subject, data: {[type: string]: string}) => {
  const pasteEvent = Object.assign(new Event('paste', {
    bubbles: true,
    cancelable: true,
  }), {
    clipboardData: {
      getData: (type): string => data[type],
      types: Object.keys(data),
    },
  });

  subject[0].dispatchEvent(pasteEvent);

  cy.wait(200); // wait a little since some tools (paragraph) could have async hydration
});

/**
 * Copy command to dispatch copy event on subject
 *
 * Usage:
 * cy.get('div').copy().then(data => {})
 */
Cypress.Commands.add('copy', { prevSubject: true }, (subject) => {
  const clipboardData: {[type: string]: any} = {};

  const copyEvent = Object.assign(new Event('copy', {
    bubbles: true,
    cancelable: true,
  }), {
    clipboardData: {
      setData: (type: string, data: any): void => {
        clipboardData[type] = data;
      },
    },
  });

  subject[0].dispatchEvent(copyEvent);

  return cy.wrap(clipboardData);
});

/**
 * Cut command to dispatch cut event on subject
 *
 * Usage:
 * cy.get('div').cut().then(data => {})
 */
Cypress.Commands.add('cut', { prevSubject: true }, (subject) => {
  const clipboardData: {[type: string]: any} = {};

  const copyEvent = Object.assign(new Event('cut', {
    bubbles: true,
    cancelable: true,
  }), {
    clipboardData: {
      setData: (type: string, data: any): void => {
        clipboardData[type] = data;
      },
    },
  });

  subject[0].dispatchEvent(copyEvent);

  return cy.wrap(clipboardData);
});

/**
 * Calls EditorJS API render method
 *
 * @param data — data to render
 */
Cypress.Commands.add('render', { prevSubject: true }, (subject: EditorJS, data: OutputData) => {
  return cy.wrap(subject.render(data))
    .then(() => {
      return cy.wrap(subject);
    });
});


/**
 * Select passed text in element
 * Note. Previous subject should have 'textNode' as firstChild
 *
 * Usage
 * cy.get('[data-cy=editorjs]')
 *  .find('.ce-paragraph')
 *  .selectText('block te')
 *
 * @param text - text to select
 */
Cypress.Commands.add('selectText', {
  prevSubject: true,
}, (subject, text: string) => {
  const el = subject[0];
  const document = el.ownerDocument;
  const range = document.createRange();
  const textNode = el.firstChild;
  const selectionPositionStart = textNode.textContent.indexOf(text);
  const selectionPositionEnd = selectionPositionStart + text.length;

  range.setStart(textNode, selectionPositionStart);
  range.setEnd(textNode, selectionPositionEnd);
  document.getSelection().removeAllRanges();
  document.getSelection().addRange(range);

  return cy.wrap(subject);
});

/**
 * Select element's text by offset
 * Note. Previous subject should have 'textNode' as firstChild
 *
 * Usage
 * cy.get('[data-cy=editorjs]')
 *  .find('.ce-paragraph')
 *  .selectTextByOffset([0, 5])
 *
 * @param offset - offset to select
 */
Cypress.Commands.add('selectTextByOffset', {
  prevSubject: true,
}, (subject, offset: [number, number]) => {
  const el = subject[0];
  const document = el.ownerDocument;
  const range = document.createRange();
  const textNode = el.firstChild;
  const selectionPositionStart = offset[0];
  const selectionPositionEnd = offset[1];

  range.setStart(textNode, selectionPositionStart);
  range.setEnd(textNode, selectionPositionEnd);
  document.getSelection().removeAllRanges();
  document.getSelection().addRange(range);

  return cy.wrap(subject);
});

/**
 * Returns line wrap positions for passed element
 *
 * Usage
 * cy.get('[data-cy=editorjs]')
 *  .find('.ce-paragraph')
 *  .getLineWrapPositions()
 *
 * @returns number[] - array of line wrap positions
 */
Cypress.Commands.add('getLineWrapPositions', {
  prevSubject: true,
}, (subject) => {
  const element = subject[0];
  const document = element.ownerDocument;
  const text = element.textContent;
  const lineWraps = [];

  let currentLineY = 0;

  /**
   * Iterate all chars in text, create range for each char and get its position
   */
  for (let i = 0; i < text.length; i++) {
    const range = document.createRange();

    range.setStart(element.firstChild, i);
    range.setEnd(element.firstChild, i);

    const rect = range.getBoundingClientRect();

    if (i === 0) {
      currentLineY = rect.top;

      continue;
    }

    /**
     * If current char Y position is higher than previously saved line Y, that means a line wrap
     */
    if (rect.top > currentLineY) {
      lineWraps.push(i);

      currentLineY = rect.top;
    }
  }

  return cy.wrap(lineWraps);
});

/**
 * Dispatches keydown event on subject
 * Uses the correct KeyboardEvent object to make it work with our code (see below)
 */
Cypress.Commands.add('keydown', {
  prevSubject: true,
}, (subject, keyCode: number) => {
  cy.log('Dispatching KeyboardEvent with keyCode: ' + keyCode);
  /**
   * We use the "reason instanceof KeyboardEvent" statement in blockSelection.ts
   * but by default cypress' KeyboardEvent is not an instance of the native KeyboardEvent,
   * so real-world and Cypress behaviour were different.
   *
   * To make it work we need to trigger Cypress event with "eventConstructor: 'KeyboardEvent'",
   *
   * @see https://github.com/cypress-io/cypress/issues/5650
   * @see https://github.com/cypress-io/cypress/pull/8305/files
   */
  subject.trigger('keydown', {
    eventConstructor: 'KeyboardEvent',
    keyCode,
    bubbles: false,
  });

  return cy.wrap(subject);
});

/**
 * Extract content of pseudo element
 *
 * @example cy.get('element').getPseudoElementContent('::before').should('eq', 'my-test-string')
 */
Cypress.Commands.add('getPseudoElementContent', {
  prevSubject: true,
}, (subject, pseudoElement: 'string') => {
  const win = subject[0].ownerDocument.defaultView;
  const computedStyle = win.getComputedStyle(subject[0], pseudoElement);
  const content = computedStyle.getPropertyValue('content');

  return content.replace(/['"]/g, ''); // Remove quotes around the content
});
