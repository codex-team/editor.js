/**
 * @class Caret
 * @classdesc Contains methods for working Caret
 *
 * Uses Range methods to manipulate with caret
 *
 * @module Caret
 *
 * @version 2.0.0
 */

/**
 * @typedef {Caret} Caret
 */
import Selection from '../Selection';

export default class Caret extends Module {

    /**
     * @constructor
     */
    constructor({config}) {

        super({config});

    }

    /**
     * Method gets Block instance and puts caret to the text node with offset
     * There two ways that method applies caret position:
     *   - first found text node: sets at the beginning, but you can pass an offset
     *   - last found text node: sets at the end of the node. Also, you can customize the behaviour
     *
     * @param {Block} block - Block class
     * @param {Number} offset - caret offset regarding to the text node
     * @param {Boolean} atEnd - put caret at the end of the text node or not
     */
    setToBlock(block, offset = 0, atEnd = false) {

        let element = block.pluginsContent;

        /** If Element is INPUT */
        if ($.isNativeInput(element)) {

            element.focus();
            return;

        }

        let nodeToSet = $.getDeepestNode(element, atEnd);

        if (atEnd || offset > nodeToSet.length) {

            offset = nodeToSet.length;

        }

        /** if found deepest node is native input */
        if ($.isNativeInput(nodeToSet)) {

            nodeToSet.focus();
            return;

        }

        /**
         * @todo try to fix via Promises or use querySelectorAll to not to use timeout
         */
        _.delay( () => this.set(nodeToSet, offset), 20)();

        this.Editor.BlockManager.currentNode = block.wrapper;

    }

    /**
     * Creates Document Range and sets caret to the element with offset
     * @param {Element} element - target node.
     * @param {Number} offset - offset
     */
    set( element, offset = 0) {

        let range     = document.createRange(),
            selection = Selection.get();

        range.setStart(element, offset);
        range.setEnd(element, offset);

        selection.removeAllRanges();
        selection.addRange(range);

    };

    /**
     * Set Caret to the last Block
     * If last block is not empty, append another empty block
     */
    setToTheLastBlock() {

        let lastBlock = this.Editor.BlockManager.lastBlock;

        if (!lastBlock) return;

        /**
         * If last block is empty and it is an initialBlock, set to that.
         * Otherwise, append new empty block and set to that
         */
        if (lastBlock.isEmpty) {

            this.setToBlock(lastBlock);

        } else {

            this.Editor.BlockManager.insert(this.config.initialBlock);

        }

    }

    /**
     * Extract fragment of content current block form caret position
     */
    extractFragmentFromCaretPosition() {

        let selection = Selection.get(),
            range = new Range();

        let cnt = this.Editor.BlockManager.currentBlock.pluginsContent,
            lastNode = $.getDeepestNode(cnt, true);

        range.setStart(selection.anchorNode, selection.getRangeAt(0).startOffset);
        range.setEnd(lastNode, lastNode.length);

        selection.removeAllRanges();
        selection.addRange(range);

        return range.extractContents();

    }

}