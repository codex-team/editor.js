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
   * Optional callback for button click
   */
  activateCallback?: (item: HTMLElement) => void;

  /**
   * List of keys allowed for handling.
   * Can include codes of the following keys:
   *  - Tab
   *  - Enter
   *  - Arrow up
   *  - Arrow down
   *  - Arrow right
   *  - Arrow left
   * If not specified all keys are enabled
   */
  allowedKeys?: number[];
}

/**
 * Flipper is a component that iterates passed items array by TAB or Arrows and clicks it by ENTER
 */
export default class Flipper {
  /**
   * True if flipper is currently activated
   */
  public get isActivated(): boolean {
    return this.activated;
  }

  /**
   * Instance of flipper iterator
   */
  private readonly iterator: DomIterator | null = null;

  /**
   * Flag that defines activation status
   */
  private activated = false;

  /**
   * List codes of the keys allowed for handling
   */
  private readonly allowedKeys: number[];

  /**
   * Call back for button click/enter
   */
  private readonly activateCallback: (item: HTMLElement) => void;

  /**
   * Contains list of callbacks to be executed on each flip
   */
  private flipCallbacks: Array<() => void> = [];

  /**
   * @param options - different constructing settings
   */
  constructor(options: FlipperOptions) {
    this.iterator = new DomIterator(options.items, options.focusedItemClass);
    this.activateCallback = options.activateCallback;
    this.allowedKeys = options.allowedKeys || Flipper.usedKeys;
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
   * @param items - Some modules (like, InlineToolbar, BlockSettings) might refresh buttons dynamically
   * @param cursorPosition - index of the item that should be focused once flipper is activated
   */
  public activate(items?: HTMLElement[], cursorPosition?: number): void {
    this.activated = true;
    if (items) {
      this.iterator.setItems(items);
    }

    if (cursorPosition !== undefined) {
      this.iterator.setCursor(cursorPosition);
    }

    /**
     * Listening all keydowns on document and react on TAB/Enter press
     * TAB will leaf iterator items
     * ENTER will click the focused item
     *
     * Note: the event should be handled in capturing mode on following reasons:
     * - prevents plugins inner keydown handlers from being called while keyboard navigation
     * - otherwise this handler will be called at the moment it is attached which causes false flipper firing (see https://techread.me/js-addeventlistener-fires-for-past-events/)
     */
    document.addEventListener('keydown', this.onKeyDown, true);
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
    this.flipCallback();
  }

  /**
   * Focuses next flipper iterator item
   */
  public flipRight(): void {
    this.iterator.next();
    this.flipCallback();
  }

  /**
   * Return true if some button is focused
   */
  public hasFocus(): boolean {
    return !!this.iterator.currentItem;
  }

  /**
   * Registeres function that should be executed on each navigation action
   *
   * @param cb - function to execute
   */
  public onFlip(cb: () => void): void {
    this.flipCallbacks.push(cb);
  }

  /**
   * Unregisteres function that is executed on each navigation action
   *
   * @param cb - function to stop executing
   */
  public removeOnFlip(cb: () => void): void {
    this.flipCallbacks = this.flipCallbacks.filter(fn => fn !== cb);
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
    return this.activated && this.allowedKeys.includes(event.keyCode);
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
      /**
       * Stop Enter propagation only if flipper is ready to select focused item
       */
      event.stopPropagation();
      event.preventDefault();
      this.iterator.currentItem.click();
    }

    if (_.isFunction(this.activateCallback)) {
      this.activateCallback(this.iterator.currentItem);
    }
  }

  /**
   * Fired after flipping in any direction
   */
  private flipCallback(): void {
    if (this.iterator.currentItem) {
      this.iterator.currentItem.scrollIntoViewIfNeeded();
    }

    this.flipCallbacks.forEach(cb => cb());
  }
}
