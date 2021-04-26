/**
 * There will be described test cases of 'blocks.*' API
 */
describe('Blocks API', () => {
  const firstBlock = {
    id: 'bwnFX5LoX7',
    type: 'paragraph',
    data: {
      text: 'The first block content mock.',
    },
  };
  const editorDataMock = {
    blocks: [
      firstBlock,
    ],
  };

  beforeEach(() => {
    if (this && this.editorInstance) {
      this.editorInstance.destroy();
    } else {
      cy.createEditor({
        data: editorDataMock,
      }).as('editorInstance');
    }
  });

  /**
   * api.blocks.getById(id)
   */
  describe('.getById()', () => {
    /**
     * Check that api.blocks.getByUd(id) should return the Block for existed id
     */
    it('should return Block API for existed id', () => {
      cy.get('@editorInstance').then(async (editor: any) => {
        assert.isDefined(editor.blocks.getById(firstBlock.id));
      });
    });
  });
});
