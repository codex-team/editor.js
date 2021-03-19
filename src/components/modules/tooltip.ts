/* eslint-disable jsdoc/no-undefined-types */
import Module from '../__module';

/**
 * Use external module CodeX Tooltip
 */
import CodeXTooltips, { TooltipContent, TooltipOptions } from 'codex-tooltip';

/**
 * Tooltip
 *
 * Decorates any tooltip module like adapter
 */
export default class Tooltip extends Module {
  /**
   * Tooltips lib: CodeX Tooltips
   *
   * @see https://github.com/codex-team/codex.tooltips
   */
  private lib: CodeXTooltips = new CodeXTooltips();

  /**
   * Shows tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - any HTML element in DOM
   * @param {TooltipContent} content - tooltip's content
   * @param {TooltipOptions} options - showing settings
   */
  public show(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.lib.show(element, content, options);
  }

  /**
   * Hides tooltip
   */
  public hide(): void {
    this.lib.hide();
  }

  /**
   * Binds 'mouseenter' and 'mouseleave' events that shows/hides the Tooltip
   *
   * @param {HTMLElement} element - any HTML element in DOM
   * @param {TooltipContent} content - tooltip's content
   * @param {TooltipOptions} options - showing settings
   */
  public onHover(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.lib.onHover(element, content, options);
  }
}
