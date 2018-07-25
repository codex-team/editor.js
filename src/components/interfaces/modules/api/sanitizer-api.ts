/**
 * Sanitizer's methods
 */
export default interface ISanitizerAPI {

  /**
   * Clean taint string from disallowed tags and attributes
   *
   * @param taintString
   * @param config
   */
  clean: (taintString, config?) => string;
}
