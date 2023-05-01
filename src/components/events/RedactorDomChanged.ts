/**
 * Fired when blocks wrapper (.codex-editor-redactor) dom changed
 */
export const RedactorDomChanged = 'redactor dom changed';

/**
 * Payload that will be passed with the event
 */
export interface RedactorDomChangedPayload {
  /**
   * Mutations happened with blocks wrapper
   */
  mutations: MutationRecord[];
}
