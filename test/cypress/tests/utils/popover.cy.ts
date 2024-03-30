import { PopoverDesktop as Popover } from '../../../../src/components/utils/popover';
import { PopoverItem } from '../../../../types';
import { TunesMenuConfig } from '../../../../types/tools';

/* eslint-disable @typescript-eslint/no-empty-function */

describe('Popover', () => {
  it('should support confirmation chains', () => {
    const actionIcon = 'Icon 1';
    const actionTitle = 'Action';
    const confirmActionIcon = 'Icon 2';
    const confirmActionTitle = 'Confirm action';

    /**
     * Confirmation is moved to separate variable to be able to test it's callback execution.
     * (Inside popover null value is set to confirmation property, so, object becomes unavailable otherwise)
     */
    const confirmation = {
      icon: confirmActionIcon,
      title: confirmActionTitle,
      onActivate: cy.stub(),
    };

    const items: PopoverItem[] = [
      {
        icon: actionIcon,
        title: actionTitle,
        name: 'testItem',
        confirmation,
      },
    ];

    const popover = new Popover({
      items,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      cy.get('[data-item-name=testItem]')
        .get('.ce-popover-item__icon')
        .should('have.text', actionIcon);

      cy.get('[data-item-name=testItem]')
        .get('.ce-popover-item__title')
        .should('have.text', actionTitle);

      // First click on item
      cy.get('[data-item-name=testItem]').click();

      // Check icon has changed
      cy.get('[data-item-name=testItem]')
        .get('.ce-popover-item__icon')
        .should('have.text', confirmActionIcon);

      // Check label has changed
      cy.get('[data-item-name=testItem]')
        .get('.ce-popover-item__title')
        .should('have.text', confirmActionTitle);

      // Second click
      cy.get('[data-item-name=testItem]')
        .click()
        .then(() => {
          // Check onActivate callback has been called
          expect(confirmation.onActivate).to.have.been.calledOnce;
        });
    });
  });

  it('should render the items with true isActive property value as active', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        title: 'Title',
        isActive: true,
        name: 'testItem',
        onActivate: (): void => {},
      },
    ];

    const popover = new Popover({
      items,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check item has active class */
      cy.get('[data-item-name=testItem]')
        .should('have.class', 'ce-popover-item--active');
    });
  });

  it('should not execute item\'s onActivate callback if the item is disabled', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        title: 'Title',
        isDisabled: true,
        name: 'testItem',
        onActivate: cy.stub(),
      },
    ];

    const popover = new Popover({
      items,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check item has disabled class */
      cy.get('[data-item-name=testItem]')
        .should('have.class', 'ce-popover-item--disabled')
        .click()
        .then(() => {
          // Check onActivate callback has never been called
          expect(items[0].onActivate).to.have.not.been.called;
        });
    });
  });

  it('should close once item with closeOnActivate property set to true is activated', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        title: 'Title',
        closeOnActivate: true,
        name: 'testItem',
        onActivate: (): void => {},
      },
    ];
    const popover = new Popover({
      items,
    });

    cy.spy(popover, 'hide');

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      cy.get('[data-item-name=testItem]')
        .click()
        .then(() => {
          expect(popover.hide).to.have.been.called;
        });
    });
  });

  it('should highlight as active the item with toggle property set to true once activated', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        title: 'Title',
        toggle: true,
        name: 'testItem',
        onActivate: (): void => {},
      },
    ];
    const popover = new Popover({
      items,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check item has active class */
      cy.get('[data-item-name=testItem]')
        .click()
        .should('have.class', 'ce-popover-item--active');
    });
  });

  it('should perform radiobutton-like behavior among the items that have toggle property value set to the same string value', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon 1',
        title: 'Title 1',
        toggle: 'group-name',
        name: 'testItem1',
        isActive: true,
        onActivate: (): void => {},
      },
      {
        icon: 'Icon 2',
        title: 'Title 2',
        toggle: 'group-name',
        name: 'testItem2',
        onActivate: (): void => {},
      },
    ];

    const popover = new Popover({
      items,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /** Check first item is active */
      cy.get('[data-item-name=testItem1]')
        .should('have.class', 'ce-popover-item--active');

      /** Check second item is not active */
      cy.get('[data-item-name=testItem2]')
        .should('not.have.class', 'ce-popover-item--active');

      /* Click second item and check it became active */
      cy.get('[data-item-name=testItem2]')
        .click()
        .should('have.class', 'ce-popover-item--active');

      /** Check first item became not active */
      cy.get('[data-item-name=testItem1]')
        .should('not.have.class', 'ce-popover-item--active');
    });
  });

  it('should toggle item if it is the only item in toggle group', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        title: 'Title',
        toggle: 'key',
        name: 'testItem',
        onActivate: (): void => {},
      },
    ];
    const popover = new Popover({
      items,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check item has active class */
      cy.get('[data-item-name=testItem]')
        .click()
        .should('have.class', 'ce-popover-item--active');
    });
  });

  it('should render custom html content', () => {
    const customHtml = document.createElement('div');

    customHtml.setAttribute('data-cy-name', 'customContent');
    customHtml.innerText = 'custom html content';
    const popover = new Popover({
      customContent: customHtml,
      items: [],
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check custom content exists in the popover */
      cy.get('[data-cy-name=customContent]');
    });
  });

  it('should display nested popover (desktop)', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): TunesMenuConfig {
        return  {
          icon: 'Icon',
          title: 'Title',
          toggle: 'key',
          name: 'test-item',
          children: {
            items: [
              {
                icon: 'Icon',
                title: 'Title',
                name: 'nested-test-item',
              },
            ],
          },
        };
      }
    }

    /** Create editor instance */
    cy.createEditor({
      tools: {
        testTool: TestTune,
      },
      tunes: [ 'testTool' ],
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Hello',
            },
          },
        ],
      },
    });

    /** Open block tunes menu */
    cy.get('[data-cy=editorjs]')
      .get('.cdx-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-toolbar__settings-btn')
      .click();

    /** Check item with children has arrow icon */
    cy.get('[data-cy=editorjs]')
      .get('[data-item-name="test-item"]')
      .get('.ce-popover-item__icon--chevron-right')
      .should('be.visible');

    /** Click the item */
    cy.get('[data-cy=editorjs]')
      .get('[data-item-name="test-item"]')
      .click();

    /** Check nested popover opened */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover--nested .ce-popover__container')
      .should('be.visible');

    /** Check child item displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover--nested .ce-popover__container')
      .get('[data-item-name="nested-test-item"]')
      .should('be.visible');
  });


  it('should dysplay nested popover (mobile)', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): TunesMenuConfig {
        return  {
          icon: 'Icon',
          title: 'Tune',
          toggle: 'key',
          name: 'test-item',
          children: {
            items: [
              {
                icon: 'Icon',
                title: 'Title',
                name: 'nested-test-item',
              },
            ],
          },
        };
      }
    }

    cy.viewport('iphone-6+');


    /** Create editor instance */
    cy.createEditor({
      tools: {
        testTool: TestTune,
      },
      tunes: [ 'testTool' ],
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Hello',
            },
          },
        ],
      },
    });

    /** Open block tunes menu */
    cy.get('[data-cy=editorjs]')
      .get('.cdx-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-toolbar__settings-btn')
      .click();

    /** Check item with children has arrow icon */
    cy.get('[data-cy=editorjs]')
      .get('[data-item-name="test-item"]')
      .get('.ce-popover-item__icon--chevron-right')
      .should('be.visible');

    /** Click the item */
    cy.get('[data-cy=editorjs]')
      .get('[data-item-name="test-item"]')
      .click();

    /** Check child item displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="nested-test-item"]')
      .should('be.visible');

    /** Check header displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover-header')
      .should('have.text', 'Tune');

    /** Check back button displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('.ce-popover-header__back-button')
      .should('be.visible');

    /** Click back button */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('.ce-popover-header__back-button')
      .click();

    /** Check child item is not displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="nested-test-item"]')
      .should('not.exist');

    /** Check back button is not displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('.ce-popover-header__back-button')
      .should('not.exist');

    /** Check header is not displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover-header')
      .should('not.exist');
  });
});
