import {BlockTune} from './block-tunes';
import {API} from './index';
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
  static get CSS(): {wrapper: string, wrapperStretched: string, content: string, selected: string, dropTarget: string};

  /**
   * Find and return all editable elements (contenteditables and native inputs) in the Tool HTML
   *
   * @returns {HTMLElement[]}
   */
  get inputs(): HTMLElement[];

  /**
   * Return current Tool`s input
   *
   * @returns {HTMLElement}
   */
  get currentInput(): HTMLElement;

  /**
   * Set input index to the passed element
   *
   * @param {HTMLElement} element
   */
  set currentInput(element: HTMLElement);
  /**
   * Return first Tool`s input
   *
   * @returns {HTMLElement}
   */
  get firstInput(): HTMLElement;

  /**
   * Return first Tool`s input
   *
   * @returns {HTMLElement}
   */
  get lastInput(): HTMLElement;

  /**
   * Return next Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  get nextInput(): HTMLElement;

  /**
   * Return previous Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  get previousInput(): HTMLElement;

  /**
   * Returns Plugins content
   * @return {Node}
   */
  get pluginsContent(): Node;

  /**
   * Get Block's JSON data
   * @return {Object}
   */
  get data(): BlockToolData;

  /**
   * Returns tool's sanitizer config
   * @return {object}
   */
    get sanitize(): SanitizerConfig;

  /**
   * is block mergeable
   * We plugin have merge function then we call it mergable
   * @return {boolean}
   */
  get mergeable(): boolean;

  /**
   * Check block for emptiness
   * @return {Boolean}
   */
  get isEmpty(): boolean;

  /**
   * Check if block has a media content such as images, iframes and other
   * @return {Boolean}
   */
  get hasMedia(): boolean;

  /**
   * Set selected state
   * @param {Boolean} state - 'true' to select, 'false' to remove selection
   */
  set selected(state: boolean);

  /**
   * Set stretched state
   * @param {Boolean} state - 'true' to enable, 'false' to disable stretched statte
   */
  set stretched(state: boolean);

  public name: string;
  public tool: BlockTool;
  public class: any;
  public settings: object;
  public holder: HTMLDivElement;
  public tunes: BlockTune[];

  /**
   * @constructor
   * @param {String} toolName - Tool name that passed on initialization
   * @param {Object} toolInstance — passed Tool`s instance that rendered the Block
   * @param {Object} toolClass — Tool's class
   * @param {Object} settings - default settings
   * @param {Object} apiMethods - Editor API
   */
  constructor(toolName: string, toolInstance: BlockTool, toolClass: object, settings: object, apiMethods: API);

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
  public async mergeWith(data: object): Promise<void>;

  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   * @return {Object}
   */
  public async save(): Promise<void|{tool: string, data: any, time: number}>;

  /**
   * Uses Tool's validation method to check the correctness of output data
   * Tool's validation method is optional
   *
   * @description Method also can return data if it passed the validation
   *
   * @param {Object} data
   * @returns {Boolean|Object} valid
   */
  public validateData(data: object): object|false;

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

  /**
   * Toggle drop target state
   * @param {boolean} state
   */
  public set dropTarget(state);
}
