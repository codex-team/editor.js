import Dom from './dom';
import _ from './utils';

/**
 * @class Flipper
 * @classdesc Flipper is a component that iterates passed items array by TAB and clicks it by ENTER
 *
 * @property {Object} LEAF_DIRECTIONS - is a static property that defines flipping direction
 * @property {FlipperIterator|null} flipperIterator — instance of flipper iterator
 * @property {Boolean} _activated — flag that defines activation status
 * @property {Object} callbacks — user-provided callbacks
 */
export default class Flipper {
  /**
   * @type {{RIGHT: string; LEFT: string}}
   */
  private static LEAF_DIRECTIONS = {
    RIGHT: 'right',
    LEFT: 'left',
  };

  /**
   * @type {FlipperIterator|null}
   */
  private flipperIterator: FlipperIterator = null;

  /**
   * @type {boolean}
   * @private
   */
  private _activated: boolean = false;

  /**
   * Custom callbacks from Flippers clients
   * On each event flipper can call user-provided callback
   */
  private callbacks: {[key: string]: () => void};

  /**
   * @constructor
   *
   * @param {HTMLElement[]} nodeList
   * @param {string} focusedCssClass
   * @param {object} callbacks
   */
  constructor(
    nodeList: HTMLElement[],
    focusedCssClass: string,
    callbacks: {[key: string]: () => void} = {},
  ) {
    this.callbacks = callbacks;
    this.flipperIterator = new FlipperIterator(nodeList, focusedCssClass);

    /**
     * Listening all keydowns on document and react on TAB/Enter press
     * TAB will leaf iterator items
     * ENTER will click the focused item
     */
    document.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case _.keyCodes.TAB:
          this.handleTabPress(event);
          break;
        case _.keyCodes.ENTER:
          this.handleEnterPress(event);
          break;
      }
    }, false);
  }

  /**
   * @param {Boolean} value
   */
  public set activated(value) {
    this._activated = value;
  }

  /**
   * @return {HTMLElement}
   */
  public get currentItem(): HTMLElement {
    return this.flipperIterator.currentItem;
  }

  /**
   * When flipper is activated tab press will leaf the items
   * @param {KeyboardEvent} event
   */
  public handleTabPress(event): void {
    if (!this._activated) {
      return;
    }

    event.preventDefault();

    /** this property defines leaf direction */
    const shiftKey = event.shiftKey,
      direction = shiftKey ? Flipper.LEAF_DIRECTIONS.LEFT : Flipper.LEAF_DIRECTIONS.RIGHT;

    switch (direction) {
      case Flipper.LEAF_DIRECTIONS.RIGHT:
        this.flipperIterator.next();
        break;
      case Flipper.LEAF_DIRECTIONS.LEFT:
        this.flipperIterator.previous();
        break;
    }
  }

  /**
   * Enter press will click current item if flipper is activated
   * @param {KeyboardEvent} event
   */
  public handleEnterPress(event): void {
    if (!this._activated) {
      return;
    }

    if (this.flipperIterator.currentItem) {
      this.flipperIterator.currentItem.click();
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.callbacks && _.typeof(this.callbacks.onEnterPress) === 'function') {
      this.callbacks.onEnterPress();
    }
  }

  /**
   * drops flipper iterators cursor
   */
  public dropCursor(): void {
    this.flipperIterator.dropCursor();
  }
}

/**
 * @class FlipperIterator
 * @classdesc standalone iterator above passed similar items. Each next or previous action adds provides CSS-class
 * and sets cursor to this item
 *
 * @property {String} focusedCssClass — user-provided CSS-class name
 * @property {cursor} number — index of focused item
 * @property {HTMLElement[]} items — the list of iterable HTML-items
 */
class FlipperIterator {
  /**
   * CSS class
   */
  private focusedCssClass: string;

  /**
   * Focused button index.
   * Default is -1 which means nothing is active
   * @type {number}
   */
  private cursor: number = -1;

  /**
   * Items to flip
   */
  private items: HTMLElement[] = [];

  /**
   * @param {HTMLElement[]} nodeList
   * @param {string} focusedCssClass
   */
  constructor(
    nodeList: HTMLElement[],
    focusedCssClass: string,
  ) {
    this.items = nodeList;
    this.focusedCssClass = focusedCssClass;
  }

  /**
   * Returns Focused button Node
   * @return {HTMLElement}
   */
  public get currentItem(): HTMLElement {
    if (this.cursor === -1) {
      return null;
    }

    return this.items[this.cursor];
  }

  /**
   * Sets cursor next to the current
   */
  public next(): void {
    this.cursor = this.leafNodesAndReturnIndex(this.cursor, 'right');
  }

  /**
   * Sets cursor before current
   */
  public previous(): void {
    this.cursor = this.leafNodesAndReturnIndex(this.cursor, 'left');
  }

  /**
   * Sets cursor to the default position and removes CSS-class from previously focused item
   */
  public dropCursor(): void {
    if (this.cursor === -1) {
      return;
    }

    this.items[this.cursor].classList.remove(this.focusedCssClass);
    this.cursor = -1;
  }

  /**
   * Destroys instance properties
   */
  public destroy(): void {
    this.items = [];
    this.dropCursor();
  }

  /**
   * Leafs nodes inside the target list from active element
   *
   * @param {number} activeIndex — index of active node. By default it must be -1
   * @param {string} direction - leaf direction. Can be 'left' or 'right'
   *
   * @return {Number} index of active node
   */
  private leafNodesAndReturnIndex(
    activeIndex: number,
    direction: string,
  ): number {
    /**
     * If activeButtonIndex === -1 then we have no chosen Tool in Toolbox
     */
    if (activeIndex === -1) {
      /**
       * Normalize "previous" Tool index depending on direction.
       * We need to do this to highlight "first" Tool correctly
       *
       * Order of Tools: [0] [1] ... [n - 1]
       *   [0 = n] because of: n % n = 0 % n
       *
       * Direction 'right': for [0] the [n - 1] is a previous index
       *   [n - 1] -> [0]
       *
       * Direction 'left': for [n - 1] the [0] is a previous index
       *   [n - 1] <- [0]
       *
       * @type {number}
       */
      activeIndex = direction === 'right' ? -1 : 0;
    } else {
      /**
       * If we have chosen Tool then remove highlighting
       */
      this.items[activeIndex].classList.remove(this.focusedCssClass);
    }

    /**
     * Count index for next Tool
     */
    if (direction === 'right') {
      /**
       * If we go right then choose next (+1) Tool
       * @type {number}
       */
      activeIndex = (activeIndex + 1) % this.items.length;
    } else {
      /**
       * If we go left then choose previous (-1) Tool
       * Before counting module we need to add length before because of "The JavaScript Modulo Bug"
       * @type {number}
       */
      activeIndex = (this.items.length + activeIndex - 1) % this.items.length;
    }

    if (Dom.isNativeInput(this.items[activeIndex])) {
      /**
       * Focus input
       */
      this.items[activeIndex].focus();
    }

    /**
     * Highlight new chosen Tool
     */
    this.items[activeIndex].classList.add(this.focusedCssClass);

    /**
     * Return Active index
     */
    return activeIndex;
  }
}
