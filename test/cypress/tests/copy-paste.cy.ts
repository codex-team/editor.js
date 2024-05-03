import Header from '@editorjs/header';
import Image from '@editorjs/simple-image';
import * as _ from '../../../src/components/utils';
import { BlockTool, BlockToolData, OutputData } from '../../../types';
import $ from '../../../src/components/dom';
import type EditorJS from '../../../types/index';


describe('Copy pasting from Editor', function () {
  context('pasting', function () {
    it('should paste plain text', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .as('block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/plain': 'Some plain text',
        });

      cy.get('@block').should('contain', 'Some plain text');
    });

    it('should paste inline html data', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .as('block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/html': '<p><b>Some text</b></p>',
        });

      cy.get('@block').should('contain.html', '<b>Some text</b>');
    });

    it('should paste several blocks if plain text contains new lines', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/plain': 'First block\n\nSecond block',
        });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .then(blocks => {
          expect(blocks[0].textContent).to.eq('First block');
          expect(blocks[1].textContent).to.eq('Second block');
        });
    });

    it('should paste several blocks if html contains several paragraphs', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/html': '<p>First block</p><p>Second block</p>',
        });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .then(blocks => {
          expect(blocks[0].textContent).to.eq('First block');
          expect(blocks[1].textContent).to.eq('Second block');
        });
    });

    it('should paste using custom data type', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'application/x-editor-js': JSON.stringify([
            {
              tool: 'paragraph',
              data: {
                text: 'First block',
              },
            },
            {
              tool: 'paragraph',
              data: {
                text: 'Second block',
              },
            },
          ]),
        });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .then(blocks => {
          expect(blocks[0].textContent).to.eq('First block');
          expect(blocks[1].textContent).to.eq('Second block');
        });
    });

    it('should parse block tags', function () {
      cy.createEditor({
        tools: {
          header: Header,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/html': '<h2>First block</h2><p>Second block</p>',
        });

      /**
       * Check inserted blocks
       */
      cy.get('[data-cy=editorjs]')
        .get('h2.ce-header')
        .should('contain', 'First block');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-paragraph')
        .should('contain', 'Second block');

      /**
       * Check saved data as well
       */
      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          cy.wrap<OutputData>(await editor.save())
            .then((data) => {
              /**
               * <h2> has been correctly saved
               */
              expect(data.blocks[0].type).to.eq('header');
              expect(data.blocks[0].data.text).to.eq('First block');
              expect(data.blocks[0].data.level).to.eq(2);

              /**
               * <p> has been correctly saved
               */
              expect(data.blocks[1].type).to.eq('paragraph');
              expect(data.blocks[1].data.text).to.eq('Second block');
            });
        });
    });

    it('should parse pattern', function () {
      cy.createEditor({
        tools: {
          image: Image,
        },
      });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/plain': 'https://codex.so/public/app/img/external/codex2x.png',
        });

      cy.get('[data-cy=editorjs]')
        // In Edge test are performed slower, so we need to increase timeout to wait until image is loaded on the page
        .get('img', { timeout: 10000 })
        .should('have.attr', 'src', 'https://codex.so/public/app/img/external/codex2x.png');
    });

    it('should not prevent default behaviour if block\'s paste config equals false', function () {
      const onPasteStub = cy.stub().as('onPaste');

      /**
       * Tool with disabled preventing default behavior of onPaste event
       */
      class BlockToolWithPasteHandler implements BlockTool {
        public static pasteConfig = false;

        /**
         * Render block
         */
        public render(): HTMLElement {
          const block = $.make('div', 'ce-block-with-disabled-prevent-default', {
            contentEditable: 'true',
          });

          block.addEventListener('paste', onPasteStub);

          return block;
        }

        /**
         * Save data method
         */
        public save(): BlockToolData {
          return {};
        }
      }

      cy.createEditor({
        tools: {
          blockToolWithPasteHandler: BlockToolWithPasteHandler,
        },
      })
        .as('editorInstanceWithBlockToolWithPasteHandler');

      cy.get('@editorInstanceWithBlockToolWithPasteHandler')
        .render({
          blocks: [
            {
              type: 'blockToolWithPasteHandler',
              data: {},
            },
          ],
        })
        .wait(100);

      cy.get('@editorInstanceWithBlockToolWithPasteHandler')
        .get('div.ce-block-with-disabled-prevent-default')
        .click()
        .paste({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text/plain': 'Hello',
        });

      cy.get('@onPaste')
        .should('have.been.calledWithMatch', {
          defaultPrevented: false,
        });
    });
  });

  context('copying', function () {
    it('should copy inline fragment', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('Some text{selectall}')
        .copy()
        .then(clipboardData => {
          /**
           * As no blocks selected, clipboard data will be empty as will be handled by browser
           */
          expect(clipboardData).to.be.empty;
        });
    });

    it('should copy several blocks', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('First block{enter}');

      cy.get('[data-cy=editorjs')
        .get('div.ce-block')
        .next()
        .type('Second block')
        .type('{movetostart}')
        .trigger('keydown', {
          shiftKey: true,
          keyCode: _.keyCodes.UP,
        })
        .copy()
        .then(clipboardData => {
          expect(clipboardData['text/html']).to.match(/<p>First block(<br>)?<\/p><p>Second block(<br>)?<\/p>/);
          expect(clipboardData['text/plain']).to.eq(`First block\n\nSecond block`);

          /**
           * Need to wait for custom data as it is set asynchronously
           */
          cy.wait(0).then(function () {
            expect(clipboardData['application/x-editor-js']).not.to.be.undefined;

            const data = JSON.parse(clipboardData['application/x-editor-js']);

            expect(data[0].tool).to.eq('paragraph');
            expect(data[0].data.text).to.match(/First block(<br>)?/);
            expect(data[1].tool).to.eq('paragraph');
            expect(data[1].data.text).to.match(/Second block(<br>)?/);
          });
        });
    });
  });

  context('cutting', function () {
    it('should cut inline fragment', function () {
      cy.createEditor({});

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click()
        .type('Some text{selectall}')
        .cut()
        .then(clipboardData => {
          /**
           * As no blocks selected, clipboard data will be empty as will be handled by browser
           */
          expect(clipboardData).to.be.empty;
        });
    });

    it('should cut several blocks', function () {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: { text: 'First block' },
            },
            {
              type: 'paragraph',
              data: { text: 'Second block' },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs')
        .get('div.ce-block')
        .last()
        .click()
        .type('{movetostart}')
        .trigger('keydown', {
          shiftKey: true,
          keyCode: _.keyCodes.UP,
        })
        .cut()
        .then(clipboardData => {
          expect(clipboardData['text/html']).to.match(/<p>First block(<br>)?<\/p><p>Second block(<br>)?<\/p>/);
          expect(clipboardData['text/plain']).to.eq(`First block\n\nSecond block`);

          /**
           * Need to wait for custom data as it is set asynchronously
           */
          cy.wait(0).then(function () {
            expect(clipboardData['application/x-editor-js']).not.to.be.undefined;

            const data = JSON.parse(clipboardData['application/x-editor-js']);

            expect(data[0].tool).to.eq('paragraph');
            expect(data[0].data.text).to.match(/First block(<br>)?/);
            expect(data[1].tool).to.eq('paragraph');
            expect(data[1].data.text).to.match(/Second block(<br>)?/);
          });
        });

      cy.get('[data-cy=editorjs]')
        .should('not.contain', 'First block')
        .should('not.contain', 'Second block');
    });

    it('should cut lots of blocks', function () {
      const numberOfBlocks = 50;
      const blocks = [];

      for (let i = 0; i < numberOfBlocks; i++) {
        blocks.push({
          type: 'paragraph',
          data: {
            text: `Block ${i}`,
          },
        });
      }

      cy.createEditor({
        data: {
          blocks,
        },
      });

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .first()
        .click()
        .type('{ctrl+A}')
        .type('{ctrl+A}')
        .cut()
        .then((clipboardData) => {
          /**
           * Need to wait for custom data as it is set asynchronously
           */
          cy.wait(0).then(function () {
            expect(clipboardData['application/x-editor-js']).not.to.be.undefined;

            const data = JSON.parse(clipboardData['application/x-editor-js']);

            expect(data.length).to.eq(numberOfBlocks);
          });
        });
    });
  });
});
