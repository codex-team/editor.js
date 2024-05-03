describe('Enter keydown', function () {
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
