import Header from '@editorjs/header';
import type { InlineTool, MenuConfig } from '../../../../types/tools';
import { createEditorWithTextBlocks } from '../../support/utils/createEditorWithTextBlocks';

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
    it('should activate the focused editor\'s tool when shortcut is pressed with multiple instances on the page', () => {
      const toolActivated1 = cy.stub().as('toolActivated1');
      const toolActivated2 = cy.stub().as('toolActivated2');

      /* eslint-disable jsdoc/require-jsdoc */
      class Marker1 implements InlineTool {
        public static isInline = true;
        public static shortcut = 'CMD+SHIFT+M';
        public render(): MenuConfig {
          return {
            icon: 'm',
            title: 'Marker',
            onActivate: () => { toolActivated1(); },
          };
        }
      }
      class Marker2 implements InlineTool {
        public static isInline = true;
        public static shortcut = 'CMD+SHIFT+M';
        public render(): MenuConfig {
          return {
            icon: 'm',
            title: 'Marker',
            onActivate: () => { toolActivated2(); },
          };
        }
      }
      /* eslint-enable jsdoc/require-jsdoc */

      /** Create first editor */
      cy.createEditor({
        data: {
          blocks: [ { type: 'paragraph', data: { text: 'First editor text' } } ],
        },
        tools: { marker: Marker1 },
      });

      /** Create second editor with a different holder */
      cy.window().then((win) => {
        const holder = win.document.createElement('div');

        holder.id = 'editorjs2';
        holder.dataset.cy = 'editorjs2';
        win.document.body.appendChild(holder);

        return new Promise<void>((resolve) => {
          const editor2 = new win.EditorJS({
            holder: 'editorjs2',
            data: {
              blocks: [ { type: 'paragraph', data: { text: 'Second editor text' } } ],
            },
            tools: { marker: Marker2 },
          });

          editor2.isReady.then(() => resolve());
        });
      });

      /**
       * Select text in editor 1 first to open its inline toolbar.
       * This causes editor 1's CMD+SHIFT+M shortcut to be registered on document.
       * Without the inline.ts fix, this shortcut would never be removed from document,
       * so any later attempt by editor 2 to register the same shortcut would throw a
       * duplicate-registration error (silently swallowed), leaving editor 2 with no shortcut.
       */
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('First');

      /** Wait for editor 1's inline toolbar to appear (confirms its shortcut is now registered) */
      cy.get('[data-cy=editorjs] [data-cy="inline-toolbar"] .ce-popover__container')
        .should('be.visible');

      /**
       * Now select text in editor 2.
       * The selectionchange event fires, which (after the 180 ms debounce):
       *   1. Calls editor 1's InlineToolbar.close() — with the inline.ts fix this correctly
       *      calls Shortcuts.remove(document, shortcut), removing editor 1's handler from document.
       *   2. Calls editor 2's InlineToolbar.open() — registers editor 2's handler on document.
       * Without the inline.ts fix, step 1 was a no-op (wrong target element), so editor 2's
       * registration in step 2 always hit the duplicate guard and threw, leaving editor 2 with
       * no working shortcut at all.
       */
      cy.get('[data-cy=editorjs2]')
        .find('.ce-paragraph')
        .selectText('Second');

      /** Wait for editor 2's inline toolbar to appear (confirms its shortcut is now registered) */
      cy.get('[data-cy=editorjs2] [data-cy="inline-toolbar"] .ce-popover__container')
        .should('be.visible');

      /**
       * Dispatch the shortcut key event on the editor 2 paragraph element (not on document).
       * Dispatching directly on document makes event.target === document, which does not have
       * .closest() — causing a TypeError in ui.ts defaultBehaviour.
       * Dispatching on the focused element gives event.target an HTMLElement with .closest(),
       * and the event still bubbles up to document where the shortcut handler is registered.
       */
      cy.get('[data-cy=editorjs2]')
        .find('.ce-paragraph')
        .then(($el) => {
          $el[0].dispatchEvent(new KeyboardEvent('keydown', {
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

      /** Second editor's shortcut should fire, first editor's should not */
      cy.get('@toolActivated2').should('have.been.called');
      cy.get('@toolActivated1').should('not.have.been.called');
    });

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

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .then(($el) => {
          $el[0].dispatchEvent(new KeyboardEvent('keydown', {
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
});

