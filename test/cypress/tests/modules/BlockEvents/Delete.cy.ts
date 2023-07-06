import type EditorJS from '../../../../../types/index';

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

describe('Delete keydown', function () {
  it('should just delete chars (native behaviour) when some fragment is selected', function () {
    createEditorWithTextBlocks([
      'The first block',
      'The second block',
    ]);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .first()
      .click()
      .selectText('The ')
      .type('{del}');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .first()
      .should('have.text', 'first block');
  });

  it('should just delete chars (native behaviour) when Caret is not at the end of the Block', function () {
    createEditorWithTextBlocks([
      'The first block',
      'The second block',
    ]);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .first()
      .click() // caret will be at the end of the block
      .type('{leftarrow}') // now caret is not at the end
      .type('{del}');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .first()
      .should('have.text', 'The first bloc'); // last char is removed
  });

  it('should navigate next input when Caret is not at the last input', function () {
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
      .first()
      .click()
      .type('{del}');

    cy.get('[data-cy=editorjs]')
      .find('[data-cy=quote-tool]')
      .find('div[contenteditable]')
      .last()
      .as('secondInput');

    cy.window()
      .then((window) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        cy.get('@secondInput').should(($div) => {
          expect($div[0].contains(range.startContainer)).to.be.true;
        });
      });
  });

  it('should remove next Block if Caret at the end of the Block and next Block is empty. Also, should close the Toolbox', function () {
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
              text: '', // empty block
            },
          },
        ],
      },
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .first()
      .click()
      .type('{del}');

    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks.length).to.eq(1); // one block has been removed
        expect(blocks[0].id).to.eq('block1'); // first block is still here
      });
  });

  it('should remove current Block if it is empty, but next is not. Also, should close the Toolbox and set Caret to the start of the next Block', function () {
    cy.createEditor({
      data: {
        blocks: [
          {
            id: 'block1',
            type: 'paragraph',
            data: {
              text: '1',
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
      .first()
      .click()
      .type('{backspace}') // remove '1' to make block empty
      .type('{del}');

    /**
     * Current Block has been removed
     */
    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks.length).to.eq(1); // one block has been removed
        expect(blocks[0].id).to.eq('block2'); // second block is still here
      });

    /**
     * Caret is set to the start of the next Block
     */
    cy.window()
      .then((window) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .should(($block) => {
            expect($block[0].contains(range.startContainer)).to.be.true;
            expect(range.startOffset).to.be.eq(0);
          });
      });

    /**
     * Toolbox has been closed
     */
    cy.get('[data-cy=editorjs]')
      .find('.ce-toolbar')
      .should('not.have.class', 'ce-toolbar--opened');
  });

  it('should merge current Block with the next one if Caret at the end of the Block and both Blocks are mergeable. Also, should close the Toolbox.', function () {
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
      .first()
      .click()
      .type('{del}');

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

  it('should simply set Caret to the start of the next Block if Caret at the end of the Block but Blocks are not mergeable. Also, should close the Toolbox.', function () {
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
            type: 'paragraph',
            data: {
              text: 'Second block',
            },
          },
          {
            type: 'code',
            data: {},
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .click()
      .type('{del}');

    cy.get('[data-cy=editorjs]')
      .find('[data-cy=unmergeable-tool]')
      .as('secondBlock');

    /**
     * Caret is set to the previous Block
     */
    cy.window()
      .then((window) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        cy.get('@secondBlock').should(($div) => {
          expect($div[0].contains(range.startContainer)).to.be.true;
        });
      });
  });

  describe('at the end of the last Block', function () {
    it('should do nothing', function () {
      createEditorWithTextBlocks([ 'The only block. Not empty' ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('{del}');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .should('have.length', 1)
        .should('have.text', 'The only block. Not empty');
    });
  });
});
