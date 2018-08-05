declare var Module: any;

import {ISelectionAPI} from '../interfaces/api';
import IModuleConfig from '../interfaces/module-config';
import Selection from '../selection';

/**
 * @class API
 * Provides with methods working with SelectionUtils
 */
export default class SelectionAPI extends Module implements ISelectionAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
    super({config});
  }

  /**
   * Available methods
   * @return {ISelectionAPI}
   */
  get methods(): ISelectionAPI {
    return {
      findParentTag: (tagName: string, className: string) => this.findParentTag(tagName, className),
      expandToTag: (node: HTMLElement) => this.expandToTag(node),
    };
  }

  /**
   * Looks ahead from selection and find passed tag with class name
   * @param {string} tagName - tag to find
   * @param {string} className - tag's class name
   * @return {HTMLElement|null}
   */
  public findParentTag(tagName: string, className: string): HTMLElement|null {
    return new Selection().findParentTag(tagName, className);
  }

  /**
   * Expand selection to passed tag
   * @param {HTMLElement} node - tag that should contain selection
   */
  public expandToTag(node: HTMLElement): void {
    new Selection().expandToTag(node);
  }

}
