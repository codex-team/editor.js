describe('Editor basic initialization', () => {
  describe('Zero-config initialization', () => {
    const editorConfig = {};

    beforeEach(() => {
      if (this.editorInstance){
        this.editorInstance.destroy();
      } else {
        cy.createEditor(editorConfig).as('editorInstance');
      }
    });

    // it('should have global EditorJS variable', () => {
    //   cy.window().then(window => {
    //     assert.isFunction(window.EditorJS);
    //   });
    // });

    // it('should create instance of EditorJS right', () => {
    //   cy.window().then((window) => {
    //     const editor = new window.EditorJS({});
  
    //     expect(editorInstance).to.be.instanceOf(EditorJS);
    //   });
    // });

    it('should create a visible UI', () => {
      cy.window().then((window) => {
        // const editor = new window.EditorJS({});
  
        /**
         * Assert if create editor instance is visible or not.
         */
        cy.get('[data-cy=editorjs]')
          .get('div.codex-editor')
          .should('be.visible');
      });
    });
  });
});