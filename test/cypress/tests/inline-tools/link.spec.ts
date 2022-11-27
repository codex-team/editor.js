describe('Inline Tool Link', () => {
  it('should create a link by Enter keydown in input', () => {
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
      .find('div.ce-block')
      .click()
      .type('{selectall}')
      .type('{ctrl}K');

    cy.get('[data-cy=editorjs]')
      .find('.ce-inline-tool-input')
      .click()
      .type('https://codex.so')
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('a')
      .should('have.attr', 'href', 'https://codex.so');
  });
});
