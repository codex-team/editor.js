describe('Editor.js with default configuration', () => {
  it('should have a global EditorJS function', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    cy.window().then(window => {
      assert.isFunction(window.EditorJS, 'window.EditorJS is a function');
    });
  });

  it('create editor js instance on the page and check if it is visible', () => {
    cy.visit(Cypress.env('local_test_server_url'));

    /**
     * Initialize editor with some paragraph data imported form basic/paragraph_data.json fixture.
     */
    cy.fixture('basic/paragraph_data').then((paragraph) => {
      cy.window().then(window => {
        const editor = new window.EditorJS({
          holder: 'editorjs',
          data: {
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: paragraph.data
                }
              }
            ]
          }
        })

        /**
         * Assert the created editor instance.
         */
        expect(editor).to.be.instanceOf(window.EditorJS)
      })
    })

    /**
     * Assert if editor is created in the UI or not.
     */
    cy.get('div#editorjs')
      .get('div.codex-editor')
      .should('be.visible');

    /**
     * Assert if the provided pragraph data is present in the editor instance or not.
     */
    cy.fixture('basic/paragraph_data').then((paragraph) => {
      cy.contains('div.ce-paragraph', paragraph.data)
    })
  })
});