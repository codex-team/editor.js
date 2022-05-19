// eslint-disable-next-line spaced-comment
/// <reference path="../support/index.d.ts" />

describe('Editor basic initialization', () => {
  describe('Zero-config initialization', () => {
    /**
     * In this test suite we use zero (omitted) configuration
     */
    const editorConfig = {};

    beforeEach(() => {
      if (this && this.editorInstance) {
        this.editorInstance.destroy();
      } else {
        cy.createEditor(editorConfig).as('editorInstance');
      }
    });

    it('should create a visible UI', () => {
      /**
       * Assert if created instance is visible or not.
       */
      cy.get('[data-cy=editorjs]')
        .get('div.codex-editor')
        .should('be.visible');
    });
  });

  describe('Configuration', () => {
    describe('readOnly', () => {
      beforeEach(() => {
        if (this && this.editorInstance) {
          this.editorInstance.destroy();
        }
      });

      it('should create editor without editing ability when true passed', () => {
        cy.createEditor({
          readOnly: true,
        }).as('editorInstance');

        cy.get('[data-cy=editorjs]')
          .get('div.codex-editor')
          .get('div.ce-paragraph')
          .invoke('attr', 'contenteditable')
          .should('eq', 'false');
      });
    });
  });
});
