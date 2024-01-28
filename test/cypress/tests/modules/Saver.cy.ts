import type EditorJS from '../../../../types/index';
import Header from '@editorjs/header';

describe('Saver module', function () {
  describe('save()', function () {
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
