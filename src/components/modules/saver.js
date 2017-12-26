/**
 * Codex Editor Saver
 *
 * @module Saver
 * @author Codex Team
 * @version 2.0.0
 */

/**
 * @typedef {Object} SavedData
 * @property {Date} time - saving proccess time
 * @property {Object} items - extracted data
 * @property {String} version - CodexEditor version
 */

/**
 * @classdesc This method reduces all Blocks asyncronically and calls Block's save method to extract data
 *
 * @typedef {Saver} Saver
 * @property {Element} html - Editor HTML content
 * @property {String} json - Editor JSON output
 */

export default class Saver extends Module {

    /**
     * @constructor
     * @param config
     */
    constructor({config}) {

        super({config});

        this.output = null;
        this.blocksData = [];

    }

    /**
     * Composes new chain of Promises to fire them alternatelly
     * @return {SavedData}
     */
    save() {

        let blocks = this.Editor.BlockManager.blocks,
            chainData = [];

        blocks.forEach((block) => {

            chainData.push(block.data);

        });

        return Promise.all(chainData)
            .then((allExtractedData) => this.makeOutput(allExtractedData))
            .then((outputData) => {

                return outputData;

            });

    }

    /**
     * Creates output object with saved data, time and version of editor
     * @param {Object} allExtractedData
     * @return {SavedData}
     */
    makeOutput(allExtractedData) {

        let items = [],
            totalTime = 0;

        console.groupCollapsed('[CodexEditor saving]:');

        allExtractedData.forEach((extraction, index) => {

            /** Group process info */
            console.log(`\"${extraction.processInfo.tool}\" extraction info`, extraction);
            totalTime += extraction.processInfo.time;
            items.push(extraction.data);

        });

        console.log('Total', totalTime);
        console.groupEnd();

        return {
            time    : +new Date(),
            items   : items,
            version : VERSION,
        };

    }

}

// module.exports = (function (saver) {
//
//     let editor = codex.editor;
//
//     /**
//      * @public
//      * Save blocks
//      */
//     saver.save = function () {
//
//         /** Save html content of redactor to memory */
//         editor.state.html = editor.nodes.redactor.innerHTML;
//
//         /** Clean jsonOutput state */
//         editor.state.jsonOutput = [];
//
//         return saveBlocks(editor.nodes.redactor.childNodes);
//
//     };
//
//     /**
//      * @private
//      * Save each block data
//      *
//      * @param blocks
//      * @returns {Promise.<TResult>}
//      */
//     let saveBlocks = function (blocks) {
//
//         let data = [];
//
//         for(let index = 0; index < blocks.length; index++) {
//
//             data.push(getBlockData(blocks[index]));
//
//         }
//
//         return Promise.all(data)
//             .then(makeOutput)
//             .catch(editor.core.log);
//
//     };
//
//     /** Save and validate block data */
//     let getBlockData = function (block) {
//
//         return saveBlockData(block)
//             .then(validateBlockData)
//             .catch(editor.core.log);
//
//     };
//
//     /**
//     * @private
//     * Call block`s plugin save method and return saved data
//     *
//     * @param block
//     * @returns {Object}
//     */
//     let saveBlockData = function (block) {
//
//         let pluginName = block.dataset.tool;
//
//         /** Check for plugin existence */
//         if (!editor.tools[pluginName]) {
//
//             editor.core.log(`Plugin «${pluginName}» not found`, 'error');
//             return {data: null, pluginName: null};
//
//         }
//
//         /** Check for plugin having save method */
//         if (typeof editor.tools[pluginName].save !== 'function') {
//
//             editor.core.log(`Plugin «${pluginName}» must have save method`, 'error');
//             return {data: null, pluginName: null};
//
//         }
//
//         /** Result saver */
//         let blockContent   = block.childNodes[0],
//             pluginsContent = blockContent.childNodes[0],
//             position = pluginsContent.dataset.inputPosition;
//
//         /** If plugin wasn't available then return data from cache */
//         if ( editor.tools[pluginName].available === false ) {
//
//             return Promise.resolve({data: codex.editor.state.blocks.items[position].data, pluginName});
//
//         }
//
//         return Promise.resolve(pluginsContent)
//             .then(editor.tools[pluginName].save)
//             .then(data => Object({data, pluginName}));
//
//     };
//
//     /**
//     * Call plugin`s validate method. Return false if validation failed
//     *
//     * @param data
//     * @param pluginName
//     * @returns {Object|Boolean}
//     */
//     let validateBlockData = function ({data, pluginName}) {
//
//         if (!data || !pluginName) {
//
//             return false;
//
//         }
//
//         if (editor.tools[pluginName].validate) {
//
//             let result = editor.tools[pluginName].validate(data);
//
//             /**
//              * Do not allow invalid data
//              */
//             if (!result) {
//
//                 return false;
//
//             }
//
//         }
//
//         return {data, pluginName};
//
//
//     };
//
//     /**
//     * Compile article output
//     *
//     * @param savedData
//     * @returns {{time: number, version, items: (*|Array)}}
//     */
//     let makeOutput = function (savedData) {
//
//         savedData = savedData.filter(blockData => blockData);
//
//         let items = savedData.map(blockData => Object({type: blockData.pluginName, data: blockData.data}));
//
//         editor.state.jsonOutput = items;
//
//         return {
//             id: editor.state.blocks.id || null,
//             time: +new Date(),
//             version: editor.version,
//             items
//         };
//
//     };
//
//     return saver;
//
// })({});
