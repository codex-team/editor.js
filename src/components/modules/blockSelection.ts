/**
 * @class BlockSelection
 * @classdesc Manages Block selection with shortcut CMD+A
 * @module BlockSelection
 * @version 1.0.0
 */
import Module from '../__module';
import Block from '../block';
import * as _ from '../utils';
import $ from '../dom';
import Shortcuts from '../utils/shortcuts';

import SelectionUtils from '../selection';
import { SanitizerConfig } from '../../../types/configs';
import { clean } from '../utils/sanitizer';

/**
 *
 */
export default class BlockSelection extends Module {
  /**
   * Sometimes .anyBlockSelected can be called frequently,
   * for example at ui@selectionChange (to clear native browser selection in CBS)
   * We use cache to prevent multiple iterations through all the blocks
   *
   * @private
   */
  private anyBlockSelectedCache: boolean | null = null;

  /**
   * Sanitizer Config
   *
   * @returns {SanitizerConfig}
   */
  private get sanitizerConfig(): SanitizerConfig {
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
   *
   * @returns {boolean}
   */
  public get allBlocksSelected(): boolean {
    const { BlockManager } = this.Editor;

    return BlockManager.blocks.every((block) => block.selected === true);
  }

  /**
   * Set selected all blocks
   *
   * @param {boolean} state - state to set
   */
  public set allBlocksSelected(state: boolean) {
    const { BlockManager } = this.Editor;

    BlockManager.blocks.forEach((block) => {
      block.selected = state;
    });

    this.clearCache();
  }

  /**
   * Flag that identifies any Block selection
   *
   * @returns {boolean}
   */
  public get anyBlockSelected(): boolean {
    const { BlockManager } = this.Editor;

    if (this.anyBlockSelectedCache === null) {
      this.anyBlockSelectedCache = BlockManager.blocks.some((block) => block.selected === true);
    }

    return this.anyBlockSelectedCache;
  }

  /**
   * Return selected Blocks array
   *
   * @returns {Block[]}
   */
  public get selectedBlocks(): Block[] {
    return this.Editor.BlockManager.blocks.filter((block: Block) => block.selected);
  }

  /**
   * Flag used to define block selection
   * First CMD+A defines it as true and then second CMD+A selects all Blocks
   *
   * @type {boolean}
   */
  private needToSelectAll = false;

  /**
   * Flag used to define native input selection
   * In this case we allow double CMD+A to select Block
   *
   * @type {boolean}
   */
  private nativeInputSelected = false;

  /**
   * Flag identifies any input selection
   * That means we can select whole Block
   *
   * @type {boolean}
   */
  private readyToBlockSelection = false;

  /**
   * SelectionUtils instance
   *
   * @type {SelectionUtils}
   */
  private selection: SelectionUtils;

  /**
   * Module Preparation
   * Registers Shortcuts CMD+A and CMD+C
   * to select all and copy them
   */
  public prepare(): void {
    this.selection = new SelectionUtils();

    /**
     * CMD/CTRL+A selection shortcut
     */
    Shortcuts.add({
      name: 'CMD+A',
      handler: (event) => {
        const { BlockManager, ReadOnly } = this.Editor;

        /**
         * We use Editor's Block selection on CMD+A ShortCut instead of Browsers
         */
        if (ReadOnly.isEnabled) {
          event.preventDefault();
          this.selectAllBlocks();

          return;
        }

        /**
         * When one page consist of two or more EditorJS instances
         * Shortcut module tries to handle all events.
         * Thats why Editor's selection works inside the target Editor, but
         * for others error occurs because nothing to select.
         *
         * Prevent such actions if focus is not inside the Editor
         */
        if (!BlockManager.currentBlock) {
          return;
        }

        this.handleCommandA(event);
      },
      on: this.Editor.UI.nodes.redactor,
    });
  }

  /**
   * Toggle read-only state
   *
   *  - Remove all ranges
   *  - Unselect all Blocks
   */
  public toggleReadOnly(): void {
    SelectionUtils.get()
      .removeAllRanges();

    this.allBlocksSelected = false;
  }

  /**
   * Remove selection of Block
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  public unSelectBlockByIndex(index?): void {
    const { BlockManager } = this.Editor;

    let block;

    if (isNaN(index)) {
      block = BlockManager.currentBlock;
    } else {
      block = BlockManager.getBlockByIndex(index);
    }

    block.selected = false;

    this.clearCache();
  }

  /**
   * Clear selection from Blocks
   *
   * @param {Event} reason - event caused clear of selection
   * @param {boolean} restoreSelection - if true, restore saved selection
   */
  public clearSelection(reason?: Event, restoreSelection = false): void {
    const { BlockManager, Caret, RectangleSelection } = this.Editor;

    this.needToSelectAll = false;
    this.nativeInputSelected = false;
    this.readyToBlockSelection = false;

    const isKeyboard = reason && (reason instanceof KeyboardEvent);
    const isPrintableKey = isKeyboard && _.isPrintableKey((reason as KeyboardEvent).keyCode);

    /**
     * If reason caused clear of the selection was printable key and any block is selected,
     * remove selected blocks and insert pressed key
     */
    if (this.anyBlockSelected && isKeyboard && isPrintableKey && !SelectionUtils.isSelectionExists) {
      const indexToInsert = BlockManager.removeSelectedBlocks();

      BlockManager.insertDefaultBlockAtIndex(indexToInsert, true);
      Caret.setToBlock(BlockManager.currentBlock);
      _.delay(() => {
        const eventKey = (reason as KeyboardEvent).key;

        /**
         * If event.key length >1 that means key is special (e.g. Enter or Dead or Unidentified).
         * So we use empty string
         *
         * @see https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key
         */
        Caret.insertContentAtCaretPosition(eventKey.length > 1 ? '' : eventKey);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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
   *
   * @param {ClipboardEvent} e - copy/cut event
   * @returns {Promise<void>}
   */
  public copySelectedBlocks(e: ClipboardEvent): Promise<void> {
    /**
     * Prevent default copy
     */
    e.preventDefault();

    const fakeClipboard = $.make('div');

    this.selectedBlocks.forEach((block) => {
      /**
       * Make <p> tag that holds clean HTML
       */
      const cleanHTML = clean(block.holder.innerHTML, this.sanitizerConfig);
      const fragment = $.make('p');

      fragment.innerHTML = cleanHTML;
      fakeClipboard.appendChild(fragment);
    });

    const textPlain = Array.from(fakeClipboard.childNodes).map((node) => node.textContent)
      .join('\n\n');
    const textHTML = fakeClipboard.innerHTML;

    e.clipboardData.setData('text/plain', textPlain);
    e.clipboardData.setData('text/html', textHTML);

    return Promise
      .all(this.selectedBlocks.map((block) => block.save()))
      .then(savedData => {
        try {
          e.clipboardData.setData(this.Editor.Paste.MIME_TYPE, JSON.stringify(savedData));
        } catch (err) {
          // In Firefox we can't set data in async function
        }
      });
  }

  /**
   * Select Block by its index
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  public selectBlockByIndex(index: number): void {
    const { BlockManager } = this.Editor;

    const block = BlockManager.getBlockByIndex(index);

    if (block === undefined) {
      return;
    }

    this.selectBlock(block);
  }

  /**
   * Select passed Block
   *
   * @param {Block} block - Block to select
   */
  public selectBlock(block: Block): void {
    /** Save selection */
    this.selection.save();
    SelectionUtils.get()
      .removeAllRanges();

    block.selected = true;

    this.clearCache();

    /** close InlineToolbar when we selected any Block */
    this.Editor.InlineToolbar.close();
  }

  /**
   * Remove selection from passed Block
   *
   * @param {Block} block - Block to unselect
   */
  public unselectBlock(block: Block): void {
    block.selected = false;

    this.clearCache();
  }

  /**
   * Clear anyBlockSelected cache
   */
  public clearCache(): void {
    this.anyBlockSelectedCache = null;
  }

  /**
   * Module destruction
   * De-registers Shortcut CMD+A
   */
  public destroy(): void {
    /** Selection shortcut */
    Shortcuts.remove(this.Editor.UI.nodes.redactor, 'CMD+A');
  }

  /**
   * First CMD+A selects all input content by native behaviour,
   * next CMD+A keypress selects all blocks
   *
   * @param {KeyboardEvent} event - keyboard event
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
    } else if (this.readyToBlockSelection) {
      /**
       * prevent default selection when we use custom selection
       */
      event.preventDefault();

      /**
       * select working Block
       */
      this.selectBlock(workingBlock);

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
  private selectAllBlocks(): void {
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
