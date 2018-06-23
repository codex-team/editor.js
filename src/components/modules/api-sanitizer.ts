declare var Module: any;

import {ISanitizerAPI} from '../interfaces/api';

/**
 * @class API
 */
export default class SanitizerAPI extends Module implements ISanitizerAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Available methods
   * @return {ISanitizerAPI}
   */
  get methods(): ISanitizerAPI {
    return {
      clean: (taintString, config) => this.clean(taintString, config),
    }
  }

  public clean(taintString, config) {
    return this.Editor.Sanitizer.clean(taintString, config);
  }

}
