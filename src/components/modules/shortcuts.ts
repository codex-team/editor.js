import Shortcut from '@codexteam/shortcuts';
import {ShortcutData} from '../interfaces/shortcuts';
import IEditorConfig from '../interfaces/editor-config';

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
  private registeredShortcuts: Shortcut[];

  /**
   * @constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
    this.registeredShortcuts = [];
  }

  /**
   * Register shortcut
   * @param {ShortcutData} shortcut
   */
  public add(shortcut: ShortcutData): void {
    const newShortcut = new Shortcut({
      name: shortcut.name,
      on: document,
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
