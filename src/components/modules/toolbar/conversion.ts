import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import { SavedData } from '../../../../types/data-formats';
import Flipper from '../../flipper';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import { clean } from '../../utils/sanitizer';
import { ToolboxConfigEntry, BlockToolData } from '../../../../types';

/**
 * HTML Elements used for ConversionToolbar
 */
interface ConversionToolbarNodes {
  wrapper: HTMLElement;
  tools: HTMLElement;
}

/**
 * Block Converter
 *
 * @todo Make the Conversion Toolbar no-module but a standalone class, like Toolbox
 */
export default class ConversionToolbar extends Module<ConversionToolbarNodes> {
  /**
   * CSS getter
   */
  public static get CSS(): { [key: string]: string } {
    return {
      conversionToolbarWrapper: 'ce-conversion-toolbar',
      conversionToolbarShowed: 'ce-conversion-toolbar--showed',
      conversionToolbarTools: 'ce-conversion-toolbar__tools',
      conversionToolbarLabel: 'ce-conversion-toolbar__label',
      conversionTool: 'ce-conversion-tool',
      conversionToolHidden: 'ce-conversion-tool--hidden',
      conversionToolIcon: 'ce-conversion-tool__icon',

      conversionToolFocused: 'ce-conversion-tool--focused',
      conversionToolActive: 'ce-conversion-tool--active',
    };
  }

  /**
   * Conversion Toolbar open/close state
   *
   * @type {boolean}
   */
  public opened = false;

  /**
   * Available tools data
   */
  private tools: {name: string; toolboxItem: ToolboxConfigEntry; button: HTMLElement}[] = [];

  /**
   * Instance of class that responses for leafing buttons by arrows/tab
   *
   * @type {Flipper|null}
   */
  private flipper: Flipper = null;

  /**
   * Callback that fill be fired on open/close and accepts an opening state
   */
  private togglingCallback = null;

  /**
   * Create UI of Conversion Toolbar
   */
  public make(): HTMLElement {
    this.nodes.wrapper = $.make('div', [
      ConversionToolbar.CSS.conversionToolbarWrapper,
      ...(this.isRtl ? [ this.Editor.UI.CSS.editorRtlFix ] : []),
    ]);
    this.nodes.tools = $.make('div', ConversionToolbar.CSS.conversionToolbarTools);

    const label = $.make('div', ConversionToolbar.CSS.conversionToolbarLabel, {
      textContent: I18n.ui(I18nInternalNS.ui.inlineToolbar.converter, 'Convert to'),
    });

    /**
     * Add Tools that has 'import' method
     */
    this.addTools();

    /**
     * Prepare Flipper to be able to leaf tools by arrows/tab
     */
    this.enableFlipper();

    $.append(this.nodes.wrapper, label);
    $.append(this.nodes.wrapper, this.nodes.tools);

    return this.nodes.wrapper;
  }

  /**
   * Deactivates flipper and removes all nodes
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
  }

  /**
   * Toggle conversion dropdown visibility
   *
   * @param {Function} [togglingCallback] — callback that will accept opening state
   */
  public toggle(togglingCallback?: (openedState: boolean) => void): void {
    if (!this.opened) {
      this.open();
    } else {
      this.close();
    }

    if (_.isFunction(togglingCallback)) {
      this.togglingCallback = togglingCallback;
    }
  }

  /**
   * Shows Conversion Toolbar
   */
  public open(): void {
    this.filterTools();

    this.opened = true;
    this.nodes.wrapper.classList.add(ConversionToolbar.CSS.conversionToolbarShowed);

    /**
     * We use RAF to prevent bubbling Enter keydown on first dropdown item
     * Conversion flipper will be activated after dropdown will open
     */
    window.requestAnimationFrame(() => {
      this.flipper.activate(this.tools.map(tool => tool.button).filter((button) => {
        return !button.classList.contains(ConversionToolbar.CSS.conversionToolHidden);
      }));
      this.flipper.focusFirst();
      if (_.isFunction(this.togglingCallback)) {
        this.togglingCallback(true);
      }
    });
  }

  /**
   * Closes Conversion Toolbar
   */
  public close(): void {
    this.opened = false;
    this.flipper.deactivate();
    this.nodes.wrapper.classList.remove(ConversionToolbar.CSS.conversionToolbarShowed);

    if (_.isFunction(this.togglingCallback)) {
      this.togglingCallback(false);
    }
  }

  /**
   * Returns true if it has more than one tool available for convert in
   */
  public hasTools(): boolean {
    if (this.tools.length === 1) {
      return this.tools[0].name !== this.config.defaultBlock;
    }

    return true;
  }

  /**
   * Replaces one Block with another
   * For that Tools must provide import/export methods
   *
   * @param {string} replacingToolName - name of Tool which replaces current
   * @param blockDataOverrides - If this conversion fired by the one of multiple Toolbox items, extend converted data with this item's "data" overrides
   */
  public async replaceWithBlock(replacingToolName: string, blockDataOverrides?: BlockToolData): Promise<void> {
    const { BlockManager, BlockSelection, InlineToolbar, Caret } = this.Editor;

    BlockManager.convert(this.Editor.BlockManager.currentBlock, replacingToolName, blockDataOverrides);

    BlockSelection.clearSelection();

    this.close();
    InlineToolbar.close();

    window.requestAnimationFrame(() => {
      Caret.setToBlock(this.Editor.BlockManager.currentBlock, Caret.positions.END);
    });
  }

  /**
   * Iterates existing Tools and inserts to the ConversionToolbar
   * if tools have ability to import
   */
  private addTools(): void {
    const tools = this.Editor.Tools.blockTools;

    Array
      .from(tools.entries())
      .forEach(([name, tool]) => {
        const conversionConfig = tool.conversionConfig;

        /**
         * Skip tools without «import» rule specified
         */
        if (!conversionConfig || !conversionConfig.import) {
          return;
        }
        tool.toolbox.forEach((toolboxItem) =>
          this.addToolIfValid(name, toolboxItem)
        );
      });
  }

  /**
   * Inserts a tool to the ConversionToolbar if the tool's toolbox config is valid
   *
   * @param name - tool's name
   * @param toolboxSettings - tool's single toolbox setting
   */
  private addToolIfValid(name: string, toolboxSettings: ToolboxConfigEntry): void {
    /**
     * Skip tools that don't pass 'toolbox' property
     */
    if (_.isEmpty(toolboxSettings) || !toolboxSettings.icon) {
      return;
    }

    this.addTool(name, toolboxSettings);
  }

  /**
   * Add tool to the Conversion Toolbar
   *
   * @param toolName - name of Tool to add
   * @param toolboxItem - tool's toolbox item data
   */
  private addTool(toolName: string, toolboxItem: ToolboxConfigEntry): void {
    const tool = $.make('div', [ ConversionToolbar.CSS.conversionTool ]);
    const icon = $.make('div', [ ConversionToolbar.CSS.conversionToolIcon ]);

    tool.dataset.tool = toolName;
    icon.innerHTML = toolboxItem.icon;

    $.append(tool, icon);
    $.append(tool, $.text(I18n.t(I18nInternalNS.toolNames, toolboxItem.title || _.capitalize(toolName))));

    $.append(this.nodes.tools, tool);
    this.tools.push({
      name: toolName,
      button: tool,
      toolboxItem: toolboxItem,
    });

    this.listeners.on(tool, 'click', async () => {
      await this.replaceWithBlock(toolName, toolboxItem.data);
    });
  }

  /**
   * Hide current Tool and show others
   */
  private async filterTools(): Promise<void> {
    const { currentBlock } = this.Editor.BlockManager;
    const currentBlockActiveToolboxEntry = await currentBlock.getActiveToolboxEntry();

    /**
     * Compares two Toolbox entries
     *
     * @param entry1 - entry to compare
     * @param entry2 - entry to compare with
     */
    function isTheSameToolboxEntry(entry1, entry2): boolean {
      return entry1.icon === entry2.icon && entry1.title === entry2.title;
    }

    this.tools.forEach(tool => {
      let hidden = false;

      if (currentBlockActiveToolboxEntry) {
        const isToolboxItemActive = isTheSameToolboxEntry(currentBlockActiveToolboxEntry, tool.toolboxItem);

        hidden = (tool.button.dataset.tool === currentBlock.name && isToolboxItemActive);
      }

      tool.button.hidden = hidden;
      tool.button.classList.toggle(ConversionToolbar.CSS.conversionToolHidden, hidden);
    });
  }

  /**
   * Prepare Flipper to be able to leaf tools by arrows/tab
   */
  private enableFlipper(): void {
    this.flipper = new Flipper({
      focusedItemClass: ConversionToolbar.CSS.conversionToolFocused,
    });
  }
}
