import Module from '../../__module';
import $ from '../../dom';

/**
 * Module description
 */
export default class Tooltip extends Module {
  /**
   * Module nodes
   */
  public nodes: {
    wrapper: HTMLElement,
  } = {
    wrapper: null,
  };

  /**
   * Tooltip CSS classes
   */
  public get CSS() {
    return {
      tooltip: 'ce-tooltip',
      tooltipShown: 'ce-tooltip--shown',
      tooltipShortcut: 'ce-tooltip-shortcut',
    };
  }

  /**
   * Module Preparation method
   */
  public make() {
    this.nodes.wrapper = $.make('div', this.CSS.tooltip, {
      innerHTML: '',
    });

    $.append(document.body, this.nodes.wrapper);
  }

  /**
   * Show tooltip for toolbox button
   *
   * @param {HTMLElement} element
   * @param {HTMLElement} content
   */
  public show(element: HTMLElement, content: HTMLElement | Node): void {
    const elementCoords = element.getBoundingClientRect();

    this.nodes.wrapper.innerHTML = '';
    this.nodes.wrapper.appendChild(content);

    this.nodes.wrapper.style.left = `${elementCoords.left + element.clientWidth / 2}px`;
    this.nodes.wrapper.style.transform = `translate3d(-50%, ${elementCoords.bottom + window.pageYOffset}px, 0)`;
    this.nodes.wrapper.classList.add(this.CSS.tooltipShown);
  }

  /**
   * Hide toolbox tooltip
   */
  public hide(): void {
    this.nodes.wrapper.classList.remove(this.CSS.tooltipShown);
  }
}
