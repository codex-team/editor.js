import Header from '@editorjs/header';

describe('Editor i18n', () => {
  /**
   * Stores translations for tool names
   */
  const toolNamesDictionary = {
    Heading: 'Заголовок',
  };

  beforeEach(() => {
    if (this && this.editorInstance) {
      this.editorInstance.destroy();
    } else {
      cy.createEditor({
        tools: {
          header: Header,
        },
        i18n: {
          messages: {
            toolNames: toolNamesDictionary,
          },
        },
      }).as('editorInstance');
    }
  });

  it('should translate tool title in a toolbox', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover__item[data-item-name=header]')
      .should('contain.text', toolNamesDictionary.Heading);
  });
});