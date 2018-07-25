/**
 * Shortcuts Interface
 *
 * implements CodeX-Team shortcuts Module
 * @see https://github.com/codex-team/codex.shortcuts
 */
export interface IShortcuts {

  /**
   * Adds shortcut
   * @param {IShortcut} shortcut
   */
  add(shortcut: IShortcut): void;

  /**
   * removes shortcut
   * @param {string} shortcut
   */
  remove(shortcut: string): void;
}

/**
 * Shortcut interface
 * Each shortcut must have name and handler
 * `name` is a shortcut, like 'CMD+K', 'CMD+B' etc
 * `handler` is a callback
 */
export interface IShortcut {

  /**
   * Shortcut name
   * Ex. CMD+I, CMD+B ....
   */
  name: string;

  /**
   * Shortcut handler
   */
  handler(event): (event) => void;
}
