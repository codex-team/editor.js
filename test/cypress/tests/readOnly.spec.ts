import EditorJS, { EditorConfig } from '../../../types';

describe('ReadOnly API spec', () => {
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

  it('should add default block when block list is empty', () => {
    createEditor({ readOnly: true });

    cy
      .get<EditorJS>('@editorInstance')
      .then(async editor => {
        editor.readOnly.toggle(false).then(() => {
          cy.get('[data-cy=editorjs').click();

          expect(editor.readOnly.isEnabled).to.be.false;
        });
      });
  });
});
