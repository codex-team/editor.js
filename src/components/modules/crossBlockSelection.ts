import Module from '../__module';
import Block from '../block';
import SelectionUtils from '../selection';

export default class CrossBlockSelection extends Module {
  /**
   * Block where selection is started
   */
  private firstSelectedBlock: Block;

  /**
   * Last selected Block
   */
  private lastSelectedBlock: Block;

  /**
   * Sets up listeners
   *
   * @param {MouseEvent} event - mouse down event
   */
  public watchSelection(event: MouseEvent): void {
    const {BlockManager, UI, Listeners} = this.Editor;
    this.firstSelectedBlock = BlockManager.getBlock(event.target as HTMLElement);
    this.lastSelectedBlock = this.firstSelectedBlock;

    Listeners.on(document, 'mouseover', this.onMouseOver);
    Listeners.on(document, 'mouseup', this.onMouseUp);
  }

  /**
   * Change selection state of the next Block
   * Used for CBS via Shift + arrow keys
   */
  public changeNextBlockState() {
    const {BlockManager} = this.Editor;

    if (!this.lastSelectedBlock) {
      this.lastSelectedBlock = this.firstSelectedBlock = BlockManager.currentBlock;
    }

    if (this.firstSelectedBlock === this.lastSelectedBlock) {
      this.firstSelectedBlock.selected = true;
      SelectionUtils.get().removeAllRanges();
    }

    const nextBlockIndex = BlockManager.blocks.indexOf(this.lastSelectedBlock) + 1;
    const nextBlock = BlockManager.blocks[nextBlockIndex];

    if (!nextBlock) {
      return;
    }

    if (this.lastSelectedBlock.selected !== nextBlock.selected) {
      nextBlock.selected = true;
    } else {
      this.lastSelectedBlock.selected = false;
    }

    this.lastSelectedBlock = nextBlock;
  }

  /**
   * Change selection state of the previous Block
   * Used for CBS via Shift + arrow keys
   */
  public changePreviousBlockState() {
    const {BlockManager} = this.Editor;

    if (!this.lastSelectedBlock) {
      this.lastSelectedBlock = this.firstSelectedBlock = BlockManager.currentBlock;
    }

    if (this.firstSelectedBlock === this.lastSelectedBlock) {
      this.firstSelectedBlock.selected = true;
      SelectionUtils.get().removeAllRanges();
    }

    const prevBlockIndex = BlockManager.blocks.indexOf(this.lastSelectedBlock) - 1;
    const prevBlock = BlockManager.blocks[prevBlockIndex];

    if (!prevBlock) {
      return;
    }

    if (this.lastSelectedBlock.selected !== prevBlock.selected) {
      prevBlock.selected = true;
    } else {
      this.lastSelectedBlock.selected = false;
    }

    this.lastSelectedBlock = prevBlock;
  }

  /**
   * Clear saved state
   */
  public clear() {
    this.firstSelectedBlock = this.lastSelectedBlock = null;
  }

  /**
   * Mouse up event handler.
   * Removes the listeners
   */
  private onMouseUp  = (): void => {
    const {Listeners} = this.Editor;

    Listeners.off(document, 'mouseover', this.onMouseOver);
    Listeners.off(document, 'mouseup', this.onMouseUp);
  }

  /**
   * Mouse over event handler
   * Gets target and related blocks and change selected state for blocks in between
   *
   * @param {MouseEvent} event
   */
  private onMouseOver = (event: MouseEvent): void => {
    const {BlockManager} = this.Editor;

    const relatedBlock = BlockManager.getBlockByChildNode(event.relatedTarget as Node);
    const targetBlock = BlockManager.getBlockByChildNode(event.target as Node);

    if (!relatedBlock || !targetBlock) {
      return;
    }

    if (targetBlock === relatedBlock) {
      return;
    }

    if (relatedBlock === this.firstSelectedBlock) {
      SelectionUtils.get().removeAllRanges();

      relatedBlock.selected = true;
      targetBlock.selected = true;
      return;
    }

    if (targetBlock === this.firstSelectedBlock) {
      relatedBlock.selected = false;
      targetBlock.selected = false;
      return;
    }

    this.changeBlocksState(relatedBlock, targetBlock);
    this.lastSelectedBlock = targetBlock;
  }

  /**
   * Change blocks selection state between passed two blocks.
   *
   * @param {Block} firstBlock
   * @param {Block} lastBlock
   */
  private changeBlocksState(firstBlock: Block, lastBlock: Block): void {
    const {BlockManager} = this.Editor;
    const fIndex = BlockManager.blocks.indexOf(firstBlock);
    const lIndex = BlockManager.blocks.indexOf(lastBlock);

    const shouldntSelectFirstBlock = firstBlock.selected !== lastBlock.selected;

    for (let i = Math.min(fIndex, lIndex); i <= Math.max(fIndex, lIndex); i++) {
      const block = BlockManager.blocks[i];

      if (
        block !== this.firstSelectedBlock &&
        block !== (shouldntSelectFirstBlock ? firstBlock : lastBlock)
      ) {
        BlockManager.blocks[i].selected = !BlockManager.blocks[i].selected;
      }
    }
  }
}
