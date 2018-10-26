import IBlockTune, {IBlockTuneConstructor} from './interfaces/block-tune';
import $ from './dom';
import _ from './utils';

type Tool = any;

/**
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 *
 * @property {Tool} tool — current block tool (Paragraph, for example)
 * @property {Object} CSS — block`s css classes
 *
 */

/** Import default tunes */
import MoveUpTune from './block-tunes/block-tune-move-up';
import DeleteTune from './block-tunes/block-tune-delete';
import MoveDownTune from './block-tunes/block-tune-move-down';
import {IAPI} from './interfaces/api';

/**
 * @classdesc Abstract Block class that contains Block information, Tool name and Tool class instance
 *
 * @property tool - Tool instance
 * @property html - Returns HTML content of plugin
 * @property holder - Div element that wraps block content with Tool's content. Has `ce-block` CSS class
 * @property pluginsContent - HTML content that returns by Tool's render function
 */
export default class Block {

  /**
   * CSS classes for the Block
   * @return {{wrapper: string, content: string}}
   */
  static get CSS(): {wrapper: string, wrapperStretched: string, content: string, selected: string, dropTarget: string} {
    return {
      wrapper: 'ce-block',
      wrapperStretched: 'ce-block--stretched',
      content: 'ce-block__content',
      selected: 'ce-block--selected',
      dropTarget: 'ce-block--drop-target',
    };
  }

  /**
   * Find and return all editable elements (contenteditables and native inputs) in the Tool HTML
   *
   * @returns {HTMLElement[]}
   */
  get inputs(): HTMLElement[] {
    const content = this.holder;
    const allowedInputTypes = ['text', 'password', 'email', 'number', 'search', 'tel', 'url'];

    const selector = '[contenteditable], textarea, input, '
      + allowedInputTypes.map((type) => `input[type="${type}"]`).join(', ');

    const inputs = _.array(content.querySelectorAll(selector));

    /**
     * If inputs amount was changed we need to check if input index is bigger then inputs array length
     */
    if (this.inputIndex > inputs.length - 1) {
      this.inputIndex = inputs.length - 1;
    }

    return inputs;
  }

  /**
   * Return current Tool`s input
   *
   * @returns {HTMLElement}
   */
  get currentInput(): HTMLElement {
    return this.inputs[this.inputIndex];
  }

  /**
   * Set input index to the passed element
   *
   * @param {HTMLElement} element
   */
  set currentInput(element: HTMLElement) {
    const index = this.inputs.findIndex((input) => input === element || input.contains(element));

    if (index !== -1) {
      this.inputIndex = index;
    }
  }

  /**
   * Return first Tool`s input
   *
   * @returns {HTMLElement}
   */
  get firstInput(): HTMLElement {
    return this.inputs[0];
  }

  /**
   * Return first Tool`s input
   *
   * @returns {HTMLElement}
   */
  get lastInput(): HTMLElement {
    const inputs = this.inputs;

    return inputs[inputs.length - 1];
  }

  /**
   * Return next Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  get nextInput(): HTMLElement {
    return this.inputs[this.inputIndex + 1];
  }

  /**
   * Return previous Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  get previousInput(): HTMLElement {
    return this.inputs[this.inputIndex - 1];
  }

  /**
   * Returns Plugins content
   * @return {Node}
   */
  get pluginsContent(): Node {
    const pluginsContent = this.holder.querySelector(`.${Block.CSS.content}`);

    if (pluginsContent && pluginsContent.childNodes.length) {
      return pluginsContent.childNodes[0];
    }

    return null;
  }

  /**
   * Get Block's JSON data
   * @return {Object}
   */
  get data(): object {
    return this.save();
  }

  /**
   * Returns tool's sanitizer config
   * @return {object}
   */
  get sanitize(): object {
    return this.tool.sanitize;
  }

  /**
   * is block mergeable
   * We plugin have merge function then we call it mergable
   * @return {boolean}
   */
  get mergeable(): boolean {
    return typeof this.tool.merge === 'function';
  }

  /**
   * Check block for emptiness
   * @return {Boolean}
   */
  get isEmpty(): boolean {
    /**
     * Allow Tool to represent decorative contentless blocks: for example "* * *"-tool
     * That Tools are not empty
     */
    if (this.class.contentless) {
      return false;
    }

    const emptyText = $.isEmpty(this.pluginsContent),
      emptyMedia = !this.hasMedia;

    return emptyText && emptyMedia;
  }

  /**
   * Check if block has a media content such as images, iframes and other
   * @return {Boolean}
   */
  get hasMedia(): boolean {
    /**
     * This tags represents media-content
     * @type {string[]}
     */
    const mediaTags = [
      'img',
      'iframe',
      'video',
      'audio',
      'source',
      'input',
      'textarea',
      'twitterwidget',
    ];

    return !!this.holder.querySelector(mediaTags.join(','));
  }

  /**
   * Set selected state
   * @param {Boolean} state - 'true' to select, 'false' to remove selection
   */
  set selected(state: boolean) {
    /**
     * We don't need to mark Block as Selected when it is not empty
     */
    if (state === true && !this.isEmpty) {
      this.holder.classList.add(Block.CSS.selected);
    } else {
      this.holder.classList.remove(Block.CSS.selected);
    }
  }

  /**
   * Set stretched state
   * @param {Boolean} state - 'true' to enable, 'false' to disable stretched statte
   */
  set stretched(state: boolean) {
    this.holder.classList.toggle(Block.CSS.wrapperStretched, state);
  }

  public name: string;
  public tool: Tool;
  public class: any;
  public settings: object;
  public holder: HTMLDivElement;
  public tunes: IBlockTune[];
  private readonly api: IAPI;
  private inputIndex = 0;

  /**
   * @constructor
   * @param {String} toolName - Tool name that passed on initialization
   * @param {Object} toolInstance — passed Tool`s instance that rendered the Block
   * @param {Object} toolClass — Tool's class
   * @param {Object} settings - default settings
   * @param {Object} apiMethods - Editor API
   */
  constructor(toolName: string, toolInstance: Tool, toolClass: object, settings: object, apiMethods: IAPI) {
    this.name = toolName;
    this.tool = toolInstance;
    this.class = toolClass;
    this.settings = settings;
    this.api = apiMethods;
    this.holder = this.compose();

    /**
     * @type {IBlockTune[]}
     */
    this.tunes = this.makeTunes();
  }

  /**
   * Calls Tool's method
   *
   * Method checks tool property {MethodName}. Fires method with passes params If it is instance of Function
   *
   * @param {String} methodName
   * @param {Object} params
   */
  public call(methodName: string, params: object) {
    /**
     * call Tool's method with the instance context
     */
    if (this.tool[methodName] && this.tool[methodName] instanceof Function) {
      this.tool[methodName].call(this.tool, params);
    }
  }

  /**
   * Call plugins merge method
   * @param {Object} data
   */
  public async mergeWith(data: object): Promise<void> {
      await this.tool.merge(data);
  }
  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   * @return {Object}
   */
  public async save(): Promise<void|{tool: string, data: any, time: number}> {
    const extractedBlock = await this.tool.save(this.pluginsContent);

    /**
     * Measuring execution time
     */
    const measuringStart = window.performance.now();
    let measuringEnd;

    return Promise.resolve(extractedBlock)
      .then((finishedExtraction) => {
        /** measure promise execution */
        measuringEnd = window.performance.now();

        return {
          tool: this.name,
          data: finishedExtraction,
          time : measuringEnd - measuringStart,
        };
      })
      .catch(function(error) {
        _.log(`Saving proccess for ${this.tool.name} tool failed due to the ${error}`, 'log', 'red');
      });
  }

  /**
   * Uses Tool's validation method to check the correctness of output data
   * Tool's validation method is optional
   *
   * @description Method also can return data if it passed the validation
   *
   * @param {Object} data
   * @returns {Boolean|Object} valid
   */
  public validateData(data: object): object|false {
    let isValid = true;

    if (this.tool.validate instanceof Function) {
      isValid = this.tool.validate(data);
    }

    if (!isValid) {
      return false;
    }

    return data;
  }

  /**
   * Make an array with default settings
   * Each block has default tune instance that have states
   * @return {IBlockTune[]}
   */
  public makeTunes(): IBlockTune[] {
    const tunesList = [MoveUpTune, DeleteTune, MoveDownTune];

    // Pluck tunes list and return tune instances with passed Editor API and settings
    return tunesList.map( (tune: IBlockTuneConstructor) => {
      return new tune({
        api: this.api,
        settings: this.settings,
      });
    });
  }

  /**
   * Enumerates initialized tunes and returns fragment that can be appended to the toolbars area
   * @return {DocumentFragment}
   */
  public renderTunes(): DocumentFragment {
    const tunesElement = document.createDocumentFragment();

    this.tunes.forEach( (tune) => {
      $.append(tunesElement, tune.render());
    });

    return tunesElement;
  }

  /**
   * Toggle drop target state
   * @param {boolean} state
   */
  public set dropTarget(state) {
    this.holder.classList.toggle(Block.CSS.dropTarget, state);
  }

  /**
   * Make default Block wrappers and put Tool`s content there
   * @returns {HTMLDivElement}
   */
  private compose(): HTMLDivElement {
    const wrapper = $.make('div', Block.CSS.wrapper) as HTMLDivElement,
      contentNode = $.make('div', Block.CSS.content),
      pluginsContent  = this.tool.render();

    contentNode.appendChild(pluginsContent);
    wrapper.appendChild(contentNode);
    return wrapper;
  }
}
