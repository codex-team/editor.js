import * as _ from '../utils';
import { BlockToolAPI } from '../block';
import Shortcuts from '../utils/shortcuts';
import BlockTool from '../tools/block';
import ToolsCollection from '../tools/collection';
import { API, BlockToolData, ToolboxConfigEntry, PopoverItemParams, BlockAPI } from '../../../types';
import EventsDispatcher from '../utils/events';
import I18n from '../i18n';
import { I18nInternalNS } from '../i18n/namespace-internal';
import { PopoverEvent } from '../utils/popover/popover.types';
import Listeners from '../utils/listeners';
import Dom from '../dom';
import { Popover, PopoverDesktop, PopoverMobile } from '../utils/popover';
import { EditorMobileLayoutToggled } from '../events';

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
 * Events fired by the Toolbox
 *
 * Event name -> payload
 */
export interface ToolboxEventMap {
  [ToolboxEvent.Opened]: undefined;
  [ToolboxEvent.Closed]: undefined;
  [ToolboxEvent.BlockAdded]: {
    block: BlockAPI
  };
}

/**
 * Available i18n dict keys that should be passed to the constructor
 */
type ToolboxTextLabelsKeys = 'filter' | 'nothingFound';

/**
 * Toolbox
 * This UI element contains list of Block Tools available to be inserted
 * It appears after click on the Plus Button
 *
 * @implements {EventsDispatcher} with some events, see {@link ToolboxEvent}
 */
export default class Toolbox extends EventsDispatcher<ToolboxEventMap> {
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
   * Listeners util instance
   */
  protected listeners: Listeners = new Listeners();

  /**
   * Editor API
   */
  private api: API;

  /**
   * Popover instance. There is a util for vertical lists.
   * Null until initialized
   */
  private popover: Popover | null = null;

  /**
   * List of Tools available. Some of them will be shown in the Toolbox
   */
  private tools: ToolsCollection<BlockTool>;

  /**
   * Text labels used in the Toolbox. Should be passed from the i18n module
   */
  private i18nLabels: Record<ToolboxTextLabelsKeys, string>;

  /**
   * Current module HTML Elements
   */
  private nodes: {
    toolbox: HTMLElement;
  } ;

  /**
   * CSS styles
   */
  private static get CSS(): {
    toolbox: string;
    } {
    return {
      toolbox: 'ce-toolbox',
    };
  }

  /**
   * Toolbox constructor
   *
   * @param options - available parameters
   * @param options.api - Editor API methods
   * @param options.tools - Tools available to check whether some of them should be displayed at the Toolbox or not
   */
  constructor({ api, tools, i18nLabels }: {api: API; tools: ToolsCollection<BlockTool>; i18nLabels: Record<ToolboxTextLabelsKeys, string>}) {
    super();

    this.api = api;
    this.tools = tools;
    this.i18nLabels = i18nLabels;

    this.enableShortcuts();

    this.nodes = {
      toolbox: Dom.make('div', Toolbox.CSS.toolbox),
    };

    this.initPopover();

    if (import.meta.env.MODE === 'test') {
      this.nodes.toolbox.setAttribute('data-cy', 'toolbox');
    }

    this.api.events.on(EditorMobileLayoutToggled, this.handleMobileLayoutToggle);
  }

  /**
   * Returns root block settings element
   */
  public getElement(): HTMLElement | null {
    return this.nodes.toolbox;
  }

  /**
   * Returns true if the Toolbox has the Flipper activated and the Flipper has selected button
   */
  public hasFocus(): boolean | undefined {
    if (this.popover === null) {
      return;
    }

    return 'hasFocus' in this.popover ? this.popover.hasFocus() : undefined;
  }

  /**
   * Destroy Module
   */
  public destroy(): void {
    super.destroy();

    if (this.nodes && this.nodes.toolbox) {
      this.nodes.toolbox.remove();
    }

    this.removeAllShortcuts();
    this.popover?.off(PopoverEvent.Closed, this.onPopoverClose);
    this.listeners.destroy();
    this.api.events.off(EditorMobileLayoutToggled, this.handleMobileLayoutToggle);
  }

  /**
   * Toolbox Tool's button click handler
   *
   * @param toolName - tool type to be activated
   * @param blockDataOverrides - Block data predefined by the activated Toolbox item
   */
  public toolButtonActivated(toolName: string, blockDataOverrides: BlockToolData): void {
    this.insertNewBlock(toolName, blockDataOverrides);
  }

  /**
   * Open Toolbox with Tools
   */
  public open(): void {
    if (this.isEmpty) {
      return;
    }

    this.popover?.show();
    this.opened = true;
    this.emit(ToolboxEvent.Opened);
  }

  /**
   * Close Toolbox
   */
  public close(): void {
    this.popover?.hide();
    this.opened = false;
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
   * Destroys existing popover instance and contructs the new one.
   */
  public handleMobileLayoutToggle = (): void  => {
    this.destroyPopover();
    this.initPopover();
  };

  /**
   * Creates toolbox popover and appends it inside wrapper element
   */
  private initPopover(): void {
    const PopoverClass = _.isMobileScreen() ? PopoverMobile : PopoverDesktop;

    this.popover = new PopoverClass({
      scopeElement: this.api.ui.nodes.redactor,
      searchable: true,
      messages: {
        nothingFound: this.i18nLabels.nothingFound,
        search: this.i18nLabels.filter,
      },
      items: this.toolboxItemsToBeDisplayed,
    });

    this.popover.on(PopoverEvent.Closed, this.onPopoverClose);
    this.nodes.toolbox?.append(this.popover.getElement());
  }

  /**
   * Destroys popover instance and removes it from DOM
   */
  private destroyPopover(): void {
    if (this.popover !== null) {
      this.popover.hide();
      this.popover.off(PopoverEvent.Closed, this.onPopoverClose);
      this.popover.destroy();
      this.popover = null;
    }

    if (this.nodes.toolbox !== null) {
      this.nodes.toolbox.innerHTML = '';
    }
  }

  /**
   * Handles popover close event
   */
  private onPopoverClose = (): void => {
    this.opened = false;
    this.emit(ToolboxEvent.Closed);
  };

  /**
   * Returns list of tools that enables the Toolbox (by specifying the 'toolbox' getter)
   */
  @_.cacheable
  private get toolsToBeDisplayed(): BlockTool[] {
    const result: BlockTool[] = [];

    this.tools.forEach((tool) => {
      const toolToolboxSettings = tool.toolbox;

      if (toolToolboxSettings) {
        result.push(tool);
      }
    });

    return result;
  }

  /**
   * Returns list of items that will be displayed in toolbox
   */
  @_.cacheable
  private get toolboxItemsToBeDisplayed(): PopoverItemParams[] {
    /**
     * Maps tool data to popover item structure
     */
    const toPopoverItem = (toolboxItem: ToolboxConfigEntry, tool: BlockTool): PopoverItemParams => {
      return {
        icon: toolboxItem.icon,
        title: I18n.t(I18nInternalNS.toolNames, toolboxItem.title || _.capitalize(tool.name)),
        name: tool.name,
        onActivate: (): void => {
          this.toolButtonActivated(tool.name, toolboxItem.data);
        },
        secondaryLabel: tool.shortcut ? _.beautifyShortcut(tool.shortcut) : '',
      };
    };

    return this.toolsToBeDisplayed
      .reduce<PopoverItemParams[]>((result, tool) => {
        if (Array.isArray(tool.toolbox)) {
          tool.toolbox.forEach(item => {
            result.push(toPopoverItem(item, tool));
          });
        } else if (tool.toolbox !== undefined)  {
          result.push(toPopoverItem(tool.toolbox, tool));
        }

        return result;
      }, []);
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
      handler: async (event: KeyboardEvent) => {
        event.preventDefault();

        const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
        const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);

        /**
         * Try to convert current Block to shortcut's tool
         * If conversion is not possible, insert a new Block below
         */
        if (currentBlock) {
          try {
            const newBlock = await this.api.blocks.convert(currentBlock.id, toolName);

            this.api.caret.setToBlock(newBlock, 'end');

            return;
          } catch (error) {}
        }

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
   * @param blockDataOverrides - predefined Block data
   */
  private async insertNewBlock(toolName: string, blockDataOverrides?: BlockToolData): Promise<void> {
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

    let blockData;

    if (blockDataOverrides) {
      /**
       * Merge real tool's data with data overrides
       */
      const defaultBlockData = await this.api.blocks.composeBlockData(toolName);

      blockData = Object.assign(defaultBlockData, blockDataOverrides);
    }

    const newBlock = this.api.blocks.insert(
      toolName,
      blockData,
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
