import Module from '../../__module';
import $ from '../../dom';
import SelectionUtils from '../../selection';
import type Block from '../../block';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Flipper from '../../flipper';
import type { MenuConfigItem } from '../../../../types/tools';
import type { PopoverItemParams } from '../../utils/popover';
import { type Popover, PopoverDesktop, PopoverMobile, PopoverItemType } from '../../utils/popover';
import type { PopoverParams } from '@/types/utils/popover/popover';
import { PopoverEvent } from '@/types/utils/popover/popover-event';
import { isMobileScreen, keyCodes } from '../../utils';
import { css as popoverItemCls } from '../../utils/popover/components/popover-item';
import { BlockSettingsClosed, BlockSettingsOpened, EditorMobileLayoutToggled } from '../../events';
import { IconReplace } from '@codexteam/icons';
import { getConvertibleToolsForBlock } from '../../utils/blocks';

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
  public get events(): { opened: typeof BlockSettingsOpened; closed: typeof BlockSettingsClosed } {
    return {
      opened: BlockSettingsOpened,
      closed: BlockSettingsClosed,
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
  public get flipper(): Flipper {
    return this.flipperInstance;
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
   * Shared flipper instance used for keyboard navigation in block settings popover
   */
  private readonly flipperInstance: Flipper = new Flipper({
    focusedItemClass: popoverItemCls.focused,
    allowedKeys: [
      keyCodes.TAB,
      keyCodes.UP,
      keyCodes.DOWN,
      keyCodes.ENTER,
    ],
  });

  /**
   * Stored keydown handler reference to detach when block tunes are closed
   */
  private flipperKeydownHandler: ((event: KeyboardEvent) => void) | null = null;

  /**
   * Element that listens for keydown events while block tunes are opened
   */
  private flipperKeydownSource: HTMLElement | null = null;

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
    this.detachFlipperKeydownListener();
    this.removeAllNodes();
    this.listeners.destroy();
    this.eventsDispatcher.off(EditorMobileLayoutToggled, this.close);
  }

  /**
   * Open Block Settings pane
   *
   * @param targetBlock - near which Block we should open BlockSettings
   * @param trigger - element to position the popover relative to
   */
  public async open(targetBlock?: Block, trigger?: HTMLElement): Promise<void> {
    const block = targetBlock ?? this.Editor.BlockManager.currentBlock;

    if (block === undefined) {
      return;
    }

    this.opened = true;

    /**
     * If block settings contains any inputs, focus will be set there,
     * so we need to save current selection to restore it after block settings is closed
     */
    this.selection.save();

    /**
     * Highlight content of a Block we are working with
     */
    this.Editor.BlockSelection.selectBlock(block);
    this.Editor.BlockSelection.clearCache();

    /** Get tool's settings data */
    const { toolTunes, commonTunes } = block.getTunes();

    /** Tell to subscribers that block settings is opened */
    this.eventsDispatcher.emit(this.events.opened);

    const PopoverClass = isMobileScreen() ? PopoverMobile : PopoverDesktop;
    const popoverParams: PopoverParams & { flipper?: Flipper } = {
      searchable: true,
      trigger: trigger || this.nodes.wrapper,
      items: await this.getTunesItems(block, commonTunes, toolTunes),
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
        search: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
      },
    };

    if (PopoverClass === PopoverDesktop) {
      popoverParams.flipper = this.flipperInstance;
    }

    this.popover = new PopoverClass(popoverParams);

    this.popover.on(PopoverEvent.Closed, this.onPopoverClose);

    this.popover.show();
    if (PopoverClass === PopoverDesktop) {
      this.flipperInstance.focusItem(0);
    }
    this.attachFlipperKeydownListener(block);
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
    this.detachFlipperKeydownListener();

    /**
     * Remove highlighted content of a Block we are working with
     */
    if (!this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted && this.Editor.BlockManager.currentBlock) {
      this.Editor.BlockSelection.unselectBlock(this.Editor.BlockManager.currentBlock);
    }

    /** Tell to subscribers that block settings is closed */
    this.eventsDispatcher.emit(this.events.closed);

    if (this.popover) {
      this.popover.off(PopoverEvent.Closed, this.onPopoverClose);
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
  private async getTunesItems(currentBlock: Block, commonTunes: MenuConfigItem[], toolTunes?: MenuConfigItem[]): Promise<PopoverItemParams[]> {
    const items = [] as MenuConfigItem[];

    if (toolTunes !== undefined && toolTunes.length > 0) {
      items.push(...toolTunes);
      items.push({
        type: PopoverItemType.Separator,
      });
    }

    const allBlockTools = Array.from(this.Editor.Tools.blockTools.values());
    const convertibleTools = await getConvertibleToolsForBlock(currentBlock, allBlockTools);
    const convertToItems = convertibleTools.reduce<PopoverItemParams[]>((result, tool) => {
      if (tool.toolbox === undefined) {
        return result;
      }

      tool.toolbox.forEach((toolboxItem) => {
        const titleKey = toolboxItem.title ?? tool.name;

        result.push({
          icon: toolboxItem.icon,
          title: I18n.t(I18nInternalNS.toolNames, titleKey),
          name: tool.name,
          closeOnActivate: true,
          onActivate: async () => {
            const { BlockManager, Caret, Toolbar } = this.Editor;

            const newBlock = await BlockManager.convert(currentBlock, tool.name, toolboxItem.data);

            Toolbar.close();

            Caret.setToBlock(newBlock, Caret.positions.END);
          },
        });
      });

      return result;
    }, []);

    if (convertToItems.length > 0) {
      items.push({
        icon: IconReplace,
        name: 'convert-to',
        title: I18n.ui(I18nInternalNS.ui.popover, 'Convert to'),
        children: {
          searchable: true,
          items: convertToItems,
        },
      });
      items.push({
        type: PopoverItemType.Separator,
      });
    }

    items.push(...commonTunes);

    return items;
  }

  /**
   * Handles popover close event
   */
  private onPopoverClose = (): void => {
    this.close();
  };

  /**
   * Attaches keydown listener to delegate navigation events to the shared flipper
   *
   * @param block - block that owns the currently focused content
   */
  private attachFlipperKeydownListener(block: Block): void {
    this.detachFlipperKeydownListener();

    const pluginsContent = block?.pluginsContent;

    if (!(pluginsContent instanceof HTMLElement)) {
      return;
    }

    this.flipperInstance.setHandleContentEditableTargets(true);

    this.flipperKeydownHandler = (event: KeyboardEvent) => {
      this.flipperInstance.handleExternalKeydown(event);
    };

    pluginsContent.addEventListener('keydown', this.flipperKeydownHandler, true);
    this.flipperKeydownSource = pluginsContent;
  }

  /**
   * Removes keydown listener from the previously active block
   */
  private detachFlipperKeydownListener(): void {
    if (this.flipperKeydownSource !== null && this.flipperKeydownHandler !== null) {
      this.flipperKeydownSource.removeEventListener('keydown', this.flipperKeydownHandler, true);
    }

    this.flipperInstance.setHandleContentEditableTargets(false);

    this.flipperKeydownSource = null;
    this.flipperKeydownHandler = null;
  }
}
