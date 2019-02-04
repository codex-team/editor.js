import Operation from '../base';
import {BlockInsertOperation} from './index';

export class BlockDeleteOperation extends Operation {
  public static TYPE = 'block/delete';

  constructor(index: number, tool: string, data: any) {
    super({
      type: BlockDeleteOperation.TYPE,
      block: index,
      data: {
        tool,
        data,
      },
   });
  }

  public transform(operation: Operation): Operation {
    const clone = this.clone();

    switch (operation.type) {
      case BlockInsertOperation.TYPE:
        if (operation.block <= clone.block) {
          clone.block++;
        }
        break;

      case BlockDeleteOperation.TYPE:
        if (operation.block <= clone.block) {
          clone.block--;
        }
    }

    return clone;
  }

  public reverse(): Operation {
    const op = new BlockInsertOperation(this.block, this.data.tool, this.data.data);

    op.reversed = true;
    return op;
  }
}
