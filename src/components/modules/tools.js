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
   * Return Tools for the Inline Toolbar
   * @return {Object} - object of Inline Tool's classes
   */
  get inline() {
    const tools = Object.entries(this.available).filter( ([name, tool]) => {
      if (!tool[this.apiSettings.IS_INLINE]) {
        return false;
      }

      /**
       * Some Tools validation
       */
      const inlineToolRequiredMethods = ['render', 'surround', 'checkState'];
      const notImplementedMethods = inlineToolRequiredMethods.filter( method => !new tool()[method] );

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

    return result;
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
      IS_INLINE: 'isInline',
      TOOLBAR_ICON_CLASS: 'iconClassName',
      IS_DISPLAYED_IN_TOOLBOX: 'displayInToolbox',
      IS_ENABLED_LINE_BREAKS: 'enableLineBreaks',
      IS_IRREPLACEBLE_TOOL: 'irreplaceable',
      IS_ENABLED_INLINE_TOOLBAR: 'inlineToolbar',
      IS_PASTE_DISALLOWED: 'disallowPaste',
      SHORTCUT: 'shortcut',
    };
  }

  /**
   * Static getter for default Tool config fields
   * @return {ToolConfig}
   */
  get defaultConfig() {
    return {
      [this.apiSettings.TOOLBAR_ICON_CLASS] : false,
      [this.apiSettings.IS_DISPLAYED_IN_TOOLBOX] : false,
      [this.apiSettings.IS_ENABLED_LINE_BREAKS] : false,
      [this.apiSettings.IS_IRREPLACEBLE_TOOL] : false,
      [this.apiSettings.IS_ENABLED_INLINE_TOOLBAR]: false,
      [this.apiSettings.SHORTCUT]: false,
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
     * Tools configs in map {name: config, ...}
     * @type {Object}
     */
    this.toolsConfig = {};

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
      this.toolsConfig[toolName] = {};

      if (typeof this.config.tools[toolName] === 'object') {
        this.toolClasses[toolName] = this.config.tools[toolName].class;
        this.toolsConfig[toolName] = this.config.tools[toolName];

        // delete this.toolsConfig[toolName].class;
      } else {
        this.toolClasses[toolName] = this.config.tools[toolName];
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
      config = this.toolsConfig[tool];

    let instance = new plugin(data, config || {});

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

  /**
   * Return Tool's config by name
   * @param toolname
   * @return {IBlockToolConfig}
   */
  getToolConfig(toolname) {
    return this.toolsConfig[toolname];
  }
}
