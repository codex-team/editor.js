import * as _ from '../../../src/components/utils';
import type EditorJS from '../../../types';
import { createEditorWithTextBlocks } from '../support/utils/createEditorWithTextBlocks';

describe('Blocks selection', () => {
  beforeEach(function () {
    cy.createEditor({}).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance !== undefined) {
      this.editorInstance.destroy();
    }
  });

  it('should remove block selection on click', () => {
    cy.get('[data-cy=editorjs]')
      .find('div.ce-block')
      .click()
      .type('First block{enter}');

    cy.get('[data-cy=editorjs')
      .find('div.ce-block')
      .next()
      .type('Second block')
      .type('{movetostart}')
      .trigger('keydown', {
        shiftKey: true,
        keyCode: _.keyCodes.UP,
      });

    cy.get('[data-cy=editorjs')
      .click()
      .find('div.ce-block')
      .should('not.have.class', '.ce-block--selected');
  });
});

describe('Native multiblock text selection', () => {
  beforeEach(function () {
    createEditorWithTextBlocks([
      'Alpha start text',
      'finish Omega',
    ]).as('editorInstance');
  });

  afterEach(function () {
    if (this.editorInstance !== undefined) {
      this.editorInstance.destroy();
    }
  });

  it('should not convert an editable text drag into whole-block selection', () => {
    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .then(($paragraphs) => {
        const firstParagraph = $paragraphs[0];
        const secondParagraph = $paragraphs[1];
        const { ownerDocument } = firstParagraph;
        const selection = ownerDocument.getSelection();
        const range = ownerDocument.createRange();
        const view = ownerDocument.defaultView;
        const firstTextNode = firstParagraph.firstChild;
        const secondTextNode = secondParagraph.firstChild;

        if (!firstTextNode || !secondTextNode || !selection || !view) {
          throw new Error('Selection test fixture is not ready');
        }

        range.setStart(firstTextNode, 6);
        range.setEnd(secondTextNode, 6);
        selection.removeAllRanges();
        selection.addRange(range);

        firstParagraph.dispatchEvent(new view.MouseEvent('mousedown', {
          bubbles: true,
          button: 0,
        }));
        secondParagraph.dispatchEvent(new view.MouseEvent('mouseover', {
          bubbles: true,
          relatedTarget: firstParagraph,
        }));

        expect(selection.rangeCount).to.eq(1);
        expect(selection.toString()).to.contain('start text');
      });

    cy.get('[data-cy=editorjs]')
      .find('.ce-block--selected')
      .should('not.exist');

    cy.get<EditorJS>('@editorInstance')
      .then((editor) => {
        expect(editor.selection.getSelectedText()).to.contain('start text');
        expect(editor.selection.getSelectedBlocks()).to.have.length(0);
      });
  });

  it('should expose selected text and blocks for cross-block selection', () => {
    cy.get('[data-cy=editorjs]')
      .find('.ce-block')
      .then(($blocks) => {
        const firstBlock = $blocks[0];
        const secondBlock = $blocks[1];
        const { defaultView } = firstBlock.ownerDocument;

        if (!defaultView) {
          throw new Error('Block selection test fixture is not ready');
        }

        firstBlock.dispatchEvent(new defaultView.MouseEvent('mousedown', {
          bubbles: true,
          button: 0,
        }));
        secondBlock.dispatchEvent(new defaultView.MouseEvent('mouseover', {
          bubbles: true,
          relatedTarget: firstBlock,
        }));
        secondBlock.dispatchEvent(new defaultView.MouseEvent('mouseup', {
          bubbles: true,
        }));
      });

    cy.get('[data-cy=editorjs]')
      .find('.ce-block--selected')
      .should('have.length', 2);

    cy.get<EditorJS>('@editorInstance')
      .then((editor) => {
        const selectedBlocks = editor.selection.getSelectedBlocks();

        expect(editor.selection.getSelectedText()).to.eq('Alpha start text\n\nfinish Omega');
        expect(selectedBlocks.map((block) => block.name)).to.deep.eq(['paragraph', 'paragraph']);
        expect(selectedBlocks.every((block) => block.selected)).to.eq(true);
      });
  });
});
