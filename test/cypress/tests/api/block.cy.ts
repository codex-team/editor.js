import EditorJS from '../../../../types';
import { BlockChangedMutationType } from '../../../../types/events/block/BlockChanged';

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

  beforeEach(function () {
    const config = {
      data: editorDataMock,
      onChange: (): void => {
        console.log('something changed');
      },
    };

    cy.createEditor(config).as('editorInstance');

    cy.spy(config, 'onChange').as('onChange');
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
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
      cy.get('@editorInstance').then(async (editor: unknown) => {
        const block = (editor as EditorJS).blocks.getById(firstBlock.id);

        block.dispatchChange();

        cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
          type: BlockChangedMutationType,
          detail: {
            index: 0,
          },
        }));
      });
    });
  });
});
