import Module from '../../__module';
import IEditorConfig from '../../interfaces/editor-config';
import $ from '../../dom';
import _ from '../../utils';
import {BlockToolConstructable, ToolConstructable} from '../../interfaces/tools';

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
  public opened: boolean;
  public nodes: {
    toolbox: HTMLElement,
    buttons: HTMLElement[],
  };
  private activeButtonIndex: number;
  private displayedToolsCount: number;

  /**
   * @constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});

    this.nodes = {
      toolbox: null,
      buttons: [],
    };

    /**
     * Opening state
     * @type {boolean}
     */
    this.opened = false;

    /**
     * Active button index
     * -1 equals no chosen Tool
     * @type {number}
     */
    this.activeButtonIndex = -1;

    /**
     * How many tools displayed in Toolbox
     * @type {number}
     */
    this.displayedToolsCount = 0;
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
  public make(): void {
    this.nodes.toolbox = $.make('div', Toolbox.CSS.toolbox);
    $.append(this.Editor.Toolbar.nodes.content, this.nodes.toolbox);

    this.addTools();
  }

  /**
   * Toolbox Tool's button click handler
   *
   * @param {MouseEvent|KeyboardEvent} event
   * @param {string} toolName
   */
  public toolButtonActivate(event: MouseEvent|KeyboardEvent, toolName: string): void {
    const tool = this.Editor.Tools.toolsClasses[toolName];

    this.insertNewBlock(tool, toolName);
  }

  /**
   * Open Toolbox with Tools
   */
  public open(): void {
    if (this.isEmpty) {
      return;
    }

    this.nodes.toolbox.classList.add(Toolbox.CSS.toolboxOpened);
    this.opened = true;
  }

  /**
   * Close Toolbox
   */
  public close(): void {
    this.nodes.toolbox.classList.remove(Toolbox.CSS.toolboxOpened);
    this.opened = false;

    /** remove active item pointer */
    this.activeButtonIndex = -1;
    const activeButton = this.nodes.toolbox.querySelector(`.${Toolbox.CSS.toolboxButtonActive}`);

    if (activeButton) {
      activeButton.classList.remove(Toolbox.CSS.toolboxButtonActive);
    }
  }

  /**
   * Close Toolbox
   */
  public toggle(): void {
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
  public leaf(direction: string = 'right'): void {
    const childNodes = this.nodes.toolbox.childNodes;

    /**
     * If activeButtonIndex === -1 then we have no chosen Tool in Toolbox
     */
    if (this.activeButtonIndex === -1) {
      /**
       * Normalize "previous" Tool index depending on direction.
       * We need to do this to highlight "first" Tool correctly
       *
       * Order of Tools: [0] [1] ... [n - 1]
       *   [0 = n] because of: n % n = 0 % n
       *
       * Direction 'right': for [0] the [n - 1] is a previous index
       *   [n - 1] -> [0]
       *
       * Direction 'left': for [n - 1] the [0] is a previous index
       *   [n - 1] <- [0]
       *
       * @type {number}
       */
      this.activeButtonIndex = direction === 'right' ? -1 : 0;
    } else {
      /**
       * If we have chosen Tool then remove highlighting
       */
      (childNodes[this.activeButtonIndex] as HTMLElement).classList.remove(Toolbox.CSS.toolboxButtonActive);
    }

    /**
     * Count index for next Tool
     */
    if (direction === 'right') {
      /**
       * If we go right then choose next (+1) Tool
       * @type {number}
       */
      this.activeButtonIndex = (this.activeButtonIndex + 1) % childNodes.length;
    } else {
      /**
       * If we go left then choose previous (-1) Tool
       * Before counting module we need to add length before because of "The JavaScript Modulo Bug"
       * @type {number}
       */
      this.activeButtonIndex = (childNodes.length + this.activeButtonIndex - 1) % childNodes.length;
    }

    /**
     * Highlight new chosen Tool
     */
    (childNodes[this.activeButtonIndex] as HTMLElement).classList.add(Toolbox.CSS.toolboxButtonActive);
  }

  /**
   * get tool name when it is selected
   * In case when nothing selection returns null
   *
   * @return {String|null}
   */
  public get getActiveTool(): string {
    const childNodes = this.nodes.toolbox.childNodes;

    if (this.activeButtonIndex === -1) {
      return null;
    }

    return (childNodes[this.activeButtonIndex] as HTMLElement).title;
  }

  /**
   * Returns True if Toolbox is Empty and nothing to show
   * @return {boolean}
   */
  public get isEmpty(): boolean {
    return this.displayedToolsCount === 0;
  }

  /**
   * Iterates available tools and appends them to the Toolbox
   */
  private addTools(): void {
    const tools = this.Editor.Tools.toolsAvailable;

    for (const toolName in tools) {
      if (tools.hasOwnProperty(toolName)) {
        this.addTool(toolName, tools[toolName]);
      }
    }
  }

  /**
   * Append Tool to the Toolbox
   *
   * @param {string} toolName - tool name
   * @param {IBlockTool} tool - tool class
   */
  private addTool(toolName: string, tool: BlockToolConstructable): void {
    const api = this.Editor.Tools.apiSettings;

    if (tool[api.IS_DISPLAYED_IN_TOOLBOX] && !tool[api.TOOLBAR_ICON]) {
      _.log('Toolbar icon is missed. Tool %o skipped', 'warn', toolName);
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

    const button = $.make('li', [ Toolbox.CSS.toolboxButton ], {
      title: toolName,
    });

    button.innerHTML = tool.toolboxIcon;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * Add click listener
     */
    this.Editor.Listeners.on(button, 'click', (event: KeyboardEvent|MouseEvent) => {
      this.toolButtonActivate(event, toolName);
    });

    /**
     * Enable shortcut
     */
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);

    if (toolSettings && toolSettings[this.Editor.Tools.apiSettings.SHORTCUT]) {
      this.enableShortcut(tool, toolName, toolSettings[this.Editor.Tools.apiSettings.SHORTCUT]);
    }

    /** Increment Tools count */
    this.displayedToolsCount++;
  }

  /**
   * Enable shortcut Block Tool implemented shortcut
   * @param {IBlockTool} tool - Tool class
   * @param {String} toolName - Tool name
   * @param {String} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcut(tool: ToolConstructable, toolName: string, shortcut: string) {
    this.Editor.Shortcuts.add({
      name: shortcut,
      handler: (event: KeyboardEvent) => {
        event.preventDefault();
        this.insertNewBlock(tool, toolName);
      },
    });
  }

  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {IBlockTool} tool - Tool Class
   * @param {String} toolName - Tool name
   */
  private insertNewBlock(tool: ToolConstructable, toolName: string) {
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
     * close toolbar when node is changed
     */
    this.Editor.Toolbar.close();
  }
}
