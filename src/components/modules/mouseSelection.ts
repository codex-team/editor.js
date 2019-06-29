import Module from '../__module';
import Block from '../block';
import SelectionUtils from '../selection';

export default class MouseSelection extends Module {
    public isMouseSelectionActivated = false;

    private firstSelectedBlock: Block;
    private firstSelectedBlockIndex: number;
    private lastSelectedBlock: Block;
    private lastSelectedBlockIndex: number;
    private selection = new SelectionUtils();

    public watchSelection(event: MouseEvent) {
        const {BlockManager, UI, Listeners} = this.Editor;

        this.firstSelectedBlock = this.lastSelectedBlock = BlockManager.getBlockByChildNode(event.target as Node);
        this.firstSelectedBlockIndex = this.lastSelectedBlockIndex = BlockManager.blocks.indexOf(this.firstSelectedBlock);

        Listeners.on(document, 'mouseover', this.onMouseOver);
        Listeners.on(document, 'mouseup', this.onMouseUp);
    }

    private onMouseUp  = () => {
        const {Listeners, BlockSelection} = this.Editor;

        BlockSelection.shouldClearOnMouseUp = false;

        Listeners.off(document, 'mouseover', this.onMouseOver);
        Listeners.off(document, 'mouseup', this.onMouseUp);
    }

    private onMouseOver = (event: MouseEvent) => {
        const {BlockManager} = this.Editor;

        const relatedBlock = BlockManager.getBlockByChildNode(event.relatedTarget as Node);
        const targetBlock = BlockManager.getBlockByChildNode(event.target as Node);

        if (!relatedBlock || !targetBlock) {
            return;
        }

        if (targetBlock === relatedBlock) {
            return;
        }

        this.lastSelectedBlock = targetBlock;
        this.lastSelectedBlockIndex = BlockManager.blocks.indexOf(targetBlock);

        if (relatedBlock === this.firstSelectedBlock) {
            this.selection.save();

            SelectionUtils.get().removeAllRanges();

            relatedBlock.selected = true;
            targetBlock.selected = true;
            return;
        }

        if (targetBlock === this.firstSelectedBlock) {
            relatedBlock.selected = false;
            targetBlock.selected = false;

            this.selection.restore();
            return;
        }

        this.changeBlocksState(relatedBlock, targetBlock);
    }

    private changeBlocksState(firstBlock: Block, lastBlock: Block): void {
        const {BlockManager} = this.Editor;
        const fIndex = BlockManager.blocks.indexOf(firstBlock);
        const lIndex = BlockManager.blocks.indexOf(lastBlock);

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
