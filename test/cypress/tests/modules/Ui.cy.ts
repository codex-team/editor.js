import { createEditorWithTextBlocks } from '../../support/utils/createEditorWithTextBlocks';
import type EditorJS from '../../../../types/index';

describe('Ui module', function () {
  describe('documentKeydown', function () {
    describe('Backspace', function () {
      it('should remove selected blocks', function () {
        cy.createEditor({
          data: {
            blocks: [
              {
                id: 'block1',
                type: 'paragraph',
                data: {
                  text: 'The first block',
                },
              },
              {
                id: 'block2',
                type: 'paragraph',
                data: {
                  text: 'The second block',
                },
              },
            ],
          },
        }).as('editorInstance');

        /**
         * Select two blocks by shift+down
         */
        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .first()
          .click()
          .type('{shift+downArrow}')
          .type('{backspace}');


        cy.get<EditorJS>('@editorInstance')
          .then(async (editor) => {
            const { blocks } = await editor.save();

            /**
             * Actually editor will contain 1 empty block, but save wont return it since it is empty
             */
            expect(blocks.length).to.eq(0);
          });
      });
    });

    describe('Delete', function () {
      it('should remove selected blocks', function () {
        cy.createEditor({
          data: {
            blocks: [
              {
                id: 'block1',
                type: 'paragraph',
                data: {
                  text: 'The first block',
                },
              },
              {
                id: 'block2',
                type: 'paragraph',
                data: {
                  text: 'The second block',
                },
              },
            ],
          },
        }).as('editorInstance');

        /**
         * Select two blocks by shift+down
         */
        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .first()
          .click()
          .type('{shift+downArrow}')
          .type('{del}');

        cy.get<EditorJS>('@editorInstance')
          .then(async (editor) => {
            const { blocks } = await editor.save();

            /**
             * Actually editor will contain 1 empty block, but save wont return it since it is empty
             */
            expect(blocks.length).to.eq(0);
          });
      });
    });
  });

  describe('mousedown', function () {
    it('should update current block by click on block', function () {
      createEditorWithTextBlocks([
        'first block',
        'second block',
        'third block',
      ])
        .as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .eq(1)
        .click();

      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const currentBlockIndex = await editor.blocks.getCurrentBlockIndex();

          expect(currentBlockIndex).to.eq(1);
        });
    });

    it('(in readonly) should update current block by click on block', function () {
      createEditorWithTextBlocks([
        'first block',
        'second block',
        'third block',
      ], {
        readOnly: true,
      })
        .as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .eq(1)
        .click();

      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const currentBlockIndex = await editor.blocks.getCurrentBlockIndex();

          expect(currentBlockIndex).to.eq(1);
        });
    });
  });
});
