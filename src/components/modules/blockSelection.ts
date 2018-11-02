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

export default class BlockSelection extends Module {

  /**
   * @constructor
   * @param {EditorConfig} config
   */
  constructor({config}) {
    super({config});

    this.needToSelectAll = false;
  }

  /**
   * Module Preparation
   * Registers new Shortcut
   */
  public prepare(): void {

    const { Shortcuts } = this.Editor;
    /**
     * Register Shortcut
     */
    Shortcuts.add({
      name: 'CMD+A',
      handler: (event) => {
        this.handleShortcut(event);
      },
    });

    Shortcuts.add({
      name: 'CMD+C',
      handler: (event) => {
        this.handleShortcut1(event);
      },
    });
  }

  /**
   * Clear selection from Blocks
   */
  public clearSelection() {
    const {BlockManager} = this.Editor;
    this.needToSelectAll = false;
    BlockManager.blocks.forEach( (block) => block.selected = false);
  }

  /**
   * @param event
   */
  private handleShortcut(event): void {
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
   * @param event
   */
  private handleShortcut1(event): void {
    const { BlockManager, Sanitizer } = this.Editor;

    const allBlocks = $.make('div');

    BlockManager.blocks.forEach( (block) => {
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
   */
  private selectAllBlocks() {
    const { BlockManager } = this.Editor;
    BlockManager.blocks.forEach( (block) => block.selected = true);
  }

  /**
   * select Block
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

    block.selected = true;
  }
}
