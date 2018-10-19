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
import {hasOwnProperty} from 'tslint/lib/utils';

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
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Sets sanitizer configuration. Uses default config if user didn't pass the restriction
   */
  get defaultConfig() {
    return {
      p: {},
      a: {
        href: true,
        target: '_blank',
        rel: 'nofollow',
      },
      b: {},
      i: {},
    };
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

      /**
       * If Tools doesn't provide sanitizer config or it is empty
       */
      if (!toolClass.sanitize || (toolClass.sanitize && _.isEmpty(toolClass.sanitize))) {
        return block;
      }

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
      block.data = this.deepSanitize(block.data, toolConfig);

      return block;
    });
  }

  /**
   * Method recursively reduces Block's data and cleans with passed rules
   *
   * @param {IBlockToolData} blockData - taint string or object/array that contains taint string
   * @param {ISanitizerConfig} rules - object with sanitizer rules
   * @param {number} depth
   */
  public deepSanitize(blockData, rules, depth = 0) {

    console.log('start: depth', depth);

    if (typeof blockData === 'object') {
      const cleanData = {};

      /**
       * Enumerate BlockData items
       *
       * It may contain 3 types:
       *
       * 1) Array - we need to save as array, thats why we do Array.map and call itself recursively
       * 2) Object - we make new object with clean data and call itself
       * 3) Basic type - we clean data
       */
      for (const data in blockData) {

        if (!blockData.hasOwnProperty(data)) {
          continue;
        }

        /**
         * Current iteration item
         */
        const currentIterationItem = blockData[data];

        if (Array.isArray(currentIterationItem)) {
          /**
           * Case 1:
           *
           *  - if passed config is valid, then call itself with this config of current iteration item
           *  - if passed config is not valid, call itself with parent's config
           */
          if (this.isConfigValid(rules[data])) {
            cleanData[data] = currentIterationItem.map( (arrayData) => {
              return this.deepSanitize(arrayData, rules[data], depth + 1);
            });
          } else {
            cleanData[data] = currentIterationItem.map( (arrayData) => {
              return this.deepSanitize(arrayData, rules, depth + 1);
            });
          }

        } else if (typeof currentIterationItem === 'object') {
          /**
           * Case 2:
           *
           * Working with objects is easier. We just make another object
           * Doing the same as with Array
           */
          if (this.isConfigValid(rules[data])) {
            cleanData[data] = this.deepSanitize(currentIterationItem, rules[data], depth + 1);
          } else {
            cleanData[data] = this.deepSanitize(currentIterationItem, rules, depth + 1);
          }
        } else {
          /**
           * Case 3:
           *
           * Clean currentIterationItem because it is basic typed object
           * - Use parent config if it's config is not valid
           */
          if (this.isConfigValid(rules[data])) {
            cleanData[data] = this.cleanOneItem(currentIterationItem, rules[data]);
          } else {
            cleanData[data] = this.cleanOneItem(currentIterationItem, rules);
          }
        }
      }
      return cleanData;
    }

    console.log('finish with depth:', depth);
    /**
     * Array items are not object
     */
    return this.cleanOneItem(blockData, rules);
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
  public clean(taintString: string, customConfig: ISanitizerConfig): string {

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
   * @param {string} taintString
   * @param {ISanitizerConfig|boolean} rule
   * @return {string}
   */
  private cleanOneItem(taintString: string, rule: ISanitizerConfig|boolean): string {
    if (typeof rule === 'object') {
      return this.clean(taintString, rule);
    } else if (rule === false) {
      return this.clean(taintString, {});
    } else {
      return taintString;
    }
  }

  /**
   * @param config
   */
  private isConfigValid(config): boolean {
    return (typeof config === 'object' || config === false || config === true);
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
   * @param {ISanitizerConfig} toolRules
   * @return {ISanitizerConfig}
   */
  private composeToolConfig(toolName: string, toolRules: ISanitizerConfig): ISanitizerConfig {
    const baseConfig = this.getInlineToolsConfig(toolName);

    const toolConfig = {};
    for (const toolRule in toolRules) {
      if (typeof toolRules[toolRule] === 'object') {
        toolConfig[toolRule] = Object.assign({}, baseConfig, toolRules[toolRule]);
      } else {
        toolConfig[toolRule] = toolRules[toolRule];
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
