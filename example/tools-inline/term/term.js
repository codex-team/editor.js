/**
 * Term plugin for the CodeX Editor
 *
 * Allows to wrap inline fragment and style it somehow.
 */
class Term {
  /**
   * @param {object} api - CodeX Editor API
   */
  constructor(api) {
    this.api = api;

    /**
     * Toolbar Button
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     * @type {string}
     */
    this.tag = 'SPAN';

    /**
     * Class name for term-tag
     * @type {string}
     */
    this.CSS = 'marked';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: 'ce-inline-tool',
      term: 'ce-term-tool__icon',
      active: 'ce-term-tool__icon--active'
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.classList.add(this.iconClasses.base, this.iconClasses.term);

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, this.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    let span = document.createElement(this.tag);

    span.classList.add(this.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     * // range.surroundContents(span);
     */
    span.appendChild(range.extractContents());
    range.insertNode(span);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(span);
  }

  /**
   * Unwrap term-tag
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, this.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }
}
