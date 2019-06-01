import Module from '../../__module';
import $ from '../../dom';
import {BlockToolConstructable, ToolboxConfig} from '../../../../types';
import _ from '../../utils';
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
    // if (!this.allowedToShow()) {
      // this.close();
      // return;
    // }

    console.log('hree');
    this.move();

    this.nodes.wrapper.classList.add(ConversionToolbar.CSS.conversionToolbarShowed);
    // this.open();
  }

  /**
   * Move Toolbar to the selected text
   */
  public move(): void {
    const selectionRect = SelectionUtils.rect as DOMRect;
    const wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();
    const newCoords = {
      x: selectionRect.x - wrapperOffset.left,
      y: selectionRect.y
      + selectionRect.height
      // + window.scrollY
      - wrapperOffset.top
      + 40,
    };

    /**
     * If we know selections width, place InlineToolbar to center
     */
    if (selectionRect.width) {
      newCoords.x += Math.floor(selectionRect.width / 2);
    }

    this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
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
    this.Editor.Listeners.on(tool, 'click', (event: KeyboardEvent|MouseEvent) => {
      console.log('clicked');
      // this.toolButtonActivate(event, toolName);
    });

    // /**
    //  * Enable shortcut
    //  */
    // const toolSettings = this.Editor.Tools.getToolSettings(toolName);
    //
    // if (toolSettings && toolSettings[this.Editor.Tools.apiSettings.SHORTCUT]) {
    //   this.enableShortcut(tool, toolName, toolSettings[this.Editor.Tools.apiSettings.SHORTCUT]);
    // }
    //
    // /** Increment Tools count */
    // this.displayedToolsCount++;
  }
}
