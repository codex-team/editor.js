/**
 * @class BlockManager
 * @classdesc Manage editor`s blocks storage and appearance
 *
 *
 */

import Block from '../block';
import Util from '../util';

module.exports = class BlockManager {

    /**
     * @constructor
     *
     * @param {EditorConfig} config
     */
    constructor({ config }) {

        this.config = config;
        this.Editor = null;
        this._blocks = null;
        this._currentBlcokIndex = -1;

    }

    /**
     * Editor modules setting
     *
     * @param Editor
     */
    set state(Editor) {

        this.Editor = Editor;

    }

    /**
     * Should be called after Editor.ui preparation
     * Define this._blocks property
     *
     * @returns {Promise}
     */
    prepare() {

        return new Promise(resolve => {

            let blocks = new Blocks(this.Editor.ui.nodes.redactor);

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
     * Insert new block into _blocks
     *
     * @param {String} toolName — plugin name
     * @param {Object} data — plugin data
     */
    insert(toolName, data) {

        let toolInstance = this.Editor.Tools.construct(toolName, data),
            block = new Block(toolInstance);

        this._blocks[++this._currentBlcokIndex] = block;

    }

    /**
     * Get Block instance by html element
     *
     * @todo get first level block before searching
     *
     * @param {HTMLElement} element
     * @returns {Block}
     */
    getBlock(element) {

        let nodes = this._blocks.nodes,
            index = nodes.indexOf(element);

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

        return this._blocks[this._currentBlcokIndex];

    }

    /**
     * Get working html element
     *
     * @return {HTMLElement}
     */
    get currentNode() {

        return this._blocks.nodes[this._currentBlcokIndex];

    }

    /**
     * Set _currentBlockIndex to passed block
     *
     * @todo get first level block before searching
     *
     * @param {HTMLElement} element
     */
    set currentNode(element) {

        let nodes = this._blocks.nodes;

        this._currentBlcokIndex = nodes.indexOf(element);

    }

    /**
     * Get array of Block instances
     *
     * @returns {Block[]} {@link Blocks#array}
     */
    get blocks() {

        return this._blocks.array;

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

        this._blocks = [];
        this.workingArea = workingArea;

    }

    /**
     * Push back new Block
     *
     * @param {Block} block
     */
    push(block) {

        this._blocks.push(block);
        this.workingArea.appendChild(block.html);

    }

    /**
     * Insert new Block at passed index
     *
     * @param {Number} index — index to insert Block
     * @param {Block} block — Block to insert
     */
    insert(index, block) {

        if (!this.length) {

            this.push(block);
            return;

        }

        if (index > this.length) {

            return;

        }

        this._blocks[index] = block;

        if (index > 0) {

            let previousBlock = this._blocks[index - 1];

            previousBlock.html.insertAdjacentElement('afterend', block.html);

        } else {

            let nextBlock = this._blocks[index + 1];

            nextBlock.html.insertAdjacentElement('beforebegin', block.html);

        }

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

        let index = this._blocks.indexOf(targetBlock);

        this.insert(index + 1, newBlock);

    }

    /**
     * Get Block by index
     *
     * @param {Number} index — Block index
     * @returns {Block}
     */
    get(index) {

        return this._blocks[index];

    }

    /**
     * Return index of passed Block
     *
     * @param {Block} block
     * @returns {Number}
     */
    indexOf(block) {

        return this._blocks.indexOf(block);

    }

    /**
     * Get length of Block instances array
     *
     * @returns {Number}
     */
    get length() {

        return this._blocks.length;

    }

    /**
     * Get Block instances array
     *
     * @returns {Block[]}
     */
    get array() {

        return this._blocks;

    }

    /**
     * Get blocks html elements array
     *
     * @returns {HTMLElement[]}
     */
    get nodes() {

        return Util.array(this.workingArea.children);

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