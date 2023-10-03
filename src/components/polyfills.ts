'use strict';

/**
 * Extend Element interface to include prefixed and experimental properties
 */
interface Element {
  matchesSelector: (selector: string) => boolean;
  mozMatchesSelector: (selector: string) => boolean;
  msMatchesSelector: (selector: string) => boolean;
  oMatchesSelector: (selector: string) => boolean;

  prepend: (...nodes: Array<string | Node>) => void;
  append: (...nodes: Array<string | Node>) => void;
}

/**
 * The Element.matches() method returns true if the element
 * would be selected by the specified selector string;
 * otherwise, returns false.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill}
 * @param {string} s - selector
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s): boolean {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      let i = matches.length;

      while (--i >= 0 && matches.item(i) !== this) {
      }

      return i > -1;
    };
}

/**
 * The Element.closest() method returns the closest ancestor
 * of the current element (or the current element itself) which
 * matches the selectors given in parameter.
 * If there isn't such an ancestor, it returns null.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill}
 * @param {string} s - selector
 */
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s): Element | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let el = this;

    if (!document.documentElement.contains(el)) {
      return null;
    }

    do {
      if (el.matches(s)) {
        return el;
      }

      el = el.parentElement || el.parentNode;
    } while (el !== null);

    return null;
  };
}

/**
 * The ParentNode.prepend method inserts a set of Node objects
 * or DOMString objects before the first child of the ParentNode.
 * DOMString objects are inserted as equivalent Text nodes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend#Polyfill}
 * @param {Node | Node[] | string | string[]} nodes - nodes to prepend
 */
if (!Element.prototype.prepend) {
  Element.prototype.prepend = function prepend(nodes: Array<Node | string> | Node | string): void {
    const docFrag = document.createDocumentFragment();

    if (!Array.isArray(nodes)) {
      nodes = [ nodes ];
    }

    nodes.forEach((node: Node | string) => {
      const isNode = node instanceof Node;

      docFrag.appendChild(isNode ? node as Node : document.createTextNode(node as string));
    });

    this.insertBefore(docFrag, this.firstChild);
  };
}

interface Element {
  /**
   * Scrolls the current element into the visible area of the browser window
   *
   * @param centerIfNeeded - true, if the element should be aligned so it is centered within the visible area of the scrollable ancestor.
   */
  scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
}

/**
 * ScrollIntoViewIfNeeded polyfill by KilianSSL (forked from hsablonniere)
 *
 * @see {@link https://gist.github.com/KilianSSL/774297b76378566588f02538631c3137}
 * @param centerIfNeeded - true, if the element should be aligned so it is centered within the visible area of the scrollable ancestor.
 */
if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded): void {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

    const parent = this.parentNode,
        parentComputedStyle = window.getComputedStyle(parent, null),
        parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
        parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
        overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
        overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
        overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
        alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop);
    }
  };
}

/**
 * RequestIdleCallback polyfill (shims)
 *
 * @see https://developer.chrome.com/blog/using-requestidlecallback/
 * @param cb - callback to be executed when the browser is idle
 */
window.requestIdleCallback = window.requestIdleCallback || function (cb) {
  const start = Date.now();

  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
  clearTimeout(id);
};
