import { BlockAPI as BlockAPIInterface, Blocks } from '../../../../types/api';
import { BlockToolData, OutputData, ToolConfig } from '../../../../types';
import * as _ from './../../utils';
import BlockAPI from '../../block/api';
import Module from '../../__module';
import Block from '../../block';

/**
 * @class BlocksAPI
 * provides with methods working with Block
 */
export default class BlocksAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Blocks}
   */
  public get methods(): Blocks {
    return {
      clear: (): void => this.clear(),
      render: (data: OutputData): Promise<void> => this.render(data),
      renderFromHTML: (data: string): Promise<void> => this.renderFromHTML(data),
      delete: (index?: number): void => this.delete(index),
      swap: (fromIndex: number, toIndex: number): void => this.swap(fromIndex, toIndex),
      move: (toIndex: number, fromIndex?: number): void => this.move(toIndex, fromIndex),
      getBlockByIndex: (index: number): BlockAPIInterface | undefined => this.getBlockByIndex(index),
      getById: (id: string): BlockAPIInterface | null => this.getById(id),
      getCurrentBlockIndex: (): number => this.getCurrentBlockIndex(),
      getBlockIndex: (id: string): number => this.getBlockIndex(id),
      getBlocksCount: (): number => this.getBlocksCount(),
      stretchBlock: (index: number, status = true): void => this.stretchBlock(index, status),
      insertNewBlock: (): void => this.insertNewBlock(),
      insert: this.insert,
      update: this.update,
      composeBlockData: this.composeBlockData,
    };
  }

  /**
   * Returns Blocks count
   *
   * @returns {number}
   */
  public getBlocksCount(): number {
    return this.Editor.BlockManager.blocks.length;
  }

  /**
   * Returns current block index
   *
   * @returns {number}
   */
  public getCurrentBlockIndex(): number {
    return this.Editor.BlockManager.currentBlockIndex;
  }

  /**
   * Returns the index of Block by id;
   *
   * @param id - block id
   */
  public getBlockIndex(id: string): number | undefined {
    const block = this.Editor.BlockManager.getBlockById(id);

    if (!block) {
      _.logLabeled('There is no block with id `' + id + '`', 'warn');

      return;
    }

    return this.Editor.BlockManager.getBlockIndex(block);
  }

  /**
   * Returns BlockAPI object by Block index
   *
   * @param {number} index - index to get
   */
  public getBlockByIndex(index: number): BlockAPIInterface | undefined {
    const block = this.Editor.BlockManager.getBlockByIndex(index);

    if (block === undefined) {
      _.logLabeled('There is no block at index `' + index + '`', 'warn');

      return;
    }

    return new BlockAPI(block);
  }

  /**
   * Returns BlockAPI object by Block id
   *
   * @param id - id of block to get
   */
  public getById(id: string): BlockAPIInterface | null {
    const block = this.Editor.BlockManager.getBlockById(id);

    if (block === undefined) {
      _.logLabeled('There is no block with id `' + id + '`', 'warn');

      return null;
    }

    return new BlockAPI(block);
  }

  /**
   * Call Block Manager method that swap Blocks
   *
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   * @deprecated — use 'move' instead
   */
  public swap(fromIndex: number, toIndex: number): void {
    _.log(
      '`blocks.swap()` method is deprecated and will be removed in the next major release. ' +
      'Use `block.move()` method instead',
      'info'
    );

    this.Editor.BlockManager.swap(fromIndex, toIndex);
  }

  /**
   * Move block from one index to another
   *
   * @param {number} toIndex - index to move to
   * @param {number} fromIndex - index to move from
   */
  public move(toIndex: number, fromIndex?: number): void {
    this.Editor.BlockManager.move(toIndex, fromIndex);
  }

  /**
   * Deletes Block
   *
   * @param {number} blockIndex - index of Block to delete
   */
  public delete(blockIndex?: number): void {
    try {
      this.Editor.BlockManager.removeBlock(blockIndex);
    } catch (e) {
      _.logLabeled(e, 'warn');

      return;
    }

    /**
     * in case of last block deletion
     * Insert the new default empty block
     */
    if (this.Editor.BlockManager.blocks.length === 0) {
      this.Editor.BlockManager.insert();
    }

    /**
     * After Block deletion currentBlock is updated
     */
    if (this.Editor.BlockManager.currentBlock) {
      this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END);
    }

    this.Editor.Toolbar.close();
  }

  /**
   * Clear Editor's area
   */
  public clear(): void {
    this.Editor.BlockManager.clear(true);
    this.Editor.InlineToolbar.close();
  }

  /**
   * Fills Editor with Blocks data
   *
   * @param {OutputData} data — Saved Editor data
   */
  public render(data: OutputData): Promise<void> {
    this.Editor.BlockManager.clear();

    return this.Editor.Renderer.render(data.blocks);
  }

  /**
   * Render passed HTML string
   *
   * @param {string} data - HTML string to render
   * @returns {Promise<void>}
   */
  public renderFromHTML(data: string): Promise<void> {
    this.Editor.BlockManager.clear();

    return this.Editor.Paste.processText(data, true);
  }

  /**
   * Stretch Block's content
   *
   * @param {number} index - index of Block to stretch
   * @param {boolean} status - true to enable, false to disable
   * @deprecated Use BlockAPI interface to stretch Blocks
   */
  public stretchBlock(index: number, status = true): void {
    _.deprecationAssert(
      true,
      'blocks.stretchBlock()',
      'BlockAPI'
    );

    const block = this.Editor.BlockManager.getBlockByIndex(index);

    if (!block) {
      return;
    }

    block.stretched = status;
  }

  /**
   * Insert new Block and returns it's API
   *
   * @param {string} type — Tool name
   * @param {BlockToolData} data — Tool data to insert
   * @param {ToolConfig} config — Tool config
   * @param {number?} index — index where to insert new Block
   * @param {boolean?} needToFocus - flag to focus inserted Block
   * @param replace - pass true to replace the Block existed under passed index
   * @param {string} id — An optional id for the new block. If omitted then the new id will be generated
   */
  public insert = (
    type: string = this.config.defaultBlock,
    data: BlockToolData = {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    config: ToolConfig = {},
    index?: number,
    needToFocus?: boolean,
    replace?: boolean,
    id?: string
  ): BlockAPIInterface => {
    const insertedBlock = this.Editor.BlockManager.insert({
      id,
      tool: type,
      data,
      index,
      needToFocus,
      replace,
    });

    return new BlockAPI(insertedBlock);
  };

  /**
   * Creates data of an empty block with a passed type.
   *
   * @param toolName - block tool name
   */
  public composeBlockData = async (toolName: string): Promise<BlockToolData> => {
    const tool = this.Editor.Tools.blockTools.get(toolName);
    const block = new Block({
      tool,
      api: this.Editor.API,
      readOnly: true,
      data: {},
      tunesData: {},
    });

    return block.data;
  };

  /**
   * Insert new Block
   * After set caret to this Block
   *
   * @todo remove in 3.0.0
   * @deprecated with insert() method
   */
  public insertNewBlock(): void {
    _.log('Method blocks.insertNewBlock() is deprecated and it will be removed in the next major release. ' +
      'Use blocks.insert() instead.', 'warn');
    this.insert();
  }

  /**
   * Updates block data by id
   *
   * @param id - id of the block to update
   * @param data - the new data
   */
  public update = (id: string, data: BlockToolData): void => {
    const { BlockManager } = this.Editor;
    const block = BlockManager.getBlockById(id);

    if (!block) {
      _.log('blocks.update(): Block with passed id was not found', 'warn');

      return;
    }

    const blockIndex = BlockManager.getBlockIndex(block);

    BlockManager.insert({
      id: block.id,
      tool: block.name,
      data,
      index: blockIndex,
      replace: true,
      tunes: block.tunes,
    });
  };
}
