import type EditorJS from '../../../../types/index';
import type { ConversionConfig, ToolboxConfig } from '../../../../types';
import ToolMock from '../../fixtures/tools/ToolMock';

/**
 * There will be described test cases of 'blocks.*' API
 */
describe('api.blocks', () => {
  const firstBlock = {
    id: 'bwnFX5LoX7',
    type: 'paragraph',
    data: {
      text: 'The first block content mock.',
    },
  };
  const editorDataMock = {
    blocks: [
      firstBlock,
    ],
  };

  /**
   * api.blocks.getById(id)
   */
  describe('.getById()', () => {
    /**
     * Check that api.blocks.getByUd(id) returns the Block for existed id
     */
    it('should return Block API for existed id', () => {
      cy.createEditor({
        data: editorDataMock,
      }).as('editorInstance');

      cy.get<EditorJS>('@editorInstance').then(async (editor) => {
        const block = editor.blocks.getById(firstBlock.id);

        expect(block).not.to.be.undefined;
        expect(block.id).to.be.eq(firstBlock.id);
      });
    });

    /**
     * Check that api.blocks.getByUd(id) returns null for the not-existed id
     */
    it('should return null for not-existed id', () => {
      cy.createEditor({
        data: editorDataMock,
      }).as('editorInstance');

      cy.get<EditorJS>('@editorInstance').then(async (editor) => {
        expect(editor.blocks.getById('not-existed-id')).to.be.null;
      });
    });
  });

  /**
   * api.blocks.update(id, newData)
   */
  describe('.update()', () => {
    /**
     * Check if block is updated in DOM
     */
    it('should update block in DOM', () => {
      cy.createEditor({
        data: editorDataMock,
      }).then((editor) => {
        const idToUpdate = firstBlock.id;
        const newBlockData = {
          text: 'Updated text',
        };

        editor.blocks.update(idToUpdate, newBlockData);

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .should('have.text', newBlockData.text);
      });
    });

    /**
     * Check if block's data is updated after saving
     */
    it('should update block in saved data', () => {
      cy.createEditor({
        data: editorDataMock,
      }).then((editor) => {
        const idToUpdate = firstBlock.id;
        const newBlockData = {
          text: 'Updated text',
        };

        editor.blocks.update(idToUpdate, newBlockData);

        // wait a little since some tools (paragraph) could have async hydration
        cy.wait(100).then(() => {
          editor.save().then((output) => {
            const text = output.blocks[0].data.text;

            expect(text).to.be.eq(newBlockData.text);
          });
        });
      });
    });

    /**
     * When incorrect id passed, editor should not update any block
     */
    it('shouldn\'t update any block if not-existed id passed', () => {
      cy.createEditor({
        data: editorDataMock,
      }).then((editor) => {
        const idToUpdate = 'wrong-id-123';
        const newBlockData = {
          text: 'Updated text',
        };

        editor.blocks.update(idToUpdate, newBlockData)
          .catch(error => {
            expect(error.message).to.be.eq(`Block with id "${idToUpdate}" not found`);
          })
          .finally(() => {
            cy.get('[data-cy=editorjs]')
              .get('div.ce-block')
              .invoke('text')
              .then(blockText => {
                expect(blockText).to.be.eq(firstBlock.data.text);
              });
          });
      });
    });
  });

  /**
   * api.blocks.insert(type, data, config, index, needToFocus, replace, id)
   */
  describe('.insert()', function () {
    it('should preserve block id if it is passed', function () {
      cy.createEditor({
        data: editorDataMock,
      }).then((editor) => {
        const type = 'paragraph';
        const data = { text: 'codex' };
        const config = undefined;
        const index = undefined;
        const needToFocus = undefined;
        const replace = undefined;
        const id = 'test-id-123';

        const block = editor.blocks.insert(type, data, config, index, needToFocus, replace, id);

        expect(block).not.to.be.undefined;
        expect(block.id).to.be.eq(id);
      });
    });
  });

  /**
   * api.blocks.insertMany(blocks, index)
   */
  describe('.insertMany()', function () {
    it('should insert several blocks to passed index', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: { text: 'first block' },
            },
          ],
        },
      }).then((editor) => {
        const index = 0;

        cy.wrap(editor.blocks.insertMany([
          {
            type: 'paragraph',
            data: { text: 'inserting block #1' },
          },
          {
            type: 'paragraph',
            data: { text: 'inserting block #2' },
          },
        ], index)); // paste to the 0 index

        cy.get('[data-cy=editorjs]')
          .find('.ce-block')
          .each(($el, i) => {
            switch (i) {
              case 0:
                cy.wrap($el).should('have.text', 'inserting block #1');
                break;
              case 1:
                cy.wrap($el).should('have.text', 'inserting block #2');
                break;
              case 2:
                cy.wrap($el).should('have.text', 'first block');
                break;
            }
          });
      });
    });
  });

  describe('.convert()', function () {
    it('should convert a Block to another type if original Tool has "conversionConfig.export" and target Tool has "conversionConfig.import". Should return BlockAPI as well.', function () {
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

      const existingBlock = {
        id: 'test-id-123',
        type: 'paragraph',
        data: {
          text: 'Some text',
        },
      };

      cy.createEditor({
        tools: {
          convertableTool: {
            class: ConvertableTool,
          },
        },
        data: {
          blocks: [
            existingBlock,
          ],
        },
      }).then(async (editor) => {
        const { convert } = editor.blocks;

        const returnValue = await convert(existingBlock.id, 'convertableTool');

        // wait for block to be converted
        cy.wait(100).then(async () => {
          /**
           * Check that block was converted
           */
          const { blocks } = await editor.save();

          expect(blocks.length).to.eq(1);
          expect(blocks[0].type).to.eq('convertableTool');
          expect(blocks[0].data.text).to.eq(existingBlock.data.text);

          /**
           * Check that returned value is BlockAPI
           */
          expect(returnValue).to.containSubset({
            name: 'convertableTool',
            id: blocks[0].id,
          });
        });
      });
    });

    it('should throw an error if nonexisting Block id passed', function () {
      cy.createEditor({})
        .then((editor) => {
          /**
           * Call the 'convert' api method with nonexisting Block id
           */
          const fakeId = 'WRNG_ID';
          const { convert } = editor.blocks;

          return convert(fakeId, 'convertableTool')
            .catch((error) => {
              expect(error.message).to.be.eq(`Block with id "${fakeId}" not found`);
            });
        });
    });

    it('should throw an error if nonexisting Tool name passed', function () {
      const existingBlock = {
        id: 'test-id-123',
        type: 'paragraph',
        data: {
          text: 'Some text',
        },
      };

      cy.createEditor({
        data: {
          blocks: [
            existingBlock,
          ],
        },
      }).then((editor) => {
        /**
         * Call the 'convert' api method with nonexisting tool name
         */
        const nonexistingToolName = 'WRNG_TOOL_NAME';
        const { convert } = editor.blocks;

        return convert(existingBlock.id, nonexistingToolName)
          .catch((error) => {
            expect(error.message).to.be.eq(`Block Tool with type "${nonexistingToolName}" not found`);
          });
      });
    });

    it('should throw an error if some tool does not provide "conversionConfig"', function () {
      const existingBlock = {
        id: 'test-id-123',
        type: 'paragraph',
        data: {
          text: 'Some text',
        },
      };

      /**
       * Mock of Tool without conversionConfig
       */
      class ToolWithoutConversionConfig extends ToolMock {}

      cy.createEditor({
        tools: {
          nonConvertableTool: {
            class: ToolWithoutConversionConfig,
            shortcut: 'CMD+SHIFT+H',
          },
        },
        data: {
          blocks: [
            existingBlock,
          ],
        },
      }).then((editor) => {
        /**
         * Call the 'convert' api method with tool that does not provide "conversionConfig"
         */
        const { convert } = editor.blocks;

        return convert(existingBlock.id, 'nonConvertableTool')
          .catch((error) => {
            expect(error.message).to.be.eq(`Conversion from "paragraph" to "nonConvertableTool" is not possible. NonConvertableTool tool(s) should provide a "conversionConfig"`);
          });
      });
    });
  });
});
