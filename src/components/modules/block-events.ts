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
    switch (event.keyCode) {
      case _.keyCodes.BACKSPACE:
        this.backspace(event);
        break;

      case _.keyCodes.ENTER:
        this.enter(event);
        break;

      case _.keyCodes.DOWN:
      case _.keyCodes.RIGHT:
        this.arrowRightAndDownPressed();
        break;

      case _.keyCodes.UP:
      case _.keyCodes.LEFT:
        this.arrowLeftAndUpPressed();
        break;

      default:
        break;
    }
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
    this.Editor.Toolbar.open();

    if (this.Editor.Tools.isInitial(newCurrent.tool) && newCurrent.isEmpty) {
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
      BM.navigatePrevious();
    }

    const setCaretToTheEnd = !targetBlock.isEmpty;

    BM.mergeBlocks(targetBlock, blockToMerge)
      .then( () => {
        window.setTimeout( () => {
          // set caret to the block without offset at the end
          this.Editor.Caret.setToBlock(BM.currentBlock, 0, setCaretToTheEnd);
          this.Editor.Toolbar.close();
        }, 10);
      });
  }

  /**
   * Handle right and down keyboard keys
   */
  private arrowRightAndDownPressed(): void {
    this.Editor.BlockManager.navigateNext();
  }

  /**
   * Handle left and up keyboard keys
   */
  private arrowLeftAndUpPressed(): void {
    this.Editor.BlockManager.navigatePrevious();
  }
}
