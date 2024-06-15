import { PopoverDesktop as Popover, PopoverItemType } from '../../../../src/components/utils/popover';
import { PopoverItemParams } from '../../../../types';
import { MenuConfig } from '../../../../types/tools';
import Header from '@editorjs/header';

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
    const confirmation: PopoverItemParams = {
      icon: confirmActionIcon,
      title: confirmActionTitle,
      onActivate: cy.stub(),
    };

    const items: PopoverItemParams[] = [
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
    const items = [
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
    const items: PopoverItemParams[] = [
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
          if (items[0].type !== PopoverItemType.Default) {
            return;
          }

          // Check onActivate callback has never been called
          expect(items[0].onActivate).to.have.not.been.called;
        });
    });
  });

  it('should close once item with closeOnActivate property set to true is activated', () => {
    const items = [
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
    const items = [
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
    const items = [
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
    const items = [
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

  it('should display item with custom html', () => {
    /**
     * Block Tune with html as return type of render() method
     */
    class TestTune {
      public static isTune = true;

      /** Tune control displayed in block tunes popover */
      public render(): HTMLElement {
        const button = document.createElement('button');

        button.classList.add('ce-settings__button');
        button.innerText = 'Tune';

        return button;
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

    /** Check item with custom html content is displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover .ce-popover-item-html')
      .contains('Tune')
      .should('be.visible');
  });

  it('should support flipping between custom content items', () => {
    /**
     * Block Tune with html as return type of render() method
     */
    class TestTune1 {
      public static isTune = true;

      /** Tune control displayed in block tunes popover */
      public render(): HTMLElement {
        const button = document.createElement('button');

        button.classList.add('ce-settings__button');
        button.innerText = 'Tune1';

        return button;
      }
    }

    /**
     * Block Tune with html as return type of render() method
     */
    class TestTune2 {
      public static isTune = true;

      /** Tune control displayed in block tunes popover */
      public render(): HTMLElement {
        const button = document.createElement('button');

        button.classList.add('ce-settings__button');
        button.innerText = 'Tune2';

        return button;
      }
    }

    /** Create editor instance */
    cy.createEditor({
      tools: {
        testTool1: TestTune1,
        testTool2: TestTune2,
      },
      tunes: ['testTool1', 'testTool2'],
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

    /** Press Tab */
    // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
    cy.get('body').tab();

    /** Check the first custom html item is focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover .ce-popover-item-html .ce-settings__button')
      .contains('Tune1')
      .should('have.class', 'ce-popover-item--focused');

    /** Press Tab */
    // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
    cy.get('body').tab();

    /** Check the second custom html item is focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover .ce-popover-item-html .ce-settings__button')
      .contains('Tune2')
      .should('have.class', 'ce-popover-item--focused');

    /** Press Tab */
    // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
    cy.get('body').tab();

    /** Check that default popover item got focused */
    cy.get('[data-cy=editorjs]')
      .get('[data-item-name=move-up]')
      .should('have.class', 'ce-popover-item--focused');
  });

  it('should display nested popover (desktop)', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): MenuConfig {
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
                onActivate: (): void => {},
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

  it('should display children items, back button and item header and correctly switch between parent and child states (mobile)', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): MenuConfig {
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
                onActivate: (): void => {},
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


  it('should display default (non-separator) items without specifying type: default', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): MenuConfig {
        return  {
          onActivate: (): void => {},
          icon: 'Icon',
          title: 'Tune',
          toggle: 'key',
          name: 'test-item',
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

    /** Check item displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item"]')
      .should('be.visible');
  });

  it('should display separator', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): MenuConfig {
        return  [
          {
            onActivate: (): void => {},
            icon: 'Icon',
            title: 'Tune',
            toggle: 'key',
            name: 'test-item',
          },
          {
            type: PopoverItemType.Separator,
          },
        ];
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

    /** Check item displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item"]')
      .should('be.visible');

    /** Check separator displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('.ce-popover-item-separator')
      .should('be.visible');
  });

  it('should perform keyboard navigation between items ignoring separators', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): MenuConfig {
        return  [
          {
            onActivate: (): void => {},
            icon: 'Icon',
            title: 'Tune 1',
            name: 'test-item-1',
          },
          {
            type: PopoverItemType.Separator,
          },
          {
            onActivate: (): void => {},
            icon: 'Icon',
            title: 'Tune 2',
            name: 'test-item-2',
          },
        ];
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

    /** Press Tab */
    // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
    cy.get('body').tab();

    /** Check first item is focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-1"].ce-popover-item--focused')
      .should('exist');

    /** Check second item is not focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-2"].ce-popover-item--focused')
      .should('not.exist');

    /** Press Tab */
    // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
    cy.get('body').tab();

    /** Check first item is not focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-1"].ce-popover-item--focused')
      .should('not.exist');

    /** Check second item is focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-2"].ce-popover-item--focused')
      .should('exist');
  });

  it('should perform keyboard navigation between items ignoring separators when search query is applied', () => {
    /** Tool class to test how it is displayed inside block tunes popover */
    class TestTune {
      public static isTune = true;

      /** Tool data displayed in block tunes popover */
      public render(): MenuConfig {
        return  [
          {
            onActivate: (): void => {},
            icon: 'Icon',
            title: 'Tune 1',
            name: 'test-item-1',
          },
          {
            type: PopoverItemType.Separator,
          },
          {
            onActivate: (): void => {},
            icon: 'Icon',
            title: 'Tune 2',
            name: 'test-item-2',
          },
        ];
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

    /** Check separator displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('.ce-popover-item-separator')
      .should('be.visible');

    /** Enter search query */
    cy.get('[data-cy=editorjs]')
      .get('[data-cy=block-tunes] .cdx-search-field__input')
      .type('Tune');

    /** Check separator not displayed */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('.ce-popover-item-separator')
      .should('not.be.visible');

    /** Press Tab */
    // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
    cy.get('body').tab();

    /** Check first item is focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-1"].ce-popover-item--focused')
      .should('exist');

    /** Check second item is not focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-2"].ce-popover-item--focused')
      .should('not.exist');

    /** Press Tab */
    // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
    cy.get('body').tab();

    /** Check first item is not focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-1"].ce-popover-item--focused')
      .should('not.exist');

    /** Check second item is focused */
    cy.get('[data-cy=editorjs]')
      .get('.ce-popover__container')
      .get('[data-item-name="test-item-2"].ce-popover-item--focused')
      .should('exist');
  });

  describe('Inline Popover', () => {
    it('should open nested popover on click instead of hover', () => {
      cy.createEditor({
        tools: {
          header: {
            class: Header,
          },
        },
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

      /** Open Inline Toolbar */
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('block');

      /** Hover Convert To item which has nested popover */
      cy.get('[data-cy=editorjs]')
        .get('[data-item-name=convert-to]')
        .trigger('mouseover');

      /** Check nested popover didn't open */
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover--nested .ce-popover__container')
        .should('not.exist');

      /** Click Convert To item which has nested popover */
      cy.get('[data-cy=editorjs]')
        .get('[data-item-name=convert-to]')
        .click();

      /** Check nested popover opened */
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover--nested .ce-popover__container')
        .should('exist');
    });

    it('should support keyboard nevigation between items', () => {
      cy.createEditor({
        tools: {
          header: {
            class: Header,
          },
        },
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

      /** Open Inline Toolbar */
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('block');

      /** Check Inline Popover opened */
      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar .ce-popover__container')
        .should('be.visible');

      /** Check first item is NOT focused */
      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar .ce-popover__container')
        .get('[data-item-name="convert-to"].ce-popover-item--focused')
        .should('not.exist');

      /** Press Tab */
      cy.tab();

      /** Check first item became focused after tab */
      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar .ce-popover__container')
        .get('[data-item-name="convert-to"].ce-popover-item--focused')
        .should('exist');

      /** Check second item is NOT focused */
      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar .ce-popover__container')
        .get('[data-item-name="link"] .ce-popover-item--focused')
        .should('not.exist');

      /** Press Tab */
      cy.tab();

      /** Check second item became focused after tab */
      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar .ce-popover__container')
        .get('[data-item-name="link"] .ce-popover-item--focused')
        .should('exist');
    });

    it.only('should allow to reach nested popover via keyboard', () => {
      cy.createEditor({
        tools: {
          header: {
            class: Header,
          },
        },
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

      /** Open Inline Toolbar */
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('block');

      /** Check Inline Popover opened */
      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar .ce-popover__container')
        .should('be.visible');

      /** Press Tab */
      cy.tab();

      /** Press Tab */
      cy.get('[data-item-name="convert-to"]')
        .type('{enter}');

      /** Check Inline Popover opened */
      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar .ce-popover--nested .ce-popover__container')
        .should('be.visible');

      /** Check first item is NOT focused */
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover__container')
        .get('[data-item-name="header"].ce-popover-item--focused')
        .should('not.exist');

      /** Press Tab */
      // eslint-disable-next-line cypress/require-data-selectors -- cy.tab() not working here
      cy.get('body').tab();

      /** Check first item is focused */
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover__container')
        .get('[data-item-name="header"].ce-popover-item--focused')
        .should('exist');
    });
  });
});
