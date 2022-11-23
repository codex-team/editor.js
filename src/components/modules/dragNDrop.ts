import SelectionUtils from '../selection';
import Block, { BlockDropZonePlacement } from '../block';

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

    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragstart', (startDragEvent: DragEvent) => {
      this.processDragStart(startDragEvent);
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

    if (await this.processBlockDrop(dropEvent)) {
      return;
    }

    BlockManager.blocks.forEach((block) => {
      block.dropTarget = undefined;
    });

    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed && this.isStartedAtEditor) {
      document.execCommand('delete');
    }

    this.isStartedAtEditor = false;

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
   * Checks and process the drop of a block. Returns {boolean} depending if a block drop has been processed.
   *
   * @param dropEvent {DragEvent}
   * @returns {boolean}
   */
  private async processBlockDrop(dropEvent: DragEvent): Promise<boolean> {
    const { BlockManager } = this.Editor;

    const draggingImageElement = document.body.querySelector('#draggingImage');

    if (draggingImageElement) {
      draggingImageElement.remove();
    }

    const selectedBlocks = this.Editor.BlockManager.blocks.filter(block => block.selected);

    const targetBlock = BlockManager.getBlockByChildNode(dropEvent.target as Node);

    if (!targetBlock) {
      // This means that we are trying to drop a block without references.
      return;
    }
    const targetIndex = this.Editor.BlockManager.getBlockIndex(targetBlock);

    if (selectedBlocks.length > 1) {
      // we are dragging a set of blocks
      const currentStartIndex = this.Editor.BlockManager.getBlockIndex(selectedBlocks[0]);

      if (targetBlock.dropTarget === BlockDropZonePlacement.Top) {
        if (targetIndex > currentStartIndex) {
          selectedBlocks.forEach((block) => {
            const blockIndex = this.Editor.BlockManager.getBlockIndex(block);

            this.Editor.BlockManager.move(targetIndex - 1, blockIndex);
          });
        } else {
          selectedBlocks.forEach((block, i) => {
            const blockIndex = this.Editor.BlockManager.getBlockIndex(block);

            this.Editor.BlockManager.move(targetIndex + i, blockIndex);
          });
        }
      } else if (targetBlock.dropTarget === BlockDropZonePlacement.Bottom) {
        if (targetIndex > currentStartIndex) {
          selectedBlocks.forEach((block) => {
            const blockIndex = this.Editor.BlockManager.getBlockIndex(block);

            this.Editor.BlockManager.move(targetIndex, blockIndex);
          });
        } else {
          selectedBlocks.forEach((block, i) => {
            const blockIndex = this.Editor.BlockManager.getBlockIndex(block);

            this.Editor.BlockManager.move(targetIndex + 1 + i, blockIndex);
          });
        }
      }

      // this has to be cleaned after we drop the block
      BlockManager.blocks.forEach((block) => {
        block.dropTarget = undefined;
      });

      return true;
    }

    if (BlockManager.currentBlock) {
      // we are dragging one block
      // maybe we could delete this and handle everything with the previous method

      const currentIndex = this.Editor.BlockManager.currentBlockIndex;

      if (targetBlock.dropTarget === BlockDropZonePlacement.Top) {
        if (targetIndex > currentIndex) {
          this.Editor.BlockManager.move(targetIndex - 1);
        } else {
          this.Editor.BlockManager.move(targetIndex);
        }
      } else if (targetBlock.dropTarget === BlockDropZonePlacement.Bottom) {
        if (targetIndex > currentIndex) {
          this.Editor.BlockManager.move(targetIndex);
        } else {
          this.Editor.BlockManager.move(targetIndex + 1);
        }
      }

      // this has to be cleaned after we drop the block
      BlockManager.blocks.forEach((block) => {
        block.dropTarget = undefined;
      });

      return true;
    }

    return false;
  }

  /**
   * Handle drag start event
   *
   * @param dragStartEvent - drag start event
   */
  private processDragStart(dragStartEvent: DragEvent): void {
    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed) {
      this.isStartedAtEditor = true;
    }

    this.Editor.InlineToolbar.close();

    let draggingImageElement: HTMLElement;

    const selectedBlocks = this.Editor.BlockManager.blocks.filter(block => block.selected);

    if (selectedBlocks.length > 1) {
      draggingImageElement = document.createElement('div');
      draggingImageElement.id = 'draggingImage';
      draggingImageElement.style.position = 'absolute';
      draggingImageElement.style.top = '-1000px';
      selectedBlocks.forEach(block => {
        const blockContent = block.holder.querySelector(`.${Block.CSS.content}`).cloneNode(true);

        draggingImageElement.appendChild(blockContent);
      });
      document.body.appendChild(draggingImageElement);
    } else {
      const block = this.Editor.BlockManager.currentBlock;

      draggingImageElement = block.holder.querySelector(`.${Block.CSS.content}`);
    }

    if (draggingImageElement) {
      dragStartEvent.dataTransfer.setDragImage(draggingImageElement, 0, 0);
    }
  }

  /**
   * @param {DragEvent} dragEvent - drag event
   */
  private processDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
  }
}
