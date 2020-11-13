describe('should initialize editorjs instance correctly', () => {
  it('create editor js instance on the page and check if it is visible', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    cy.window().then(window => {
      assert.isFunction(window.EditorJS, 'window.EditorJS is a function');
    });

    cy.window().then(window => {
      const editor = new window.EditorJS({});

      /**
       * Assert the created editor instance.
       */
      expect(editor).to.be.instanceOf(window.EditorJS);
    });
  });
});