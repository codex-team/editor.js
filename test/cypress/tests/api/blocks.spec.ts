/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * There will be described test cases of 'blocks.*' API
 */
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

        expect(block).not.to.be.undefined;
        expect(block.id).to.be.eq(firstBlock.id);
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

  /**
   * api.blocks.update(id, newData)
   */
  describe('.update()', () => {
    /**
     * Check if block is updated in DOM
     */
    it('should update block in DOM', () => {
      cy.get('@editorInstance').then(async (editor: any) => {
        const idToUpdate = firstBlock.id;
        const newBlockData = {
          text: 'Updated text',
        };

        editor.blocks.update(idToUpdate, newBlockData);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .invoke('text')
          .then(blockText => {
            expect(blockText).to.be.eq(newBlockData.text);
          });
      });
    });

    /**
     * Check if block's data is updated after saving
     */
    it('should update block in saved data', () => {
      cy.get('@editorInstance').then(async (editor: any) => {
        const idToUpdate = firstBlock.id;
        const newBlockData = {
          text: 'Updated text',
        };

        editor.blocks.update(idToUpdate, newBlockData);

        const output = await (editor as any).save();
        const text = output.blocks[0].data.text;

        expect(text).to.be.eq(newBlockData.text);
      });
    });

    /**
     * When incorrect id passed, editor should not update any block
     */
    it('shouldn\'t update any block if not-existed id passed', () => {
      cy.get('@editorInstance').then(async (editor: any) => {
        const idToUpdate = 'wrong-id-123';
        const newBlockData = {
          text: 'Updated text',
        };

        editor.blocks.update(idToUpdate, newBlockData);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .invoke('text')
          .then(blockText => {
            expect(blockText).to.be.eq(firstBlock.data.text);
          });
      });
    });
  });
});
