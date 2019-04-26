/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
import Module from '../__module';
import _ from '../utils';
import SelectionUtils from '../selection';

export default class BlockEvents extends Module {

  /**
   * SelectionUtils instance
   * @type {SelectionUtils}
   */
  private selection: SelectionUtils = new SelectionUtils();

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

    if (event.keyCode !== _.keyCodes.TAB) {
      this.Editor.Toolbar.close();
    }

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

    if (currentBlock.isEmpty) {
      /**
       * Work with Toolbox
       * ------------------
       *
       * If Toolbox is not open, then just open it and show plus button
       * Next Tab press will leaf Toolbox Tools
       */
      if (!this.Editor.Toolbar.opened) {
        this.Editor.Toolbar.open(false , false);
        this.Editor.Toolbar.plusButton.show();
      } else {
        this.Editor.Toolbox.leaf(direction);
      }

      this.Editor.Toolbox.open();
    } else if (!currentBlock.isEmpty && SelectionUtils.isTextSelected) {
      /**
       * Work with Inline Tools
       * -----------------------
       *
       * If InlineToolbar is not open, just open it and focus first button
       * Next Tab press will leaf InlineToolbar Tools
       */
      if (this.Editor.InlineToolbar.opened) {
        this.Editor.InlineToolbar.leaf(direction);
      }
    } else {
      this.Editor.Toolbar.open(true, false);
      this.Editor.Toolbar.plusButton.hide();
      this.selection.save();
      /**
       * Work with Block Tunes
       * ----------------------
       *
       * If BlockSettings is not open, then open BlockSettings
       * Next Tab press will leaf Settings Buttons
       */
      if (!this.Editor.BlockSettings.opened) {
        this.Editor.BlockSettings.open();
      } else {
        this.Editor.BlockSettings.leaf(direction);
      }
    }
  }

  /**
   * Escape pressed
   * If some of Toolbar components are opened, then close it otherwise close Toolbar
   *
   * @param {Event} event
   */
  public escapePressed(event): void {
    if (this.Editor.Toolbox.opened) {
      this.Editor.Toolbox.close();
    } else if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    } else if (this.Editor.InlineToolbar.opened) {
      this.Editor.InlineToolbar.close();
    } else {
      this.Editor.Toolbar.close();
    }
  }

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
   * Copying selected blocks
   * Before putting to the clipboard we sanitize all blocks and then copy to the clipboard
   *
   * @param event
   */
  public handleCommandC(event): void {
    const { BlockSelection } = this.Editor;

    if (!BlockSelection.anyBlockSelected) {
      return;
    }

    /**
     * Prevent default copy
     * Remove "decline sound" on macOS
     */
    event.preventDefault();

    // Copy Selected Blocks
    BlockSelection.copySelectedBlocks();
  }

  /**
   * Copy and Delete selected Blocks
   * @param event
   */
  public handleCommandX(event): void {
    const { BlockSelection, BlockManager, Caret } = this.Editor;

    if (!BlockSelection.anyBlockSelected) {
      return;
    }

    /**
     * Copy Blocks before removing
     *
     * Prevent default copy
     * Remove "decline sound" on macOS
     */
    event.preventDefault();

    BlockSelection.copySelectedBlocks();

    const selectionPositionIndex = BlockManager.removeSelectedBlocks();
    Caret.setToBlock(BlockManager.insertAtIndex(selectionPositionIndex, true), Caret.positions.START);

    /** Clear selection */
    BlockSelection.clearSelection();
  }

  /**
   * ENTER pressed on block
   * @param {KeyboardEvent} event - keydown
   */
  private enter(event: KeyboardEvent): void {
    const {BlockManager, Tools} = this.Editor;
    const currentBlock = BlockManager.currentBlock;
    const tool = Tools.available[currentBlock.name];

    /**
     * Don't handle Enter keydowns when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     */
    if (tool
      && tool[this.Editor.Tools.apiSettings.IS_ENABLED_LINE_BREAKS]
      && !this.Editor.BlockSettings.opened
      && !this.Editor.InlineToolbar.opened) {
      return;
    }

    if (this.Editor.Toolbox.opened && this.Editor.Toolbox.getActiveTool) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.Editor.Toolbox.toolButtonActivate(event, this.Editor.Toolbox.getActiveTool);
      return;
    }

    if (this.Editor.BlockSettings.opened && this.Editor.BlockSettings.getActiveButton) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      /** Click on settings button */
      this.Editor.BlockSettings.getActiveButton.click();

      /** Restore selection */
      // this.selection.restore();
      return;
    }

    if (this.Editor.InlineToolbar.opened && this.Editor.InlineToolbar.getActiveButton) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      (this.Editor.InlineToolbar.getActiveButton as HTMLElement).click();
      this.Editor.InlineToolbar.dropActiveButtonIndex();
      return;
    }

    /**
     * Allow to create linebreaks by Shift+Enter
     */
    if (event.shiftKey) {
      return;
    }

    let newCurrent = this.Editor.BlockManager.currentBlock;

    /**
     * If enter has been pressed at the start of the text, just insert paragraph Block above
     */
    if (this.Editor.Caret.isAtStart && !this.Editor.BlockManager.currentBlock.hasMedia) {
      this.Editor.BlockManager.insertAtIndex(this.Editor.BlockManager.currentBlockIndex);
    } else {
      /**
       * Split the Current Block into two blocks
       * Renew local current node after split
       */
      newCurrent = this.Editor.BlockManager.split();
    }

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
    if (currentBlock.selected || currentBlock.isEmpty && currentBlock.currentInput === currentBlock.firstInput) {
      event.preventDefault();

      const index = BlockManager.currentBlockIndex;

      if (BlockManager.previousBlock && BlockManager.previousBlock.inputs.length === 0) {
        /** If previous block doesn't contain inputs, remove it */
        BlockManager.removeBlock(index - 1);
      } else {
        /** If block is empty, just remove it */
        BlockManager.removeBlock();
      }

      Caret.setToBlock(
        BlockManager.currentBlock,
        index ? Caret.positions.END : Caret.positions.START,
      );

      /** Close Toolbar */
      this.Editor.Toolbar.close();

      /** Clear selection */
      BlockSelection.clearSelection();
      return;
    }

    /**
     * Don't handle Backspaces when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     *
     * But if caret is at start of the block, we allow to remove it by backspaces
     */
    if (tool && tool[this.Editor.Tools.apiSettings.IS_ENABLED_LINE_BREAKS] && !Caret.isAtStart) {
      return;
    }

    const isFirstBlock = BlockManager.currentBlockIndex === 0;
    const canMergeBlocks = Caret.isAtStart && currentBlock.currentInput === currentBlock.firstInput && !isFirstBlock;

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
        this.Editor.BlockManager.currentBlock.updateCurrentInput();
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
        this.Editor.BlockManager.currentBlock.updateCurrentInput();
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
      blockSettingsItemSelected = (event.keyCode === _.keyCodes.ENTER && this.Editor.BlockSettings.opened),
      flippingToolBarItems = event.keyCode === _.keyCodes.TAB;

    return !(event.shiftKey || flippingToolBarItems || toolboxItemSelected || blockSettingsItemSelected);
  }
}
