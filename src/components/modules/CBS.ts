import Module from '../__module';
import Block from '../block';
import SelectionUtils from '../selection';

export default class CBS extends Module {

  public _shouldClearSelectionOnClick: boolean = true;
  private isDownward: boolean = true;
  private mousePressed: boolean = false;
  private firstTarget: Block = null;
  private lastTarget: Block = null;

  public startSelection(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    this.firstTarget = this.Editor.BlockManager.getBlockByChildNode(event.target as HTMLElement);
    this.lastTarget = null;
    this.mousePressed = true;

    this.Editor.Listeners.on(window, 'mousemove', this.onMouseMove);
    this.Editor.Listeners.on(window, 'mouseup', this.finishSelection);
  }

  public onMouseMove = (e: MouseEvent): void => {
    if (!this.mousePressed) {
      return;
    }

    const {BlockManager} = this.Editor;

    const target = e.target as HTMLElement;
    const block = BlockManager.getBlockByChildNode(target);

    if (!this.lastTarget) {
      this.lastTarget = block;
    }

    if (block === this.lastTarget) {
      return;
    }

    const lastTargetIndex = BlockManager.blocks.indexOf(this.lastTarget);
    const blockIndex = BlockManager.blocks.indexOf(block);

    if (this.lastTarget === this.firstTarget) {
      const selection = SelectionUtils.get();

      this.isDownward = lastTargetIndex - blockIndex < 0;
      selection.removeAllRanges();
    }

    const currentDirection = lastTargetIndex - blockIndex < 0;

    if (this.isDownward === currentDirection) {
      this.lastTarget.selected = true;
      this.lastTarget = block;
      this.lastTarget.selected = !this.lastTarget.selected;
    } else {
      this.lastTarget.selected = !this.lastTarget.selected;
      this.lastTarget = block;
    }

    console.log('Moved');
  }

  public finishSelection = (e: MouseEvent): void => {
    const {BlockManager} = this.Editor;

    console.log(e);

    this.mousePressed = false;
    this.shouldClearSelectionOnClick = false;

    this.Editor.Listeners.off(window, 'mousemove', this.onMouseMove);
    this.Editor.Listeners.off(window, 'mouseup', this.finishSelection);

    if (e.metaKey) {
      const block = BlockManager.getBlockByChildNode(e.target as HTMLElement);

      block.selected = !block.selected;
    }
  }

  public get shouldClearSelectionOnClick() {
    return this._shouldClearSelectionOnClick;
  }

  public set shouldClearSelectionOnClick(value) {
    // if (value === true) {
    //   this.lastTarget = null;
    //   this.firstTarget = null;
    // }
    this._shouldClearSelectionOnClick = value;
  }

  public selectNextBlock(): void {
    console.log(this.Editor.Caret.isAtEnd);

    if (!this.Editor.BlockSelection.anyBlockSelected && !this.Editor.Caret.isAtEnd && !this.lastTarget) {
      return;
    }

    const {BlockManager} = this.Editor;
    const {currentBlock} = BlockManager;

    if (!this.lastTarget) {
      this.lastTarget = currentBlock;
      this.isDownward = true;

      const selection = SelectionUtils.get();
      selection.removeAllRanges();
    }

    const lastTargetIndex = BlockManager.blocks.indexOf(this.lastTarget);
    const nextTarget = BlockManager.blocks[lastTargetIndex + 1];

    if (!nextTarget) {
      return;
    }

    if (this.isDownward) {
      this.lastTarget.selected = true;
      this.lastTarget = nextTarget;
      this.lastTarget.selected = !this.lastTarget.selected;
    } else {
      this.lastTarget.selected = !this.lastTarget.selected;
      this.lastTarget = nextTarget;
    }
  }

  public selectPrevioiusBlock(): void {
    if (!this.Editor.BlockSelection.anyBlockSelected && !this.Editor.Caret.isAtStart && !this.lastTarget) {
      return;
    }

    const {BlockManager} = this.Editor;

    if (!this.lastTarget) {
      const {currentBlock} = BlockManager;

      this.lastTarget = currentBlock;
      this.isDownward = false;

      const selection = SelectionUtils.get();
      selection.removeAllRanges();
    }

    const lastTargetIndex = BlockManager.blocks.indexOf(this.lastTarget);
    const nextTarget = BlockManager.blocks[lastTargetIndex - 1];

    if (!nextTarget) {
      return;
    }

    if (!this.isDownward) {
      this.lastTarget.selected = true;
      this.lastTarget = nextTarget;
      this.lastTarget.selected = !this.lastTarget.selected;
    } else {
      this.lastTarget.selected = !this.lastTarget.selected;
      this.lastTarget = nextTarget;
    }
  }
}
