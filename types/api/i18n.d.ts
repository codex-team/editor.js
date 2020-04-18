/**
 * Describes Editor`s I18n API
 */
export interface I18n {
  t(namespace: string, dictKet: string): void;
  has(namespace: string, dictKet: string): void;
}
