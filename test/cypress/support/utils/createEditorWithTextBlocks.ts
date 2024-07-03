import { EditorConfig } from '../../../../types/index';
import Chainable = Cypress.Chainable;
import type EditorJS from '../../../../types/index';


/**
 * Creates Editor instance with list of Paragraph blocks of passed texts
 *
 * @param textBlocks - list of texts for Paragraph blocks
 * @param editorConfig - config to pass to the editor
 */
export function createEditorWithTextBlocks(textBlocks: string[], editorConfig?: Omit<EditorConfig, 'data'>): Chainable<EditorJS> {
  return cy.createEditor(Object.assign(editorConfig || {}, {
    data: {
      blocks: textBlocks.map((text) => ({
        type: 'paragraph',
        data: {
          text,
        },
      })),
    },
  }));
}
