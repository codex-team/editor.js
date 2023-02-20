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

    // check for dragging is not successful then clear the style.
    // this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragend', (startDragEvent: DragEvent) => {
    //   if (startDragEvent.dataTransfer.dropEffect === 'none') {
    //     console.log('Incomplete drag');
    //   } else {
    //     console.log('Drag completed successfully');
    //   }
    // });

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

    this.processBlockDrop(dropEvent);

    BlockManager.clearDropTargets();

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
      if (targetBlock.dropTarget === BlockDropZonePosition.TOP) {
        Caret.setToBlock(targetBlock, Caret.positions.START);
      } else if (targetBlock.dropTarget === BlockDropZonePosition.BOTTOM) {
        Caret.setToBlock(targetBlock, Caret.positions.END);
      }
    } else {
      const lastBlock = BlockManager.setCurrentBlockByChildNode(BlockManager.lastBlock.holder);

      Caret.setToBlock(lastBlock, Caret.positions.END);
    }

    await Paste.processDataTransfer(dropEvent.dataTransfer, true);
  }

  /**
   * Checks and process the drop of a block. Returns {boolean} depending if a block drop has been processed.
   *
   * @param dropEvent {DragEvent}
   */
  private processBlockDrop(dropEvent: DragEvent): void {
    const { BlockManager } = this.Editor;

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
   * Handle drag start event
   *
   * @param dragStartEvent - drag start event
   */
  private processDragStart(dragStartEvent: DragEvent): void {
    const { BlockManager, InlineToolbar } = this.Editor;

    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed) {
      this.isStartedAtEditor = true;
    }

    InlineToolbar.close();

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

  private createDragImage(blocks: Block[]): HTMLElement {
    const { BlockManager } = this.Editor;

    if (blocks.length == 1) {
      const block = BlockManager.currentBlock;

      return block.holder.querySelector(`.${Block.CSS.content}`);
    }
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

  private removeDragImage(): void {
    document.querySelector('[id^="drag-image-"]')?.remove();
  }
}
