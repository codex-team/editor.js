describe('Editor.js configuration and holder property', () => {
  it('config object should exist and holder should have the provided value', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    cy.window().then(window => {
      assert.isFunction(window.EditorJS, 'window.EditorJS is a function');
    });

    cy.fixture('basic/paragraph_data').then((paragraph) => {
      cy.window().then(window => {
        const editor = new window.EditorJS({
          holder: 'editorjs'
        });

        /**
         * Assert the created editor instance.
         */
        expect(editor).to.be.instanceOf(window.EditorJS);

        /**
         * Assert the config object
         */
        expect(editor.configuration).to.exist;
        expect(editor.configuration).to.be.instanceOf(Object);

        /**
         * Assert the holder property
         */
        expect(editor.configuration.holder).to.equal('editorjs');
      });
    });

    /**
     * Assert if editor is created in the UI or not.
     */
    cy.get('div#editorjs')
      .get('div.codex-editor')
      .should('be.visible');
  });

});