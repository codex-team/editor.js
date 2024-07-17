import Header from '@editorjs/header';
import NestedEditor, { NESTED_EDITOR_ID } from '../../support/utils/nestedEditorInstance';

describe('Inline Toolbar', () => {
  it('should appear aligned with left coord of selection rect', () => {
    cy.createEditor({
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

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .selectText('block');

    cy.get('[data-cy="inline-toolbar"] .ce-popover__container')
      .should('be.visible')
      .then(($toolbar) => {
        const editorWindow = $toolbar.get(0).ownerDocument.defaultView;
        const selection = editorWindow.getSelection();

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        expect($toolbar.offset().left).to.be.closeTo(rect.left, 1);
      });
  });

  it('should appear aligned with right side of text column when toolbar\'s width is not fit at right', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .as('blockWrapper')
      .getLineWrapPositions()
      .then((lineWrapIndexes) => {
        const firstLineWrapIndex = lineWrapIndexes[0];

        /**
         * Select last 5 chars of the first line
         */
        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .selectTextByOffset([firstLineWrapIndex - 5, firstLineWrapIndex - 1]);
      });

    cy.get('[data-cy="inline-toolbar"] .ce-popover__container')
      .should('be.visible')
      .then(($toolbar) => {
        cy.get('@blockWrapper')
          .then(($blockWrapper) => {
            const blockWrapperRect = $blockWrapper.get(0).getBoundingClientRect();

            /**
             * Toolbar should be aligned with right side of text column
             */
            expect($toolbar.offset().left + $toolbar.width()).to.closeTo(blockWrapperRect.right, 10);
          });
      });
  });

  it('should not submit form nesting editor when inline tool clicked', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Some text',
            },
          },
        ],
      },
    });

    const onSubmit = cy.stub();

    cy.document().then(doc => {
      const form = doc.createElement('form');

      form.onsubmit = onSubmit;
      doc.body.appendChild(form);

      /* Move editor to form */
      form.appendChild(doc.getElementById('editorjs'));

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('Some text');

      cy.get('[data-item-name=bold]')
        .click();

      expect(onSubmit).to.be.not.called;
    });
  });

  describe('Conversion toolbar', () => {
    it('should restore caret after converting of a block', () => {
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
                text: 'Some text',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .selectText('Some text');

      cy.get('[data-item-name=convert-to]')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('.ce-inline-toolbar')
        .find('.ce-popover-item[data-item-name=header]')
        .click();

      cy.get('[data-cy=editorjs]')
        .find('.ce-header')
        .should('have.text', 'Some text');

      cy.window()
        .then((window) => {
          const selection = window.getSelection();

          expect(selection.rangeCount).to.be.equal(1);

          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('.ce-header')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
            });
        });
    });
  });

  describe('Nested Editor instance inline toolbar', () => {
    it('should not close inline toolbar of the nested Editor instance when clicking within that toolbar', () => {
      cy.createEditor({
        tools: {
          nestedEditor: {
            class: NestedEditor,
          },
        },
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              },
            },
            {
              type: 'nestedEditor',
              data: {
                text: 'Nunc pellentesque, tortor nec luctus venenatis',
              },
            },
          ],
        },
      });

      cy.get(`[data-cy=${NESTED_EDITOR_ID}]`)
        .find('.ce-paragraph')
        .selectText('tortor nec luctus');

      cy.get(`[data-cy=${NESTED_EDITOR_ID}]`)
        .find('[data-item-name=link]')
        .click();

      // `wait()` function below is required. without it the test will always pass
      // because cypress types the text in the field without delay, while we need some delay (just like user)
      // to test the actual case that nested editor inline toolbar is still visible and not closed

      cy.get(`[data-cy=${NESTED_EDITOR_ID}]`)
        .find('.ce-inline-tool-input')
        .click()
        .wait(100)
        .type('https://editorjs.io');

      cy.get(`[data-cy=${NESTED_EDITOR_ID}]`)
        .find('.ce-popover__container')
        .then(($toolbar) => {
          expect($toolbar).to.be.visible;
        });
    });
  });
});
