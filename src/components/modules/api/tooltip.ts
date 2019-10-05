import Module from '../../__module';
import { Tooltip } from '../../../../types/api';

/**
 * @class TooltipAPI
 * @classdesc Tooltip API
 */
export default class TooltipAPI extends Module {
  /**
   * Available methods
   */
  get methods(): Tooltip {
    return {
      show: (element: HTMLElement, content: HTMLElement) => this.show(element, content),
      hide: () => this.hide(),
    };
  }

  /**
   * Method show tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element
   * @param {HTMLElement} content
   */
  public show(element: HTMLElement, content: HTMLElement) {
    this.Editor.Tooltip.show(element, content);
  }

  /**
   * Method hides tooltip on HTML page
   */
  public hide() {
    this.Editor.Tooltip.hide();
  }
}
