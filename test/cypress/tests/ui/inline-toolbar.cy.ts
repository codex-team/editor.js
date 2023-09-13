import type EditorJS from '../../../../types/index';

describe('Inline Toolbar Renders', () => {
  const hideToolbarWorkaround = (): void => {
    // TODO: hideToolbar doesn't work, remove workaround when fixed
    cy.get('[data-cy=editorjs]')
      .find('.ce-toolbar')
      .then(($el) => {
        $el.hide();
      });

    cy.get('[data-cy=editorjs]')
      .find('.codex-editor--narrow')
      .then(($el) => {
        $el.removeClass('codex-editor--narrow');
      });
  };

  const selectTextElement = (editor: EditorJS, selector: string): void => {
    cy.get('[data-cy=editorjs]')
      .find(selector)
      .then(($el) => {
        editor.selection.expandToTag(
          $el.get(0)
        );
        editor.inlineToolbar.open();
      });
  };

  it('should be visible (left)', () => {
    cy.window().then((window) => {
      const container: HTMLElement = window.document.createElement('div');

      container.style.width =  '120px';
      container.style.overflow = 'hidden';
      window.document.body.appendChild(container);

      cy.createEditor({
        // Hiding the block toolbar makes simplier to reproduce
        hideToolbar: true,
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: '<u>F</u>irst block text',
              },
            },
          ],
        },
      }, container)
        .then((editor) => {
          hideToolbarWorkaround();
          selectTextElement(editor, 'div.ce-block u');

          cy.get('[data-cy=editorjs]')
            .find('.ce-inline-toolbar')
            .should('have.class', 'ce-inline-toolbar--left-oriented');

          cy.get('[data-cy=editorjs]')
            .get('button.ce-inline-tool')
            .should((items) => {
              items.each((_, $el) => {
                if (!Cypress.dom.isVisible($el)) {
                  throw new Error(`Element is hidden (${$el.classList})`);
                }
              });
            });
        });
    });
  });

  it('should be visible (right)', () => {
    cy.window().then((window) => {
      const container: HTMLElement = window.document.createElement('div');

      container.style.width =  '120px';
      container.style.overflow = 'hidden';
      window.document.body.appendChild(container);

      cy.createEditor({
        // Hiding the block toolbar makes simplier to reproduce
        hideToolbar: true,
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'First block tex<u>t</u>',
              },
            },
          ],
        },
      }, container)
        .then((editor) => {
          hideToolbarWorkaround();
          selectTextElement(editor, 'div.ce-block u');

          cy.get('[data-cy=editorjs]')
            .find('.ce-inline-toolbar')
            .should('have.class', 'ce-inline-toolbar--right-oriented');

          cy.get('[data-cy=editorjs]')
            .get('button.ce-inline-tool')
            .should((items) => {
              items.each((_, $el) => {
                if (!Cypress.dom.isVisible($el)) {
                  throw new Error(`Element is hidden (${$el.classList})`);
                }
              });
            });
        });
    });
  });

  it('should be visible when wraper element is offset (left)', () => {
    cy.window().then((window) => {
      const offsetContainer: HTMLElement = window.document.createElement('div');

      offsetContainer.style.position = 'absolute';
      offsetContainer.style.left = '100px';
      offsetContainer.style.width =  '120px';
      offsetContainer.style.overflow = 'hidden';
      window.document.body.appendChild(offsetContainer);

      cy.createEditor({
        // Hiding the block toolbar makes simplier to reproduce
        hideToolbar: true,
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: '<u>F</u>irst block text',
              },
            },
          ],
        },
      }, offsetContainer)
        .then((editor) => {
          hideToolbarWorkaround();
          selectTextElement(editor, 'div.ce-block u');

          cy.get('[data-cy=editorjs]')
            .find('.ce-inline-toolbar')
            .should('have.class', 'ce-inline-toolbar--left-oriented');

          cy.get('[data-cy=editorjs]')
            .get('button.ce-inline-tool')
            .should((items) => {
              items.each((_, $el) => {
                if (!Cypress.dom.isVisible($el)) {
                  throw new Error(`Element is hidden (${$el.classList})`);
                }
              });
            });
        });
    });
  });

  it('should be visible when wraper element is offset (right)', () => {
    cy.window().then((window) => {
      const offsetContainer: HTMLElement = window.document.createElement('div');

      offsetContainer.style.position = 'absolute';
      offsetContainer.style.left = '100px';
      offsetContainer.style.width =  '120px';
      offsetContainer.style.overflow = 'hidden';
      window.document.body.appendChild(offsetContainer);

      cy.createEditor({
        // Hiding the block toolbar makes simplier to reproduce
        hideToolbar: true,
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'First block tex<u>t</u>',
              },
            },
          ],
        },
      }, offsetContainer)
        .then((editor) => {
          hideToolbarWorkaround();
          selectTextElement(editor, 'div.ce-block u');

          cy.get('[data-cy=editorjs]')
            .find('.ce-inline-toolbar')
            .should('have.class', 'ce-inline-toolbar--right-oriented');

          cy.get('[data-cy=editorjs]')
            .get('button.ce-inline-tool')
            .should((items) => {
              items.each((_, $el) => {
                if (!Cypress.dom.isVisible($el)) {
                  throw new Error(`Element is hidden (${$el.classList})`);
                }
              });
            });
        });
    });
  });
});
