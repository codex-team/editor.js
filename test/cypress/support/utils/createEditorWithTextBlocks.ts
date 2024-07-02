import Chainable = Cypress.Chainable;
import type EditorJS from '../../../../types/index';


/**
 * Creates Editor instance with list of Paragraph blocks of passed texts
 *
 * @param textBlocks - list of texts for Paragraph blocks
 */
export function createEditorWithTextBlocks(textBlocks: string[]): Chainable<EditorJS> {
  return cy.createEditor({
    data: {
      blocks: textBlocks.map((text) => ({
        type: 'paragraph',
        data: {
          text,
        },
      })),
    },
  });
}
