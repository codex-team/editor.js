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
    this.beforeKeydownProcessing();

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

      default:
        this.defaultHandler();
        break;
    }
  }

  /**
   * Fires on keydown before event processing
   */
  public beforeKeydownProcessing(): void {
    /**
     * Clear all highlightings
     */
    this.Editor.BlockManager.clearHighlightings();

    /**
     * Hide Toolbar
     */
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
   * ENTER pressed on block
   * @param {KeyboardEvent} event - keydown
   */
  private enter(event: KeyboardEvent): void {
    const currentBlock = this.Editor.BlockManager.currentBlock,
      toolsConfig = this.config.toolsConfig[currentBlock.name];

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
     */
    this.Editor.BlockManager.split();

    /**
     * Renew local current node after split
     */
    const newCurrent = this.Editor.BlockManager.currentBlock;

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
}
