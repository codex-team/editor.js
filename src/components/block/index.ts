import {
  BlockAPI as BlockAPIInterface,
  BlockTool as IBlockTool,
  BlockToolData,
  BlockTune as IBlockTune,
  SanitizerConfig,
  ToolConfig,
  ToolboxConfigEntry,
  PopoverItemParams
} from '../../../types';

import { SavedData } from '../../../types/data-formats';
import $, { toggleEmptyMark } from '../dom';
import * as _ from '../utils';
import ApiModules from '../modules/api';
import BlockAPI from './api';
import SelectionUtils from '../selection';
import BlockTool from '../tools/block';

import BlockTune from '../tools/tune';
import { BlockTuneData } from '../../../types/block-tunes/block-tune-data';
import ToolsCollection from '../tools/collection';
import EventsDispatcher from '../utils/events';
import { TunesMenuConfigItem } from '../../../types/tools';
import { isMutationBelongsToElement } from '../utils/mutations';
import { EditorEventMap, FakeCursorAboutToBeToggled, FakeCursorHaveBeenSet, RedactorDomChanged } from '../events';
import { RedactorDomChangedPayload } from '../events/RedactorDomChanged';
import { convertBlockDataToString, isSameBlockData } from '../utils/blocks';
import { PopoverItemType } from '../utils/popover';

/**
 * Interface describes Block class constructor argument
 */
interface BlockConstructorOptions {
  /**
   * Block's id. Should be passed for existed block, and omitted for a new one.
   */
  id?: string;

  /**
   * Initial Block data
   */
  data: BlockToolData;

  /**
   * Tool object
   */
  tool: BlockTool;

  /**
   * Editor's API methods
   */
  api: ApiModules;

  /**
   * This flag indicates that the Block should be constructed in the read-only mode.
   */
  readOnly: boolean;

  /**
   * Tunes data for current Block
   */
  tunesData: { [name: string]: BlockTuneData };
}

/**
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 * @property {BlockTool} tool — current block tool (Paragraph, for example)
 * @property {object} CSS — block`s css classes
 */

/**
 * Available Block Tool API methods
 */
export enum BlockToolAPI {
  /**
   * @todo remove method in 3.0.0
   * @deprecated — use 'rendered' hook instead
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  APPEND_CALLBACK = 'appendCallback',
  RENDERED = 'rendered',
  MOVED = 'moved',
  UPDATED = 'updated',
  REMOVED = 'removed',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ON_PASTE = 'onPaste',
}

/**
 * Names of events used in Block
 */
interface BlockEvents {
  'didMutated': Block,
}

/**
 * @classdesc Abstract Block class that contains Block information, Tool name and Tool class instance
 * @property {BlockTool} tool - Tool instance
 * @property {HTMLElement} holder - Div element that wraps block content with Tool's content. Has `ce-block` CSS class
 * @property {HTMLElement} pluginsContent - HTML content that returns by Tool's render function
 */
export default class Block extends EventsDispatcher<BlockEvents> {
  /**
   * CSS classes for the Block
   *
   * @returns {{wrapper: string, content: string}}
   */
  public static get CSS(): { [name: string]: string } {
    return {
      wrapper: 'ce-block',
      wrapperStretched: 'ce-block--stretched',
      content: 'ce-block__content',
      selected: 'ce-block--selected',
      dropTarget: 'ce-block--drop-target',
    };
  }

  /**
   * Block unique identifier
   */
  public id: string;

  /**
   * Block Tool`s name
   */
  public readonly name: string;

  /**
   * Instance of the Tool Block represents
   */
  public readonly tool: BlockTool;

  /**
   * User Tool configuration
   */
  public readonly settings: ToolConfig;

  /**
   * Wrapper for Block`s content
   */
  public readonly holder: HTMLDivElement;

  /**
   * Tunes used by Tool
   */
  public readonly tunes: ToolsCollection<BlockTune>;

  /**
   * Tool's user configuration
   */
  public readonly config: ToolConfig;

  /**
   * Cached inputs
   */
  private cachedInputs: HTMLElement[] = [];

  /**
   * We'll store a reference to the tool's rendered element to access it later
   */
  private toolRenderedElement: HTMLElement | null = null;

  /**
   * Tool class instance
   */
  private readonly toolInstance: IBlockTool;

  /**
   * User provided Block Tunes instances
   */
  private readonly tunesInstances: Map<string, IBlockTune> = new Map();

  /**
   * Editor provided Block Tunes instances
   */
  private readonly defaultTunesInstances: Map<string, IBlockTune> = new Map();

  /**
   * If there is saved data for Tune which is not available at the moment,
   * we will store it here and provide back on save so data is not lost
   */
  private unavailableTunesData: { [name: string]: BlockTuneData } = {};

  /**
   * Focused input index
   *
   * @type {number}
   */
  private inputIndex = 0;

  /**
   * Common editor event bus
   */
  private readonly editorEventBus: EventsDispatcher<EditorEventMap> | null = null;

  /**
   * Link to editor dom change callback. Used to remove listener on remove
   */
  private redactorDomChangedCallback: (payload: RedactorDomChangedPayload) => void;

  /**
   * Current block API interface
   */
  private readonly blockAPI: BlockAPIInterface;

  /**
   * @param options - block constructor options
   * @param [options.id] - block's id. Will be generated if omitted.
   * @param options.data - Tool's initial data
   * @param options.tool — block's tool
   * @param options.api - Editor API module for pass it to the Block Tunes
   * @param options.readOnly - Read-Only flag
   * @param [eventBus] - Editor common event bus. Allows to subscribe on some Editor events. Could be omitted when "virtual" Block is created. See BlocksAPI@composeBlockData.
   */
  constructor({
    id = _.generateBlockId(),
    data,
    tool,
    readOnly,
    tunesData,
  }: BlockConstructorOptions, eventBus?: EventsDispatcher<EditorEventMap>) {
    super();
    this.name = tool.name;
    this.id = id;
    this.settings = tool.settings;
    this.config = tool.settings.config || {};
    this.editorEventBus = eventBus || null;
    this.blockAPI = new BlockAPI(this);

    this.tool = tool;
    this.toolInstance = tool.create(data, this.blockAPI, readOnly);

    /**
     * @type {BlockTune[]}
     */
    this.tunes = tool.tunes;

    this.composeTunes(tunesData);

    this.holder = this.compose();

    /**
     * Bind block events in RIC for optimizing of constructing process time
     */
    window.requestIdleCallback(() => {
      /**
       * Start watching block mutations
       */
      this.watchBlockMutations();

      /**
       * Mutation observer doesn't track changes in "<input>" and "<textarea>"
       * so we need to track focus events to update current input and clear cache.
       */
      this.addInputEvents();

      /**
       * We mark inputs with [data-empty] attribute
       * It can be useful for developers, for example for correct placeholder behavior
       */
      this.toggleInputsEmptyMark();
    });
  }

  /**
   * Find and return all editable elements (contenteditable and native inputs) in the Tool HTML
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
   * If Block doesn't contain inputs, return undefined
   */
  public get currentInput(): HTMLElement | undefined {
    return this.inputs[this.inputIndex];
  }

  /**
   * Set input index to the passed element
   *
   * @param element - HTML Element to set as current input
   */
  public set currentInput(element: HTMLElement) {
    const index = this.inputs.findIndex((input) => input === element || input.contains(element));

    if (index !== -1) {
      this.inputIndex = index;
    }
  }

  /**
   * Return first Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  public get firstInput(): HTMLElement | undefined {
    return this.inputs[0];
  }

  /**
   * Return first Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  public get lastInput(): HTMLElement | undefined {
    const inputs = this.inputs;

    return inputs[inputs.length - 1];
  }

  /**
   * Return next Tool`s input or undefined if it doesn't exist
   * If Block doesn't contain inputs, return undefined
   */
  public get nextInput(): HTMLElement | undefined {
    return this.inputs[this.inputIndex + 1];
  }

  /**
   * Return previous Tool`s input or undefined if it doesn't exist
   * If Block doesn't contain inputs, return undefined
   */
  public get previousInput(): HTMLElement | undefined {
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
    return this.tool.sanitizeConfig;
  }

  /**
   * is block mergeable
   * We plugin have merge function then we call it mergeable
   *
   * @returns {boolean}
   */
  public get mergeable(): boolean {
    return _.isFunction(this.toolInstance.merge);
  }

  /**
   * If Block contains inputs, it is focusable
   */
  public get focusable(): boolean {
    return this.inputs.length !== 0;
  }

  /**
   * Check block for emptiness
   *
   * @returns {boolean}
   */
  public get isEmpty(): boolean {
    const emptyText = $.isEmpty(this.pluginsContent, '/');
    const emptyMedia = !this.hasMedia;

    return emptyText && emptyMedia;
  }

  /**
   * Check if block has a media content such as images, iframe and other
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
   * Set selected state
   * We don't need to mark Block as Selected when it is empty
   *
   * @param {boolean} state - 'true' to select, 'false' to remove selection
   */
  public set selected(state: boolean) {
    this.holder.classList.toggle(Block.CSS.selected, state);

    const fakeCursorWillBeAdded = state === true && SelectionUtils.isRangeInsideContainer(this.holder);
    const fakeCursorWillBeRemoved = state === false && SelectionUtils.isFakeCursorInsideContainer(this.holder);

    if (fakeCursorWillBeAdded || fakeCursorWillBeRemoved) {
      this.editorEventBus?.emit(FakeCursorAboutToBeToggled, { state }); // mutex

      if (fakeCursorWillBeAdded) {
        SelectionUtils.addFakeCursor();
      } else {
        SelectionUtils.removeFakeCursor(this.holder);
      }

      this.editorEventBus?.emit(FakeCursorHaveBeenSet, { state });
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
   * @param {boolean} state - 'true' to enable, 'false' to disable stretched state
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
    return this.toolRenderedElement;
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
    if (_.isFunction(this.toolInstance[methodName])) {
      if (methodName === BlockToolAPI.APPEND_CALLBACK) {
        _.log(
          '`appendCallback` hook is deprecated and will be removed in the next major release. ' +
          'Use `rendered` hook instead',
          'warn'
        );
      }

      try {
        // eslint-disable-next-line no-useless-call
        this.toolInstance[methodName].call(this.toolInstance, params);
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
    await this.toolInstance.merge(data);
  }

  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   *
   * @returns {object}
   */
  public async save(): Promise<undefined | SavedData> {
    const extractedBlock = await this.toolInstance.save(this.pluginsContent as HTMLElement);
    const tunesData: { [name: string]: BlockTuneData } = this.unavailableTunesData;

    [
      ...this.tunesInstances.entries(),
      ...this.defaultTunesInstances.entries(),
    ]
      .forEach(([name, tune]) => {
        if (_.isFunction(tune.save)) {
          try {
            tunesData[name] = tune.save();
          } catch (e) {
            _.log(`Tune ${tune.constructor.name} save method throws an Error %o`, 'warn', e);
          }
        }
      });

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
          id: this.id,
          tool: this.name,
          data: finishedExtraction,
          tunes: tunesData,
          time: measuringEnd - measuringStart,
        };
      })
      .catch((error) => {
        _.log(`Saving process for ${this.name} tool failed due to the ${error}`, 'log', 'red');
      });
  }

  /**
   * Uses Tool's validation method to check the correctness of output data
   * Tool's validation method is optional
   *
   * @description Method returns true|false whether data passed the validation or not
   * @param {BlockToolData} data - data to validate
   * @returns {Promise<boolean>} valid
   */
  public async validate(data: BlockToolData): Promise<boolean> {
    let isValid = true;

    if (this.toolInstance.validate instanceof Function) {
      isValid = await this.toolInstance.validate(data);
    }

    return isValid;
  }

  /**
   * Returns data to render in Block Tunes menu.
   * Splits block tunes into 2 groups: block specific tunes and common tunes
   */
  public getTunes(): {
    toolTunes: PopoverItemParams[];
    commonTunes: PopoverItemParams[];
    } {
    const toolTunesPopoverParams: TunesMenuConfigItem[] = [];
    const commonTunesPopoverParams: TunesMenuConfigItem[] = [];

    /** Tool's tunes: may be defined as return value of optional renderSettings method */
    const tunesDefinedInTool = typeof this.toolInstance.renderSettings === 'function' ? this.toolInstance.renderSettings() : [];

    if ($.isElement(tunesDefinedInTool)) {
      toolTunesPopoverParams.push({
        type: PopoverItemType.Html,
        element: tunesDefinedInTool,
      });
    } else if (Array.isArray(tunesDefinedInTool)) {
      toolTunesPopoverParams.push(...tunesDefinedInTool);
    } else {
      toolTunesPopoverParams.push(tunesDefinedInTool);
    }

    /** Common tunes: combination of default tunes (move up, move down, delete) and third-party tunes connected via tunes api */
    const commonTunes = [
      ...this.tunesInstances.values(),
      ...this.defaultTunesInstances.values(),
    ].map(tuneInstance => tuneInstance.render());

    /** Separate custom html from Popover items params for common tunes */
    commonTunes.forEach(tuneConfig => {
      if ($.isElement(tuneConfig)) {
        commonTunesPopoverParams.push({
          type: PopoverItemType.Html,
          element: tuneConfig,
        });
      } else if (Array.isArray(tuneConfig)) {
        commonTunesPopoverParams.push(...tuneConfig);
      } else {
        commonTunesPopoverParams.push(tuneConfig);
      }
    });

    return {
      toolTunes: toolTunesPopoverParams,
      commonTunes: commonTunesPopoverParams,
    };
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
   * Allows to say Editor that Block was changed. Used to manually trigger Editor's 'onChange' callback
   * Can be useful for block changes invisible for editor core.
   */
  public dispatchChange(): void {
    this.didMutated();
  }

  /**
   * Call Tool instance destroy method
   */
  public destroy(): void {
    this.unwatchBlockMutations();
    this.removeInputEvents();

    super.destroy();

    if (_.isFunction(this.toolInstance.destroy)) {
      this.toolInstance.destroy();
    }
  }

  /**
   * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
   * This method returns the entry that is related to the Block (depended on the Block data)
   */
  public async getActiveToolboxEntry(): Promise<ToolboxConfigEntry | undefined> {
    const toolboxSettings = this.tool.toolbox;

    /**
     * If Tool specifies just the single entry, treat it like an active
     */
    if (toolboxSettings.length === 1) {
      return Promise.resolve(this.tool.toolbox[0]);
    }

    /**
     * If we have several entries with their own data overrides,
     * find those who matches some current data property
     *
     * Example:
     *  Tools' toolbox: [
     *    {title: "Heading 1", data: {level: 1} },
     *    {title: "Heading 2", data: {level: 2} }
     *  ]
     *
     *  the Block data: {
     *    text: "Heading text",
     *    level: 2
     *  }
     *
     *  that means that for the current block, the second toolbox item (matched by "{level: 2}") is active
     */
    const blockData = await this.data;
    const toolboxItems = toolboxSettings;

    return toolboxItems?.find((item) => {
      return isSameBlockData(item.data, blockData);
    });
  }

  /**
   * Exports Block data as string using conversion config
   */
  public async exportDataAsString(): Promise<string> {
    const blockData = await this.data;

    return convertBlockDataToString(blockData, this.tool.conversionConfig);
  }

  /**
   * Make default Block wrappers and put Tool`s content there
   *
   * @returns {HTMLDivElement}
   */
  private compose(): HTMLDivElement {
    const wrapper = $.make('div', Block.CSS.wrapper) as HTMLDivElement,
        contentNode = $.make('div', Block.CSS.content),
        pluginsContent = this.toolInstance.render();

    if (import.meta.env.MODE === 'test') {
      wrapper.setAttribute('data-cy', 'block-wrapper');
    }

    /**
     * Export id to the DOM three
     * Useful for standalone modules development. For example, allows to identify Block by some child node. Or scroll to a particular Block by id.
     */
    wrapper.dataset.id = this.id;

    /**
     * Saving a reference to plugin's content element for guaranteed accessing it later
     */
    this.toolRenderedElement = pluginsContent;

    contentNode.appendChild(this.toolRenderedElement);

    /**
     * Block Tunes might wrap Block's content node to provide any UI changes
     *
     * <tune2wrapper>
     *   <tune1wrapper>
     *     <blockContent />
     *   </tune1wrapper>
     * </tune2wrapper>
     */
    let wrappedContentNode: HTMLElement = contentNode;

    [...this.tunesInstances.values(), ...this.defaultTunesInstances.values()]
      .forEach((tune) => {
        if (_.isFunction(tune.wrap)) {
          try {
            wrappedContentNode = tune.wrap(wrappedContentNode);
          } catch (e) {
            _.log(`Tune ${tune.constructor.name} wrap method throws an Error %o`, 'warn', e);
          }
        }
      });

    wrapper.appendChild(wrappedContentNode);

    return wrapper;
  }

  /**
   * Instantiate Block Tunes
   *
   * @param tunesData - current Block tunes data
   * @private
   */
  private composeTunes(tunesData: { [name: string]: BlockTuneData }): void {
    Array.from(this.tunes.values()).forEach((tune) => {
      const collection = tune.isInternal ? this.defaultTunesInstances : this.tunesInstances;

      collection.set(tune.name, tune.create(tunesData[tune.name], this.blockAPI));
    });

    /**
     * Check if there is some data for not available tunes
     */
    Object.entries(tunesData).forEach(([name, data]) => {
      if (!this.tunesInstances.has(name)) {
        this.unavailableTunesData[name] = data;
      }
    });
  }

  /**
   * Is fired when text input or contentEditable is focused
   */
  private handleFocus = (): void => {
    /**
     * Drop inputs cache to query the new ones
     */
    this.dropInputsCache();

    /**
     * Update current input
     */
    this.updateCurrentInput();
  };

  /**
   * Adds focus event listeners to all inputs and contenteditable
   */
  private addInputEvents(): void {
    this.inputs.forEach(input => {
      input.addEventListener('focus', this.handleFocus);

      /**
       * If input is native input add oninput listener to observe changes
       */
      if ($.isNativeInput(input)) {
        input.addEventListener('input', this.didMutated as EventListener);
      }
    });
  }

  /**
   * removes focus event listeners from all inputs and contenteditable
   */
  private removeInputEvents(): void {
    this.inputs.forEach(input => {
      input.removeEventListener('focus', this.handleFocus);

      if ($.isNativeInput(input)) {
        input.removeEventListener('input', this.didMutated as EventListener);
      }
    });
  }

  /**
   * Is fired when DOM mutation has been happened
   *
   * @param mutationsOrInputEvent - actual changes
   *   - MutationRecord[] - any DOM change
   *   - InputEvent — <input> change
   *   - undefined — manual triggering of block.dispatchChange()
   */
  private readonly didMutated = (mutationsOrInputEvent: MutationRecord[] | InputEvent = undefined): void => {
    /**
     * Block API have dispatchChange() method. In this case, mutations list will be undefined.
     */
    const isManuallyDispatched = mutationsOrInputEvent === undefined;

    /**
     * True if didMutated has been called as "input" event handler
     */
    const isInputEventHandler = mutationsOrInputEvent instanceof InputEvent;

    /**
     * If tool updates its own root element, we need to renew it in our memory
     */
    if (!isManuallyDispatched && !isInputEventHandler) {
      this.detectToolRootChange(mutationsOrInputEvent);
    }

    /**
     * We won't fire a Block mutation event if mutation contain only nodes marked with 'data-mutation-free' attributes
     */
    let shouldFireUpdate;

    if (isManuallyDispatched) {
      shouldFireUpdate = true;
    } else if (isInputEventHandler) {
      shouldFireUpdate = true;
    } else {
      /**
       * Update from 2023, Feb 17:
       *    Changed mutationsOrInputEvent.some() to mutationsOrInputEvent.every()
       *    since there could be a real mutations same-time with mutation-free changes,
       *    for example when Block Tune change: block is changing along with FakeCursor (mutation-free) removing
       *    — we should fire 'didMutated' event in that case
       */
      const everyRecordIsMutationFree = mutationsOrInputEvent.length > 0 && mutationsOrInputEvent.every((record) => {
        const { addedNodes, removedNodes, target } = record;
        const changedNodes = [
          ...Array.from(addedNodes),
          ...Array.from(removedNodes),
          target,
        ];

        return changedNodes.some((node) => {
          if (!$.isElement(node)) {
            /**
             * "characterData" mutation record has Text node as a target, so we need to get parent element to check it for mutation-free attribute
             */
            node = node.parentElement;
          }

          return node && (node as HTMLElement).closest('[data-mutation-free="true"]') !== null;
        });
      });

      shouldFireUpdate = !everyRecordIsMutationFree;
    }

    /**
     * In case some mutation free elements are added or removed, do not trigger didMutated event
     */
    if (!shouldFireUpdate) {
      return;
    }

    this.dropInputsCache();

    /**
     * Update current input
     */
    this.updateCurrentInput();

    /**
     * We mark inputs with 'data-empty' attribute, so new inputs should be marked as well
     */
    this.toggleInputsEmptyMark();

    this.call(BlockToolAPI.UPDATED);

    /**
     * Emit a Block Event with current Block instance.
     * Block Manager subscribed to these events
     */
    this.emit('didMutated', this);
  };

  /**
   * Listen common editor Dom Changed event and detect mutations related to the  Block
   */
  private watchBlockMutations(): void {
    /**
     * Save callback to a property to remove it on Block destroy
     *
     * @param payload - event payload
     */
    this.redactorDomChangedCallback = (payload) => {
      const { mutations } = payload;

      const mutationBelongsToBlock = mutations.some(record => isMutationBelongsToElement(record, this.toolRenderedElement));

      if (mutationBelongsToBlock) {
        this.didMutated(mutations);
      }
    };

    this.editorEventBus?.on(RedactorDomChanged, this.redactorDomChangedCallback);
  }

  /**
   * Remove redactor dom change event listener
   */
  private unwatchBlockMutations(): void {
    this.editorEventBus?.off(RedactorDomChanged, this.redactorDomChangedCallback);
  }

  /**
   * Sometimes Tool can replace own main element, for example H2 -> H4 or UL -> OL
   * We need to detect such changes and update a link to tools main element with the new one
   *
   * @param mutations - records of block content mutations
   */
  private detectToolRootChange(mutations: MutationRecord[]): void {
    mutations.forEach(record => {
      const toolRootHasBeenUpdated = Array.from(record.removedNodes).includes(this.toolRenderedElement);

      if (toolRootHasBeenUpdated) {
        const newToolElement = record.addedNodes[record.addedNodes.length - 1];

        this.toolRenderedElement = newToolElement as HTMLElement;
      }
    });
  }

  /**
   * Clears inputs cached value
   */
  private dropInputsCache(): void {
    this.cachedInputs = [];
  }

  /**
   * Mark inputs with 'data-empty' attribute with the empty state
   */
  private toggleInputsEmptyMark(): void {
    this.inputs.forEach(toggleEmptyMark);
  }
}
