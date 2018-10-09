import Module from '../__module';

import {ISanitizerAPI} from '../interfaces/api';
import IModuleConfig from '../interfaces/module-config';

/**
 * @class API
 * Provides CodeX Editor Sanitizer that allows developers to clean their HTML
 */
export default class SanitizerAPI extends Module implements ISanitizerAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
    super({config});
  }

  /**
   * Available methods
   * @return {ISanitizerAPI}
   */
  get methods(): ISanitizerAPI {
    return {
      clean: (taintString, config) => this.clean(taintString, config),
    };
  }

  public clean(taintString, config) {
    return this.Editor.Sanitizer.clean(taintString, config);
  }

}
