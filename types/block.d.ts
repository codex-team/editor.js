import {BlockTune} from './block-tunes';
import {API, BlockToolConstructable, ToolConfig} from './index';
import {BlockTool, BlockToolData} from './tools';
import {SanitizerConfig} from './configs';

/**
 * @classdesc Abstract Block class that contains Block information, Tool name and Tool class instance
 *
 * @property tool - Tool instance
 * @property html - Returns HTML content of plugin
 * @property holder - Div element that wraps block content with Tool's content. Has `ce-block` CSS class
 * @property pluginsContent - HTML content that returns by Tool's render function
 */
export declare class Block {

  /**
   * CSS classes for the Block
   * @return {{wrapper: string, content: string}}
   */
  public static CSS: {wrapper: string, wrapperStretched: string, content: string, selected: string, dropTarget: string};

  /**
   * Find and return all editable elements (contenteditables and native inputs) in the Tool HTML
   *
   * @returns {HTMLElement[]}
   */
  public inputs: HTMLElement[];

  /**
   * Input index of the element
   *
   * @param {HTMLElement} element
   */
  public currentInput: HTMLElement;
  /**
   * Return first Tool`s input
   *
   * @returns {HTMLElement}
   */
  public firstInput: HTMLElement;

  /**
   * Return first Tool`s input
   *
   * @returns {HTMLElement}
   */
  public lastInput: HTMLElement;

  /**
   * Return next Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  public nextInput: HTMLElement;

  /**
   * Return previous Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  public previousInput: HTMLElement;

  /**
   * Returns Plugins content
   * @return {Node}
   */
  public pluginsContent: Node;

  /**
   * Get Block's JSON data
   * @return {Object}
   */
   public data: BlockToolData;

  /**
   * Returns tool's sanitizer config
   * @return {object}
   */
  public sanitize: SanitizerConfig;

  /**
   * is block mergeable
   * We plugin have merge function then we call it mergable
   * @return {boolean}
   */
  public mergeable: boolean;

  /**
   * Check block for emptiness
   * @return {Boolean}
   */
  public isEmpty: boolean;

  /**
   * Check if block has a media content such as images, iframes and other
   * @return {Boolean}
   */
  public hasMedia: boolean;

  /**
   * Set selected state
   * @param {Boolean} state - 'true' to select, 'false' to remove selection
   */
  public selected: boolean;

  /**
   * Set stretched state
   * @param {Boolean} state - 'true' to enable, 'false' to disable stretched statte
   */
  public stretched: boolean;

  public name: string;
  public tool: BlockTool;
  public class: BlockToolConstructable;
  public settings: ToolConfig;
  public holder: HTMLDivElement;
  public tunes: BlockTune[];

  /**
   * Toggle drop target state
   * @param {boolean} state
   */
  public dropTarget: boolean;

  /**
   * @constructor
   * @param {String} toolName - Tool name that passed on initialization
   * @param {Object} toolInstance — passed Tool`s instance that rendered the Block
   * @param {Object} toolClass — Tool's class
   * @param {Object} settings - default settings
   * @param {Object} apiMethods - Editor API
   */
  constructor(
    toolName: string,
    toolInstance: BlockTool,
    toolClass: BlockToolConstructable,
    settings: ToolConfig,
    apiMethods: API,
  );

  /**
   * Calls Tool's method
   *
   * Method checks tool property {MethodName}. Fires method with passes params If it is instance of Function
   *
   * @param {String} methodName
   * @param {Object} params
   */
  public call(methodName: string, params: object): void;

  /**
   * Call plugins merge method
   * @param {Object} data
   */
  public mergeWith(data: BlockToolData): Promise<void>;

  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   * @return {Object}
   */
  public save(): Promise<void|{tool: string, data: BlockToolData, time: number}>;

  /**
   * Uses Tool's validation method to check the correctness of output data
   * Tool's validation method is optional
   *
   * @description Method also can return data if it passed the validation
   *
   * @param {Object} data
   * @returns {Boolean|Object} valid
   */
  public validateData(data: BlockToolData): BlockToolData|false;

  /**
   * Make an array with default settings
   * Each block has default tune instance that have states
   * @return {BlockTune[]}
   */
  public makeTunes(): BlockTune[];

  /**
   * Enumerates initialized tunes and returns fragment that can be appended to the toolbars area
   * @return {DocumentFragment}
   */
  public renderTunes(): DocumentFragment;
}
