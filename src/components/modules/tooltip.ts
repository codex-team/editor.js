import Module from '../__module';

/**
 * Use external module CodeX Tooltip
 * Link to the github....
 *
 * @see https://github.com/codex-team/ts-tooltips
 */
import tooltip from '../../../devModules/tooltip/dist/tooltip';

/**
 * Module description
 */
export default class Tooltip extends Module {
  /**
   * @param {HTMLElement} element - any HTML element in DOM
   * @param {HTMLElement| DocumentFragment | Node} content - tooltip's content
   */
  public show(element: HTMLElement, content: HTMLElement | DocumentFragment | Node): void {
    tooltip.show(element, content);
  }
  /**
   * Hide toolbox tooltip
   */
  public hide(): void {
    tooltip.hide();
  }
}
