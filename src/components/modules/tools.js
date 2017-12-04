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
 * @todo update according to current API
 *
 * @typedef {Object} Tool
 * @property render
 * @property save
 * @property settings
 * @property validate
 */

/**
 * Class properties:
 *
 * @property {String} name - name of this module
 * @property {Object[]} toolInstances - list of tool instances
 * @property {Tools[]} available - available Tools
 * @property {Tools[]} unavailable - unavailable Tools
 * @property {Object} toolsClasses - all classes
 * @property {EditorConfig} config - Editor config
 */

class Tools {

    /**
     * Returns available Tools
     * @return {Tool[]}
     */
    get available() {

        return this.toolsAvailable;

    }

    /**
     * Returns unavailable Tools
     * @return {Tool[]}
     */
    get unavailable() {

        return this.toolsUnavailable;

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

        this.toolClasses = {};
        this.toolsAvailable = {};
        this.toolsUnavailable = {};

    }

    /**
     * Creates instances via passed or default configuration
     * @return {boolean}
     */
    prepare() {

        if (!this.config.hasOwnProperty('tools')) {

            return Promise.reject("Can't start without tools");

        }

        for(let toolName in this.config.tools) {

            this.toolClasses[toolName] = this.config.tools[toolName];

        }

        /**
         * getting classes that has prepare method
         */
        let sequenceData = this.getListOfPrepareFunctions();

        /**
         * if sequence data contains nothing then resolve current chain and run other module prepare
         */
        if (sequenceData.length === 0) {

            return Promise.resolve();

        }

        /**
         * to see how it works {@link Util#sequence}
         */
        return _.sequence(sequenceData, (data) => {

            this.success(data);

        }, (data) => {

            this.fallback(data);

        });

    }

    /**
     * Binds prepare function of plugins with user or default config
     * @return {Array} list of functions that needs to be fired sequently
     */
    getListOfPrepareFunctions() {

        let toolPreparationList = [];

        for(let toolName in this.toolClasses) {

            let toolClass = this.toolClasses[toolName];

            if (typeof toolClass.prepare === 'function') {

                toolPreparationList.push({
                    function : toolClass.prepare,
                    data : {
                        toolName
                    }
                });

            }

        }

        return toolPreparationList;

    }

    /**
     * @param {ChainData.data} data - append tool to available list
     */
    success(data) {

        this.toolsAvailable[data.toolName] = this.toolClasses[data.toolName];

    }

    /**
     * @param {ChainData.data} data - append tool to unavailable list
     */
    fallback(data) {

        this.toolsUnavailable[data.toolName] = this.toolClasses[data.toolName];

    }

    /**
     * Returns all tools
     * @return {Array}
     */
    getTools() {

        return this.toolInstances;

    }

    /**
     * Return tool`a instance
     *
     * @param {String} tool — tool name
     * @param {Object} data — initial data
     *
     * @todo throw exceptions if tool doesnt exist
     *
     */
    construct(tool, data) {

        let plugin = this.toolClasses[tool],
            config = this.config.toolsConfig[tool];

        let instance = new plugin(data, config);

        return instance;

    }

}

module.exports = Tools;
