import Module from '../__module';
import {BlockDeleteOperation, BlockInsertOperation} from '../ot/blocks';
import Block from '../block';
import Operation from '../ot/base';
import {TextDeleteOperation, TextInsertOperation} from '../ot/text';
import SelectionUtils from '../selection';
import $ from '../dom';

export default class OTManager extends Module {
  public stack: Operation[] = [];

  public prepare() {
    this.Editor.Renderer.on('render/finished', () => {
      this.Editor.BlockManager.on('block/insert', this.onBlockInsert);
      this.Editor.BlockManager.on('block/delete', this.onBlockDelete);
      this.Editor.BlockManager.on('text/insert', this.onTextInsert);
      this.Editor.BlockManager.on('text/delete', this.onTextDelete);
    });

    this.Editor.Shortcuts.add({name: 'CMD+Z', handler: this.handleUndo});
    this.Editor.Shortcuts.add({name: 'CMD+Y', handler: this.handleRedo});
  }

  public apply(operation: Operation) {
    const {BlockManager, Caret} = this.Editor;
    let range, input, node, selection;

    switch (operation.type) {
      case BlockInsertOperation.TYPE:
        BlockManager.currentBlockIndex = operation.block - 1;
        BlockManager.insert(operation.data.tool, operation.data.data);
        Caret.setToBlock(BlockManager.currentBlock, Caret.positions.END);
        break;

      case BlockDeleteOperation.TYPE:
        BlockManager.removeBlock(operation.block);
        Caret.setToBlock(BlockManager.blocks[operation.block - 1], Caret.positions.END);
        break;

      case TextInsertOperation.TYPE:
        BlockManager.currentBlockIndex = operation.block;
        input = BlockManager.currentBlock.inputs[operation.input];

        range = document.createRange();
        selection = SelectionUtils.get();

        selection.removeAllRanges();
        selection.addRange(range);

        node = operation.nodes.reduce((anchorNode: Node, i: number) => {
            return anchorNode.childNodes[i];
        }, input);

        range.setStart(node, operation.startOffset);

        const tempWrapper = $.make('div');

        tempWrapper.innerHTML = operation.data.value;

        const fragment = document.createDocumentFragment();

        tempWrapper.childNodes.forEach((child) => {
          fragment.appendChild(child);
        });

        range.insertNode(fragment);
        input.normalize();
        range.collapse();
        break;

      case TextDeleteOperation.TYPE:
        BlockManager.currentBlockIndex = operation.block;
        input = BlockManager.currentBlock.inputs[operation.input];

        range = document.createRange();

        selection = SelectionUtils.get();

        selection.removeAllRanges();
        selection.addRange(range);

        node = operation.nodes.reduce((anchorNode: Node, i: number) => {
          return anchorNode.childNodes[i];
        }, input);

        range.setStart(node, operation.startOffset);
        range.setEnd(node, operation.endOffset);

        range.extractContents();
    }
  }

  private handleUndo = (e) => {
    e.preventDefault();

    const op = this.stack.find((o) => !o.reversed && !o.canceled);

    if (!op) {
      return;
    }

    op.canceled = true;

    const newOp = op.reverse();

    this.apply(newOp);

    if (newOp.needForceUpdate) {
      this.stack.unshift(newOp);
    } else {
      setImmediate(() => {
        this.stack[0].reversed = true;
      });
    }

    console.log(this.stack);
  }

  private handleRedo = (e) => {
    e.preventDefault();

    const op = this.stack.find((o) => o.reversed && !o.canceled);

    if (!op) {
      return;
    }

    op.canceled = true;

    const newOp = op.reverse();

    newOp.reversed = false;

    this.apply(newOp);

    if (newOp.needForceUpdate) {
      this.stack.unshift(newOp);
    }

    console.log(this.stack);
  }

  private onBlockInsert = async ({index, block}: {index: number, block: Block, data: any}) => {
    const operation = new BlockInsertOperation(index, block.name, await block.data);

    this.stack.unshift(operation);
  }

  private onBlockDelete = async ({index, block}: {index: number, block: Block}) => {
    const operation = new BlockDeleteOperation(index, block.name, await block.data);

    this.stack.unshift(operation);
  }

  private onTextInsert = ({position, data, block}) => {
    const operation = new TextInsertOperation(
      data.html,
      block,
      position.input,
      position.nodes,
      position.startOffset,
      position.endOffset,
    );

    const prevOp = this.stack[0];

    const prevOpIsMergable = prevOp && !prevOp.reversed && !prevOp.canceled && prevOp.mergeable;
    const newOpIsMergeable = operation.mergeable && !operation.reversed;
    const mergeable = prevOpIsMergable && newOpIsMergeable && prevOp.type === operation.type;

    if (!mergeable || !(prevOp as TextInsertOperation).merge(operation)) {
      this.stack.unshift(operation);
    }
  }

  private onTextDelete = ({data, block, position}) => {
    const operation = new TextDeleteOperation(
      data.html,
      block,
      position.input,
      position.nodes,
      position.startOffset,
      position.endOffset,
    );

    const prevOp = this.stack[0];

    const prevOpIsMergable = prevOp && !prevOp.reversed && !prevOp.canceled && prevOp.mergeable;
    const newOpIsMergeable = operation.mergeable && !operation.reversed;
    const mergeable = prevOpIsMergable && newOpIsMergeable && prevOp.type === operation.type;

    console.log(prevOp, mergeable);

    if (!mergeable || !(prevOp as TextDeleteOperation).merge(operation)) {
      this.stack.unshift(operation);
    }
  }
}
