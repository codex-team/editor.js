/**
 * This file contains custom commands for Cypress.
 * Also it can override the existing commands.
 * 
 * --------------------------------------------------
 */

 import type { EditorConfig } from './../../../types/index';
 import EditorJS from './../../../dist/editor.js';

/**
 * Create a div element for holding editor
 *
 * @returns editorContainer - div which holds editor
 */
Cypress.Commands.add('createEditor', (editorConfig: EditorConfig = {}) => {
  return cy.document()
    .then((document) => {
      return new Promise((resolve) => {
        const editorContainer = document.createElement('div');

        editorContainer.setAttribute('id', 'editorjs');
        editorContainer.dataset.cy = 'editorjs';
        editorContainer.style.border = '1px dotted red';

        console.log('body1 children', document.body.children)

        document.body.appendChild(editorContainer);

        setTimeout(() => {
          resolve(editorContainer);
        }, 200);
      });
    })
    .then(() => {
      console.log('body2 children', document.body.children);

      const editorInstance = new EditorJS(editorConfig);

      return editorInstance.isReady();
    });
});