import EditorJS from '../../../../types';

/**
 * Test cases for Caret API
 */
describe('Caret API', () => {
  const paragraphDataMock = {
    id: 'bwnFX5LoX7',
    type: 'paragraph',
    data: {
      text: 'The first block content mock.',
    },
  };

  describe('.setToBlock()', () => {
    /**
     * The arrange part of the following tests are the same:
     *  - create an editor
     *  - move caret out of the block by default
     */
    beforeEach(() => {
      cy.createEditor({
        data: {
          blocks: [
            paragraphDataMock,
          ],
        },
      }).as('editorInstance');

      /**
       * Blur caret from the block before setting via api
       */
      cy.get('[data-cy=editorjs]')
        .click();
    });

    it('should set caret to a block (and return true) if block index is passed as argument', () => {
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const returnedValue = editor.caret.setToBlock(0);

          /**
           * Check that caret belongs block
           */
          cy.window()
            .then((window) => {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);

              cy.get('[data-cy=editorjs]')
                .find('.ce-block')
                .first()
                .should(($block) => {
                  expect($block[0].contains(range.startContainer)).to.be.true;
                });
            });

          expect(returnedValue).to.be.true;
        });
    });

    it('should set caret to a block (and return true) if block id is passed as argument', () => {
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const returnedValue = editor.caret.setToBlock(paragraphDataMock.id);

          /**
           * Check that caret belongs block
           */
          cy.window()
            .then((window) => {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);

              cy.get('[data-cy=editorjs]')
                .find('.ce-block')
                .first()
                .should(($block) => {
                  expect($block[0].contains(range.startContainer)).to.be.true;
                });
            });

          expect(returnedValue).to.be.true;
        });
    });

    it('should set caret to a block (and return true) if Block API is passed as argument', () => {
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const block = editor.blocks.getById(paragraphDataMock.id);
          const returnedValue = editor.caret.setToBlock(block);

          /**
           * Check that caret belongs block
           */
          cy.window()
            .then((window) => {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);

              cy.get('[data-cy=editorjs]')
                .find('.ce-block')
                .first()
                .should(($block) => {
                  expect($block[0].contains(range.startContainer)).to.be.true;
                });
            });

          expect(returnedValue).to.be.true;
        });
    });
  });
});
