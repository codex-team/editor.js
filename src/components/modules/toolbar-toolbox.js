import IEditorConfig from '../interfaces/editor-config';

/**
 * @class Toolbox
 * @classdesc Holder for Tools
 *
 * @typedef {Toolbox} Toolbox
 * @property {Boolean} opened - opening state
 * @property {Object} nodes   - Toolbox nodes
 * @property {Object} CSS     - CSS class names
 *
 */
export default class Toolbox extends Module {
  /**
   * @constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});

    this.nodes = {
      toolbox: null,
      buttons: []
    };

    /**
     * Opening state
     * @type {boolean}
     */
    this.opened = false;
  }

  /**
   * CSS styles
   * @return {{toolbox: string, toolboxButton: string, toolboxOpened: string}}
   */
  static get CSS() {
    return  {
      toolbox: 'ce-toolbox',
      toolboxButton: 'ce-toolbox__button',
      toolboxOpened: 'ce-toolbox--opened',
    };
  }

  /**
   * Makes the Toolbox
   */
  make() {
    this.nodes.toolbox = $.make('div', Toolbox.CSS.toolbox);
    $.append(this.Editor.Toolbar.nodes.content, this.nodes.toolbox);

    this.addTools();
  }

  /**
   * Iterates available tools and appends them to the Toolbox
   */
  addTools() {
    let tools = this.Editor.Tools.toolsAvailable;

    for (let toolName in tools) {
      this.addTool(toolName, tools[toolName]);
    }
  }

  /**
   * Append Tool to the Toolbox
   *
   * @param {string} toolName - tool name
   * @param {IBlockTool} tool - tool class
   */
  addTool(toolName, tool) {
    const api = this.Editor.Tools.apiSettings;

    if (tool[api.IS_DISPLAYED_IN_TOOLBOX] && !tool[api.TOOLBAR_ICON_CLASS]) {
      _.log('Toolbar icon class name is missed. Tool %o skipped', 'warn', toolName);
      return;
    }

    /**
     * @todo Add checkup for the render method
     */
    // if (typeof tool.render !== 'function') {
    //   _.log('render method missed. Tool %o skipped', 'warn', tool);
    //   return;
    // }

    /**
     * Skip tools that pass 'displayInToolbox=false'
     */
    if (!tool[api.IS_DISPLAYED_IN_TOOLBOX]) {
      return;
    }

    let button = $.make('li', [Toolbox.CSS.toolboxButton, tool[api.TOOLBAR_ICON_CLASS]], {
      title: toolName
    });

    button.innerHTML = tool.toolboxIcon;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * Add click listener
     */
    this.Editor.Listeners.on(button, 'click', (event) => {
      this.toolButtonClicked(event, toolName);
    });

    /**
     * Enable shortcut
     */
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);

    if (toolSettings && toolSettings[this.Editor.Tools.apiSettings.SHORTCUT]) {
      this.enableShortcut(tool, toolName, toolSettings[this.Editor.Tools.apiSettings.SHORTCUT]);
    }
  }

  /**
   * Enable shortcut Block Tool implemented shortcut
   * @param {IBlockTool} tool - Tool class
   * @param {String} toolName - Tool name
   * @param {String} shortcut - shortcut according to the Shortcut Module format
   */
  enableShortcut(tool, toolName, shortcut) {
    this.Editor.Shortcuts.add({
      name: shortcut,
      handler: (event) => {
        event.preventDefault();
        this.insertNewBlock(tool, toolName);
      }
    });
  }

  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by Shortcut
   *
   * @param {IBlockTool} tool - Tool Class
   * @param {String} toolName - Tool name
   */
  insertNewBlock(tool, toolName) {
    /**
     * @type {Block}
     */
    const currentBlock = this.Editor.BlockManager.currentBlock;

    /**
     * We do replace if:
     * - block is empty
     * - block is not irreplaceable
     * @type {Array}
     */
    let newBlock;

    if (!tool[this.Editor.Tools.apiSettings.IS_IRREPLACEBLE_TOOL] && currentBlock.isEmpty) {
      newBlock = this.Editor.BlockManager.replace(toolName);
    } else {
      newBlock = this.Editor.BlockManager.insert(toolName);
    }

    this.Editor.Caret.setToBlock(newBlock);

    /**
     * Move toolbar when node is changed
     */
    this.Editor.Toolbar.move();
  }

  /**
   * Toolbox Tool's button click handler
   *
   * @param {MouseEvent} event
   * @param {string} toolName
   */
  toolButtonClicked(event, toolName) {
    const tool = this.Editor.Tools.toolsClasses[toolName];

    this.insertNewBlock(tool, toolName);
  }

  /**
   * Open Toolbox with Tools
   */
  open() {
    this.nodes.toolbox.classList.add(Toolbox.CSS.toolboxOpened);
    this.opened = true;
  }

  /**
   * Close Toolbox
   */
  close() {
    this.nodes.toolbox.classList.remove(Toolbox.CSS.toolboxOpened);
    this.opened = false;
  }

  /**
   * Close Toolbox
   */
  toggle() {
    if (!this.opened) {
      this.open();
    } else {
      this.close();
    }
  }
}
