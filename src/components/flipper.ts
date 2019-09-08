import DomIterator from './domIterator';
import _ from './utils';

/**
 * Flipper is a component that iterates passed items array by TAB or Arrows and clicks it by ENTER
 */
export default class Flipper {
  /**
   * Instance of flipper iterator
   * @type {DomIterator|null}
   */
  private iterator: DomIterator = null;

  /**
   * Flag that defines activation status
   * @type {boolean}
   */
  private activated: boolean = false;

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
    this.iterator = new DomIterator(nodeList, focusedCssClass);

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
   * Active tab/arrows handling by flipper
   * @param {HTMLElement[]} items - Some modules (like, InlineToolbar, BlockSettings) might refresh buttons dynamically
   */
  public activate(items?: HTMLElement[]): void {
    this.activated = true;

    if (items) {
      this.iterator.setItems(items);
    }
  }

  /**
   * Disable tab/arrows handling by flipper
   */
  public deactivate(): void {
    this.activated = false;
    this.dropCursor();
  }

  /**
   * Return current focused button
   * @return {HTMLElement|null}
   */
  public get currentItem(): HTMLElement|null {
    return this.iterator.currentItem;
  }

  /**
   * Focus first item
   */
  public focusFirst(): void {
    this.dropCursor();
    this.flipRight();
  }

  /**
   * Drops flipper's iterator cursor
   * @see DomIterator#dropCursor
   */
  private dropCursor(): void {
    this.iterator.dropCursor();
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

    if (!this.activated || handlingKeyCodeList.indexOf(event.keyCode) === -1) {
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
      direction = shiftKey ? DomIterator.directions.LEFT : DomIterator.directions.RIGHT;

    switch (direction) {
      case DomIterator.directions.RIGHT:
        this.flipRight();
        break;
      case DomIterator.directions.LEFT:
        this.flipLeft();
        break;
    }
  }

  /**
   * Focuses previous flipper iterator item
   */
  private flipLeft(): void {
    this.iterator.previous();
  }

  /**
   * Focuses next flipper iterator item
   */
  private flipRight(): void {
    this.iterator.next();
  }

  /**
   * Enter press will click current item if flipper is activated
   * @param {KeyboardEvent} event
   */
  private handleEnterPress(event: KeyboardEvent): void {
    if (!this.activated) {
      return;
    }

    if (this.iterator.currentItem) {
      this.iterator.currentItem.click();
    }

    event.preventDefault();
    event.stopPropagation();
  }
}
