/**
 * @class BlockManager
 * @classdesc Manage editor`s blocks storage and appearance
 * @module BlockManager
 * @version 2.0.0
 */
import Block, { BlockToolAPI } from '../block';
import Module from '../__module';
import $ from '../dom';
import * as _ from '../utils';
import Blocks from '../blocks';
import { BlockToolData, PasteEvent } from '../../../types';
import { BlockTuneData } from '../../../types/block-tunes/block-tune-data';
import BlockAPI from '../block/api';
import { BlockMutationEventMap, BlockMutationType } from '../../../types/events/block';
import { BlockRemovedMutationType } from '../../../types/events/block/BlockRemoved';
import { BlockAddedMutationType } from '../../../types/events/block/BlockAdded';
import { BlockMovedMutationType } from '../../../types/events/block/BlockMoved';
import { BlockChangedMutationType } from '../../../types/events/block/BlockChanged';
import { BlockChanged } from '../events';
import { clean, sanitizeBlocks } from '../utils/sanitizer';
import { convertStringToBlockData, isBlockConvertable } from '../utils/blocks';
import PromiseQueue from '../utils/promise-queue';

/**
 * @typedef {BlockManager} BlockManager
 * @property {number} currentBlockIndex - Index of current working block
 * @property {Proxy} _blocks - Proxy for Blocks instance {@link Blocks}
 */
export default class BlockManager extends Module {
  /**
   * Returns current Block index
   *
   * @returns {number}
   */
  public get currentBlockIndex(): number {
    return this._currentBlockIndex;
  }

  /**
   * Set current Block index and fire Block lifecycle callbacks
   *
   * @param {number} newIndex - index of Block to set as current
   */
  public set currentBlockIndex(newIndex: number) {
    this._currentBlockIndex = newIndex;
  }

  /**
   * returns first Block
   *
   * @returns {Block}
   */
  public get firstBlock(): Block {
    return this._blocks[0];
  }

  /**
   * returns last Block
   *
   * @returns {Block}
   */
  public get lastBlock(): Block {
    return this._blocks[this._blocks.length - 1];
  }

  /**
   * Get current Block instance
   *
   * @returns {Block}
   */
  public get currentBlock(): Block | undefined {
    return this._blocks[this.currentBlockIndex];
  }

  /**
   * Set passed Block as a current
   *
   * @param block - block to set as a current
   */
  public set currentBlock(block: Block) {
    this.currentBlockIndex = this.getBlockIndex(block);
  }

  /**
   * Returns next Block instance
   *
   * @returns {Block|null}
   */
  public get nextBlock(): Block | null {
    const isLastBlock = this.currentBlockIndex === (this._blocks.length - 1);

    if (isLastBlock) {
      return null;
    }

    return this._blocks[this.currentBlockIndex + 1];
  }

  /**
   * Return first Block with inputs after current Block
   *
   * @returns {Block | undefined}
   */
  public get nextContentfulBlock(): Block {
    const nextBlocks = this.blocks.slice(this.currentBlockIndex + 1);

    return nextBlocks.find((block) => !!block.inputs.length);
  }

  /**
   * Return first Block with inputs before current Block
   *
   * @returns {Block | undefined}
   */
  public get previousContentfulBlock(): Block {
    const previousBlocks = this.blocks.slice(0, this.currentBlockIndex).reverse();

    return previousBlocks.find((block) => !!block.inputs.length);
  }

  /**
   * Returns previous Block instance
   *
   * @returns {Block|null}
   */
  public get previousBlock(): Block | null {
    const isFirstBlock = this.currentBlockIndex === 0;

    if (isFirstBlock) {
      return null;
    }

    return this._blocks[this.currentBlockIndex - 1];
  }

  /**
   * Get array of Block instances
   *
   * @returns {Block[]} {@link Blocks#array}
   */
  public get blocks(): Block[] {
    return this._blocks.array;
  }

  /**
   * Check if each Block is empty
   *
   * @returns {boolean}
   */
  public get isEditorEmpty(): boolean {
    return this.blocks.every((block) => block.isEmpty);
  }

  /**
   * Index of current working block
   *
   * @type {number}
   */
  private _currentBlockIndex = -1;

  /**
   * Proxy for Blocks instance {@link Blocks}
   *
   * @type {Proxy}
   * @private
   */
  private _blocks: Blocks = null;

  /**
   * Should be called after Editor.UI preparation
   * Define this._blocks property
   */
  public prepare(): void {
    const blocks = new Blocks(this.Editor.UI.nodes.redactor);

    /**
     * We need to use Proxy to overload set/get [] operator.
     * So we can use array-like syntax to access blocks
     *
     * @example
     * this._blocks[0] = new Block(...);
     *
     * block = this._blocks[0];
     * @todo proxy the enumerate method
     * @type {Proxy}
     * @private
     */
    this._blocks = new Proxy(blocks, {
      set: Blocks.set,
      get: Blocks.get,
    });

    /** Copy event */
    this.listeners.on(
      document,
      'copy',
      (e: ClipboardEvent) => this.Editor.BlockEvents.handleCommandC(e)
    );
  }

  /**
   * Toggle read-only state
   *
   * If readOnly is true:
   *  - Unbind event handlers from created Blocks
   *
   * if readOnly is false:
   *  - Bind event handlers to all existing Blocks
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      this.enableModuleBindings();
    } else {
      this.disableModuleBindings();
    }
  }

  /**
   * Creates Block instance by tool name
   *
   * @param {object} options - block creation options
   * @param {string} options.tool - tools passed in editor config {@link EditorConfig#tools}
   * @param {string} [options.id] - unique id for this block
   * @param {BlockToolData} [options.data] - constructor params
   * @returns {Block}
   */
  public composeBlock({
    tool: name,
    data = {},
    id = undefined,
    tunes: tunesData = {},
  }: {tool: string; id?: string; data?: BlockToolData; tunes?: {[name: string]: BlockTuneData}}): Block {
    const readOnly = this.Editor.ReadOnly.isEnabled;
    const tool = this.Editor.Tools.blockTools.get(name);
    const block = new Block({
      id,
      data,
      tool,
      api: this.Editor.API,
      readOnly,
      tunesData,
    }, this.eventsDispatcher);

    if (!readOnly) {
      window.requestIdleCallback(() => {
        this.bindBlockEvents(block);
      }, { timeout: 2000 });
    }

    return block;
  }

  /**
   * Insert new block into _blocks
   *
   * @param {object} options - insert options
   * @param {string} [options.id] - block's unique id
   * @param {string} [options.tool] - plugin name, by default method inserts the default block type
   * @param {object} [options.data] - plugin data
   * @param {number} [options.index] - index where to insert new Block
   * @param {boolean} [options.needToFocus] - flag shows if needed to update current Block index
   * @param {boolean} [options.replace] - flag shows if block by passed index should be replaced with inserted one
   * @returns {Block}
   */
  public insert({
    id = undefined,
    tool = this.config.defaultBlock,
    data = {},
    index,
    needToFocus = true,
    replace = false,
    tunes = {},
  }: {
    id?: string;
    tool?: string;
    data?: BlockToolData;
    index?: number;
    needToFocus?: boolean;
    replace?: boolean;
    tunes?: {[name: string]: BlockTuneData};
  } = {}): Block {
    let newIndex = index;

    if (newIndex === undefined) {
      newIndex = this.currentBlockIndex + (replace ? 0 : 1);
    }

    const block = this.composeBlock({
      id,
      tool,
      data,
      tunes,
    });

    /**
     * In case of block replacing (Converting OR from Toolbox or Shortcut on empty block OR on-paste to empty block)
     * we need to dispatch the 'block-removing' event for the replacing block
     */
    if (replace) {
      this.blockDidMutated(BlockRemovedMutationType, this.getBlockByIndex(newIndex), {
        index: newIndex,
      });
    }

    this._blocks.insert(newIndex, block, replace);

    /**
     * Force call of didMutated event on Block insertion
     */
    this.blockDidMutated(BlockAddedMutationType, block, {
      index: newIndex,
    });

    if (needToFocus) {
      this.currentBlockIndex = newIndex;
    } else if (newIndex <= this.currentBlockIndex) {
      this.currentBlockIndex++;
    }

    return block;
  }

  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index where to insert
   */
  public insertMany(blocks: Block[], index = 0): void {
    this._blocks.insertMany(blocks, index);
  }

  /**
   * Update Block data.
   *
   * Currently we don't have an 'update' method in the Tools API, so we just create a new block with the same id and type
   * Should not trigger 'block-removed' or 'block-added' events
   *
   * @param block - block to update
   * @param data - new data
   */
  public async update(block: Block, data: Partial<BlockToolData>): Promise<Block> {
    const existingData = await block.data;

    const newBlock = this.composeBlock({
      id: block.id,
      tool: block.name,
      data: Object.assign({}, existingData, data),
      tunes: block.tunes,
    });

    const blockIndex = this.getBlockIndex(block);

    this._blocks.replace(blockIndex, newBlock);

    this.blockDidMutated(BlockChangedMutationType, newBlock, {
      index: blockIndex,
    });

    return newBlock;
  }

  /**
   * Replace passed Block with the new one with specified Tool and data
   *
   * @param block - block to replace
   * @param newTool - new Tool name
   * @param data - new Tool data
   */
  public replace(block: Block, newTool: string, data: BlockToolData): Block {
    const blockIndex = this.getBlockIndex(block);

    return this.insert({
      tool: newTool,
      data,
      index: blockIndex,
      replace: true,
    });
  }

  /**
   * Insert pasted content. Call onPaste callback after insert.
   *
   * @param {string} toolName - name of Tool to insert
   * @param {PasteEvent} pasteEvent - pasted data
   * @param {boolean} replace - should replace current block
   */
  public paste(
    toolName: string,
    pasteEvent: PasteEvent,
    replace = false
  ): Block {
    const block = this.insert({
      tool: toolName,
      replace,
    });

    try {
      /**
       * We need to call onPaste after Block will be ready
       * because onPaste could change tool's root element, and we need to do that after block.watchBlockMutations() bound
       * to detect tool root element change
       *
       * @todo make this.insert() awaitable and remove requestIdleCallback
       */
      window.requestIdleCallback(() => {
        block.call(BlockToolAPI.ON_PASTE, pasteEvent);
      });
    } catch (e) {
      _.log(`${toolName}: onPaste callback call is failed`, 'error', e);
    }

    return block;
  }

  /**
   * Insert new default block at passed index
   *
   * @param {number} index - index where Block should be inserted
   * @param {boolean} needToFocus - if true, updates current Block index
   *
   * TODO: Remove method and use insert() with index instead (?)
   * @returns {Block} inserted Block
   */
  public insertDefaultBlockAtIndex(index: number, needToFocus = false): Block {
    const block = this.composeBlock({ tool: this.config.defaultBlock });

    this._blocks[index] = block;

    /**
     * Force call of didMutated event on Block insertion
     */
    this.blockDidMutated(BlockAddedMutationType, block, {
      index,
    });

    if (needToFocus) {
      this.currentBlockIndex = index;
    } else if (index <= this.currentBlockIndex) {
      this.currentBlockIndex++;
    }

    return block;
  }

  /**
   * Always inserts at the end
   *
   * @returns {Block}
   */
  public insertAtEnd(): Block {
    /**
     * Define new value for current block index
     */
    this.currentBlockIndex = this.blocks.length - 1;

    /**
     * Insert the default typed block
     */
    return this.insert();
  }

  /**
   * Merge two blocks
   *
   * @param {Block} targetBlock - previous block will be append to this block
   * @param {Block} blockToMerge - block that will be merged with target block
   * @returns {Promise} - the sequence that can be continued
   */
  public async mergeBlocks(targetBlock: Block, blockToMerge: Block): Promise<void> {
    let blockToMergeData: BlockToolData | undefined;

    /**
     * We can merge:
     * 1) Blocks with the same Tool if tool provides merge method
     */
    if (targetBlock.name === blockToMerge.name && targetBlock.mergeable) {
      const blockToMergeDataRaw = await blockToMerge.data;

      if (_.isEmpty(blockToMergeDataRaw)) {
        console.error('Could not merge Block. Failed to extract original Block data.');

        return;
      }

      const [ cleanData ] = sanitizeBlocks([ blockToMergeDataRaw ], targetBlock.tool.sanitizeConfig);

      blockToMergeData = cleanData;

    /**
     * 2) Blocks with different Tools if they provides conversionConfig
     */
    } else if (targetBlock.mergeable && isBlockConvertable(blockToMerge, 'export') && isBlockConvertable(targetBlock, 'import')) {
      const blockToMergeDataStringified = await blockToMerge.exportDataAsString();
      const cleanData = clean(blockToMergeDataStringified, targetBlock.tool.sanitizeConfig);

      blockToMergeData = convertStringToBlockData(cleanData, targetBlock.tool.conversionConfig);
    }

    if (blockToMergeData === undefined) {
      return;
    }

    await targetBlock.mergeWith(blockToMergeData);
    this.removeBlock(blockToMerge);
    this.currentBlockIndex = this._blocks.indexOf(targetBlock);
  }

  /**
   * Remove passed Block
   *
   * @param block - Block to remove
   * @param addLastBlock - if true, adds new default block at the end. @todo remove this logic and use event-bus instead
   */
  public removeBlock(block: Block, addLastBlock = true): Promise<void> {
    return new Promise((resolve) => {
      const index = this._blocks.indexOf(block);

      /**
       * If index is not passed and there is no block selected, show a warning
       */
      if (!this.validateIndex(index)) {
        throw new Error('Can\'t find a Block to remove');
      }

      block.destroy();
      this._blocks.remove(index);

      /**
       * Force call of didMutated event on Block removal
       */
      this.blockDidMutated(BlockRemovedMutationType, block, {
        index,
      });

      if (this.currentBlockIndex >= index) {
        this.currentBlockIndex--;
      }

      /**
       * If first Block was removed, insert new Initial Block and set focus on it`s first input
       */
      if (!this.blocks.length) {
        this.unsetCurrentBlock();

        if (addLastBlock) {
          this.insert();
        }
      } else if (index === 0) {
        this.currentBlockIndex = 0;
      }

      resolve();
    });
  }

  /**
   * Remove only selected Blocks
   * and returns first Block index where started removing...
   *
   * @returns {number|undefined}
   */
  public removeSelectedBlocks(): number | undefined {
    let firstSelectedBlockIndex;

    /**
     * Remove selected Blocks from the end
     */
    for (let index = this.blocks.length - 1; index >= 0; index--) {
      if (!this.blocks[index].selected) {
        continue;
      }

      this.removeBlock(this.blocks[index]);
      firstSelectedBlockIndex = index;
    }

    return firstSelectedBlockIndex;
  }

  /**
   * Attention!
   * After removing insert the new default typed Block and focus on it
   * Removes all blocks
   */
  public removeAllBlocks(): void {
    for (let index = this.blocks.length - 1; index >= 0; index--) {
      this._blocks.remove(index);
    }

    this.unsetCurrentBlock();
    this.insert();
    this.currentBlock.firstInput.focus();
  }

  /**
   * Split current Block
   * 1. Extract content from Caret position to the Block`s end
   * 2. Insert a new Block below current one with extracted content
   *
   * @returns {Block}
   */
  public split(): Block {
    const extractedFragment = this.Editor.Caret.extractFragmentFromCaretPosition();
    const wrapper = $.make('div');

    wrapper.appendChild(extractedFragment as DocumentFragment);

    /**
     * @todo make object in accordance with Tool
     */
    const data = {
      text: $.isEmpty(wrapper) ? '' : wrapper.innerHTML,
    };

    /**
     * Renew current Block
     *
     * @type {Block}
     */
    return this.insert({ data });
  }

  /**
   * Returns Block by passed index
   *
   * If we pass -1 as index, the last block will be returned
   * There shouldn't be a case when there is no blocks at all — at least one always should exist
   */
  public getBlockByIndex(index: -1): Block;

  /**
   * Returns Block by passed index.
   *
   * Could return undefined if there is no block with such index
   */
  public getBlockByIndex(index: number): Block | undefined;

  /**
   * Returns Block by passed index
   *
   * @param {number} index - index to get. -1 to get last
   * @returns {Block}
   */
  public getBlockByIndex(index: number): Block | undefined {
    if (index === -1) {
      index = this._blocks.length - 1;
    }

    return this._blocks[index];
  }

  /**
   * Returns an index for passed Block
   *
   * @param block - block to find index
   */
  public getBlockIndex(block: Block): number {
    return this._blocks.indexOf(block);
  }

  /**
   * Returns the Block by passed id
   *
   * @param id - id of block to get
   * @returns {Block}
   */
  public getBlockById(id): Block | undefined {
    return this._blocks.array.find(block => block.id === id);
  }

  /**
   * Get Block instance by html element
   *
   * @param {Node} element - html element to get Block by
   */
  public getBlock(element: HTMLElement): Block {
    if (!$.isElement(element) as boolean) {
      element = element.parentNode as HTMLElement;
    }

    const nodes = this._blocks.nodes,
        firstLevelBlock = element.closest(`.${Block.CSS.wrapper}`),
        index = nodes.indexOf(firstLevelBlock as HTMLElement);

    if (index >= 0) {
      return this._blocks[index];
    }
  }

  /**
   * 1) Find first-level Block from passed child Node
   * 2) Mark it as current
   *
   * @param {Node} childNode - look ahead from this node.
   * @returns {Block | undefined} can return undefined in case when the passed child note is not a part of the current editor instance
   */
  public setCurrentBlockByChildNode(childNode: Node): Block | undefined {
    /**
     * If node is Text TextNode
     */
    if (!$.isElement(childNode)) {
      childNode = childNode.parentNode;
    }

    const parentFirstLevelBlock = (childNode as HTMLElement).closest(`.${Block.CSS.wrapper}`);

    if (!parentFirstLevelBlock) {
      return;
    }

    /**
     * Support multiple Editor.js instances,
     * by checking whether the found block belongs to the current instance
     *
     * @see {@link Ui#documentTouched}
     */
    const editorWrapper = parentFirstLevelBlock.closest(`.${this.Editor.UI.CSS.editorWrapper}`);
    const isBlockBelongsToCurrentInstance = editorWrapper?.isEqualNode(this.Editor.UI.nodes.wrapper);

    if (!isBlockBelongsToCurrentInstance) {
      return;
    }

    /**
     * Update current Block's index
     *
     * @type {number}
     */
    this.currentBlockIndex = this._blocks.nodes.indexOf(parentFirstLevelBlock as HTMLElement);

    /**
     * Update current block active input
     */
    this.currentBlock.updateCurrentInput();

    return this.currentBlock;
  }

  /**
   * Return block which contents passed node
   *
   * @param {Node} childNode - node to get Block by
   * @returns {Block}
   */
  public getBlockByChildNode(childNode: Node): Block | undefined {
    if (!childNode || childNode instanceof Node === false) {
      return undefined;
    }

    /**
     * If node is Text TextNode
     */
    if (!$.isElement(childNode)) {
      childNode = childNode.parentNode;
    }

    const firstLevelBlock = (childNode as HTMLElement).closest(`.${Block.CSS.wrapper}`);

    return this.blocks.find((block) => block.holder === firstLevelBlock);
  }

  /**
   * Swap Blocks Position
   *
   * @param {number} fromIndex - index of first block
   * @param {number} toIndex - index of second block
   * @deprecated — use 'move' instead
   */
  public swap(fromIndex, toIndex): void {
    /** Move up current Block */
    this._blocks.swap(fromIndex, toIndex);

    /** Now actual block moved up so that current block index decreased */
    this.currentBlockIndex = toIndex;
  }

  /**
   * Move a block to a new index
   *
   * @param {number} toIndex - index where to move Block
   * @param {number} fromIndex - index of Block to move
   */
  public move(toIndex, fromIndex = this.currentBlockIndex): void {
    // make sure indexes are valid and within a valid range
    if (isNaN(toIndex) || isNaN(fromIndex)) {
      _.log(`Warning during 'move' call: incorrect indices provided.`, 'warn');

      return;
    }

    if (!this.validateIndex(toIndex) || !this.validateIndex(fromIndex)) {
      _.log(`Warning during 'move' call: indices cannot be lower than 0 or greater than the amount of blocks.`, 'warn');

      return;
    }

    /** Move up current Block */
    this._blocks.move(toIndex, fromIndex);

    /** Now actual block moved so that current block index changed */
    this.currentBlockIndex = toIndex;

    /**
     * Force call of didMutated event on Block movement
     */
    this.blockDidMutated(BlockMovedMutationType, this.currentBlock, {
      fromIndex,
      toIndex,
    });
  }

  /**
   * Converts passed Block to the new Tool
   * Uses Conversion Config
   *
   * @param blockToConvert - Block that should be converted
   * @param targetToolName - name of the Tool to convert to
   * @param blockDataOverrides - optional new Block data overrides
   */
  public async convert(blockToConvert: Block, targetToolName: string, blockDataOverrides?: BlockToolData): Promise<Block> {
    /**
     * At first, we get current Block data
     */
    const savedBlock = await blockToConvert.save();

    if (!savedBlock) {
      throw new Error('Could not convert Block. Failed to extract original Block data.');
    }

    /**
     * Getting a class of the replacing Tool
     */
    const replacingTool = this.Editor.Tools.blockTools.get(targetToolName);

    if (!replacingTool) {
      throw new Error(`Could not convert Block. Tool «${targetToolName}» not found.`);
    }

    /**
     * Using Conversion Config "export" we get a stringified version of the Block data
     */
    const exportedData = await blockToConvert.exportDataAsString();

    /**
     * Clean exported data with replacing sanitizer config
     */
    const cleanData: string = clean(
      exportedData,
      replacingTool.sanitizeConfig
    );

    /**
     * Now using Conversion Config "import" we compose a new Block data
     */
    let newBlockData = convertStringToBlockData(cleanData, replacingTool.conversionConfig);

    /**
     * Optional data overrides.
     * Used for example, by the Multiple Toolbox Items feature, where a single Tool provides several Toolbox items with "data" overrides
     */
    if (blockDataOverrides) {
      newBlockData = Object.assign(newBlockData, blockDataOverrides);
    }

    return this.replace(blockToConvert, replacingTool.name, newBlockData);
  }

  /**
   * Sets current Block Index -1 which means unknown
   * and clear highlights
   */
  public unsetCurrentBlock(): void {
    this.currentBlockIndex = -1;
  }

  /**
   * Clears Editor
   *
   * @param {boolean} needToAddDefaultBlock - 1) in internal calls (for example, in api.blocks.render)
   *                                             we don't need to add an empty default block
   *                                        2) in api.blocks.clear we should add empty block
   */
  public async clear(needToAddDefaultBlock = false): Promise<void> {
    const queue = new PromiseQueue();

    this.blocks.forEach((block) => {
      queue.add(async () => {
        await this.removeBlock(block, false);
      });
    });

    await queue.completed;

    this.unsetCurrentBlock();

    if (needToAddDefaultBlock) {
      this.insert();
    }

    /**
     * Add empty modifier
     */
    this.Editor.UI.checkEmptiness();
  }

  /**
   * Cleans up all the block tools' resources
   * This is called when editor is destroyed
   */
  public async destroy(): Promise<void> {
    await Promise.all(this.blocks.map((block) => {
      return block.destroy();
    }));
  }

  /**
   * Bind Block events
   *
   * @param {Block} block - Block to which event should be bound
   */
  private bindBlockEvents(block: Block): void {
    const { BlockEvents } = this.Editor;

    this.readOnlyMutableListeners.on(block.holder, 'keydown', (event: KeyboardEvent) => {
      BlockEvents.keydown(event);
    });

    this.readOnlyMutableListeners.on(block.holder, 'keyup', (event: KeyboardEvent) => {
      BlockEvents.keyup(event);
    });

    this.readOnlyMutableListeners.on(block.holder, 'dragover', (event: DragEvent) => {
      BlockEvents.dragOver(event);
    });

    this.readOnlyMutableListeners.on(block.holder, 'dragleave', (event: DragEvent) => {
      BlockEvents.dragLeave(event);
    });

    block.on('didMutated', (affectedBlock: Block) => {
      return this.blockDidMutated(BlockChangedMutationType, affectedBlock, {
        index: this.getBlockIndex(affectedBlock),
      });
    });
  }

  /**
   * Disable mutable handlers and bindings
   */
  private disableModuleBindings(): void {
    this.readOnlyMutableListeners.clearAll();
  }

  /**
   * Enables all module handlers and bindings for all Blocks
   */
  private enableModuleBindings(): void {
    /** Cut event */
    this.readOnlyMutableListeners.on(
      document,
      'cut',
      (e: ClipboardEvent) => this.Editor.BlockEvents.handleCommandX(e)
    );

    this.blocks.forEach((block: Block) => {
      this.bindBlockEvents(block);
    });
  }

  /**
   * Validates that the given index is not lower than 0 or higher than the amount of blocks
   *
   * @param {number} index - index of blocks array to validate
   * @returns {boolean}
   */
  private validateIndex(index: number): boolean {
    return !(index < 0 || index >= this._blocks.length);
  }

  /**
   * Block mutation callback
   *
   * @param mutationType - what happened with block
   * @param block - mutated block
   * @param detailData - additional data to pass with change event
   */
  private blockDidMutated<Type extends BlockMutationType>(mutationType: Type, block: Block, detailData: BlockMutationEventDetailWithoutTarget<Type>): Block {
    const event = new CustomEvent(mutationType, {
      detail: {
        target: new BlockAPI(block),
        ...detailData as BlockMutationEventDetailWithoutTarget<Type>,
      },
    });

    this.eventsDispatcher.emit(BlockChanged, {
      event: event as BlockMutationEventMap[Type],
    });

    return block;
  }
}

/**
 * Type alias for Block Mutation event without 'target' field, used in 'blockDidMutated' method
 */
type BlockMutationEventDetailWithoutTarget<Type extends BlockMutationType> = Omit<BlockMutationEventMap[Type]['detail'], 'target'>;
