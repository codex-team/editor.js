/**
 * There will be described test cases of 'api.toolbar.*' API
 */
import EditorJS from '../../../../types';

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
});
