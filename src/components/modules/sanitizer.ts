/**
 * CodeX Sanitizer
 *
 * @module Sanitizer
 * Clears HTML from taint tags
 *
 * @version 2.0.0
 *
 * @example
 *  Module can be used within two ways:
 *     1) When you have an instance
 *         - this.Editor.Sanitizer.clean(yourTaintString);
 *     2) As static method
 *         - CodexEditor.Sanitizer.clean(yourTaintString, yourCustomConfiguration);
 *
 * {@link SanitizerConfig}
 */

import ISanitizerConfig from '../interfaces/sanitizer-config';

/**
 * @typedef {Object} SanitizerConfig
 * @property {Object} tags - define tags restrictions
 *
 * @example
 *
 * tags : {
 *     p: true,
 *     a: {
 *       href: true,
 *       rel: "nofollow",
 *       target: "_blank"
 *     }
 * }
 */

declare const Module: any;
declare const _: any;

import HTMLJanitor from 'html-janitor';

export default class Sanitizer extends Module {
  /**
   * Memoize tools config
   */
  private configCache: {[toolName: string]: ISanitizerConfig} = {};

  /**
   * Initializes Sanitizer module
   * Sets default configuration if custom not exists
   *
   * @property {SanitizerConfig} this.defaultConfig
   * @property {HTMLJanitor} this._sanitizerInstance - Sanitizer library
   *
   * @param {SanitizerConfig} config
   */
  constructor({config}) {
    super({config});

    /** Custom configuration */
    this.sanitizerConfig = config.settings ? config.settings.sanitizer : null;
  }

  /**
   * Sanitize Blocks
   *
   * Enumerate blocks and clean data
   *
   * @param {{tool, data: IBlockToolData}[]} blocksData[]
   */
  public sanitizeBlocks(blocksData) {
    let toolClass;

    return blocksData.map((block) => {
      toolClass = this.Editor.Tools.toolsAvailable[block.tool];

      const output = {
        time: block.time,
        tool: block.tool,
        data: block.data,
      };

      /**
       * Enable sanitizing if Tool provides config
       */
      if (toolClass.sanitize && !_.isEmpty(toolClass.sanitize)) {
        /**
         * If cache is empty, then compose tool config and put it to the cache object
         */
        if (!this.configCache[block.tool]) {
          this.configCache[block.tool] = this.composeToolConfig(block.tool, toolClass.sanitize);
        }

        /**
         * get from cache
         */
        const toolConfig = this.configCache[block.tool];
        output.data = this.deepSanitize(block.data, toolConfig);
      }

      return output;
    });
  }

  /**
   * Method recursively reduces Block's data and cleans with passed rules
   *
   * @param {Object|string} blockData - taint string or object/array that contains taint string
   * @param {Object} rules - object with sanitizer rules
   */
  public deepSanitize(blockData, rules) {
    /**
     * Case 1: Block data is Array
     * Array's in JS can not be enumerated with for..in because result will be Object not Array
     * which conflicts with Consistency
     */
    if (Array.isArray(blockData)) {
      /**
       * Create new "cleanData" array and fill in with sanitizer data
       */
      return blockData.map((item) => {
        return this.deepSanitize(item, rules);
      });
    } else if (typeof blockData === 'object') {
      /**
       * Create new "cleanData" object and fill with sanitized objects
       */
      const cleanData = {};

      /**
       * Object's may have 3 cases:
       *  1. When Data is Array. Then call again itself and recursively clean arrays items
       *  2. When Data is Object that can have object's inside. Do the same, call itself and clean recursively
       *  3. When Data is base type (string, int, bool, ...). Check if rule is passed
       */
      for (const data in blockData) {
        if (Array.isArray(blockData[data])) {
          /**
           * Case 1: BlockData is array
           *
           * Clean recursively blockdata[data] with passed rule
           * Each array item clened by passed parent rule
           *
           * 1) If rule exists, then clean with rules extended by inline tools sanitize
           * 2) If rule is false, which means clean all
           * 3) Do nothing
           */
          if (rules[data]) {
            cleanData[data] = this.deepSanitize(blockData[data], rules[data]);
          } else if (rules[data] === false) {
            cleanData[data] = this.deepSanitize(blockData[data], {});
          } else {
            cleanData[data] = blockData[data];
          }

        } else if (typeof blockData[data] === 'object') {
          /**
           * Case 2: BlockData is Object
           * Clean each child with passed parents rule
           *
           * In this case we need to create a subObject that contains cleaned childs of current Object
           */
          const cleanedChilds = {};
          for (const childData in blockData[data]) {
            /**
             * Case 1 & Case 2
             */
            if (rules[data]) {
              cleanedChilds[childData] = this.clean(blockData[data][childData], rules[data]);
            } else if (rules[data] === false) {
              cleanedChilds[childData] = this.clean(blockData[data][childData], {});
            } else {
              cleanedChilds[childData] = blockData[data];
            }
          }

          cleanData[data] = cleanedChilds;

        } else {
          /**
           * Case 3: When blockData[data] is base typed
           */
          if (rules[data]) {
            cleanData[data] = this.clean(blockData[data], rules[data]);
          } else if (rules[data] === false) {
            cleanData[data] = this.clean(blockData[data], {});
          } else {
            cleanData[data] = blockData[data];
          }
        }
      }

      return cleanData;
    } else {
      /**
       * In case embedded objects use parent rules
       */
      return this.clean(blockData, rules);
    }
  }

  /**
   * Cleans string from unwanted tags
   * Method allows to use default config
   *
   * @param {String} taintString - taint string
   * @param {SanitizerConfig} customConfig - allowed tags
   *
   * @return {String} clean HTML
   */
  public clean(taintString: string, customConfig: ISanitizerConfig) {

    const sanitizerConfig = {
      tags: customConfig,
    };

    /**
     * API client can use custom config to manage sanitize process
     */
    const sanitizerInstance = this.createHTMLJanitorInstance(sanitizerConfig);
    return sanitizerInstance.clean(taintString);
  }

  /**
   * If developer uses editor's API, then he can customize sanitize restrictions.
   * Or, sanitizing config can be defined globally in editors initialization. That config will be used everywhere
   * At least, if there is no config overrides, that API uses Default configuration
   *
   * @uses https://www.npmjs.com/package/html-janitor
   *
   * @param {SanitizerConfig} config - sanitizer extension
   */
  private createHTMLJanitorInstance(config) {
    if (config) {
      return new HTMLJanitor(config);
    }
    return null;
  }

  /**
   * Merge with inline tool config
   *
   * @param {string} toolName
   * @param {ISanitizerConfig} blockRules
   * @return {ISanitizerConfig}
   */
  private composeToolConfig(toolName: string, blockRules: ISanitizerConfig): ISanitizerConfig {
    const baseConfig = this.getInlineToolsConfig(toolName);

    const toolConfig = {};
    for (const blockRule in blockRules) {
      if (blockRules[blockRule]) {
        toolConfig[blockRule] = Object.assign({}, baseConfig, blockRules[blockRule]);
      } else {
        toolConfig[blockRule] = false;
      }
    }
    return toolConfig;
  }

  /**
   * Returns Sanitizer config
   * When Tool's "inlineToolbar" value is True, get all sanitizer rules from all tools,
   * otherwise get only enabled
   */
  private getInlineToolsConfig(name) {
    const toolsConfig = this.Editor.Tools.getToolSettings(name),
      enableInlineTools = toolsConfig.inlineToolbar || [];

    let config = {};

    if (typeof enableInlineTools === 'boolean' && enableInlineTools) {
      /**
       * getting all tools sanitizer rule
       */
      this.Editor.InlineToolbar.tools.forEach( (inlineTool) => {
        config = Object.assign(config, inlineTool.sanitize);
      });
    } else {
      /**
       * getting only enabled
       */
      enableInlineTools.map( (inlineToolName) => {
        config = Object.assign(config, this.Editor.InlineToolbar.tools.get(inlineToolName).sanitize);
      });
    }

    return config;
  }
}
