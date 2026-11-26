/**
 * There will be described test cases of 'api.toolbar.*' API
 */
import type EditorJS from '../../../../types';

describe('api.toolbar', () => {
  /**
   * api.toolbar.openToolbox(openingState?: boolean)
   */
  const firstBlock = {
    id: 'bwnFX5LoX7',
    type: 'paragraph',
    data: {
      text: 'The first block content mock.',
    },
  };
  const editorDataMock = {
    blocks: [
      firstBlock,
    ],
  };

  beforeEach(function () {
    cy.createEditor({
      data: editorDataMock,
      readOnly: false,
    }).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  });

  describe('*.toggleToolbox()', () => {
    const isToolboxVisible = (): void => {
      cy.get('[data-cy=editorjs]').find('div.ce-toolbox')
        .then((toolbox) => {
          if (toolbox.is(':visible')) {
            assert.isOk(true, 'Toolbox visible');
          } else {
            assert.isNotOk(false, 'Toolbox should be visible');
          }
        });
    };

    const isToolboxNotVisible = (): void => {
      cy.get('[data-cy=editorjs]').find('div.ce-toolbox')
        .then((toolbox) => {
          if (!toolbox.is(':visible')) {
            assert.isOk(true, 'Toolbox not visible');
          } else {
            assert.isNotOk(false, 'Toolbox should not be visible');
          }
        });
    };

    it('should open the toolbox', function () {
      cy.get<EditorJS>('@editorInstance').then(async function (editor) {
        editor.toolbar.toggleToolbox(true);
        isToolboxVisible();
      });
    });

    it('should close the toolbox', function () {
      cy.get<EditorJS>('@editorInstance').then(async function (editor) {
        editor.toolbar.toggleToolbox(true);

        isToolboxVisible();

        editor.toolbar.toggleToolbox(false);
        isToolboxNotVisible();
      });
    });
    it('should toggle the toolbox', function () {
      cy.get<EditorJS>('@editorInstance').then(async function (editor) {
        editor.toolbar.toggleToolbox();
        isToolboxVisible();

        editor.toolbar.toggleToolbox();
        isToolboxNotVisible();
      });
    });
  });

  describe('stretched Blocks', () => {
    /**
     * Toolbar content should match the content width of the hovered Block
     */
    const assertToolbarAlignedWithBlock = (): void => {
      cy.get('[data-cy=editorjs]').then(($holder) => {
        const blockContentRect = $holder.find('.ce-block__content')[0].getBoundingClientRect();
        const toolbarContentRect = $holder.find('.ce-toolbar__content')[0].getBoundingClientRect();

        expect(toolbarContentRect.left).to.be.closeTo(blockContentRect.left, 1);
        expect(toolbarContentRect.width).to.be.closeTo(blockContentRect.width, 1);
      });
    };

    beforeEach(function () {
      cy.viewport(1000, 800);

      /**
       * Toolbox is created in requestIdleCallback, and Toolbar is not moved until it is ready
       */
      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbox')
        .should('exist');
    });

    it('should align the toolbar with the content of a stretched Block', function () {
      cy.get<EditorJS>('@editorInstance').then((editor) => {
        editor.blocks.getBlockByIndex(0).stretched = true;
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .trigger('mousemove');

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('have.class', 'ce-toolbar--stretched');
      assertToolbarAlignedWithBlock();
    });

    it('should re-align the toolbar when the stretched state of the hovered Block is toggled', function () {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .trigger('mousemove');

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('have.class', 'ce-toolbar--opened');
      assertToolbarAlignedWithBlock();

      cy.get<EditorJS>('@editorInstance').then((editor) => {
        editor.blocks.getBlockByIndex(0).stretched = true;
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('have.class', 'ce-toolbar--stretched');
      assertToolbarAlignedWithBlock();

      cy.get<EditorJS>('@editorInstance').then((editor) => {
        editor.blocks.getBlockByIndex(0).stretched = false;
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('not.have.class', 'ce-toolbar--stretched');
      assertToolbarAlignedWithBlock();
    });

    it('should re-align the toolbar when the hovered Block is stretched while Block Settings are open', function () {
      cy.get('[data-cy=editorjs]')
        .find('.ce-block')
        .first()
        .trigger('mousemove');

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('have.class', 'ce-toolbar--opened');

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar__settings-btn')
        .click();

      cy.get('[data-cy="block-tunes"] .ce-popover__container').should('be.visible');
      assertToolbarAlignedWithBlock();

      cy.get<EditorJS>('@editorInstance').then((editor) => {
        editor.blocks.getBlockByIndex(0).stretched = true;
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('have.class', 'ce-toolbar--stretched');
      cy.get('[data-cy="block-tunes"] .ce-popover__container').should('be.visible');
      assertToolbarAlignedWithBlock();

      cy.get<EditorJS>('@editorInstance').then((editor) => {
        editor.blocks.getBlockByIndex(0).stretched = false;
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-toolbar')
        .should('not.have.class', 'ce-toolbar--stretched');
      cy.get('[data-cy="block-tunes"] .ce-popover__container').should('be.visible');
      assertToolbarAlignedWithBlock();
    });
  });
});
