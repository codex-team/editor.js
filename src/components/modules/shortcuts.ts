
import Shortcut from '@codexteam/shortcuts';
import {IShortcut, IShortcuts} from '../interfaces/shortcuts';
import IEditorConfig from '../interfaces/editor-config';

/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
declare var Module: any;

/**
 * @class Shortcut
 * @classdesc Allows to register new shortcut
 *
 * Internal Shortcuts Module
 */
export default class Shortcuts extends Module implements IShortcuts {
  /**
   * All registered shortcuts
   * @type {IShortcut[]}
   */
  private registeredShortcuts: IShortcut[];

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
   * @param {IShortcut} shortcut
   */
  public add(shortcut: IShortcut): void {
    const newShortcut = new Shortcut({
      name: shortcut.name,
      on: document,
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
