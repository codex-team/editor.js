import { Sanitizer } from '../../../../types/api';
import { SanitizerConfig } from '../../../../types/configs';
import ApiModule from './base';

/**
 * @class SanitizerAPI
 * Provides Editor.js Sanitizer that allows developers to clean their HTML
 */
export default class SanitizerAPI extends ApiModule {
  /**
   * Available methods
   *
   * @returns {Sanitizer}
   */
  public get methods(): Sanitizer {
    return {
      clean: (taintString, config): string => this.clean(taintString, config),
    };
  }

  /**
   * Perform sanitizing of a string
   *
   * @param {string} taintString - what to sanitize
   * @param {SanitizerConfig} config - sanitizer config
   *
   * @returns {string}
   */
  public clean(taintString: string, config: SanitizerConfig): string {
    return this.Editor.Sanitizer.clean(taintString, config);
  }
}
