import { createEditorWithTextBlocks } from '../../../support/utils/createEditorWithTextBlocks';
import ContentlessToolMock from '../../../fixtures/tools/ContentlessTool';

describe('Arrow Right', function () {
  describe('starting whitespaces handling', function () {
    it('|&nbsp; — should natively move caret over the visible space. Then move to the next block', function () {
      createEditorWithTextBlocks([
        '1&nbsp;',
        '2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first() // select first block
        .as('firstBlock')
        .click()
        .type('{moveToStart}')
        .type('{rightArrow}') // set caret after "1"
        .type('{rightArrow}') // move caret over nbsp
        .type('{rightArrow}'); // move to the next block

      /**
       * Caret is set to the start of the next block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .last()
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(0);
            });
        });
    });

    it('"| " — should ignore invisible space after caret and move caret to the next block', function () {
      createEditorWithTextBlocks([
        '1 ',
        '2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first()
        .click()
        .type('{moveToStart}')
        .type('{rightArrow}') // set caret after "1"
        .type('{rightArrow}'); // ignore " " and move to the next block

      /**
       * Caret is set to the start of the next block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .last()
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(0);
            });
        });
    });

    it('|<b></b> — should ignore empty tags after caret and move caret to the next block', function () {
      createEditorWithTextBlocks([
        '1<b></b>',
        '2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first()
        .click()
        .type('{moveToStart}')
        .type('{rightArrow}') // set caret after "1"
        .type('{rightArrow}'); // ignore empty tag and move to the next block

      /**
       * Caret is set to the start of the next block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .last()
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(0);
            });
        });
    });
    it('|&nbsp;<b></b> — should move caret over the visible space and then to the next block', function () {
      createEditorWithTextBlocks([
        '1&nbsp;<b></b>',
        '2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first()
        .click()
        .type('{moveToStart}')
        .type('{rightArrow}') // set caret after "1"
        .type('{rightArrow}') // move caret over nbsp
        .type('{rightArrow}'); // move to the next block

      /**
       * Caret is set to the start of the next block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .last()
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(0);
            });
        });
    });

    it('|<b></b>&nbsp; — should ignore empty tag and move caret over the visible space. Then move to the next block', function () {
      createEditorWithTextBlocks([
        '1<b></b>&nbsp;',
        '2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first()
        .click()
        .type('{moveToStart}')
        .type('{rightArrow}') // set caret after "1"
        .type('{rightArrow}') // ignore empty tag and move caret over nbsp
        .type('{rightArrow}'); // move to the next block

      /**
       * Caret is set to the start of the next block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .last()
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(0);
            });
        });
    });

    it('"|&nbsp; " — should move caret over the visible space. Then ignore a trailing space and move to the next block', function () {
      createEditorWithTextBlocks([
        '1&nbsp; ',
        '2',
      ]);

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first()
        .click()
        .type('{moveToStart}')
        .type('{rightArrow}') // set caret after "1"
        .type('{rightArrow}') // move caret over nbsp
        .type('{rightArrow}'); // ignore " " and move to the next block

      /**
       * Caret is set to the start of the next block
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .last()
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
              expect(range.startOffset).to.eq(0);
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
   * we set caret to the end of the Text Block №1 and press Right Arrow
   *
   * Expected: Delimiter is selected
   *
   * Then we press Right Arrow again
   *
   * Expected: Caret is set to the start of the Text Block №2
   */
  it('should move caret to the next block if currently focused block is contentless (Delimiter)', function () {
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
      .first()
      .as('firstBlock')
      .click() // caret at the end
      .type('{rightArrow}'); // navigate to the Delimiter

    /**
     * We navigated to the Delimiter and it is highlighted
     */
    cy.get('[data-cy=editorjs]')
      .find('div[data-cy-type=contentless-tool]')
      .parents('.ce-block')
      .as('delimiterBlock')
      .should('have.class', 'ce-block--selected');

    /**
     * Now press Right again and we should be navigated to the start of the next block
     */
    cy.get('@firstBlock')
      .type('{rightArrow}');

    /**
     * Delimiter is not selected anymore
     */
    cy.get('@delimiterBlock')
      .should('not.have.class', 'ce-block--selected');

    /**
     * Caret is set to the start of the next block
     */
    cy.window()
      .then((window) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .last()
          .should(($block) => {
            expect($block[0].contains(range.startContainer)).to.be.true;
            expect(range.startOffset).to.eq(0);
          });
      });
  });
});
