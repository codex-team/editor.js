/**
 * Module description
 */
import {TooltipContent, TooltipOptions} from '../index';

class Tooltip {
  /**
   * Tooltip CSS classes
   */
  public get CSS() {
    return {
      tooltip: 'ce-tooltip',
      tooltipContent: 'ce-tooltip__content',
      tooltipShown: 'ce-tooltip--shown',
    };
  }

  /**
   * Module nodes
   */
  public nodes: {
    wrapper: HTMLElement,
    content: HTMLElement,
  } = {
    wrapper: null,
    content: null,
  };

  /**
   * Module constructor
   */
  constructor() {
    this.loadStyles();
    this.prepare();
  }

  /**
   * Show tooltip for toolbox button
   *
   * @param {HTMLElement} element
   * @param {TooltipContent} content
   * @param {TooltipOptions} options
   */
  public show(element: HTMLElement, content: TooltipContent, options: TooltipOptions): void {
    if (!this.nodes.wrapper) {
      this.prepare();
    }

    const tooltipOptions = options || {
      position: 'bottom',
    };

    const elementCoords = element.getBoundingClientRect();
    const offsetY = -15;

    this.nodes.content.innerHTML = '';
    this.nodes.content.appendChild(content);

    switch (tooltipOptions.position) {
      case 'top':
        console.log('here');
        break;

      case 'bottom':
      default:
        const tooltipPosition = {
          left: elementCoords.left + element.clientWidth / 2,
          top: elementCoords.bottom + window.pageYOffset + offsetY,
        };

        this.nodes.wrapper.style.left = `${tooltipPosition.left}px`;
        this.nodes.wrapper.style.transform = `translate3d(-50%, ${tooltipPosition.top}px, 0)`;
        break;
    }
    this.nodes.wrapper.classList.add(this.CSS.tooltipShown);
  }

  /**
   * Hide toolbox tooltip and clean content
   */
  public hide(): void {
    this.nodes.wrapper.classList.remove(this.CSS.tooltipShown);
  }

  /**
   * Module Preparation method
   */
  private prepare() {
    this.nodes.wrapper = this.make('div', this.CSS.tooltip);
    this.nodes.content = this.make('div', this.CSS.tooltipContent);

    this.append(this.nodes.wrapper, this.nodes.content);
    this.append(document.body, this.nodes.wrapper);
  }

  private loadStyles(): void {
    const styles = require('../styles/main.css');
    const tag = this.make('style', null, {
      textContent: styles.toString(),
    });

    /**
     * Append styles at the top of HEAD tag
     */
    this.prepend(document.head, tag);
  }

  /**
   * Helper for making Elements with classname and attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {HTMLElement}
   */
  private make(tagName: string, classNames: string|string[] = null, attributes: object = {}): HTMLElement {
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
   * Append one or several elements to the parent
   *
   * @param  {Element|DocumentFragment} parent    - where to append
   * @param  {Element|Element[]} elements - element or elements list
   */
  private append(parent: Element|DocumentFragment, elements: Element|Element[]|DocumentFragment): void {
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
  private prepend(parent: Element, elements: Element|Element[]): void {
    if ( Array.isArray(elements) ) {
      elements = elements.reverse();
      elements.forEach( (el) => parent.prepend(el) );
    } else {
      parent.prepend(elements);
    }
  }
}

module.exports = new Tooltip();
