import Dom from './dom';

/**
 * Iterator above passed Elements list.
 * Each next or previous action adds provides CSS-class and sets cursor to this item
 */
export default class DomIterator {
  /**
   * This is a static property that defines iteration directions
   * @type {{RIGHT: string, LEFT: string}}
   */
  public static directions = {
    RIGHT: 'right',
    LEFT: 'left',
  };

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
    this.items = nodeList || [];
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
    this.cursor = this.leafNodesAndReturnIndex(DomIterator.directions.RIGHT);
  }

  /**
   * Sets cursor before current
   */
  public previous(): void {
    this.cursor = this.leafNodesAndReturnIndex(DomIterator.directions.LEFT);
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
    /**
     * if items are empty then there is nothing to leaf
     */
    if (this.items.length === 0) {
      return this.cursor;
    }

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
      focusedButtonIndex = direction === DomIterator.directions.RIGHT ? -1 : 0;
    } else {
      /**
       * If we have chosen Tool then remove highlighting
       */
      this.items[focusedButtonIndex].classList.remove(this.focusedCssClass);
    }

    /**
     * Count index for next Tool
     */
    if (direction === DomIterator.directions.RIGHT) {
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
