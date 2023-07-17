import { BlockTool, BlockToolConstructorOptions } from '../../../../types';

/**
 * Simple structure for Tool data
 */
interface MockToolData {
  text: string;
}

/**
 * Common class for Tool mocking.
 * Extend this class to create a mock for your Tool with specific properties.
 */
export default class ToolMock implements BlockTool {
  /**
   * Tool data
   */
  private data: MockToolData;

  /**
   * Creates new Tool instance
   *
   * @param options - tool constructor options
   */
  constructor(options: BlockToolConstructorOptions<MockToolData>) {
    this.data = options.data;
  }

  /**
   * Renders a single content editable element as tools element
   */
  public render(): HTMLElement {
    const contenteditable = document.createElement('div');

    if (this.data && this.data.text) {
      contenteditable.innerHTML = this.data.text;
    }

    contenteditable.contentEditable = 'true';

    return contenteditable;
  }

  /**
   * Save method mock, returns block innerHTML
   *
   * @param block - element rendered by the render method
   */
  public save(block: HTMLElement): MockToolData {
    return {
      text: block.innerHTML,
    };
  }
}
