/**
 * This file contains custom commands for Cypress.
 * Also it can override the existing commands.
 *
 * --------------------------------------------------
 */

import type { EditorConfig } from './../../../types/index';
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
 * @usage
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

  return subject;
});
