import Module from '../__module';
import Block from '../block';
import SelectionUtils from '../selection';

export default class MouseSelection extends Module {
  /**
   * Block where selection is started
   */
  private firstSelectedBlock: Block;

  /**
   * Sets up listeners
   *
   * @param {MouseEvent} event - mouse down event
   */
  public watchSelection(event: MouseEvent): void {
    const {BlockManager, UI, Listeners} = this.Editor;

    this.firstSelectedBlock = BlockManager.getBlock(event.target as HTMLElement);

    Listeners.on(UI.nodes.redactor, 'mouseover', (mouseOverEvent) => {
      this.onMouseOver(mouseOverEvent as MouseEvent);
    });

    Listeners.on(UI.nodes.redactor, 'mouseup', () => {
      this.onMouseUp();
    });
  }

  /**
   * Mouse up event handler.
   * Removes the listeners because selection is finished
   */
  private onMouseUp(): void  {
    const {Listeners, UI} = this.Editor;

    Listeners.off(UI.nodes.redactor, 'mouseover');
    Listeners.off(UI.nodes.redactor, 'mouseup');
  }

  /**
   * Mouse over event handler
   * Gets target and related blocks and change selected state for blocks in between
   *
   * @param {MouseEvent} event
   */
  private onMouseOver(event: MouseEvent): void {
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

    this.toggleBlocksSelection(relatedBlock, targetBlock);
  }

  /**
   * Change blocks selection state between passed two blocks.
   *
   * @param {Block} firstBlock
   * @param {Block} lastBlock
   */
  private toggleBlocksSelection(firstBlock: Block, lastBlock: Block): void {
    const {BlockManager} = this.Editor;
    const fIndex = BlockManager.blocks.indexOf(firstBlock);
    const lIndex = BlockManager.blocks.indexOf(lastBlock);

    /**
     * If first and last block have the different selection state
     * it means we should't toggle selection of the first selected block.
     * In the other case we shouldn't toggle the last selected block.
     */
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
