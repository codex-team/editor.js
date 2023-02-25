import * as _ from '../../../src/components/utils';
import { ToolboxConfig } from '../../../types';

describe('Blocks selection', () => {
  it('should remove block selection on click', () => {
    cy.createEditor({}).as('editorInstance');

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

  it('should select text in a paragraph block', () => {
    cy.createEditor({}).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .click()
      .type('First block')
      .type('{selectall}')
      .then((block) => {
        const selection = block[0].ownerDocument.getSelection().toString();
        expect(selection).to.equal('First block');
      });
  });

  it('should select text in a text input block', () => {
    /**
     * Tool with default data to be overridden
     */
    class InputTestTool {
      private _data = {
        value: 'default value',
      };

      /**
       * Tool constructor
       *
       * @param data - previously saved data
       */
      constructor({ data }) {
        this._data = data;
      }

      /**
       * Returns toolbox config as list of entries with overridden data
       */
      public static get toolbox(): ToolboxConfig {
        return [
          {
            title: 'Email input',
          },
        ];
      }

      /**
       * Return Tool's view
       */
      public render(): HTMLElement {
        const input = document.createElement('input');
        input.value = this._data.value ?? '';

        return input;
      }
    }

    cy.createEditor({
      tools: {
        input: InputTestTool,
      },
    });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover-item[data-item-name=input]')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block input')
      .click()
      .type('Input block')
      .type('{selectall}')
      .then((block) => {
        const selection = block[0].ownerDocument.getSelection().toString();
        expect(selection).to.equal('Input block');
      });
  });

  it('should not select text in an email input block', () => {

    /**
     * Tool with default data to be overridden
     */
    class EmailInputTestTool {
      private _data = {
        value: 'default value',
      };

      /**
       * Tool constructor
       *
       * @param data - previously saved data
       */
      constructor({ data }) {
        this._data = data;
      }

      /**
       * Returns toolbox config as list of entries with overridden data
       */
      public static get toolbox(): ToolboxConfig {
        return [
          {
            title: 'Email input',
          },
        ];
      }

      /**
       * Return Tool's view
       */
      public render(): HTMLElement {
        const input = document.createElement('input');
        input.type = 'email';
        input.value = this._data.value ?? '';

        return input;
      }
    }

    cy.createEditor({
      tools: {
        email: EmailInputTestTool,
      },
    });

    cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover-item[data-item-name=email]')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block input')
      .click()
      .type('Email block')
      .type('{selectall}')
      .then((block) => {
        const selection = block[0].ownerDocument.getSelection().toString();
        expect(selection).to.equal('');
      });
  });
});
