import Module from '../../__module';
import {Sanitizer} from '../../../../types/api';

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
   * @return {Sanitizer}
   */
  get methods(): Sanitizer {
    return {
      clean: (taintString, config) => this.clean(taintString, config),
    };
  }

  public clean(taintString, config) {
    return this.Editor.Sanitizer.clean(taintString, config);
  }

}
