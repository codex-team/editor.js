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
  static getAnchorNode() {
    let selection = window.getSelection();

    return selection ? selection.anchorNode : null;
  }

  /**
   * Returns selection offset according to the anchor node
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
   * @return {Number|null}
   */
  static getAnchorOffset() {
    let selection = window.getSelection();

    return selection ? selection.anchorOffset : null;
  }

  /**
   * Is current selection range collapsed
   * @return {boolean|null}
   */
  static get isCollapsed() {
    let selection = window.getSelection();

    return selection ? selection.isCollapsed : null;
  }

  /**
   * Calculates position of selected text
   * @return {{x: number, y: number}}
   */
  static get getCoords() {
    let sel = document.selection, range, rect;
    let coords = {
      x: 0,
      y: 0
    };

    if (sel && sel.type !== 'Control') {
      range = sel.createRange();
      range.collapse(true);
      coords.x = range.boundingLeft;
      coords.y = range.boundingTop;

      return coords;
    }

    if (!window.getSelection) {
      _.log('Method window.getSelection is not supported', 'warn');
      return coords;
    }

    sel = window.getSelection();

    if (!sel.rangeCount) {
      _.log('Method Selection.rangeCount() is not supported', 'warn');
      return coords;
    }

    range = sel.getRangeAt(0).cloneRange();

    if (range.getClientRects) {
      range.collapse(true);

      let rects = range.getClientRects();

      if (rects.length > 0) {
        rect = rects[0];
        coords.x = rect.left;
        coords.y = rect.top;
      }
    }
    // Fall back to inserting a temporary element
    if (coords.x === 0 && coords.y === 0) {
      let span = document.createElement('span');

      if (span.getClientRects) {
        // Ensure span has dimensions and position by
        // adding a zero-width space character
        span.appendChild( document.createTextNode('\u200b') );
        range.insertNode(span);
        rect = span.getClientRects()[0];
        coords.x = rect.left;
        coords.y = rect.top;
        let spanParent = span.parentNode;

        spanParent.removeChild(span);

        // Glue any broken text nodes back together
        spanParent.normalize();
      }
    }

    return coords;
  }
}
