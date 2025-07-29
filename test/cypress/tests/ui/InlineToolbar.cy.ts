import Header from '@editorjs/header';
import type { InlineTool, MenuConfig } from '../../../../types/tools';
import { createEditorWithTextBlocks } from '../../support/utils/createEditorWithTextBlocks';
import Paragraph from '@editorjs/paragraph';

describe('Inline Toolbar', () => {
  describe('Separators', () => {
    it('should have a separator after the first item if it has children', () => {
      cy.createEditor({
        tools: {
          header: {
            class: Header,
          },
        },
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'First block text',
              },
            },
          ],
        },
      });

      /** Open Inline Toolbar */
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('block');

      /** Check that first item (which is convert-to and has children) has a separator after it */
      cy.get('[data-cy=editorjs]')
        .get('[data-cy=inline-toolbar] .ce-popover__items')
        .children()
        .first()
        .should('have.attr', 'data-item-name', 'convert-to');

      cy.get('[data-cy=editorjs]')
        .get('[data-cy=inline-toolbar] .ce-popover__items')
        .children()
        .eq(1)
        .should('have.class', 'ce-popover-item-separator');
    });

    it('should have separators from both sides of item if it is in the middle and has children', () => {
      cy.createEditor({
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['bold', 'testTool', 'link'],

          },
          testTool: {
            class: class {
              public static isInline = true;
              // eslint-disable-next-line jsdoc/require-jsdoc
              public render(): MenuConfig {
                return {
                  icon: 'n',
                  title: 'Test Tool',
                  name: 'test-tool',
                  children: {
                    items: [
                      {
                        icon: 'm',
                        title: 'Test Tool Item',
                        // eslint-disable-next-line  @typescript-eslint/no-empty-function
                        onActivate: () => {},
                      },
                    ],
                  },
                };
              }
            },
          },
        },
        data: {
          blocks: [
            {
              type: 'header',
              data: {
                text: 'First block text',
              },
            },
          ],
        },
      });

      /** Open Inline Toolbar */
      cy.get('[data-cy=editorjs]')
        .find('.ce-header')
        .selectText('block');

      /** Check that item with children is surrounded by separators */
      cy.get('[data-cy=editorjs]')
        .get('[data-cy=inline-toolbar] .ce-popover__items')
        .children()
        .eq(3)
        .should('have.class', 'ce-popover-item-separator');

      cy.get('[data-cy=editorjs]')
        .get('[data-cy=inline-toolbar] .ce-popover__items')
        .children()
        .eq(4)
        .should('have.attr', 'data-item-name', 'test-tool');

      cy.get('[data-cy=editorjs]')
        .get('[data-cy=inline-toolbar] .ce-popover__items')
        .children()
        .eq(5)
        .should('have.class', 'ce-popover-item-separator');
    });

    it('should have separator before the item with children if it is the last of all items', () => {
      cy.createEditor({
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['bold', 'testTool'],

          },
          testTool: {
            class: class {
              public static isInline = true;
              // eslint-disable-next-line jsdoc/require-jsdoc
              public render(): MenuConfig {
                return {
                  icon: 'n',
                  title: 'Test Tool',
                  name: 'test-tool',
                  children: {
                    items: [
                      {
                        icon: 'm',
                        title: 'Test Tool Item',
                        // eslint-disable-next-line  @typescript-eslint/no-empty-function
                        onActivate: () => {},
                      },
                    ],
                  },
                };
              }
            },
          },
        },
        data: {
          blocks: [
            {
              type: 'header',
              data: {
                text: 'First block text',
              },
            },
          ],
        },
      });

      /** Open Inline Toolbar */
      cy.get('[data-cy=editorjs]')
        .find('.ce-header')
        .selectText('block');

      /** Check that item with children is surrounded by separators */
      cy.get('[data-cy=editorjs]')
        .get('[data-cy=inline-toolbar] .ce-popover__items')
        .children()
        .eq(3)
        .should('have.class', 'ce-popover-item-separator');

      cy.get('[data-cy=editorjs]')
        .get('[data-cy=inline-toolbar] .ce-popover__items')
        .children()
        .eq(4)
        .should('have.attr', 'data-item-name', 'test-tool');
    });
  });

  describe('Shortcuts', () => {
    it('should work in read-only mode', () => {
      const toolSurround = cy.stub().as('toolSurround');

      /* eslint-disable jsdoc/require-jsdoc */
      class Marker implements InlineTool {
        public static isInline = true;
        public static shortcut = 'CMD+SHIFT+M';
        public static isReadOnlySupported = true;
        public render(): MenuConfig {
          return {
            icon: 'm',
            title: 'Marker',
            onActivate: () => {
              toolSurround();
            },
          };
        }
      }
      /* eslint-enable jsdoc/require-jsdoc */

      createEditorWithTextBlocks([
        'some text',
      ], {
        tools: {
          marker: Marker,
        },
        readOnly: true,
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('text');

      cy.wait(300);

      cy.document().then((doc) => {
        doc.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'M',
          code: 'KeyM',
          keyCode: 77,
          which: 77,
          metaKey: true,
          shiftKey: true,
        }));
      });

      cy.get('@toolSurround').should('have.been.called');
    });
  });

  describe('Default align to left', () => {
    it('Should align the InlineToolbar to the left as default', () => {
      cy.createEditor({
        tools: {
          block: Paragraph,
        },
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Test inline toolbar alignment',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first()
        .selectText('inline toolbar');

      cy.get('[data-cy="inline-toolbar"] .ce-popover__container').should('be.visible');

      cy.window().then((win) => {
        cy.get('[data-cy="inline-toolbar"] .ce-popover__container').then(($toolbar) => {
          const toolbarRect = $toolbar[0].getBoundingClientRect();
          const selection = win.getSelection();

          if (!selection || selection.rangeCount === 0) {
            throw new Error('No selection found');
          }
          const rangeRect = selection.getRangeAt(0).getBoundingClientRect();

          // Assert toolbar left is approximately equal to selection left
          expect(Math.abs(toolbarRect.left - rangeRect.left)).to.be.lessThan(5);
        });
      });
    });
  });

  describe('Align to rigth', () => {
    it('Should align the InlineToolbar to the right', () => {
      cy.createEditor({
        alignInlineToolbar: 'right',
        tools: {
          block: Paragraph,
        },
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Test inline toolbar alignment',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .first()
        .selectText('inline toolbar');

      cy.get('[data-cy="inline-toolbar"] .ce-popover__container').should('be.visible');

      cy.window().then((win) => {
        cy.get('[data-cy="inline-toolbar"] .ce-popover__container').then(($toolbar) => {
          const toolbarRect = $toolbar[0].getBoundingClientRect();
          const selection = win.getSelection();

          if (!selection || selection.rangeCount === 0) {
            throw new Error('No selection found');
          }
          const rangeRect = selection.getRangeAt(0).getBoundingClientRect();

          // Assert toolbar right is approximately equal to selection right
          expect(Math.abs(toolbarRect.right - rangeRect.right)).to.be.lessThan(5);
        });
      });
    });
  });
});

