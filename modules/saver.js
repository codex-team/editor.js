/**
 * Codex Editor Saver
 *
 * @author Codex Team
 * @version 1.0.2
 */

module.exports = (function (saver) {

    let editor = codex.editor;

    /**
     * Saves blocks
     * @private
     */
    saver.saveBlocks = function () {

        /** Save html content of redactor to memory */
        editor.state.html = editor.nodes.redactor.innerHTML;

        /** Empty jsonOutput state */
        editor.state.jsonOutput = [];

        Promise.resolve()

            .then(function () {

                return editor.nodes.redactor.childNodes;

            })
            /** Making a sequence from separate blocks */
            .then(editor.saver.makeQueue)

            .then(function () {
                // editor.nodes.textarea.innerHTML = editor.state.html;
            })

            .catch( function (error) {

                editor.core.log(error);

            });

    };

    saver.makeQueue = function (blocks) {

        var queue = Promise.resolve();

        for(var index = 0; index < blocks.length; index++) {

            /** Add node to sequence at specified index */
            editor.saver.getBlockData(queue, blocks, index);

        }

    };

    /** Gets every block and makes From Data */
    saver.getBlockData = function (queue, blocks, index) {

        queue.then(function () {

            return editor.saver.getNodeAsync(blocks, index);

        })

            .then(editor.saver.makeFormDataFromBlocks);

    };


    /**
     * Asynchronously returns block data from blocksList by index
     * @return Promise to node
     */
    saver.getNodeAsync = function (blocksList, index) {

        return Promise.resolve().then(function () {

            return blocksList[index];

        });

    };

    saver.makeFormDataFromBlocks = function (block) {

        var pluginName = block.dataset.tool;

        /** Check for plugin existance */
        if (!editor.tools[pluginName]) {

            throw Error(`Plugin «${pluginName}» not found`);

        }

        /** Check for plugin having render method */
        if (typeof editor.tools[pluginName].save != 'function') {

            throw Error(`Plugin «${pluginName}» must have save method`);

        }

        /** Result saver */
        var blockContent   = block.childNodes[0],
            pluginsContent = blockContent.childNodes[0],
            savedData,
            position,
            output;

        /** If plugin wasn't available then return data from cache */
        if ( editor.tools[pluginName].available === false ) {

            position = pluginsContent.dataset.inputPosition;
            savedData = codex.editor.state.blocks.items[position].data;

        } else {

            savedData = editor.tools[pluginName].save(pluginsContent);

            if (editor.tools[pluginName].validate) {

                var result = editor.tools[pluginName].validate(savedData);

                /**
                 * Do not allow invalid data
                 */
                if (!result)
                    return;

            }

        }

        output = {
            type   : pluginName,
            data   : savedData
        };

        editor.state.jsonOutput.push(output);

    };

    return saver;

})({});