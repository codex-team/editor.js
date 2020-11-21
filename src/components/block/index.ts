import {
  BlockAPI as BlockAPIInterface,
  BlockTool,
  BlockToolConstructable,
  BlockToolData,
  BlockTune,
  BlockTuneConstructable,
  SanitizerConfig,
  ToolConfig,
  ToolSettings
} from '../../../types';

import { SavedData } from '../../../types/data-formats';
import $ from '../dom';
import * as _ from '../utils';
import ApiModules from '../modules/api';
import BlockAPI from './api';
import { ToolType } from '../modules/tools';

/** Import default tunes */
import MoveUpTune from '../block-tunes/block-tune-move-up';
import DeleteTune from '../block-tunes/block-tune-delete';
import MoveDownTune from '../block-tunes/block-tune-move-down';
import SelectionUtils from '../selection';

/**
 * Interface describes Block class constructor argument
 */
interface BlockConstructorOptions {
  /**
   * Tool's name
   */
  name: string;

  /**
   * Initial Block data
   */
  data: BlockToolData;

  /**
   * Tool's class or constructor function
   */
  Tool: BlockToolConstructable;

  /**
   * Tool settings from initial config
   */
  settings: ToolSettings;

  /**
   * Editor's API methods
   */
  api: ApiModules;

  /**
   * This flag indicates that the Block should be constructed in the read-only mode.
   */
  readOnly: boolean;
}

/**
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 *
 * @property {BlockTool} tool — current block tool (Paragraph, for example)
 * @property {object} CSS — block`s css classes
 *
 */

/**
 * Available Block Tool API methods
 */
export enum BlockToolAPI {
  /**
   * @todo remove method in 3.0.0
   * @deprecated — use 'rendered' hook instead
   */
  APPEND_CALLBACK = 'appendCallback',
  RENDERED = 'rendered',
  MOVED = 'moved',
  UPDATED = 'updated',
  REMOVED = 'removed',
  ON_PASTE = 'onPaste',
}

/**
 * @classdesc Abstract Block class that contains Block information, Tool name and Tool class instance
 *
 * @property {BlockTool} tool - Tool instance
 * @property {HTMLElement} holder - Div element that wraps block content with Tool's content. Has `ce-block` CSS class
 * @property {HTMLElement} pluginsContent - HTML content that returns by Tool's render function
 */
export default class Block {
  /**
   * CSS classes for the Block
   *
   * @returns {{wrapper: string, content: string}}
   */
  public static get CSS(): {[name: string]: string} {
    return {
      wrapper: 'ce-block',
      wrapperStretched: 'ce-block--stretched',
      content: 'ce-block__content',
      focused: 'ce-block--focused',
      selected: 'ce-block--selected',
      dropTarget: 'ce-block--drop-target',
    };
  }

  /**
   * Block Tool`s name
   */
  public name: string;

  /**
   * Instance of the Tool Block represents
   */
  public tool: BlockTool;

  /**
   * Class blueprint of the ool Block represents
   */
  public class: BlockToolConstructable;

  /**
   * User Tool configuration
   */
  public settings: ToolConfig;

  /**
   * Wrapper for Block`s content
   */
  public holder: HTMLDivElement;

  /**
   * Tunes used by Tool
   */
  public tunes: BlockTune[];

  /**
   * Tool's user configuration
   */
  public readonly config: ToolConfig;

  /**
   * Cached inputs
   *
   * @type {HTMLElement[]}
   */
  private cachedInputs: HTMLElement[] = [];

  /**
   * Editor`s API module
   */
  private readonly api: ApiModules;

  /**
   * Focused input index
   *
   * @type {number}
   */
  private inputIndex = 0;

  /**
   * Mutation observer to handle DOM mutations
   *
   * @type {MutationObserver}
   */
  private mutationObserver: MutationObserver;

  /**
   * Debounce Timer
   *
   * @type {number}
   */
  private readonly modificationDebounceTimer = 450;

  /**
   * Is fired when DOM mutation has been happened
   */
  private didMutated = _.debounce((): void => {
    /**
     * Drop cache
     */
    this.cachedInputs = [];

    /**
     * Update current input
     */
    this.updateCurrentInput();

    this.call(BlockToolAPI.UPDATED);
  }, this.modificationDebounceTimer);

  /**
   * Current block API interface
   */
  private readonly blockAPI: BlockAPIInterface;

  /**
   * @param {object} options - block constructor options
   * @param {string} options.name - Tool name that passed on initialization
   * @param {BlockToolData} options.data - Tool's initial data
   * @param {BlockToolConstructable} options.Tool — Tool's class
   * @param {ToolSettings} options.settings - default tool's config
   * @param options.api - Editor API module for pass it to the Block Tunes
   * @param {boolean} options.readOnly - Read-Only flag
   */
  constructor({
    name,
    data,
    Tool,
    settings,
    api,
    readOnly,
  }: BlockConstructorOptions) {
    this.name = name;
    this.class = Tool;
    this.settings = settings;
    this.config = settings.config || {};
    this.api = api;
    this.blockAPI = new BlockAPI(this);

    this.mutationObserver = new MutationObserver(this.didMutated);

    this.tool = new Tool({
      data,
      config: this.config,
      api: this.api.getMethodsForTool(name, ToolType.Block),
      block: this.blockAPI,
      readOnly,
    });

    this.holder = this.compose();
    /**
     * @type {BlockTune[]}
     */
    this.tunes = this.makeTunes();
  }

  /**
   * Find and return all editable elements (contenteditables and native inputs) in the Tool HTML
   *
   * @returns {HTMLElement[]}
   */
  public get inputs(): HTMLElement[] {
    /**
     * Return from cache if existed
     */
    if (this.cachedInputs.length !== 0) {
      return this.cachedInputs;
    }

    const inputs = $.findAllInputs(this.holder);

    /**
     * If inputs amount was changed we need to check if input index is bigger then inputs array length
     */
    if (this.inputIndex > inputs.length - 1) {
      this.inputIndex = inputs.length - 1;
    }

    /**
     * Cache inputs
     */
    this.cachedInputs = inputs;

    return inputs;
  }

  /**
   * Return current Tool`s input
   *
   * @returns {HTMLElement}
   */
  public get currentInput(): HTMLElement | Node {
    return this.inputs[this.inputIndex];
  }

  /**
   * Set input index to the passed element
   *
   * @param {HTMLElement | Node} element - HTML Element to set as current input
   */
  public set currentInput(element: HTMLElement | Node) {
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
  public get firstInput(): HTMLElement {
    return this.inputs[0];
  }

  /**
   * Return first Tool`s input
   *
   * @returns {HTMLElement}
   */
  public get lastInput(): HTMLElement {
    const inputs = this.inputs;

    return inputs[inputs.length - 1];
  }

  /**
   * Return next Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  public get nextInput(): HTMLElement {
    return this.inputs[this.inputIndex + 1];
  }

  /**
   * Return previous Tool`s input or undefined if it doesn't exist
   *
   * @returns {HTMLElement}
   */
  public get previousInput(): HTMLElement {
    return this.inputs[this.inputIndex - 1];
  }

  /**
   * Get Block's JSON data
   *
   * @returns {object}
   */
  public get data(): Promise<BlockToolData> {
    return this.save().then((savedObject) => {
      if (savedObject && !_.isEmpty(savedObject.data)) {
        return savedObject.data;
      } else {
        return {};
      }
    });
  }

  /**
   * Returns tool's sanitizer config
   *
   * @returns {object}
   */
  public get sanitize(): SanitizerConfig {
    return this.tool.sanitize;
  }

  /**
   * is block mergeable
   * We plugin have merge function then we call it mergable
   *
   * @returns {boolean}
   */
  public get mergeable(): boolean {
    return _.isFunction(this.tool.merge);
  }

  /**
   * Check block for emptiness
   *
   * @returns {boolean}
   */
  public get isEmpty(): boolean {
    const emptyText = $.isEmpty(this.pluginsContent);
    const emptyMedia = !this.hasMedia;

    return emptyText && emptyMedia;
  }

  /**
   * Check if block has a media content such as images, iframes and other
   *
   * @returns {boolean}
   */
  public get hasMedia(): boolean {
    /**
     * This tags represents media-content
     *
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
   * Set focused state
   *
   * @param {boolean} state - 'true' to select, 'false' to remove selection
   */
  public set focused(state: boolean) {
    this.holder.classList.toggle(Block.CSS.focused, state);
  }

  /**
   * Get Block's focused state
   */
  public get focused(): boolean {
    return this.holder.classList.contains(Block.CSS.focused);
  }

  /**
   * Set selected state
   * We don't need to mark Block as Selected when it is empty
   *
   * @param {boolean} state - 'true' to select, 'false' to remove selection
   */
  public set selected(state: boolean) {
    if (state) {
      this.holder.classList.add(Block.CSS.selected);
    } else {
      this.holder.classList.remove(Block.CSS.selected);
    }
  }

  /**
   * Returns True if it is Selected
   *
   * @returns {boolean}
   */
  public get selected(): boolean {
    return this.holder.classList.contains(Block.CSS.selected);
  }

  /**
   * Set stretched state
   *
   * @param {boolean} state - 'true' to enable, 'false' to disable stretched statte
   */
  public set stretched(state: boolean) {
    this.holder.classList.toggle(Block.CSS.wrapperStretched, state);
  }

  /**
   * Return Block's stretched state
   *
   * @returns {boolean}
   */
  public get stretched(): boolean {
    return this.holder.classList.contains(Block.CSS.wrapperStretched);
  }

  /**
   * Toggle drop target state
   *
   * @param {boolean} state - 'true' if block is drop target, false otherwise
   */
  public set dropTarget(state) {
    this.holder.classList.toggle(Block.CSS.dropTarget, state);
  }

  /**
   * Returns Plugins content
   *
   * @returns {HTMLElement}
   */
  public get pluginsContent(): HTMLElement {
    const blockContentNodes = this.holder.querySelector(`.${Block.CSS.content}`);

    if (blockContentNodes && blockContentNodes.childNodes.length) {
      /**
       * Editors Block content can contain different Nodes from extensions
       * We use DOM isExtensionNode to ignore such Nodes and return first Block that does not match filtering list
       */
      for (let child = blockContentNodes.childNodes.length - 1; child >= 0; child--) {
        const contentNode = blockContentNodes.childNodes[child];

        if (!$.isExtensionNode(contentNode)) {
          return contentNode as HTMLElement;
        }
      }
    }

    return null;
  }

  /**
   * Calls Tool's method
   *
   * Method checks tool property {MethodName}. Fires method with passes params If it is instance of Function
   *
   * @param {string} methodName - method to call
   * @param {object} params - method argument
   */
  public call(methodName: string, params?: object): void {
    /**
     * call Tool's method with the instance context
     */
    if (this.tool[methodName] && this.tool[methodName] instanceof Function) {
      if (methodName === BlockToolAPI.APPEND_CALLBACK) {
        _.log(
          '`appendCallback` hook is deprecated and will be removed in the next major release. ' +
          'Use `rendered` hook instead',
          'warn'
        );
      }

      try {
        // eslint-disable-next-line no-useless-call
        this.tool[methodName].call(this.tool, params);
      } catch (e) {
        _.log(`Error during '${methodName}' call: ${e.message}`, 'error');
      }
    }
  }

  /**
   * Call plugins merge method
   *
   * @param {BlockToolData} data - data to merge
   */
  public async mergeWith(data: BlockToolData): Promise<void> {
    await this.tool.merge(data);
  }

  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   *
   * @returns {object}
   */
  public async save(): Promise<void|SavedData> {
    const extractedBlock = await this.tool.save(this.pluginsContent as HTMLElement);

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
          time: measuringEnd - measuringStart,
        };
      })
      .catch((error) => {
        _.log(`Saving proccess for ${this.name} tool failed due to the ${error}`, 'log', 'red');
      });
  }

  /**
   * Uses Tool's validation method to check the correctness of output data
   * Tool's validation method is optional
   *
   * @description Method returns true|false whether data passed the validation or not
   *
   * @param {BlockToolData} data - data to validate
   * @returns {Promise<boolean>} valid
   */
  public async validate(data: BlockToolData): Promise<boolean> {
    let isValid = true;

    if (this.tool.validate instanceof Function) {
      isValid = await this.tool.validate(data);
    }

    return isValid;
  }

  /**
   * Make an array with default settings
   * Each block has default tune instance that have states
   *
   * @returns {BlockTune[]}
   */
  public makeTunes(): BlockTune[] {
    const tunesList = [
      {
        name: 'moveUp',
        Tune: MoveUpTune,
      },
      {
        name: 'delete',
        Tune: DeleteTune,
      },
      {
        name: 'moveDown',
        Tune: MoveDownTune,
      },
    ];

    // Pluck tunes list and return tune instances with passed Editor API and settings
    return tunesList.map(({ name, Tune }: {name: string; Tune: BlockTuneConstructable}) => {
      return new Tune({
        api: this.api.getMethodsForTool(name, ToolType.Tune),
        settings: this.config,
      });
    });
  }

  /**
   * Enumerates initialized tunes and returns fragment that can be appended to the toolbars area
   *
   * @returns {DocumentFragment}
   */
  public renderTunes(): DocumentFragment {
    const tunesElement = document.createDocumentFragment();

    this.tunes.forEach((tune) => {
      $.append(tunesElement, tune.render());
    });

    return tunesElement;
  }

  /**
   * Update current input index with selection anchor node
   */
  public updateCurrentInput(): void {
    /**
     * If activeElement is native input, anchorNode points to its parent.
     * So if it is native input use it instead of anchorNode
     *
     * If anchorNode is undefined, also use activeElement
     */
    this.currentInput = $.isNativeInput(document.activeElement) || !SelectionUtils.anchorNode
      ? document.activeElement
      : SelectionUtils.anchorNode;
  }

  /**
   * Is fired when Block will be selected as current
   */
  public willSelect(): void {
    /**
     * Observe DOM mutations to update Block inputs
     */
    this.mutationObserver.observe(
      this.holder.firstElementChild,
      {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      }
    );

    /**
     * Mutation observer doesn't track changes in "<input>" and "<textarea>"
     * so we need to track focus events to update current input and clear cache.
     */
    this.addInputEvents();
  }

  /**
   * Is fired when Block will be unselected
   */
  public willUnselect(): void {
    this.mutationObserver.disconnect();
    this.removeInputEvents();
  }

  /**
   * Make default Block wrappers and put Tool`s content there
   *
   * @returns {HTMLDivElement}
   */
  private compose(): HTMLDivElement {
    const wrapper = $.make('div', Block.CSS.wrapper) as HTMLDivElement,
        contentNode = $.make('div', Block.CSS.content),
        pluginsContent = this.tool.render();

    contentNode.appendChild(pluginsContent);
    wrapper.appendChild(contentNode);

    return wrapper;
  }

  /**
   * Is fired when text input or contentEditable is focused
   */
  private handleFocus = (): void => {
    /**
     * Drop cache
     */
    this.cachedInputs = [];

    /**
     * Update current input
     */
    this.updateCurrentInput();
  }

  /**
   * Adds focus event listeners to all inputs and contentEditables
   */
  private addInputEvents(): void {
    this.inputs.forEach(input => {
      input.addEventListener('focus', this.handleFocus);
    });
  }

  /**
   * removes focus event listeners from all inputs and contentEditables
   */
  private removeInputEvents(): void {
    this.inputs.forEach(input => {
      input.removeEventListener('focus', this.handleFocus);
    });
  }
}
