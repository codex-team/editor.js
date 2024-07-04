/**
 * Text will be passed as a placeholder to the editor
 */
const PLACEHOLDER_TEXT = 'Write something or press / to select a tool';

describe('Placeholders', function () {
  /**
   * There is no ability to get pseudo elements content in Firefox
   * It will return CSS-bases value (attr(data-placeholder) instead of DOM-based
   */
  if (Cypress.browser.family === 'firefox') {
    return;
  }

  it('should be shown near first block if passed via editor config', function () {
    cy.createEditor({
      placeholder: PLACEHOLDER_TEXT,
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .getPseudoElementContent('::before')
      .should('eq', PLACEHOLDER_TEXT);
  });

  it('should be shown when editor is autofocusable', function () {
    cy.createEditor({
      placeholder: PLACEHOLDER_TEXT,
      autofocus: true,
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .getPseudoElementContent('::before')
      .should('eq', PLACEHOLDER_TEXT);
  });

  it('should be shown event if input is focused', function () {
    cy.createEditor({
      placeholder: PLACEHOLDER_TEXT,
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .click()
      .as('firstBlock')
      .getPseudoElementContent('::before')
      .should('eq', PLACEHOLDER_TEXT);
  });

  it('should be shown event when user removes all text by cmd+a and delete', function () {
    cy.createEditor({
      placeholder: PLACEHOLDER_TEXT,
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .type('aaa')
      .type('{selectall}{backspace}')
      .getPseudoElementContent('::before')
      .should('eq', PLACEHOLDER_TEXT);
  });

  it('should be hidden when user starts typing', function () {
    cy.createEditor({
      placeholder: PLACEHOLDER_TEXT,
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .as('firstBlock')
      .getPseudoElementContent('::before')
      .should('eq', PLACEHOLDER_TEXT);

    cy.get('@firstBlock')
      .type('a')
      .getPseudoElementContent('::before')
      .should('eq', 'none');
  });
});
