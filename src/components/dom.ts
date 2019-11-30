/**
 * DOM manipulations helper
 */
export default class Dom {
  /**
   * Check if passed tag has no closed tag
   * @param  {HTMLElement}  tag
   * @return {Boolean}
   */
  public static isSingleTag(tag: HTMLElement): boolean {
    return tag.tagName && [
      'AREA',
      'BASE',
      'BR',
      'COL',
      'COMMAND',
      'EMBED',
      'HR',
      'IMG',
      'INPUT',
      'KEYGEN',
      'LINK',
      'META',
      'PARAM',
      'SOURCE',
      'TRACK',
      'WBR',
    ].includes(tag.tagName);
  }

  /**
   * Check if element is BR or WBR
   *
   * @param {HTMLElement} element
   * @return {boolean}
   */
  public static isLineBreakTag(element: HTMLElement) {
    return element && element.tagName && [
      'BR',
      'WBR',
    ].includes(element.tagName);
  }

  /**
   * Helper for making Elements with classname and attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {HTMLElement}
   */
  public static make(tagName: string, classNames: string|string[] = null, attributes: object = {}): HTMLElement {
    const el = document.createElement(tagName);

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if ( classNames ) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      if (attributes.hasOwnProperty(attrName)) {
        el[attrName] = attributes[attrName];
      }
    }

    return el;
  }

  /**
   * Creates Text Node with the passed content
   * @param {String} content - text content
   * @return {Text}
   */
  public static text(content: string): Text {
    return document.createTextNode(content);
  }

  /**
   * Creates SVG icon linked to the sprite
   * @param {string} name - name (id) of icon from sprite
   * @param {number} width
   * @param {number} height
   * @return {SVGElement}
   */
  public static svg(name: string, width: number = 14, height: number = 14): SVGElement {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.classList.add('icon', 'icon--' + name);
    icon.setAttribute('width', width + 'px');
    icon.setAttribute('height', height + 'px');
    icon.innerHTML = `<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${name}"></use>`;

    return icon;
  }

  /**
   * Append one or several elements to the parent
   *
   * @param  {Element|DocumentFragment} parent    - where to append
   * @param  {Element|Element[]|Text|Text[]} elements - element or elements list
   */
  public static append(
    parent: Element|DocumentFragment,
    elements: Element|Element[]|DocumentFragment|Text|Text[],
  ): void {
    if ( Array.isArray(elements) ) {
      elements.forEach( (el) => parent.appendChild(el) );
    } else {
      parent.appendChild(elements);
    }
  }

  /**
   * Append element or a couple to the beginning of the parent elements
   *
   * @param {Element} parent - where to append
   * @param {Element|Element[]} elements - element or elements list
   */
  public static prepend(parent: Element, elements: Element|Element[]): void {
    if ( Array.isArray(elements) ) {
      elements = elements.reverse();
      elements.forEach( (el) => parent.prepend(el) );
    } else {
      parent.prepend(elements);
    }
  }

  /**
   * Swap two elements in parent
   * @param {HTMLElement} el1 - from
   * @param {HTMLElement} el2 - to
   */
  public static swap(el1: HTMLElement, el2: HTMLElement): void {
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
  public static find(el: Element|Document = document, selector: string): Element {
    return el.querySelector(selector);
  }

  /**
   * Get Element by Id
   *
   * @param {string} id
   * @returns {HTMLElement | null}
   */
  public static get(id: string): HTMLElement {
    return document.getElementById(id);
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
  public static findAll(el: Element|Document = document, selector: string): NodeList {
    return el.querySelectorAll(selector);
  }

  /**
   * Search for deepest node which is Leaf.
   * Leaf is the vertex that doesn't have any child nodes
   *
   * @description Method recursively goes throw the all Node until it finds the Leaf
   *
   * @param {Node} node - root Node. From this vertex we start Deep-first search
   *                      {@link https://en.wikipedia.org/wiki/Depth-first_search}
   * @param {Boolean} atLast - find last text node
   * @return {Node} - it can be text Node or Element Node, so that caret will able to work with it
   */
  public static getDeepestNode(node: Node, atLast: boolean = false): Node {
    /**
     * Current function have two directions:
     *  - starts from first child and every time gets first or nextSibling in special cases
     *  - starts from last child and gets last or previousSibling
     * @type {string}
     */
    const child = atLast ? 'lastChild' : 'firstChild',
      sibling = atLast ? 'previousSibling' : 'nextSibling';

    if (node && node.nodeType === Node.ELEMENT_NODE && node[child]) {
      let nodeChild = node[child] as Node;

      /**
       * special case when child is single tag that can't contain any content
       */
      if (
        Dom.isSingleTag(nodeChild as HTMLElement) &&
        !Dom.isNativeInput(nodeChild) &&
        !Dom.isLineBreakTag(nodeChild as HTMLElement)
      ) {
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
  public static isElement(node: any): node is Element {
    return node && typeof node === 'object' && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
  }

  /**
   * Check if object is DocumentFragmemt node
   *
   * @param {Object} node
   * @returns {boolean}
   */
  public static isFragment(node: any): boolean {
    return node && typeof node === 'object' && node.nodeType && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }

  /**
   * Check if passed element is contenteditable
   * @param {HTMLElement} element
   * @return {boolean}
   */
  public static isContentEditable(element: HTMLElement): boolean {
    return element.contentEditable === 'true';
  }

  /**
   * Checks target if it is native input
   * @param {Element|String|Node} target - HTML element or string
   * @return {Boolean}
   */
  public static isNativeInput(target: any): boolean {
    const nativeInputs = [
      'INPUT',
      'TEXTAREA',
    ];

    return target && target.tagName ? nativeInputs.includes(target.tagName) : false;
  }

  /**
   * Checks if we can set caret
   * @param {HTMLElement} target
   * @return {boolean}
   */
  public static canSetCaret(target: HTMLElement): boolean {
    let result = true;
    if (Dom.isNativeInput(target)) {
      const inputElement = target as HTMLInputElement;
      switch (inputElement.type) {
        case 'file':
        case 'checkbox':
        case 'radio':
        case 'hidden':
        case 'submit':
        case 'button':
        case 'image':
        case 'reset':
          result = false;
          break;
      }
    } else {
      result = Dom.isContentEditable(target);
    }
    return result;
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
  public static isNodeEmpty(node: Node): boolean {
    let nodeText;

    if (this.isSingleTag(node as HTMLElement) && !this.isLineBreakTag(node as HTMLElement)) {
      return false;
    }

    if ( this.isElement(node) && this.isNativeInput(node) ) {
      nodeText = (node as HTMLInputElement).value;
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
  public static isLeaf(node: Node): boolean {
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
  public static isEmpty(node: Node): boolean {
    const treeWalker = [],
      leafs = [];

    if (!node) {
      return true;
    }

    if (!node.childNodes.length) {
      return this.isNodeEmpty(node);
    }

    /**
     * Normalize node to merge several text nodes to one to reduce tree walker iterations
     */
    node.normalize();

    treeWalker.push(node.firstChild);

    while ( treeWalker.length > 0 ) {
      node = treeWalker.shift();

      if (!node) { continue; }

      if ( this.isLeaf(node) ) {
        leafs.push(node);
      } else {
        treeWalker.push(node.firstChild);
      }

      while ( node && node.nextSibling ) {
        node = node.nextSibling;

        if (!node) { continue; }

        treeWalker.push(node);
      }

      /**
       * If one of childs is not empty, checked Node is not empty too
       */
      if (node && !this.isNodeEmpty(node)) {
        return false;
      }
    }

    return leafs.every( (leaf) => this.isNodeEmpty(leaf) );
  }

  /**
   * Check if string contains html elements
   *
   * @returns {boolean}
   * @param {String} str
   */
  public static isHTMLString(str: string): boolean {
    const wrapper = Dom.make('div');

    wrapper.innerHTML = str;

    return wrapper.childElementCount > 0;
  }

  /**
   * Return length of node`s text content
   *
   * @param {Node} node
   * @returns {number}
   */
  public static getContentLength(node: Node): number {
    if (Dom.isNativeInput(node)) {
      return (node as HTMLInputElement).value.length;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return (node as Text).length;
    }

    return node.textContent.length;
  }

  /**
   * Return array of names of block html elements
   *
   * @returns {string[]}
   */
  static get blockElements(): string[] {
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
      'video',
    ];
  }

  /**
   * Check if passed content includes only inline elements
   *
   * @param {string|HTMLElement} data - element or html string
   * @return {boolean}
   */
  public static containsOnlyInlineElements(data: string | HTMLElement): boolean {
    let wrapper: HTMLElement;

    if (typeof data === 'string') {
      wrapper = document.createElement('div');
      wrapper.innerHTML = data;
    } else {
      wrapper = data;
    }

    const check = (element: HTMLElement) => {
      return !Dom.blockElements.includes(element.tagName.toLowerCase())
        && Array.from(element.children).every(check);
    };

    return Array.from(wrapper.children).every(check);
  }

  /**
   * Find and return all block elements in the passed parent (including subtree)
   *
   * @param {HTMLElement} parent
   *
   * @return {HTMLElement[]}
   */
  public static getDeepestBlockElements(parent: HTMLElement): HTMLElement[] {
    if (Dom.containsOnlyInlineElements(parent)) {
      return [parent];
    }

    return Array.from(parent.children).reduce((result, element) => {
      return [...result, ...Dom.getDeepestBlockElements(element as HTMLElement)];
    }, []);
  }

  /*
   * Helper for get holder from {string} or return HTMLElement
   * @param element
   */
  public static getHolder(element: string | HTMLElement): HTMLElement {
    if (typeof element === 'string') { return document.getElementById(element); }
    return element;
  }

  /**
   * Method checks passed Node if it is some extension Node
   * @param {Node} node - any node
   */
  public static isExtensionNode(node: Node): boolean {
    const extensions = [
      'GRAMMARLY-EXTENSION',
    ];

    return node && extensions.includes(node.nodeName);
  }
}
