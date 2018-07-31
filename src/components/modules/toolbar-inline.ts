import IBlockTool from '../interfaces/tools/block-tool';

declare var Module: any;
declare var $: any;
declare var _: any;

import BoldInlineTool from '../inline-tools/inline-tool-bold';
import ItalicInlineTool from '../inline-tools/inline-tool-italic';
import LinkInlineTool from '../inline-tools/inline-tool-link';
import EditorConfig from '../interfaces/editor-config';
import InlineTool from '../interfaces/tools/inline-tool';
import Selection from '../selection';

/**
 * Inline toolbar with actions that modifies selected text fragment
 *
 * |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
 * |   B  i [link] [mark]   |
 * |________________________|
 */
export default class InlineToolbar extends Module {

  /**
   * CSS styles
   */
  public CSS = {
    inlineToolbar: 'ce-inline-toolbar',
    inlineToolbarShowed: 'ce-inline-toolbar--showed',
    buttonsWrapper: 'ce-inline-toolbar__buttons',
    actionsWrapper: 'ce-inline-toolbar__actions',
  };

  /**
   * Inline Toolbar elements
   */
  private nodes = {
    wrapper: null,
    buttons: null,
    /**
     * Zone below the buttons where Tools can create additional actions by 'renderActions()' method
     * For example, input for the 'link' tool or textarea for the 'comment' tool
     */
    actions: null,
  };

  /**
   * Margin above/below the Toolbar
   */
  private readonly toolbarVerticalMargin: number = 20;

  /**
   * Tools instances
   */
  private toolsInstances: Map<string, InlineTool>;

  /**
   * @constructor
   * @param {EditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Inline Toolbar Tools
   * includes internal and external tools
   *
   * @returns Map<string, InlineTool>
   */
  get tools(): Map<string, InlineTool> {
    if (!this.toolsInstances || this.toolsInstances.size === 0) {
      const allTools = {...this.internalTools, ...this.externalTools};

      this.toolsInstances = new Map();
      for (const tool in allTools) {
        if (allTools.hasOwnProperty(tool)) {
          this.toolsInstances.set(tool, allTools[tool]);
        }
      }
    }

    return this.toolsInstances;
  }

  /**
   * Making DOM
   */
  public make() {
    this.nodes.wrapper = $.make('div', this.CSS.inlineToolbar);
    this.nodes.buttons = $.make('div', this.CSS.buttonsWrapper);
    this.nodes.actions = $.make('div', this.CSS.actionsWrapper);

    /**
     * Append Inline Toolbar to the Editor
     */
    $.append(this.nodes.wrapper, [this.nodes.buttons, this.nodes.actions]);
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

    /**
     * Append Inline Toolbar Tools
     */
    this.addTools();

  }

  /**
   *  Moving / appearance
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  /**
   * Shows Inline Toolbar by keyup/mouseup
   * @param {KeyboardEvent|MouseEvent} event
   */
  public handleShowingEvent(event): void {
    if (!this.allowedToShow(event)) {
      this.close();
      return;
    }

    this.move();
    this.open();

    /** Check Tools state for selected fragment */
    this.checkToolsState();
  }

  /**
   * Move Toolbar to the selected text
   */
  public move(): void {
    const selectionRect = Selection.rect;
    const wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();
    const newCoords = {
      x: selectionRect.x - wrapperOffset.left,
      y: selectionRect.y
          + selectionRect.height
          // + window.scrollY
          - wrapperOffset.top
          + this.toolbarVerticalMargin,
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
   * Shows Inline Toolbar
   */
  private open() {
    this.nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed);
    this.tools.forEach( (toolInstance, toolName) => {
      if (typeof toolInstance.clear === 'function') {
        toolInstance.clear();
      }
    });
  }

  /**
   * Hides Inline Toolbar
   */
  private close() {
    this.nodes.wrapper.classList.remove(this.CSS.inlineToolbarShowed);
    this.tools.forEach( (toolInstance, toolName) => {
      if (typeof toolInstance.clear === 'function') {
        toolInstance.clear();
      }
    });
  }

  /**
   * Need to show Inline Toolbar or not
   * @param {KeyboardEvent|MouseEvent} event
   */
  private allowedToShow(event): boolean {
    /**
     * Tags conflicts with window.selection function.
     * Ex. IMG tag returns null (Firefox) or Redactors wrapper (Chrome)
     */
    const tagsConflictsWithSelection = ['IMG', 'INPUT'];

    if (event && tagsConflictsWithSelection.includes(event.target.tagName)) {
      return false;
    }

    const currentSelection = Selection.get(),
      selectedText = Selection.text;

    // old browsers
    if (!currentSelection || !currentSelection.anchorNode) {
      return false;
    }

    // empty selection
    if (currentSelection.isCollapsed || selectedText.length < 1) {
      return false;
    }

    // is enabled by current Block's Tool
    const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode);

    if (!currentBlock) {
      return false;
    }

    const toolSettings = this.Editor.Tools.getToolSettings(currentBlock.name);

    return toolSettings && toolSettings[this.Editor.Tools.apiSettings.IS_ENABLED_INLINE_TOOLBAR];
  }

  /**
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  /**
   * Fill Inline Toolbar with Tools
   */
  private addTools(): void {
    this.tools.forEach( (toolInstance, toolName) => {
      this.addTool(toolName, toolInstance);
    });
  }

  /**
   * Add tool button and activate clicks
   */
  private addTool(toolName: string, tool: InlineTool): void {
    const button = tool.render();

    if (!button) {
      _.log('Render method must return an instance of Node', 'warn', toolName);
      return;
    }

    this.nodes.buttons.appendChild(button);

    if (typeof tool.renderActions === 'function') {
      const actions = tool.renderActions();
      this.nodes.actions.appendChild(actions);
    }

    this.Editor.Listeners.on(button, 'click', () => {
      this.toolClicked(tool);
    });

    /**
     * Enable shortcuts
     * Ignore tool that doesn't have shortcut or empty string
     */
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);

    let shortcut = null;

    /**
     * 1) For internal tools, check public getter 'shortcut'
     * 2) For external tools, check tool's settings
     */
    if (this.internalTools[toolName]) {
      shortcut = this.internalTools[toolName].shortcut;
    } else if (toolSettings && toolSettings[this.Editor.Tools.apiSettings.SHORTCUT]) {
      shortcut = toolSettings[this.Editor.Tools.apiSettings.SHORTCUT];
    }

    if (shortcut) {
      this.enableShortcuts(tool, shortcut);
    }
  }

  /**
   * Enable Tool shortcut with Editor Shortcuts Module
   * @param {InlineTool} tool - Tool instance
   * @param {string} shortcut - shortcut according to the Shortcut Module format
   */
  private enableShortcuts(tool: InlineTool, shortcut: string): void {
    this.Editor.Shortcuts.add({
      name: shortcut,
      handler: (event) => {
        const {currentBlock} = this.Editor.BlockManager,
          toolSettings =  this.Editor.Tools.getToolSettings(currentBlock.name);

        if (!toolSettings || !toolSettings[this.Editor.Tools.apiSettings.IS_ENABLED_INLINE_TOOLBAR]) {
          return;
        }

        event.preventDefault();
        this.toolClicked(tool);
      },
    });
  }

  /**
   * Inline Tool button clicks
   * @param {InlineTool} tool - Tool's instance
   */
  private toolClicked(tool: InlineTool): void {
    const range = Selection.range;

    tool.surround(range);
    this.checkToolsState();
  }

  /**
   * Check Tools` state by selection
   */
  private checkToolsState(): void {
    this.tools.forEach( (toolInstance, toolName) => {
      toolInstance.checkState(Selection.get());
    });
  }

  /**
   * Returns internal inline tools
   * Includes Bold, Italic, Link
   */
  private get internalTools(): {[name: string]: InlineTool} {
    return {
      bold: new BoldInlineTool(this.Editor.API.methods),
      italic: new ItalicInlineTool(this.Editor.API.methods),
      link: new LinkInlineTool(this.Editor.API.methods),
    };
  }

  /**
   * Get external tools
   * Tools that has isInline is true
   */
  private get externalTools(): {[name: string]: InlineTool} {
    const result = {};

    for (const tool in this.Editor.Tools.inline) {
      if (this.Editor.Tools.inline.hasOwnProperty(tool)) {
        result[tool] = new this.Editor.Tools.inline[tool](this.Editor.API.methods);
      }
    }

    return result;
  }
}
