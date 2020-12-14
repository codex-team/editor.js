describe('inlineToolbar property', () => {
  const editorConfig = {};

  beforeEach(() => {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    } else {
      cy.createEditor(editorConfig).as('editorInstance');
    }
  });
  describe('default configuration', () => {
    it('should show only enabled tools with proper order', () => {

    });
  });

  describe('boolean configuration', () => {
    it('should show only enabled tools with proper order', () => {

    });
  });

  describe('tools array configuration', () => {
    it('should show only enabled tools with proper order', () => {

    });
  });
});