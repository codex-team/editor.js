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

/**
 * Coordinates
 */
interface ICoords {
  x: number;
  y: number;
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
  private readonly toolbarVerticalMargin: number = 10;

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

    const selectionCoords: ICoords = Selection.getCoords;
    const wrapperOffset = this.getWrapperOffset();
    const toolbarHeight = this.nodes.wrapper.offsetHeight || 40;

    const newCoords: ICoords = {
      x: selectionCoords.x - wrapperOffset.left,
      y: selectionCoords.y
      + window.scrollY
      - wrapperOffset.top
      + toolbarHeight
      + this.toolbarVerticalMargin,
    };

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

  /**
   * Returns editor wrapper offset
   * @return {{bottom: number, top: number, left: number, right: number, height: number: width: number}}
   */
  private getWrapperOffset() {
    const rect = this.Editor.UI.nodes.wrapper.getBoundingClientRect();

    /**
     * @todo
     * add cache
     */
    return rect;
  }
}
