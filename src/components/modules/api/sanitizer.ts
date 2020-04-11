import Module from '../../__module';
import { Sanitizer } from '../../../../types/api';

/**
 * @class SanitizerAPI
 * Provides Editor.js Sanitizer that allows developers to clean their HTML
 */
export default class SanitizerAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Sanitizer}
   */
  get methods(): Sanitizer {
    return {
      clean: (taintString, config) => this.clean(taintString, config),
    };
  }

  /**
   * Perform sanitizing of a string
   * @param taintString - what to sanitize
   * @param config - sanitizer config
   */
  public clean(taintString, config) {
    return this.Editor.Sanitizer.clean(taintString, config);
  }
}
