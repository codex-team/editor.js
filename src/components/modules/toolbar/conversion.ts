import Module from '../../__module';
import $ from '../../dom';
import {BlockToolConstructable} from '../../../../types';
import _ from '../../utils';
import {SavedData} from '../../../types-internal/block-data';
import SelectionUtils from '../../selection';

export default class ConversionToolbar extends Module {

  /**
   * CSS getter
   */
  public static get CSS(): { [key: string]: string } {
    return {
      conversionToolbar: 'ce-conversion-toolbar',
      conversionToolbarShowed: 'ce-conversion-toolbar--showed',
      conversionToolsWrapper: 'ce-conversion-toolbar__tools',
      conversionTool: 'ce-conversion-tool',

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
   * editor open/close identifier
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
   * available tools
   */
  private tools: { [key: string]: HTMLElement } = {};

  /**
   * @type {number}
   */
  private defaultOffsetTop: number = 65;

  /**
   * prepares Converter toolbar
   *
   * @return {boolean}
   */
  public make() {
    this.nodes.wrapper = $.make('div', ConversionToolbar.CSS.conversionToolbar);
    this.nodes.tools = $.make('div', ConversionToolbar.CSS.conversionToolsWrapper);

    /**
     * add Tools that has import/export functions
     */
    this.addTools();

    $.append(this.nodes.wrapper, this.nodes.tools);
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  /**
   * Shows Inline Toolbar by keyup/mouseup
   * @param {KeyboardEvent|MouseEvent} event
   * @param {boolean} force - selects Block and removes all ranges
   */
  public handleShowingEvent(event, force = false): void {
    const { BlockManager, BlockSelection } = this.Editor;
    const currentBlock = BlockManager.currentBlock;

    if (!currentBlock || BlockSelection.allBlocksSelected || (!force && currentBlock && !currentBlock.selected)) {
      this.close();
      return;
    }

    /**
     * Force Block selection
     */
    if (force) {
      currentBlock.selected = true;
      SelectionUtils.get().removeAllRanges();
    }

    const currentToolName = BlockManager.currentBlock.name;

    if (this.tools[currentToolName]) {
      this.tools[currentToolName].classList.add(ConversionToolbar.CSS.conversionToolActive);

      this.nodes.tools.childNodes.forEach((tool, index) => {
        if ((tool as HTMLElement).classList.contains(ConversionToolbar.CSS.conversionToolActive)) {
          this.focusedButtonIndex = index;
        }
      });
    }

    this.move();
    this.open();
  }

  /**
   * shows ConversionToolbar
   */
  public open(): void {
    this.opened = true;
    this.nodes.wrapper.classList.add(ConversionToolbar.CSS.conversionToolbarShowed);
  }

  /**
   * closes ConversionToolbar
   */
  public close(): void {
    this.opened = false;
    this.nodes.wrapper.classList.remove(ConversionToolbar.CSS.conversionToolbarShowed);

    this.dropFocusedButton();
  }

  /**
   * leaf tools
   */
  public leaf(direction: string = 'right'): void {
    const toolsElements = (Array.from(this.nodes.tools.childNodes) as HTMLElement[]);
    this.focusedButtonIndex = $.leafNodesAndReturnIndex(
      toolsElements, this.focusedButtonIndex, direction, ConversionToolbar.CSS.conversionToolActive,
    );
  }

  /**
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
    if (this.focusedButtonIndex === -1) {
      return;
    }

    Object.values(this.nodes.tools.childNodes).forEach( (tool) => {
      (tool as HTMLElement).classList.remove(ConversionToolbar.CSS.conversionToolActive);
    });

    this.focusedButtonIndex = -1;
  }

  /**
   * Replaces one Block to Another
   * For that Tools must provide import/export methods
   *
   * @param {string} replacingToolName
   */
  public async replaceWithBlock(replacingToolName: string): Promise <void> {
    /**
     * first we get current Block data
     * @type {BlockToolConstructable}
     */
    const currentBlockClass = this.Editor.BlockManager.currentBlock.class;
    const currentBlockName = this.Editor.BlockManager.currentBlock.name;
    const savedBlock = await this.Editor.BlockManager.currentBlock.save() as SavedData;
    const blockData = savedBlock.data;

    if (currentBlockName === replacingToolName) {
      replacingToolName = this.config.initialBlock;
    }

    /**
     * getting replacing Block class
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
    const exportProp = currentBlockClass.conversionConfig.export;
    if (typeof exportProp === 'function') {
      exportData = exportProp(blockData);
    } else if (typeof exportProp === 'string') {
      exportData = blockData[exportProp];
    } else {
      console.log('export property must be the name of saved data or function that returns string');
      return;
    }

    /**
     * Clean exported data with replacing sanitizer config
     */
    const cleaned = this.Editor.Sanitizer.clean(
      exportData,
      replacingTool.sanitize,
    );

    /**
     * Import property also can be Function or string
     * When import is Function than Tool gets known object with data and returns a string
     * When import is string than it means is the name of data field
     */
    let newBlockData = {};
    const importProp = replacingTool.conversionConfig.import;
    if (typeof importProp === 'function') {
      newBlockData = importProp(cleaned);
    } else if (typeof importProp === 'string') {
      newBlockData[importProp] = cleaned;
    } else {
      console.log('import property must be the name of property or function that return data object');
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
   * Move Toolbar to the selected text
   */
  private move(): void {
    const targetBlock = this.Editor.BlockManager.currentBlock.pluginsContent as HTMLElement;
    const targetBlockCoords = targetBlock.getBoundingClientRect();
    const wrapperCoords = this.Editor.UI.nodes.wrapper.getBoundingClientRect();

    const newCoords = {
      x: targetBlockCoords.left - wrapperCoords.left,
      y: window.scrollY + targetBlockCoords.bottom - this.defaultOffsetTop,
    };

    this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
  }

  /**
   * Iterates existing Tools and inserts to the ConversionToolbar
   * if tools have ability to import/export
   */
  private addTools(): void {
    const tools = this.Editor.Tools.available;

    for (const toolName in tools) {
      if (!tools.hasOwnProperty(toolName)) {
        continue;
      }

      const api = this.Editor.Tools.apiSettings;
      const toolClass = tools[toolName] as BlockToolConstructable;
      const toolToolboxSettings = toolClass[api.TOOLBOX];

      if (toolClass.isInline) {
        continue;
      }

      /**
       * Skip tools that don't pass 'toolbox' property
       */
      if (_.isEmpty(toolToolboxSettings)) {
        continue;
      }

      if (toolToolboxSettings && !toolToolboxSettings.icon) {
        continue;
      }

      if (!toolClass.conversionConfig) {
        continue;
      }

      const hasImport = toolClass.conversionConfig.import;
      const hasExport = toolClass.conversionConfig.export;

      if (!hasImport || !hasExport) {
        continue;
      }

      this.addTool(toolName, toolToolboxSettings.icon);
    }
  }

  /**
   * add tool to the conversion toolbar
   */
  private addTool(toolName: string, toolIcon: string): void {
    const tool = $.make('div', [ ConversionToolbar.CSS.conversionTool ]);

    tool.dataset.tool = toolName;
    tool.innerHTML = toolIcon;

    $.append(this.nodes.tools, tool);
    this.tools[toolName] = tool;

    /**
     * Add click listener
     */
    this.Editor.Listeners.on(tool, 'click', async (event: MouseEvent) => {
      await this.replaceWithBlock(toolName);
    });
  }
}
