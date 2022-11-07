import { TunesMenuConfig } from '../../../../types/tools';

/* eslint-disable @typescript-eslint/no-empty-function */

describe('Editor Tunes Api', () => {
  it('should render a popover entry for block tune if configured', () => {
    /** Test tune that should appear be rendered in block tunes menu */
    class TestTune {
      /** Set Tool is Tune */
      public static readonly isTune = true;

      /** Tune's appearance in block settings menu */
      public render(): TunesMenuConfig {
        return {
          icon: 'ICON',
          label: 'Test tune',
          name: 'testTune',

          onActivate: (): void => { },
        };
      }

      /** Save method stub */
      public save(): void {}
    }

    cy.createEditor({
      tools: {
        testTune: TestTune,
      },
      tunes: [ 'testTune' ],
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .type('some text')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-item-name=testTune]').should('exist');
  });

  it('should render several popover entries for block tune if configured', () => {
    /** Test tune that should appear be rendered in block tunes menu */
    class TestTune {
      /** Set Tool is Tune */
      public static readonly isTune = true;

      /** Tune's appearance in block settings menu */
      public render(): TunesMenuConfig {
        return [
          {
            icon: 'ICON1',
            label: 'Tune entry 1',
            name: 'testTune1',

            onActivate: (): void => { },
          }, {
            icon: 'ICON2',
            label: 'Tune entry 2',
            name: 'testTune2',

            onActivate: (): void => { },
          },
        ];
      }

      /** Save method stub */
      public save(): void {}
    }

    cy.createEditor({
      tools: {
        testTune: TestTune,
      },
      tunes: [ 'testTune' ],
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .type('some text')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-item-name=testTune1]').should('exist');
    cy.get('[data-item-name=testTune2]').should('exist');
  });

  it('should display custom html returned by tune\'s render() method inside tunes menu', () => {
    const sampleText = 'sample text';

    /** Test tune that should appear be rendered in block tunes menu  */
    class TestTune {
      /** Set Tool is Tune */
      public static readonly isTune = true;

      /** Tune's appearance in block settings menu */
      public render(): HTMLElement {
        const element = document.createElement('div');

        element.textContent = sampleText;

        return element;
      }

      /** Save method stub */
      public save(): void {}
    }

    cy.createEditor({
      tools: {
        testTune: TestTune,
      },
      tunes: [ 'testTune' ],
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .type('some text')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-popover')
      .should('contain.text', sampleText);
  });
});
