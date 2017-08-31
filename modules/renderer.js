/**
 * Codex Editor Renderer Module
 *
 * @author Codex Team
 * @version 1.0
 */

module.exports = (function () {

    let renderer = {};

    let editor = this;

    /**
     * Asyncronously parses input JSON to redactor blocks
     */
    renderer.makeBlocksFromData = function () {

        /**
         * If redactor is empty, add first paragraph to start writing
         */
        if (editor.modules.core.isEmpty(editor.state.blocks) || !editor.state.blocks.items.length) {

            editor.modules.ui.addInitialBlock();
            return;

        }

        return renderer.appendBlocks(editor.state.blocks)
            /** Write log if something goes wrong */
            .catch(function (error) {

                editor.modules.core.log('Error while parsing JSON: %o', 'error', error);

            });

    };

    /**
     * Parses JSON to blocks
     * @param {object} data
     * @return Primise -> nodeList
     */
    renderer.appendBlocks = function (data) {

        let blocksData = data.items;

        /**
         * Sequence of one-by-one blocks appending
         * Uses to save blocks order after async-handler
         */
        var blocks = [];

        for (var index = 0; index < blocksData.length ; index++ ) {

            blocks.push(Promise.resolve(blocksData[index])
              .then(makeBlockFromData));

        }

        return Promise.all(blocks)
          .then(elements => {

              elements.forEach(element => {

                  editor.modules.content.insertBlock({
                      block: element,
                      type: element.tool.name
                  });

              });

          });

    };

    /**
     * Append node at specified index
     */
    renderer.appendNodeAtIndex = function (nodeSequence, blocks, index) {

        /** We need to append node to sequence */
        nodeSequence

        /** first, get node async-aware */
            .then(function () {

                return editor.modules.renderer.getNodeAsync(blocks, index);

            })

            /**
             * second, compose editor-block from JSON object
             */
            .then(editor.modules.renderer.createBlockFromData)

            /**
             * now insert block to redactor
             */
            .then(function (blockData) {

                /**
                 * blockData has 'block', 'type' and 'stretched' information
                 */
                editor.modules.content.insertBlock(blockData);

                /** Pass created block to next step */
                return blockData.block;

            })

            /** Log if something wrong with node */
            .catch(function (error) {

                editor.modules.core.log('Node skipped while parsing because %o', 'error', error);

            });

    };

    /**
     * Creates editor block by JSON-data
     *
     * @uses render method of each plugin
     *
     * @param {Object} toolData.tool
     *                              { header : {
     *                                                text: '',
     *                                                type: 'H3', ...
     *                                            }
     *                               }
     * @param {Number} toolData.position - index in input-blocks array
     * @return {Object} with type and Element
     */
    renderer.createBlockFromData = function ( toolData ) {

        /** New parser */
        var block,
            tool = toolData.tool,
            pluginName = tool.type;

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

        if ( editor.tools[pluginName].available === false ) {

            block = editor.modules.draw.unavailableBlock();

            block.innerHTML = editor.tools[pluginName].loadingMessage;

            /**
            * Saver will extract data from initial block data by position in array
            */
            block.dataset.inputPosition = toolData.position;

        } else {

            /** New Parser */
            block = editor.tools[pluginName].render(tool.data);

        }

        /** is first-level block stretched */
        var stretched = editor.tools[pluginName].isStretched || false;

        /** Retrun type and block */
        return {
            type      : pluginName,
            block     : block,
            stretched : stretched
        };

    };

    function makeBlockFromData(blockData) {

        let toolName = blockData.type,
            data = blockData.data;

        if (!editor.tools[toolName]) {

            // throw Error(`Plugin «${toolName}» not found`);
            return;

        }

        let tool = editor.tools[toolName];

        let toolInstance = tool.instance();

        if (typeof toolInstance.render != 'function') {

            // throw Error(`Plugin «${toolName}» must have «render» method`);
            return;

        }

        let DOMElement = toolInstance.render(data);

        DOMElement.tool = toolInstance;

        return DOMElement;

    }

    renderer.makeBlockFromData = makeBlockFromData;

    return renderer;

});