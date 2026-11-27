import type { EditorConfig } from '../../../types';
import type EditorJS from '../../../types';

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

  /**
   * Asserts that no element inside the editor is focused
   */
  function assertEditorIsNotFocused(): void {
    cy
      .get('[data-cy=editorjs]')
      .should(($editor) => {
        const editorElement = $editor[0];

        expect(editorElement.contains(editorElement.ownerDocument.activeElement)).to.be.false;
      });
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

  it('should focus the first block after switching to the editable mode when autofocus is enabled', () => {
    createEditor({
      readOnly: true,
      autofocus: true,
    });

    cy
      .get<EditorJS>('@editorInstance')
      .then(async editor => {
        await editor.readOnly.toggle();
      });

    cy
      .get('[data-cy=editorjs]')
      .find('[contenteditable=true]')
      .first()
      .should('be.focused');
  });

  it('should not focus the first block after switching to the editable mode when autofocus is disabled', () => {
    createEditor({
      readOnly: true,
      autofocus: false,
    });

    cy
      .get<EditorJS>('@editorInstance')
      .then(async editor => {
        await editor.readOnly.toggle();
      });

    assertEditorIsNotFocused();
  });

  it('should not focus the first block after switching back to the read-only mode', () => {
    createEditor({
      readOnly: true,
      autofocus: true,
    });

    cy
      .get<EditorJS>('@editorInstance')
      .then(async editor => {
        await editor.readOnly.toggle();
        await editor.readOnly.toggle();
      });

    assertEditorIsNotFocused();
  });

  it('should not focus the first block for an editor that started in the editable mode', () => {
    createEditor({
      autofocus: true,
    });

    cy
      .get<EditorJS>('@editorInstance')
      .then(async editor => {
        await editor.readOnly.toggle(true);
        await editor.readOnly.toggle(false);
      });

    assertEditorIsNotFocused();
  });

  it('should focus the first block only on the first switch to the editable mode', () => {
    createEditor({
      readOnly: true,
      autofocus: true,
    });

    cy
      .get<EditorJS>('@editorInstance')
      .then(async editor => {
        await editor.readOnly.toggle();
        await editor.readOnly.toggle();
        await editor.readOnly.toggle();
      });

    assertEditorIsNotFocused();
  });
});
