/**
 * @class BlockSelection
 * @classdesc Manages Block selection with shortcut CMD+A and with mouse
 *
 * @module BlockSelection
 * @version 1.0.0
 */
declare var Module: any;
declare var _: any;
declare var $: any;

import SelectionUtils from '../selection';

export default class BlockSelection extends Module {
  /**
   * Flag used to define block selection
   * First CMD+A defines it as true and then second CMD+A selects all Blocks
   * @type {boolean}
   */
  private needToSelectAll: boolean = false;

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
    const { Shortcuts } = this.Editor;

    /** Selection shortcut */
    Shortcuts.add({
      name: 'CMD+A',
      handler: (event) => {
        this.handleCommandA(event);
      },
    });

    /** shortcut to copy all selected blocks */
    Shortcuts.add({
      name: 'CMD+C',
      handler: (event) => {
        this.handleCommandC(event);
      },
    });

    this.selection = new SelectionUtils();
  }

  /**
   * Clear selection from Blocks
   */
  public clearSelection(restoreSelection = false) {
    const { BlockManager } = this.Editor;
    const anyBlockSelected = BlockManager.blocks.findIndex( (block) => block.selected === true) !== -1;

    if (!anyBlockSelected) {
      return;
    }

    this.needToSelectAll = false;
    BlockManager.blocks.forEach( (block) => block.selected = false);

    /**
     * restore selection when Block is already selected
     * but someone tries to write something.
     */
    if (restoreSelection) {
      this.selection.restore();
    }
  }

  /**
   * First CMD+A Selects current focused blocks,
   * and consequent second CMD+A keypress selects all blocks
   *
   * @param {keydown} event
   */
  private handleCommandA(event): void {
    /** Prevent default selection */
    event.preventDefault();

    if (this.needToSelectAll) {
      this.selectAllBlocks();
      this.needToSelectAll = false;
    } else {
      this.selectBlockByIndex();
      this.needToSelectAll = true;
    }
  }

  /**
   * Copying selected blocks
   * Before putting to the clipboard we sanitize all blocks and then copy to the clipboard
   *
   * @param event
   */
  private handleCommandC(event): void {
    const { BlockManager, Sanitizer } = this.Editor;
    const anyBlockSelected = BlockManager.blocks.some( (block) => block.selected === true);

    if (!anyBlockSelected) {
      return;
    }

    const fakeClipboard = $.make('div');

    BlockManager.blocks.filter( (block) => block.selected )
      .forEach( (block) => {
        /**
         * Make <p> tag that holds clean HTML
         */
        const cleanHTML = Sanitizer.clean(block.holder.innerHTML, this.sanitizerConfig);
        const fragment = $.make('p');

        fragment.innerHTML = cleanHTML;
        fakeClipboard.appendChild(fragment);
    });

    _.copyTextToClipboard(fakeClipboard.innerHTML);
  }

  /**
   * Select All Blocks
   * Each Block has selected setter that makes Block copyable
   */
  private selectAllBlocks() {
    const { BlockManager } = this.Editor;

    BlockManager.blocks.forEach( (block) => block.selected = true);
  }

  /**
   * select Block
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  private selectBlockByIndex(index?) {
    const { BlockManager } = this.Editor;

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
  }

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
}
