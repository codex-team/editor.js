
import Header from '@editorjs/header';
import { MenuConfig } from '../../../../types/tools';

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
});
