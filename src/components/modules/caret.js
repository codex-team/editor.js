/**
 * @class Caret
 * @classdesc Contains methods for working Caret
 *
 * @typedef {Caret} Caret
 */
export default class Caret extends Module {

    /**
     * @constructor
     */
    constructor({config}) {

        super(config);

    }

    /**
     * Set Caret to the last Block
     *
     * If last block is not empty, append another empty block
     */
    setToTheLastBlock() {

        let blocks = this.Editor.BlockManager.blocks,
            lastBlock;

        if (blocks.length) {

            lastBlock = blocks[blocks.length - 1];

        }

        /**
         * If last block is empty and it is an initialBlock, set to that.
         * Otherwise, append new empty block and set to that
         */
        if (lastBlock.isEmpty) {

            this.set(lastBlock.html);

        } else {

            this.Editor.BlockManager.insert(this.config.initialBlock);

        }


        /**
         //      * If inputs in redactor does not exits, then we put input index 0 not -1
         //      */
        //     var indexOfLastInput = editor.state.inputs.length > 0 ? editor.state.inputs.length - 1 : 0;
        //
        //     /** If we have any inputs */
        //     if (editor.state.inputs.length) {
        //
        //         /** getting firstlevel parent of input */
        //         firstLevelBlock = editor.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);
        //
        //     }
        //
        //     /** If input is empty, then we set caret to the last input */
        //     if (editor.state.inputs.length && editor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == editor.settings.initialBlockPlugin) {
        //
        //         editor.caret.setToBlock(indexOfLastInput);
        //
        //     } else {
        //
        //         /** Create new input when caret clicked in redactors area */
        //         var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
        //
        //         editor.content.insertBlock({
        //             type  : NEW_BLOCK_TYPE,
        //             block : editor.tools[NEW_BLOCK_TYPE].render()
        //         });
        //
        //         /** If there is no inputs except inserted */
        //         if (editor.state.inputs.length === 1) {
        //
        //             editor.caret.setToBlock(indexOfLastInput);
        //
        //         } else {
        //
        //             /** Set caret to this appended input */
        //             editor.caret.setToNextBlock(indexOfLastInput);
        //
        //         }
        //
        //     }

    }

    /**
     * Set caret to the passed Node
     * @param {Element} node - content-editable Element
     */
    set(node) {

        /**
         * @todo add working with Selection
         * tmp: work with textContent
         */

        node.textContent += '|';

    }


}