import type EditorJS from '../../../../types/index';
import type { ConversionConfig, ToolboxConfig } from '../../../../types/index';
import ToolMock from '../../fixtures/tools/ToolMock';

describe('Toolbox', function () {
  describe('Shortcuts', function () {
    it('should convert current Block to the Shortcuts\'s Block if both tools provides a "conversionConfig". Caret should be restored after conversion.', function () {
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

          /**
           * Check that caret belongs to the new block after conversion
           */
          cy.window()
            .then((window) => {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);

              cy.get('[data-cy=editorjs]')
                .find(`.ce-block[data-id=${blocks[0].id}]`)
                .should(($block) => {
                  expect($block[0].contains(range.startContainer)).to.be.true;
                });
            });
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

    it('should display shortcut only for the first toolbox item if tool exports toolbox with several items', function () {
      /**
       * Mock of Tool with conversionConfig
       */
      class ToolWithSeveralToolboxItems extends ToolMock {
        /**
         * Specify toolbox with several items related to one tool
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              icon: '',
              title: 'first tool',
            },
            {
              icon: '',
              title: 'second tool',
            },
          ]
        }
      }

      cy.createEditor({
        tools: {
          severalToolboxItemsTool: {
            class: ToolWithSeveralToolboxItems,
            shortcut: 'CMD+SHIFT+L',
          }
        }
      })

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('Some text')
        .type('/'); // call a shortcut for toolbox


      /**
       * Secondary title (shortcut) should exist for first toolbox item of the tool
       */
      cy.get('.ce-popover')
        .find('.ce-popover-item[data-item-name="severalToolboxItemsTool"]')
        .first()
        .find('.ce-popover-item__secondary-title')
        .should('exist');

      /**
       * Secondary title (shortcut) should not exist for second toolbox item of the same tool
       */
      cy.get('.ce-popover')
        .find('.ce-popover-item[data-item-name="severalToolboxItemsTool"]')
        .eq(1)
        .find('.ce-popover-item__secondary-title')
        .should('not.exist');
    })
  });
});
