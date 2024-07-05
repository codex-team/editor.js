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

  /**
   * Creates Editor instance
   *
   * @param [data] - data to render
   */
  function createEditor(data = undefined): void {
    const config = {
      onChange: (api, event): void => {
        console.log('something changed', event);
      },
      data,
    };

    cy.spy(config, 'onChange').as('onChange');

    cy.createEditor(config).as('editorInstance');
  }

  /**
   * block.dispatchChange();
   */
  describe('.dispatchChange()', () => {
    /**
     * Check that blocks.dispatchChange() triggers Editor 'onChange' callback
     */
    it('should trigger onChange with corresponded block', () => {
      createEditor(editorDataMock);

      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const block = editor.blocks.getById(firstBlock.id);

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
