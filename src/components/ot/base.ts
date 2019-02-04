export interface OperationData {
  type: string;
  block: number;
  input?: number;
  nodes?: number[];
  startOffset?: number;
  endOffset?: number;
  data: any;
}

export default abstract class Operation {

  public type: string;
  public block: number;
  public input?: number;
  public nodes?: number[];
  public startOffset?: number;
  public endOffset?: number;
  public data: any;
  public reversed: boolean = false;
  public canceled: boolean = false;
  public needForceUpdate?: boolean = false;
  public mergeable?: boolean = false;

  protected constructor(opData: OperationData) {
    this.type = opData.type;
    this.block = opData.block;
    this.input = opData.input;
    this.nodes = opData.nodes;
    this.startOffset = opData.startOffset;
    this.endOffset = opData.endOffset;
    this.data = opData.data;
  }

  public abstract transform(opertaion: Operation): Operation;

  public abstract reverse(): Operation;

  protected clone(): Operation {
    return new (this as any).constructor({
      type: this.type,
      block: this.block,
      input: this.input,
      nodes: this.nodes,
      startOffset: this.startOffset,
      endOffset: this.endOffset,
      data: Object.assign({}, this.data),
    });
  }
}
