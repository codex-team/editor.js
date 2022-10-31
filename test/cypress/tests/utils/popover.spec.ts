import Popover from '../../../../src/components/utils/popover';
import { PopoverItem } from '../../../../types';

describe('Popover', () => {
  it('should ', () => {
    const actionIcon = 'Icon 1';
    const actionLabel = 'Action';
    const confirmActionIcon = 'Icon 2';
    const confirmActionLabel = 'Confirm action';

    const confirmation = {
      icon: confirmActionIcon,
      label: confirmActionLabel,
      onActivate: cy.stub(),
    };

    const items: PopoverItem[] = [
      {
        icon: actionIcon,
        label: actionLabel,
        name: 'testItem',
        confirmation,
      },
    ];

    const popover = new Popover({
      items,
      filterLabel: '',
      nothingFoundLabel: '',
      scopeElement: null,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-icon')
        .should('have.text', actionIcon);

      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-label')
        .should('have.text', actionLabel);

      // First click
      cy.get('[data-item-name=testItem]').click();

      // Check icon has changed
      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-icon')
        .should('have.text', confirmActionIcon);

      // Check label has changed
      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-label')
        .should('have.text', confirmActionLabel);

      // Second click
      cy.get('[data-item-name=testItem]')
        .click()
        .then(() => {
          // Check onActivate callback has been called
          expect(confirmation.onActivate).to.have.been.calledOnce;
        });
    });
  });
});
