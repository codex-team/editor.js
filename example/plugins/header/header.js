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

    console.log('this._element', this._element)

    // this.data = savedData;

  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let div = this.getTag();

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

  get levels(){
    return [2,3,4];
  }

  /**
   *
   * @return {HTMLElement}
   */
  makeSettings() {
    let holder = document.createElement('h2'),
      selectTypeButton;

    /** Now add type selectors */
    this.levels.forEach( level => {

      selectTypeButton = document.createElement('SPAN');


      selectTypeButton.innerText = level;
      selectTypeButton.classList.add('ce-settings__button');
      holder.appendChild(selectTypeButton);

      selectTypeButton.addEventListener('click', () => {
        this.settingsButtonClicked(level);
      });

    });

    return holder;
  }

  settingsButtonClicked(level){
    this.data = {
      level: level
    };
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


    if (data.level !== undefined) {

      if (this._element.parentNode){
        let newHeader = this.getTag();
        newHeader.innerHTML = this._element.innerHTML;
        this._element.parentNode.replaceChild(newHeader, this._element);
        this._element = newHeader;
      }


    }

    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || '';
    }
  }

  /**
   * Get tag for target level
   * @return {HTMLHeadingElement}
   */
  getTag() {
    let tag;

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

    tag.innerHTML = this._data.text;

    tag.classList.add(this._CSS.wrapper);
    tag.contentEditable = true;

    return tag;
  }
}
