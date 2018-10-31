import Block from '../../block';

namespace EditorJS.API {
  export interface Blocks {
    clear(): void;
    render(data: any): Promise<void>;
    delete(): void;
    swap(fromIndex: number, toIndex: number): void;
    getBlockByIndex(index: number): Block;
    getCurrentBlockIndex(): number;
    stretchBlock(index: number, status: boolean = true): void;
    insertNewBlock(): void;
  }
}
