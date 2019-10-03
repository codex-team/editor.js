import Module from '../../__module';
import _ from '../../utils';
import $ from '../../dom';

/**
 * TooltipData interface
 */
export interface TooltipData {
  /**
   * Element on which tooltip will be showed
   */
  element: HTMLElement;

  /**
   * Tooltip's content
   */
  content: string | HTMLElement | DocumentFragment;
}

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

    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  /**
   * @param {TooltipData} tooltipData
   */
  public add(tooltipData: TooltipData) {
    const el = tooltipData.element;
    const content = tooltipData.content;

    this.Editor.Listeners.on(el, 'mouseenter', (event: MouseEvent) => {
      this.showTooltip(event, el, content);
    });

    this.Editor.Listeners.on(el, 'mouseleave', () => {
      this.hideTooltip();
    });
  }

  /**
   * Show tooltip for toolbox button
   *
   * @param {MouseEvent} event
   * @param {HTMLElement} button
   * @param {string|HTMLElement|DocumentFragment} content
   */
  private showTooltip(event: MouseEvent, button: HTMLElement, content: string|HTMLElement|DocumentFragment): void {
    this.nodes.wrapper.innerHTML = '';
    if (_.typeof(content) === 'string') {
      this.nodes.wrapper.appendChild(document.createTextNode(content as string));
    } else {
      this.nodes.wrapper.appendChild(content as DocumentFragment | HTMLElement);
    }
    this.nodes.wrapper.style.left = `${event.pageX}px`;
    this.nodes.wrapper.style.transform = `translate3d(-50%, ${event.pageY}px, 0)`;
    this.nodes.wrapper.classList.add(this.CSS.tooltipShown);
  }

  /**
   * Hide toolbox tooltip
   */
  private hideTooltip(): void {
    this.nodes.wrapper.classList.remove(this.CSS.tooltipShown);
  }
}
