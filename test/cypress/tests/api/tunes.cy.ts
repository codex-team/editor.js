import type { TunesMenuConfig } from '../../../../types/tools';
import type EditorJS from '../../../../types/index';
import Header from '@editorjs/header';

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
          title: 'Test tune',
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
            title: 'Tune entry 1',
            name: 'testTune1',

            onActivate: (): void => { },
          }, {
            icon: 'ICON2',
            title: 'Tune entry 2',
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

  it('should support label alias', () => {
    /** Test tune that should appear be rendered in block tunes menu */
    class TestTune {
      /** Set Tool is Tune */
      public static readonly isTune = true;

      /** Tune's appearance in block settings menu */
      public render(): TunesMenuConfig {
        return [
          {
            icon: 'ICON1',
            name: 'testTune1',
            onActivate: (): void => { },

            // Set text via title property
            title: 'Tune entry 1',
          }, {
            icon: 'ICON2',
            name: 'testTune2',
            onActivate: (): void => { },

            // Set text via label property
            label: 'Tune entry 2',
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


    /** Check both tunes have correct text */
    cy.get('[data-item-name=testTune1]').contains('Tune entry 1');
    cy.get('[data-item-name=testTune2]').contains('Tune entry 2');
  });

  it('should display installed tunes above default tunes', () => {
    /** Test tune that should appear be rendered in block tunes menu */
    class TestTune {
      /** Set Tool is Tune */
      public static readonly isTune = true;

      /** Tune's appearance in block settings menu */
      public render(): TunesMenuConfig {
        return [
          {
            icon: 'ICON',
            label: 'Tune entry',
            name: 'test-tune',

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

    /** Check test tune is inserted at index 0 */
    cy.get('[data-cy=editorjs]')
      .get('.ce-settings .ce-popover-item')
      .eq(0)
      .should('have.attr', 'data-item-name', 'test-tune' );

    /** Check default Move Up tune is inserted below the test tune */
    cy.get('[data-cy=editorjs]')
      .get('.ce-settings .ce-popover-item')
      .eq(1)
      .should('have.attr', 'data-item-name', 'move-up' );
  });

  it('should omit a tune from saved data when its save() returns undefined', () => {
    /** Tune whose save() returns undefined (tune in its default state) */
    class UndefinedTune {
      /** Set Tool is Tune */
      public static readonly isTune = true;

      /** Tune's appearance in block settings menu */
      public render(): TunesMenuConfig {
        return {
          icon: 'ICON',
          title: 'Undefined tune',
          name: 'undefinedTune',

          onActivate: (): void => { },
        };
      }

      /** Returns undefined when there is nothing to persist */
      public save(): undefined {
        return undefined;
      }
    }

    /** Control tune whose save() returns a real value */
    class ValueTune {
      /** Set Tool is Tune */
      public static readonly isTune = true;

      /** Tune's appearance in block settings menu */
      public render(): TunesMenuConfig {
        return {
          icon: 'ICON',
          title: 'Value tune',
          name: 'valueTune',

          onActivate: (): void => { },
        };
      }

      /** Returns real data that must be persisted */
      public save(): { enabled: boolean } {
        return { enabled: true };
      }
    }

    cy.createEditor({
      tools: {
        header: Header,
        undefinedTune: UndefinedTune,
        valueTune: ValueTune,
      },
      tunes: ['undefinedTune', 'valueTune'],
      data: {
        blocks: [
          {
            type: 'header',
            data: {
              text: 'some text',
              level: 1,
            },
          },
        ],
      },
    }).as('editorInstance');

    cy.get<EditorJS>('@editorInstance')
      .then(async (editor) => {
        const savedData = await editor.save();
        const tunes = savedData.blocks[0].tunes as { [name: string]: unknown };

        /** A tune returning undefined must be omitted from the saved data */
        expect(tunes).to.not.have.property('undefinedTune');
        /** A tune returning a value must still be persisted as before */
        expect(tunes).to.have.property('valueTune');
        expect(tunes.valueTune).to.deep.equal({ enabled: true });
      });
  });
});
