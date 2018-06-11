/**
 *
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 *
 * @property {Tool} tool — current block tool (Paragraph, for example)
 * @property {Object} CSS — block`s css classes
 *
 */

/**
 * @classdesc Abstract Block class that contains Block information, Tool name and Tool class instance
 *
 * @property tool - Tool instance
 * @property html - Returns HTML content of plugin
 * @property wrapper - Div element that wraps block content with Tool's content. Has `ce-block` CSS class
 * @property contentNode - Div element that wraps Tool's content. Has `ce-block__content` CSS class
 * @property pluginsContent - HTML content that returns by Tool's render function
 */
export default class Block {
  /**
   * @constructor
   * @param {String} toolName - Tool name that passed on initialization
   * @param {Object} toolInstance — passed Tool`s instance that rendered the Block
   */
  constructor(toolName, toolInstance) {
    this.name = toolName;
    this.tool = toolInstance;
    this._html = this.compose();
  }

  /**
   * CSS classes for the Block
   * @return {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      wrapper: 'ce-block',
      content: 'ce-block__content',
      selected: 'ce-block--selected'
    };
  }

  /**
   * Make default Block wrappers and put Tool`s content there
   * @returns {HTMLDivElement}
   */
  compose() {
    this.wrapper = $.make('div', Block.CSS.wrapper);
    this.contentNode    = $.make('div', Block.CSS.content);
    this.pluginsContent  = this.tool.render();

    this.contentNode.appendChild(this.pluginsContent);
    this.wrapper.appendChild(this.contentNode);

    return this.wrapper;
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

  /**
   * Get Block`s HTML
   * @returns {HTMLElement}
   */
  get html() {
    return this._html;
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

    return !!this._html.querySelector(mediaTags.join(','));
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
      this._html.classList.add(Block.CSS.selected);
    } else {
      this._html.classList.remove(Block.CSS.selected);
    }
  }
}