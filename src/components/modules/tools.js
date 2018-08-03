const Paragraph = require('../tools/paragraph/dist/bundle');

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
 * @property {Boolean|String[]} inlineToolbar - Pass `true` to enable the Inline Toolbar with all Tools, all pass an array with specified Tools list |
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
 * @property {object} toolsClasses - all classes
 * @property {object} toolsSettings - Tools settings
 * @property {EditorConfig} config - Editor config
 */
export default class Tools extends Module {
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
    this.toolsClasses = {};

    /**
     * Tools settings in a map {name: settings, ...}
     * @type {Object}
     */
    this.toolsSettings = {};

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

    /**
     * Cache for the prepared inline tools
     * @type {null|object}
     * @private
     */
    this._inlineTools = null;
  }

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
   * Return Tools for the Inline Toolbar
   * @return {Object} - object of Inline Tool's classes
   */
  get inline() {
    if (this._inlineTools) {
      return this._inlineTools;
    }

    const tools = Object.entries(this.available).filter( ([name, tool]) => {
      if (!tool[this.apiSettings.IS_INLINE]) {
        return false;
      }

      /**
       * Some Tools validation
       */
      const inlineToolRequiredMethods = ['render', 'surround', 'checkState'];
      const notImplementedMethods = inlineToolRequiredMethods.filter( method => !this.constructInline(tool)[method]);

      if (notImplementedMethods.length) {
        _.log(`Incorrect Inline Tool: ${tool.name}. Some of required methods is not implemented %o`, 'warn', notImplementedMethods);
        return false;
      }

      return true;
    });

    /**
     * collected inline tools with key of tool name
     */
    const result = {};

    tools.forEach(([name, tool]) => result[name] = tool);

    /**
     * Cache prepared Tools
     */
    this._inlineTools = result;

    return this._inlineTools;
  }

  /**
   * Return editor block tools
   */
  get blockTools() {
    // eslint-disable-next-line no-unused-vars
    const tools = Object.entries(this.available).filter( ([name, tool]) => {
      if (tool[this.apiSettings.IS_INLINE]) {
        return false;
      }

      return true;
    });

    /**
     * collected block tools with key of tool name
     */
    const result = {};

    tools.forEach(([name, tool]) => result[name] = tool);

    return result;
  }

  /**
   * Constant for available Tools Settings
   * @return {object}
   */
  get apiSettings() {
    return {
      CONFIG: 'config',
      IS_CONTENTLESS: 'contentless',
      IS_DISPLAYED_IN_TOOLBOX: 'displayInToolbox',
      IS_ENABLED_INLINE_TOOLBAR: 'inlineToolbar',
      IS_ENABLED_LINE_BREAKS: 'enableLineBreaks',
      IS_INLINE: 'isInline',
      IS_IRREPLACEBLE_TOOL: 'irreplaceable',
      IS_PASTE_DISALLOWED: 'disallowPaste',
      SHORTCUT: 'shortcut',
      TOOLBAR_ICON: 'toolboxIcon',
    };
  }

  /**
   * Creates instances via passed or default configuration
   * @return {Promise}
   */
  prepare() {
    this.config.tools.paragraph = {
      class: Paragraph,
      inlineToolbar: true
    };

    if (!this.config.hasOwnProperty('tools') || Object.keys(this.config.tools).length === 0) {
      return Promise.reject('Can\'t start without tools');
    }

    /**
     * Save Tools settings to a map
     */
    for(let toolName in this.config.tools) {
      /**
       * If Tool is an object not a Tool's class then
       * save class and settings separately
       */
      if (typeof this.config.tools[toolName] === 'object') {
        /**
         * Save Tool's class from 'class' field
         * @type {ITool}
         */
        this.toolsClasses[toolName] = this.config.tools[toolName].class;

        /**
         * Save Tool's settings
         * @type {IToolSettings}
         */
        this.toolsSettings[toolName] = this.config.tools[toolName];

        /**
         * Remove Tool's class from settings
         */
        delete this.toolsSettings[toolName].class;
      } else {
        /**
         * Save Tool's class
         * @type {ITool}
         */
        this.toolsClasses[toolName] = this.config.tools[toolName];

        /**
         * Set empty settings for Block by default
         * @type {{}}
         */
        this.toolsSettings[toolName] = {};
      }
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

    for(let toolName in this.toolsClasses) {
      let toolClass = this.toolsClasses[toolName];

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
    this.toolsAvailable[data.toolName] = this.toolsClasses[data.toolName];
  }

  /**
   * @param {ChainData.data} data - append tool to unavailable list
   */
  fallback(data) {
    this.toolsUnavailable[data.toolName] = this.toolsClasses[data.toolName];
  }

  /**
   * Return Tool`s instance
   *
   * @param {String} tool — tool name
   * @param {IBlockToolData} data — initial data
   * @return {IBlockTool}
   */
  construct(tool, data) {
    const plugin = this.toolsClasses[tool];

    /**
     * Configuration to be passed to the Tool's constructor
     */
    const config = this.toolsSettings[tool][this.apiSettings.CONFIG];

    /**
     * @type {{api: IAPI, config: ({}), data: IBlockToolData}}
     */
    const constructorOptions = {
      api: this.Editor.API.methods,
      config: config || {},
      data: data
    };

    return new plugin(constructorOptions);
  }

  /**
   * Return Inline Tool's instance
   *
   * @param {IInlineTool} tool
   * @return {IInlineTool} — instance
   */
  constructInline(tool) {
    /**
     * @type {{api: IAPI}}
     */
    const constructorOptions = {
      api: this.Editor.API.methods
    };

    return new tool(constructorOptions);
  }

  /**
   * Check if passed Tool is an instance of Initial Block Tool
   * @param {Tool} tool - Tool to check
   * @return {Boolean}
   */
  isInitial(tool) {
    return tool instanceof this.available[this.config.initialBlock];
  }

  /**
   * Return Tool's config by name
   * @param {string} toolName
   * @return {IToolSettings}
   */
  getToolSettings(toolName) {
    return this.toolsSettings[toolName];
  }
}
