/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
import Module from '../__module';
import _ from '../utils';

export default class BlockEvents extends Module {
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
        this.arrowRightAndDown(event);
        break;

      case _.keyCodes.UP:
      case _.keyCodes.LEFT:
        this.arrowLeftAndUp(event);
        break;

      case _.keyCodes.TAB:
        this.tabPressed(event);
        break;

      case _.keyCodes.ESC:
        this.escapePressed(event);
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
     * Do not close Toolbox on Tabs or on Enter with opened Toolbox
     */
    if (!this.needToolbarClosing(event)) {
      return;
    }

    this.Editor.Toolbar.close();

    const cmdKey = event.ctrlKey || event.metaKey;
    const altKey = event.altKey;
    const shiftKey = event.shiftKey;

    /** clear selecton when it is not CMD, SHIFT, ALT keys */
    if (cmdKey || altKey || shiftKey) {
      return;
    }

    /**
     * Clear all highlightings
     */
    this.Editor.BlockManager.clearFocused();

    /** Clear Block selection and restore caret */
    this.Editor.BlockSelection.clearSelection(true);
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

    const {currentBlock} = this.Editor.BlockManager;

    /** Prevent Default behaviour */
    event.preventDefault();
    event.stopPropagation();

    /** this property defines leaf direction */
    const shiftKey = event.shiftKey,
      direction = shiftKey ? 'left' : 'right';

    if (this.Editor.Toolbar.opened && currentBlock.isEmpty) {
      this.Editor.Toolbox.open();
    } else if (currentBlock.isEmpty) {
      this.Editor.Toolbar.open();
      this.Editor.Toolbar.plusButton.show();
      this.Editor.Toolbox.open();
    }

    if (this.Editor.Toolbox.opened) {
      this.Editor.Toolbox.leaf(direction);
    }
  }

  /**
   * Escape pressed
   * @param event
   */
  public escapePressed(event): void { }

  /**
   * Add drop target styles
   *
   * @param {DragEvent} e
   */
  public dragOver(e: DragEvent) {
    const block = this.Editor.BlockManager.getBlockByChildNode(e.target as Node);

    block.dropTarget = true;
  }

  /**
   * Remove drop target style
   *
   * @param {DragEvent} e
   */
  public dragLeave(e: DragEvent) {
    const block = this.Editor.BlockManager.getBlockByChildNode(e.target as Node);

    block.dropTarget = false;
  }

  /**
   * ENTER pressed on block
   * @param {KeyboardEvent} event - keydown
   */
  private enter(event: KeyboardEvent): void {
    const currentBlock = this.Editor.BlockManager.currentBlock,
      tool = this.Editor.Tools.available[currentBlock.name];

    /**
     * Don't handle Enter keydowns when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     */
    if (tool && tool[this.Editor.Tools.apiSettings.IS_ENABLED_LINE_BREAKS]) {
      return;
    }

    if (this.Editor.Toolbox.opened && this.Editor.Toolbox.getActiveTool) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.Editor.Toolbox.toolButtonActivate(event, this.Editor.Toolbox.getActiveTool);
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

    /**
     * If new Block is empty
     */
    if (this.Editor.Tools.isInitial(newCurrent.tool) && newCurrent.isEmpty) {
      /**
       * Show Toolbar
       */
      this.Editor.Toolbar.open(false);

      /**
       * Show Plus Button
       */
      this.Editor.Toolbar.plusButton.show();
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  /**
   * Handle backspace keydown on Block
   * @param {KeyboardEvent} event - keydown
   */
  private backspace(event: KeyboardEvent): void {
    const BM = this.Editor.BlockManager;
    const currentBlock = this.Editor.BlockManager.currentBlock,
      tool = this.Editor.Tools.available[currentBlock.name];

    /**
     * Don't handle Backspaces when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     */
    if (tool && tool[this.Editor.Tools.apiSettings.IS_ENABLED_LINE_BREAKS]) {
      return;
    }

    const isFirstBlock = BM.currentBlockIndex === 0,
      canMergeBlocks = this.Editor.Caret.isAtStart && !isFirstBlock;

    /** If current Block is empty just remove this Block */
    if (this.Editor.BlockManager.currentBlock.isEmpty) {
      this.Editor.BlockManager.removeBlock();

      /**
       * in case of last block deletion
       * Insert new initial empty block
       */
      if (this.Editor.BlockManager.blocks.length === 0) {
        this.Editor.BlockManager.insert();
      }

      /**
       * In case of deletion first block we need to set caret to the current Block
       * After BlockManager removes the Block (which is current now),
       * pointer that references to the current Block, now points to the Next
       */
      if (this.Editor.BlockManager.currentBlockIndex === 0) {
        this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock);
      } else {
        this.Editor.Caret.navigatePrevious(true);
      }

      this.Editor.Toolbar.close();
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
        this.Editor.Caret.restoreCaret(targetBlock.pluginsContent as HTMLElement);
        targetBlock.pluginsContent.normalize();
        this.Editor.Toolbar.close();
      });
  }

  /**
   * Handle right and down keyboard keys
   */
  private arrowRightAndDown(event: KeyboardEvent): void {
    if (this.Editor.Caret.navigateNext()) {
      /**
       * Default behaviour moves cursor by 1 character, we need to prevent it
       */
      event.preventDefault();
    }
  }

  /**
   * Handle left and up keyboard keys
   */
  private arrowLeftAndUp(event: KeyboardEvent): void {
    if (this.Editor.Caret.navigatePrevious()) {
      /**
       * Default behaviour moves cursor by 1 character, we need to prevent it
       */
      event.preventDefault();
    }
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
