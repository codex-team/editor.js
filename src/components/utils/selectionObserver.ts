import EventsDispatcher from './events';
import Listeners from './listeners';
import SelectionUtils from '../selection';
import Dom from '../dom';

/**
 * Available selection events
 */
type SelectionEvents = 'change' | 'start';

/**
 * Fake pointer IDs
 */
enum FakePointerID {
  Start = 'fake-pointer-start',
  End = 'fake-pointer-end'
}

/**
 * SelectionObserver class to work with selection events
 */
class SelectionObserver extends EventsDispatcher<SelectionEvents> {
  /**
   * DOM Listeners
   */
  private readonly listeners = new Listeners();

  /**
   * Last selected range
   * @private
   */
  private lastRange: Range = null;

  /**
   * @constructor
   */
  constructor() {
    super();

    this.bindEvents();
  }

  /**
   * Restore range from fake pointer
   */
  public getSelectedRange(): Range {
    const pointerStart = Dom.get(FakePointerID.Start);
    const pointerEnd = Dom.get(FakePointerID.End);
    const range = new Range();

    if ((!pointerStart || !pointerEnd) && SelectionUtils.isAtEditor) {
      return SelectionUtils.range;
    }

    range.setStartAfter(pointerStart);
    range.setStartBefore(pointerEnd);

    return range;
  }

  /**
   * Bind selection events on document
   */
  private bindEvents(): void {
    this.listeners.on(document, 'selectionstart', () => this.onSelectionStart());
    this.listeners.on(document, 'selectionchange', () => this.onSelectionChange());
  }

  /**
   *  Selection start event handler
   */
  private onSelectionStart(): void {
    if (!SelectionUtils.isAtEditor) {
      return;
    }

    this.removeFakePointer();

    this.lastRange = SelectionUtils.range;

    this.emit('start', this.lastRange);
  }

  /**
   * Selection change event handler
   */
  private onSelectionChange() {
    if (!SelectionUtils.isAtEditor && SelectionUtils.isRangeAtEditor(this.lastRange)) {
      this.addFakePointer(this.lastRange);
    } else {
      this.removeFakePointer();
    }

    this.lastRange = SelectionUtils.range;

    this.emit('change', this.lastRange);
  }

  /**
   * Adds fake pointer to DOM
   *
   * @param range — range to fake
   */
  private addFakePointer(range: Range): void {
    this.removeFakePointer();

    const pointerStart = Dom.make('span', undefined, {
      id: FakePointerID.Start,
    });
    const pointerEnd = Dom.make('span', undefined, {
      id: FakePointerID.End,
    });

    const rangeAtStart = range.cloneRange();
    const rangeAtEnd = range.cloneRange();

    rangeAtStart.collapse(true);
    rangeAtStart.insertNode(pointerStart);

    rangeAtEnd.collapse();
    rangeAtEnd.insertNode(pointerEnd);
  }

  /**
   * Removes fake pointer from DOM
   */
  private removeFakePointer(): void {
    const pointerStart = Dom.get(FakePointerID.Start);
    const pointerEnd = Dom.get(FakePointerID.End);

    if (!pointerStart && !pointerEnd) {
      return;
    }

    const parentAtStart = pointerStart.parentNode;
    const parentAtEnd = pointerEnd.parentNode;

    pointerStart.remove();
    pointerEnd.remove();

    parentAtStart.normalize();
    parentAtEnd.normalize();
  }
}

export default new SelectionObserver();
