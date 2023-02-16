/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * CodeX Sanitizer
 *
 * Clears HTML from taint tags
 *
 * @version 2.0.0
 * @example
 *
 * clean(yourTaintString, yourConfig);
 *
 * {@link SanitizerConfig}
 */

import * as _ from '../utils';

/**
 * @typedef {object} SanitizerConfig
 * @property {object} tags - define tags restrictions
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

import HTMLJanitor from 'html-janitor';
import { BlockToolData, SanitizerConfig } from '../../../types';
import { SavedData } from '../../../types/data-formats';

/**
 * Sanitize Blocks
 *
 * Enumerate blocks and clean data
 *
 * @param blocksData - blocks' data to sanitize
 * @param sanitizeConfig — sanitize config to use or function to get config for Tool
 */
export function sanitizeBlocks(
  blocksData: Array<Pick<SavedData, 'data' | 'tool'>>,
  sanitizeConfig: SanitizerConfig | ((toolName: string) => SanitizerConfig)
): Array<Pick<SavedData, 'data' | 'tool'>> {
  return blocksData.map((block) => {
    const toolConfig = _.isFunction(sanitizeConfig) ? sanitizeConfig(block.tool) : sanitizeConfig;

    if (_.isEmpty(toolConfig)) {
      return block;
    }

    block.data = deepSanitize(block.data, toolConfig) as BlockToolData;

    return block;
  });
}
/**
 * Cleans string from unwanted tags
 * Method allows to use default config
 *
 * @param {string} taintString - taint string
 * @param {SanitizerConfig} customConfig - allowed tags
 * @returns {string} clean HTML
 */
export function clean(taintString: string, customConfig: SanitizerConfig = {} as SanitizerConfig): string {
  const sanitizerConfig = {
    tags: customConfig,
  };

  /**
   * API client can use custom config to manage sanitize process
   */
  const sanitizerInstance = new HTMLJanitor(sanitizerConfig);

  return sanitizerInstance.clean(taintString);
}

/**
 * Method recursively reduces Block's data and cleans with passed rules
 *
 * @param {BlockToolData|object|*} dataToSanitize - taint string or object/array that contains taint string
 * @param {SanitizerConfig} rules - object with sanitizer rules
 */
function deepSanitize(dataToSanitize: object | string, rules: SanitizerConfig): object | string {
  /**
   * BlockData It may contain 3 types:
   *  - Array
   *  - Object
   *  - Primitive
   */
  if (Array.isArray(dataToSanitize)) {
    /**
     * Array: call sanitize for each item
     */
    return cleanArray(dataToSanitize, rules);
  } else if (_.isObject(dataToSanitize)) {
    /**
     * Objects: just clean object deeper.
     */
    return cleanObject(dataToSanitize, rules);
  } else {
    /**
     * Primitives (number|string|boolean): clean this item
     *
     * Clean only strings
     */
    if (_.isString(dataToSanitize)) {
      return cleanOneItem(dataToSanitize, rules);
    }

    return dataToSanitize;
  }
}

/**
 * Clean array
 *
 * @param {Array} array - [1, 2, {}, []]
 * @param {SanitizerConfig} ruleForItem - sanitizer config for array
 */
function cleanArray(array: Array<object | string>, ruleForItem: SanitizerConfig): Array<object | string> {
  return array.map((arrayItem) => deepSanitize(arrayItem, ruleForItem));
}

/**
 * Clean object
 *
 * @param {object} object  - {level: 0, text: 'adada', items: [1,2,3]}}
 * @param {object} rules - { b: true } or true|false
 * @returns {object}
 */
function cleanObject(object: object, rules: SanitizerConfig|{[field: string]: SanitizerConfig}): object {
  const cleanData = {};

  for (const fieldName in object) {
    if (!Object.prototype.hasOwnProperty.call(object, fieldName)) {
      continue;
    }

    const currentIterationItem = object[fieldName];

    /**
     *  Get object from config by field name
     *   - if it is a HTML Janitor rule, call with this rule
     *   - otherwise, call with parent's config
     */
    const ruleForItem = isRule(rules[fieldName] as SanitizerConfig) ? rules[fieldName] : rules;

    cleanData[fieldName] = deepSanitize(currentIterationItem, ruleForItem as SanitizerConfig);
  }

  return cleanData;
}

/**
 * Clean primitive value
 *
 * @param {string} taintString - string to clean
 * @param {SanitizerConfig|boolean} rule - sanitizer rule
 * @returns {string}
 */
function cleanOneItem(taintString: string, rule: SanitizerConfig|boolean): string {
  if (_.isObject(rule)) {
    return clean(taintString, rule);
  } else if (rule === false) {
    return clean(taintString, {} as SanitizerConfig);
  } else {
    return taintString;
  }
}

/**
 * Check if passed item is a HTML Janitor rule:
 *  { a : true }, {}, false, true, function(){} — correct rules
 *  undefined, null, 0, 1, 2 — not a rules
 *
 * @param {SanitizerConfig} config - config to check
 */
function isRule(config: SanitizerConfig): boolean {
  return _.isObject(config) || _.isBoolean(config) || _.isFunction(config);
}
