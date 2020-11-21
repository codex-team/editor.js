/**
 * This file is processed and
 * loaded automatically before the test files.
 *
 * This is a great place to put global configuration and
 * behavior that modifies Cypress.
 */

/**
 * File with the helpful commands
 */
import './commands';

/**
 * Create a div element for holding editor
 *
 * @returns editorContainer - div which holds editor
 */
function createEditorContainerDiv(): HTMLDivElement {
  const editorContainer = document.createElement('div');

  editorContainer.id = 'editorjs';
  editorContainer.dataset.cy = 'editorjs';

  return editorContainer;
}

/**
 * Before-each hook for the cypress tests
 */
beforeEach((): void => {
  cy.visit('test/cypress/fixtures/test.html');

  cy.document().then((document) => {
    const editorContainer = createEditorContainerDiv();

    /**
     * Prepend the editor container div, so that it will be above the script tag.
     */
    document.body.prepend(editorContainer);
  });
});
