import SelectionUtils from '../selection';

import Module from '../__module';
export default class DragNDrop extends Module {

  /**
   * If drag has been started at editor, we save it
   *
   * @type Boolean
   * @private
   */
  private isStartedAtEditor = false;

  /**
   * Listener identifiers
   */
  private listenerIds: string[] = [];

  /**
   * Bind events
   *
   * @private
   */
  public prepare(): void {
    this.toggleReadOnly(this.config.readOnly);
  }

  /**
   * Set read-only state
   *
   * @param {boolean} readOnlyEnabled
   */
  public toggleReadOnly(readOnlyEnabled: boolean) {
    if (readOnlyEnabled) {
      this.unbindEvents();
    } else {
      this.bindEvents();
    }
  }

  /**
   * Add drag events listeners to editor zone
   * @private
   */
  private bindEvents(): void {
    this.listenerIds.push(
      this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'drop', this.processDrop, true),
    );

    this.listenerIds.push(
      this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'dragstart', this.processDragStart),
    );

    /* Prevent default browser behavior to allow drop on non-contenteditable elements */
    this.listenerIds.push(
      this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'dragover', this.processDragOver, true),
    );
  }

  /**
   * Unbind drag events
   */
  private unbindEvents(): void {
    for (const id of this.listenerIds) {
      this.Editor.Listeners.offById(id);
    }

    this.listenerIds = [];
  }

  /**
   * Handle drop event
   *
   * @param {DragEvent} dropEvent
   */
  private processDrop = async (dropEvent: DragEvent): Promise<void> => {
    const {
      BlockManager,
      Caret,
      Paste,
    } = this.Editor;

    dropEvent.preventDefault();

    BlockManager.blocks.forEach((block) => block.dropTarget = false);

    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed && this.isStartedAtEditor) {
      document.execCommand('delete');
    }

    this.isStartedAtEditor = false;

    /**
     * Try to set current block by drop target.
     * If drop target (error will be thrown) is not part of the Block, set last Block as current.
     */
    try {
      const targetBlock = BlockManager.setCurrentBlockByChildNode(dropEvent.target as Node);

      this.Editor.Caret.setToBlock(targetBlock, Caret.positions.END);
    } catch (e) {
      const targetBlock = BlockManager.setCurrentBlockByChildNode(BlockManager.lastBlock.holder);

      this.Editor.Caret.setToBlock(targetBlock, Caret.positions.END);
    }

    Paste.processDataTransfer(dropEvent.dataTransfer, true);
  }

  /**
   * Handle drag start event
   */
  private processDragStart = (): void => {
    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed) {
      this.isStartedAtEditor = true;
    }

    this.Editor.InlineToolbar.close();
  }

  /**
   * @param {DragEvent} dragEvent
   */
  private processDragOver = (dragEvent: DragEvent): void => {
    dragEvent.preventDefault();
  }
}
