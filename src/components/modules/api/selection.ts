import SelectionUtils from '../../selection';
import { Selection as SelectionAPIInterface } from '../../../../types/api';
import ApiModule from './base';

/**
 * @class SelectionAPI
 * Provides with methods working with SelectionUtils
 */
export default class SelectionAPI extends ApiModule {
  /**
   * Method names that should be disabled in the Read-Only mode
   */
  public methodsToDisableInReadonly: string[] = [
    'findParentTag',
    'expandToTag',
  ];

  /**
   * Available methods
   *
   * @returns {SelectionAPIInterface}
   */
  public get methods(): SelectionAPIInterface {
    return {
      findParentTag: (tagName: string, className?: string): HTMLElement | null => this.findParentTag(tagName, className),
      expandToTag: (node: HTMLElement): void => this.expandToTag(node),
    };
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
