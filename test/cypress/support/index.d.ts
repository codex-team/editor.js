// load type definitions that come with Cypress module
/// <reference types="cypress" />

import type { EditorConfig, OutputData } from './../../../types/index';
import type EditorJS from '../../../types/index'
import PartialBlockMutationEvent from '../fixtures/types/PartialBlockMutationEvent';

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
      copy(): Chainable<Subject>;

      /**
       * Cut command to dispatch cut event on subject
       *
       * @usage
       * cy.get('div').cut().then(data => {})
       */
      cut(): Chainable<Subject>;

      /**
       * Calls EditorJS API render method
       *
       * @param data — data to render
       */
      render(data: OutputData): Chainable<Subject>;

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
      selectText(text: string): Chainable<Subject>;

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
      selectTextByOffset(offset: [number, number]): Chainable<Subject>;

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
      getLineWrapPositions(): Chainable<number[]>;

      /**
       * Dispatches keydown event on subject
       * Uses the correct KeyboardEvent object to make it work with our code (see below)
       *
       * @param keyCode - key code to dispatch
       */
      keydown(keyCode: number): Chainable<Subject>;

      /**
       * Extract content of pseudo element
       *
       * @example cy.get('element').getPseudoElementContent('::before').should('eq', 'my-test-string')
       */
      getPseudoElementContent(pseudoElement: string): Chainable<string>;
    }

    interface ApplicationWindow {
      EditorJS: typeof EditorJS
    }

    /**
     * Extends Cypress assertion Chainer interface with the new assertion methods
     */
    interface Chainer<Subject> {
      /**
       * Custom Chai assertion that checks if given onChange method is called with an array of passed events
       *
       * @example
       *   ```
       *   cy.get('@onChange').should('be.calledWithBatchedEvents', [{ type: 'block-added', detail: { index: 0 }}])
       *   expect(onChange).to.be.calledWithBatchedEvents([{ type: 'block-added', detail: { index: 0 }}])
       *   ```
       */
      (chainer: 'be.calledWithBatchedEvents', expectedEvents: PartialBlockMutationEvent[]): Chainable<Subject>;
    }
  }

  /**
   * Chai plugins
   */
  namespace Chai {
    interface Assertion {
      /**
       * "containSubset" object properties matcher
       */
      containSubset(subset: any): Assertion;

      /**
       * Custom Chai assertion that checks if given onChange method is called with an array of passed events
       *
       * @example
       *   ```
       *   cy.get('@onChange').should('be.calledWithBatchedEvents', [{ type: 'block-added', detail: { index: 0 }}])
       *   expect(onChange).to.be.calledWithBatchedEvents([{ type: 'block-added', detail: { index: 0 }}])
       *   ```
       */
      calledWithBatchedEvents(expectedEvents: PartialBlockMutationEvent[]): Assertion;
    }
  }
}
