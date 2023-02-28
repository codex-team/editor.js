import SelectionUtils from '../selection';
import Block, { BlockDropZonePosition } from '../block';
import * as _ from '../utils';
import Module from '../__module';
/**
 *
 */
export default class DragNDrop extends Module {
  /**
   * If drag has been started at editor, we save it
   *
   * @type {boolean}
   * @private
   */
  private isStartedAtEditor = false;

  /**
   * Flag that identifies if the drag event is started at the editor.
   *
   * @returns {boolean}
   */
  public get isDragStarted(): boolean {
    return this.isStartedAtEditor;
  }

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
    const { UI, BlockManager } = this.Editor;

    this.readOnlyMutableListeners.on(UI.nodes.holder, 'drop', async (dropEvent: DragEvent) => {
      await this.processDrop(dropEvent);
    }, true);

    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragstart', (startDragEvent: DragEvent) => {
      this.processDragStart(startDragEvent);
    });

    /**
     * Clear drop targets if drop effect is none.
     */
    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragend', (dragEndEvent: DragEvent) => {
      if (dragEndEvent.dataTransfer.dropEffect === 'none') {
        BlockManager.clearDropTargets();
      }
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
      BlockSelection,
    } = this.Editor;

    dropEvent.preventDefault();

    /**
     * If we are dropping a block, process it and return.
     */
    if (this.isStartedAtEditor && BlockSelection.anyBlockSelected) {
      this.processBlockDrop(dropEvent);
    }

    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed && this.isStartedAtEditor) {
      document.execCommand('delete');
    }

    this.isStartedAtEditor = false;

    /**
     * Try to set current block by drop target.
     * If drop target is not part of the Block, set last Block as current.
     */
    let targetBlock = BlockManager.setCurrentBlockByChildNode(dropEvent.target as Node);

    if (targetBlock) {
      if (targetBlock.dropTarget === BlockDropZonePosition.TOP) {
        const currrentIndex = BlockManager.getBlockIndex(targetBlock);

        if (currrentIndex > 0) {
          targetBlock = BlockManager.getBlockByIndex(currrentIndex - 1);
          Caret.setToBlock(targetBlock, Caret.positions.END);
        } else {
          /**
           * If we are trying to drop a block before the first block,
           * we should insert it before the first block.
           */
        }
      } else {
        Caret.setToBlock(targetBlock, Caret.positions.END);
      }
    } else {
      const lastBlock = BlockManager.setCurrentBlockByChildNode(BlockManager.lastBlock.holder);

      Caret.setToBlock(lastBlock, Caret.positions.END);
    }

    BlockManager.clearDropTargets();

    await Paste.processDataTransfer(dropEvent.dataTransfer, true);
  }

  /**
   * Process block drop event.
   *
   * @param dropEvent {DragEvent} - drop event
   */
  private processBlockDrop(dropEvent: DragEvent): void {
    const { BlockManager } = this.Editor;

    /**
     * Remove drag image from DOM.
     */
    this.removeDragImage();

    const selectedBlocks = BlockManager.blocks.filter(block => block.selected);
    const targetBlock = BlockManager.getBlockByChildNode(dropEvent.target as Node);

    if (!targetBlock) {
      // This means that we are trying to drop a block without references.
      return;
    }
    const targetIndex = BlockManager.getBlockIndex(targetBlock);

    // we are dragging a set of blocks
    const currentStartIndex = BlockManager.getBlockIndex(selectedBlocks[0]);

    selectedBlocks.forEach((block, i) => {
      const blockIndex = BlockManager.getBlockIndex(block);

      let toIndex;

      /**
       * Calculate the index where the block should be moved to.
       */
      if (targetBlock.dropTarget === BlockDropZonePosition.TOP) {
        if (targetIndex > currentStartIndex) {
          toIndex = targetIndex - 1;
        } else {
          toIndex = targetIndex + i;
        }
      } else if (targetBlock.dropTarget === BlockDropZonePosition.BOTTOM) {
        if (targetIndex > currentStartIndex) {
          toIndex = targetIndex;
        } else {
          toIndex = targetIndex + 1 + i;
        }
      }
      BlockManager.move(toIndex, blockIndex);
    });
  }

  /**
   * Handle drag start event by setting drag image.
   *
   * @param dragStartEvent - drag start event
   */
  private processDragStart(dragStartEvent: DragEvent): void {
    const { BlockManager } = this.Editor;

    /**
     * If we are dragging a block, set the flag to true.
     */
    this.isStartedAtEditor = true;

    const selectedBlocks = BlockManager.blocks.filter(block => block.selected);

    const dragImage = this.createDragImage(selectedBlocks);

    dragStartEvent.dataTransfer.setDragImage(dragImage, 0, 0);
  }

  /**
   * @param {DragEvent} dragEvent - drag event
   */
  private processDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
  }

  /**
   * Create drag image for drag-n-drop.
   *
   * @param blocks {Block[]} - blocks to create drag image for.
   * @returns {HTMLElement} - drag image.
   */
  private createDragImage(blocks: Block[]): HTMLElement {
    const { BlockManager } = this.Editor;

    /**
     * If we are dragging only one block, return its content.
     */
    if (blocks.length == 1) {
      const block = BlockManager.currentBlock;

      return block.holder.querySelector(`.${Block.CSS.content}`);
    }

    /**
     * If we are dragging multiple blocks, create a drag image with all blocks content.
     */
    const dragImage: HTMLElement = document.createElement('div');

    dragImage.id = `drag-image-${_.generateId()}`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    blocks.forEach(block => {
      const blockContent = block.holder.querySelector(`.${Block.CSS.content}`).cloneNode(true);

      dragImage.appendChild(blockContent);
    });
    document.body.appendChild(dragImage);

    return dragImage;
  }

  /**
   * Remove drag image from DOM.
   */
  private removeDragImage(): void {
    document.querySelector('[id^="drag-image-"]')?.remove();
  }
}
