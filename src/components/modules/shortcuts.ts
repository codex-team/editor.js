import Shortcut from '@codexteam/shortcuts';

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

/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
import Module from '../__module';

/**
 * @class Shortcut
 * @classdesc Allows to register new shortcut
 *
 * Internal Shortcuts Module
 */
export default class Shortcuts extends Module {
  /**
   * All registered shortcuts
   * @type {Shortcut[]}
   */
  private registeredShortcuts: Shortcut[] = [];

  /**
   * Register shortcut
   * @param {ShortcutData} shortcut
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
   * @param {ShortcutData} shortcut
   */
  public remove(shortcut: string): void {
    const index = this.registeredShortcuts.findIndex((shc) => shc.name === shortcut);

    this.registeredShortcuts[index].remove();
    this.registeredShortcuts.splice(index, 1);
  }
}
