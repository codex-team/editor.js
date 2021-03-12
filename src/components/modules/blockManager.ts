/**
 * @class BlockManager
 * @classdesc Manage editor`s blocks storage and appearance
 *
 * @module BlockManager
 *
 * @version 2.0.0
 */
import Block, { BlockToolAPI } from '../block';
import Module from '../__module';
import $ from '../dom';
import * as _ from '../utils';
import Blocks from '../blocks';
import { BlockToolConstructable, BlockToolData, PasteEvent } from '../../../types';

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
    if (this._blocks[this._currentBlockIndex]) {
      this._blocks[this._currentBlockIndex].willUnselect();
    }

    if (this._blocks[newIndex]) {
      this._blocks[newIndex].willSelect();
    }

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
  public get currentBlock(): Block {
    return this._blocks[this.currentBlockIndex];
  }

  /**
   * Returns next Block instance
   *
   * @returns {Block|null}
   */
  public get nextBlock(): Block {
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
  public get previousBlock(): Block {
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
     *
     * @todo proxy the enumerate method
     *
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
   * @param {BlockToolData} [options.data] - constructor params
   *
   * @returns {Block}
   */
  public composeBlock({ tool, data = {} }: {tool: string; data?: BlockToolData}): Block {
    const readOnly = this.Editor.ReadOnly.isEnabled;
    const settings = this.Editor.Tools.getToolSettings(tool);
    const Tool = this.Editor.Tools.available[tool] as BlockToolConstructable;
    const block = new Block({
      name: tool,
      data,
      Tool,
      settings,
      api: this.Editor.API,
      readOnly,
    });

    if (!readOnly) {
      this.bindBlockEvents(block);
    }

    return block;
  }

  /**
   * Insert new block into _blocks
   *
   * @param {object} options - insert options
   * @param {string} options.tool - plugin name, by default method inserts the default block type
   * @param {object} options.data - plugin data
   * @param {number} options.index - index where to insert new Block
   * @param {boolean} options.needToFocus - flag shows if needed to update current Block index
   * @param {boolean} options.replace - flag shows if block by passed index should be replaced with inserted one
   *
   * @returns {Block}
   */
  public insert({
    tool = this.config.defaultBlock,
    data = {},
    index,
    needToFocus = true,
    replace = false,
  }: {
    tool?: string;
    data?: BlockToolData;
    index?: number;
    needToFocus?: boolean;
    replace?: boolean;
  } = {}): Block {
    let newIndex = index;

    if (newIndex === undefined) {
      newIndex = this.currentBlockIndex + (replace ? 0 : 1);
    }

    const block = this.composeBlock({
      tool,
      data,
    });

    this._blocks.insert(newIndex, block, replace);

    if (needToFocus) {
      this.currentBlockIndex = newIndex;
    } else if (newIndex <= this.currentBlockIndex) {
      this.currentBlockIndex++;
    }

    return block;
  }

  /**
   * Replace current working block
   *
   * @param {object} options - replace options
   * @param {string} options.tool — plugin name
   * @param {BlockToolData} options.data — plugin data
   *
   * @returns {Block}
   */
  public replace({
    tool = this.config.defaultBlock,
    data = {},
  }): Block {
    return this.insert({
      tool,
      data,
      index: this.currentBlockIndex,
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
      block.call(BlockToolAPI.ON_PASTE, pasteEvent);
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
   *
   * @returns {Block} inserted Block
   */
  public insertDefaultBlockAtIndex(index: number, needToFocus = false): Block {
    const block = this.composeBlock({ tool: this.config.defaultBlock });

    this._blocks[index] = block;

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
   *
   * @returns {Promise} - the sequence that can be continued
   */
  public async mergeBlocks(targetBlock: Block, blockToMerge: Block): Promise<void> {
    const blockToMergeIndex = this._blocks.indexOf(blockToMerge);

    if (blockToMerge.isEmpty) {
      return;
    }

    const blockToMergeData = await blockToMerge.data;

    if (!_.isEmpty(blockToMergeData)) {
      await targetBlock.mergeWith(blockToMergeData);
    }

    this.removeBlock(blockToMergeIndex);
    this.currentBlockIndex = this._blocks.indexOf(targetBlock);
  }

  /**
   * Remove block with passed index or remove last
   *
   * @param {number|null} index - index of Block to remove
   * @throws {Error} if Block to remove is not found
   */
  public removeBlock(index = this.currentBlockIndex): void {
    /**
     * If index is not passed and there is no block selected, show a warning
     */
    if (!this.validateIndex(index)) {
      throw new Error('Can\'t find a Block to remove');
    }

    this._blocks.remove(index);

    if (this.currentBlockIndex >= index) {
      this.currentBlockIndex--;
    }

    /**
     * If first Block was removed, insert new Initial Block and set focus on it`s first input
     */
    if (!this.blocks.length) {
      this.currentBlockIndex = -1;
      this.insert();
    } else if (index === 0) {
      this.currentBlockIndex = 0;
    }
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

      this.removeBlock(index);
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

    this.currentBlockIndex = -1;
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
   * @param {number} index - index to get
   *
   * @returns {Block}
   */
  public getBlockByIndex(index): Block {
    return this._blocks[index];
  }

  /**
   * Get Block instance by html element
   *
   * @param {Node} element - html element to get Block by
   *
   * @returns {Block}
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
   * Remove selection from all Blocks then highlight only Current Block
   */
  public highlightCurrentNode(): void {
    /**
     * Remove previous selected Block's state
     */
    this.clearFocused();

    /**
     * Mark current Block as selected
     *
     * @type {boolean}
     */
    this.currentBlock.focused = true;
  }

  /**
   * Remove selection from all Blocks
   */
  public clearFocused(): void {
    this.blocks.forEach((block) => {
      block.focused = false;
    });
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
   *
   * @returns {Block}
   */
  public getBlockByChildNode(childNode: Node): Block {
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
   *
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
  }

  /**
   * Sets current Block Index -1 which means unknown
   * and clear highlightings
   */
  public dropPointer(): void {
    this.currentBlockIndex = -1;
    this.clearFocused();
  }

  /**
   * Clears Editor
   *
   * @param {boolean} needToAddDefaultBlock - 1) in internal calls (for example, in api.blocks.render)
   *                                             we don't need to add an empty default block
   *                                        2) in api.blocks.clear we should add empty block
   */
  public clear(needToAddDefaultBlock = false): void {
    this._blocks.removeAll();
    this.dropPointer();

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
      if (_.isFunction(block.tool.destroy)) {
        return block.tool.destroy();
      }
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
   *
   * @returns {boolean}
   */
  private validateIndex(index: number): boolean {
    return !(index < 0 || index >= this._blocks.length);
  }
}
