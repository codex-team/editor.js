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

    /**
     * Active button index
     * @type {number}
     */
    this.activeButtonIndex = -1;
  }

  /**
   * CSS styles
   * @return {{toolbox: string, toolboxButton: string, toolboxOpened: string}}
   */
  static get CSS() {
    return  {
      toolbox: 'ce-toolbox',
      toolboxButton: 'ce-toolbox__button',
      toolboxButtonActive : 'ce-toolbox__button--active',
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

    /** Add listener to click */
    this.Editor.Listeners.on(button, 'click', (event) => {
      this.toolButtonClicked(event, toolName);
    });

    /** Enable shortcut */
    const toolsConfig = this.config.toolsConfig[toolName];

    if (toolsConfig && toolsConfig[this.Editor.Tools.apiSettings.SHORTCUT]) {
      this.enableShortcut(tool, toolName, toolsConfig[this.Editor.Tools.apiSettings.SHORTCUT]);
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
    const tool = this.Editor.Tools.toolClasses[toolName];

    this.insertNewBlock(tool, toolName);
  }

  /**
   * handle cases when active tool in toolbox pressed
   * @param {string} toolName
   */
  selectItem(toolName) {
    let newBlock;

    /**
     * if current block is empty then replace to selected tool
     */
    if (this.Editor.BlockManager.currentBlock.isEmpty) {
      newBlock = this.Editor.BlockManager.replace(toolName);
    } else {
      newBlock = this.Editor.BlockManager.insert(toolName);
    }

    this.Editor.Caret.setToBlock(newBlock);
    this.Editor.Toolbar.close();
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

    /** remove active item pointer */
    this.activeButtonIndex = -1;
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

  /**
   * Leaf
   * flip through the toolbox items
   * @param {String} direction - leaf direction, right is default
   */
  leaf(direction = 'right') {
    const childNodes = this.nodes.toolbox.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i].classList.contains(Toolbox.CSS.toolboxButtonActive)) {
        this.activeButtonIndex = i;
        childNodes[this.activeButtonIndex].classList.remove(Toolbox.CSS.toolboxButtonActive);
        break;
      }
    }

    /**
     * if there is no active button set to first toolbox item
     * or leaf if currently some item is active
     */
    if (this.activeButtonIndex === -1) {
      this.activeButtonIndex = 0;
    } else {
      this.activeButtonIndex = (this.activeButtonIndex + 1) % childNodes.length;
    }

    if (direction === 'left') {
      this.activeButtonIndex = childNodes.length - this.activeButtonIndex;
    }

    childNodes[this.activeButtonIndex].classList.add(Toolbox.CSS.toolboxButtonActive);
  }

  /**
   * get tool name when it is selected
   * In case when nothing selection returns null
   *
   * @return {String|null}
   */
  get getActiveTool() {
    const childNodes = this.nodes.toolbox.childNodes;

    if (this.activeButtonIndex === -1) {
      return null;
    }

    return childNodes[this.activeButtonIndex].title;
  }
}
