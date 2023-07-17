import type EditorJS from '../../../../types/index';
import { ConversionConfig, ToolboxConfig } from '../../../../types/index';
import ToolMock from '../../fixtures/tools/ToolMock';

describe('Toolbox', function () {
  describe('Shortcuts', function () {
    it('should covert current Block to the Shortcuts\'s Block if both tools provides a "conversionConfig" ', function () {
      /**
       * Mock of Tool with conversionConfig
       */
      class ConvertableTool extends ToolMock {
        /**
         * Specify how to import string data to this Tool
         */
        public static get conversionConfig(): ConversionConfig {
          return {
            import: 'text',
          };
        }

        /**
         * Specify how to display Tool in a Toolbox
         */
        public static get toolbox(): ToolboxConfig {
          return {
            icon: '',
            title: 'Convertable tool',
          };
        }
      }

      cy.createEditor({
        tools: {
          convertableTool: {
            class: ConvertableTool,
            shortcut: 'CMD+SHIFT+H',
          },
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('Some text')
        .type('{cmd}{shift}H'); // call a shortcut

      /**
       * Check that block was converted
       */
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const { blocks } = await editor.save();

          expect(blocks.length).to.eq(1);
          expect(blocks[0].type).to.eq('convertableTool');
          expect(blocks[0].data.text).to.eq('Some text');
        });
    });

    it('should insert a Shortcuts\'s Block below the current if some (original or target) tool does not provide a "conversionConfig" ', function () {
      /**
       * Mock of Tool with conversionConfig
       */
      class ToolWithoutConversionConfig extends ToolMock {
        /**
         * Specify how to display Tool in a Toolbox
         */
        public static get toolbox(): ToolboxConfig {
          return {
            icon: '',
            title: 'Convertable tool',
          };
        }
      }

      cy.createEditor({
        tools: {
          nonConvertableTool: {
            class: ToolWithoutConversionConfig,
            shortcut: 'CMD+SHIFT+H',
          },
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('Some text')
        .type('{cmd}{shift}H'); // call a shortcut

      /**
       * Check that the new block was appended
       */
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const { blocks } = await editor.save();

          expect(blocks.length).to.eq(2);
          expect(blocks[1].type).to.eq('nonConvertableTool');
        });
    });
  });
});
