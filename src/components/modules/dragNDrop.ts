import SelectionUtils from '../selection';

import Module from '../__module';
/**
 *
 */
export default class DragNDrop extends Module {
  /**
   * Toggle read-only state
   *
   * if state is true:
   *  - disable all drag-n-drop event handlers
   *
   * if state is false:
   *  - restore drag-n-drop event handlers
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (readOnlyEnabled) {
      this.disableModuleBindings();
    } else {
      this.enableModuleBindings();
    }
  }

  /**
   * Add drag events listeners to editor zone
   */
  private enableModuleBindings(): void {
    const { UI } = this.Editor;

    this.readOnlyMutableListeners.on(UI.nodes.holder, 'drop', async (dropEvent: DragEvent) => {
      await this.processDrop(dropEvent);
    }, true);

    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragstart', () => {
      this.processDragStart();
    });

    /**
     * Prevent default browser behavior to allow drop on non-contenteditable elements
     */
    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragover', (dragEvent: DragEvent) => {
      this.processDragOver(dragEvent);
    }, true);
  }

  /**
   * Unbind drag-n-drop event handlers
   */
  private disableModuleBindings(): void {
    this.readOnlyMutableListeners.clearAll();
  }

  /**
   * Handle drop event
   *
   * @param {DragEvent} dropEvent - drop event
   */
  private async processDrop(dropEvent: DragEvent): Promise<void> {
    const {
      BlockManager,
      Caret,
      Paste,
    } = this.Editor;

    dropEvent.preventDefault();

    BlockManager.blocks.forEach((block) => {
      block.dropTarget = false;
    });

    try {
      const dataTransferMessage = JSON.parse(dropEvent.dataTransfer.getData('text/plain'))

      if('droppingBlock' in dataTransferMessage) {
        const currentIndex = this.Editor.BlockManager.currentBlockIndex;
        const targetBlock = BlockManager.getBlockByChildNode(dropEvent.target as Node);
        const targetIndex = this.Editor.BlockManager.blocks.findIndex(b => b === targetBlock);

        if(targetBlock.dropTargetPlacement === 'top') {
          if(targetIndex > currentIndex) {
            this.Editor.BlockManager.move(targetIndex - 1);
          } else {
            this.Editor.BlockManager.move(targetIndex);
          }
        } else if(targetBlock.dropTargetPlacement === 'bottom') {
          if(targetIndex > currentIndex) {
            this.Editor.BlockManager.move(targetIndex);
          } else {
            this.Editor.BlockManager.move(targetIndex + 1);
          }
        }
      }

      return;
    } catch(_) {}

    /**
     * Try to set current block by drop target.
     * If drop target is not part of the Block, set last Block as current.
     */
    const targetBlock = BlockManager.setCurrentBlockByChildNode(dropEvent.target as Node);

    if (targetBlock) {
      this.Editor.Caret.setToBlock(targetBlock, Caret.positions.END);
    } else {
      const lastBlock = BlockManager.setCurrentBlockByChildNode(BlockManager.lastBlock.holder);

      this.Editor.Caret.setToBlock(lastBlock, Caret.positions.END);
    }
    // const currentBlockIndex = this.Editor.BlockManager.currentBlockIndex;
    // const nextBlock = this.Editor.BlockManager.getBlockByIndex(currentBlockIndex + 1);

    await Paste.processDataTransfer(dropEvent.dataTransfer, true);
  }

  /**
   * Handle drag start event
   */
  private processDragStart(): void {
    this.Editor.InlineToolbar.close();
  }

  /**
   * @param {DragEvent} dragEvent - drag event
   */
  private processDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
  }
}
