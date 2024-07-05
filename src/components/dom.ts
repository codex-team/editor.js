import * as _ from './utils';

/**
 * DOM manipulations helper
 *
 * @todo get rid of class and make separate utility functions
 */
export default class Dom {
  /**
   * Check if passed tag has no closed tag
   *
   * @param {HTMLElement} tag - element to check
   * @returns {boolean}
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
   * @param {HTMLElement} element - element to check
   * @returns {boolean}
   */
  public static isLineBreakTag(element: HTMLElement): element is HTMLBRElement {
    return element && element.tagName && [
      'BR',
      'WBR',
    ].includes(element.tagName);
  }

  /**
   * Helper for making Elements with class name and attributes
   *
   * @param  {string} tagName - new Element tag name
   * @param  {string[]|string} [classNames] - list or name of CSS class name(s)
   * @param  {object} [attributes] - any attributes
   * @returns {HTMLElement}
   */
  public static make(tagName: string, classNames: string | (string | undefined)[] | null = null, attributes: object = {}): HTMLElement {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      const validClassnames = classNames.filter(className => className !== undefined) as string[];

      el.classList.add(...validClassnames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, attrName)) {
        el[attrName] = attributes[attrName];
      }
    }

    return el;
  }

  /**
   * Creates Text Node with the passed content
   *
   * @param {string} content - text content
   * @returns {Text}
   */
  public static text(content: string): Text {
    return document.createTextNode(content);
  }

  /**
   * Append one or several elements to the parent
   *
   * @param  {Element|DocumentFragment} parent - where to append
   * @param  {Element|Element[]|DocumentFragment|Text|Text[]} elements - element or elements list
   */
  public static append(
    parent: Element | DocumentFragment,
    elements: Element | Element[] | DocumentFragment | Text | Text[]
  ): void {
    if (Array.isArray(elements)) {
      elements.forEach((el) => parent.appendChild(el));
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
  public static prepend(parent: Element, elements: Element | Element[]): void {
    if (Array.isArray(elements)) {
      elements = elements.reverse();
      elements.forEach((el) => parent.prepend(el));
    } else {
      parent.prepend(elements);
    }
  }

  /**
   * Swap two elements in parent
   *
   * @param {HTMLElement} el1 - from
   * @param {HTMLElement} el2 - to
   * @deprecated
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
   * @param {string} selector - searching string
   * @returns {Element}
   */
  public static find(el: Element | Document = document, selector: string): Element | null {
    return el.querySelector(selector);
  }

  /**
   * Get Element by Id
   *
   * @param {string} id - id to find
   * @returns {HTMLElement | null}
   */
  public static get(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  /**
   * Selector Decorator.
   *
   * Returns all matches
   *
   * @param {Element|Document} el - element we searching inside. Default - DOM Document
   * @param {string} selector - searching string
   * @returns {NodeList}
   */
  public static findAll(el: Element | Document = document, selector: string): NodeList {
    return el.querySelectorAll(selector);
  }

  /**
   * Returns CSS selector for all text inputs
   */
  public static get allInputsSelector(): string {
    const allowedInputTypes = ['text', 'password', 'email', 'number', 'search', 'tel', 'url'];

    return '[contenteditable=true], textarea, input:not([type]), ' +
      allowedInputTypes.map((type) => `input[type="${type}"]`).join(', ');
  }

  /**
   * Find all contenteditable, textarea and editable input elements passed holder contains
   *
   * @param holder - element where to find inputs
   */
  public static findAllInputs(holder: Element): HTMLElement[] {
    return _.array(holder.querySelectorAll(Dom.allInputsSelector))
      /**
       * If contenteditable element contains block elements, treat them as inputs.
       */
      .reduce((result, input) => {
        if (Dom.isNativeInput(input) || Dom.containsOnlyInlineElements(input)) {
          return [...result, input];
        }

        return [...result, ...Dom.getDeepestBlockElements(input)];
      }, []);
  }

  /**
   * Search for deepest node which is Leaf.
   * Leaf is the vertex that doesn't have any child nodes
   *
   * @description Method recursively goes throw the all Node until it finds the Leaf
   * @param {Node} node - root Node. From this vertex we start Deep-first search
   *                      {@link https://en.wikipedia.org/wiki/Depth-first_search}
   * @param {boolean} [atLast] - find last text node
   * @returns - it can be text Node or Element Node, so that caret will able to work with it
   *            Can return null if node is Document or DocumentFragment, or node is not attached to the DOM
   */
  public static getDeepestNode(node: Node, atLast = false): Node | null {
    /**
     * Current function have two directions:
     *  - starts from first child and every time gets first or nextSibling in special cases
     *  - starts from last child and gets last or previousSibling
     *
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
   * @param {*} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isElement(node: any): node is Element {
    if (_.isNumber(node)) {
      return false;
    }

    return node && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
  }

  /**
   * Check if object is DocumentFragment node
   *
   * @param {object} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isFragment(node: any): node is DocumentFragment {
    if (_.isNumber(node)) {
      return false;
    }

    return node && node.nodeType && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }

  /**
   * Check if passed element is contenteditable
   *
   * @param {HTMLElement} element - html element to check
   * @returns {boolean}
   */
  public static isContentEditable(element: HTMLElement): boolean {
    return element.contentEditable === 'true';
  }

  /**
   * Checks target if it is native input
   *
   * @param {*} target - HTML element or string
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isNativeInput(target: any): target is HTMLInputElement | HTMLTextAreaElement {
    const nativeInputs = [
      'INPUT',
      'TEXTAREA',
    ];

    return target && target.tagName ? nativeInputs.includes(target.tagName) : false;
  }

  /**
   * Checks if we can set caret
   *
   * @param {HTMLElement} target - target to check
   * @returns {boolean}
   */
  public static canSetCaret(target: HTMLElement): boolean {
    let result = true;

    if (Dom.isNativeInput(target)) {
      switch (target.type) {
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
   * @param {Node} node - node to check
   * @param {string} [ignoreChars] - char or substring to treat as empty
   * @returns {boolean} true if it is empty
   */
  public static isNodeEmpty(node: Node, ignoreChars?: string): boolean {
    let nodeText;

    if (this.isSingleTag(node as HTMLElement) && !this.isLineBreakTag(node as HTMLElement)) {
      return false;
    }

    if (this.isElement(node) && this.isNativeInput(node)) {
      nodeText = (node as HTMLInputElement).value;
    } else {
      nodeText = node.textContent.replace('\u200B', '');
    }

    if (ignoreChars) {
      nodeText = nodeText.replace(new RegExp(ignoreChars, 'g'), '');
    }

    return nodeText.trim().length === 0;
  }

  /**
   * checks node if it is doesn't have any child nodes
   *
   * @param {Node} node - node to check
   * @returns {boolean}
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
   * @param {Node} node - node to check
   * @param {string} [ignoreChars] - char or substring to treat as empty
   * @returns {boolean}
   */
  public static isEmpty(node: Node, ignoreChars?: string): boolean {
    /**
     * Normalize node to merge several text nodes to one to reduce tree walker iterations
     */
    node.normalize();

    const treeWalker = [ node ];

    while (treeWalker.length > 0) {
      node = treeWalker.shift();

      if (!node) {
        continue;
      }

      if (this.isLeaf(node) && !this.isNodeEmpty(node, ignoreChars)) {
        return false;
      }

      if (node.childNodes) {
        treeWalker.push(...Array.from(node.childNodes));
      }
    }

    return true;
  }

  /**
   * Check if string contains html elements
   *
   * @param {string} str - string to check
   * @returns {boolean}
   */
  public static isHTMLString(str: string): boolean {
    const wrapper = Dom.make('div');

    wrapper.innerHTML = str;

    return wrapper.childElementCount > 0;
  }

  /**
   * Return length of node`s text content
   *
   * @param {Node} node - node with content
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
  public static get blockElements(): string[] {
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
      'tbody',
      'thead',
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
   * @returns {boolean}
   */
  public static containsOnlyInlineElements(data: string | HTMLElement): boolean {
    let wrapper: HTMLElement;

    if (_.isString(data)) {
      wrapper = document.createElement('div');
      wrapper.innerHTML = data;
    } else {
      wrapper = data;
    }

    const check = (element: HTMLElement): boolean => {
      return !Dom.blockElements.includes(element.tagName.toLowerCase()) &&
        Array.from(element.children).every(check);
    };

    return Array.from(wrapper.children).every(check);
  }

  /**
   * Find and return all block elements in the passed parent (including subtree)
   *
   * @param {HTMLElement} parent - root element
   * @returns {HTMLElement[]}
   */
  public static getDeepestBlockElements(parent: HTMLElement): HTMLElement[] {
    if (Dom.containsOnlyInlineElements(parent)) {
      return [ parent ];
    }

    return Array.from(parent.children).reduce((result, element) => {
      return [...result, ...Dom.getDeepestBlockElements(element as HTMLElement)];
    }, []);
  }

  /**
   * Helper for get holder from {string} or return HTMLElement
   *
   * @param {string | HTMLElement} element - holder's id or holder's HTML Element
   * @returns {HTMLElement}
   */
  public static getHolder(element: string | HTMLElement): HTMLElement {
    if (_.isString(element)) {
      return document.getElementById(element);
    }

    return element;
  }

  /**
   * Returns true if element is anchor (is A tag)
   *
   * @param {Element} element - element to check
   * @returns {boolean}
   */
  public static isAnchor(element: Element): element is HTMLAnchorElement {
    return element.tagName.toLowerCase() === 'a';
  }

  /**
   * Return element's offset related to the document
   *
   * @todo handle case when editor initialized in scrollable popup
   * @param el - element to compute offset
   */
  public static offset(el): { top: number; left: number; right: number; bottom: number } {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const top = rect.top + scrollTop;
    const left = rect.left + scrollLeft;

    return {
      top,
      left,
      bottom: top + rect.height,
      right: left + rect.width,
    };
  }
}

/**
 * Determine whether a passed text content is a collapsed whitespace.
 *
 * In HTML, whitespaces at the start and end of elements and outside elements are ignored.
 * There are two types of whitespaces in HTML:
 * - Visible (&nbsp;)
 * - Invisible (regular trailing spaces, tabs, etc)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
 * @see https://www.w3.org/TR/css-text-3/#white-space-processing
 * @param textContent — any string, for ex a textContent of a node
 * @returns True if passed text content is whitespace which is collapsed (invisible) in browser
 */
export function isCollapsedWhitespaces(textContent: string): boolean {
  /**
   *  Throughout, whitespace is defined as one of the characters
   *  "\t" TAB \u0009
   *  "\n" LF  \u000A
   *  "\r" CR  \u000D
   *  " "  SPC \u0020
   */
  return !/[^\t\n\r ]/.test(textContent);
}

/**
 * Calculates the Y coordinate of the text baseline from the top of the element's margin box,
 *
 * The calculation formula is as follows:
 *
 * 1. Calculate the baseline offset:
 *    - Typically, the baseline is about 80% of the `fontSize` from the top of the text, as this is a common average for many fonts.
 *
 * 2. Calculate the additional space due to `lineHeight`:
 *    - If the `lineHeight` is greater than the `fontSize`, the extra space is evenly distributed above and below the text. This extra space is `(lineHeight - fontSize) / 2`.
 *
 * 3. Calculate the total baseline Y coordinate:
 *    - Sum of `marginTop`, `borderTopWidth`, `paddingTop`, the extra space due to `lineHeight`, and the baseline offset.
 *
 * @param element - The element to calculate the baseline for.
 * @returns {number} - The Y coordinate of the text baseline from the top of the element's margin box.
 */
export function calculateBaseline(element: Element): number {
  const style = window.getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2; // default line-height if not set
  const paddingTop = parseFloat(style.paddingTop);
  const borderTopWidth = parseFloat(style.borderTopWidth);
  const marginTop = parseFloat(style.marginTop);

  /**
   * Typically, the baseline is about 80% of the `fontSize` from the top of the text, as this is a common average for many fonts.
   */
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const baselineOffset = fontSize * 0.8;

  /**
   * If the `lineHeight` is greater than the `fontSize`, the extra space is evenly distributed above and below the text. This extra space is `(lineHeight - fontSize) / 2`.
   */
  const extraLineHeight = (lineHeight - fontSize) / 2;

  /**
   * Calculate the total baseline Y coordinate from the top of the margin box
   */
  const baselineY = marginTop + borderTopWidth + paddingTop + extraLineHeight + baselineOffset;

  return baselineY;
}

/**
 * Toggles the [data-empty] attribute on element depending on its emptiness
 * Used to mark empty inputs with a special attribute for placeholders feature
 *
 * @param element - The element to toggle the [data-empty] attribute on
 */
export function toggleEmptyMark(element: HTMLElement): void {
  element.dataset.empty = Dom.isEmpty(element) ? 'true' : 'false';
}
