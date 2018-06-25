/**
 * Inline toolbar with actions that modifies selected text fragment
 *
 * |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
 * |   B  i [link] [mark]   |
 * | _______________________|
 */
declare var Module: any;
declare var $: any;
declare var _: any;
import BoldInlineTool from '../inline-tools/inline-tool-bold';
import LinkInlineTool from '../inline-tools/inline-tool-link';
import InlineTool from '../interfaces/inline-tool';
import Selection from '../selection';

export default class InlineToolbar extends Module {

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
   * CSS styles
   */
  private CSS = {
    inlineToolbar: 'ce-inline-toolbar',
    inlineToolbarShowed: 'ce-inline-toolbar--showed',
    buttonsWrapper: 'ce-inline-toolbar__buttons',
    actionsWrapper: 'ce-inline-toolbar__actions',
  };

  /**
   * Margin above/below the Toolbar
   */
  private readonly toolbarVerticalMargin: number = 20;

  /**
   * Tools instances
   */
  private toolsInstances: InlineTool[];

  /**
   * @constructor
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Inline Toolbar Tools
   * @todo Merge internal tools with external
   */
  get tools(): InlineTool[] {
    if (!this.toolsInstances) {
      this.toolsInstances = [
        new BoldInlineTool(this.Editor.API.methods),
        new LinkInlineTool(this.Editor.API.methods),
      ];
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
   *
   *
   *  Moving / appearance
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *
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

    this.tools.forEach( (tool) => {
      if (typeof tool.clear === 'function') {
        tool.clear();
      }
    });
  }

  /**
   * Hides Inline Toolbar
   */
  private close() {
    this.nodes.wrapper.classList.remove(this.CSS.inlineToolbarShowed);

    this.tools.forEach( (tool) => {
      if (typeof tool.clear === 'function') {
        tool.clear();
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

    const toolConfig = this.config.toolsConfig[currentBlock.name];

    return toolConfig && toolConfig[this.Editor.Tools.apiSettings.IS_ENABLED_INLINE_TOOLBAR];
  }

  /**
   *
   *
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *
   */

  /**
   * Fill Inline Toolbar with Tools
   */
  private addTools(): void {
    this.tools.forEach( (tool) => {
      this.addTool(tool);
    });
  }

  /**
   * Add tool button and activate clicks
   * @param {InlineTool} tool - Tool's instance
   */
  private addTool(tool: InlineTool): void {
    const button = tool.render();

    this.nodes.buttons.appendChild(button);

    if (typeof tool.renderActions === 'function') {
      const actions = tool.renderActions();
      this.nodes.actions.appendChild(actions);
    }

    this.Editor.Listeners.on(button, 'click', () => {
      this.toolClicked(tool);
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
    this.tools.forEach( (tool) => {
      tool.checkState(Selection.get());
    });
  }
}
