import Module from '../../__module';
import $ from '../../dom';
import _ from '../../utils';
import {BlockToolConstructable, ToolboxConfig} from '../../../../types';

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

  private static LEAF_DIRECTIONS = {
    RIGHT: 'right',
    LEFT: 'left',
  };

  /**
   * Opening state
   * @type {boolean}
   */
  public opened: boolean = false;

  /**
   * HTMLElements used for Toolbox UI
   */
  public nodes: {
    toolbox: HTMLElement,
    buttons: HTMLElement[],
  } = {
    toolbox: null,
    buttons: [],
  };

  /**
   * Active button index
   * -1 equals no chosen Tool
   * @type {number}
   */
  private activeButtonIndex: number = -1;

  /**
   * How many tools displayed in Toolbox
   * @type {number}
   */
  private displayedToolsCount: number = 0;

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
    const tool = this.Editor.Tools.toolsClasses[toolName] as BlockToolConstructable;

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
  public leaf(direction: string = Toolbox.LEAF_DIRECTIONS.RIGHT): void {
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
      this.activeButtonIndex = direction === Toolbox.LEAF_DIRECTIONS.RIGHT ? -1 : 0;
    } else {
      /**
       * If we have chosen Tool then remove highlighting
       */
      (childNodes[this.activeButtonIndex] as HTMLElement).classList.remove(Toolbox.CSS.toolboxButtonActive);
    }

    /**
     * Count index for next Tool
     */
    if (direction === Toolbox.LEAF_DIRECTIONS.RIGHT) {
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

    return (childNodes[this.activeButtonIndex] as HTMLElement).dataset.tool;
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
    const tools = this.Editor.Tools.available;

    for (const toolName in tools) {
      if (tools.hasOwnProperty(toolName)) {
        this.addTool(toolName, tools[toolName]  as BlockToolConstructable);
      }
    }
  }

  /**
   * Append Tool to the Toolbox
   *
   * @param {string} toolName - tool name
   * @param {BlockToolConstructable} tool - tool class
   */
  private addTool(toolName: string, tool: BlockToolConstructable): void {
    const api = this.Editor.Tools.apiSettings;

    const toolToolboxSettings = tool[api.TOOLBOX];

    /**
     * Skip tools that don't pass 'toolbox' property
     */
    if (_.isEmpty(toolToolboxSettings)) {
      return;
    }

    if (toolToolboxSettings && !toolToolboxSettings.icon) {
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

    const {toolbox: userToolboxSettings = {} as ToolboxConfig} = this.Editor.Tools.getToolSettings(toolName);

    const button = $.make('li', [ Toolbox.CSS.toolboxButton ], {
      title: userToolboxSettings.title || toolToolboxSettings.title || toolName,
    });

    button.dataset.tool = toolName;
    button.innerHTML = userToolboxSettings.icon || toolToolboxSettings.icon;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * Add click listener
     */
    this.Editor.Listeners.add(button, 'click', (event: KeyboardEvent|MouseEvent) => {
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
   * @param {BlockToolConstructable} tool - Tool class
   * @param {String} toolName - Tool name
   * @param {String} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcut(tool: BlockToolConstructable, toolName: string, shortcut: string) {
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
   * @param {BlockToolConstructable} tool - Tool Class
   * @param {String} toolName - Tool name
   */
  private insertNewBlock(tool: BlockToolConstructable, toolName: string) {
    const {BlockManager, Caret} = this.Editor;
    /**
     * @type {Block}
     */
    const {currentBlock} = BlockManager;

    let newBlock;

    if (currentBlock.isEmpty) {
      newBlock = BlockManager.replace(toolName);
    } else {
      newBlock = BlockManager.insert(toolName);
    }

    /**
     * Apply callback before inserting html
     */
    newBlock.call('appendCallback', {});

    this.Editor.Caret.setToBlock(newBlock);

    /** If new block doesn't contain inpus, insert new paragraph above */
    if (newBlock.inputs.length === 0) {
      if (newBlock === BlockManager.lastBlock) {
        BlockManager.insertAtEnd();
        Caret.setToBlock(BlockManager.lastBlock);
      } else {
        Caret.setToBlock(BlockManager.nextBlock);
      }
    }

    /**
     * close toolbar when node is changed
     */
    this.Editor.Toolbar.close();
  }
}
