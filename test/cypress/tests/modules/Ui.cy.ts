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
});
