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
    this.Editor.Listeners.on(block.pluginsContent, 'keydown', (event) => this.Editor.Keyboard.blockKeydownsListener(event));
    this.Editor.Listeners.on(block.pluginsContent, 'mouseup', (event) => {
      this.Editor.InlineToolbar.handleShowingEvent(event);
    });
  }

  /**
   * Set's caret to the next Block
   * Before moving caret, we should check if caret position is at the end of Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   */
  navigateNext() {
    let caretAtEnd = this.Editor.Caret.isAtEnd;

    if (!caretAtEnd) {
      return;
    }

    let nextBlock = this.nextBlock;

    if (!nextBlock) {
      return;
    }

    this.Editor.Caret.setToBlock( nextBlock );
  }

  /**
   * Set's caret to the previous Block
   * Before moving caret, we should check if caret position is start of the Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {Boolean} force - force navigation
   */
  navigatePrevious(force = false) {
    let previousBlock = this.previousBlock;

    if (!previousBlock) {
      return;
    }

    if (force) {
      this.Editor.Caret.setToBlock( previousBlock, 0, true );
      return;
    }

    let caretAtStart = this.Editor.Caret.isAtStart;

    if (!caretAtStart) {
      return;
    }

    this.Editor.Caret.setToBlock( previousBlock, 0, true );
  }

  /**
   * Insert new block into _blocks
   *
   * @param {String} toolName — plugin name
   * @param {Object} data — plugin data
   * @param {Object} settings - default settings
   */
  insert(toolName, data = {}, settings = {}) {
    let block = this.composeBlock(toolName, data, settings);

    this._blocks[++this.currentBlockIndex] = block;
    this.Editor.Caret.setToBlock(block);
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

    this.insert(this.config.initialBlock, data);
  }

  /**
   * Replace current working block
   *
   * @param {String} toolName — plugin name
   * @param {Object} data — plugin data
   */
  replace(toolName, data = {}) {
    let block = this.composeBlock(toolName, data);

    this._blocks.insert(this.currentBlockIndex, block, true);
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
   * @param {HTMLElement} element
   */
  set currentNode(element) {
    let nodes = this._blocks.nodes,
      firstLevelBlock = element.closest(`.${Block.CSS.wrapper}`);

    /**
     * Update current Block's index
     * @type {number}
     */
    this.currentBlockIndex = nodes.indexOf(firstLevelBlock);

    /**
     * Remove previous selected Block's state
     */
    this._blocks.array.forEach( block => block.selected = false);

    /**
     * Mark current Block as selected
     * @type {boolean}
     */
    this.currentBlock.selected = true;
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
    this.workingArea.appendChild(block.html);
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
      this.blocks[index].html.remove();
    }

    let deleteCount = replace ? 1 : 0;

    this.blocks.splice(index, deleteCount, block);

    if (index > 0) {
      let previousBlock = this.blocks[index - 1];

      previousBlock.html.insertAdjacentElement('afterend', block.html);
    } else {
      let nextBlock = this.blocks[index + 1];

      if (nextBlock) {
        nextBlock.html.insertAdjacentElement('beforebegin', block.html);
      } else {
        this.workingArea.appendChild(block.html);
      }
    }
  }

  /**
   * Remove block
   * @param {Number|null} index
   */
  remove(index) {
    if (!index) {
      index = this.length - 1;
    }

    this.blocks[index].html.remove();
    this.blocks.splice(index, 1);
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
