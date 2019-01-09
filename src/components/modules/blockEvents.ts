/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
import Module from '../__module';
import _ from '../utils';
import CaretClass from './caret';

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

    if (event.keyCode !== _.keyCodes.ENTER && event.keyCode !== _.keyCodes.BACKSPACE) {
      /**
       * Clear selection and restore caret before navigation
       */
      this.Editor.BlockSelection.clearSelection(true);
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

    /**
     * Don't show Plus and Toolbox near not-inital Tools
     */
    if (!this.Editor.Tools.isInitial(currentBlock.tool)) {
      return;
    }

    if (currentBlock.isEmpty) {
      if (!this.Editor.Toolbar.opened) {
        this.Editor.Toolbar.open(false , false);
        this.Editor.Toolbar.plusButton.show();
      }

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
    const {BlockSelection, BlockManager, Tools, Caret} = this.Editor;
    const currentBlock = BlockManager.currentBlock;
    const tool = Tools.available[currentBlock.name];

    if (currentBlock.selected) {
      if (BlockSelection.allBlocksSelected) {
        BlockManager.removeAllBlocks();
      } else {
        /** Replace current Block */
        const newBlock = BlockManager.replace();

        /** Set caret to the current block */
        Caret.setToBlock(newBlock);
      }

      /** Clear selection */
      BlockSelection.clearSelection();
      return;
    }

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
    const { BlockManager, BlockSelection, Caret } = this.Editor;
    const currentBlock = BlockManager.currentBlock;
    const tool = this.Editor.Tools.available[currentBlock.name];

    /**
     * Check if Block should be removed by current Backspace keydown
     */
    if (currentBlock.selected || currentBlock.isEmpty) {
      if (BlockSelection.allBlocksSelected) {
        this.removeAllBlocks();
      } else {
        this.removeCurrentBlock();
      }

      /** Clear selection */
      BlockSelection.clearSelection();
      return;
    }

    /**
     * Don't handle Backspaces when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     */
    if (tool && tool[this.Editor.Tools.apiSettings.IS_ENABLED_LINE_BREAKS] && !Caret.isAtStart) {
      return;
    }

    const isFirstBlock = BlockManager.currentBlockIndex === 0;
    const canMergeBlocks = Caret.isAtStart && !isFirstBlock;

    if (canMergeBlocks) {
      /**
       * preventing browser default behaviour
       */
      event.preventDefault();

      /**
       * Merge Blocks
       */
      this.mergeBlocks();
    }
  }

  /**
   * remove all selected Blocks
   */
  private removeAllBlocks(): boolean {
    const { BlockManager } = this.Editor;

    BlockManager.removeAllBlocks();
    return true;
  }

  /**
   * remove current Block and sets Caret to the correct position
   */
  private removeCurrentBlock(): boolean {
    const { BlockManager, Caret } = this.Editor;
    const index = BlockManager.currentBlockIndex;

    /** If current Block is empty just remove this Block */
    BlockManager.removeBlock();
    if (BlockManager.currentBlock.inputs.length === 0) {
      const isFirstBlock = BlockManager.currentBlockIndex === 0;

      /** If previous (now current) block doesn't contain inputs, remove it */
      BlockManager.removeBlock();

      if (!isFirstBlock) {
        BlockManager.insert();
      }
    }

    /**
     * In case of deletion of the first Block we need to set caret to the start of the new first Block
     */
    if (index === 0) {
      Caret.setToBlock(BlockManager.currentBlock, CaretClass.positions.START);
    } else  {
      Caret.setToBlock(BlockManager.currentBlock, CaretClass.positions.END);
    }

    this.Editor.Toolbar.close();
    return true;
  }

  /**
   * Merge current and previous Blocks if they have the same type
   */
  private mergeBlocks() {
    const { BlockManager, Caret, Toolbar } = this.Editor;
    const targetBlock = BlockManager.previousBlock;
    const blockToMerge = BlockManager.currentBlock;

    /**
     * Blocks that can be merged:
     * 1) with the same Name
     * 2) Tool has 'merge' method
     *
     * other case will handle as usual ARROW LEFT behaviour
     */
    if (blockToMerge.name !== targetBlock.name || !targetBlock.mergeable) {
      /** If target Block doesn't contain inputs or empty, remove it */
      if (targetBlock.inputs.length === 0 || targetBlock.isEmpty) {
        BlockManager.removeBlock(BlockManager.currentBlockIndex - 1);

        Caret.setToBlock(BlockManager.currentBlock);
        Toolbar.close();
        return;
      }

      if (Caret.navigatePrevious()) {
        Toolbar.close();
      }

      return;
    }

    Caret.createShadow(targetBlock.pluginsContent);
    BlockManager.mergeBlocks(targetBlock, blockToMerge)
      .then( () => {
        /** Restore caret position after merge */
        Caret.restoreCaret(targetBlock.pluginsContent as HTMLElement);
        targetBlock.pluginsContent.normalize();
        Toolbar.close();
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
    } else {
      /**
       * After caret is set, update Block input index
       */
      _.delay(() => {
        this.Editor.BlockManager.currentBlock.updateInputs();
      }, 20)();
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
    } else {
      /**
       * After caret is set, update Block input index
       */
      _.delay(() => {
        this.Editor.BlockManager.currentBlock.updateInputs();
      }, 20)();
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
