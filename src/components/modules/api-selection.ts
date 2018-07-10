declare var Module: any;

import {ISelectionAPI} from '../interfaces/api';
import Selection from '../selection';

/**
 * @class API
 * Provides with methods working with Selection
 */
export default class SelectionAPI extends Module implements ISelectionAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
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

  public findParentTag(tagName: string, className: string): Node {
    return new Selection().findParentTag(tagName, className);
  }

  public expandToTag(node: HTMLElement): void {
    new Selection().expandToTag(node);
  }

}
