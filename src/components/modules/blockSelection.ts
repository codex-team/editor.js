/**
 * @class BlockSelection
 * @classdesc Manages Block selection with shortcut CMD+A
 *
 * @module BlockSelection
 * @version 1.0.0
 */
import Module from '../__module';
import Block from '../block';
import * as _ from '../utils';
import $ from '../dom';

import SelectionUtils from '../selection';

export default class BlockSelection extends Module {

  /**
   * Sanitizer Config
   * @return {SanitizerConfig}
   */
  private get sanitizerConfig() {
    return {
      p: {},
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {},
      ol: {},
      ul: {},
      li: {},
      br: true,
      img: {
        src: true,
        width: true,
        height: true,
      },
      a: {
        href: true,
      },
      b: {},
      i: {},
      u: {},
    };
  }

  /**
   * Flag that identifies all Blocks selection
   * @return {boolean}
   */
  public get allBlocksSelected(): boolean {
    const {BlockManager} = this.Editor;

    return BlockManager.blocks.every((block) => block.selected === true);
  }

  /**
   * Set selected all blocks
   * @param {boolean} state
   */
  public set allBlocksSelected(state: boolean) {
    const {BlockManager} = this.Editor;

    BlockManager.blocks.forEach((block) => block.selected = state);
  }

  /**
   * Flag that identifies any Block selection
   * @return {boolean}
   */
  public get anyBlockSelected(): boolean {
    const {BlockManager} = this.Editor;

    return BlockManager.blocks.some((block) => block.selected === true);
  }

  /**
   * Return selected Blocks array
   * @return {Block[]}
   */
  public get selectedBlocks(): Block[] {
    return this.Editor.BlockManager.blocks.filter((block: Block) => block.selected);
  }

  /**
   * Flag used to define block selection
   * First CMD+A defines it as true and then second CMD+A selects all Blocks
   * @type {boolean}
   */
  private needToSelectAll: boolean = false;

  /**
   * Flag used to define native input selection
   * In this case we allow double CMD+A to select Block
   * @type {boolean}
   */
  private nativeInputSelected: boolean = false;

  /**
   * Flag identifies any input selection
   * That means we can select whole Block
   * @type {boolean}
   */
  private readyToBlockSelection: boolean = false;

  /**
   * SelectionUtils instance
   * @type {SelectionUtils}
   */
  private selection: SelectionUtils;

  /**
   * Module Preparation
   * Registers Shortcuts CMD+A and CMD+C
   * to select all and copy them
   */
  public prepare(): void {
    const {Shortcuts} = this.Editor;

    /** Selection shortcut */
    Shortcuts.add({
      name: 'CMD+A',
      handler: (event) => {
        const {BlockManager} = this.Editor;
        /**
         * When one page consist of two or more EditorJS instances
         * Shortcut module tries to handle all events. Thats why Editor's selection works inside the target Editor, but
         * for others error occurs because nothing to select.
         *
         * Prevent such actions if focus is not inside the Editor
         */
        if (!BlockManager.currentBlock) {
          return;
        }

        this.handleCommandA(event);
      },
    });

    this.selection = new SelectionUtils();
  }

  /**
   * Remove selection of Block
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  public unSelectBlockByIndex(index?) {
    const {BlockManager} = this.Editor;

    let block;

    if (isNaN(index)) {
      block = BlockManager.currentBlock;
    } else {
      block = BlockManager.getBlockByIndex(index);
    }

    block.selected = false;
  }

  /**
   * Clear selection from Blocks
   *
   * @param {Event} reason - event caused clear of selection
   * @param {boolean} restoreSelection - if true, restore saved selection
   */
  public clearSelection(reason?: Event, restoreSelection = false) {
    const {BlockManager, Caret, RectangleSelection} = this.Editor;

    this.needToSelectAll = false;
    this.nativeInputSelected = false;
    this.readyToBlockSelection = false;

    /**
     * If reason caused clear of the selection was printable key and any block is selected,
     * remove selected blocks and insert pressed key
     */
    if (this.anyBlockSelected && reason && reason instanceof KeyboardEvent && _.isPrintableKey(reason.keyCode)) {
      const indexToInsert = BlockManager.removeSelectedBlocks();

      BlockManager.insertInitialBlockAtIndex(indexToInsert, true);
      Caret.setToBlock(BlockManager.currentBlock);
      _.delay(() => {
        Caret.insertContentAtCaretPosition(reason.key);
      }, 20)();
    }

    this.Editor.CrossBlockSelection.clear(reason);

    if (!this.anyBlockSelected || RectangleSelection.isRectActivated()) {
      this.Editor.RectangleSelection.clearSelection();
      return;
    }

    /**
     * Restore selection when Block is already selected
     * but someone tries to write something.
     */
    if (restoreSelection) {
      this.selection.restore();
    }

    /** Now all blocks cleared */
    this.allBlocksSelected = false;
  }

  /**
   * Reduce each Block and copy its content
   */
  public copySelectedBlocks(): void {
    const fakeClipboard = $.make('div');

    this.selectedBlocks.forEach((block) => {
        /**
         * Make <p> tag that holds clean HTML
         */
        const cleanHTML = this.Editor.Sanitizer.clean(block.holder.innerHTML, this.sanitizerConfig);
        const fragment = $.make('p');

        fragment.innerHTML = cleanHTML;
        fakeClipboard.appendChild(fragment);
      });

    _.copyTextToClipboard(fakeClipboard.innerHTML);
  }

  /**
   * select Block
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  public selectBlockByIndex(index?) {
    const {BlockManager} = this.Editor;

    /**
     * Remove previous focused Block's state
     */
    BlockManager.clearFocused();

    let block;

    if (isNaN(index)) {
      block = BlockManager.currentBlock;
    } else {
      block = BlockManager.getBlockByIndex(index);
    }

    /** Save selection */
    this.selection.save();
    SelectionUtils.get()
      .removeAllRanges();

    block.selected = true;

    /** close InlineToolbar when we selected any Block */
    this.Editor.InlineToolbar.close();
  }

  /**
   * First CMD+A selects all input content by native behaviour,
   * next CMD+A keypress selects all blocks
   *
   * @param {KeyboardEvent} event
   */
  private handleCommandA(event: KeyboardEvent): void {
    this.Editor.RectangleSelection.clearSelection();

    /** allow default selection on native inputs */
    if ($.isNativeInput(event.target) && !this.readyToBlockSelection) {
      this.readyToBlockSelection = true;
      return;
    }

    const workingBlock = this.Editor.BlockManager.getBlock(event.target as HTMLElement);
    const inputs = workingBlock.inputs;

    /**
     * If Block has more than one editable element allow native selection
     * Second cmd+a will select whole Block
     */
    if (inputs.length > 1 && !this.readyToBlockSelection) {
      this.readyToBlockSelection = true;
      return;
    }

    if (inputs.length === 1 && !this.needToSelectAll) {
      this.needToSelectAll = true;
      return;
    }

    if (this.needToSelectAll) {
      /**
       * Prevent default selection
       */
      event.preventDefault();

      this.selectAllBlocks();

      /**
       * Disable any selection after all Blocks selected
       */
      this.needToSelectAll = false;
      this.readyToBlockSelection = false;

      /**
       * Close ConversionToolbar when all Blocks selected
       */
      this.Editor.ConversionToolbar.close();
    } else if (this.readyToBlockSelection) {
      /**
       * prevent default selection when we use custom selection
       */
      event.preventDefault();

      /**
       * select working Block
       */
      this.selectBlockByIndex();

      /**
       * Enable all Blocks selection if current Block is selected
       */
      this.needToSelectAll = true;
    }
  }

  /**
   * Select All Blocks
   * Each Block has selected setter that makes Block copyable
   */
  private selectAllBlocks() {
    /**
     * Save selection
     * Will be restored when closeSelection fired
     */
    this.selection.save();

    /**
     * Remove Ranges from Selection
     */
    SelectionUtils.get()
      .removeAllRanges();

    this.allBlocksSelected = true;

    /** close InlineToolbar if we selected all Blocks */
    this.Editor.InlineToolbar.close();
  }
}
