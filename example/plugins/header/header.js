/**
 * @typedef {Object} HeaderData
 * @description Tool's input and output data format
 * @property {String} text — Header's content
 * @property {number} level - Header's level from 1 to 3
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
    return 'cdx-header-icon'; // todo add icon
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   * @param {HeaderData} savedData — previously saved data
   */
  constructor(savedData = {}) {
    this._CSS = {
      wrapper: 'ce-header'
    };

    this._data = savedData || {};
    this._element = this.drawView();

    console.log('this._element', this._element);
  }

  /**
   * Create Tool's view
   * @return {HTMLHeadingElement}
   * @private
   */
  drawView() {
    let div = this.getTag();

    return div;
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
   * Available header levels
   * @return {number[]}
   */
  get levels() {
    return [2, 3, 4];
  }

  /**
   * Create Block's settings block
   *
   * @return {HTMLDivElement}
   */
  makeSettings() {
    let holder = document.createElement('DIV'),
      selectTypeButton;

    /** Add type selectors */
    this.levels.forEach( level => {
      selectTypeButton = document.createElement('SPAN');

      selectTypeButton.innerText = level; /** @todo add svg image for button */

      selectTypeButton.classList.add('ce-settings__button');
      holder.appendChild(selectTypeButton);

      selectTypeButton.addEventListener('click', () => {
        this.settingsButtonClicked(level);
      });
    });

    return holder;
  }

  /**
   * Callback for Block's settings buttons
   * @param level
   */
  settingsButtonClicked(level) {
    this.data = {
      level: level
    };
  }

  /**
   * Focus element on append
   */
  appendCallback() {
    window.setTimeout(() => {
      this._element.focus();
    }, 0);
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by CodeX Editor by backspace at the beginning of the Block
   * @param {TextData} data
   * @public
   */
  merge(data) {
    let newData = {
      text : this.data.text + data.text
    };

    this.data = newData;
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {TextData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {TextData} - saved data
   * @public
   */
  save(toolsContent) {
    let toolData = {
      text: toolsContent.innerHTML,
      level: toolsContent.tagName
    };

    return toolData;
  }

  /**
   * Get current Tools`s data
   * @returns {TextData} Current data
   * @private
   */
  get data() {
    let text = this._element.innerHTML,
      tag = this._element.tagName;

    /**
     * @todo sanitize data
     */

    this._data.text = text;
    this._data.level = tag;

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
     * If passed data.text is not empty then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || '';
    }
  }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   * @return {HTMLHeadingElement}
   */
  getTag() {
    let tag;

    /**
     * Create element for current Block's level
     * @todo get available levels from this.levels
     */
    switch (this._data.level) {
      case 3:
        tag = document.createElement('h3');
        break;
      case 4:
        tag = document.createElement('h4');
        break;
      default:
        tag = document.createElement('h2');
    }

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

    return tag;
  }
}
