/**
 * Methods for parsing JSON reactor data to HTML blocks
 *
 * @author Codex Team
 * @version 1.0.0
 *
 *
 */


var renderer = (function() {

    /**
     * @protected
     *
     * Asyncronously parses input JSON to redactor blocks
     */
    var makeBlocksFromData = function () {

        /**
         * If redactor is empty, add first paragraph to start writing
         */
        if (!cEditor.state.blocks.items.length) {

            cEditor.ui.addInitialBlock();
            return;

        }

        Promise.resolve()

        /**
         * First, get JSON from state
         */
            .then(function() {
                return cEditor.state.blocks;
            })

            /** Then, start to iterate they */
            .then(cEditor.renderer.appendBlocks)

            /** Write log if something goes wrong */
            .catch(function(error) {
                cEditor.core.log('Error while parsing JSON: %o', 'error', error);
            });

    };

    /**
     * @private
     *
     * Parses JSON to blocks
     * @param {object} data
     * @return Primise -> nodeList
     */
    var appendBlocks = function (data) {

        var blocks = data.items;

        /**
         * Sequence of one-by-one blocks appending
         * Uses to save blocks order after async-handler
         */
        var nodeSequence = Promise.resolve();

        for (var index = 0; index < blocks.length ; index++ ) {

            /** Add node to sequence at specified index */
            cEditor.renderer.appendNodeAtIndex(nodeSequence, blocks, index);

        }

    };

    /**
     * @private
     *
     * Append node at specified index
     */
    var appendNodeAtIndex = function (nodeSequence, blocks, index) {

        /** We need to append node to sequence */
        nodeSequence

        /** first, get node async-aware */
            .then(function() {

                return cEditor.renderer.getNodeAsync(blocks , index);

            })

            /**
             * second, compose editor-block from JSON object
             */
            .then(cEditor.renderer.createBlockFromData)

            /**
             * now insert block to redactor
             */
            .then(function(blockData){

                /**
                 * blockData has 'block', 'type' and 'stretched' information
                 */
                cEditor.content.insertBlock(blockData);

                /** Pass created block to next step */
                return blockData.block;

            })

            /** Log if something wrong with node */
            .catch(function(error) {
                cEditor.core.log('Node skipped while parsing because %o', 'error', error);
            });

    };

    /**
     * @private
     *
     * Asynchronously returns block data from blocksList by index
     * @return Promise to node
     */
    var getNodeAsync = function (blocksList, index) {

        return Promise.resolve().then(function() {

            return blocksList[index];

        });
    };

    /**
     * @private
     *
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
    var createBlockFromData = function (blockData) {

        /** New parser */
        var pluginName = blockData.type;

        /** Check for plugin existance */
        if (!cEditor.tools[pluginName]) {
            throw Error(`Plugin «${pluginName}» not found`);
        }

        /** Check for plugin having render method */
        if (typeof cEditor.tools[pluginName].render != 'function') {

            throw Error(`Plugin «${pluginName}» must have «render» method`);
        }

        /** New Parser */
        var block = cEditor.tools[pluginName].render(blockData.data);

        /** is first-level block stretched */
        var stretched = cEditor.tools[pluginName].isStretched || false;

        /** Retrun type and block */
        return {
            type      : pluginName,
            block     : block,
            stretched : stretched
        };

    };


    return {
        makeBlocksFromData  : makeBlocksFromData,
        appendBlocks        : appendBlocks,
        appendNodeAtIndex   : appendNodeAtIndex,
        getNodeAsync        : getNodeAsync,
        createBlockFromData : createBlockFromData
    };

})();

module.exports = renderer;