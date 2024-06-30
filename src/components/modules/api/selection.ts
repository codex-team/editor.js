import SelectionUtils from '../../selection';
import { Selection as SelectionAPIInterface } from '../../../../types/api';
import Module from '../../__module';

/**
 * @class SelectionAPI
 * Provides with methods working with SelectionUtils
 */
export default class SelectionAPI extends Module {
  /**
   * Global SelectionUtils instance
   */
  private selectionUtils = new SelectionUtils();

  /**
   * Available methods
   *
   * @returns {SelectionAPIInterface}
   */
  public get methods(): SelectionAPIInterface {
    return {
      findParentTag: (tagName: string, className?: string): HTMLElement | null => this.findParentTag(tagName, className),
      expandToTag: (node: HTMLElement): void => this.expandToTag(node),
      save: () => this.selectionUtils.save(),
      restore: () => this.selectionUtils.restore(),
      setFakeBackground: () => this.selectionUtils.setFakeBackground(),
      removeFakeBackground: () => this.selectionUtils.removeFakeBackground(),
    };
  }

  /**
   * Looks ahead from selection and find passed tag with class name
   *
   * @param {string} tagName - tag to find
   * @param {string} className - tag's class name
   * @returns {HTMLElement|null}
   */
  public findParentTag(tagName: string, className?: string): HTMLElement | null {
    return this.selectionUtils.findParentTag(tagName, className);
  }

  /**
   * Expand selection to passed tag
   *
   * @param {HTMLElement} node - tag that should contain selection
   */
  public expandToTag(node: HTMLElement): void {
    this.selectionUtils.expandToTag(node);
  }
}
