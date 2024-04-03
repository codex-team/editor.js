/**
 * Fired when window is resized
 */
export const WindowResize = 'window resize';

/**
 * Payload that will be passed with the event
 */
export interface WindowResizePayload {
  /**
   * True, if new window size is mobile
   */
  isMobile: boolean;
}

