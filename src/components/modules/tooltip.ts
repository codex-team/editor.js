import Module from '../__module';

/**
 * Use external module CodeX Tooltip
 * Link to the github....
 *
 * @see https://github.com/codex-team/ts-tooltips
 */
import tooltip from '../../../devModules/tooltip/dist/tooltip';

/**
 * @class Tooltip
 * @classdesc decorates any tooltip module like adapter
 */
export default class Tooltip extends Module {
  /**
   * Shows tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - any HTML element in DOM
   * @param {HTMLElement| DocumentFragment | Node} content - tooltip's content
   */
  public show(element: HTMLElement, content: HTMLElement | DocumentFragment | Node): void {
    tooltip.show(element, content);
  }

  /**
   * Hides tooltip
   */
  public hide(): void {
    tooltip.hide();
  }
}
