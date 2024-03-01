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

    describe('Clicking outside', function () {
      it('should clear current block even if selection was inside the editor before clicking', function () {
        cy.createEditor({
          data: {
            blocks: [
              {
                id: 'block1',
                type: 'paragraph',
                data: {
                  text: '',
                },
              },
            ],
          },
        }).as('editorInstance');

        cy.get('[data-cy=editorjs]')
          .then(editor => {
            const editorsParent = editor[0].parentNode;
            const input = editorsParent.ownerDocument.createElement('div');

            input.contentEditable = 'true';
            input.style.width = '20px';
            input.style.height = '20px';
            input.setAttribute('data-cy', 'test-input');

            editorsParent.appendChild(input);
          });

        /**
         * Put cursor inside the editor
         */
        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .first()
          .click();

        /**
         * Click outside of the editor and type '/'
         */
        cy.get('[data-cy=test-input]')
          .click()
          .type('/');

        /**
         * Toolbox shouldn't be open
         */
        cy.get('[data-cy=editorjs]')
          .get('div.ce-toolbox .ce-popover')
          .should('not.be.visible');
      });
    });
  });
});
