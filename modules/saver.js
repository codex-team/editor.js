var codex = require('../editor');

var saver = (function(saver) {

    /**
     * Saves blocks
     * @private
     */
    saver.saveBlocks = function () {

        /** Save html content of redactor to memory */
        codex.state.html = codex.nodes.redactor.innerHTML;

        /** Empty jsonOutput state */
        codex.state.jsonOutput = [];

        Promise.resolve()

            .then(function() {
                return codex.nodes.redactor.childNodes;
            })
            /** Making a sequence from separate blocks */
            .then(codex.saver.makeQueue)

            .then(function() {
                // codex.nodes.textarea.innerHTML = codex.state.html;
            })

            .catch( function(error) {
                console.log('Something happend');
            });

    };

    saver.makeQueue = function(blocks) {

        var queue = Promise.resolve();

        for(var index = 0; index < blocks.length; index++) {

            /** Add node to sequence at specified index */
            codex.saver.getBlockData(queue, blocks, index);

        }

    };

    /** Gets every block and makes From Data */
    saver.getBlockData = function(queue, blocks, index) {

        queue.then(function() {
            return codex.saver.getNodeAsync(blocks, index);
        })

            .then(codex.saver.makeFormDataFromBlocks);

    };


    /**
     * Asynchronously returns block data from blocksList by index
     * @return Promise to node
     */
    saver.getNodeAsync = function (blocksList, index) {

        return Promise.resolve().then(function() {

            return blocksList[index];

        });
    };

    saver.makeFormDataFromBlocks = function(block) {

        var pluginName = block.dataset.tool;

        /** Check for plugin existance */
        if (!codex.tools[pluginName]) {
            throw Error(`Plugin «${pluginName}» not found`);
        }

        /** Check for plugin having render method */
        if (typeof codex.tools[pluginName].save != 'function') {

            throw Error(`Plugin «${pluginName}» must have save method`);
        }

        /** Result saver */
        var blockContent   = block.childNodes[0],
            pluginsContent = blockContent.childNodes[0],
            savedData      = codex.tools[pluginName].save(pluginsContent),
            output;


        output = {
            type: pluginName,
            data: savedData
        };

        /** Marks Blocks that will be in main page */
        output.cover = block.classList.contains(codex.ui.className.BLOCK_IN_FEED_MODE);

        codex.state.jsonOutput.push(output);
    };

    return saver;

})({});

codex.saver = saver;
module.exports = saver;