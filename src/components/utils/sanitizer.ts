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
import type { BlockToolData, SanitizerConfig, SanitizerRule } from '../../../types';
import type { TagConfig } from '../../../types/configs/sanitizer-config';
import type { SavedData } from '../../../types/data-formats';

/**
 * Value of a single attribute inside a tag rule object
 *
 * html-janitor accepts:
 *  - true — keep the attribute with any value
 *  - false — strip the attribute
 *  - string — keep the attribute only if its value equals the string
 *  - function — keep the attribute only if the function returns true
 */
type AttributeRule = boolean | string | ((value: string, node: Element) => boolean);

/**
 * Merges several sanitizer configs into a single one, combining rules per tag
 * instead of overwriting them
 *
 * Needed when several Inline Tools (or Block Tunes) declare rules for the same tag,
 * e.g. two tools that both wrap text with <span> but allow different attributes.
 * With a plain Object.assign the last tool's rule would replace the first one.
 *
 * Merge semantics (a rule that allows something always wins over one that does not):
 *  - tag: true + anything → true (all attributes allowed)
 *  - tag: false (or missing) + X → X
 *  - tag: object + object → object with the union of attributes
 *  - tag: function + object/function → function returning the merged result of both for the element
 *  - attribute: true + anything → true
 *  - attribute: false (or missing) + X → X
 *  - attribute: equal strings → that string
 *  - attribute: any other mix of string/function → function that passes when either side passes
 *
 * Passed configs are not mutated.
 *
 * @param configs - sanitizer configs to merge
 * @returns merged sanitizer config
 */
export function mergeSanitizerConfigs(...configs: Array<SanitizerConfig | undefined>): SanitizerConfig {
  const result = {} as SanitizerConfig;

  configs.forEach((config) => {
    if (!_.isObject(config)) {
      return;
    }

    Object.keys(config).forEach((tag) => {
      result[tag] = mergeTagRules(result[tag], config[tag]);
    });
  });

  return result;
}

/**
 * Merges two rules for the same tag
 *
 * @param a - first rule
 * @param b - second rule
 */
function mergeTagRules(a: SanitizerRule | undefined, b: SanitizerRule | undefined): SanitizerRule {
  if (a === undefined || a === null || a === false) {
    return b;
  }

  if (b === undefined || b === null || b === false) {
    return a;
  }

  if (a === true || b === true) {
    return true;
  }

  if (_.isFunction(a) || _.isFunction(b)) {
    return (el: Element): TagConfig => {
      const resultA = _.isFunction(a) ? a(el) : a;
      const resultB = _.isFunction(b) ? b(el) : b;

      return mergeTagRules(resultA, resultB) as TagConfig;
    };
  }

  const merged = { ...a };

  Object.keys(b).forEach((attr) => {
    merged[attr] = mergeAttributeRules(merged[attr] as AttributeRule, b[attr] as AttributeRule) as boolean | string;
  });

  return merged;
}

/**
 * Merges two rules for the same attribute of a tag
 *
 * @param a - first rule
 * @param b - second rule
 */
function mergeAttributeRules(a: AttributeRule | undefined, b: AttributeRule | undefined): AttributeRule {
  if (a === undefined || a === null || a === false) {
    return b;
  }

  if (b === undefined || b === null || b === false) {
    return a;
  }

  if (a === true || b === true) {
    return true;
  }

  if (a === b) {
    return a;
  }

  return (value: string, node: Element): boolean => {
    return checkAttributeRule(a, value, node) || checkAttributeRule(b, value, node);
  };
}

/**
 * Checks whether an attribute value passes a string or function rule
 *
 * @param rule - string (exact value) or function rule
 * @param value - attribute value
 * @param node - element that owns the attribute
 */
function checkAttributeRule(rule: AttributeRule, value: string, node: Element): boolean {
  if (_.isFunction(rule)) {
    /**
     * html-janitor treats any truthy predicate result as "allowed"
     * (for example `value => value.match(/^font-/)` returns an array),
     * so the merged rule must do the same
     */
    return Boolean(rule(value, node));
  }

  return rule === value;
}

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
