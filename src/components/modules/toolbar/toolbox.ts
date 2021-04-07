import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import { BlockToolConstructable, ToolConstructable, EditorConfig } from '../../../../types';
import Flipper from '../../flipper';
import { BlockToolAPI } from '../../block';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Shortcuts from '../../utils/shortcuts';
import Tooltip from '../../utils/tooltip';
import { ModuleConfig } from '../../../types-internal/module-config';
import EventsDispatcher from '../../utils/events';
import BlockTool from '../../tools/block';

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
  public get CSS(): { [name: string]: string } {
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
   * Tooltip utility Instance
   */
  private tooltip: Tooltip;
  /**
   * @class
   * @param {object} moduleConfiguration - Module Configuration
   * @param {EditorConfig} moduleConfiguration.config - Editor's config
   * @param {EventsDispatcher} moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });
    this.tooltip = new Tooltip();
  }

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
    this.insertNewBlock(toolName);
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
    const tools = this.Editor.Tools.blockTools;

    Array
      .from(tools.values())
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

    const button = $.make('li', [ this.CSS.toolboxButton ]);

    button.dataset.tool = tool.name;
    button.innerHTML = toolToolboxSettings.icon;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * Add click listener
     */
    this.listeners.on(button, 'click', (event: KeyboardEvent|MouseEvent) => {
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
      on: this.Editor.UI.nodes.redactor,
    });
  }

  /**
   * Removes all added shortcuts
   * Fired when the Read-Only mode is activated
   */
  private removeAllShortcuts(): void {
    const tools = this.Editor.Tools.blockTools;

    Array
      .from(tools.values())
      .forEach((tool) => {
        const shortcut = tool.shortcut;

        if (shortcut) {
          Shortcuts.remove(this.Editor.UI.nodes.redactor, shortcut);
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
      focusedItemClass: this.CSS.toolboxButtonActive,
    });
  }

  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {string} toolName - Tool name
   */
  private insertNewBlock(toolName: string): void {
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
