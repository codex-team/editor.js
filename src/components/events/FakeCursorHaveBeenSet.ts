/**
 * Fired after we've added/removed a fake cursor.
 *
 * Allows to enable mutation observer which was disabled before setting
 */
export const FakeCursorHaveBeenSet = 'fake cursor have been set';

/**
 * Payload that will be passed with the event
 */
export interface FakeCursorHaveBeenSetPayload {
  /**
   * true - when added a cursor
   * false - when removed
   */
  state: boolean;
}
