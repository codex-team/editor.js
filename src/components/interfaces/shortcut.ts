/**
 * Shortcut Interface
 *
 * implements CodeX-Team shortcuts Module
 * @see https://github.com/codex-team/codex.shortcuts
 */
export default interface IShortcut {

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
