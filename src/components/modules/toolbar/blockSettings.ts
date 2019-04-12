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
  private buttons: HTMLElement[] = [];

  /**
   * Index of active button
   */
  private activeButtonIndex: number = -1;

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
    this.activeButtonIndex = -1;

  }

  /**
   * @todo optimize
   * @return {HTMLElement[]}
   */
  public blockTunesButtons(): HTMLElement[] {
    /**
     * Return from cache
     */
    if (this.buttons.length !== 0) {
      return this.buttons;
    }

    const toolSettings = this.nodes.toolSettings.querySelectorAll(`.${this.Editor.StylesAPI.classes.settingsButton}`);
    const defaultSettings = this.nodes.defaultSettings.querySelectorAll(`.${BlockSettings.CSS.button}`);

    const allSettings = [];
    toolSettings.forEach((item, index) => {
      allSettings.push(item);
      if (item.classList.contains('cdx-settings-button--active')) {
        this.activeButtonIndex = index;
      }
    });

    defaultSettings.forEach((item) => {
      allSettings.push(item);
    });

    this.buttons = allSettings;
    return this.buttons;
  }

  /**
   * Leaf Block tunes
   */
  public leaf(direction: string = 'right'): void {
    const buttonsList = this.blockTunesButtons();
    this.activeButtonIndex = $.leafNodes(buttonsList, this.activeButtonIndex, direction);
  }

  /**
   * @return {HTMLElement}
   */
  public get getActiveButton(): HTMLElement {
    if (this.activeButtonIndex === -1) {
      return null;
    }

    return this.buttons[this.activeButtonIndex];
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
