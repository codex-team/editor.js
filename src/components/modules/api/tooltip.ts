import Module from '../../__module';
import { Tooltip } from '../../../../types/api';
import { TooltipContent, TooltipOptions } from 'codex-tooltip';

/**
 * @class TooltipAPI
 * @classdesc Tooltip API
 */
export default class TooltipAPI extends Module {
  /**
   * Method names that must be decorated
   */
  protected decorateList: string[] = [
    'show',
    'hide',
    'onHover',
  ];

  /**
   * Available methods
   */
  public get methods(): Tooltip {
    const methods = {
      show: (element: HTMLElement,
        content: TooltipContent,
        options?: TooltipOptions
      ): void => this.show(element, content, options),
      hide: (): void => this.hide(),
      onHover: (element: HTMLElement,
        content: TooltipContent,
        options?: TooltipOptions
      ): void => this.onHover(element, content, options),
    };

    for (const method in methods) {
      if (this.decorateList.includes(method)) {
        methods[method] = this.Editor.ReadOnly.decorator(methods[method]);
      }
    }

    return methods;
  }

  /**
   * Method show tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  public show(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.Editor.Tooltip.show(element, content, options);
  }

  /**
   * Method hides tooltip on HTML page
   */
  public hide(): void {
    this.Editor.Tooltip.hide();
  }

  /**
   * Decorator for showing Tooltip by mouseenter/mouseleave
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  public onHover(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.Editor.Tooltip.onHover(element, content, options);
  }
}
