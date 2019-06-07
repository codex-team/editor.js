import Module from '../../__module';
import $ from '../../dom';
import {BaseToolConstructable, BlockToolConstructable} from '../../../../types';
import _ from '../../utils';
import {SavedData} from '../../../types-internal/block-data';

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

    /**
     * append to the UI
     */
    $.append(this.nodes.wrapper, this.nodes.tools);
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  /**
   * Shows Inline Toolbar by keyup/mouseup
   * @param {KeyboardEvent|MouseEvent} event
   */
  public handleShowingEvent(event): void {
    const { BlockManager, BlockSelection } = this.Editor;
    const currentBlock = BlockManager.currentBlock;

    if (!currentBlock || BlockSelection.allBlocksSelected || (currentBlock && !currentBlock.selected)) {
      this.close();
      return;
    }

    this.move();
    this.open();
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

    const tool = (this.nodes.tools.childNodes[this.focusedButtonIndex] as HTMLElement);
    tool.classList.remove(ConversionToolbar.CSS.conversionToolActive);

    this.focusedButtonIndex = -1;
  }

  /**
   * console.log('here I need to switch');
   */
  public switchBlocks(): void {
    console.log('here I need to switch');
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
   * shows ConversionToolbar
   */
  private open(): void {
    this.opened = true;
    this.nodes.wrapper.classList.add(ConversionToolbar.CSS.conversionToolbarShowed);
  }

  /**
   * closes ConversionToolbar
   */
  private close(): void {
    this.opened = false;
    this.nodes.wrapper.classList.remove(ConversionToolbar.CSS.conversionToolbarShowed);

    this.dropFocusedButton();
  }

  /**
   *
   */
  private addTools(): void {
    const tools = this.Editor.Tools.available;

    for (const toolName in tools) {
      if (tools.hasOwnProperty(toolName)) {
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

        // @todo
        // check if tool has import/export

        this.addTool(toolName, toolToolboxSettings.icon);
      }
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

    /**
     * Add click listener
     */
    this.Editor.Listeners.on(tool, 'click', async (event: MouseEvent) => {
      const currentBlockToolClass = this.Editor.BlockManager.currentBlock.class;
      const savedBlock = await this.Editor.BlockManager.currentBlock.save() as SavedData;
      const blockData = savedBlock.data;

      const replacingTool = this.Editor.Tools.toolsClasses[toolName] as BlockToolConstructable;
      const newBlockData = {};

      newBlockData[replacingTool.conversionConfig.export] = this.Editor.Sanitizer.clean(blockData[currentBlockToolClass.conversionConfig.import], replacingTool.sanitize);

      this.Editor.BlockManager.replace(toolName, newBlockData);

      this.close();

      _.delay(() => {
        this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock);
      }, 10)();
    });
  }
}
