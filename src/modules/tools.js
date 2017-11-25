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
 *
 */
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
        }
    }

    /**
     * @constructor
     *
     * @param {ToolsConfig} config
     */
    constructor(config) {
        this.config = config;

        this.availabPlugins = {};
        this.toolInstances = [];
    }

    /**
     * Creates instances via passed or default configuration
     * @return {boolean}
     */
    prepare() {

        let toolConfig = this.defaultConfig;

        if (!this.config.hasOwnProperty('tools')) {
            return false;
        }

        /**
         * Preparation Decorator
         *
         * @param toolBindedPreparationFunction
         * @return {Promise}
         */
        function waitNextToolPreparation(toolBindedPreparationFunction) {

            return new Promise(function(resolve, reject) {
                toolBindedPreparationFunction()
                    .then(resolve)
                    .catch(function(error) {
                        console.log('Plugin is not available because of ', error);

                        // anyway, go ahead even plugin is not available
                        resolve();
                    });
            });

        }

        return new Promise(function(resolvePreparation, rejectPreparation) {

            let toolPreparationList = [];
            for(let tool of this.config.tools) {

                let toolName = tool.name;

                if (toolName in this.config.toolsConfig) {
                    toolConfig = this.config.toolsConfig[toolName];
                }

                if (tool.prepare && typeof tool.prepare === 'function') {
                    toolPreparationList.push(tool.prepare.bind(toolConfig));
                }

            }

            // continue editor initialization if non of tools doesn't need preparation
            if (toolPreparationList.length === 0) {

                resolvePreparation();

            } else {

                toolPreparationList.reduce(function(previousToolPrepared, currentToolReadyToPreparation, iteration) {

                    return previousToolPrepared
                        .then(() => waitNextToolPreparation(currentToolReadyToPreparation))
                        .then(() => {

                            if (iteration == toolPreparationList.length - 1) {
                                resolvePreparation();
                            }

                        });

                }, Promise.resolve());

            }

        });

        /**
         * - getting class and config
         * - push to the toolinstnaces property created instances
         */
        // for(let tool in this.config.tools) {
        //     let toolClass = this.config.tools[tool],
        //         toolConfig;
        //
        //     if (tool in this.config.toolConfig) {
        //         toolConfig = this.config.toolConfig[tool];
        //     } else {
        //         toolConfig = this.defaultConfig;
        //     }
        //
        //     this.toolInstances.push(new toolClass(toolConfig));
        // }

    }

    /**
     * Returns all tools
     * @return {Array}
     */
    getTools() {
        return this.toolInstances;
    }

};
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
//             /**
//              * pluck each element from queue
//              * First, send resolved Promise as previous value
//              * Each plugins "prepare" method returns a Promise, that's why
//              * reduce current element will not be able to continue while can't get
//              * a resolved Promise
//              *
//              * If last plugin is "prepared" then go to the next stage of initialization
//              */
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