// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

describe('Editor basic initialization', () => {
  describe('Zero-config initialization', () => {
    /**
     * In this test suite we use zero (omitted) configuration
     */
    const editorConfig = {};

    beforeEach(function () {
      cy.createEditor(editorConfig).as('editorInstance');
    });

    afterEach(function () {
      if (this.editorInstance) {
        this.editorInstance.destroy();
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

    describe('style', () => {
      describe('nonce', () => {
        it('should add passed nonce as attribute to editor style tag', () => {
          cy.createEditor({
            style: {
              nonce: 'test-nonce',
            },
          }).as('editorInstance');

          cy.get('[data-cy=editorjs]')
            .get('#editor-js-styles')
            .should('have.attr', 'nonce', 'test-nonce');
        });
      });
    });
  });
});
