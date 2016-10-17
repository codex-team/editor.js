/**
 * Methods for saving HTML blocks to JSON object
 *
 * @author Codex Team
 * @version 1.0.0
 */

var saver = (function() {

    /**
     * @private
     *
     * Saves blocks
     */
    var saveBlocks = function () {

        /** Save html content of redactor to memory */
        cEditor.state.html = cEditor.nodes.redactor.innerHTML;

        /** Empty jsonOutput state */
        cEditor.state.jsonOutput = [];

        Promise.resolve()

            .then(function() {
                return cEditor.nodes.redactor.childNodes;
            })
            /** Making a sequence from separate blocks */
            .then(cEditor.saver.makeQueue)

            .then(function() {
                // cEditor.nodes.textarea.innerHTML = cEditor.state.html;
            })

            .catch( function(error) {
                console.log('Something happend');
            });

    };

    /**
     * @private
     *
     * Makes Queue
     * @param blocks
     */
    var makeQueue = function(blocks) {

        var queue = Promise.resolve();

        for(var index = 0; index < blocks.length; index++) {

            /** Add node to sequence at specified index */
            cEditor.saver.getBlockData(queue, blocks, index);

        }

    };


    /**
     * @private
     *
     * Gets every block and makes From Data
     */
    var getBlockData = function(queue, blocks, index) {

        queue.then(function() {
            return cEditor.saver.getNodeAsync(blocks, index);
        })

            .then(cEditor.saver.makeFormDataFromBlocks);

    };

    /**
     * @protected
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
     * @param block
     */
    var makeFormDataFromBlocks = function(block) {

        var pluginName = block.dataset.type;

        /** Check for plugin existance */
        if (!cEditor.tools[pluginName]) {
            throw Error(`Plugin «${pluginName}» not found`);
        }

        /** Check for plugin having render method */
        if (typeof cEditor.tools[pluginName].save != 'function') {

            throw Error(`Plugin «${pluginName}» must have save method`);
        }

        /** Result saver */
        var blockContent = block.childNodes,
            savedData    = cEditor.tools[pluginName].save(blockContent);

        cEditor.state.jsonOutput.push(savedData);
    };

    return {
        saveBlocks              : saveBlocks,
        makeQueue               : makeQueue,
        getBlockData            : getBlockData,
        getNodeAsync            : getNodeAsync,
        makeFormDataFromBlocks  : makeFormDataFromBlocks
    };

})();

module.exports = saver;