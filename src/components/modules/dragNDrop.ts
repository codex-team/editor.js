import SelectionUtils from '../selection';
import Block, { BlockDropZonePosition } from '../block';
import * as _ from '../utils';
import $ from '../dom';
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

    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragstart', (dragStartEvent: DragEvent) => {
      this.processDragStart(dragStartEvent);
    });

    /**
     * Clear drop targets if drop effect is none.
     */
    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragend', (dragEndEvent: DragEvent) => {
      if (dragEndEvent.dataTransfer.dropEffect === 'none') {
        BlockManager.clearDropZonePosition();
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
    const firstLevelBlock = (dropEvent.target as HTMLElement).closest(`.${Block.CSS.wrapper}`);
    let targetBlock = BlockManager.blocks.find((block) => block.holder === firstLevelBlock);

    let shouldMoveToFirst = false;

    if (targetBlock) {
      if (targetBlock.dropZonePosition === BlockDropZonePosition.Top) {
        const currentIndex = BlockManager.getBlockIndex(targetBlock);
        let targetIndex;
        if (currentIndex > 0) {
          targetIndex = currentIndex - 1;
        }
        else {
          // Paste the block at the end of first block.
          targetIndex = 0;
          // then swap the first block with second block.
          shouldMoveToFirst = true;
        }
        targetBlock = BlockManager.getBlockByIndex(targetIndex);
      }
      Caret.setToBlock(targetBlock, Caret.positions.END);
    } else {
      const firstLevelBlock = (BlockManager.lastBlock.holder as HTMLElement).closest(`.${Block.CSS.wrapper}`);
      let lastBlock = BlockManager.blocks.find((block) => block.holder === firstLevelBlock);

      Caret.setToBlock(lastBlock, Caret.positions.END);
    }

    // Clear drop zones.
    BlockManager.clearDropZonePosition();
    // Clear the selection.
    BlockSelection.clearSelection();

    await Paste.processDataTransfer(dropEvent.dataTransfer, true);
    
    // swapping of the first block with second block.
    if (shouldMoveToFirst) {
      BlockManager.move(1, 0);
    }
  }

  /**
   * Process block drop event.
   *
   * @param dropEvent {DragEvent} - drop event
   */
  private processBlockDrop(dropEvent: DragEvent): void {
    const { BlockManager, BlockSelection } = this.Editor;

    /**
     * Remove drag image from DOM.
     */
    this.removeDragImage();

    const selectedBlocks = BlockSelection.selectedBlocks;

    const firstLevelBlock = (dropEvent.target as HTMLElement).closest(`.${Block.CSS.wrapper}`);
    const targetBlock = BlockManager.blocks.find((block) => block.holder === firstLevelBlock);

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
      if (targetBlock.dropZonePosition === BlockDropZonePosition.Top) {
        if (targetIndex > currentStartIndex) {
          toIndex = targetIndex - 1;
        } else {
          toIndex = targetIndex + i;
        }
      } else if (targetBlock.dropZonePosition === BlockDropZonePosition.Bottom) {
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
    const { BlockSelection } = this.Editor;

    /**
     * If we are dragging a block, set the flag to true.
     */
    this.isStartedAtEditor = true;

    const selectedBlocks = BlockSelection.selectedBlocks;

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
   * Create drag image for drag-n-drop and add to Editor holder.
   *
   * @param blocks {Block[]} - blocks to create drag image for.
   * @returns {HTMLElement} - drag image.
   */
  private createDragImage(blocks: Block[]): HTMLElement {
    const { UI } = this.Editor;

    /**
     * Create a drag image with all blocks content.
     */
    const dragImage: HTMLElement = $.make('div');

    dragImage.id = `drag-image-${_.generateId()}`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';

    const clones = blocks.map(block => block.holder.querySelector(`.${Block.CSS.content}`).cloneNode(true));

    dragImage.append(...clones);

    UI.nodes.holder.appendChild(dragImage);

    return dragImage;
  }

  /**
   * Remove drag image from Editor holder.
   */
  private removeDragImage(): void {
    const { UI } = this.Editor;

    UI.nodes.holder.querySelector('[id^="drag-image-"]')?.remove();
  }
}
