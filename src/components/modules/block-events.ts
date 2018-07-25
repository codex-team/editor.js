/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
declare var Module: any;
declare var $: any;
declare var _: any;

export default class BlockEvents extends Module {
  /**
   * @constructor
   */
  constructor({config}) {
    super({config});
  }

  /**
   * All keydowns on Block
   * @param {KeyboardEvent} event - keydown
   */
  public keydown(event: KeyboardEvent): void {
    /**
     * Run common method for all keydown events
     */
    this.beforeKeydownProcessing(event);

    /**
     * Fire keydown processor by event.keyCode
     */
    switch (event.keyCode) {
      case _.keyCodes.BACKSPACE:
        this.backspace(event);
        break;

      case _.keyCodes.ENTER:
        this.enter(event);
        break;

      case _.keyCodes.DOWN:
      case _.keyCodes.RIGHT:
        this.arrowRightAndDown();
        break;

      case _.keyCodes.UP:
      case _.keyCodes.LEFT:
        this.arrowLeftAndUp();
        break;

      case _.keyCodes.TAB:
        this.tabPressed(event);
        break;

      default:
        this.defaultHandler();
        break;
    }
  }

  /**
   * Fires on keydown before event processing
   * @param {KeyboardEvent} event - keydown
   */
  public beforeKeydownProcessing(event): void {
    /**
     * Clear all highlightings
     */
    this.Editor.BlockManager.clearHighlightings();

    /**
     * Do not close Toolbox on Tabs or on Enter with opened Toolbox
     */
    if (!this.needToolbarClosing(event)) {
      return;
    }

    this.Editor.Toolbar.close();
  }

  /**
   * Key up on Block:
   * - shows Inline Toolbar if something selected
   */
  public keyup(event): void {
    this.Editor.InlineToolbar.handleShowingEvent(event);
  }

  /**
   * Mouse up on Block:
   * - shows Inline Toolbar if something selected
   */
  public mouseUp(event): void {
    this.Editor.InlineToolbar.handleShowingEvent(event);
  }

  /**
   * Open Toolbox to leaf Tools
   * @param {KeyboardEvent} event
   */
  public tabPressed(event): void {

    /** Prevent Default behaviour */
    event.preventDefault();
    event.stopPropagation();

    /** this property defines leaf direction */
    const shiftKey = event.shiftKey,
      direction = shiftKey ? 'left' : 'right';

    if (this.Editor.Toolbar.opened) {
      this.Editor.Toolbox.open();
    }

    if (this.Editor.Toolbox.opened) {
      this.Editor.Toolbox.leaf(direction);
    }
  }

  /**
   * ENTER pressed on block
   * @param {KeyboardEvent} event - keydown
   */
  private enter(event: KeyboardEvent): void {
    const currentBlock = this.Editor.BlockManager.currentBlock,
      toolsConfig = this.config.toolsConfig[currentBlock.name];

    if (this.Editor.Toolbox.opened && this.Editor.Toolbox.getActiveTool) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.Editor.Toolbox.selectItem(this.Editor.Toolbox.getActiveTool);
      return;
    }

    /**
     * Don't handle Enter keydowns when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     */
    if (toolsConfig && toolsConfig[this.Editor.Tools.apiSettings.IS_ENABLED_LINE_BREAKS]) {
      return;
    }

    /**
     * Allow to create linebreaks by Shift+Enter
     */
    if (event.shiftKey) {
      return;
    }

    /**
     * Split the Current Block into two blocks
     * Renew local current node after split
     */
    const newCurrent = this.Editor.BlockManager.split();

    this.Editor.Caret.setToBlock(newCurrent);
    this.Editor.Toolbar.move();

    /**
     * If new Block is empty
     */
    if (this.Editor.Tools.isInitial(newCurrent.tool) && newCurrent.isEmpty) {
      /**
       * Show Toolbar
       */
      this.Editor.Toolbar.open();

      /**
       * Show Plus Button
       */
      this.Editor.Toolbar.plusButton.show();
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  /**
   * Handle backspace keydown on Block
   * @param {KeyboardEvent} event - keydown
   */
  private backspace(event: KeyboardEvent): void {
    const BM = this.Editor.BlockManager;

    const isFirstBlock = BM.currentBlockIndex === 0,
      canMergeBlocks = this.Editor.Caret.isAtStart && !isFirstBlock;

    /** If current Block is empty just remove this Block */
    if (this.Editor.BlockManager.currentBlock.isEmpty) {
      this.Editor.BlockManager.removeBlock();
      if (this.Editor.Caret.navigatePrevious(true)) {
        this.Editor.Toolbar.close();
      }
      return;
    }

    if (!canMergeBlocks) {
      return;
    }

    // preventing browser default behaviour
    event.preventDefault();

    const targetBlock = BM.getBlockByIndex(BM.currentBlockIndex - 1),
      blockToMerge = BM.currentBlock;

    /**
     * Blocks that can be merged:
     * 1) with the same Name
     * 2) Tool has 'merge' method
     *
     * other case will handle as usual ARROW LEFT behaviour
     */
    if (blockToMerge.name !== targetBlock.name || !targetBlock.mergeable) {
      if (this.Editor.Caret.navigatePrevious()) {
        this.Editor.Toolbar.close();
      }

      return;
    }

    this.Editor.Caret.createShadow(targetBlock.pluginsContent);
    BM.mergeBlocks(targetBlock, blockToMerge)
      .then( () => {
        /** Restore caret position after merge */
        this.Editor.Caret.restoreCaret(targetBlock.pluginsContent);
        targetBlock.pluginsContent.normalize();
        this.Editor.Toolbar.close();
      });
  }

  /**
   * Handle right and down keyboard keys
   */
  private arrowRightAndDown(): void {
    this.Editor.Caret.navigateNext();
  }

  /**
   * Handle left and up keyboard keys
   */
  private arrowLeftAndUp(): void {
    this.Editor.Caret.navigatePrevious();
  }

  /**
   * Default keydown handler
   */
  private defaultHandler(): void {}

  /**
   * Cases when we need to close Toolbar
   */
  private needToolbarClosing(event) {
    const toolboxItemSelected = (event.keyCode === _.keyCodes.ENTER && this.Editor.Toolbox.opened),
      flippingToolboxItems = event.keyCode === _.keyCodes.TAB;

    return !(event.shiftKey || flippingToolboxItems || toolboxItemSelected);
  }
}
