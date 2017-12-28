/**
 * @class BlockManager
 * @classdesc Manage editor`s blocks storage and appearance
 *
 * @module BlockManager
 */

import Block from '../block';
import Selection from '../Selection';

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
     *
     * @return {Block}
     */
    composeBlock(toolName, data) {

        let toolInstance = this.Editor.Tools.construct(toolName, data),
            block = new Block(toolName, toolInstance);

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

        /** contentNode click handler */
        block.wrapper.addEventListener('click', (event) => this.wrapperClicked(event), false);

        /** keydown on block */
        block.pluginsContent.addEventListener('keydown', (event) => this.keyDownOnBlock(event), false);

    }

    /**
     * Highlight clicked block
     * @param {MouseEvent} event
     */
    wrapperClicked(event) {

        this.setCurrentBlockByChildNode(event.target);

    }

    /**
     *
     * @param {MouseEvent} event
     */
    keyDownOnBlock(event) {

        switch(event.keyCode) {

            case _.keyCodes.ENTER:
                this.enterPressedOnPluginsContent(event);
                break;
            case _.keyCodes.DOWN:
            case _.keyCodes.RIGHT:
                this.blockRightOrDownArrowPressed();
                break;
            case _.keyCodes.UP:
            case _.keyCodes.LEFT:
                this.blockLeftOrUpArrowPressed();
                break;

        }

    }

    /**
     *
     */
    blockRightOrDownArrowPressed() {

        let currentBlock = this.currentBlock,
            lastTextNode = $.getDeepestTextNode(currentBlock.pluginsContent, true),
            textNodeLength = lastTextNode.length;

        console.log('here right');
        console.log(Selection.getSelectionAnchorNode());
        console.log(lastTextNode);

        if (Selection.getSelectionAnchorNode() !== lastTextNode) {

            return;

        }

        console.log(lastTextNode);
        if (Selection.getSelectionAnchorOffset() === textNodeLength) {

            let nextBlock = this.getNextBlock();

            if (!nextBlock) return;

            // this.currentNode = nextBlock.pluginsContent;
            this.Editor.Caret.set( nextBlock.pluginsContent );

        }

    }

    blockLeftOrUpArrowPressed() {

        let currentBlock = this.currentBlock,
            firstTextNode = $.getDeepestTextNode(currentBlock.pluginsContent, false),
            textNodeLength = firstTextNode.length;

        console.log('here left');
        console.log(Selection.getSelectionAnchorNode());
        console.log(firstTextNode);

        if (Selection.getSelectionAnchorNode() !== firstTextNode) {

            return;

        }

        if (Selection.getSelectionAnchorOffset() === 0) {

            let previousBlock = this.getPreviousBlock();

            if (!previousBlock) return;

            // this.currentNode = previousBlock.pluginsContent;
            this.Editor.Caret.set( previousBlock.pluginsContent, textNodeLength, true );

        }

    }

    /**
     * Insert new block into _blocks
     *
     * @param {String} toolName — plugin name
     * @param {Object} data — plugin data
     */
    insert(toolName, data = {}) {


        let block = this.composeBlock(toolName, data);

        this._blocks[++this.currentBlockIndex] = block;

        this.Editor.Caret.set(block.pluginsContent);

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
     *
     * @return {*}
     */
    getLastBlock() {

        return this._blocks[this._blocks.length - 1];

    }

    /**
     *
     * @param index
     * @return {*}
     */
    getBlockByIndex(index) {

        return this._blocks[index];

    }

    /**
     * Returns next Block instance
     * @return {*}
     */
    getNextBlock() {

        let isLastBlock = this.currentBlockIndex === (this._blocks.length - 1);

        if (isLastBlock) {

            return null;

        }

        return this._blocks[this.currentBlockIndex + 1];

    }

    /**
     * Returns previous Block instance
     */
    getPreviousBlock() {

        let isFirstBlock = this.currentBlockIndex === 0;

        if (isFirstBlock) {

            return null;

        }

        return this._blocks[this.currentBlockIndex - 1];

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

        return this._blocks[this.currentBlockIndex];

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
     *
     * @todo get first level block before searching
     *
     * @param {HTMLElement} element
     */
    set currentNode(element) {

        let nodes = this._blocks.nodes;

        /**
         * Update current Block's index
         * @type {number}
         */
        this.currentBlockIndex = nodes.indexOf(element);

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

}

class BlockMethods {



}

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