/**
 * There will be described test cases of 'blocks.*' API
 */
import BlockAPI from "../../../../src/components/block/api";

describe('api.blocks', () => {
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
     * Check that api.blocks.getByUd(id) returns the Block for existed id
     */
    it('should return Block API for existed id', () => {
      cy.get('@editorInstance').then(async (editor: any) => {
        const block = editor.blocks.getById(firstBlock.id);

        expect(editor.blocks.getById(firstBlock.id)).not.to.be.undefined;
        // expect(block).to.be.instanceOf(BlockAPI);
      });
    });

    /**
     * Check that api.blocks.getByUd(id) returns null for the not-existed id
     */
    it('should return null for not-existed id', () => {
      cy.get('@editorInstance').then(async (editor: any) => {
        expect(editor.blocks.getById('not-existed-id')).to.be.null;
      });
    });
  });
});
