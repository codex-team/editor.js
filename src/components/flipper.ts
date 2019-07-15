import Dom from './dom';
import _ from './utils';

/**
 * Flipper is a component that iterates passed items array by TAB or Arrows and clicks it by ENTER
 */
export default class Flipper {
  /**
   * This is a static property that defines flipping direction
   * @type {{RIGHT: string, LEFT: string}}
   */
  public static LEAF_DIRECTIONS = {
    RIGHT: 'right',
    LEFT: 'left',
  };

  /**
   * Instance of flipper iterator
   * @type {FlipperIterator|null}
   */
  private flipperIterator: FlipperIterator = null;

  /**
   * Flag that defines activation status
   * @type {boolean}
   */
  private _activated: boolean = false;

  /**
   * Flag that allows arrows usage to flip items
   * @type {boolean}
   */
  private allowArrows: boolean = true;

  /**
   * @constructor
   *
   * @param {HTMLElement[]} nodeList - The list of iterable HTML-items
   * @param {string} focusedCssClass - CSS class name that will be set when item is focused
   * @param {boolean} allowArrows - Defines arrows usage. By default Flipper leafs items also via RIGHT/LEFT.
   *                                Pass 'false' if you don't need this behaviour
   *                                (for example, Inline Toolbar should be closed by arrows,
   *                                because it means caret moving with selection clearing)
   */
  constructor(
    nodeList: HTMLElement[],
    focusedCssClass: string,
    allowArrows: boolean = true,
  ) {
    this.allowArrows = allowArrows;
    this.flipperIterator = new FlipperIterator(nodeList, focusedCssClass);

    /**
     * Listening all keydowns on document and react on TAB/Enter press
     * TAB will leaf iterator items
     * ENTER will click the focused item
     */
    document.addEventListener('keydown', (event) => {
      const isReady = this.isEventReadyForHandling(event);

      if (!isReady) {
        return;
      }

      event.preventDefault();

      switch (event.keyCode) {
        case _.keyCodes.TAB:
          this.handleTabPress(event);
          break;
        case _.keyCodes.LEFT:
          this.flipLeft();
          break;
        case _.keyCodes.RIGHT:
          this.flipRight();
          break;
        case _.keyCodes.ENTER:
          this.handleEnterPress(event);
          break;
      }
    }, false);
  }

  /**
   * Blocks flipping handlers.
   * When you do not need keyCodes to be handles set activated state `false`
   * @param {Boolean} value
   */
  public set activated(value) {
    this._activated = value;
  }

  /**
   * Return current focused button
   * @return {HTMLElement|null}
   */
  public get currentItem(): HTMLElement|null {
    return this.flipperIterator.currentItem;
  }

  /**
   * Updates flipper iterators iterable list
   * Some modules (like, InlineToolbar, BlockSettings) might refresh tools dynamically
   * @param {HTMLElement[]} nodeList
   */
  public updateItems(nodeList: HTMLElement[]): void {
    this.flipperIterator.setItems(nodeList);
  }

  /**
   * Drops flipper's iterator cursor
   * @see FlipperIterator#dropCursor
   */
  public dropCursor(): void {
    this.flipperIterator.dropCursor();
  }

  /**
   * This function is fired before handling flipper keycodes
   * The result of this function defines if it is need to be handled or not
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  private isEventReadyForHandling(event: KeyboardEvent): boolean {
    const handlingKeyCodeList = [
      _.keyCodes.TAB,
      _.keyCodes.ENTER,
    ];

    if (this.allowArrows) {
      handlingKeyCodeList.push(
        _.keyCodes.LEFT,
        _.keyCodes.RIGHT,
      );
    }

    if (!this._activated || handlingKeyCodeList.indexOf(event.keyCode) === -1) {
      return false;
    }

    return true;
  }

  /**
   * When flipper is activated tab press will leaf the items
   * @param {KeyboardEvent} event
   */
  private handleTabPress(event: KeyboardEvent): void {
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
   * Focuses previous flipper iterator item
   */
  private flipLeft(): void {
    this.flipperIterator.previous();
  }

  /**
   * Focuses next flipper iterator item
   */
  private flipRight(): void {
    this.flipperIterator.next();
  }

  /**
   * Enter press will click current item if flipper is activated
   * @param {KeyboardEvent} event
   */
  private handleEnterPress(event: KeyboardEvent): void {
    if (!this._activated) {
      return;
    }

    if (this.flipperIterator.currentItem) {
      this.flipperIterator.currentItem.click();
    }

    event.preventDefault();
    event.stopPropagation();
  }
}

/**
 * Standalone iterator above passed similar items.
 * Each next or previous action adds provides CSS-class and sets cursor to this item
 */
class FlipperIterator { // tslint:disable-line max-classes-per-file
  /**
   * User-provided CSS-class name for focused button
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
   * @param {HTMLElement[]} nodeList — the list of iterable HTML-items
   * @param {string} focusedCssClass - user-provided CSS-class that will be set in flipping process
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
   * Sets items. Can be used when iterable items changed dynamically
   * @param {HTMLElement[]} nodeList
   */
  public setItems(nodeList: HTMLElement[]): void {
    this.items = nodeList;
  }

  /**
   * Sets cursor next to the current
   */
  public next(): void {
    this.cursor = this.leafNodesAndReturnIndex(Flipper.LEAF_DIRECTIONS.RIGHT);
  }

  /**
   * Sets cursor before current
   */
  public previous(): void {
    this.cursor = this.leafNodesAndReturnIndex(Flipper.LEAF_DIRECTIONS.LEFT);
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
   * Leafs nodes inside the target list from active element
   *
   * @param {string} direction - leaf direction. Can be 'left' or 'right'
   * @return {Number} index of focused node
   */
  private leafNodesAndReturnIndex(direction: string): number {
    let focusedButtonIndex = this.cursor;

    /**
     * If activeButtonIndex === -1 then we have no chosen Tool in Toolbox
     */
    if (focusedButtonIndex === -1) {
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
      focusedButtonIndex = direction === 'right' ? -1 : 0;
    } else {
      /**
       * If we have chosen Tool then remove highlighting
       */
      this.items[focusedButtonIndex].classList.remove(this.focusedCssClass);
    }

    /**
     * Count index for next Tool
     */
    if (direction === 'right') {
      /**
       * If we go right then choose next (+1) Tool
       * @type {number}
       */
      focusedButtonIndex = (focusedButtonIndex + 1) % this.items.length;
    } else {
      /**
       * If we go left then choose previous (-1) Tool
       * Before counting module we need to add length before because of "The JavaScript Modulo Bug"
       * @type {number}
       */
      focusedButtonIndex = (this.items.length + focusedButtonIndex - 1) % this.items.length;
    }

    if (Dom.isNativeInput(this.items[focusedButtonIndex])) {
      /**
       * Focus input
       */
      this.items[focusedButtonIndex].focus();
    }

    /**
     * Highlight new chosen Tool
     */
    this.items[focusedButtonIndex].classList.add(this.focusedCssClass);

    /**
     * Return focused button's index
     */
    return focusedButtonIndex;
  }
}
