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
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill}
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
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
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill}
 */
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
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
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend#Polyfill}
 */
if (!Element.prototype.prepend) {
  Element.prototype.prepend = function prepend(nodes: Node|Node[]|any) {
    const docFrag = document.createDocumentFragment();

    if (!Array.isArray(nodes)) {
      nodes = [ nodes ];
    }

    nodes.forEach((node: Node|any) => {
      const isNode = node instanceof Node;

      docFrag.appendChild(isNode ? node : document.createTextNode(String(node)));
    });

    this.insertBefore(docFrag, this.firstChild);
  };
}
