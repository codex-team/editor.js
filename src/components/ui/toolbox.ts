import $ from '../dom';
import * as _ from '../utils';
import Flipper from '../flipper';
import { BlockToolAPI } from '../block';
import I18n from '../i18n';
import { I18nInternalNS } from '../i18n/namespace-internal';
import Shortcuts from '../utils/shortcuts';
import Tooltip from '../utils/tooltip';
import BlockTool from '../tools/block';
import ToolsCollection from '../tools/collection';
import { API, BlockAPI } from '../../../types';
import EventsDispatcher from '../utils/events';

/**
 * Event that can be triggered by the Toolbox
 */
export enum ToolboxEvent {
  /**
   * When the Toolbox is opened
   */
  Opened = 'toolbox-opened',

  /**
   * When the Toolbox is closed
   */
  Closed = 'toolbox-closed',

  /**
   * When the new Block added by Toolbox
   */
  BlockAdded = 'toolbox-block-added',
}

/**
 * Toolbox
 * This UI element contains list of Block Tools available to be inserted
 * It appears after click on the Plus Button
 *
 * @implements EventsDispatcher with some events, see {@link ToolboxEvent}
 */
export default class Toolbox extends EventsDispatcher<ToolboxEvent> {
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
   * Editor API
   */
  private api: API;

  /**
   * List of Tools available. Some of them will be shown in the Toolbox
   */
  private tools: ToolsCollection<BlockTool>;

  /**
   * Element that will be used as parent for Shortcuts keydowns binding
   */
  private readonly shortcutsScopeElement: Element;

  /**
   * Current module HTML Elements
   */
  private nodes: {
    toolbox: HTMLElement;
    buttons: HTMLElement[];
  } = {
    toolbox: null,
    buttons: [],
  }

  /**
   * CSS styles
   *
   * @returns {object.<string, string>}
   */
  private static get CSS(): { [name: string]: string } {
    return {
      toolbox: 'ce-toolbox',
      toolboxButton: 'ce-toolbox__button',
      toolboxButtonActive: 'ce-toolbox__button--active',
      toolboxOpened: 'ce-toolbox--opened',

      buttonTooltip: 'ce-toolbox-button-tooltip',
      buttonShortcut: 'ce-toolbox-button-tooltip__shortcut',
    };
  }

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
   * Tooltip utility Instance
   */
  private tooltip: Tooltip;

  /**
   * Id of listener added used to remove it on destroy()
   */
  private clickListenerId: string = null;

  /**
   * Toolbox constructor
   *
   * @param options - available parameters
   * @param options.api - Editor API methods
   * @param options.tools - Tools available to check whether some of them should be displayed at the Toolbox or not
   * @param options.shortcutsScopeElement - parent element for Shortcuts scope restriction
   */
  constructor({ api, tools, shortcutsScopeElement }) {
    super();

    this.api = api;
    this.tools = tools;
    this.shortcutsScopeElement = shortcutsScopeElement;

    this.tooltip = new Tooltip();
  }

  /**
   * Returns true if the Toolbox has the Flipper activated and the Flipper has selected button
   */
  public get flipperHasFocus(): boolean {
    return this.flipper && this.flipper.currentItem !== null;
  }

  /**
   * Makes the Toolbox
   */
  public make(): Element {
    this.nodes.toolbox = $.make('div', Toolbox.CSS.toolbox);

    this.addTools();
    this.enableFlipper();

    return this.nodes.toolbox;
  }

  /**
   * Destroy Module
   */
  public destroy(): void {
    super.destroy();

    /**
     * Sometimes (in read-only mode) there is no Flipper
     */
    if (this.flipper) {
      this.flipper.deactivate();
      this.flipper = null;
    }

    if (this.nodes && this.nodes.toolbox) {
      this.nodes.toolbox.remove();
      this.nodes.toolbox = null;
      this.nodes.buttons = [];
    }

    this.api.listeners.offById(this.clickListenerId);

    this.removeAllShortcuts();
    this.tooltip.destroy();
  }

  /**
   * Toolbox Tool's button click handler
   *
   * @param {MouseEvent|KeyboardEvent} event - event that activates toolbox button
   * @param {string} toolName - button to activate
   */
  public toolButtonActivate(event: MouseEvent|KeyboardEvent, toolName: string): void {
    this.insertNewBlock(toolName);
  }

  /**
   * Open Toolbox with Tools
   */
  public open(): void {
    if (this.isEmpty) {
      return;
    }

    this.emit(ToolboxEvent.Opened);

    this.nodes.toolbox.classList.add(Toolbox.CSS.toolboxOpened);

    this.opened = true;
    this.flipper.activate();
  }

  /**
   * Close Toolbox
   */
  public close(): void {
    this.emit(ToolboxEvent.Closed);

    this.nodes.toolbox.classList.remove(Toolbox.CSS.toolboxOpened);

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
    Array
      .from(this.tools.values())
      .forEach((tool) => this.addTool(tool));
  }

  /**
   * Append Tool to the Toolbox
   *
   * @param {BlockToolConstructable} tool - BlockTool object
   */
  private addTool(tool: BlockTool): void {
    const toolToolboxSettings = tool.toolbox;

    /**
     * Skip tools that don't pass 'toolbox' property
     */
    if (!toolToolboxSettings) {
      return;
    }

    if (toolToolboxSettings && !toolToolboxSettings.icon) {
      _.log('Toolbar icon is missed. Tool %o skipped', 'warn', tool.name);

      return;
    }

    /**
     * @todo Add checkup for the render method
     */
    // if (typeof tool.render !== 'function') {
    //   _.log('render method missed. Tool %o skipped', 'warn', tool);
    //   return;
    // }

    const button = $.make('li', [ Toolbox.CSS.toolboxButton ]);

    button.dataset.tool = tool.name;
    button.innerHTML = toolToolboxSettings.icon;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * Add click listener
     */
    this.clickListenerId = this.api.listeners.on(button, 'click', (event: KeyboardEvent|MouseEvent) => {
      this.toolButtonActivate(event, tool.name);
    });

    /**
     * Add listeners to show/hide toolbox tooltip
     */
    const tooltipContent = this.drawTooltip(tool);

    this.tooltip.onHover(button, tooltipContent, {
      placement: 'bottom',
      hidingDelay: 200,
    });

    const shortcut = tool.shortcut;

    if (shortcut) {
      this.enableShortcut(tool.name, shortcut);
    }

    /** Increment Tools count */
    this.displayedToolsCount++;
  }

  /**
   * Draw tooltip for toolbox tools
   *
   * @param tool - BlockTool object
   * @returns {HTMLElement}
   */
  private drawTooltip(tool: BlockTool): HTMLElement {
    const toolboxSettings = tool.toolbox || {};
    const name = I18n.t(I18nInternalNS.toolNames, toolboxSettings.title || tool.name);

    let shortcut = tool.shortcut;

    const tooltip = $.make('div', Toolbox.CSS.buttonTooltip);
    const hint = document.createTextNode(_.capitalize(name));

    tooltip.appendChild(hint);

    if (shortcut) {
      shortcut = _.beautifyShortcut(shortcut);

      tooltip.appendChild($.make('div', Toolbox.CSS.buttonShortcut, {
        textContent: shortcut,
      }));
    }

    return tooltip;
  }

  /**
   * Enable shortcut Block Tool implemented shortcut
   *
   * @param {string} toolName - Tool name
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcut(toolName: string, shortcut: string): void {
    Shortcuts.add({
      name: shortcut,
      handler: (event: KeyboardEvent) => {
        event.preventDefault();
        this.insertNewBlock(toolName);
      },
      on: this.shortcutsScopeElement as HTMLElement,
    });
  }

  /**
   * Removes all added shortcuts
   * Fired when the Read-Only mode is activated
   */
  private removeAllShortcuts(): void {
    Array
      .from(this.tools.values())
      .forEach((tool) => {
        const shortcut = tool.shortcut;

        if (shortcut) {
          Shortcuts.remove(this.shortcutsScopeElement, shortcut);
        }
      });
  }

  /**
   * Creates Flipper instance to be able to leaf tools
   */
  private enableFlipper(): void {
    const tools = Array.from(this.nodes.toolbox.childNodes) as HTMLElement[];

    this.flipper = new Flipper({
      items: tools,
      focusedItemClass: Toolbox.CSS.toolboxButtonActive,
    });
  }

  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {string} toolName - Tool name
   */
  private insertNewBlock(toolName: string): void {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);

    if (!currentBlock) {
      return;
    }

    /**
     * On mobile version, we see the Plus Button even near non-empty blocks,
     * so if current block is not empty, add the new block below the current
     */
    const index = currentBlock.isEmpty ? currentBlockIndex : currentBlockIndex + 1;

    const newBlock = this.api.blocks.insert(
      toolName,
      undefined,
      undefined,
      index,
      undefined,
      currentBlock.isEmpty
    );

    /**
     * Apply callback before inserting html
     */
    newBlock.call(BlockToolAPI.APPEND_CALLBACK);

    this.api.caret.setToBlock(index);

    this.emit(ToolboxEvent.BlockAdded, {
      block: newBlock,
    });

    /**
     * close toolbar when node is changed
     */
    this.api.toolbar.close();
  }
}
