import Module from '../__module';

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
   * @constructor
   */
  constructor({config}) {
    super({config});

    this.nodes = {
      wrapper: null,
      toolSettings: null,
      defaultSettings: null
    };
  }

  /**
   * Module Events
   * @return {{opened: string, closed: string}}
   */
  get events() {
    return {
      opened: 'block-settings-opened',
      closed: 'block-settings-closed',
    };
  }

  /**
   * Block Settings CSS
   * @return {{wrapper, wrapperOpened, toolSettings, defaultSettings, button}}
   */
  static get CSS() {
    return {
      // Settings Panel
      wrapper: 'ce-settings',
      wrapperOpened: 'ce-settings--opened',
      toolSettings: 'ce-settings__plugin-zone',
      defaultSettings: 'ce-settings__default-zone',

      button: 'ce-settings__button'
    };
  }

  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   *
   * @return {Element}
   */
  make() {
    this.nodes.wrapper = $.make('div', BlockSettings.CSS.wrapper);

    this.nodes.toolSettings = $.make('div', BlockSettings.CSS.toolSettings);
    this.nodes.defaultSettings = $.make('div', BlockSettings.CSS.defaultSettings);

    $.append(this.nodes.wrapper, [this.nodes.toolSettings, this.nodes.defaultSettings]);
  }

  /**
   * Add Tool's settings
   */
  addToolSettings() {
    if (typeof this.Editor.BlockManager.currentBlock.tool.renderSettings === 'function') {
      $.append(this.nodes.toolSettings, this.Editor.BlockManager.currentBlock.tool.renderSettings());
    }
  }

  /**
   * Add default settings
   */
  addDefaultSettings() {
    $.append(this.nodes.defaultSettings, this.Editor.BlockManager.currentBlock.renderTunes());
  }

  /**
   * Is Block Settings opened or not
   * @returns {boolean}
   */
  get opened() {
    return this.nodes.wrapper.classList.contains(BlockSettings.CSS.wrapperOpened);
  }

  /**
   * Open Block Settings pane
   */
  open() {
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
  close() {
    this.nodes.wrapper.classList.remove(BlockSettings.CSS.wrapperOpened);

    /** Clear settings */
    this.nodes.toolSettings.innerHTML = '';
    this.nodes.defaultSettings.innerHTML = '';

    /** Tell to subscribers that block settings is closed */
    this.Editor.Events.emit(this.events.closed);
  }
}
