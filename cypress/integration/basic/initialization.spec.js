describe('Initialization Tests', () => {
  it('check initialization', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    cy.window().then(window => {
      assert.exists(window.editor, 'window.editor exists');
      assert.isFunction(window.EditorJS, 'window.EditorJS is a function');
    });

    cy.get('div#editorjs')
      .get('div.codex-editor')
      .should('be.visible');
  });
});