/**
 * Internal Shortcuts Module
 *
 * Register all methods to save state
 */
import Shortcut from '@codexteam/shortcuts';
import IShortcut from '../interfaces/shortcut';

/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
declare var Module: any;

export default class Shortcuts extends Module {

  /**
   * All registered shortcuts
   * @type {IShortcut[]}
   */
  private registeredShortcuts: IShortcut[];

  /**
   * @constructor
   */
  constructor({config}) {
    super({config});
    this.registeredShortcuts = [];
  }

  /**
   * Register shortcut
   * @param {IShortcut} shortcut
   */
  public add(shortcut: IShortcut): void {
    const newShortcut = new Shortcut({
      name: shortcut.name,
      on: document.body,
      callback: shortcut.handler,
    });

    this.registeredShortcuts.push(newShortcut);
  }

  /**
   * Remove shortcut
   * @param {IShortcut} shortcut
   */
  public remove(shortcut: string): void {
    // Remove
  }

}
