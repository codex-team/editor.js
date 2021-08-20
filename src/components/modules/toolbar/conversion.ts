import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import { SavedData } from '../../../../types/data-formats';
import Flipper from '../../flipper';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';
import Block from '../../block';
import { clean } from '../../utils/sanitizer';

/**
 * HTML Elements used for ConversionToolbar
 */
interface ConversionToolbarNodes {
  wrapper: HTMLElement;
  tools: HTMLElement;
}

/**
 * Block Converter
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
   * Last selection of multiple blocks
   *
   * @type {Block[]}
   */
  public selectedBlocks: Block[] = [];

  /**
   * Conversion Toolbar open/close state
   *
   * @type {boolean}
   */
  public opened = false;

  /**
   * Available tools
   */
  private tools: { [key: string]: HTMLElement } = {};

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
      ...(this.isRtl ? [this.Editor.UI.CSS.editorRtlFix] : []),
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
   *
   * @param hasMultipleBlocks - boolean for multiblock conversion
   */
  public open(hasMultipleBlocks?: boolean): void {
    // filter tools only for one to one conversions
    this.filterTools(hasMultipleBlocks);

    this.opened = true;

    // check if toolbar needs to be displayed
    // @todo detach or recreate conversion toolbar as independent instance
    const inlineToolClass = this.Editor.InlineToolbar.CSS.inlineToolbar;

    if (hasMultipleBlocks && this.nodes.wrapper.parentElement.classList.contains(inlineToolClass)) {
      // store blocks for merge later
      this.selectedBlocks = this.Editor.BlockSelection.selectedBlocks;
      this.nodes.wrapper.parentElement.classList.add(this.Editor.InlineToolbar.CSS.inlineToolbarVisibleChildren);
    } else {
      this.selectedBlocks = [];
    }

    this.nodes.wrapper.classList.add(ConversionToolbar.CSS.conversionToolbarShowed);

    /**
     * We use timeout to prevent bubbling Enter keydown on first dropdown item
     * Conversion flipper will be activated after dropdown will open
     */
    setTimeout(() => {
      this.flipper.activate(Object.values(this.tools).filter((button) => {
        return !button.classList.contains(ConversionToolbar.CSS.conversionToolHidden);
      }));
      this.flipper.focusFirst();

      if (_.isFunction(this.togglingCallback)) {
        this.togglingCallback(true);
      }
    }, 50);
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
    const tools = Object.keys(this.tools); // available tools in array representation

    return !(tools.length === 1 && tools.shift() === this.config.defaultBlock);
  }

  /**
   * Replaces one Block with another
   * For that Tools must provide import/export methods
   *
   * @param {string} replacingToolName - name of Tool which replaces current
   */
  public async replaceWithBlock(replacingToolName: string): Promise<void> {
    /**
     * At first, we get current Block data with one selection
     *
     * @type {BlockToolConstructable}
     */
    const currentBlock = this.Editor.BlockManager.currentBlock;

    const currentBlockTool = currentBlock.tool;
    const currentBlockName = currentBlock.name;
    const savedBlock = await currentBlock.save() as SavedData;
    const blockData = savedBlock.data;

    /**
     * When current Block name is equals to the replacing tool Name,
     * than convert this Block back to the default Block
     */
    if (currentBlockName === replacingToolName) {
      replacingToolName = this.config.defaultBlock;
    }

    /**
     * Getting a class of replacing Tool
     *
     * @type {BlockToolConstructable}
     */
    const replacingTool = this.Editor.Tools.blockTools.get(replacingToolName);

    /**
     * Export property can be:
     * 1) Function — Tool defines which data to return
     * 2) String — the name of saved property
     *
     * In both cases returning value must be a string
     */
    let exportData = '';
    const exportProp = currentBlockTool.conversionConfig.export;

    if (_.isFunction(exportProp)) {
      exportData = exportProp(blockData);
    } else if (_.isString(exportProp)) {
      exportData = blockData[exportProp];
    } else {
      _.log('Conversion «export» property must be a string or function. ' +
        'String means key of saved data object to export. Function should export processed string to export.');

      return;
    }

    /**
     * Clean exported data with replacing sanitizer config
     */
    const cleaned: string = clean(
      exportData,
      replacingTool.sanitizeConfig
    );

    /**
     * «import» property can be Function or String
     * function — accept imported string and compose tool data object
     * string — the name of data field to import
     */
    let newBlockData = {};
    const importProp = replacingTool.conversionConfig.import;

    if (_.isFunction(importProp)) {
      newBlockData = importProp(cleaned);
    } else if (_.isString(importProp)) {
      newBlockData[importProp] = cleaned;
    } else {
      _.log('Conversion «import» property must be a string or function. ' +
        'String means key of tool data to import. Function accepts a imported string and return composed tool data.');

      return;
    }

    this.Editor.BlockManager.replace({
      tool: replacingToolName,
      data: newBlockData,
    });
    this.Editor.BlockSelection.clearSelection();

    this.close();
    this.Editor.InlineToolbar.close();

    _.delay(() => {
      this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock);
    }, 10)();
  }

  /**
   * Merges many Blocks into one
   * For that Tools must provide import/export methods and can provide an optional mergeImport method
   *
   * @param {string} replacingToolName - name of Tool which replaces current
   */
  public async mergeBlocks(replacingToolName: string): Promise<void> {
    /**
     * At first, we get all the selected blocks
     *
     * @type {BlockToolConstructable}
     */
    const selectedBlocks = [...this.selectedBlocks];
    const blocksData = await Promise.all(selectedBlocks.map(async (block) => {
      const savedBlock = await block.save();

      return savedBlock && savedBlock.data;
    }));

    /**
     * Getting a class of replacing Tool
     *
     * @type {BlockToolConstructable}
     */
    const replacingTool = this.Editor.Tools.blockTools.get(replacingToolName);

    /**
     * Export property can be:
     * 1) Function — Tool defines which data to return
     * 2) String — the name of saved property
     *
     * In both cases returning value must be a string
     */
    const exportData = [];

    blocksData.forEach((data, index) => {
      const currentBlock = selectedBlocks[index];
      const currentBlockTool = currentBlock.tool;
      const exportProp = currentBlockTool?.conversionConfig?.export;

      if (_.isFunction(exportProp)) {
        exportData.push(exportProp(data));
      } else if (_.isString(exportProp)) {
        exportData.push(data[exportProp]);
      } else {
        _.log(`Conversion «export» property not defined on ${currentBlock.tool.toString()}`);
      }
    });

    /**
     * Clean exported data with replacing sanitizer config
     */
    const cleaned: string[] = exportData.map(data => this.Editor.Sanitizer.clean(
      data,
      replacingTool.sanitizeConfig
    ));

    let newBlockData = {};
    const conversionConfig = replacingTool.conversionConfig;

    /**
     * «mergeImport» property can be a Function
     * function — accept imported strings and compose tool data object
     */
    if (conversionConfig && conversionConfig.mergeImport) {
      const mergeImport = conversionConfig.mergeImport;

      if (_.isFunction(mergeImport)) {
        newBlockData = mergeImport(cleaned, blocksData);
      } else {
        _.log('Conversion «mergeImport» property must be a  function. ' +
          'Function accepts a imported string array and return composed tool data.');

        return;
      }

      /**
       * «import» property can be Function or String
       * function — accept imported string and compose tool data object
       * string — the name of data field to import
       */
    } else if (conversionConfig && conversionConfig.import) {
      const importProp = conversionConfig.import;
      const joinedCleaned = cleaned.join(' ');

      if (_.isFunction(importProp)) {
        newBlockData = importProp(joinedCleaned);
      } else if (_.isString(importProp)) {
        newBlockData[importProp] = joinedCleaned;
      } else {
        _.log('Conversion «import» property must be a string or function. ' +
          'String means key of tool data to import. Function accepts a imported string and return composed tool data.');

        return;
      }
    }

    const { BlockManager } = this.Editor;
    const [first, ...deletedBlocks] = selectedBlocks;

    const index = BlockManager.blocks.indexOf(first);

    const block = this.Editor.BlockManager.insert({
      tool: replacingToolName,
      data: newBlockData,
      replace: true,
      index,
    });

    deletedBlocks.forEach((deletedBlock) => {
      const deletedIndex = BlockManager.blocks.indexOf(deletedBlock);

      this.Editor.BlockManager.removeBlock(deletedIndex);
    });

    this.Editor.BlockSelection.clearSelection();
    this.close();
    this.Editor.InlineToolbar.close();

    _.delay(() => {
      this.Editor.Caret.setToBlock(block);
    }, 10)();
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
        const toolboxSettings = tool.toolbox;
        const conversionConfig = tool.conversionConfig;

        /**
         * Skip tools that don't pass 'toolbox' property
         */
        if (_.isEmpty(toolboxSettings) || !toolboxSettings.icon) {
          return;
        }

        /**
         * Skip tools without «import» rule specified
         */
        if (!conversionConfig || !conversionConfig.import) {
          return;
        }

        this.addTool(name, toolboxSettings.icon, toolboxSettings.title);
      });
  }

  /**
   * Add tool to the Conversion Toolbar
   *
   * @param {string} toolName - name of Tool to add
   * @param {string} toolIcon - Tool icon
   * @param {string} title - button title
   */
  private addTool(toolName: string, toolIcon: string, title: string): void {
    const tool = $.make('div', [ConversionToolbar.CSS.conversionTool]);
    const icon = $.make('div', [ConversionToolbar.CSS.conversionToolIcon]);

    tool.dataset.tool = toolName;
    icon.innerHTML = toolIcon;

    $.append(tool, icon);
    $.append(tool, $.text(I18n.t(I18nInternalNS.toolNames, title || _.capitalize(toolName))));

    $.append(this.nodes.tools, tool);
    this.tools[toolName] = tool;

    this.listeners.on(tool, 'click', async () => {
      if (this.selectedBlocks.length > 1) {
        this.mergeBlocks(toolName);

        return;
      }
      await this.replaceWithBlock(toolName);
    });
  }

  /**
   * Hide current Tool and show others
   *
   * @param {boolean} hasMultipleBlocks - show all if has multiple blocks
   */
  private filterTools(hasMultipleBlocks: boolean): void {
    const { currentBlock } = this.Editor.BlockManager;

    /**
     * Show previously hided
     */
    Object.entries(this.tools).forEach(([name, button]) => {
      button.hidden = false;
      button.classList.toggle(ConversionToolbar.CSS.conversionToolHidden, hasMultipleBlocks ? false : name === currentBlock.name);
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
