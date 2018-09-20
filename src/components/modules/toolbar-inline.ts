declare var Module: any;
declare var $: any;

import BoldInlineTool from '../inline-tools/inline-tool-bold';
import ItalicInlineTool from '../inline-tools/inline-tool-italic';
import LinkInlineTool from '../inline-tools/inline-tool-link';
import EditorConfig from '../interfaces/editor-config';
import InlineTool from '../interfaces/tools/inline-tool';
import SelectionUtils from '../selection';
import _ from '../utils';

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
    inlineToolButton: 'ce-inline-tool',
    inlineToolButtonLast: 'ce-inline-tool--last',
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
    const selectionRect = SelectionUtils.rect as DOMRect;
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
    /**
     * Filter inline-tools and show only allowed by Block's Tool
     */
    this.filterTools();

    /**
     * Show Inline Toolbar
     */
    this.nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed);

    /**
     * Call 'clear' method for Inline Tools (for example, 'link' want to clear input)
     */
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

    const currentSelection = SelectionUtils.get(),
      selectedText = SelectionUtils.text;

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
   * Show only allowed Tools
   */
  private filterTools(): void {
    const currentSelection = SelectionUtils.get(),
      currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode);

    const toolSettings = this.Editor.Tools.getToolSettings(currentBlock.name),
      inlineToolbarSettings = toolSettings && toolSettings[this.Editor.Tools.apiSettings.IS_ENABLED_INLINE_TOOLBAR];

    /**
     * All Inline Toolbar buttons
     * @type {HTMLElement[]}
     */
    const buttons = Array.from(this.nodes.buttons.querySelectorAll(`.${this.CSS.inlineToolButton}`)) as HTMLElement[];

    /**
     * Show previously hided
     */
    buttons.forEach((button) => {
      button.hidden = false;
      button.classList.remove(this.CSS.inlineToolButtonLast);
    });

    /**
     * Filter buttons if Block Tool pass config like inlineToolbar=['link']
     */
    if (Array.isArray(inlineToolbarSettings)) {
      buttons.forEach((button) => {
        button.hidden = !inlineToolbarSettings.includes(button.dataset.tool);
      });
    }

    /**
     * Tick for removing right-margin from last visible button.
     * Current generation of CSS does not allow to filter :visible elements
     */
    const lastVisibleButton = buttons.filter((button) => !button.hidden).pop();

    if (lastVisibleButton) {
      lastVisibleButton.classList.add(this.CSS.inlineToolButtonLast);
    }
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

    button.dataset.tool = toolName;
    this.nodes.buttons.appendChild(button);

    if (typeof tool.renderActions === 'function') {
      const actions = tool.renderActions();
      this.nodes.actions.appendChild(actions);
    }

    this.Editor.Listeners.on(button, 'click', (event) => {
      this.toolClicked(event, tool);
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
        const {currentBlock} = this.Editor.BlockManager;

        /**
         * Editor is not focused
         */
        if (!currentBlock) {
          return;
        }

        /**
         * We allow to fire shortcut with empty selection (isCollapsed=true)
         * it can be used by tools like «Mention» that works without selection:
         * Example: by SHIFT+@ show dropdown and insert selected username
         */
        // if (SelectionUtils.isCollapsed) return;

        const toolSettings =  this.Editor.Tools.getToolSettings(currentBlock.name);

        if (!toolSettings || !toolSettings[this.Editor.Tools.apiSettings.IS_ENABLED_INLINE_TOOLBAR]) {
          return;
        }

        event.preventDefault();
        this.toolClicked(event, tool);
      },
    });
  }

  /**
   * Inline Tool button clicks
   * @param {MouseEvent} event - click on inline-tool
   * @param {InlineTool} tool - Tool's instance
   */
  private toolClicked(event: MouseEvent, tool: InlineTool): void {
    const range = SelectionUtils.range;

    tool.surround(range);
    this.checkToolsState();

    event.preventDefault();
  }

  /**
   * Check Tools` state by selection
   */
  private checkToolsState(): void {
    this.tools.forEach( (toolInstance, toolName) => {
      toolInstance.checkState(SelectionUtils.get());
    });
  }

  /**
   * Returns internal inline tools
   * Includes Bold, Italic, Link
   */
  private get internalTools(): {[name: string]: InlineTool} {
    return {
      bold: this.Editor.Tools.constructInline(BoldInlineTool),
      italic: this.Editor.Tools.constructInline(ItalicInlineTool),
      link: this.Editor.Tools.constructInline(LinkInlineTool),
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
        result[tool] = this.Editor.Tools.constructInline(this.Editor.Tools.inline[tool]);
      }
    }

    return result;
  }
}
