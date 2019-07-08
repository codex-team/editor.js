import Dom from './dom';
import _ from './utils';

/**
 * Flipper
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
  private activated: boolean = false;

  /**
   * Anys
   */
  private callbacks: any;

  /**
   * @constructor
   */
  constructor(
    nodeList: HTMLElement[],
    focusedCssClass: string,
    callbacks: object = {},
  ) {
    this.callbacks = callbacks;
    this.flipperIterator = new FlipperIterator(nodeList, focusedCssClass);

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
   * @param value
   */
  public set activate(value) {
    this.activated = value;
  }

  /**
   * @return {HTMLElement}
   */
  public get currentItem(): HTMLElement {
    return this.flipperIterator.currentItem;
  }

  /**
   * @param event
   */
  public handleTabPress(event) {
    if (!this.activated) {
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
   * @param event
   */
  public handleEnterPress(event) {
    if (!this.activated) {
      return;
    }

    if (this.flipperIterator.currentItem) {
      this.flipperIterator.currentItem.click();
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.callbacks && _.typeof(this.callbacks) === 'Function') {
      this.callbacks.onEnterPress(event);
    }
  }

  /**
   * drops flipper iterators cursor
   */
  public dropCursor(): void {
    this.flipperIterator.dropCursor();
  }
}

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
   * Drops cursor
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
