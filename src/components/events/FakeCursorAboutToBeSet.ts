/**
 * Fired before we're adding/removing a fake cursor.
 *
 * Allows to disable mutation observer to skip this block change
 */
export const FakeCursorAboutToBeSet = 'fake cursor is about to be set';

/**
 * Payload that will be passed with the event
 */
export interface FakeCursorAboutToBeSetPayload {
  /**
   * true - when added a cursor
   * false - when removed
   */
  state: boolean;
}
