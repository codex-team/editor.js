/**
 * Tooltip API
 */
import TooltipOptions from "codex-tooltip";
import TooltipContent from "codex-tooltip";

export interface Tooltip {
  /**
   * Show tooltip
   *
   * @param {HTMLElement} element
   * @param {TooltipContent} content
   * @param {TooltipOptions} options
   */
  show: (element: HTMLElement, content: TooltipContent, options?: TooltipOptions) => void;

  /**
   * Hides tooltip
   */
  hide: () => void;

  /**
   * Decorator for showing Tooltip by mouseenter/mouseleave
   *
   * @param {HTMLElement} element
   * @param {TooltipContent} content
   * @param {TooltipOptions} options
   */
  onHover: (element: HTMLElement, content: TooltipContent, options?: TooltipOptions) => void;

}
