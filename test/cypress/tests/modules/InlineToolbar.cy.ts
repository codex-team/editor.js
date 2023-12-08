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

    cy.get('[data-cy="inline-toolbar"]')
      .should('be.visible')
      .then(($toolbar) => {
        const editorWindow = $toolbar.get(0).ownerDocument.defaultView;
        const selection = editorWindow.getSelection();

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        expect($toolbar.offset().left).to.closeTo(rect.left, 0.5);
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

    cy.get('[data-cy="inline-toolbar"]')
      .should('be.visible')
      .then(($toolbar) => {
        cy.get('@blockWrapper')
          .then(($blockWrapper) => {
            const blockWrapperRect = $blockWrapper.get(0).getBoundingClientRect();

            /**
             * Toolbar should be aligned with right side of text column
             */
            expect($toolbar.offset().left + $toolbar.width()).to.closeTo(blockWrapperRect.right, 3);
          });
      });
  });
});
