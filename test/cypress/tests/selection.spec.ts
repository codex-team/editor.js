import * as _ from '../../../src/components/utils';

describe('Blocks selection', () => {
  beforeEach(function () {
    cy.createEditor({}).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  });

  it('should remove block selection on click', () => {
    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .click()
      .type('First block{enter}');

    cy.get('[data-cy=editorjs')
      .find('div.ce-block')
      .next()
      .type('Second block')
      .type('{movetostart}')
      .trigger('keydown', {
        shiftKey: true,
        keyCode: _.keyCodes.UP,
      });

    cy.get('[data-cy=editorjs')
      .click()
      .find('div.ce-block')
      .should('not.have.class', '.ce-block--selected');
  });
});
