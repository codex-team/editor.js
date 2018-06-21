/**
 * Working with selection
 * @typedef {Selection} Selection
 */
export default class Selection {
  /**
   * @constructor
   */
  constructor() {
    this.instance = null;
    this.selection = null;
  }

  /**
   * Returns window Selection
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Window/getSelection}
   * @return {Selection}
   */
  static get() {
    return window.getSelection();
  }

  /**
   * Returns selected anchor
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorNode}
   * @return {Node|null}
   */
  static get anchorNode() {
    const selection = window.getSelection();

    return selection ? selection.anchorNode : null;
  }

  /**
   * Returns selection offset according to the anchor node
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
   * @return {Number|null}
   */
  static get anchorOffset() {
    const selection = window.getSelection();

    return selection ? selection.anchorOffset : null;
  }

  /**
   * Is current selection range collapsed
   * @return {boolean|null}
   */
  static get isCollapsed() {
    const selection = window.getSelection();

    return selection ? selection.isCollapsed : null;
  }

  /**
   * Return first range
   * @return {Range|null}
   */
  static get range() {
    const selection = window.getSelection();

    return selection ? selection.getRangeAt(0) : null;
  }

  /**
   * Calculates position and size of selected text
   * @return {{x, y, width, height, top?, left?, bottom?, right?}}
   */
  static get rect() {
    let sel = document.selection, range;
    let rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    if (sel && sel.type !== 'Control') {
      range = sel.createRange();
      rect.x = range.boundingLeft;
      rect.y = range.boundingTop;
      rect.width = range.boundingWidth;
      rect.height = range.boundingHeight;

      return rect;
    }

    if (!window.getSelection) {
      _.log('Method window.getSelection is not supported', 'warn');
      return rect;
    }

    sel = window.getSelection();

    if (!sel.rangeCount) {
      _.log('Method Selection.rangeCount() is not supported', 'warn');
      return rect;
    }

    range = sel.getRangeAt(0).cloneRange();

    if (range.getBoundingClientRect) {
      rect = range.getBoundingClientRect();
    }
    // Fall back to inserting a temporary element
    if (rect.x === 0 && rect.y === 0) {
      let span = document.createElement('span');

      if (span.getBoundingClientRect) {
        // Ensure span has dimensions and position by
        // adding a zero-width space character
        span.appendChild( document.createTextNode('\u200b') );
        range.insertNode(span);
        rect = span.getBoundingClientRect();

        let spanParent = span.parentNode;

        spanParent.removeChild(span);

        // Glue any broken text nodes back together
        spanParent.normalize();
      }
    }

    return rect;
  }

  /**
   * Returns selected text as String
   * @returns {string}
   */
  static get text() {
    return window.getSelection ? window.getSelection().toString() : '';
  };
}
