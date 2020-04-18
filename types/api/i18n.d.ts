/**
 * Describes Editor`s I18n API
 */
export interface I18n {
  /**
   * Only in Tools
   * Perform translation with automatically added namespace like `tools.${toolName}`
   *
   * @param dictKet - what to translate
   */
  tn(dictKet: string): string;

  /**
   * Perform translation with global dictionary
   *
   * @param namespace - path to section
   * @param dictKet - what to translate
   */
  t(namespace: string, dictKet: string): string;
}
