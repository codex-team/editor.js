import Module from '../../__module';
import $ from '../../dom';
import { BlockToolConstructable } from '../../../../types';
import * as _ from '../../utils';
import { SavedData } from '../../../types-internal/block-data';
import Flipper from '../../flipper';
import I18n from '../../i18n';
import { I18nInternalNS } from '../../i18n/namespace-internal';

/**
 * Block Converter
 */
export default class ConversionToolbar extends Module {
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
   * HTML Elements used for UI
   */
  public nodes: { [key: string]: HTMLElement } = {
    wrapper: null,
    tools: null,
  };

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
    this.nodes.wrapper = $.make('div', ConversionToolbar.CSS.conversionToolbarWrapper);
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

    if (typeof togglingCallback === 'function') {
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
     * We use timeout to prevent bubbling Enter keydown on first dropdown item
     * Conversion flipper will be activated after dropdown will open
     */
    setTimeout(() => {
      this.flipper.activate(Object.values(this.tools).filter((button) => {
        return !button.classList.contains(ConversionToolbar.CSS.conversionToolHidden);
      }));
      this.flipper.focusFirst();

      if (typeof this.togglingCallback === 'function') {
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

    if (typeof this.togglingCallback === 'function') {
      this.togglingCallback(false);
    }
  }

  /**
   * Returns true if it has more than one tool available for convert in
   */
  public hasTools(): boolean {
    const tools = Object.keys(this.tools); // available tools in array representation

    return !(tools.length === 1 && tools.shift() === this.config.initialBlock);
  }

  /**
   * Replaces one Block with another
   * For that Tools must provide import/export methods
   *
   * @param {string} replacingToolName - name of Tool which replaces current
   */
  public async replaceWithBlock(replacingToolName: string): Promise <void> {
    /**
     * At first, we get current Block data
     *
     * @type {BlockToolConstructable}
     */
    const currentBlockClass = this.Editor.BlockManager.currentBlock.class;
    const currentBlockName = this.Editor.BlockManager.currentBlock.name;
    const savedBlock = await this.Editor.BlockManager.currentBlock.save() as SavedData;
    const { INTERNAL_SETTINGS } = this.Editor.Tools;
    const blockData = savedBlock.data;

    /**
     * When current Block name is equals to the replacing tool Name,
     * than convert this Block back to the initial Block
     */
    if (currentBlockName === replacingToolName) {
      replacingToolName = this.config.initialBlock;
    }

    /**
     * Getting a class of replacing Tool
     *
     * @type {BlockToolConstructable}
     */
    const replacingTool = this.Editor.Tools.toolsClasses[replacingToolName] as BlockToolConstructable;

    /**
     * Export property can be:
     * 1) Function — Tool defines which data to return
     * 2) String — the name of saved property
     *
     * In both cases returning value must be a string
     */
    let exportData = '';
    const exportProp = currentBlockClass[INTERNAL_SETTINGS.CONVERSION_CONFIG].export;

    if (typeof exportProp === 'function') {
      exportData = exportProp(blockData);
    } else if (typeof exportProp === 'string') {
      exportData = blockData[exportProp];
    } else {
      _.log('Conversion «export» property must be a string or function. ' +
        'String means key of saved data object to export. Function should export processed string to export.');

      return;
    }

    /**
     * Clean exported data with replacing sanitizer config
     */
    const cleaned: string = this.Editor.Sanitizer.clean(
      exportData,
      replacingTool.sanitize
    );

    /**
     * «import» property can be Function or String
     * function — accept imported string and compose tool data object
     * string — the name of data field to import
     */
    let newBlockData = {};
    const importProp = replacingTool[INTERNAL_SETTINGS.CONVERSION_CONFIG].import;

    if (typeof importProp === 'function') {
      newBlockData = importProp(cleaned);
    } else if (typeof importProp === 'string') {
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
   * Iterates existing Tools and inserts to the ConversionToolbar
   * if tools have ability to import
   */
  private addTools(): void {
    const tools = this.Editor.Tools.blockTools;

    for (const toolName in tools) {
      if (!Object.prototype.hasOwnProperty.call(tools, toolName)) {
        continue;
      }

      const internalSettings = this.Editor.Tools.INTERNAL_SETTINGS;
      const toolClass = tools[toolName] as BlockToolConstructable;
      const toolToolboxSettings = toolClass[internalSettings.TOOLBOX];
      const conversionConfig = toolClass[internalSettings.CONVERSION_CONFIG];

      /**
       * Skip tools that don't pass 'toolbox' property
       */
      if (_.isEmpty(toolToolboxSettings) || !toolToolboxSettings.icon) {
        continue;
      }

      /**
       * Skip tools without «import» rule specified
       */
      if (!conversionConfig || !conversionConfig.import) {
        continue;
      }

      this.addTool(toolName, toolToolboxSettings.icon, toolToolboxSettings.title);
    }
  }

  /**
   * Add tool to the Conversion Toolbar
   *
   * @param {string} toolName - name of Tool to add
   * @param {string} toolIcon - Tool icon
   * @param {string} title - button title
   */
  private addTool(toolName: string, toolIcon: string, title: string): void {
    const tool = $.make('div', [ ConversionToolbar.CSS.conversionTool ]);
    const icon = $.make('div', [ ConversionToolbar.CSS.conversionToolIcon ]);

    tool.dataset.tool = toolName;
    icon.innerHTML = toolIcon;

    $.append(tool, icon);
    $.append(tool, $.text(I18n.t(I18nInternalNS.toolNames, title || _.capitalize(toolName))));

    $.append(this.nodes.tools, tool);
    this.tools[toolName] = tool;

    this.Editor.Listeners.on(tool, 'click', async () => {
      await this.replaceWithBlock(toolName);
    });
  }

  /**
   * Hide current Tool and show others
   */
  private filterTools(): void {
    const { currentBlock } = this.Editor.BlockManager;

    /**
     * Show previously hided
     */
    Object.entries(this.tools).forEach(([name, button]) => {
      button.hidden = false;
      button.classList.toggle(ConversionToolbar.CSS.conversionToolHidden, name === currentBlock.name);
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
