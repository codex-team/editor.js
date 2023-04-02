import type EditorJS from '../../../../types/index';

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
  });
});
