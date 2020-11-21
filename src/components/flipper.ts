import DomIterator from './domIterator';
import * as _ from './utils';

/**
 * Flipper construction options
 *
 * @interface FlipperOptions
 */
export interface FlipperOptions {
  /**
   * CSS-modifier for focused item
   */
  focusedItemClass?: string;

  /**
   * If flipping items are the same for all Block (for ex. Toolbox), ypu can pass it on constructing
   */
  items?: HTMLElement[];

  /**
   * Defines arrows usage. By default Flipper leafs items also via RIGHT/LEFT.
   *
   * true by default
   *
   * Pass 'false' if you don't need this behaviour
   * (for example, Inline Toolbar should be closed by arrows,
   * because it means caret moving with selection clearing)
   */
  allowArrows?: boolean;

  /**
   * Optional callback for button click
   */
  activateCallback?: (item: HTMLElement) => void;
}

/**
 * Flipper is a component that iterates passed items array by TAB or Arrows and clicks it by ENTER
 */
export default class Flipper {
  /**
   * Instance of flipper iterator
   *
   * @type {DomIterator|null}
   */
  private readonly iterator: DomIterator = null;

  /**
   * Flag that defines activation status
   *
   * @type {boolean}
   */
  private activated = false;

  /**
   * Flag that allows arrows usage to flip items
   *
   * @type {boolean}
   */
  private readonly allowArrows: boolean = true;

  /**
   * Call back for button click/enter
   */
  private readonly activateCallback: (item: HTMLElement) => void;

  /**
   * @param {FlipperOptions} options - different constructing settings
   */
  constructor(options: FlipperOptions) {
    this.allowArrows = _.isBoolean(options.allowArrows) ? options.allowArrows : true;
    this.iterator = new DomIterator(options.items, options.focusedItemClass);
    this.activateCallback = options.activateCallback;
  }

  /**
   * Array of keys (codes) that is handled by Flipper
   * Used to:
   *  - preventDefault only for this keys, not all keydowns (@see constructor)
   *  - to skip external behaviours only for these keys, when filler is activated (@see BlockEvents@arrowRightAndDown)
   */
  public static get usedKeys(): number[] {
    return [
      _.keyCodes.TAB,
      _.keyCodes.LEFT,
      _.keyCodes.RIGHT,
      _.keyCodes.ENTER,
      _.keyCodes.UP,
      _.keyCodes.DOWN,
    ];
  }

  /**
   * Active tab/arrows handling by flipper
   *
   * @param {HTMLElement[]} items - Some modules (like, InlineToolbar, BlockSettings) might refresh buttons dynamically
   */
  public activate(items?: HTMLElement[]): void {
    this.activated = true;

    if (items) {
      this.iterator.setItems(items);
    }

    /**
     * Listening all keydowns on document and react on TAB/Enter press
     * TAB will leaf iterator items
     * ENTER will click the focused item
     */
    document.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * Disable tab/arrows handling by flipper
   */
  public deactivate(): void {
    this.activated = false;
    this.dropCursor();

    document.removeEventListener('keydown', this.onKeyDown);
  }

  /**
   * Return current focused button
   *
   * @returns {HTMLElement|null}
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
   * Focuses previous flipper iterator item
   */
  public flipLeft(): void {
    this.iterator.previous();
  }

  /**
   * Focuses next flipper iterator item
   */
  public flipRight(): void {
    this.iterator.next();
  }

  /**
   * Drops flipper's iterator cursor
   *
   * @see DomIterator#dropCursor
   */
  private dropCursor(): void {
    this.iterator.dropCursor();
  }

  /**
   * KeyDown event handler
   *
   * @param event - keydown event
   */
  private onKeyDown = (event): void => {
    const isReady = this.isEventReadyForHandling(event);

    if (!isReady) {
      return;
    }

    /**
     * Prevent only used keys default behaviour
     * (allows to navigate by ARROW DOWN, for example)
     */
    if (Flipper.usedKeys.includes(event.keyCode)) {
      event.preventDefault();
    }

    switch (event.keyCode) {
      case _.keyCodes.TAB:
        this.handleTabPress(event);
        break;
      case _.keyCodes.LEFT:
      case _.keyCodes.UP:
        this.flipLeft();
        break;
      case _.keyCodes.RIGHT:
      case _.keyCodes.DOWN:
        this.flipRight();
        break;
      case _.keyCodes.ENTER:
        this.handleEnterPress(event);
        break;
    }
  };

  /**
   * This function is fired before handling flipper keycodes
   * The result of this function defines if it is need to be handled or not
   *
   * @param {KeyboardEvent} event - keydown keyboard event
   * @returns {boolean}
   */
  private isEventReadyForHandling(event: KeyboardEvent): boolean {
    const handlingKeyCodeList = [
      _.keyCodes.TAB,
      _.keyCodes.ENTER,
    ];

    const isCurrentItemIsFocusedInput = this.iterator.currentItem == document.activeElement;

    if (this.allowArrows && !isCurrentItemIsFocusedInput) {
      handlingKeyCodeList.push(
        _.keyCodes.LEFT,
        _.keyCodes.RIGHT,
        _.keyCodes.UP,
        _.keyCodes.DOWN
      );
    }

    return this.activated && handlingKeyCodeList.indexOf(event.keyCode) !== -1;
  }

  /**
   * When flipper is activated tab press will leaf the items
   *
   * @param {KeyboardEvent} event - tab keydown event
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
   * Enter press will click current item if flipper is activated
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  private handleEnterPress(event: KeyboardEvent): void {
    if (!this.activated) {
      return;
    }

    if (this.iterator.currentItem) {
      this.iterator.currentItem.click();
    }

    if (_.isFunction(this.activateCallback)) {
      this.activateCallback(this.iterator.currentItem);
    }

    event.preventDefault();
    event.stopPropagation();
  }
}
