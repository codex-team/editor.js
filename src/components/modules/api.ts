/**
 * @module API
 * @copyright <CodeX Team> 2018
 *
 * Each block has an Editor API instance to use provided public methods
 *
 * if you cant to read more about how API works, please see docs
 */
declare var Module: any;
declare var $: any;
declare var _: any;

import { IAPI } from '../interfaces/api';

/**
 * @class API
 */
export default class API extends Module {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  public get methods(): IAPI {
    return {
      blocks: this.Editor.BlocksAPI,
      caret: {},
      sanitizer: this.Editor.SanitizerAPI,
      toolbar: {},
    };
  }
}
