/**
 * @module Codex Editor Tools Submodule
 *
 * Creates Instances from Plugins and binds external config to the instances
 */

/**
 * Each Tool must contain the following important objects:
 *
 * @typedef {Object} ToolConfig {@link docs/tools.md}
 * @property {String} iconClassname - this a icon in toolbar
 * @property {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
 * @property {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
 * @property render @todo add description
 * @property save @todo add description
 * @property settings @todo add description
 * @property validate - method that validates output data before saving
 */

/**
 * @typedef {Function} Tool {@link docs/tools.md}
 * @property {Boolean}      displayInToolbox      - By default, tools won't be added in the Toolbox. Pass true to add.
 * @property {String}       iconClassName         - CSS class name for the Toolbox button
 * @property {Boolean}      irreplaceable         - Toolbox behaviour: replace or add new block below
 * @property render
 * @property save
 * @property settings
 * @property validate
 *
 * @todo update according to current API
 * @todo describe Tool in the {@link docs/tools.md}
 */

/**
 * Class properties:
 *
 * @typedef {Tools} Tools
 * @property {Tools[]} toolsAvailable - available Tools
 * @property {Tools[]} toolsUnavailable - unavailable Tools
 * @property {Object} toolsClasses - all classes
 * @property {EditorConfig} config - Editor config
 */
export default class Tools extends Module {

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
     * Static getter for default Tool config fields
     *
     * @usage Tools.defaultConfig.displayInToolbox
     * @return {ToolConfig}
     */
    static get defaultConfig() {

        return {
            iconClassName : '',
            displayInToolbox : false,
            enableLineBreaks : false,
            irreplaceable : false
        };

    }

    /**
     * @constructor
     *
     * @param {EditorConfig} config
     */
    constructor({config}) {

        super({config});

        /**
         * Map {name: Class, ...} where:
         *  name — block type name in JSON. Got from EditorConfig.tools keys
         * @type {Object}
         */
        this.toolClasses = {};

        /**
         * Available tools list
         * {name: Class, ...}
         * @type {Object}
         */
        this.toolsAvailable = {};

        /**
         * Tools that rejected a prepare method
         * {name: Class, ... }
         * @type {Object}
         */
        this.toolsUnavailable = {};

    }

    /**
     * Creates instances via passed or default configuration
     * @return {Promise}
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
     * @return {Array} list of functions that needs to be fired sequentially
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

            } else {

                /**
                 * If Tool hasn't a prepare method, mark it as available
                 */
                this.toolsAvailable[toolName] = toolClass;

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

        if (!config) {

            config = this.defaultConfig;

        }

        let instance = new plugin(data, config);

        return instance;

    }

    /**
     * Check if passed Tool is an instance of Initial Block Tool
     * @param {Tool} tool - Tool to check
     * @return {Boolean}
     */
    isInitial(tool) {

        return tool instanceof this.available[this.config.initialBlock];

    }

}