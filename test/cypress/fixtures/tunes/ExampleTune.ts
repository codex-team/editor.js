/**
 * Example Tune Class
 */
export default class ExampleTune {
  protected data: object;
  /**
   *
   * @param data
   */
  constructor({ data }) {
    this.data = data;
  }

  /**
   * Tell editor.js that this Tool is a Block Tune
   *
   * @returns {boolean}
   */
  public static get isTune(): boolean {
    return true;
  }

  /**
   * Create Tunes controls wrapper that will be appended to the Block Tunes panel
   *
   * @returns {Element}
   */
  public render(): Element {
    return document.createElement('div');
  }

  /**
   * CSS selectors used in Tune
   */
  public static get CSS(): object {
    return {};
  }

  /**
   * Returns Tune state
   *
   * @returns {string}
   */
  public save(): object | string {
    return this.data || '';
  }
}
