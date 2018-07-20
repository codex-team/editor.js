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
   * @param {string} toolName  - tool name
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
    //
    //     _.log('render method missed. Tool %o skipped', 'warn', tool);
    //     return;
    //
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

    button.innerHTML = tool.svgIcon;

    /**
     * Save tool's name in the button data-name
     */
    button.dataset.name = toolName;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * @todo add event with module Listeners
     */
    // this.Editor.Listeners.add();
    button.addEventListener('click', event => {
      this.buttonClicked(event);
    }, false);
  }

  /**
   * Toolbox button click listener
   * 1) if block is empty -> replace
   * 2) if block is not empty -> add new block below
   *
   * @param {MouseEvent} event
   */
  buttonClicked(event) {
    let toolButton = event.target;

    toolButton = toolButton.closest(`.${Toolbox.CSS.toolboxButton}`);

    if (!toolButton) {
      return;
    }

    let  toolName = toolButton.dataset.name,
      tool = this.Editor.Tools.toolClasses[toolName];

    /**
     * @type {Block}
     */
    let currentBlock = this.Editor.BlockManager.currentBlock;

    /**
     * We do replace if:
     * - block is empty
     * - block is not irreplaceable
     * @type {Array}
     */
    if (!tool[this.Editor.Tools.apiSettings.IS_IRREPLACEBLE_TOOL] && currentBlock.isEmpty) {
      this.Editor.BlockManager.replace(toolName);
    } else {
      this.Editor.BlockManager.insert(toolName);
    }

    /**
     * @todo set caret to the new block
     */

    // window.setTimeout(function () {

    /** Set caret to current block */
    // editor.caret.setToBlock(currentInputIndex);

    // }, 10);

    /**
     * Move toolbar when node is changed
     */
    this.Editor.Toolbar.move();
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
