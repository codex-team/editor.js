/**
 * ShortcutData interface
 * Each shortcut must have name and handler
 * `name` is a shortcut, like 'CMD+K', 'CMD+B' etc
 * `handler` is a callback
 */
export interface ShortcutData {

  /**
   * Shortcut name
   * Ex. CMD+I, CMD+B ....
   */
  name: string;

  /**
   * Shortcut handler
   */
  handler(event): void;
}
