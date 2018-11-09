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
   * @type {boolean}
   */
  private needToSelectAll: boolean = false;
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
        this.fakeClipboard(event);
      },
    });
  }

  /**
   * Clear selection from Blocks
   */
  public clearSelection() {
    const { BlockManager } = this.Editor;

    this.needToSelectAll = false;
    BlockManager.blocks.forEach( (block) => block.selected = false);
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
  private fakeClipboard(event): void {
    const { BlockManager, Sanitizer } = this.Editor;
    const allBlocks = $.make('div');

    BlockManager.blocks.filter( (block) => block.isSelected )
      .forEach( (block) => {
        if (block.isSelected) {
          const customConfig = Object.assign({}, Sanitizer.getInlineToolsConfig(block.name));
          const cleanHTML = Sanitizer.clean(block.holder.innerHTML, customConfig);
          const fragment = $.make('div');

          fragment.innerHTML = cleanHTML;
          allBlocks.appendChild(fragment);
        }
    });

    _.copyTextToClipboard(allBlocks.innerHTML);
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
     * Remove previous selected Block's state
     */
    BlockManager.clearHighlightings();

    let block;

    if (isNaN(index)) {
      block = BlockManager.currentBlock;
    } else {
      block = BlockManager.getBlockByIndex(index);
    }

    SelectionUtils.get()
      .removeAllRanges();

    block.selected = true;
  }
}
