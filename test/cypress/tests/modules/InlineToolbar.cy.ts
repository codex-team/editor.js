import Header from '@editorjs/header';

describe('Inline Toolbar', () => {
  it('should appear aligned with left coord of selection rect', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'First block text',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .selectText('block');

    cy.get('[data-cy="inline-toolbar"] .ce-popover__container')
      .should('be.visible')
      .then(($toolbar) => {
        const editorWindow = $toolbar.get(0).ownerDocument.defaultView;
        const selection = editorWindow.getSelection();

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        expect($toolbar.offset().left).to.be.closeTo(rect.left, 1);
      });
  });

  it('should appear aligned with right side of text column when toolbar\'s width is not fit at right', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .as('blockWrapper')
      .getLineWrapPositions()
      .then((lineWrapIndexes) => {
        const firstLineWrapIndex = lineWrapIndexes[0];

        /**
         * Select last 5 chars of the first line
         */
        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .selectTextByOffset([firstLineWrapIndex - 5, firstLineWrapIndex - 1]);
      });

    cy.get('[data-cy="inline-toolbar"] .ce-popover__container')
      .should('be.visible')
      .then(($toolbar) => {
        cy.get('@blockWrapper')
          .then(($blockWrapper) => {
            const blockWrapperRect = $blockWrapper.get(0).getBoundingClientRect();

            /**
             * Toolbar should be aligned with right side of text column
             */
            expect($toolbar.offset().left + $toolbar.width()).to.closeTo(blockWrapperRect.right, 10);
          });
      });
  });

  describe('Conversion toolbar', () => {
    it('should restore caret after converting of a block', () => {
      cy.createEditor({
        tools: {
          header: {
            class: Header,
          },
        },
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Some text',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('Some text');

      cy.get('[data-item-name=convert-to]')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar')
        .find('.ce-popover-item[data-item-name=header]')
        .click();

      cy.get('[data-cy=editorjs]')
        .find('.ce-header')
        .should('have.text', 'Some text');

      cy.window()
        .then((window) => {
          const selection = window.getSelection();

          expect(selection.rangeCount).to.be.equal(1);

          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-header')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
            });
        });
    });
  });
});
