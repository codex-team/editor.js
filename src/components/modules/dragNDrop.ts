import SelectionUtils from '../selection';

declare var Module: any;

export default class DragNDrop extends Module {

  /**
   * If drag has been started at editor, we save it
   *
   * @type Boolean
   * @private
   */
  private isStartedAtEditor = false;

  /**
   * Bind events
   *
   * @private
   */
  public prepare(): void {
    this.bindEvents();
  }

  /**
   * Add drag events listeners to editor zone
   * @private
   */
  private bindEvents(): void {
    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'drop', this.processDrop, true);

    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'dragstart', (dragEvent: DragEvent) => {
      this.isStartedAtEditor = true;
      this.Editor.InlineToolbar.close();

      /**
       *  If drag has been started at the editor, wrap html content with P tag to insert it as the new Block
       */
      if (dragEvent.dataTransfer.types.includes('text/html')) {
        const data = dragEvent.dataTransfer.getData('text/html');

        dragEvent.dataTransfer.clearData('text/html');
        dragEvent.dataTransfer.setData('text/html', '<p>' + data + '</p>');
      }
    });

    /* Prevent default browser behavior to allow drop on non-contenteditable elements */
    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'dragover', (e) => e.preventDefault(), true);
  }

  /**
   * Handle drop event
   *
   * @param {DragEvent} dropEvent
   */
  private processDrop = async (dropEvent: DragEvent): Promise<void> => {
    const {
      BlockManager,
      Paste,
    } = this.Editor;

    dropEvent.preventDefault();

    BlockManager.blocks.forEach((block) => block.dropTarget = false);

    if (SelectionUtils.isAtEditor && this.isStartedAtEditor) {
      document.execCommand('delete');
    }

    this.isStartedAtEditor = false;

    /**
     * Try to set current block by drop target.
     * If drop target (error will be thrown) is not part of the Block, set last Block as current.
     */
    try {
      BlockManager.setCurrentBlockByChildNode(dropEvent.target, 'end');
    } catch (e) {
      BlockManager.setCurrentBlockByChildNode(BlockManager.lastBlock.holder, 'end');
    }

    Paste.processDataTransfer(dropEvent.dataTransfer);
  }
}
