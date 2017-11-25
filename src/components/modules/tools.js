/**
 * @module Codex Editor Tools Submodule
 *
 * Creates Instances from Plugins and binds external config to the instances
 */

/**
 * Load user defined tools
 * Tools must contain the following important objects:
 *
 * @typedef {Object} ToolsConfig
 * @property {String} iconClassname - this a icon in toolbar
 * @property {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
 * @property {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
 */

/**
 * Class properties:
 *
 * @property {String} this.name - name of this module
 * @property {Array} this.toolInstances - list of tool instances
 * @property {EditorConfig} this.config - Editor config
 *
 */
let util = require('../util');

module.exports = class Tools {

    static get name() {

        return 'tools';

    }

    /**
     * @param Editor
     * @param Editor.modules {@link CodexEditor#moduleInstances}
     * @param Editor.config {@link CodexEditor#configuration}
     */
    set state(Editor) {

        this.Editor = Editor;

    }

    /**
     * If config wasn't passed by user
     * @return {ToolsConfig}
     */
    get defaultConfig() {

        return {
            iconClassName : 'default-icon',
            displayInToolbox : false,
            enableLineBreaks : false
        };

    }

    /**
     * @constructor
     *
     * @param {ToolsConfig} config
     */
    constructor({ config }) {

        this.config = config;
        this.toolInstances = [];

    }

    /**
     * Creates instances via passed or default configuration
     * @return {boolean}
     */
    prepare() {

        if (!this.config.hasOwnProperty('tools')) {

            return Promise.reject("Can't start without tools");

        }

        let sequenceData = this.getListOfPrepareFunctions();

        if (sequenceData.length === 0) {

            return Promise.resolve();

        }

        return util.sequence(sequenceData, this.success, this.fallback);

    }

    success(data) {

        console.log('Success!', data);

    }

    fallback(data) {

        console.log('Module is not available', data);

    }

    /**
     * Binds prepare function of plugins with user or default config
     *
     * @return {Array} list of functions that needs to be fired sequently
     */
    getListOfPrepareFunctions() {

        let toolPreparationList = [];

        for(let tool in this.config.tools) {

            let toolClass = this.config.tools[tool];

            if (toolClass.prepare && typeof toolClass.prepare === 'function') {

                toolPreparationList.push({
                    function : toolClass.prepare,
                    data : {
                        toolName : tool
                    }
                });

            }

        }

        return toolPreparationList;

    }

    /**
     * Returns all tools
     * @return {Array}
     */
    getTools() {

        return this.toolInstances;

    }

};
// let toolConfig = this.defaultConfig;
// let toolPreparationList = [];
//
// for(let tool in this.config.tools) {
//
//     let toolClass = this.config.tools[tool],
//         toolName = toolClass.name.toLowerCase();
//
//     if (toolName in this.config.toolsConfig) {
//
//         toolConfig = this.config.toolsConfig[toolName];
//
//     }
//
//     if (toolClass.prepare && typeof toolClass.prepare === 'function') {
//
//         toolPreparationList.push(toolClass.prepare.bind(toolConfig));
//
//     }
//
// }

// /**
// * Module working with plugins
// */
// module.exports = (function () {
//
//     let editor = codex.editor;
//
//     /**
//      * Initialize plugins before using
//      * Ex. Load scripts or call some internal methods
//      * @return Promise
//      */
//     function prepare() {
//
//         return new Promise(function (resolve_, reject_) {
//
//             Promise.resolve()
//
//                 /**
//                 * Compose a sequence of plugins that requires preparation
//                 */
//                 .then(function () {
//
//                     let pluginsRequiresPreparation = [],
//                         allPlugins = editor.tools;
//
//                     for ( let pluginName in allPlugins ) {
//
//                         let plugin = allPlugins[pluginName];
//
//                         if (plugin.prepare && typeof plugin.prepare != 'function' || !plugin.prepare) {
//
//                             continue;
//
//                         }
//
//                         pluginsRequiresPreparation.push(plugin);
//
//                     }
//
//                     /**
//                     * If no one passed plugins requires preparation, finish prepare() and go ahead
//                     */
//                     if (!pluginsRequiresPreparation.length) {
//
//                         resolve_();
//
//                     }
//
//                     return pluginsRequiresPreparation;
//
//                 })
//
//                 /** Wait plugins while they prepares */
//                 .then(waitAllPluginsPreparation_)
//
//                 .then(function () {
//
//                     editor.core.log('Plugins loaded', 'info');
//                     resolve_();
//
//                 }).catch(function (error) {
//
//                     reject_(error);
//
//                 });
//
//         });
//
//     }
//
//     /**
//     * @param {array} plugins - list of tools that requires preparation
//     * @return {Promise} resolved while all plugins will be ready or failed
//     */
//     function waitAllPluginsPreparation_(plugins) {
//
//         /**
//         * @calls allPluginsProcessed__ when all plugins prepared or failed
//         */
//         return new Promise (function (allPluginsProcessed__) {
//
//             plugins.reduce(function (previousValue, plugin, iteration) {
//
//                 return previousValue.then(function () {
//
//                     /**
//                     * Wait till plugins prepared
//                     * @calls pluginIsReady__ when plugin is ready or failed
//                     */
//                     return new Promise ( function (pluginIsReady__) {
//
//                         callPluginsPrepareMethod_( plugin )
//
//                             .then( pluginIsReady__ )
//                             .then( function () {
//
//                                 plugin.available = true;
//
//                             })
//
//                             .catch(function (error) {
//
//                                 editor.core.log(`Plugin «${plugin.type}» was not loaded. Preparation failed because %o`, 'warn', error);
//                                 plugin.available = false;
//                                 plugin.loadingMessage = error;
//
//                                 /** Go ahead even some plugin has problems */
//                                 pluginIsReady__();
//
//                             })
//
//                             .then(function () {
//
//                                 /** If last plugin has problems then just ignore and continue */
//                                 if (iteration == plugins.length - 1) {
//
//                                     allPluginsProcessed__();
//
//                                 }
//
//                             });
//
//                     });
//
//                 });
//
//             }, Promise.resolve() );
//
//         });
//
//     }
//
//     var callPluginsPrepareMethod_ = function (plugin) {
//
//         return plugin.prepare( plugin.config || {} );
//
//     };
//
//     return {
//         prepare: prepare
//     };
//
// }());