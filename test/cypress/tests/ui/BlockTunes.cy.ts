import { selectionChangeDebounceTimeout } from '../../../../src/components/constants';
import Header from '@editorjs/header';


describe('BlockTunes', function () {
  describe('Search', () => {
    it('should be focused after popover opened', () => {
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

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('{cmd}/')
        .wait(selectionChangeDebounceTimeout);

      /**
       * Caret is set to the search input
       */
      cy.window()
        .then((window) => {
          const selection = window.getSelection();

          expect(selection.rangeCount).to.be.equal(1);

          const range = selection.getRangeAt(0);

          cy.get('[data-cy=editorjs]')
            .find('[data-cy="block-tunes"] .cdx-search-field')
            .should(($block) => {
              expect($block[0].contains(range.startContainer)).to.be.true;
            });
        });
    });
  });

  describe('Keyboard only', function () {
    it('should not delete the currently selected block when Enter pressed on a search input (or any block tune)', function () {
      const ENTER_KEY_CODE = 13;

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

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('{cmd}/')
        .wait(selectionChangeDebounceTimeout)
        .keydown(ENTER_KEY_CODE);

      /**
       * Block should have same text
       */
      cy.get('[data-cy="block-wrapper"')
        .should('have.text', 'Some text');
    });

    it('should not unselect currently selected block when Enter pressed on a block tune', function () {
      const ENTER_KEY_CODE = 13;

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

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('{cmd}/')
        .wait(selectionChangeDebounceTimeout)
        .keydown(ENTER_KEY_CODE);

      /**
       * Block should not be selected
       */
      cy.get('[data-cy="block-wrapper"')
        .first()
        .should('have.class', 'ce-block--selected');
    });
  });

  describe('Convert to', () => {
    it('should display Convert to inside Block Tunes', () => {
      cy.createEditor({
        tools: {
          header: Header,
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

      /** Open block tunes menu */
      cy.get('[data-cy=editorjs]')
        .get('.cdx-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      /** Check "Convert to" option is present  */
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover-item')
        .contains('Convert to')
        .should('exist');

      /** Click "Convert to" option*/
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover-item')
        .contains('Convert to')
        .click();

      /** Check nected popover with "Heading" option is present */
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover--nested [data-item-name=header]')
        .should('exist');
    });

    it('should not display Convert to inside Block Tunes if there is nothing to convert to', () => {
      /** Editor instance with single default tool */
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

      /** Open block tunes menu */
      cy.get('[data-cy=editorjs]')
        .get('.cdx-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      /** Check "Convert to" option is not present  */
      cy.get('[data-cy=editorjs]')
        .get('.ce-popover-item')
        .contains('Convert to')
        .should('not.exist');
    });
  });
});
