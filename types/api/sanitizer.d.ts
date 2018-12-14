import {SanitizerConfig} from '../index';

/**
 * Describes Editor`s sanitizer API
 */
export interface Sanitizer {
  /**
   * Clean taint string with html and returns clean string
   *
   * @param {string} taintString
   * @param {SanitizerConfig} config - configuration for sanitizer
   */
  clean(taintString: string, config: SanitizerConfig): string;
}
