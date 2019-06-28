import Module from '../../__module';
import $ from '../../dom';
import {BlockToolConstructable} from '../../../../types';
import _ from '../../utils';
import {SavedData} from '../../../types-internal/block-data';
import Block from '../../block';

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
      conversionTool: 'ce-conversion-tool',

      conversionToolFocused : 'ce-conversion-tool--focused',
      conversionToolActive : 'ce-conversion-tool--active',
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
   * @type {boolean}
   */
  public opened: boolean = false;

  /**
   * Focused button index
   * -1 equals no chosen Tool
   * @type {number}
   */
  private focusedButtonIndex: number = -1;

  /**
   * Available tools
   */
  private tools: { [key: string]: HTMLElement } = {};

  /**
   * Create UI of Conversion Toolbar
   */
  public make(): void {
    this.nodes.wrapper = $.make('div', ConversionToolbar.CSS.conversionToolbarWrapper);
    this.nodes.tools = $.make('div', ConversionToolbar.CSS.conversionToolbarTools);

    /**
     * Add Tools that has 'import' method
     */
    this.addTools();

    $.append(this.nodes.wrapper, this.nodes.tools);
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  /**
   * Try to show Conversion Toolbar near passed Block
   * @param {Block} block - block to convert
   */
  public tryToShow(block: Block): void {
    const hasExportConfig = block.class.conversionConfig && block.class.conversionConfig.export;

    if (!hasExportConfig) {
      return;
    }

    const currentToolName = block.name;

    /**
     * Focus current tool in conversion toolbar
     */
    if (this.tools[currentToolName]) {
      /**
       * Drop previous active button before moving
       */
      if (this.focusedButton && this.focusedButton.classList.contains(ConversionToolbar.CSS.conversionToolActive)) {
        // this.dropFocusedButton();
        this.focusedButton.classList.remove(ConversionToolbar.CSS.conversionToolActive);
      }

      this.tools[currentToolName].classList.add(ConversionToolbar.CSS.conversionToolActive);

      // Array.from(this.nodes.tools.childNodes).forEach((tool, index) => {
      //   if ((tool as HTMLElement).classList.contains(ConversionToolbar.CSS.conversionToolActive)) {
      //     this.focusedButtonIndex = index;
      //   }
      // });
    }

    this.move(block);

    if (!this.opened) {
      this.open();
    }
  }

  /**
   * Shows Conversion Toolbar
   */
  public open(): void {
    this.opened = true;
    this.nodes.wrapper.classList.add(ConversionToolbar.CSS.conversionToolbarShowed);
  }

  /**
   * Closes Conversion Toolbar
   */
  public close(): void {
    this.opened = false;
    this.nodes.wrapper.classList.remove(ConversionToolbar.CSS.conversionToolbarShowed);

    this.dropFocusedButton();
  }

  /**
   * Leaf tools by Tab
   * @todo use class with tool iterator
   */
  public leaf(direction: string = 'right'): void {
    const toolsElements = (Array.from(this.nodes.tools.childNodes) as HTMLElement[]);
    this.focusedButtonIndex = $.leafNodesAndReturnIndex(
      toolsElements, this.focusedButtonIndex, direction, ConversionToolbar.CSS.conversionToolFocused,
    );
  }

  /**
   * Returns focused tool as HTML element
   * @return {HTMLElement}
   */
  public get focusedButton(): HTMLElement {
    if (this.focusedButtonIndex === -1) {
      return null;
    }
    return (this.nodes.tools.childNodes[this.focusedButtonIndex] as HTMLElement);
  }

  /**
   * Drops focused button
   */
  public dropFocusedButton() {
    Object.values(this.tools).forEach( (tool) => {
      (tool as HTMLElement).classList
        .remove(ConversionToolbar.CSS.conversionToolActive, ConversionToolbar.CSS.conversionToolFocused);
    });

    this.focusedButtonIndex = -1;
  }

  /**
   * Replaces one Block with another
   * For that Tools must provide import/export methods
   *
   * @param {string} replacingToolName
   */
  public async replaceWithBlock(replacingToolName: string): Promise <void> {
    /**
     * At first, we get current Block data
     * @type {BlockToolConstructable}
     */
    const currentBlockClass = this.Editor.BlockManager.currentBlock.class;
    const currentBlockName = this.Editor.BlockManager.currentBlock.name;
    const savedBlock = await this.Editor.BlockManager.currentBlock.save() as SavedData;
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
    let exportData: string = '';
    const exportProp = currentBlockClass.conversionConfig.export;

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
      replacingTool.sanitize,
    );

    /**
     * «import» property can be Function or String
     * function — accept imported string and compose tool data object
     * string — the name of data field to import
     */
    let newBlockData = {};
    const importProp = replacingTool.conversionConfig.import;

    if (typeof importProp === 'function') {
      newBlockData = importProp(cleaned);
    } else if (typeof importProp === 'string') {
      newBlockData[importProp] = cleaned;
    } else {
      _.log('Conversion «import» property must be a string or function. ' +
        'String means key of tool data to import. Function accepts a imported string and return composed tool data.');
      return;
    }

    this.Editor.BlockManager.replace(replacingToolName, newBlockData);
    this.Editor.BlockSelection.clearSelection();

    this.close();

    _.delay(() => {
      this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock);
    }, 10)();
  }

  /**
   * Move Conversion Toolbar to the working Block
   */
  private move(block: Block): void {
    const blockRect = block.pluginsContent.getBoundingClientRect();
    const wrapperRect = this.Editor.UI.nodes.wrapper.getBoundingClientRect();

    const newCoords = {
      x: blockRect.left - wrapperRect.left,
      y: blockRect.top + blockRect.height - wrapperRect.top,
    };

    this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
  }

  /**
   * Iterates existing Tools and inserts to the ConversionToolbar
   * if tools have ability to import
   */
  private addTools(): void {
    const tools = this.Editor.Tools.blockTools;

    for (const toolName in tools) {
      if (!tools.hasOwnProperty(toolName)) {
        continue;
      }

      const api = this.Editor.Tools.apiSettings;
      const toolClass = tools[toolName] as BlockToolConstructable;
      const toolToolboxSettings = toolClass[api.TOOLBOX];
      const conversionConfig = toolClass[api.CONVERSION_CONFIG];

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

      this.addTool(toolName, toolToolboxSettings.icon);
    }
  }

  /**
   * Add tool to the Conversion Toolbar
   */
  private addTool(toolName: string, toolIcon: string): void {
    const tool = $.make('div', [ ConversionToolbar.CSS.conversionTool ]);

    tool.dataset.tool = toolName;
    tool.innerHTML = toolIcon;

    $.append(this.nodes.tools, tool);
    this.tools[toolName] = tool;

    this.Editor.Listeners.on(tool, 'click', async () => {
      await this.replaceWithBlock(toolName);
    });
  }
}
