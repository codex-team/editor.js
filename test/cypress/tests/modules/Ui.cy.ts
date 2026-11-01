import { createEditorWithTextBlocks } from '../../support/utils/createEditorWithTextBlocks';
import type EditorJS from '../../../../types/index';

describe('Ui module', function () {
  describe('responsive layout', function () {
    it('should not read holder width during initialization', function () {
      cy.window()
        .then(async (window) => {
          const holder = window.document.createElement('div');
          let holderWidthRead = false;

          holder.id = 'editorjs';
          Object.defineProperty(holder, 'offsetWidth', {
            configurable: true,
            get: () => {
              holderWidthRead = true;

              return 700;
            },
          });
          window.document.body.appendChild(holder);

          const editor = new window.EditorJS({
            holder,
          });

          await editor.isReady;

          expect(holderWidthRead).to.be.false;

          editor.destroy();
        });
    });

    it('should keep the plus button left of the content in a thin holder on a wide screen', function () {
      cy.viewport(1000, 800);
      cy.createEditor();

      cy.get('[data-cy=editorjs]')
        .invoke('css', 'width', '500px')
        .find('.ce-paragraph')
        .click();

      cy.get('[data-cy=editorjs]')
        .then(($holder) => {
          const holderRect = $holder[0].getBoundingClientRect();
          const holderContentLeft = holderRect.left + $holder[0].clientLeft;
          const plusButtonRect = $holder.find('.ce-toolbar__plus')[0].getBoundingClientRect();
          const blockContentRect = $holder.find('.ce-block__content')[0].getBoundingClientRect();

          expect(plusButtonRect.width).to.be.greaterThan(0);
          expect(plusButtonRect.left).to.equal(holderContentLeft);
          expect(plusButtonRect.right).to.be.at.most(blockContentRect.left);
        });
    });

    it('should preserve the mobile toolbar and toolbox layout', function () {
      cy.viewport(375, 667);
      cy.createEditor();

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click();

      cy.get('[data-cy=editorjs]')
        .then(($holder) => {
          const holderRect = $holder[0].getBoundingClientRect();
          const plusButtonRect = $holder.find('.ce-toolbar__plus')[0].getBoundingClientRect();

          expect(plusButtonRect.left).to.be.at.least(holderRect.left);
          expect(plusButtonRect.right).to.be.at.most(holderRect.right);
        })
        .find('.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=toolbox]')
        .find('.ce-popover__container')
        .should('be.visible')
        .should(($popover) => {
          const popoverRect = $popover[0].getBoundingClientRect();
          const viewport = $popover[0].ownerDocument.defaultView;

          expect(viewport).not.to.be.null;
          expect(popoverRect.left).to.be.at.least(0);
          expect(popoverRect.right).to.be.at.most(viewport?.innerWidth);
          expect(popoverRect.top).to.be.at.least(0);
          expect(popoverRect.bottom).to.be.at.most(viewport?.innerHeight);
        });
    });

    it('should mirror the responsive toolbar in a thin RTL holder', function () {
      cy.viewport(1000, 800);
      cy.createEditor({
        i18n: {
          direction: 'rtl',
        },
      });

      cy.get('[data-cy=editorjs]')
        .invoke('css', 'width', '500px')
        .find('.ce-paragraph')
        .click();

      cy.get('[data-cy=editorjs]')
        .then(($holder) => {
          const holder = $holder[0];
          const holderRect = holder.getBoundingClientRect();
          const holderRightBorder = holder.offsetWidth - holder.clientWidth - holder.clientLeft;
          const holderContentRight = holderRect.right - holderRightBorder;
          const plusButtonRect = $holder.find('.ce-toolbar__plus')[0].getBoundingClientRect();
          const blockContentRect = $holder.find('.ce-block__content')[0].getBoundingClientRect();

          expect(plusButtonRect.right).to.equal(holderContentRight);
          expect(plusButtonRect.left).to.be.at.least(blockContentRect.right);
        });
    });

    it('should keep the rectangle selection overlay fixed to the viewport', function () {
      cy.viewport(1000, 800);
      cy.createEditor();

      cy.get('[data-cy=editorjs]')
        .invoke('css', {
          marginLeft: '40px',
          width: '500px',
        })
        .find('.codex-editor-overlay')
        .then(($overlay) => {
          const overlayRect = $overlay[0].getBoundingClientRect();

          expect(overlayRect.left).to.equal(0);
          expect(overlayRect.top).to.equal(0);
          expect(overlayRect.right).to.equal(1000);
          expect(overlayRect.bottom).to.equal(800);
        });
    });
  });

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
