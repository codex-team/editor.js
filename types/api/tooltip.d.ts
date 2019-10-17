/**
 * Tooltip API
 */
import {TooltipContent, TooltipOptions} from '../../src/components/external/codex.tooltips';

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
}
