import { BlockMutationType } from '../../../../types/events/block/mutation-type';

/**
 * There will be described test cases of BlockAPI
 */
describe('BlockAPI', () => {
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

  /**
   * EditorJS API is passed as the first parameter of the onChange callback
   */
  const EditorJSApiMock = Cypress.sinon.match.any;

  beforeEach(() => {
    if (this && this.editorInstance) {
      this.editorInstance.destroy();
    } else {
      const config = {
        data: editorDataMock,
        onChange: (): void => { console.log('something changed'); },
      };

      cy.createEditor(config).as('editorInstance');

      cy.spy(config, 'onChange').as('onChange');
    }
  });

  /**
   * block.dispatchChange();
   */
  describe('.dispatchChange()', () => {
    /**
     * Check that blocks.dispatchChange() triggers Editor 'onChange' callback
     */
    it('should trigger onChange with corresponded block', () => {
      cy.get('@editorInstance').then(async (editor: any) => {
        const block = editor.blocks.getById(firstBlock.id);

        block.dispatchChange();

        cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
          type: BlockMutationType.Changed,
          detail: {
            index: 0,
          },
        }));
      });
    });
  });

});
