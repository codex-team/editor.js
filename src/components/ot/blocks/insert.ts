import Operation from '../base';
import { BlockDeleteOperation } from './index';

export class BlockInsertOperation extends Operation {
  public static TYPE = 'block/insert';

  constructor(index: number, tool: string, data: any) {
    super({
      type: BlockInsertOperation.TYPE,
      block: index,
      data: {
        tool,
        data,
      },
    });
  }

  public transform(operation: Operation): Operation {
    const newOp = this.clone();

    switch (operation.type) {
      case BlockInsertOperation.TYPE:
        if (operation.block <= newOp.block) {
          newOp.block++;
        }
        break;

      case BlockDeleteOperation.TYPE:
        if (operation.block <= newOp.block) {
          newOp.block--;
        }
    }

    return newOp;
  }

  public reverse(): Operation {
    const op = new BlockDeleteOperation(this.block, this.data.tool, this.data.data);

    op.reversed = true;
    return op;
  }
}
