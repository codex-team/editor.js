import SelectionUtils from '../selection';

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
      Paste,
      Caret,
    } = this.Editor;

    dropEvent.preventDefault();

    BlockManager.blocks.forEach((block) => {
      block.dropTarget = false;
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
   * Handle drag start event
   */
  private processDragStart(): void {
    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed) {
      this.isStartedAtEditor = true;
    }

    this.Editor.InlineToolbar.close();
  }

  /**
   * @param {DragEvent} dragEvent - drag event
   */
  private processDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
  }
}
