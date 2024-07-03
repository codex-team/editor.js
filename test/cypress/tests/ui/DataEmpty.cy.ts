import { createEditorWithTextBlocks } from '../../support/utils/createEditorWithTextBlocks';

describe('inputs [data-empty] mark', function () {
  it('should be added to the editor on initialization', function () {
    createEditorWithTextBlocks([
      'First', // not empty block
      '', // empty block
    ]);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .first()
      .should('have.attr', 'data-empty', 'false');

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .should('have.attr', 'data-empty', 'true');
  });

  it('should be added to the block on input', function () {
    createEditorWithTextBlocks([
      'First', // not empty block
      '', // empty block
    ]);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .type('Some text');

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .should('have.attr', 'data-empty', 'false');
  });

  it('should be added to the block on focus', function () {
    createEditorWithTextBlocks([
      'First', // not empty block
      '', // empty block
    ]);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .click();

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .should('have.attr', 'data-empty', 'true');
  });

  it('should be added to the new block inputs', function () {
    createEditorWithTextBlocks([
      'First', // not empty block
      '', // empty block
    ]);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .should('have.attr', 'data-empty', 'true');
  });
});
