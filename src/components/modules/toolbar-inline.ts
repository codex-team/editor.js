/**
 * Inline toolbar with actions that modifies selected text fragment
 *
 *  ________________________
 * |                        |
 * |   B  i [link] [mark]   |
 * | _______________________|
 */
declare var Module: any;
declare var $: any;

/**
 * DOM Elements
 */
interface InlineToolbarNodes {
  wrapper?: Element; // main wrapper
}

/**
 * CSS
 */
interface InlineToolbarCSS {
  inlineToolbar: string;
}

export default class InlineToolbar extends Module {

  /**
   * Inline Toolbar elements
   */
  private nodes: InlineToolbarNodes = {
      wrapper: null,
  };

  /**
   * CSS styles
   */
  private CSS: InlineToolbarCSS = {
      inlineToolbar: 'ce-inline-toolbar',
  };

  /**
   * @constructor
   */
  constructor({config}) {

      super({config});

  }

  /**
   * Making DOM
   */
  public make() {

      this.nodes.wrapper = $.make('div', this.CSS.inlineToolbar);

      /**
       * Append Inline Toolbar to the Editor
       */
      $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

  }

  public move() {
    // moving
  }
}
