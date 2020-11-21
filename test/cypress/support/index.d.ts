// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />
/// <reference path="./../../../types/index.d.ts" />


declare namespace Cypress {
  import { EditorConfig } from './../../../types';
  import EditorJS from '../../../types'

  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @param editorConfig - config to pass to the editor
     * @example cy.createEditor({})
    */
   createEditor(editorConfig: EditorConfig): Chainable<EditorJS>
  }
}