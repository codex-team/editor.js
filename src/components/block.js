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
   * @constructor
   * @param {String} toolName - Tool name that passed on initialization
   * @param {Object} toolInstance — passed Tool`s instance that rendered the Block
   * @param {Object} settings - default settings
   * @param {Object} apiMethods - Editor API
   */
  constructor(toolName, toolInstance, settings, apiMethods) {
    this.name = toolName;
    this.tool = toolInstance;
    this.settings = settings;
    this.api = apiMethods;
    this.holder = this.compose();
    this.inputIndex = 0;

    /**
     * @type {IBlockTune[]}
     */
    this.tunes = this.makeTunes();
  }

  /**
   * CSS classes for the Block
   * @return {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      wrapper: 'ce-block',
      wrapperStretched: 'ce-block--stretched',
      content: 'ce-block__content',
      selected: 'ce-block--selected'
    };
  }

  /**
   * Make default Block wrappers and put Tool`s content there
   * @returns {HTMLDivElement}
   */
  compose() {
    let wrapper = $.make('div', Block.CSS.wrapper),
      contentNode = $.make('div', Block.CSS.content),
      pluginsContent  = this.tool.render();

    contentNode.appendChild(pluginsContent);
    wrapper.appendChild(contentNode);
    return wrapper;
  }

  /**
   * Calls Tool's method
   *
   * Method checks tool property {MethodName}. Fires method with passes params If it is instance of Function
   *
   * @param {String} methodName
   * @param {Object} params
   */
  call(methodName, params) {
    /**
     * call Tool's method with the instance context
     */
    if (this.tool[methodName] && this.tool[methodName] instanceof Function) {
      this.tool[methodName].call(this.tool, params);
    }
  }

  get inputs() {
    const content = this.holder;

    const inputs = content.querySelectorAll('[contenteditable], textarea, input');

    return _.array(inputs);
  }

  get currentInput() {
    return this.inputs[this.inputIndex];
  }

  get nextInput() {
    return this.inputs[this.inputIndex + 1];
  }

  get previousInput() {
    return this.inputs[this.inputIndex - 1];
  }

  setToNextInput() {
    this.inputIndex++;
    this.focusInput(null, 'start');
  }

  setToPreviousInput() {
    this.inputIndex--;
    this.focusInput(null, 'end');
  }

  focusInput(element, position) {
    const inputs = this.inputs;

    if (element) {
      const inputIndex = inputs.findIndex(input => input.contains(element));

      if (inputIndex !== -1) {
        this.inputIndex = inputIndex;
      }
      return;
    }

    const input = inputs[this.inputIndex];
    let nodeToSet;

    switch (position) {
      case 'start':
        nodeToSet = $.getDeepestNode(input);

        this.api.caret.set(nodeToSet, 0);
        break;

      case 'end':
        nodeToSet = $.getDeepestNode(input);
        const contentLength = $.isNativeInput(nodeToSet) ? nodeToSet.value.length : nodeToSet.length;

        this.api.caret.set(nodeToSet, contentLength);
        break;

      default:
        input.focus();
    }
  }

  /**
   * Returns Plugins content
   * @return {Node}
   */
  get pluginsContent() {
    let pluginsContent = this.holder.querySelector(`.${Block.CSS.content}`);

    if (pluginsContent && pluginsContent.childNodes.length) {
      return pluginsContent.childNodes[0];
    }

    return null;
  }

  /**
   * Get Block's JSON data
   * @return {Object}
   */
  get data() {
    return this.save();
  }

  /**
   * is block mergeable
   * We plugin have merge function then we call it mergable
   * @return {boolean}
   */
  get mergeable() {
    return typeof this.tool.merge === 'function';
  }

  /**
   * Call plugins merge method
   * @param {Object} data
   */
  mergeWith(data) {
    return Promise.resolve()
      .then(() => {
        this.tool.merge(data);
      });
  }
  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   * @return {Object}
   */
  save() {
    let extractedBlock = this.tool.save(this.pluginsContent);

    /** Measuring execution time*/
    let measuringStart = window.performance.now(),
      measuringEnd;

    return Promise.resolve(extractedBlock)
      .then((finishedExtraction) => {
        /** measure promise execution */
        measuringEnd = window.performance.now();

        return {
          tool: this.name,
          data: finishedExtraction,
          time : measuringEnd - measuringStart
        };
      })
      .catch(function (error) {
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
  validateData(data) {
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
  makeTunes() {
    let tunesList = [MoveUpTune, DeleteTune, MoveDownTune];

    // Pluck tunes list and return tune instances with passed Editor API and settings
    return tunesList.map( (tune) => {
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
  renderTunes() {
    let tunesElement = document.createDocumentFragment();

    this.tunes.forEach( tune => {
      $.append(tunesElement, tune.render());
    });

    return tunesElement;
  }

  /**
   * Check block for emptiness
   * @return {Boolean}
   */
  get isEmpty() {
    /**
     * Allow Tool to represent decorative contentless blocks: for example "* * *"-tool
     * That Tools are not empty
     */
    if (this.tool.contentless) {
      return false;
    }

    let emptyText = $.isEmpty(this.pluginsContent),
      emptyMedia = !this.hasMedia;

    return emptyText && emptyMedia;
  }

  /**
   * Check if block has a media content such as images, iframes and other
   * @return {Boolean}
   */
  get hasMedia() {
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
      'twitterwidget'
    ];

    return !!this.holder.querySelector(mediaTags.join(','));
  }

  /**
   * Set selected state
   * @param {Boolean} state - 'true' to select, 'false' to remove selection
   */
  set selected(state) {
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
  set stretched(state) {
    this.holder.classList.toggle(Block.CSS.wrapperStretched, state);
  }
}
