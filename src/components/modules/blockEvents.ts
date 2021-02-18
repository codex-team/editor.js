/**
 * Contains keyboard and mouse events binded on each Block by Block Manager
 */
import Module from '../__module';
import * as _ from '../utils';
import SelectionUtils from '../selection';
import Flipper from '../flipper';

/**
 *
 */
export default class BlockEvents extends Module {
  /**
   * All keydowns on Block
   *
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
    }
  }

  /**
   * Fires on keydown before event processing
   *
   * @param {KeyboardEvent} event - keydown
   */
  public beforeKeydownProcessing(event: KeyboardEvent): void {
    /**
     * Do not close Toolbox on Tabs or on Enter with opened Toolbox
     */
    if (!this.needToolbarClosing(event)) {
      return;
    }

    /**
     * When user type something:
     *  - close Toolbar
     *  - close Conversion Toolbar
     *  - clear block highlighting
     */
    if (_.isPrintableKey(event.keyCode)) {
      this.Editor.Toolbar.close();
      this.Editor.ConversionToolbar.close();

      /**
       * Allow to use shortcuts with selected blocks
       *
       * @type {boolean}
       */
      const isShortcut = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

      if (!isShortcut) {
        this.Editor.BlockManager.clearFocused();
        this.Editor.BlockSelection.clearSelection(event);
      }
    }
  }

  /**
   * Key up on Block:
   * - shows Inline Toolbar if something selected
   * - shows conversion toolbar with 85% of block selection
   *
   * @param {KeyboardEvent} event - keyup event
   */
  public keyup(event: KeyboardEvent): void {
    /**
     * If shift key was pressed some special shortcut is used (eg. cross block selection via shift + arrows)
     */
    if (event.shiftKey) {
      return;
    }

    /**
     * Check if editor is empty on each keyup and add special css class to wrapper
     */
    this.Editor.UI.checkEmptiness();
  }

  /**
   * Open Toolbox to leaf Tools
   *
   * @param {KeyboardEvent} event - tab keydown event
   */
  public tabPressed(event): void {
    /**
     * Clear blocks selection by tab
     */
    this.Editor.BlockSelection.clearSelection(event);

    const { BlockManager, Tools, InlineToolbar, ConversionToolbar } = this.Editor;
    const currentBlock = BlockManager.currentBlock;

    if (!currentBlock) {
      return;
    }

    const canOpenToolbox = Tools.isDefault(currentBlock.tool) && currentBlock.isEmpty;
    const conversionToolbarOpened = !currentBlock.isEmpty && ConversionToolbar.opened;
    const inlineToolbarOpened = !currentBlock.isEmpty && !SelectionUtils.isCollapsed && InlineToolbar.opened;

    /**
     * For empty Blocks we show Plus button via Toolbox only for default Blocks
     */
    if (canOpenToolbox) {
      this.activateToolbox();
    } else if (!conversionToolbarOpened && !inlineToolbarOpened) {
      this.activateBlockSettings();
    }
  }

  /**
   * Add drop target styles
   *
   * @param {DragEvent} event - drag over event
   */
  public dragOver(event: DragEvent): void {
    const block = this.Editor.BlockManager.getBlockByChildNode(event.target as Node);

    block.dropTarget = true;
  }

  /**
   * Remove drop target style
   *
   * @param {DragEvent} event - drag leave event
   */
  public dragLeave(event: DragEvent): void {
    const block = this.Editor.BlockManager.getBlockByChildNode(event.target as Node);

    block.dropTarget = false;
  }

  /**
   * Copying selected blocks
   * Before putting to the clipboard we sanitize all blocks and then copy to the clipboard
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  public handleCommandC(event: ClipboardEvent): Promise<void> {
    const { BlockSelection } = this.Editor;

    if (!BlockSelection.anyBlockSelected) {
      return;
    }

    // Copy Selected Blocks
    return BlockSelection.copySelectedBlocks(event);
  }

  /**
   * Copy and Delete selected Blocks
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  public async handleCommandX(event: ClipboardEvent): Promise<void> {
    const { BlockSelection, BlockManager, Caret } = this.Editor;

    if (!BlockSelection.anyBlockSelected) {
      return;
    }

    await BlockSelection.copySelectedBlocks(event);

    const selectionPositionIndex = BlockManager.removeSelectedBlocks();

    Caret.setToBlock(BlockManager.insertDefaultBlockAtIndex(selectionPositionIndex, true), Caret.positions.START);

    /** Clear selection */
    BlockSelection.clearSelection(event);
  }

  /**
   * ENTER pressed on block
   *
   * @param {KeyboardEvent} event - keydown
   */
  private enter(event: KeyboardEvent): void {
    const { BlockManager, Tools, UI } = this.Editor;
    const currentBlock = BlockManager.currentBlock;
    const tool = Tools.available[currentBlock.name];

    /**
     * Don't handle Enter keydowns when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     */
    if (tool && tool[Tools.INTERNAL_SETTINGS.IS_ENABLED_LINE_BREAKS]) {
      return;
    }

    /**
     * Opened Toolbars uses Flipper with own Enter handling
     * Allow split block when no one button in Flipper is focused
     */
    if (UI.someToolbarOpened && UI.someFlipperButtonFocused) {
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
      this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex);
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
    if (this.Editor.Tools.isDefault(newCurrent.tool) && newCurrent.isEmpty) {
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
  }

  /**
   * Handle backspace keydown on Block
   *
   * @param {KeyboardEvent} event - keydown
   */
  private backspace(event: KeyboardEvent): void {
    const { BlockManager, BlockSelection, Caret } = this.Editor;
    const currentBlock = BlockManager.currentBlock;
    const tool = this.Editor.Tools.available[currentBlock.name];

    /**
     * Check if Block should be removed by current Backspace keydown
     */
    if (currentBlock.selected || (currentBlock.isEmpty && currentBlock.currentInput === currentBlock.firstInput)) {
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
        index ? Caret.positions.END : Caret.positions.START
      );

      /** Close Toolbar */
      this.Editor.Toolbar.close();

      /** Clear selection */
      BlockSelection.clearSelection(event);

      return;
    }

    /**
     * Don't handle Backspaces when Tool sets enableLineBreaks to true.
     * Uses for Tools like <code> where line breaks should be handled by default behaviour.
     *
     * But if caret is at start of the block, we allow to remove it by backspaces
     */
    if (tool && tool[this.Editor.Tools.INTERNAL_SETTINGS.IS_ENABLED_LINE_BREAKS] && !Caret.isAtStart) {
      return;
    }

    const isFirstBlock = BlockManager.currentBlockIndex === 0;
    const canMergeBlocks = Caret.isAtStart &&
      SelectionUtils.isCollapsed &&
      currentBlock.currentInput === currentBlock.firstInput &&
      !isFirstBlock;

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
  private mergeBlocks(): void {
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
      .then(() => {
        /** Restore caret position after merge */
        Caret.restoreCaret(targetBlock.pluginsContent as HTMLElement);
        targetBlock.pluginsContent.normalize();
        Toolbar.close();
      });
  }

  /**
   * Handle right and down keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  private arrowRightAndDown(event: KeyboardEvent): void {
    const isFlipperCombination = Flipper.usedKeys.includes(event.keyCode) &&
      (!event.shiftKey || event.keyCode === _.keyCodes.TAB);

    /**
     * Arrows might be handled on toolbars by flipper
     * Check for Flipper.usedKeys to allow navigate by DOWN and disallow by RIGHT
     */
    if (this.Editor.UI.someToolbarOpened && isFlipperCombination) {
      return;
    }

    /**
     * Close Toolbar and highlighting when user moves cursor
     */
    this.Editor.BlockManager.clearFocused();
    this.Editor.Toolbar.close();

    const shouldEnableCBS = this.Editor.Caret.isAtEnd || this.Editor.BlockSelection.anyBlockSelected;

    if (event.shiftKey && event.keyCode === _.keyCodes.DOWN && shouldEnableCBS) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState();

      return;
    }

    const navigateNext = event.keyCode === _.keyCodes.DOWN || (event.keyCode === _.keyCodes.RIGHT && !this.isRtl);
    const isNavigated = navigateNext ? this.Editor.Caret.navigateNext() : this.Editor.Caret.navigatePrevious();

    if (isNavigated) {
      /**
       * Default behaviour moves cursor by 1 character, we need to prevent it
       */
      event.preventDefault();
    } else {
      /**
       * After caret is set, update Block input index
       */
      _.delay(() => {
        /** Check currentBlock for case when user moves selection out of Editor */
        if (this.Editor.BlockManager.currentBlock) {
          this.Editor.BlockManager.currentBlock.updateCurrentInput();
        }
      }, 20)();
    }

    /**
     * Clear blocks selection by arrows
     */
    this.Editor.BlockSelection.clearSelection(event);
  }

  /**
   * Handle left and up keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  private arrowLeftAndUp(event: KeyboardEvent): void {
    /**
     * Arrows might be handled on toolbars by flipper
     * Check for Flipper.usedKeys to allow navigate by UP and disallow by LEFT
     */
    if (this.Editor.UI.someToolbarOpened) {
      if (Flipper.usedKeys.includes(event.keyCode) && (!event.shiftKey || event.keyCode === _.keyCodes.TAB)) {
        return;
      }

      this.Editor.UI.closeAllToolbars();
    }

    /**
     * Close Toolbar and highlighting when user moves cursor
     */
    this.Editor.BlockManager.clearFocused();
    this.Editor.Toolbar.close();

    const shouldEnableCBS = this.Editor.Caret.isAtStart || this.Editor.BlockSelection.anyBlockSelected;

    if (event.shiftKey && event.keyCode === _.keyCodes.UP && shouldEnableCBS) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState(false);

      return;
    }

    const navigatePrevious = event.keyCode === _.keyCodes.UP || (event.keyCode === _.keyCodes.LEFT && !this.isRtl);
    const isNavigated = navigatePrevious ? this.Editor.Caret.navigatePrevious() : this.Editor.Caret.navigateNext();

    if (isNavigated) {
      /**
       * Default behaviour moves cursor by 1 character, we need to prevent it
       */
      event.preventDefault();
    } else {
      /**
       * After caret is set, update Block input index
       */
      _.delay(() => {
        /** Check currentBlock for case when user ends selection out of Editor and then press arrow-key */
        if (this.Editor.BlockManager.currentBlock) {
          this.Editor.BlockManager.currentBlock.updateCurrentInput();
        }
      }, 20)();
    }

    /**
     * Clear blocks selection by arrows
     */
    this.Editor.BlockSelection.clearSelection(event);
  }

  /**
   * Cases when we need to close Toolbar
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  private needToolbarClosing(event: KeyboardEvent): boolean {
    const toolboxItemSelected = (event.keyCode === _.keyCodes.ENTER && this.Editor.Toolbox.opened),
        blockSettingsItemSelected = (event.keyCode === _.keyCodes.ENTER && this.Editor.BlockSettings.opened),
        inlineToolbarItemSelected = (event.keyCode === _.keyCodes.ENTER && this.Editor.InlineToolbar.opened),
        conversionToolbarItemSelected = (event.keyCode === _.keyCodes.ENTER && this.Editor.ConversionToolbar.opened),
        flippingToolbarItems = event.keyCode === _.keyCodes.TAB;

    /**
     * Do not close Toolbar in cases:
     * 1. ShiftKey pressed (or combination with shiftKey)
     * 2. When Toolbar is opened and Tab leafs its Tools
     * 3. When Toolbar's component is opened and some its item selected
     */
    return !(event.shiftKey ||
      flippingToolbarItems ||
      toolboxItemSelected ||
      blockSettingsItemSelected ||
      inlineToolbarItemSelected ||
      conversionToolbarItemSelected
    );
  }

  /**
   * If Toolbox is not open, then just open it and show plus button
   */
  private activateToolbox(): void {
    if (!this.Editor.Toolbar.opened) {
      this.Editor.Toolbar.open(false, false);
      this.Editor.Toolbar.plusButton.show();
    }

    this.Editor.Toolbox.open();
  }

  /**
   * Open Toolbar and show BlockSettings before flipping Tools
   */
  private activateBlockSettings(): void {
    if (!this.Editor.Toolbar.opened) {
      this.Editor.BlockManager.currentBlock.focused = true;
      this.Editor.Toolbar.open(true, false);
      this.Editor.Toolbar.plusButton.hide();
    }

    /**
     * If BlockSettings is not open, then open BlockSettings
     * Next Tab press will leaf Settings Buttons
     */
    if (!this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.open();
    }
  }
}
