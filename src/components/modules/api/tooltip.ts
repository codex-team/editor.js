import Module from '../../__module';
import { Tooltip } from '../../../../types/api';
import {TooltipContent, TooltipOptions} from '../../external/codex.tooltips';

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
      show: (element: HTMLElement,
             content: TooltipContent,
             options?: TooltipOptions,
      ) => this.show(element, content, options),
      hide: () => this.hide(),
    };
  }

  /**
   * Method show tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element
   * @param {TooltipContent} content
   * @param {TooltipOptions} options
   */
  public show(element: HTMLElement, content: TooltipContent, options?: TooltipOptions) {
    this.Editor.Tooltip.show(element, content, options);
  }

  /**
   * Method hides tooltip on HTML page
   */
  public hide() {
    this.Editor.Tooltip.hide();
  }
}
