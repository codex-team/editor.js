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

  return subject;
});

/**
 * Copy command to dispatch copy event on subject
 *
 * Usage:
 * cy.get('div').copy().then(data => {})
 */
Cypress.Commands.add('copy', { prevSubject: true }, async (subject) => {
  const clipboardData: {[type: string]: any} = {};

  const copyEvent = Object.assign(new Event('copy', {
    bubbles: true,
    cancelable: true,
  }), {
    clipboardData: {
      setData: (type: string, data: any): void => {
        console.log(type, data);
        clipboardData[type] = data;
      },
    },
  });

  subject[0].dispatchEvent(copyEvent);

  return clipboardData;
});

/**
 * Cut command to dispatch cut event on subject
 *
 * Usage:
 * cy.get('div').cut().then(data => {})
 */
Cypress.Commands.add('cut', { prevSubject: true }, async (subject) => {
  const clipboardData: {[type: string]: any} = {};

  const copyEvent = Object.assign(new Event('cut', {
    bubbles: true,
    cancelable: true,
  }), {
    clipboardData: {
      setData: (type: string, data: any): void => {
        console.log(type, data);
        clipboardData[type] = data;
      },
    },
  });

  subject[0].dispatchEvent(copyEvent);

  return clipboardData;
});

/**
 * Calls EditorJS API render method
 *
 * @param data — data to render
 */
Cypress.Commands.add('render', { prevSubject: true }, async (subject: EditorJS, data: OutputData): Promise<EditorJS> => {
  await subject.render(data);

  return subject;
});
