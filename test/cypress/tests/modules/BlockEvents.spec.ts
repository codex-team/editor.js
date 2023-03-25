describe('Keydown', function () {
  describe('enter', function () {
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
  });
});
