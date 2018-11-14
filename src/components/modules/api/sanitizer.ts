import Module from '../../__module';

import * as API from '../../../../types/api';

/**
 * @class SanitizerAPI
 * Provides CodeX Editor Sanitizer that allows developers to clean their HTML
 */
export default class SanitizerAPI extends Module {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Available methods
   * @return {API.sanitizer}
   */
  get methods(): API.sanitizer {
    return {
      clean: (taintString, config) => this.clean(taintString, config),
    };
  }

  public clean(taintString, config) {
    return this.Editor.Sanitizer.clean(taintString, config);
  }

}
