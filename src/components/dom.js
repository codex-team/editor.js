/**
 * DOM manipulations helper
 */
export default class Dom {
  /**
   * Check if passed tag has no closed tag
   * @param  {Element}  tag
   * @return {Boolean}
   */
  static isSingleTag(tag) {
    return tag.tagName && ['AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'].includes(tag.tagName);
  };


  /**
   * Helper for making Elements with classname and attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  static make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if( classNames ) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Creates Text Node with the passed content
   * @param {String} content - text content
   * @return {Text}
   */
  static text(content) {
    return document.createTextNode(content);
  }

  /**
   * Creates SVG icon linked to the sprite
   * @param {string} name - name (id) of icon from sprite
   * @param {number} width
   * @param {number} height
   * @return {SVGElement}
   */
  static svg(name, width = 14, height = 14) {
    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.classList.add('icon', 'icon--' + name);
    icon.setAttribute('width', width + 'px');
    icon.setAttribute('height', height + 'px');
    icon.innerHTML = `<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${name}"></use>`;

    return icon;
  }

  /**
   * Append one or several elements to the parent
   *
   * @param  {Element} parent    - where to append
   * @param  {Element|Element[]} - element ore elements list
   */
  static append(parent, elements) {
    if ( Array.isArray(elements) ) {
      elements.forEach( el => parent.appendChild(el) );
    } else {
      parent.appendChild(elements);
    }
  }

  /**
   * Swap two elements in parent
   * @param {HTMLElement} el1 - from
   * @param {HTMLElement} el2 - to
   */
  static swap(el1, el2) {
    // create marker element and insert it where el1 is
    const temp = document.createElement('div'),
      parent = el1.parentNode;

    parent.insertBefore(temp, el1);

    // move el1 to right before el2
    parent.insertBefore(el1, el2);

    // move el2 to right before where el1 used to be
    parent.insertBefore(el2, temp);

    // remove temporary marker node
    parent.removeChild(temp);
  }

  /**
   * Selector Decorator
   *
   * Returns first match
   *
   * @param {Element} el - element we searching inside. Default - DOM Document
   * @param {String} selector - searching string
   *
   * @returns {Element}
   */
  static find(el = document, selector) {
    return el.querySelector(selector);
  }

  /**
   * Selector Decorator.
   *
   * Returns all matches
   *
   * @param {Element} el - element we searching inside. Default - DOM Document
   * @param {String} selector - searching string
   * @returns {NodeList}
   */
  static findAll(el = document, selector) {
    return el.querySelectorAll(selector);
  }

  /**
   * Search for deepest node which is Leaf.
   * Leaf is the vertex that doesn't have any child nodes
   *
   * @description Method recursively goes throw the all Node until it finds the Leaf
   *
   * @param {Node} node - root Node. From this vertex we start Deep-first search {@link https://en.wikipedia.org/wiki/Depth-first_search}
   * @param {Boolean} atLast - find last text node
   * @return {Node} - it can be text Node or Element Node, so that caret will able to work with it
   */
  static getDeepestNode(node, atLast = false) {
    /**
     * Current function have two directions:
     *  - starts from first child and every time gets first or nextSibling in special cases
     *  - starts from last child and gets last or previousSibling
     * @type {string}
     */
    let child = atLast ? 'lastChild' : 'firstChild',
      sibling = atLast ? 'previousSibling' : 'nextSibling';

    if (node && node.nodeType === Node.ELEMENT_NODE && node[child]) {
      let nodeChild = node[child];

      /**
       * special case when child is single tag that can't contain any content
       */
      if (Dom.isSingleTag(nodeChild) && !Dom.isNativeInput(nodeChild)) {
        /**
         * 1) We need to check the next sibling. If it is Node Element then continue searching for deepest
         * from sibling
         *
         * 2) If single tag's next sibling is null, then go back to parent and check his sibling
         * In case of Node Element continue searching
         *
         * 3) If none of conditions above happened return parent Node Element
         */
        if (nodeChild[sibling]) {
          nodeChild = nodeChild[sibling];
        } else if (nodeChild.parentNode[sibling]) {
          nodeChild = nodeChild.parentNode[sibling];
        } else {
          return nodeChild.parentNode;
        }
      }

      return this.getDeepestNode(nodeChild, atLast);
    }

    return node;
  }

  /**
   * Check if object is DOM node
   *
   * @param {Object} node
   * @returns {boolean}
   */
  static isElement(node) {
    return node && typeof node === 'object' && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
  }

  /**
   * Check if object is DocumentFragmemt node
   *
   * @param {Object} node
   * @returns {boolean}
   */
  static isFragment(node) {
    return node && typeof node === 'object' && node.nodeType && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }

  /**
   * Checks target if it is native input
   * @param {Element|String|Node} target - HTML element or string
   * @return {Boolean}
   */
  static isNativeInput(target) {
    let nativeInputs = [
      'INPUT',
      'TEXTAREA'
    ];

    return target ? nativeInputs.includes(target.tagName) : false;
  }

  /**
   * Checks node if it is empty
   *
   * @description Method checks simple Node without any childs for emptiness
   * If you have Node with 2 or more children id depth, you better use {@link Dom#isEmpty} method
   *
   * @param {Node} node
   * @return {Boolean} true if it is empty
   */
  static isNodeEmpty(node) {
    let nodeText;

    if ( this.isElement(node) && this.isNativeInput(node) ) {
      nodeText = node.value;
    } else {
      nodeText = node.textContent.replace('\u200B', '');
    }

    return nodeText.trim().length === 0;
  }

  /**
   * checks node if it is doesn't have any child nodes
   * @param {Node} node
   * @return {boolean}
   */
  static isLeaf(node) {
    if (!node) {
      return false;
    }

    return node.childNodes.length === 0;
  }

  /**
   * breadth-first search (BFS)
   * {@link https://en.wikipedia.org/wiki/Breadth-first_search}
   *
   * @description Pushes to stack all DOM leafs and checks for emptiness
   *
   * @param {Node} node
   * @return {boolean}
   */
  static isEmpty(node) {
    let treeWalker = [],
      leafs = [];

    if (!node) {
      return true;
    }

    if (!node.childNodes.length) {
      return this.isNodeEmpty(node);
    }

    treeWalker.push(node.firstChild);

    while ( treeWalker.length > 0 ) {
      node = treeWalker.shift();

      if (!node) continue;

      if ( this.isLeaf(node) ) {
        leafs.push(node);
      } else {
        treeWalker.push(node.firstChild);
      }

      while ( node && node.nextSibling ) {
        node = node.nextSibling;

        if (!node) continue;

        treeWalker.push(node);
      }

      /**
       * If one of childs is not empty, checked Node is not empty too
       */
      if (node && !this.isNodeEmpty(node)) {
        return false;
      }
    }

    return leafs.every( leaf => this.isNodeEmpty(leaf) );
  }

  /**
   * Check if string contains html elements
   *
   * @param string
   * @returns {boolean}
   */
  static isHTMLString(string) {
    const wrapper = Dom.make('div');

    wrapper.innerHTML = string;

    return wrapper.childElementCount > 0;
  }

  /**
   * Return array of names of block html elements
   *
   * @returns {string[]}
   */
  static get blockElements() {
    return [
      'address',
      'article',
      'aside',
      'blockquote',
      'canvas',
      'div',
      'dl',
      'dt',
      'fieldset',
      'figcaption',
      'figure',
      'footer',
      'form',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'header',
      'hgroup',
      'hr',
      'li',
      'main',
      'nav',
      'noscript',
      'ol',
      'output',
      'p',
      'pre',
      'ruby',
      'section',
      'table',
      'tr',
      'tfoot',
      'ul',
      'video'
    ];
  }
};
