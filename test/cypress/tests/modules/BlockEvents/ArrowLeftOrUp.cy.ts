import { createEditorWithTextBlocks } from "../../../support/utils/createEditorWithTextBlocks";

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

  it('should move caret to the prev block if currently focused block is contentless (Delimiter)', function () {

  });
})
