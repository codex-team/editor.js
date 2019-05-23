import Module from '../../__module';
import $ from '../../dom';

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
   * @return {{opened: string, closed: string}}
   */
  public get events(): {opened: string, closed: string} {
    return {
      opened: 'block-settings-opened',
      closed: 'block-settings-closed',
    };
  }

  /**
   * Block Settings CSS
   * @return {{wrapper, wrapperOpened, toolSettings, defaultSettings, button}}
   */
  private static get CSS() {
    return {
      // Settings Panel
      wrapper: 'ce-settings',
      wrapperOpened: 'ce-settings--opened',
      toolSettings: 'ce-settings__plugin-zone',
      defaultSettings: 'ce-settings__default-zone',

      button: 'ce-settings__button',

      focusedButton : 'ce-settings__button--focused',
    };
  }

  /**
   * Is Block Settings opened or not
   * @returns {boolean}
   */
  public get opened(): boolean {
    return this.nodes.wrapper.classList.contains(BlockSettings.CSS.wrapperOpened);
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
  private buttons: Node[] = [];

  /**
   * Index of active button
   */
  private focusedButtonIndex: number = -1;

  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   *
   * @return {Element}
   */
  public make(): void {
    this.nodes.wrapper = $.make('div', BlockSettings.CSS.wrapper);

    this.nodes.toolSettings = $.make('div', BlockSettings.CSS.toolSettings);
    this.nodes.defaultSettings = $.make('div', BlockSettings.CSS.defaultSettings);

    $.append(this.nodes.wrapper, [this.nodes.toolSettings, this.nodes.defaultSettings]);
  }

  /**
   * Open Block Settings pane
   */
  public open(): void {
    this.nodes.wrapper.classList.add(BlockSettings.CSS.wrapperOpened);

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
  }

  /**
   * Close Block Settings pane
   */
  public close(): void {
    this.nodes.wrapper.classList.remove(BlockSettings.CSS.wrapperOpened);

    /** Clear settings */
    this.nodes.toolSettings.innerHTML = '';
    this.nodes.defaultSettings.innerHTML = '';

    /** Tell to subscribers that block settings is closed */
    this.Editor.Events.emit(this.events.closed);

    /** Clear cached buttons */
    this.buttons = [];

    /** Clear focus on active button */
    this.focusedButtonIndex = -1;

  }

  /**
   * Returns Tools Settings and Default Settings
   * @return {HTMLElement[]}
   */
  public get blockTunesButtons(): Node[] {
    /**
     * Return from cache
     * if exists
     */
    if (this.buttons.length !== 0) {
      return this.buttons;
    }

    const toolSettings = this.nodes.toolSettings.querySelectorAll(`.${this.Editor.StylesAPI.classes.settingsButton}`);
    const defaultSettings = this.nodes.defaultSettings.querySelectorAll(`.${BlockSettings.CSS.button}`);

    toolSettings.forEach((item, index) => {
      this.buttons.push(item);
      if (item.classList.contains(BlockSettings.CSS.focusedButton)) {
        this.focusedButtonIndex = index;
      }
    });

    defaultSettings.forEach((item) => {
      this.buttons.push(item);
    });

    return this.buttons;
  }

  /**
   * Leaf Block Tunes
   * @param {string} direction
   */
  public leaf(direction: string = 'right'): void {
    this.focusedButtonIndex = $.leafNodesAndReturnIndex(this.blockTunesButtons, this.focusedButtonIndex, direction, BlockSettings.CSS.focusedButton);
  }

  /**
   * Returns active button HTML element
   * @return {HTMLElement}
   */
  public get focusedButton(): HTMLElement {
    if (this.focusedButtonIndex === -1) {
      return null;
    }

    return (this.buttons[this.focusedButtonIndex] as HTMLElement);
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
}
