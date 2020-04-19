import Module from '../../__module';
import $ from '../../dom';
import Flipper, { FlipperOptions } from '../../flipper';
import * as _ from '../../utils';

/**
 * Block Settings
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 */
export default class BlockSettings extends Module {
  /**
   * Module Events
   *
   * @returns {{opened: string, closed: string}}
   */
  public get events(): {opened: string; closed: string} {
    return {
      opened: 'block-settings-opened',
      closed: 'block-settings-closed',
    };
  }

  /**
   * Block Settings CSS
   *
   * @returns {{wrapper, wrapperOpened, toolSettings, defaultSettings, button}}
   */
  public get CSS(): {[name: string]: string} {
    return {
      // Settings Panel
      wrapper: 'ce-settings',
      wrapperOpened: 'ce-settings--opened',
      toolSettings: 'ce-settings__plugin-zone',
      defaultSettings: 'ce-settings__default-zone',

      button: 'ce-settings__button',

      focusedButton: 'ce-settings__button--focused',
      focusedButtonAnimated: 'ce-settings__button--focused-animated',
    };
  }

  /**
   * Is Block Settings opened or not
   *
   * @returns {boolean}
   */
  public get opened(): boolean {
    return this.nodes.wrapper.classList.contains(this.CSS.wrapperOpened);
  }

  /**
   * Block settings UI HTML elements
   */
  public nodes: {[key: string]: HTMLElement} = {
    wrapper: null,
    toolSettings: null,
    defaultSettings: null,
  };

  /**
   * List of buttons
   */
  private buttons: HTMLElement[] = [];

  /**
   * Instance of class that responses for leafing buttons by arrows/tab
   *
   * @type {Flipper|null}
   */
  private flipper: Flipper = null;

  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   */
  public make(): void {
    this.nodes.wrapper = $.make('div', this.CSS.wrapper);

    this.nodes.toolSettings = $.make('div', this.CSS.toolSettings);
    this.nodes.defaultSettings = $.make('div', this.CSS.defaultSettings);

    $.append(this.nodes.wrapper, [this.nodes.toolSettings, this.nodes.defaultSettings]);

    /**
     * Active leafing by arrows/tab
     * Buttons will be filled on opening
     */
    this.enableFlipper();
  }

  /**
   * Open Block Settings pane
   */
  public open(): void {
    this.nodes.wrapper.classList.add(this.CSS.wrapperOpened);

    /**
     * Highlight content of a Block we are working with
     */
    this.Editor.BlockManager.currentBlock.selected = true;

    /**
     * Fill Tool's settings
     */
    this.addToolSettings();

    /**
     * Add default settings that presents for all Blocks
     */
    this.addDefaultSettings();

    /** Tell to subscribers that block settings is opened */
    this.Editor.Events.emit(this.events.opened);

    this.flipper.activate(this.blockTunesButtons);
  }

  /**
   * Close Block Settings pane
   */
  public close(): void {
    this.nodes.wrapper.classList.remove(this.CSS.wrapperOpened);

    /** Clear settings */
    this.nodes.toolSettings.innerHTML = '';
    this.nodes.defaultSettings.innerHTML = '';

    /** Tell to subscribers that block settings is closed */
    this.Editor.Events.emit(this.events.closed);

    /** Clear cached buttons */
    this.buttons = [];

    /** Clear focus on active button */
    this.flipper.deactivate();
  }

  /**
   * Returns Tools Settings and Default Settings
   *
   * @returns {HTMLElement[]}
   */
  public get blockTunesButtons(): HTMLElement[] {
    /**
     * Return from cache
     * if exists
     */
    if (this.buttons.length !== 0) {
      return this.buttons;
    }

    const toolSettings = this.nodes.toolSettings.querySelectorAll(`.${this.Editor.StylesAPI.classes.settingsButton}`);
    const defaultSettings = this.nodes.defaultSettings.querySelectorAll(`.${this.CSS.button}`);

    toolSettings.forEach((item) => {
      this.buttons.push((item as HTMLElement));
    });

    defaultSettings.forEach((item) => {
      this.buttons.push((item as HTMLElement));
    });

    return this.buttons;
  }

  /**
   * Add Tool's settings
   */
  private addToolSettings(): void {
    if (typeof this.Editor.BlockManager.currentBlock.tool.renderSettings === 'function') {
      $.append(this.nodes.toolSettings, this.Editor.BlockManager.currentBlock.tool.renderSettings());
    }
  }

  /**
   * Add default settings
   */
  private addDefaultSettings(): void {
    $.append(this.nodes.defaultSettings, this.Editor.BlockManager.currentBlock.renderTunes());
  }

  /**
   * Active leafing by arrows/tab
   * Buttons will be filled on opening
   */
  private enableFlipper(): void {
    this.flipper = new Flipper({
      focusedItemClass: this.CSS.focusedButton,
      activateCallback: () => {
        /**
         * Restoring focus on current Block after settings clicked.
         * For example, when H3 changed to H2 — DOM Elements replaced, so we need to focus a new one
         */
        _.delay(() => {
          this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock);
        }, 10)();
      },
    } as FlipperOptions);
  }
}
