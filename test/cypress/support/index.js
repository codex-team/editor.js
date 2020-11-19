/**
 * create a div element for holding editor
 *
 * @returns editorContainer - div which holds editor
 */
function createEditorContainerDiv() {
  const editorContainer = document.createElement('div');

  editorContainer.id = 'editorjs';
  editorContainer.dataset.cy = 'editorjs';

  return editorContainer;
}

/**
 * Before each hook for the cypress tests
 */
beforeEach(() => {
  cy.visit(Cypress.env('local_test_server_url'));

  cy.document().then((document) => {
    const editorContainer = createEditorContainerDiv();

    /**
     * Prepend the editor container div, so that it will be above the script tag.
     */
    document.body.prepend(editorContainer);
  });
});
