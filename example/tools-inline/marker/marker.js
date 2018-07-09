/**
 * @todo remove wrapper if selection () inside it:
 *       s([ample tex])t -> sample text
 *       s[ampl(e t)ex]t -> s[ampl]e t[ex]t       @todo create splitter
 *       s(ampl[e t]ex)t -> s[ampl[e t]ex]t       do not remove wrapper
 *       s([ampl]e t[ex])t -> s[[ampl]e t[ex]]t   do not remove wrapper
 *
 * @todo process cross-tag wrapping []:
 *       sam[ple <b>te]xt</b> -> sam[ple ]<b>[te]xt</b>
 *
 * @todo create optimizer:
 *       sa[mple t][ex]t -> sa[mple tex]t
 *       sa[mpl[e t]ex]t -> sa[mple tex]t
 *       @see https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer
 *
 * @todo save selection after clicking on tool
 */

class Marker {
  constructor(api) {
    this.api = api;
    console.log(this.api);

    this.button = null;
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

    if (state) {
      console.log('range', range);
      console.log('state', state);

      /** @todo remove highlighting */

      // /**
      //  *
      //  */
      // if (range.startContainer === range.endContainer) {
      //   /**
      //    * @todo remove whole wrapper not class
      //    */
      //   state.classList.remove(this.CSS);
      // }
    } else {
      let span = document.createElement('SPAN');

      span.classList.add(this.CSS);
      range.surroundContents(span);
      range.selectNode(span);
    }
  }

  checkState(selection) {
    const markerTag = this.api.selection.findParentTag('SPAN', this.CSS);

    this.button.classList.toggle('ce-inline-tool--active', !!markerTag);

    return markerTag;
  }
}
