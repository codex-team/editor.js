/**
 * @class BlockManager
 * @classdesc Manage editor`s blocks storage and appearance
 *
 * @module BlockManager
 *
 * @version 2.0.0
 */

import Block from '../block';

/**
 * @typedef {BlockManager} BlockManager
 * @property {Number} currentBlockIndex - Index of current working block
 * @property {Proxy} _blocks - Proxy for Blocks instance {@link Blocks}
 */
export default class BlockManager extends Module {
  /**
   * @constructor
   * @param {EditorConfig} config
   */
  constructor({config}) {
    super({config});

    /**
     * Proxy for Blocks instance {@link Blocks}
     *
     * @type {Proxy}
     * @private
     */
    this._blocks = null;

    /**
     * Index of current working block
     *
     * @type {number}
     * @private
     */
    this.currentBlockIndex = -1;
  }

  /**
   * Should be called after Editor.UI preparation
   * Define this._blocks property
   *
   * @returns {Promise}
   */
  prepare() {
    return new Promise(resolve => {
      let blocks = new Blocks(this.Editor.UI.nodes.redactor);

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
        get: Blocks.get
      });

      resolve();
    });
  }

  /**
   * Creates Block instance by tool name
   *
   * @param {String} toolName - tools passed in editor config {@link EditorConfig#tools}
   * @param {Object} data - constructor params
   * @param {Object} settings - block settings
   *
   * @return {Block}
   */
  composeBlock(toolName, data, settings) {
    let toolInstance = this.Editor.Tools.construct(toolName, data),
      block = new Block(toolName, toolInstance, settings, this.Editor.API.methods);

    this.bindEvents(block);
    /**
     * Apply callback before inserting html
     */
    block.call('appendCallback', {});

    return block;
  }

  /**
   * Bind Events
   * @param {Object} block
   */
  bindEvents(block) {
    this.Editor.Listeners.on(block.holder, 'keydown', (event) => this.Editor.BlockEvents.keydown(event));
    this.Editor.Listeners.on(block.holder, 'mouseup', (event) => this.Editor.BlockEvents.mouseUp(event));
    this.Editor.Listeners.on(block.holder, 'keyup', (event) => this.Editor.BlockEvents.keyup(event));
  }

  /**
   * Insert new block into _blocks
   *
   * @param {String} toolName — plugin name, by default method inserts initial block type
   * @param {Object} data — plugin data
   * @param {Object} settings - default settings
   *
   * @return {Block}
   */
  insert(toolName = this.config.initialBlock, data = {}, settings = {}) {
    let block = this.composeBlock(toolName, data, settings);

    this._blocks[++this.currentBlockIndex] = block;
    return block;
  }

  /**
   * Always inserts at the end
   * @return {Block}
   */
  insertAtEnd() {
    /**
     * Define new value for current block index
     */
    this.currentBlockIndex = this.blocks.length - 1;

    /**
     * Insert initial typed block
     */
    return this.insert();
  }

  /**
   * Merge two blocks
   * @param {Block} targetBlock - previous block will be append to this block
   * @param {Block} blockToMerge - block that will be merged with target block
   *
   * @return {Promise} - the sequence that can be continued
   */
  mergeBlocks(targetBlock, blockToMerge) {
    let blockToMergeIndex = this._blocks.indexOf(blockToMerge);

    return Promise.resolve()
      .then( () => {
        if (blockToMerge.isEmpty) {
          return;
        }

        return blockToMerge.data
          .then((blockToMergeInfo) => {
            targetBlock.mergeWith(blockToMergeInfo.data);
          });
      })
      .then( () => {
        this.removeBlock(blockToMergeIndex);
        this.currentBlockIndex = this._blocks.indexOf(targetBlock);
      });
  }

  /**
   * Remove block with passed index or remove last
   * @param {Number|null} index
   */
  removeBlock(index) {
    if (!index) {
      index = this.currentBlockIndex;
    }
    this._blocks.remove(index);
  }

  /**
   * Split current Block
   * 1. Extract content from Caret position to the Block`s end
   * 2. Insert a new Block below current one with extracted content
   *
   * @return {Block}
   */
  split() {
    let extractedFragment = this.Editor.Caret.extractFragmentFromCaretPosition(),
      wrapper = $.make('div');

    wrapper.append(extractedFragment);

    /**
     * @todo make object in accordance with Tool
     */
    let data = {
      text: $.isEmpty(wrapper) ? '' : wrapper.innerHTML,
    };

    /**
     * Renew current Block
     * @type {Block}
     */
    return this.insert(this.config.initialBlock, data);
  }

  /**
   * Replace current working block
   *
   * @param {String} toolName — plugin name
   * @param {Object} data — plugin data
   *
   * @return {Block}
   */
  replace(toolName, data = {}) {
    let block = this.composeBlock(toolName, data);

    this._blocks.insert(this.currentBlockIndex, block, true);

    return block;
  }

  /**
   * returns last Block
   * @return {Block}
   */
  get lastBlock() {
    return this._blocks[this._blocks.length - 1];
  }

  /**
   * Returns Block by passed index
   * @param {Number} index
   * @return {Block}
   */
  getBlockByIndex(index) {
    return this._blocks[index];
  }

  /**
   * Get Block instance by html element
   * @param {Node} element
   * @returns {Block}
   */
  getBlock(element) {
    if (!$.isElement(element)) {
      element = element.parentNode;
    }

    let nodes = this._blocks.nodes,
      firstLevelBlock = element.closest(`.${Block.CSS.wrapper}`),
      index = nodes.indexOf(firstLevelBlock);

    if (index >= 0) {
      return this._blocks[index];
    }
  }

  /**
   * Get current Block instance
   *
   * @return {Block}
   */
  get currentBlock() {
    return this._blocks[this.currentBlockIndex];
  }

  /**
   * Returns next Block instance
   * @return {Block|null}
   */
  get nextBlock() {
    let isLastBlock = this.currentBlockIndex === (this._blocks.length - 1);

    if (isLastBlock) {
      return null;
    }

    return this._blocks[this.currentBlockIndex + 1];
  }

  /**
   * Returns previous Block instance
   * @return {Block|null}
   */
  get previousBlock() {
    let isFirstBlock = this.currentBlockIndex === 0;

    if (isFirstBlock) {
      return null;
    }

    return this._blocks[this.currentBlockIndex - 1];
  }

  /**
   * Get working html element
   *
   * @return {HTMLElement}
   */
  get currentNode() {
    return this._blocks.nodes[this.currentBlockIndex];
  }

  /**
   * Set currentBlockIndex to passed block
   * @param {Node} element
   */
  set currentNode(element) {
    if (!$.isElement(element)) {
      element = element.parentNode;
    }

    let nodes = this._blocks.nodes,
      firstLevelBlock = element.closest(`.${Block.CSS.wrapper}`);

    if (!firstLevelBlock) {
      throw Error('Passed element is not a Block.');
    }


    /**
     * Update current Block's index
     * @type {number}
     */
    this.currentBlockIndex = nodes.indexOf(firstLevelBlock);
  }

  /**
   * Remove selection from all Blocks then highlight only Current Block
   */
  highlightCurrentNode() {
    /**
     * Remove previous selected Block's state
     */
    this.clearHighlightings();

    /**
     * Mark current Block as selected
     * @type {boolean}
     */
    this.currentBlock.selected = true;
  }

  /**
   * Remove selection from all Blocks
   */
  clearHighlightings() {
    this.blocks.forEach( block => block.selected = false);
  }

  /**
   * Get array of Block instances
   *
   * @returns {Block[]} {@link Blocks#array}
   */
  get blocks() {
    return this._blocks.array;
  }

  /**
   * 1) Find first-level Block from passed child Node
   * 2) Mark it as current
   *
   *  @param {Element|Text} childNode - look ahead from this node.
   *  @throws Error  - when passed Node is not included at the Block
   */
  setCurrentBlockByChildNode(childNode) {
    /**
     * If node is Text TextNode
     */
    if (!$.isElement(childNode)) {
      childNode = childNode.parentNode;
    }

    let parentFirstLevelBlock = childNode.closest(`.${Block.CSS.wrapper}`);

    if (parentFirstLevelBlock) {
      this.currentNode = parentFirstLevelBlock;
    } else {
      throw new Error('Can not find a Block from this child Node');
    }
  }

  /**
   * Swap Blocks Position
   * @param {Number} fromIndex
   * @param {Number} toIndex
   */
  swap(fromIndex, toIndex) {
    /** Move up current Block */
    this._blocks.swap(fromIndex, toIndex);

    /** Now actual block moved up so that current block index decreased */
    this.currentBlockIndex = toIndex;
  }

  /**
   * Sets current Block Index -1 which means unknown
   * and clear highlightings
   */
  dropPointer() {
    this.currentBlockIndex = -1;
    this.clearHighlightings();
  }

  /**
   * Clears Editor
   * @param {boolean} needAddInitialBlock - 1) in internal calls (for example, in api.blocks.render)
   *                                        we don't need to add empty initial block
   *                                        2) in api.blocks.clear we should add empty block
   */
  clear(needAddInitialBlock = false) {
    this._blocks.removeAll();
    this.dropPointer();

    if (needAddInitialBlock) {
      this.insert(this.config.initialBlock);
    }
  }
};

/**
 * @class Blocks
 * @classdesc Class to work with Block instances array
 *
 * @private
 *
 * @property {HTMLElement} workingArea — editor`s working node
 *
 */
class Blocks {
  /**
   * @constructor
   *
   * @param {HTMLElement} workingArea — editor`s working node
   */
  constructor(workingArea) {
    this.blocks = [];
    this.workingArea = workingArea;
  }

  /**
   * Push back new Block
   *
   * @param {Block} block
   */
  push(block) {
    this.blocks.push(block);
    this.workingArea.appendChild(block.holder);
  }

  /**
   * Swaps blocks with indexes first and second
   * @param {Number} first - first block index
   * @param {Number} second - second block index
   */
  swap(first, second) {
    let secondBlock = this.blocks[second];

    /**
     * Change in DOM
     */
    $.swap(this.blocks[first].holder, secondBlock.holder);

    /**
     * Change in array
     */
    this.blocks[second] = this.blocks[first];
    this.blocks[first] = secondBlock;
  }

  /**
   * Insert new Block at passed index
   *
   * @param {Number} index — index to insert Block
   * @param {Block} block — Block to insert
   * @param {Boolean} replace — it true, replace block on given index
   */
  insert(index, block, replace = false) {
    if (!this.length) {
      this.push(block);
      return;
    }

    if (index > this.length) {
      index = this.length;
    }

    if (replace) {
      this.blocks[index].holder.remove();
    }

    let deleteCount = replace ? 1 : 0;

    this.blocks.splice(index, deleteCount, block);

    if (index > 0) {
      let previousBlock = this.blocks[index - 1];

      previousBlock.holder.insertAdjacentElement('afterend', block.holder);
    } else {
      let nextBlock = this.blocks[index + 1];

      if (nextBlock) {
        nextBlock.holder.insertAdjacentElement('beforebegin', block.holder);
      } else {
        this.workingArea.appendChild(block.holder);
      }
    }
  }

  /**
   * Remove block
   * @param {Number|null} index
   */
  remove(index) {
    if (isNaN(index)) {
      index = this.length - 1;
    }

    this.blocks[index].holder.remove();
    this.blocks.splice(index, 1);
  }

  /**
   * Remove all blocks
   */
  removeAll() {
    this.workingArea.innerHTML = '';
    this.blocks.length = 0;
  }

  /**
   * Insert Block after passed target
   *
   * @todo decide if this method is necessary
   *
   * @param {Block} targetBlock — target after wich Block should be inserted
   * @param {Block} newBlock — Block to insert
   */
  insertAfter(targetBlock, newBlock) {
    let index = this.blocks.indexOf(targetBlock);

    this.insert(index + 1, newBlock);
  }

  /**
   * Get Block by index
   *
   * @param {Number} index — Block index
   * @returns {Block}
   */
  get(index) {
    return this.blocks[index];
  }

  /**
   * Return index of passed Block
   *
   * @param {Block} block
   * @returns {Number}
   */
  indexOf(block) {
    return this.blocks.indexOf(block);
  }

  /**
   * Get length of Block instances array
   *
   * @returns {Number}
   */
  get length() {
    return this.blocks.length;
  }

  /**
   * Get Block instances array
   *
   * @returns {Block[]}
   */
  get array() {
    return this.blocks;
  }

  /**
   * Get blocks html elements array
   *
   * @returns {HTMLElement[]}
   */
  get nodes() {
    return _.array(this.workingArea.children);
  }

  /**
   * Proxy trap to implement array-like setter
   *
   * @example
   * blocks[0] = new Block(...)
   *
   * @param {Blocks} instance — Blocks instance
   * @param {Number|String} index — block index
   * @param {Block} block — Block to set
   * @returns {Boolean}
   */
  static set(instance, index, block) {
    if (isNaN(Number(index))) {
      return false;
    }

    instance.insert(index, block);

    return true;
  }

  /**
   * Proxy trap to implement array-like getter
   *
   * @param {Blocks} instance — Blocks instance
   * @param {Number|String} index — Block index
   * @returns {Block|*}
   */
  static get(instance, index) {
    if (isNaN(Number(index))) {
      return instance[index];
    }

    return instance.get(index);
  }
}
