/**
 * Describes Editor`s I18n API
 */
export interface I18n {
  /**
   * Only in Tools
   * Perform translation with automatically added namespace like `tools.${toolName}`
   *
   * @param dictKey - what to translate
   */
  tn(dictKey: string): string;

  /**
   * Perform translation with global dictionary
   *
   * @param namespace - path to section
   * @param dictKey - what to translate
   */
  t(namespace: string, dictKey: string): string;
}
