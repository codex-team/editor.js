/* eslint-disable jsdoc/no-undefined-types */
/**
 * Use external module CodeX Tooltip
 */
import CodeXTooltips from 'codex-tooltip';
import type { TooltipOptions, TooltipContent } from 'codex-tooltip/types';

/**
 * Tooltip
 *
 * Decorates any tooltip module like adapter
 */
export default class Tooltip {
  /**
   * Tooltips lib: CodeX Tooltips
   *
   * @see https://github.com/codex-team/codex.tooltips
   */
  private lib: CodeXTooltips = new CodeXTooltips();

  /**
   * Release the library
   */
  public destroy(): void {
    this.lib.destroy();
  }

  /**
   * Shows tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - any HTML element in DOM
   * @param content - tooltip's content
   * @param options - showing settings
   */
  public show(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.lib.show(element, content, options);
  }

  /**
   * Hides tooltip
   *
   * @param skipHidingDelay — pass true to immediately hide the tooltip
   */
  public hide(skipHidingDelay = false): void {
    this.lib.hide(skipHidingDelay);
  }

  /**
   * Binds 'mouseenter' and 'mouseleave' events that shows/hides the Tooltip
   *
   * @param {HTMLElement} element - any HTML element in DOM
   * @param content - tooltip's content
   * @param options - showing settings
   */
  public onHover(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.lib.onHover(element, content, options);
  }
}
