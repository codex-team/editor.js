import Shortcut from '@codexteam/shortcuts';

/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */

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

  /**
   * Element handler should be added for
   */
  on: HTMLElement;
}

/**
 * @class Shortcut
 * @classdesc Allows to register new shortcut
 *
 * Internal Shortcuts Module
 */
class Shortcuts {
  /**
   * All registered shortcuts
   *
   * @type {Map<Element, Shortcut[]>}
   */
  private registeredShortcuts: Map<Element, Shortcut[]> = new Map();

  /**
   * Register shortcut
   *
   * @param shortcut - shortcut options
   */
  public add(shortcut: ShortcutData): void {
    const foundShortcut = this.findShortcut(shortcut.on, shortcut.name);

    if (foundShortcut) {
      throw Error(
        `Shortcut ${shortcut.name} is already registered for ${shortcut.on}. Please remove it before add a new handler.`
      );
    }

    const newShortcut = new Shortcut({
      name: shortcut.name,
      on: shortcut.on,
      callback: shortcut.handler,
    });
    const shortcuts = this.registeredShortcuts.get(shortcut.on) || [];

    this.registeredShortcuts.set(shortcut.on, [...shortcuts, newShortcut]);
  }

  /**
   * Remove shortcut
   *
   * @param element - Element shortcut is set for
   * @param name - shortcut name
   */
  public remove(element: Element, name: string): void {
    const shortcut = this.findShortcut(element, name);

    if (!shortcut) {
      return;
    }

    shortcut.remove();

    const shortcuts = this.registeredShortcuts.get(element);

    this.registeredShortcuts.set(element, shortcuts.filter(el => el !== shortcut));
  }

  /**
   * Get Shortcut instance if exist
   *
   * @param element - Element shorcut is set for
   * @param shortcut - shortcut name
   *
   * @returns {number} index - shortcut index if exist
   */
  private findShortcut(element: Element, shortcut: string): Shortcut | void {
    const shortcuts = this.registeredShortcuts.get(element) || [];

    return shortcuts.find(({ name }) => name === shortcut);
  }
}

export default new Shortcuts();
