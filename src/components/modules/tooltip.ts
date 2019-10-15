import Module from '../__module';

/**
 * Use external module CodeX Tooltip
 */
import tooltip, { TooltipContent, TooltipOptions } from '../external/codex.tooltips';

/**
 * @class Tooltip
 * @classdesc decorates any tooltip module like adapter
 */
export default class Tooltip extends Module {
  /**
   * Shows tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - any HTML element in DOM
   * @param {TooltipContent} content - tooltip's content
   * @param {TooltipOptions} options
   */
  public show(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    tooltip.show(element, content, {
      position: 'bottom',
    });
  }

  /**
   * Hides tooltip
   */
  public hide(): void {
    // tooltip.hide();
  }
}
