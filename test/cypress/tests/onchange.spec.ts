import Header from '../../../example/tools/header';

/**
 * @todo Add checks that correct block API object is passed to onChange
 * @todo Add cases for native inputs changes
 */
describe('onChange callback', () => {
  const config = {
    tools: {
      header: Header,
    },
    onChange: (): void => {
      console.log('something changed');
    },
  };

  beforeEach(() => {
    if (this && this.editorInstance) {
      this.editorInstance.destroy();
    } else {
      cy.spy(config, 'onChange').as('onChange');

      cy.createEditor(config).as('editorInstance');
    }
  });

  it('should fire onChange callback on block insertion', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('{enter}');

    cy.get('@onChange').should('be.called');
  });

  it('should fire onChange callback on typing into block', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('some text');

    cy.get('@onChange').should('be.called');
  });

  it('should fire onChange callback on block replacement', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('li.ce-toolbox__button[data-tool=header]')
      .click();

    cy.get('@onChange').should('be.calledWithMatch', Cypress.sinon.match.any, Cypress.sinon.match({ name: 'header' }));
  });

  it('should fire onChange callback on tune modifier', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('li.ce-toolbox__button[data-tool=header]')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('span.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('span.cdx-settings-button[data-level=1]')
      .click();

    cy.get('@onChange').should('be.calledWithMatch', Cypress.sinon.match.any, Cypress.sinon.match({ name: 'header' }));
  });

  it('should fire onChange callback when block is removed', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('span.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-settings__button--delete')
      .click()
      .click();

    cy.get('@onChange').should('be.called');
  });

  it('should fire onChange callback when block is moved', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .last()
      .click();

    cy.get('[data-cy=editorjs]')
      .get('span.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-tune-move-up')
      .click();

    cy.get('@onChange').should('be.called');
  });
});
