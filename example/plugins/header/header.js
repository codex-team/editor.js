/**
 * @typedef {Object} HeaderData
 * @description Tool's input and output data format
 * @property {String} text — Header's content
 * @property {number} level - Header's level from 1 to 3
 */

/**
 * @typedef {Object} HeaderConfig
 * @description Tool's config from Editor
 * @property {string} placeholder — Block's placeholder
 */

/**
 * Header block for the CodeX Editor.
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX Team 2018
 * @license The MIT License (MIT)
 * @version 2.0.0
 */
class Header {
  /**
   * Should this tools be displayed at the Editor's Toolbox
   * @returns {boolean}
   * @public
   */
  static get displayInToolbox() {
    return true;
  }

  /**
   * Class for the Toolbox icon
   * @returns {string}
   * @public
   */
  static get iconClassName() {
    return 'cdx-header-icon';
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   * @param {HeaderData} blockData - previously saved data
   * @param {HeaderConfig} blockConfig - Tool's config from Editor
   */
  constructor(blockData = {}, blockConfig = {}) {
    /**
     * Styles
     * @type {Object}
     */
    this._CSS = {
      wrapper: 'ce-header',
      settingsButton: 'ce-settings__button',
      settingsSelected: 'ce-settings__button--selected',
    };

    /**
     * Tool's settings passed from Editor
     * @type {HeaderConfig}
     * @private
     */
    this._settings = blockConfig;

    /**
     * Block's data
     * @type {HeaderData}
     * @private
     */
    this._data = blockData || {};

    /**
     * List of settings buttons
     * @type {HTMLElement[]}
     */
    this.settingsButtons = [];

    /**
     * Main Block wrapper
     * @type {HTMLElement}
     * @private
     */
    this._element = this.getTag();
  }

  /**
   * Return Tool's view
   * @returns {HTMLHeadingElement}
   * @public
   */
  render() {
    return this._element;
  }

  /**
   * Create Block's settings block
   *
   * @return {HTMLElement}
   */
  renderSettings() {
    let holder = document.createElement('DIV');

    /** Add type selectors */
    this.levels.forEach( level => {
      let selectTypeButton = document.createElement('SPAN');

      selectTypeButton.classList.add(this._CSS.settingsButton);

      /**
       * Highlight current level button
       */
      if (this.currentLevel.number === level.number) {
        selectTypeButton.classList.add(this._CSS.settingsSelected);
      }

      /**
       * Add SVG icon
       */
      selectTypeButton.innerHTML = level.svg;

      /**
       * Save level to its button
       */
      selectTypeButton.dataset.level = level.number;

      /**
       * Set up click handler
       */
      selectTypeButton.addEventListener('click', () => {
        this.setLevel(level.number);
      });

      /**
       * Append settings button to holder
       */
      holder.appendChild(selectTypeButton);

      /**
       * Save settings buttons
       */
      this.settingsButtons.push(selectTypeButton);
    });

    return holder;
  }

  /**
   * Callback for Block's settings buttons
   * @param level
   */
  setLevel(level) {
    this.data = {
      level: level
    };

    /**
     * Highlight button by selected level
     */
    this.settingsButtons.forEach(button => {
      button.classList.toggle(this._CSS.settingsSelected, parseInt(button.dataset.level) === level);
    });
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by CodeX Editor by backspace at the beginning of the Block
   * @param {HeaderData} data
   * @public
   */
  merge(data) {
    let newData = {
      text: this.data.text + data.text,
      level: this.data.level
    };

    this.data = newData;
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(blockData) {
    return blockData.text.trim() !== '';
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save(toolsContent) {
    /**
     * @todo sanitize data
     */

    return {
      text: toolsContent.innerHTML,
      level: this.currentLevel.number
    };
  }

  /**
   * Get current Tools`s data
   * @returns {HeaderData} Current data
   * @private
   */
  get data() {
    this._data.text = this._element.innerHTML;
    this._data.level = this.currentLevel.number;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {HeaderData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       * @type {HTMLHeadingElement}
       */
      let newHeader = this.getTag();

      /**
       * Save Block's content
       */
      newHeader.innerHTML = this._element.innerHTML;

      /**
       * Replace blocks
       */
      this._element.parentNode.replaceChild(newHeader, this._element);

      /**
       * Save new block to private variable
       * @type {HTMLHeadingElement}
       * @private
       */
      this._element = newHeader;
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || '';
    }
  }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   * @return {HTMLElement}
   */
  getTag() {
    /**
     * Create element for current Block's level
     */
    let tag = document.createElement(this.currentLevel.tag);

    /**
     * Add text to block
     */
    tag.innerHTML = this._data.text || '';

    /**
     * Add styles class
     */
    tag.classList.add(this._CSS.wrapper);

    /**
     * Make tag editable
     */
    tag.contentEditable = 'true';

    /**
     * Add Placeholder
     */
    tag.dataset.placeholder = this._settings.placeholder || '';

    return tag;
  }

  /**
   * Get current level
   * @return {level}
   */
  get currentLevel() {
    let level = this.levels.find( level => level.number === this._data.level);

    if (!level) {
      level = this.levels[0];
    }

    return level;
  }

  /**
   * @typedef {object} level
   * @property {number} number - level number
   * @property {string} tag - tag correspondes with level number
   * @property {string} svg - icon
   */

  /**
   * Available header levels
   * @return {level[]}
   */
  get levels() {
    return [
      {
        number: 2,
        tag: 'H2',
        svg: '<svg width="18" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M2.152 1.494V4.98h4.646V1.494c0-.498.097-.871.293-1.12A.934.934 0 0 1 7.863 0c.324 0 .586.123.786.37.2.246.301.62.301 1.124v9.588c0 .503-.101.88-.304 1.128a.964.964 0 0 1-.783.374.928.928 0 0 1-.775-.378c-.194-.251-.29-.626-.29-1.124V6.989H2.152v4.093c0 .503-.101.88-.304 1.128a.964.964 0 0 1-.783.374.928.928 0 0 1-.775-.378C.097 11.955 0 11.58 0 11.082V1.494C0 .996.095.623.286.374A.929.929 0 0 1 1.066 0c.323 0 .585.123.786.37.2.246.3.62.3 1.124zm10.99 9.288h3.527c.351 0 .62.072.804.216.185.144.277.34.277.588 0 .22-.073.408-.22.56-.146.154-.368.23-.665.23h-4.972c-.338 0-.601-.093-.79-.28a.896.896 0 0 1-.284-.659c0-.162.06-.377.182-.645s.255-.478.399-.631a38.617 38.617 0 0 1 1.621-1.598c.482-.444.827-.735 1.034-.875.369-.261.676-.523.922-.787.245-.263.432-.534.56-.81.129-.278.193-.549.193-.815 0-.288-.069-.546-.206-.773a1.428 1.428 0 0 0-.56-.53 1.618 1.618 0 0 0-.774-.19c-.59 0-1.054.26-1.392.777-.045.068-.12.252-.226.554-.106.302-.225.534-.358.696-.133.162-.328.243-.585.243a.76.76 0 0 1-.56-.223c-.149-.148-.223-.351-.223-.608 0-.31.07-.635.21-.972.139-.338.347-.645.624-.92a3.093 3.093 0 0 1 1.054-.665c.426-.169.924-.253 1.496-.253.69 0 1.277.108 1.764.324.315.144.592.343.83.595.24.252.425.544.558.875.133.33.2.674.2 1.03 0 .558-.14 1.066-.416 1.523-.277.457-.56.815-.848 1.074-.288.26-.771.666-1.45 1.22-.677.554-1.142.984-1.394 1.29a3.836 3.836 0 0 0-.331.44z"/></svg>'
      },
      {
        number: 3,
        tag: 'H3',
        svg: '<svg width="18" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M2.152 1.494V4.98h4.646V1.494c0-.498.097-.871.293-1.12A.934.934 0 0 1 7.863 0c.324 0 .586.123.786.37.2.246.301.62.301 1.124v9.588c0 .503-.101.88-.304 1.128a.964.964 0 0 1-.783.374.928.928 0 0 1-.775-.378c-.194-.251-.29-.626-.29-1.124V6.989H2.152v4.093c0 .503-.101.88-.304 1.128a.964.964 0 0 1-.783.374.928.928 0 0 1-.775-.378C.097 11.955 0 11.58 0 11.082V1.494C0 .996.095.623.286.374A.929.929 0 0 1 1.066 0c.323 0 .585.123.786.37.2.246.3.62.3 1.124zm11.61 4.919c.418 0 .778-.123 1.08-.368.301-.245.452-.597.452-1.055 0-.35-.12-.65-.36-.902-.241-.252-.566-.378-.974-.378-.277 0-.505.038-.684.116a1.1 1.1 0 0 0-.426.306 2.31 2.31 0 0 0-.296.49c-.093.2-.178.388-.255.565a.479.479 0 0 1-.245.225.965.965 0 0 1-.409.081.706.706 0 0 1-.5-.22c-.152-.148-.228-.345-.228-.59 0-.236.071-.484.214-.745a2.72 2.72 0 0 1 .627-.746 3.149 3.149 0 0 1 1.024-.568 4.122 4.122 0 0 1 1.368-.214c.44 0 .842.06 1.205.18.364.12.679.294.947.52.267.228.47.49.606.79.136.3.204.622.204.967 0 .454-.099.843-.296 1.168-.198.324-.48.64-.848.95.354.19.653.408.895.653.243.245.426.516.548.813.123.298.184.619.184.964 0 .413-.083.812-.248 1.198-.166.386-.41.73-.732 1.031a3.49 3.49 0 0 1-1.147.708c-.443.17-.932.256-1.467.256a3.512 3.512 0 0 1-1.464-.293 3.332 3.332 0 0 1-1.699-1.64c-.142-.314-.214-.573-.214-.777 0-.263.085-.475.255-.636a.89.89 0 0 1 .637-.242c.127 0 .25.037.367.112a.53.53 0 0 1 .232.27c.236.63.489 1.099.759 1.405.27.306.65.46 1.14.46a1.714 1.714 0 0 0 1.46-.824c.17-.273.256-.588.256-.947 0-.53-.145-.947-.436-1.249-.29-.302-.694-.453-1.212-.453-.09 0-.231.01-.422.028-.19.018-.313.027-.367.027-.25 0-.443-.062-.579-.187-.136-.125-.204-.299-.204-.521 0-.218.081-.394.245-.528.163-.134.406-.2.728-.2h.28z"/></svg>'
      },
      {
        number: 4,
        tag: 'H4',
        svg: '<svg width="20" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M2.152 1.494V4.98h4.646V1.494c0-.498.097-.871.293-1.12A.934.934 0 0 1 7.863 0c.324 0 .586.123.786.37.2.246.301.62.301 1.124v9.588c0 .503-.101.88-.304 1.128a.964.964 0 0 1-.783.374.928.928 0 0 1-.775-.378c-.194-.251-.29-.626-.29-1.124V6.989H2.152v4.093c0 .503-.101.88-.304 1.128a.964.964 0 0 1-.783.374.928.928 0 0 1-.775-.378C.097 11.955 0 11.58 0 11.082V1.494C0 .996.095.623.286.374A.929.929 0 0 1 1.066 0c.323 0 .585.123.786.37.2.246.3.62.3 1.124zm13.003 10.09v-1.252h-3.38c-.427 0-.746-.097-.96-.29-.213-.193-.32-.456-.32-.788 0-.085.016-.171.048-.259.031-.088.078-.18.141-.276.063-.097.128-.19.195-.28.068-.09.15-.2.25-.33l3.568-4.774a5.44 5.44 0 0 1 .576-.683.763.763 0 0 1 .542-.212c.682 0 1.023.39 1.023 1.171v5.212h.29c.346 0 .623.047.832.142.208.094.313.3.313.62 0 .26-.086.45-.256.568-.17.12-.427.179-.768.179h-.41v1.252c0 .346-.077.603-.23.771-.152.168-.356.253-.612.253a.78.78 0 0 1-.61-.26c-.154-.173-.232-.427-.232-.764zm-2.895-2.76h2.895V4.91L12.26 8.823z"/></svg>'
      }
    ];
  }


  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {HTMLElement} content - pasted element
   * @returns {{level: number, text: *}}
   */
  static onPasteHandler(content) {
    let level = 4;

    switch (content.tagName) {
      case 'H1':
      case 'H2':
        level = 2;
        break;

      case 'H3':
        level = 3;
        break;
    }

    return {
      level,
      text: content.innerHTML
    };
  }

  /**
   * Used by Codex Editor paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get onPaste() {
    return {
      handler: Header.onPasteHandler,
      tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    };
  }
}
