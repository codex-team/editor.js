import type EditorJS from '../../../../types/index';
import Header from '@editorjs/header';
import ToolMock from '../../fixtures/tools/ToolMock';

describe('Saver module', function () {
  describe('save()', function () {
    ['throws', 'rejects'].forEach((failureMode) => {
      it(`should reject with the original error when a tool's save() ${failureMode}`, function () {
        const saveError = new Error('Tool failed to save');
        const save = cy.stub(ToolMock.prototype, 'save');

        if (failureMode === 'throws') {
          save.throws(saveError);
        } else {
          save.rejects(saveError);
        }

        cy.createEditor({
          tools: {
            failingTool: ToolMock,
          },
          data: {
            blocks: [
              {
                type: 'failingTool',
                data: { text: 'Unsaved content' },
              },
            ],
          },
        }).then((editor: EditorJS) => {
          return editor.save().then(
            (data) => {
              assert.fail(`Expected save() to reject, but it resolved with ${JSON.stringify(data)}`);
            },
            (error) => {
              expect(error).to.equal(saveError);
            }
          );
        });
      });
    });

    it('should skip invalid blocks and save valid blocks', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: { text: '' },
            },
            {
              id: 'valid-block',
              type: 'paragraph',
              data: { text: 'Valid content' },
            },
          ],
        },
      }).then(async (editor: EditorJS) => {
        const data = await editor.save();

        expect(data.blocks).to.deep.equal([
          {
            id: 'valid-block',
            type: 'paragraph',
            data: { text: 'Valid content' },
          },
        ]);
      });
    });

    it('should still reject saving in read-only mode', function () {
      cy.createEditor({
        readOnly: true,
      }).then((editor: EditorJS) => {
        return editor.save().then(
          () => {
            assert.fail('Expected saving in read-only mode to reject');
          },
          (error) => {
            expect(error.message).to.equal('Editor\'s content can not be saved in read-only mode');
          }
        );
      });
    });

    it('should correctly save block if there are some 3rd party (eg. browser extensions) nodes inserted into the layout', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'The block with some text',
              },
            },
          ],
        },
      }).then((editor: EditorJS) => {
        /**
         * Add some node just like browser extensions doing
         */
        const extensionNode = document.createElement('extension-node');

        cy.get('[data-cy=editorjs]')
          .find('.ce-block__content')
          .then((blockContent) => {
            blockContent.append(extensionNode);
          })
          .then(async () => {
            const savedData = await editor.save();

            expect(savedData.blocks.length).to.equal(1);
            expect(savedData.blocks[0].data.text).to.equal('The block with some text');
          });
      });
    });

    /**
     * This test case covers Block@detectToolRootChange
     */
    it('should correctly save block data if block\'s main container element have been changed', function () {
      cy.createEditor({
        tools: {
          header: Header,
        },
        data: {
          blocks: [
            {
              type: 'header',
              data: {
                text: 'The block with some text',
                level: 1,
              },
            },
          ],
        },
      })
        .as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('span.ce-toolbar__settings-btn')
        .click();

      /**
       * Change header level
       */
      cy.get('[data-cy=editorjs]')
        .get('.ce-settings .ce-popover-item:nth-child(3)')
        .click();

      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const data = await editor.save();

          expect(data.blocks[0].type).to.equal('header');
          expect(data.blocks[0].data.text).to.equal('The block with some text');
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          expect(data.blocks[0].data.level).to.equal(3);
        });
    });
  });
});
