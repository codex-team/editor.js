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
declare var _: any;
import Selection from '../selection';

/**
 * DOM Elements
 */
interface INodes {
  wrapper?: HTMLElement; // main wrapper
}

/**
 * CSS
 */
interface ICSS {
  inlineToolbar: string;
}

export default class InlineToolbar extends Module {

  /**
   * Inline Toolbar elements
   */
  private nodes: INodes = {
      wrapper: null,
  };

  /**
   * CSS styles
   */
  private CSS: ICSS = {
      inlineToolbar: 'ce-inline-toolbar',
  };

  /**
   * Margin above/below the Toolbar
   */
  private readonly toolbarVerticalMargin: number = 20;

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

  /**
   * Move Toolbar to the selected text
   */
  public move() {

    if (!this.allowedToShow()) {
      // close
      return;
    }

    const selectionRect = Selection.getRect;
    const wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();

    const newCoords = {
      x: selectionRect.x - wrapperOffset.left,
      y: selectionRect.y
          + selectionRect.height
          // + window.scrollY
          - wrapperOffset.top
          + this.toolbarVerticalMargin,
    };

    /**
     * If we know selections width, place InlineToolbar to center
     */
    if (selectionRect.width) {
      newCoords.x += Math.floor(selectionRect.width / 2);
    }

    this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';

  }

  /**
   * Need to show Inline Toolbar or not
   */
  private allowedToShow(): boolean {

    /**
     * @todo check for empty selection, tagsConflictsWithSelection, currentBlock 'inlineToolbar' settings
     */
    return true;
  }
}
