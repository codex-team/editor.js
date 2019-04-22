import Module from '../__module';
import Block from '../block';
import SelectionUtils from '../selection';

export default class MouseSelection extends Module {
    public isMouseSelectionActivated = false;

    private firstSelectedBlock: Block;
    private firstSelectedBlockIndex: number;
    private lastSelectedBlockIndex: number;
    private isDownDirection: boolean = undefined;

    public watchSelection(event: MouseEvent) {
        const {BlockManager, UI, Listeners} = this.Editor;

        this.firstSelectedBlock = BlockManager.currentBlock || BlockManager.getBlockByChildNode(event.target as Node);
        this.firstSelectedBlockIndex = BlockManager.blocks.indexOf(this.firstSelectedBlock);
        this.lastSelectedBlockIndex = this.firstSelectedBlockIndex;

        Listeners.on(document, 'mousemove', this.onMouseMove);
        Listeners.on(document, 'mouseup', this.onMouseUp);
    }

    private onMouseUp  = () => {
        const {Listeners} = this.Editor;

        Listeners.off(document, 'mousemove', this.onMouseMove);
        Listeners.off(document, 'mouseup', this.onMouseUp);
    }

    private onMouseMove = (event: MouseEvent) => {
        const {BlockManager} = this.Editor;

        const targetBlock = BlockManager.getBlockByChildNode(event.target as Node);
        const targetBlockIndex = BlockManager.blocks.indexOf(targetBlock);

        if (this.lastSelectedBlockIndex === targetBlockIndex) {
            return;
        }

        if (targetBlockIndex === this.firstSelectedBlockIndex) {
            this.isDownDirection = undefined;
            this.firstSelectedBlock.selected = false;
            BlockManager.getBlockByIndex(this.lastSelectedBlockIndex).selected = false;
            this.lastSelectedBlockIndex = this.firstSelectedBlockIndex;
            this.isMouseSelectionActivated = false;
            return;
        }

        if (this.isDownDirection === undefined) {
            this.isDownDirection = targetBlockIndex > this.firstSelectedBlockIndex;
            this.firstSelectedBlock.selected = true;

            const nativeSelection = SelectionUtils.get();

            nativeSelection.empty();

            this.isMouseSelectionActivated = true;
        }

        if (this.isDownDirection) {
            if (targetBlockIndex > this.lastSelectedBlockIndex) {
                targetBlock.selected = true;
            } else if (targetBlockIndex < this.lastSelectedBlockIndex) {
                BlockManager.getBlockByIndex(this.lastSelectedBlockIndex).selected = false;
            }
        } else {
            if (targetBlockIndex < this.lastSelectedBlockIndex) {
                targetBlock.selected = true;
            } else if (targetBlockIndex > this.lastSelectedBlockIndex) {
                BlockManager.getBlockByIndex(this.lastSelectedBlockIndex).selected = false;
            }
        }

        this.lastSelectedBlockIndex = targetBlockIndex;
    }
}
