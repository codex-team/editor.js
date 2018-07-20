/**
 * Base Text block for the CodeX Editor.
 * Represents simple paragraph
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX Team 2017
 * @license The MIT License (MIT)
 * @version 2.0.1
 */

/**
  * @typedef {Object} TextData
  * @description Tool's input and output data format
  * @property {String} text — Paragraph's content. Can include HTML tags: <a><b><i>
  */
class Text {
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
    return 'cdx-text-icon';
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   * @param {TextData} savedData — previously saved data
   */
  constructor(savedData = {}) {
    this._CSS = {
      wrapper: 'ce-text'
    };

    this._data = {};
    this._element = this.drawView();

    this.data = savedData;
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let div = document.createElement('DIV');

    div.classList.add(this._CSS.wrapper);
    div.contentEditable = true;

    return div;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    return this._element;
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
   * @param {HTMLDivElement} toolsContent - Text tools rendered view
   * @returns {TextData} - saved data
   * @public
   */
  save(toolsContent) {
    let toolData = {
      text: toolsContent.innerHTML
    };

    return toolData;
  }

  /**
   * Get current Tools`s data
   * @returns {TextData} Current data
   * @private
   */
  get data() {
    let text = this._element.innerHTML;

    /**
     * @todo sanitize data
     */

    this._data.text = text;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {TextData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this._element.innerHTML = this._data.text || '';
  }

  static async onPasteHandler(content) {
    return {
      text: content.innerHTML
    };
  }

  static get onPaste() {
    return {
      handler: Text.onPasteHandler,
      tags: ['P', 'DIV']
    };
  }
}
