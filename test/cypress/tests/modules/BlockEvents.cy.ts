import type EditorJS from '../../../../types/index';

/**
 * Creates Editor instance with list of Paragraph blocks of passed texts
 *
 * @param textBlocks - list of texts for Paragraph blocks
 */
function createEditorWithTextBlocks(textBlocks: string[]): void {
  cy.createEditor({
    data: {
      blocks: textBlocks.map((text) => ({
        type: 'paragraph',
        data: {
          text,
        },
      })),
    },
  });
}

describe('Keydown', function () {
  describe.skip('Enter', function () {
    it('should split block and remove selected fragment if some text fragment selected', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'The block with some text',
              },
            },
          ],
        },
      });


      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .selectText('with so')
        .wait(0)
        .type('{enter}');


      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .then((blocks) => {
          /**
           * Check that there is two blocks after split
           */
          expect(blocks.length).to.equal(2);

          /**
           * Check that selected text fragment has been removed
           */
          expect(blocks[0].textContent).to.equal('The block ');
          expect(blocks[1].textContent).to.equal('me text');
        });
    });

    it('should set caret to the new block if it was created after Enter key press at very end of the block', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'The block with some text',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('{enter}');

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .as('lastBlock');

      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('@lastBlock').should(($block) => {
            expect($block[0].contains(range.startContainer)).to.be.true;
          });
        });
    });
  });

  describe('Backspace', function () {
    it('should just delete chars (native behaviour) when some fragment is selected', function () {
      createEditorWithTextBlocks([
        'The first block',
        'The second block',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .selectText('The ')
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', 'second block');
    });

    it('should just delete chars (native behaviour) when Caret is not at the start of the Block', function () {
      createEditorWithTextBlocks([
        'The first block',
        'The second block',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click() // caret will be at the end of the block
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', 'The second bloc'); // last char is removed
    });

    it('should navigate previous input when Caret is not at the first input', function () {
      /**
       * Mock of tool with several inputs
       */
      class ExampleOfToolWithSeveralInputs {
        /**
         * Render method mock
         */
        public render(): HTMLElement {
          const container = document.createElement('div');
          const input = document.createElement('div');
          const input2 = document.createElement('div');

          container.setAttribute('data-cy', 'quote-tool');

          input.setAttribute('contenteditable', 'true');
          input2.setAttribute('contenteditable', 'true');

          container.append(input, input2);

          return container;
        }

        /**
         * Saving logic is not necessary for this test
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        public save(): void {}
      }

      cy.createEditor({
        tools: {
          quote: ExampleOfToolWithSeveralInputs,
        },
        data: {
          blocks: [
            {
              type: 'quote',
              data: {},
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('[data-cy=quote-tool]')
        .find('div[contenteditable]')
        .last()
        .click()
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('[data-cy=quote-tool]')
        .find('div[contenteditable]')
        .first()
        .as('firstInput');

      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('@firstInput').should(($div) => {
            expect($div[0].contains(range.startContainer)).to.be.true;
          });
        });
    });

    it('should remove previous Block if Caret at the start of the Block and previous Block is empty. Also, should close the Toolbox', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              id: 'block1',
              type: 'paragraph',
              data: {
                text: '', // empty block
              },
            },
            {
              id: 'block2',
              type: 'paragraph',
              data: {
                text: 'Not empty block',
              },
            },
          ],
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{home}') // move caret to the beginning
        .type('{backspace}');

      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const { blocks } = await editor.save();

          expect(blocks.length).to.eq(1); // one block has been removed
          expect(blocks[0].id).to.eq('block2'); // second block is still here
        });
    });

    it('should remove current Block if it is empty, but previous is not. Also, should close the Toolbox and set Caret to the end of the prev Block', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              id: 'block1',
              type: 'paragraph',
              data: {
                text: 'Not empty block',
              },
            },
            {
              id: 'block2',
              type: 'paragraph',
              data: {
                text: '',  // empty block
              },
            },
          ],
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{backspace}');

      /**
       * Current Block has been removed
       */
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const { blocks } = await editor.save();

          expect(blocks.length).to.eq(1); // one block has been removed
          expect(blocks[0].id).to.eq('block1'); // second block is still here
        });

      /**
       * Caret is set to the end of the previous Block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.be.eq($block[0].textContent.length);
            });
        });

      /**
       * Toolbox has been closed
       */
      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('not.have.class', 'ce-toolbar--opened');
    });

    it('should merge current Block with the previous one if Caret at the start of the Block and both Blocks are mergeable. Also, should close the Toolbox.', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              id: 'block1',
              type: 'paragraph',
              data: {
                text: 'First block',
              },
            },
            {
              id: 'block2',
              type: 'paragraph',
              data: {
                text: 'Second block',
              },
            },
          ],
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{home}') // move caret to the beginning
        .type('{backspace}');

      /**
       * Current Block has been removed
       */
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const { blocks } = await editor.save();

          expect(blocks.length).to.eq(1); // one block has been removed
          expect(blocks[0].id).to.eq('block1'); // second block is still here
          expect(blocks[0].data.text).to.eq('First blockSecond block'); // text has been merged
        });

      /**
       * Caret is set to the place of merging
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              range.startContainer.normalize(); // glue merged text nodes
              expect(range.startOffset).to.be.eq('First block'.length);
            });
        });

      /**
       * Toolbox has been closed
       */
      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('not.have.class', 'ce-toolbar--opened');
    });

    it.only('should simply set Caret to the end of the previous Block if Caret at the start of the Block but Blocks are not mergeable. Also, should close the Toolbox.', function () {
      /**
       * Mock of tool without merge method
       */
      class ExampleOfUnmergeableTool {
        /**
         * Render method mock
         */
        public render(): HTMLElement {
          const container = document.createElement('div');

          container.dataset.cy = 'unmergeable-tool';
          container.contentEditable = 'true';
          container.innerHTML = 'Unmergeable not empty tool';

          return container;
        }

        /**
         * Saving logic is not necessary for this test
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        public save(): void {}
      }

      cy.createEditor({
        tools: {
          code: ExampleOfUnmergeableTool,
        },
        data: {
          blocks: [
            {
              type: 'code',
              data: {},
            },
            {
              type: 'paragraph',
              data: {
                text: 'Second block',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{home}')
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('[data-cy=unmergeable-tool]')
        .as('firstBlock');

      /**
       * Caret is set to the previous Block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('@firstBlock').should(($div) => {
            expect($div[0].contains(range.startContainer)).to.be.true;
          });
        });
    });
  });

  describe('Delete', function () {
    it('should not remove Block and just delete chars (native behaviour) when some fragment is selected', function () {
    });

    it('should not remove Block and just delete chars (native behaviour) when Caret is not at the end of the Block', function () {
    });

    it('should not remove Block and just delete chars (native behaviour) when Caret is not at the last input', function () {
    });

    it('should remove next Block if Caret at the end of the Block and next Block is empty. Also, should close the Toolbox', function () {
    });

    it('should remove current Block it is empty, but next is not. Also, should close the Toolbox and set Caret to the start of the next Block', function () {
    });

    it('should merge current Block with the next one if Caret at the end of the Block and both Blocks are mergeable. Also, should close the Toolbox.', function () {
    });

    it('should simply set Caret to the start of the next Block if Caret at the end of the Block but Blocks are not mergeable. Also, should close the Toolbox.', function () {
    });
  });
});
