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
    }

    interface ApplicationWindow {
      EditorJS: typeof EditorJS
    }
  }
}
