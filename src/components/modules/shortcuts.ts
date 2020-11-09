import Shortcut from '@codexteam/shortcuts';

/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
import Module from '../__module';

/**
 * ShortcutData interface
 * Each shortcut must have name and handler
 * `name` is a shortcut, like 'CMD+K', 'CMD+B' etc
 * `handler` is a callback
 *
 * @interface ShortcutData
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

/**
 * @class Shortcut
 * @classdesc Allows to register new shortcut
 *
 * Internal Shortcuts Module
 */
export default class Shortcuts extends Module {
  /**
   * All registered shortcuts
   *
   * @type {Shortcut[]}
   */
  private registeredShortcuts: Shortcut[] = [];

  /**
   * Register shortcut
   *
   * @param {ShortcutData} shortcut - shortcut options
   */
  public add(shortcut: ShortcutData): void {
    const newShortcut = new Shortcut({
      name: shortcut.name,
      on: document, // UI.nodes.redactor
      callback: shortcut.handler,
    });

    this.registeredShortcuts.push(newShortcut);
  }

  /**
   * Remove shortcut
   *
   * @param {string} shortcut - shortcut name
   */
  public remove(shortcut: string): void {
    const index = this.registeredShortcuts.findIndex((shc) => shc.name === shortcut);

    if (index === -1 || !this.registeredShortcuts[index]) {
      return;
    }

    this.registeredShortcuts[index].remove();
    this.registeredShortcuts.splice(index, 1);
  }
}
