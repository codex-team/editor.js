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

class Marker {
  constructor(api) {
    this.api = api;

    this.button = null;
    this.TAG = 'SPAN';
    this.CSS = 'marked';
  }

  static get isInline() {
    return true;
  }

  render() {
    this.button = document.createElement('button');
    this.button.innerText = 'HL';
    this.button.classList.add('ce-inline-tool');

    return this.button;
  }

  surround(range) {
    if (!range) {
      return;
    }

    let state = this.checkState();

    /**
     * If start or end of selection is in the highlighted block
     */
    if (state) {
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

  checkState(selection) {
    const markerTag = this.api.selection.findParentTag(this.TAG, this.CSS);

    this.button.classList.toggle('ce-inline-tool--active', !!markerTag);

    return markerTag;
  }
}
