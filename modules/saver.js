/**
 * Codex Editor Saver
 *
 * @author Codex Team
 * @version 1.1.0
 */

module.exports = (function (saver) {

    let editor = codex.editor;

    /**
     * @public
     * Save blocks
     */
    saver.save = function () {

        /** Save html content of redactor to memory */
        editor.state.html = editor.nodes.redactor.innerHTML;

        /** Clean jsonOutput state */
        editor.state.jsonOutput = [];

        return saveBlocks(editor.nodes.redactor.childNodes);

    };

    /**
     * @private
     * Save each block data
     *
     * @param blocks
     * @returns {Promise.<TResult>}
     */
    let saveBlocks = function (blocks) {

        let data = [];

        for(let index = 0; index < blocks.length; index++) {

            /** Add node to sequence at specified index */
            data.push(getBlockData(blocks[index]));

        }

        return Promise.all(data)
            .then(makeOutput)
            .catch(editor.core.log);

    };

    /** Save and validate block data */
    let getBlockData = function (block) {

        return saveBlockData(block)
          .then(validateBlockData)
          .catch(editor.core.log);

    };

   /**
    * @private
    * Call block`s plugin save method and return saved data
    *
    * @param block
    * @returns {Object}
    */
    let saveBlockData = function (block) {

        let pluginName = block.dataset.tool;

        /** Check for plugin existence */
        if (!editor.tools[pluginName]) {

            editor.core.log(`Plugin «${pluginName}» not found`, 'error');
            return {data: null, pluginName: null};

        }

        /** Check for plugin having save method */
        if (typeof editor.tools[pluginName].save !== 'function') {

            editor.core.log(`Plugin «${pluginName}» must have save method`, 'error');
            return {data: null, pluginName: null};

        }

        /** Result saver */
        let blockContent   = block.childNodes[0],
            pluginsContent = blockContent.childNodes[0],
            position = pluginsContent.dataset.inputPosition;

        /** If plugin wasn't available then return data from cache */
        if ( editor.tools[pluginName].available === false ) {

            return Promise.resolve({data: codex.editor.state.blocks.items[position].data, pluginName});

        }

        return Promise.resolve(pluginsContent)
            .then(editor.tools[pluginName].save)
            .then(data => Object({data, pluginName}));

    };

   /**
    * Call plugin`s validate method. Return false if validation failed
    *
    * @param data
    * @param pluginName
    * @returns {Object|Boolean}
    */
    let validateBlockData = function ({data, pluginName}) {

        if (!data && !pluginName) {

            return false;

        }

        if (editor.tools[pluginName].validate) {

            let result = editor.tools[pluginName].validate(data);

            /**
             * Do not allow invalid data
             */
            if (!result) {

                return false;

            }

        }

        return {data, pluginName};


    };

   /**
    * Compile article output
    *
    * @param savedData
    * @returns {{time: number, version, items: (*|Array)}}
    */
    let makeOutput = function (savedData) {

        savedData = savedData.filter(blockData => blockData);

        let items = savedData.map(blockData => Object({type: blockData.pluginName, data: blockData.data}));

        editor.state.jsonOutput = items;

        return {
            time: +new Date(),
            version: editor.version,
            items
        };

    };

    return saver;

})({});