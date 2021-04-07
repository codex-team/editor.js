// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

import type { EditorConfig } from './../../../types/index';
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
    }

    interface ApplicationWindow {
      EditorJS: typeof EditorJS
    }
  }
}
