/**
 * @todo remove wrapper if selection () inside it:
 *   [x] s[(ample tex)]t -> sample text
 *   [x] s[ampl(e t)ex]t -> sample text
 *   (?) s[ampl(e t)ex]t -> s[ampl]e t[ex]t       @todo create splitter
 *   [x] s(ampl[e t]ex)t -> s[ampl[e t]ex]t       add remove wrapper
 *   [ ] s[(ampl]e t[ex)]t -> s[[ampl]e t[ex]]t   add wrapper
 *
 * @todo process cross-tag wrapping []:
 *       sam[ple <b>te]xt</b> -> sam[ple ]<b>[te]xt</b>
 *
 * @todo create optimizer:
 *       sa[mple t][ex]t -> sa[mple tex]t
 *       sa[mpl[e t]ex]t -> sa[mple tex]t
 *       @see https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer
 */

// @todo add description
class Term {
  constructor(api) {
    this.api = api;

    this.button = null;
    this.TAG = 'SPAN';
    this.CSS = 'marked';

    // @todo move this classes to api
    this.ICON_CLASSES = {
      default: 'ce-inline-tool',
      active: 'ce-inline-tool--active'
    };
  }

  // @todo add description
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

    this.button.innerText = '<>'; // @todo change to SVG icon

    this.button.classList.add(this.ICON_CLASSES.default);

    return this.button;
  }

  /**
   * Process selected fragment
   *
   * @param {Range} range
   */
  surround(range) {
    if (!range) {
      return;
    }

    console.log(range);


    let state = this.api.selection.findParentTag(this.TAG, this.CSS);
    console.log(state);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (state) {
      // @todo create "unwrap" function
      /**
       * Expand selection
       */
      this.api.selection.expandToTag(state);

      /**
       * Remove wrapper
       */
      state.outerHTML = state.innerHTML;

      // @todo save selection on the text
    } else {
      // @todo create "wrap" function
      /**
       * Create a wrapper for highlighting
       */
      let span = document.createElement(this.TAG);

      span.classList.add(this.CSS);

      /**
       * Wrap text with wrapper tag
       */
      range.surroundContents(span);

      /**
       * Expand (add) selection to highlighted block
       */
      this.api.selection.expandToTag(span);
    }
  }

  /**
   * Check and change Term's state for current selection
   *
   * @param {Selection} selection
   */
  checkState(selection) {
    const termTag = this.api.selection.findParentTag(this.TAG, this.CSS);
                                      // @todo pass selection to this function

    this.button.classList.toggle(this.ICON_CLASSES.active, !!termTag);
  }
}
