/**
 * This file contains custom commands for Cypress.
 * Also it can override the existing commands.
 *
 * --------------------------------------------------
 */

import type { EditorConfig } from './../../../types/index';
import EditorJS from '../../../dist/editor.js';
/**
 * Create a wrapper and initialize the new instance of editor.js
 * Then return the instance
 *
 * @param editorConfig - config to pass to the editor
 * @returns EditorJS - created instance
 */
Cypress.Commands.add('createEditor', (editorConfig: EditorConfig = {}): EditorJS => {
  return cy.window()
    .then((window) => {
      return new Promise((resolve) => {
        const editorContainer = window.document.createElement('div');

        editorContainer.setAttribute('id', 'editorjs');
        editorContainer.dataset.cy = 'editorjs';
        editorContainer.style.border = '1px dotted red';

        window.document.body.appendChild(editorContainer);

        setTimeout(() => {
          const editorInstance = new window.EditorJS(editorConfig);

          editorInstance.isReady.then(() => {
            resolve(editorInstance);
          });
        }, 200);
      });
    });
});