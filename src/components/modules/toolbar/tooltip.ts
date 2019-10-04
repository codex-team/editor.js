import Module from '../../__module';
import _ from '../../utils';
import $ from '../../dom';

/**
 * TooltipData interface
 */
export interface TooltipData {
  /**
   * Tooltip name
   */
  name: string;

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
   * Keeps cached contents by tooltip name
   */
  private cachedContents: {
    [name: string]: string | HTMLElement | DocumentFragment,
  } = {};

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
   * Method enabled tooltip
   *
   * @param {TooltipData} tooltipData
   */
  public add(tooltipData: TooltipData) {
    /**
     * cache tooltip contents with key of tooltip name
     */
    this.cachedContents[tooltipData.name] = tooltipData.content;

    /**
     * set necessary listeners
     */
    this.Editor.Listeners.on(tooltipData.element, 'mouseenter', (event: MouseEvent) => {
      this.showTooltip(event, tooltipData.name);
    });

    this.Editor.Listeners.on(tooltipData.element, 'mouseleave', () => {
      this.hideTooltip();
    });
  }

  /**
   * Show tooltip for toolbox button
   *
   * @param {MouseEvent} event
   * @param {String} name
   */
  private showTooltip(event: MouseEvent, name: string): void {
    this.nodes.wrapper.innerHTML = '';

    const content = this.cachedContents[name];

    let childToAppend;
    switch (_.typeof(content)) {
      case 'string':
        childToAppend = document.createTextNode(content as string);
        break;
      case 'documentfragment':
        childToAppend = (content as DocumentFragment).cloneNode(true);
        break;
      default:
        _.log('Something went wrong...');
        return;
    }

    this.nodes.wrapper.appendChild(childToAppend);

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
