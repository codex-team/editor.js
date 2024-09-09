import type EditorJS from '../../../../../types/index';
import { SimpleHeader } from '../../../fixtures/tools/SimpleHeader';
import type { ConversionConfig } from '../../../../../types/index';
import { createEditorWithTextBlocks } from '../../../support/utils/createEditorWithTextBlocks';

describe('Backspace keydown', function () {
  describe('starting whitespaces handling', function () {
    it('&nbsp;| — should delete visible space', function () {
      createEditorWithTextBlocks([
        '1',
        '&nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', '2');
    });
    it(' | — should ignore invisible space before caret and handle it like regular backspace case (merge with previous)', function () {
      createEditorWithTextBlocks([
        '1',
        ' 2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', '12');
    });
    it('<b></b>| — should ignore empty tags before caret and handle it like regular backspace case (merge with previous)', function () {
      createEditorWithTextBlocks([
        '1',
        '<b></b>2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', '12');
    });
    it('<b></b>&nbsp;| — should remove visible space and ignore empty tag', function () {
      createEditorWithTextBlocks([
        '1',
        '<b></b>&nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{backspace}') // remove nbsp
        .type('{backspace}'); // ignore empty tag and merge

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', '12');
    });

    it('&nbsp;<b></b>| — should remove visible space and ignore empty tag', function () {
      createEditorWithTextBlocks([
        '1',
        '<b></b>&nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{backspace}') // remove nbsp
        .type('{backspace}'); // ignore empty tag and merge

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', '12');
    });

    it(' &nbsp;| — should remove visible space and ignore space', function () {
      createEditorWithTextBlocks([
        '1',
        ' &nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{backspace}') // remove nbsp
        .type('{backspace}'); // ignore regular space and merge

      cy.get('[data-cy=editorjs]')
        .find('div.ce-block')
        .last()
        .should('have.text', '12');
    });
  });

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

  it('should merge current Block with the previous one if Caret at the start of the Block and both Blocks are mergeable. Also, should close the Toolbox. Caret should be places in a place of glue', function () {
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

  it('should merge blocks of different types (Paragraph -> Header) if they have a valid conversion config. Also, should close the Toolbox. Caret should be places in a place of glue', function () {
    cy.createEditor({
      tools: {
        header: SimpleHeader,
      },
      data: {
        blocks: [
          {
            id: 'block1',
            type: 'header',
            data: {
              text: 'First block heading',
            },
          },
          {
            id: 'block2',
            type: 'paragraph',
            data: {
              text: 'Second block paragraph',
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
        expect(blocks[0].id).to.eq('block1'); // second block is still here
        expect(blocks[0].data.text).to.eq('First block headingSecond block paragraph'); // text has been merged
      });

    /**
     * Caret is set to the place of merging
     */
    cy.window()
      .then((window) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        cy.get('[data-cy=editorjs]')
          .find('[data-cy=block-wrapper]')
          .should(($block) => {
            expect($block[0].contains(range.startContainer)).to.be.true;
            range.startContainer.normalize(); // glue merged text nodes
            expect(range.startOffset).to.be.eq('First block heading'.length);
          });
      });

    /**
     * Toolbox has been closed
     */
    cy.get('[data-cy=editorjs]')
      .find('.ce-toolbar')
      .should('not.have.class', 'ce-toolbar--opened');
  });

  it('should merge blocks of different types (Header -> Paragraph) if they have a valid conversion config. Also, should close the Toolbox. Caret should be places in a place of glue', function () {
    cy.createEditor({
      tools: {
        header: SimpleHeader,
      },
      data: {
        blocks: [
          {
            id: 'block1',
            type: 'paragraph',
            data: {
              text: 'First block paragraph',
            },
          },
          {
            id: 'block2',
            type: 'header',
            data: {
              text: 'Second block heading',
            },
          },
        ],
      },
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .find('[data-cy="block-wrapper"][data-id="block2"]')
      .click()
      .type('{home}') // move caret to the beginning
      .type('{backspace}');

    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const { blocks } = await editor.save();

        expect(blocks.length).to.eq(1); // one block has been removed
        expect(blocks[0].id).to.eq('block1'); // second block is still here
        expect(blocks[0].data.text).to.eq('First block paragraphSecond block heading'); // text has been merged
      });

    /**
     * Caret is set to the place of merging
     */
    cy.window()
      .then((window) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        cy.get('[data-cy=editorjs]')
          .find('[data-cy=block-wrapper]')
          .should(($block) => {
            expect($block[0].contains(range.startContainer)).to.be.true;
            range.startContainer.normalize(); // glue merged text nodes
            expect(range.startOffset).to.be.eq('First block paragraph'.length);
          });
      });

    /**
     * Toolbox has been closed
     */
    cy.get('[data-cy=editorjs]')
      .find('.ce-toolbar')
      .should('not.have.class', 'ce-toolbar--opened');
  });

  it('should simply set Caret to the end of the previous Block if Caret at the start of the Block but Blocks are not mergeable (target Bock is lack of merge() and conversionConfig). Also, should close the Toolbox.', function () {
    /**
     * Mock of tool without merge() method
     */
    class UnmergeableToolWithoutConversionConfig {
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
        code: UnmergeableToolWithoutConversionConfig,
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

  it('should simply set Caret to the end of the previous Block if Caret at the start of the Block but Blocks are not mergeable (target Bock is lack of merge() but has the conversionConfig). Also, should close the Toolbox.', function () {
    /**
     * Mock of tool without merge() method
     */
    class UnmergeableToolWithConversionConfig {
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
      public save(): { key: string } {
        return {
          key: 'value',
        };
      }

      /**
       * Mock of the conversionConfig
       */
      public static get conversionConfig(): ConversionConfig {
        return {
          export: 'key',
          import: 'key',
        };
      }
    }

    cy.createEditor({
      tools: {
        code: UnmergeableToolWithConversionConfig,
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

  describe('at the start of the first Block', function () {
    it('should do nothing if Block is not empty', function () {
      createEditorWithTextBlocks([ 'The only block. Not empty' ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('{home}')
        .type('{backspace}');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .should('have.length', 1)
        .should('have.text', 'The only block. Not empty');
    });
  });
});
