/**
 * Fired when editor mobile layout toggled
 */
export const EditorMobileLayoutToggled = 'editor mobile layout toggled';

/**
 * Payload that will be passed with the event
 */
export interface EditorMobileLayoutToggledPayload {
  /**
   * True, if mobile layout enabled
   */
  isEnabled: boolean;
}

