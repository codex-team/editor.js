import type { BlockTool, BlockToolConstructorOptions } from '../../../../types';
import { createEditorWithTextBlocks } from './createEditorWithTextBlocks';

export const NESTED_EDITOR_ID = 'nested-editor';

/**
 * Creates nested Editor instance with paragraph block
 */
export default class NestedEditor implements BlockTool {
  private data: { text: string };

  constructor(value: BlockToolConstructorOptions) {
    this.data = value.data;
  }

  public render(): HTMLDivElement {
    const editorEl = Object.assign(document.createElement('div'), {
      id: NESTED_EDITOR_ID,
    });

    editorEl.setAttribute('data-cy', NESTED_EDITOR_ID);

    createEditorWithTextBlocks([ this.data.text ], { holder: NESTED_EDITOR_ID });

    return editorEl;
  }

  public save(): string {
    return this.data.text;
  }
}
