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
      .wait(200)
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

  it('should remove fake background on selection change', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'First block text',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'Second block text',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .first()
      .click()
      .type('{selectall}')
      .wait(200)
      .type('{ctrl}K');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .last()
      .click()
      .type('{selectall}')
      .wait(200);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph span[style]')
      .should('not.exist');
  });
});
