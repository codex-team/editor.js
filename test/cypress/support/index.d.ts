// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

import type { EditorConfig, OutputData } from './../../../types/index';
import type EditorJS from '../../../types/index'

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @param editorConfig - config to pass to the editor
       * @example cy.createEditor({})
       */
      createEditor(editorConfig: EditorConfig): Chainable<EditorJS>

      /**
       * Paste command to dispatch paste event
       *
       * @usage
       * cy.get('div').paste({'text/plain': 'Text', 'text/html': '<b>Text</b>'})
       *
       * @param data - map with MIME type as a key and data as value
       */
      paste(data: {[type: string]: string}): Chainable<Subject>

      /**
       * Copy command to dispatch copy event on subject
       *
       * @usage
       * cy.get('div').copy().then(data => {})
       */
      copy(): Chainable<{ [type: string]: any }>;

      /**
       * Cut command to dispatch cut event on subject
       *
       * @usage
       * cy.get('div').cut().then(data => {})
       */
      cut(): Chainable<{ [type: string]: any }>;

      /**
       * Calls EditorJS API render method
       *
       * @param data — data to render
       */
      render(data: OutputData): Chainable<EditorJS>;
    }

    interface ApplicationWindow {
      EditorJS: typeof EditorJS
    }
  }
}
