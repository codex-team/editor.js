import type { EditorConfig } from '../../../types';
import type EditorJS from '../../../types';
import ToolMock from '../fixtures/tools/ToolMock';

describe('ReadOnly API spec', () => {
  /**
   * Creates the new editor instance
   *
   * @param config - Editor Config
   */
  function createEditor(config?: EditorConfig): void {
    const editorConfig = Object.assign({}, config || {});

    cy.createEditor(editorConfig).as('editorInstance');
  }

  it('should return correct value for readOnly.isEnabled when editor initialized in normal mode', () => {
    createEditor();

    cy
      .get<EditorJS>('@editorInstance')
      .then(editor => {
        expect(editor.readOnly.isEnabled).to.be.false;
      });
  });

  it('should return correct value for readOnly.isEnabled when editor initialized in read-only mode', () => {
    createEditor({
      readOnly: true,
    });

    cy
      .get<EditorJS>('@editorInstance')
      .then(editor => {
        expect(editor.readOnly.isEnabled).to.be.true;
      });
  });

  it('should return correct value for readOnly.isEnabled when read-only mode toggled', () => {
    createEditor();

    cy
      .get<EditorJS>('@editorInstance')
      .then(async editor => {
        expect(editor.readOnly.isEnabled).to.be.false;

        editor.readOnly.toggle()
          .then(() => {
            expect(editor.readOnly.isEnabled).to.be.true;
          })
          .then(() => editor.readOnly.toggle())
          .then(() => {
            expect(editor.readOnly.isEnabled).to.be.false;
          });
      });
  });

  it('should restore read-only state when toggle fails due to save error', () => {
    const saveError = new Error('Tool failed to save');

    /**
     * Create a tool class that supports read-only mode
     */
    class ReadOnlyTool extends ToolMock {
      public static isReadOnlySupported = true;
    }

    const saveStub = cy.stub(ReadOnlyTool.prototype, 'save');

    saveStub.throws(saveError);

    cy.createEditor({
      tools: {
        failingTool: ReadOnlyTool,
      },
      data: {
        blocks: [
          {
            type: 'failingTool',
            data: { text: 'Unsaved content' },
          },
        ],
      },
    }).then((editor: EditorJS) => {
      expect(editor.readOnly.isEnabled).to.be.false;

      return editor.readOnly.toggle(true).then(
        () => {
          assert.fail('Expected readOnly.toggle() to reject, but it resolved');
        },
        (error) => {
          /**
           * The toggle should reject with the original error
           */
          expect(error).to.equal(saveError);

          /**
           * The editor should not be in read-only mode after the failure
           */
          expect(editor.readOnly.isEnabled).to.be.false;

          /**
           * Restore the save method so it works now
           */
          saveStub.restore();

          /**
           * editor.save() should work now that the failure is gone
           */
          return editor.save();
        }
      ).then((data) => {
        /**
         * Verify the save succeeded
         */
        expect(data).to.have.property('blocks');
        expect(data.blocks).to.have.length(1);
      });
    });
  });
});
