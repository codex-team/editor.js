/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * There will be described test cases of 'api.toolbar.*' API
 */
describe('api.toolbar', () => {
  /**
   * api.toolbar.openToolbox(openingState?: boolean)
   */
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

  beforeEach(function () {
    cy.createEditor({
      data: editorDataMock,
      readOnly: false,
    }).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  });

  describe('*.openToolbox()', () => {
    it('should open the toolbox', function () {
      cy.get('@editorInstance').then(async function (editor: any) {
        editor.toolbar.openToolbox(true);

        cy.get('.ce-toolbox').should('exist');
      });
    });
  });
});
