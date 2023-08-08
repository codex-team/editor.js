import Header from '@editorjs/header';
import { ToolboxConfig } from '../../../types';

describe('Editor i18n', () => {
  context('Toolbox', () => {
    it('should translate tool title in a toolbox', function () {
      if (this && this.editorInstance) {
        this.editorInstance.destroy();
      }
      const toolNamesDictionary = {
        Heading: 'Заголовок',
      };

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

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover-item[data-item-name=header]')
        .should('contain.text', toolNamesDictionary.Heading);
    });

    it('should translate titles of toolbox entries', function () {
      if (this && this.editorInstance) {
        this.editorInstance.destroy();
      }
      const toolNamesDictionary = {
        Title1: 'Название 1',
        Title2: 'Название 2',
      };

      /**
       * Tool with several toolbox entries configured
       */
      class TestTool {
        /**
         * Returns toolbox config as list of entries
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              title: 'Title1',
              icon: 'Icon 1',
            },
            {
              title: 'Title2',
              icon: 'Icon 2',
            },
          ];
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
        i18n: {
          messages: {
            toolNames: toolNamesDictionary,
          },
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover-item[data-item-name=testTool]')
        .first()
        .should('contain.text', toolNamesDictionary.Title1);

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover-item[data-item-name=testTool]')
        .last()
        .should('contain.text', toolNamesDictionary.Title2);
    });

    it('should use capitalized tool name as translation key if toolbox title is missing', function () {
      if (this && this.editorInstance) {
        this.editorInstance.destroy();
      }

      /**
       * Tool class allowing to test case when capitalized tool name is used as translation key if toolbox title is missing
       */
      class TestTool {
        /**
         * Returns toolbox config without title
         */
        public static get toolbox(): ToolboxConfig {
          return {
            title: '',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
          };
        }
      }
      const toolNamesDictionary = {
        TestTool: 'ТестТул',
      };

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
        i18n: {
          messages: {
            toolNames: toolNamesDictionary,
          },
        },
      });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover-item[data-item-name=testTool]')
        .should('contain.text', toolNamesDictionary.TestTool);
    });
  });
});
