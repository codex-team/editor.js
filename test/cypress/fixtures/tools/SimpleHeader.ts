import type {
  BaseTool,
  BlockToolConstructorOptions,
  BlockToolData,
  ConversionConfig
} from '../../../../types';

/**
 * Simplified Header for testing
 */
export class SimpleHeader implements BaseTool {
  private _data: BlockToolData;
  private element: HTMLHeadingElement | null = null;

  /**
   *
   * @param options - constructor options
   */
  constructor({ data }: BlockToolConstructorOptions) {
    this._data = data;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElement}
   * @public
   */
  public render(): HTMLHeadingElement {
    this.element = document.createElement('h1');

    this.element.contentEditable = 'true';
    this.element.innerHTML = this._data.text;

    return this.element;
  }

  /**
   * @param data - saved data to merger with current block
   */
  public merge(data: BlockToolData): void {
    this.element?.insertAdjacentHTML('beforeend', data.text);
  }

  /**
   * Extract Tool's data from the view
   *
   * @param toolsContent - Text tools rendered view
   */
  public save(toolsContent: HTMLHeadingElement): BlockToolData {
    return {
      text: toolsContent.innerHTML,
      level: 1,
    };
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  public static get conversionConfig(): ConversionConfig {
    return {
      export: 'text', // use 'text' property for other blocks
      import: 'text', // fill 'text' property from other block's export string
    };
  }
}
