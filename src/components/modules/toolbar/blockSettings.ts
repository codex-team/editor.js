import Module from '../../__module';
import $ from '../../dom';
import SelectionUtils from '../../selection';
import Block from '../../block';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Flipper from '../../flipper';
import { TunesMenuConfigItem } from '../../../../types/tools';
import { resolveAliases } from '../../utils/resolve-aliases';
import { type Popover, PopoverDesktop, PopoverMobile, PopoverItemParams, PopoverItemDefaultParams, PopoverItemType } from '../../utils/popover';
import { PopoverEvent } from '../../utils/popover/popover.types';
import { isMobileScreen } from '../../utils';
import { EditorMobileLayoutToggled } from '../../events';
import * as _ from '../../utils';
import { IconReplace } from '@codexteam/icons';
import { isSameBlockData } from '../../utils/blocks';

/**
 * HTML Elements that used for BlockSettings
 */
interface BlockSettingsNodes {
  /**
   * Block Settings wrapper. Undefined when before "make" method called
   */
  wrapper: HTMLElement | undefined;
}

/**
 * Block Settings
 *
 *  @todo Make Block Settings no-module but a standalone class, like Toolbox
 */
export default class BlockSettings extends Module<BlockSettingsNodes> {
  /**
   * Module Events
   */
  public get events(): { opened: string; closed: string } {
    return {
      opened: 'block-settings-opened',
      closed: 'block-settings-closed',
    };
  }

  /**
   * Block Settings CSS
   */
  public get CSS(): { [name: string]: string } {
    return {
      settings: 'ce-settings',
    };
  }

  /**
   * Opened state
   */
  public opened = false;

  /**
   * Getter for inner popover's flipper instance
   *
   * @todo remove once BlockSettings becomes standalone non-module class
   */
  public get flipper(): Flipper | undefined {
    if (this.popover === null) {
      return;
    }

    return 'flipper' in this.popover ? this.popover?.flipper : undefined;
  }

  /**
   * Page selection utils
   */
  private selection: SelectionUtils = new SelectionUtils();

  /**
   * Popover instance. There is a util for vertical lists.
   * Null until popover is not initialized
   */
  private popover: Popover | null = null;

  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   */
  public make(): void {
    this.nodes.wrapper = $.make('div', [ this.CSS.settings ]);

    if (import.meta.env.MODE === 'test') {
      this.nodes.wrapper.setAttribute('data-cy', 'block-tunes');
    }

    this.eventsDispatcher.on(EditorMobileLayoutToggled, this.close);
  }

  /**
   * Destroys module
   */
  public destroy(): void {
    this.removeAllNodes();
    this.listeners.destroy();
    this.eventsDispatcher.off(EditorMobileLayoutToggled, this.close);
  }

  /**
   * Open Block Settings pane
   *
   * @param targetBlock - near which Block we should open BlockSettings
   */
  public async open(targetBlock: Block = this.Editor.BlockManager.currentBlock): Promise<void> {
    this.opened = true;

    /**
     * If block settings contains any inputs, focus will be set there,
     * so we need to save current selection to restore it after block settings is closed
     */
    this.selection.save();

    /**
     * Highlight content of a Block we are working with
     */
    this.Editor.BlockSelection.selectBlock(targetBlock);
    this.Editor.BlockSelection.clearCache();

    /** Get tool's settings data */
    const { toolTunes, commonTunes } = targetBlock.getTunes();

    /** Tell to subscribers that block settings is opened */
    this.eventsDispatcher.emit(this.events.opened);

    const PopoverClass = isMobileScreen() ? PopoverMobile : PopoverDesktop;

    this.popover = new PopoverClass({
      searchable: true,
      items: await this.getTunesItems(targetBlock, commonTunes, toolTunes),
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
        search: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
      },
    });

    this.popover.on(PopoverEvent.Close, this.onPopoverClose);

    this.nodes.wrapper?.append(this.popover.getElement());

    this.popover.show();
  }

  /**
   * Returns root block settings element
   */
  public getElement(): HTMLElement | undefined {
    return this.nodes.wrapper;
  }

  /**
   * Close Block Settings pane
   */
  public close = (): void => {
    if (!this.opened) {
      return;
    }

    this.opened = false;

    /**
     * If selection is at editor on Block Settings closing,
     * it means that caret placed at some editable element inside the Block Settings.
     * Previously we have saved the selection, then open the Block Settings and set caret to the input
     *
     * So, we need to restore selection back to Block after closing the Block Settings
     */
    if (!SelectionUtils.isAtEditor) {
      this.selection.restore();
    }

    this.selection.clearSaved();

    /**
     * Remove highlighted content of a Block we are working with
     */
    if (!this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted && this.Editor.BlockManager.currentBlock) {
      this.Editor.BlockSelection.unselectBlock(this.Editor.BlockManager.currentBlock);
    }

    /** Tell to subscribers that block settings is closed */
    this.eventsDispatcher.emit(this.events.closed);

    if (this.popover) {
      this.popover.off(PopoverEvent.Close, this.onPopoverClose);
      this.popover.destroy();
      this.popover.getElement().remove();
      this.popover = null;
    }
  };

  /**
   * Returns list of items to be displayed in block tunes menu.
   * Merges tool specific tunes, conversion menu and common tunes in one list in predefined order
   *
   * @param currentBlock –  block we are about to open block tunes for
   * @param commonTunes – common tunes
   * @param toolTunes - tool specific tunes
   */
  private async getTunesItems(currentBlock: Block, commonTunes: TunesMenuConfigItem[], toolTunes?: TunesMenuConfigItem[]): Promise<PopoverItemParams[]> {
    const items = [] as TunesMenuConfigItem[];

    if (toolTunes !== undefined && toolTunes.length > 0) {
      items.push(...toolTunes);
      items.push({
        type: PopoverItemType.Separator,
      });
    }

    const convertToItems = await this.getConvertToItems(currentBlock);

    if (convertToItems.length > 0) {
      items.push({
        icon: IconReplace,
        title: I18n.ui(I18nInternalNS.ui.popover, 'Convert to'),
        children: {
          items: convertToItems,
        },
      });
      items.push({
        type: PopoverItemType.Separator,
      });
    }

    items.push(...commonTunes);

    return items.map(tune => this.resolveTuneAliases(tune));
  }

  /**
   * Returns list of all available conversion menu items
   *
   * @param currentBlock - block we are about to open block tunes for
   */
  private async getConvertToItems(currentBlock: Block): Promise<PopoverItemDefaultParams[]> {
    const conversionEntries = Array.from(this.Editor.Tools.blockTools.entries());

    const resultItems: PopoverItemDefaultParams[] = [];

    const blockData = await currentBlock.data;

    conversionEntries.forEach(([toolName, tool]) => {
      const conversionConfig = tool.conversionConfig;

      /**
       * Skip tools without «import» rule specified
       */
      if (!conversionConfig || !conversionConfig.import) {
        return;
      }

      tool.toolbox?.forEach((toolboxItem) => {
        /**
         * Skip tools that don't pass 'toolbox' property
         */
        if (_.isEmpty(toolboxItem) || !toolboxItem.icon) {
          return;
        }

        let shouldSkip = false;

        if (toolboxItem.data !== undefined) {
          /**
           * When a tool has several toolbox entries, we need to make sure we do not add
           * toolbox item with the same data to the resulting array. This helps exclude duplicates
           */
          const hasSameData = isSameBlockData(toolboxItem.data, blockData);

          shouldSkip = hasSameData;
        } else {
          shouldSkip = toolName === currentBlock.name;
        }


        if (shouldSkip) {
          return;
        }

        resultItems.push({
          icon: toolboxItem.icon,
          title: toolboxItem.title,
          name: toolName,
          onActivate: async () => {
            const { BlockManager, BlockSelection, Caret } = this.Editor;

            const newBlock = await BlockManager.convert(this.Editor.BlockManager.currentBlock, toolName, toolboxItem.data);

            BlockSelection.clearSelection();

            this.close();

            Caret.setToBlock(newBlock, Caret.positions.END);
          },
        });
      });
    });

    return resultItems;
  }

  /**
   * Handles popover close event
   */
  private onPopoverClose = (): void => {
    this.close();
  };

  /**
   * Resolves aliases in tunes menu items
   *
   * @param item - item with resolved aliases
   */
  private resolveTuneAliases(item: TunesMenuConfigItem): PopoverItemParams {
    if (item.type === PopoverItemType.Separator || item.type === PopoverItemType.Html) {
      return item;
    }
    const result = resolveAliases(item, { label: 'title' });

    if (item.confirmation) {
      result.confirmation = this.resolveTuneAliases(item.confirmation);
    }

    return result;
  }
}
