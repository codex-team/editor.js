import { createEditorWithTextBlocks } from '../../../support/utils/createEditorWithTextBlocks';
import ContentlessToolMock from '../../../fixtures/tools/ContentlessTool';

describe('Arrow Left', function () {
  describe('starting whitespaces handling', function () {
    it('&nbsp;| — should natively move caret over the visible space. Then move to the prev block', function () {
      createEditorWithTextBlocks([
        '1',
        '&nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last() // select second block
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{leftArrow}') // move caret over nbsp
        .type('{leftArrow}'); // move to the prev block

      /**
       * Caret is set to the end of the previous block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(1);
            });
        });
    });
    it(' | — should ignore invisible space before caret and move caret to the prev block', function () {
      createEditorWithTextBlocks([
        '1',
        ' 2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last() // select second block
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{leftArrow}'); // move to the prev block

      /**
       * Caret is set to the end of the previous block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(1);
            });
        });
    });

    it('<b></b>| — should ignore empty tags before caret and move caret to the prev block', function () {
      createEditorWithTextBlocks([
        '1',
        '<b></b>2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last() // select second block
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{leftArrow}'); // move to the prev block

      /**
       * Caret is set to the end of the previous block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(1);
            });
        });
    });
    it('<b></b>&nbsp;| — should move caret over the visible space and then to the prev block', function () {
      createEditorWithTextBlocks([
        '1',
        '<b></b>&nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{leftArrow}') // move caret over nbsp
        .type('{leftArrow}'); // move to the prev block

      /**
       * Caret is set to the end of the previous block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(1);
            });
        });
    });

    it('&nbsp;<b></b>| — should ignore empty tag and move caret over the visible space. Then move to the prev block', function () {
      createEditorWithTextBlocks([
        '1',
        '<b></b>&nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{leftArrow}') // ignore empty tag and move caret over nbsp
        .type('{leftArrow}'); // move to the prev block

      /**
       * Caret is set to the end of the previous block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(1);
            });
        });
    });

    it(' &nbsp;| — should move caret over the visible space. Then move to the prev block', function () {
      createEditorWithTextBlocks([
        '1',
        ' &nbsp;2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .last()
        .click()
        .type('{leftArrow}') // set caret before "2"
        .type('{leftArrow}') // remove nbsp
        .type('{leftArrow}'); // ignore regular space and move to the prev block

      /**
       * Caret is set to the end of the previous block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(1);
            });
        });
    });
  });

  /**
   * In this test we check case:
   *
   * Text Block №1
   * Delimiter
   * Text Block №2
   *
   * we set caret to the start of the Text Block №2 and press Left Arrow
   *
   * Expected: Delimiter is selected
   *
   * Then we press Left Arrow again
   *
   * Expected: Caret is set to the end of the Text Block №1
   */
  it('should move caret to the prev block if currently focused block is contentless (Delimiter)', function () {
    cy.createEditor({
      tools: {
        delimiter: ContentlessToolMock,
      },
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
            type: 'delimiter',
            data: {},
          },
          {
            id: 'block3',
            type: 'paragraph',
            data: {
              text: '2',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .last()
      .as('thirdBlock')
      .click()
      .type('{moveToStart}') // set caret before "2"
      .type('{leftArrow}'); // navigate to the Delimiter

    /**
     * We navigated to the Delimiter and it is highlighted
     */
    cy.get('[data-cy=editorjs]')
      .find('div[data-cy-type=contentless-tool]')
      .parents('.ce-block')
      .as('delimiterBlock')
      .should('have.class', 'ce-block--selected');

    /**
     * Now press Left again and we should be navigated to the end of the previous block
     */
    cy.get('@thirdBlock')
      .type('{leftArrow}');

    /**
     * Delimiter is not selected anymore
     */
    cy.get('@delimiterBlock')
      .should('not.have.class', 'ce-block--selected');

    /**
     * Caret is set to the end of the first block
     */
    cy.window()
      .then((window) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .first()
          .should(($block) => {
            expect($block[0].contains(range.startContainer)).to.be.true;
            expect(range.startOffset).to.eq(1);
          });
      });
  });
});
