describe('Initialization Tests', () => {
  it('check if editor js module is imported or not', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    cy.window().then(window => {
      assert.isFunction(window.EditorJS, 'window.EditorJS is a function');
    });

  });

  it('check initialization', () => {
    cy.visit(Cypress.env('local_test_server_url'));
    
    cy.get('div#editorjs')
      .get('div.codex-editor')
      .should('be.visible');
  });
});