/**
 * Codex Editor Renderer Module
 *
 * @author Codex Team
 * @version 1.0
 */

let editor = codex.editor;

module.exports = (function (renderer) {

    /**
     * Asyncronously parses input JSON to redactor blocks
     */
    renderer.makeBlocksFromData = function () {

        /**
         * If redactor is empty, add first paragraph to start writing
         */
        if (!editor.state.blocks.items.length) {

            editor.ui.addInitialBlock();
            return;

        }

        Promise.resolve()

        /** First, get JSON from state */
            .then(function () {

                return editor.state.blocks;

            })

            /** Then, start to iterate they */
            .then(editor.renderer.appendBlocks)

            /** Write log if something goes wrong */
            .catch(function (error) {

                editor.core.log('Error while parsing JSON: %o', 'error', error);

            });

    };

    /**
     * Parses JSON to blocks
     * @param {object} data
     * @return Primise -> nodeList
     */
    renderer.appendBlocks = function (data) {

        var blocks = data.items;

        /**
         * Sequence of one-by-one blocks appending
         * Uses to save blocks order after async-handler
         */
        var nodeSequence = Promise.resolve();

        for (var index = 0; index < blocks.length ; index++ ) {

            /** Add node to sequence at specified index */
            editor.renderer.appendNodeAtIndex(nodeSequence, blocks, index);

        }

    };

    /**
     * Append node at specified index
     */
    renderer.appendNodeAtIndex = function (nodeSequence, blocks, index) {

        /** We need to append node to sequence */
        nodeSequence

        /** first, get node async-aware */
            .then(function () {

                return editor.renderer.getNodeAsync(blocks, index);

            })

            /**
             * second, compose editor-block from JSON object
             */
            .then(editor.renderer.createBlockFromData)

            /**
             * now insert block to redactor
             */
            .then(function (blockData) {

                /**
                 * blockData has 'block', 'type' and 'stretched' information
                 */
                editor.content.insertBlock(blockData);

                /** Pass created block to next step */
                return blockData.block;

            })

            /** Log if something wrong with node */
            .catch(function (error) {

                editor.core.log('Node skipped while parsing because %o', 'error', error);

            });

    };

    /**
     * Asynchronously returns block data from blocksList by index
     * @return Promise to node
     */
    renderer.getNodeAsync = function (blocksList, index) {

        return Promise.resolve().then(function () {

            return blocksList[index];

        });

    };

    /**
     * Creates editor block by JSON-data
     *
     * @uses render method of each plugin
     *
     * @param {object} blockData looks like
     *                            { header : {
     *                                            text: '',
     *                                            type: 'H3', ...
     *                                        }
     *                            }
     * @return {object} with type and Element
     */
    renderer.createBlockFromData = function (blockData) {

        /** New parser */
        var pluginName = blockData.type,
            cover      = blockData.cover;

        /** Get first key of object that stores plugin name */
        // for (var pluginName in blockData) break;

        /** Check for plugin existance */
        if (!editor.tools[pluginName]) {

            throw Error(`Plugin «${pluginName}» not found`);

        }

        /** Check for plugin having render method */
        if (typeof editor.tools[pluginName].render != 'function') {

            throw Error(`Plugin «${pluginName}» must have «render» method`);

        }

        /** New Parser */
        var block = editor.tools[pluginName].render(blockData.data);

        /** is first-level block stretched */
        var stretched = editor.tools[pluginName].isStretched || false;

        /** Retrun type and block */
        return {
            type      : pluginName,
            block     : block,
            stretched : stretched,
            cover     : cover
        };

    };

    renderer.rerender = function (clear) {

        editor.nodes.redactor.innerHTML = '';

        editor.content.currentNode = null;

        if (clear) {

            editor.ui.addInitialBlock();
            return;

        }

        renderer.makeBlocksFromData();

    };

    return renderer;

})({});