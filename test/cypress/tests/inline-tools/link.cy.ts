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

  it('should preserve link when applying bold to linked text', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Text with link',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .selectText('Text with link');

    cy.get('[data-cy=editorjs]')
      .find('[data-item-name=link]')
      .click();

    cy.get('[data-cy=editorjs]')
      .find('.ce-inline-tool-input')
      .type('https://editorjs.io')
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('a')
      .should('have.attr', 'href', 'https://editorjs.io');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('a')
      .selectText('Text with link');

    cy.get('[data-cy=editorjs]')
      .find('[data-item-name=bold]')
      .click();

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('a')
      .should('have.attr', 'href', 'https://editorjs.io')
      .find('b')
      .should('exist')
      .should('contain', 'Text with link');
  });

  it('should preserve bold and italic when applying link', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Bold and italic text',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .selectText('Bold and italic text');
    
    cy.get('[data-cy=editorjs]')
      .find('[data-item-name=bold]')
      .click();

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('b')
      .should('exist')
      .should('contain', 'Bold and italic text');
    
    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('b')
      .selectText('Bold and italic text');

    cy.get('[data-cy=editorjs]')
      .find('[data-item-name=italic]')
      .click();

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('b')
      .should('exist')
      .find('i')
      .should('exist')
      .should('contain', 'Bold and italic text');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('b')
      .find('i')
      .selectText('Bold and italic text');

    cy.get('[data-cy=editorjs]')
      .find('[data-item-name=link]')
      .click();

    cy.get('[data-cy=editorjs]')
      .find('.ce-inline-tool-input')
      .type('https://editorjs.io')
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('b')
      .should('exist')
      .find('i')
      .should('exist')
      .find('a')
      .should('have.attr', 'href', 'https://editorjs.io')
      .should('contain', 'Bold and italic text');
  });

  it('should open a link if it is wrapped in another formatting', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Link text',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .selectText('Link text');

    cy.get('[data-cy=editorjs]')
      .find('[data-item-name=link]')
      .click();

    cy.get('[data-cy=editorjs]')
      .find('.ce-inline-tool-input')
      .type('https://test.io/')
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .find('a')
      .selectText('Link text');

    cy.get('[data-cy=editorjs]')
      .find('[data-item-name=italic]')
      .click();

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.contains('[data-cy=editorjs] div.ce-block i', 'Link text')
      .click({ ctrlKey: true });

    cy.get('@windowOpen').should('be.calledWith', 'https://test.io/');
  });
});
