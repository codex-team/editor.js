import * as _ from '../utils';
import { BlockToolAPI } from '../block';
import Shortcuts from '../utils/shortcuts';
import BlockTool from '../tools/block';
import ToolsCollection from '../tools/collection';
import { API } from '../../../types';
import EventsDispatcher from '../utils/events';
import Popover, { PopoverEvent } from '../utils/popover';
import I18n from '../i18n';
import { I18nInternalNS } from '../i18n/namespace-internal';

/**
 * @todo the first Tab on the Block — focus Plus Button, the second — focus Block Tunes Toggler, the third — focus next Block
 */

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
 * Available i18n dict keys that should be passed to the constructor
 */
type toolboxTextLabelsKeys = 'filter' | 'nothingFound';

/**
 * Toolbox
 * This UI element contains list of Block Tools available to be inserted
 * It appears after click on the Plus Button
 *
 * @implements {EventsDispatcher} with some events, see {@link ToolboxEvent}
 */
export default class Toolbox extends EventsDispatcher<ToolboxEvent> {
  /**
   * Returns True if Toolbox is Empty and nothing to show
   *
   * @returns {boolean}
   */
  public get isEmpty(): boolean {
    return this.toolsToBeDisplayed.length === 0;
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
   * Popover instance. There is a util for vertical lists.
   */
  private popover: Popover;

  /**
   * List of Tools available. Some of them will be shown in the Toolbox
   */
  private tools: ToolsCollection<BlockTool>;

  /**
   * Text labels used in the Toolbox. Should be passed from the i18n module
   */
  private i18nLabels: Record<toolboxTextLabelsKeys, string>;

  /**
   * Current module HTML Elements
   */
  private nodes: {
    toolbox: HTMLElement;
  } = {
    toolbox: null,
  };

  /**
   * CSS styles
   *
   * @returns {object.<string, string>}
   */
  private static get CSS(): { [name: string]: string } {
    return {
      toolbox: 'ce-toolbox',
      toolboxOpenedTop: 'ce-toolbox--opened-top',
    };
  }

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
   */
  constructor({ api, tools, i18nLabels }: {api: API; tools: ToolsCollection<BlockTool>; i18nLabels: Record<toolboxTextLabelsKeys, string>}) {
    super();

    this.api = api;
    this.tools = tools;
    this.i18nLabels = i18nLabels;
  }

  /**
   * Makes the Toolbox
   */
  public make(): Element {
    this.popover = new Popover({
      className: Toolbox.CSS.toolbox,
      searchable: true,
      filterLabel: this.i18nLabels.filter,
      nothingFoundLabel: this.i18nLabels.nothingFound,
      items: this.toolsToBeDisplayed.map(tool => {
        return {
          icon: tool.toolbox.icon,
          label: I18n.t(I18nInternalNS.toolNames, tool.toolbox.title || _.capitalize(tool.name)),
          name: tool.name,
          onClick: (item): void => {
            this.toolButtonActivated(tool.name);
          },
          secondaryLabel: tool.shortcut ? _.beautifyShortcut(tool.shortcut) : '',
        };
      }),
    });

    this.popover.on(PopoverEvent.OverlayClicked, this.onOverlayClicked);

    /**
     * Enable tools shortcuts
     */
    this.enableShortcuts();

    this.nodes.toolbox = this.popover.getElement();

    return this.nodes.toolbox;
  }

  /**
   * Returns true if the Toolbox has the Flipper activated and the Flipper has selected button
   */
  public hasFocus(): boolean {
    return this.popover.hasFocus();
  }

  /**
   * Destroy Module
   */
  public destroy(): void {
    super.destroy();

    if (this.nodes && this.nodes.toolbox) {
      this.nodes.toolbox.remove();
      this.nodes.toolbox = null;
    }

    this.api.listeners.offById(this.clickListenerId);

    this.removeAllShortcuts();
    this.popover.off(PopoverEvent.OverlayClicked, this.onOverlayClicked);
  }

  /**
   * Toolbox Tool's button click handler
   *
   * @param toolName - tool type to be activated
   */
  public toolButtonActivated(toolName: string): void {
    this.insertNewBlock(toolName);
  }

  /**
   * Open Toolbox with Tools
   */
  public open(): void {
    if (this.isEmpty) {
      return;
    }

    /**
     * Open the popover above the button
     * if there is not enough available space below it
     */
    if (!this.shouldOpenPopoverBottom) {
      this.nodes.toolbox.style.setProperty('--popover-height', this.popover.calculateHeight() + 'px');
      this.nodes.toolbox.classList.add(Toolbox.CSS.toolboxOpenedTop);
    }

    this.popover.show();
    this.opened = true;
    this.emit(ToolboxEvent.Opened);
  }

  /**
   * Close Toolbox
   */
  public close(): void {
    this.popover.hide();
    this.opened = false;
    this.nodes.toolbox.classList.remove(Toolbox.CSS.toolboxOpenedTop);
    this.emit(ToolboxEvent.Closed);
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
   * Checks if there popover should be opened downwards.
   * It happens in case there is enough space below or not enough space above
   */
  private get shouldOpenPopoverBottom(): boolean {
    const toolboxRect = this.nodes.toolbox.getBoundingClientRect();
    const editorElementRect = this.api.ui.nodes.redactor.getBoundingClientRect();
    const popoverHeight = this.popover.calculateHeight();
    const popoverPotentialBottomEdge = toolboxRect.top + popoverHeight;
    const popoverPotentialTopEdge = toolboxRect.top - popoverHeight;
    const bottomEdgeForComparison = Math.min(window.innerHeight, editorElementRect.bottom);

    return popoverPotentialTopEdge < editorElementRect.top || popoverPotentialBottomEdge <= bottomEdgeForComparison;
  }

  /**
   * Handles overlay click
   */
  private onOverlayClicked = (): void => {
    this.close();
  }

  /**
   * Returns list of tools that enables the Toolbox (by specifying the 'toolbox' getter)
   */
  @_.cacheable
  private get toolsToBeDisplayed(): BlockTool[] {
    return Array
      .from(this.tools.values())
      .filter(tool => {
        const toolToolboxSettings = tool.toolbox;

        /**
         * Skip tools that don't pass 'toolbox' property
         */
        if (!toolToolboxSettings) {
          return false;
        }

        if (toolToolboxSettings && !toolToolboxSettings.icon) {
          _.log('Toolbar icon is missed. Tool %o skipped', 'warn', tool.name);

          return false;
        }

        return true;
      });
  }

  /**
   * Iterate all tools and enable theirs shortcuts if specified
   */
  private enableShortcuts(): void {
    this.toolsToBeDisplayed.forEach((tool: BlockTool) => {
      const shortcut = tool.shortcut;

      if (shortcut) {
        this.enableShortcutForTool(tool.name, shortcut);
      }
    });
  }

  /**
   * Enable shortcut Block Tool implemented shortcut
   *
   * @param {string} toolName - Tool name
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcutForTool(toolName: string, shortcut: string): void {
    Shortcuts.add({
      name: shortcut,
      on: this.api.ui.nodes.redactor,
      handler: (event: KeyboardEvent) => {
        event.preventDefault();
        this.insertNewBlock(toolName);
      },
    });
  }

  /**
   * Removes all added shortcuts
   * Fired when the Read-Only mode is activated
   */
  private removeAllShortcuts(): void {
    this.toolsToBeDisplayed.forEach((tool: BlockTool) => {
      const shortcut = tool.shortcut;

      if (shortcut) {
        Shortcuts.remove(this.api.ui.nodes.redactor, shortcut);
      }
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
