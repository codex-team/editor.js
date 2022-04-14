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

    if (BlockManager.currentDraggingBlock) {
      const currentIndex = this.Editor.BlockManager.currentDraggingBlockIndex;
      const targetBlock = BlockManager.getBlockByChildNode(dropEvent.target as Node);

      if(!targetBlock) {
        //This means that we are trying to drop a block without references.
        return;
      }

      const targetIndex = this.Editor.BlockManager.blocks.findIndex(block => block === targetBlock);
      if (targetBlock.dropTargetPlacement === 'top') {
        if (targetIndex > currentIndex) {
          this.Editor.BlockManager.move(targetIndex - 1);
        } else {
          this.Editor.BlockManager.move(targetIndex);
        }
      } else if (targetBlock.dropTargetPlacement === 'bottom') {
        if (targetIndex > currentIndex) {
          this.Editor.BlockManager.move(targetIndex);
        } else {
          this.Editor.BlockManager.move(targetIndex + 1);
        }
      }

      //this has to be cleaned after we drop the block
      BlockManager.blocks.forEach((block) => {
        block.dropTarget = false;
      });

      return;
    }

    //this has to be cleaned after the try/catch
    BlockManager.blocks.forEach((block) => {
      block.dropTarget = false;
    });

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
