import Module from '../../__module';
import SelectionUtils from '../../selection';
import { Selection as SelectionAPIInterface } from '../../../../types/api';

/**
 * @class SelectionAPI
 * Provides with methods working with SelectionUtils
 */
export default class SelectionAPI extends Module {
  /**
   * Method names that should be disabled in the Read-Only mode
   */
  protected methodsToDisableInReadonly: string[] = [
    'findParentTag',
    'expandToTag',
  ];

  /**
   * Available methods
   *
   * @returns {SelectionAPIInterface}
   */
  public get methods(): SelectionAPIInterface {
    const methods = {
      findParentTag: (tagName: string, className?: string): HTMLElement | null => this.findParentTag(tagName, className),
      expandToTag: (node: HTMLElement): void => this.expandToTag(node),
    };

    for (const method in methods) {
      if (this.methodsToDisableInReadonly.includes(method)) {
        methods[method] = this.Editor.ReadOnly.offDecorator(methods[method]);
      }
    }

    return methods;
  }

  /**
   * Looks ahead from selection and find passed tag with class name
   *
   * @param {string} tagName - tag to find
   * @param {string} className - tag's class name
   *
   * @returns {HTMLElement|null}
   */
  public findParentTag(tagName: string, className?: string): HTMLElement | null {
    return new SelectionUtils().findParentTag(tagName, className);
  }

  /**
   * Expand selection to passed tag
   *
   * @param {HTMLElement} node - tag that should contain selection
   */
  public expandToTag(node: HTMLElement): void {
    new SelectionUtils().expandToTag(node);
  }
}
