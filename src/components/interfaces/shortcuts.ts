/**
 * Shortcuts Interface
 *
 * implements CodeX-Team shortcuts Module
 * @see https://github.com/codex-team/codex.shortcuts
 */
export default interface IShortcuts {

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
