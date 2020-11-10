describe('Editor.js with default configuration', () => {
  it('should have a global EditorJS function', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    cy.window().then(window => {
      assert.isFunction(window.EditorJS, 'window.EditorJS is a function');
    });
  });

  it('create editor js instance on the page and check if it is visible', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    cy.window().then(window => {
      const editor = new window.EditorJS({
        holder: 'editorjs'
      })

      expect(editor).to.be.instanceOf(window.EditorJS)
    })

    cy.get('div#editorjs')
      .get('div.codex-editor')
      .should('be.visible');
  })
});