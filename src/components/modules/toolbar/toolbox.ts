import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import { BlockToolConstructable, ToolConstructable } from '../../../../types';
import Flipper from '../../flipper';
import { BlockToolAPI } from '../../block';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Shortcuts from '../../utils/shortcuts';

/**
 * HTMLElements used for Toolbox UI
 */
interface ToolboxNodes {
  toolbox: HTMLElement;
  buttons: HTMLElement[];
}

/**
 * @class Toolbox
 * @classdesc Holder for Tools
 *
 * @typedef {Toolbox} Toolbox
 * @property {boolean} opened - opening state
 * @property {object} nodes   - Toolbox nodes
 * @property {object} CSS     - CSS class names
 *
 */
export default class Toolbox extends Module<ToolboxNodes> {
  /**
   * Current module HTML Elements
   */
  public nodes = {
    toolbox: null,
    buttons: [],
  }

  /**
   * CSS styles
   *
   * @returns {object.<string, string>}
   */
  public get CSS(): {[name: string]: string} {
    return {
      toolbox: 'ce-toolbox',
      toolboxButton: 'ce-toolbox__button',
      toolboxButtonActive: 'ce-toolbox__button--active',
      toolboxOpened: 'ce-toolbox--opened',
      openedToolbarHolderModifier: 'codex-editor--toolbox-opened',

      buttonTooltip: 'ce-toolbox-button-tooltip',
      buttonShortcut: 'ce-toolbox-button-tooltip__shortcut',
    };
  }

  /**
   * Returns True if Toolbox is Empty and nothing to show
   *
   * @returns {boolean}
   */
  public get isEmpty(): boolean {
    return this.displayedToolsCount === 0;
  }

  /**
   * Opening state
   *
   * @type {boolean}
   */
  public opened = false;

  /**
   * How many tools displayed in Toolbox
   *
   * @type {number}
   */
  private displayedToolsCount = 0;

  /**
   * Instance of class that responses for leafing buttons by arrows/tab
   *
   * @type {Flipper|null}
   */
  private flipper: Flipper = null;

  /**
   * Makes the Toolbox
   */
  public make(): void {
    this.nodes.toolbox = $.make('div', this.CSS.toolbox);

    this.addTools();
    this.enableFlipper();
  }

  /**
   * Destroy Module
   */
  public destroy(): void {
    /**
     * Sometimes (in read-only mode) there is no Flipper
     */
    if (this.flipper) {
      this.flipper.deactivate();
      this.flipper = null;
    }

    this.removeAllNodes();
    this.removeAllShortcuts();
  }

  /**
   * Toolbox Tool's button click handler
   *
   * @param {MouseEvent|KeyboardEvent} event - event that activates toolbox button
   * @param {string} toolName - button to activate
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

    this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolbarHolderModifier);
    this.nodes.toolbox.classList.add(this.CSS.toolboxOpened);

    this.opened = true;
    this.flipper.activate();
  }

  /**
   * Close Toolbox
   */
  public close(): void {
    this.nodes.toolbox.classList.remove(this.CSS.toolboxOpened);
    this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolbarHolderModifier);

    this.opened = false;
    this.flipper.deactivate();
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
   * Iterates available tools and appends them to the Toolbox
   */
  private addTools(): void {
    const tools = this.Editor.Tools.available;

    for (const toolName in tools) {
      if (Object.prototype.hasOwnProperty.call(tools, toolName)) {
        this.addTool(toolName, tools[toolName] as BlockToolConstructable);
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
    const internalSettings = this.Editor.Tools.INTERNAL_SETTINGS;
    const userSettings = this.Editor.Tools.USER_SETTINGS;

    const toolToolboxSettings = tool[internalSettings.TOOLBOX];

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

    const userToolboxSettings = this.Editor.Tools.getToolSettings(toolName)[userSettings.TOOLBOX];

    /**
     * Hide Toolbox button if Toolbox settings is false
     */
    if ((userToolboxSettings ?? toolToolboxSettings) === false) {
      return;
    }

    const button = $.make('li', [ this.CSS.toolboxButton ]);

    button.dataset.tool = toolName;
    button.innerHTML = (userToolboxSettings && userToolboxSettings.icon) || toolToolboxSettings.icon;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * Add click listener
     */
    this.listeners.on(button, 'click', (event: KeyboardEvent|MouseEvent) => {
      this.toolButtonActivate(event, toolName);
    });

    /**
     * Add listeners to show/hide toolbox tooltip
     */
    const tooltipContent = this.drawTooltip(toolName);

    this.Editor.Tooltip.onHover(button, tooltipContent, {
      placement: 'bottom',
      hidingDelay: 200,
    });

    const shortcut = this.getToolShortcut(toolName, tool);

    if (shortcut) {
      this.enableShortcut(tool, toolName, shortcut);
    }

    /** Increment Tools count */
    this.displayedToolsCount++;
  }

  /**
   * Returns tool's shortcut
   * It can be specified via internal 'shortcut' static getter or by user settings for tool
   *
   * @param {string} toolName - tool's name
   * @param {ToolConstructable} tool - tool's class (not instance)
   */
  private getToolShortcut(toolName: string, tool: ToolConstructable): string|null {
    /**
     * Enable shortcut
     */
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);
    const internalToolShortcut = tool[this.Editor.Tools.INTERNAL_SETTINGS.SHORTCUT];
    const userSpecifiedShortcut = toolSettings ? toolSettings[this.Editor.Tools.USER_SETTINGS.SHORTCUT] : null;

    return userSpecifiedShortcut || internalToolShortcut;
  }

  /**
   * Draw tooltip for toolbox tools
   *
   * @param {string} toolName - toolbox tool name
   * @returns {HTMLElement}
   */
  private drawTooltip(toolName: string): HTMLElement {
    const tool = this.Editor.Tools.available[toolName];
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);
    const toolboxSettings = this.Editor.Tools.available[toolName][this.Editor.Tools.INTERNAL_SETTINGS.TOOLBOX] || {};
    const userToolboxSettings = toolSettings.toolbox || {};
    const name = I18n.t(I18nInternalNS.toolNames, userToolboxSettings.title || toolboxSettings.title || toolName);

    let shortcut = this.getToolShortcut(toolName, tool);

    const tooltip = $.make('div', this.CSS.buttonTooltip);
    const hint = document.createTextNode(_.capitalize(name));

    tooltip.appendChild(hint);

    if (shortcut) {
      shortcut = _.beautifyShortcut(shortcut);

      tooltip.appendChild($.make('div', this.CSS.buttonShortcut, {
        textContent: shortcut,
      }));
    }

    return tooltip;
  }

  /**
   * Enable shortcut Block Tool implemented shortcut
   *
   * @param {BlockToolConstructable} tool - Tool class
   * @param {string} toolName - Tool name
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcut(tool: BlockToolConstructable, toolName: string, shortcut: string): void {
    Shortcuts.add({
      name: shortcut,
      handler: (event: KeyboardEvent) => {
        event.preventDefault();
        this.insertNewBlock(tool, toolName);
      },
      on: this.Editor.UI.nodes.redactor,
    });
  }

  /**
   * Removes all added shortcuts
   * Fired when the Read-Only mode is activated
   */
  private removeAllShortcuts(): void {
    const tools = this.Editor.Tools.available;

    for (const toolName in tools) {
      if (Object.prototype.hasOwnProperty.call(tools, toolName)) {
        const shortcut = this.getToolShortcut(toolName, tools[toolName]);

        if (shortcut) {
          Shortcuts.remove(this.Editor.UI.nodes.redactor, shortcut);
        }
      }
    }
  }

  /**
   * Creates Flipper instance to be able to leaf tools
   */
  private enableFlipper(): void {
    const tools = Array.from(this.nodes.toolbox.childNodes) as HTMLElement[];

    this.flipper = new Flipper({
      items: tools,
      focusedItemClass: this.CSS.toolboxButtonActive,
    });
  }

  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {BlockToolConstructable} tool - Tool Class
   * @param {string} toolName - Tool name
   */
  private insertNewBlock(tool: BlockToolConstructable, toolName: string): void {
    const { BlockManager, Caret } = this.Editor;
    const { currentBlock } = BlockManager;

    const newBlock = BlockManager.insert({
      tool: toolName,
      replace: currentBlock.isEmpty,
    });

    /**
     * Apply callback before inserting html
     */
    newBlock.call(BlockToolAPI.APPEND_CALLBACK);

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
