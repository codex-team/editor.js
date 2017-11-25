/**
 * @class Paragraph
 * @classdesc Paragraph plugin for CodexEditor
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX Team 2017
 * @license The MIT License (MIT)
 * @version 2.0.0
 *
 *
 * @typedef {Object} ParagraphData
 * @property {String} text — HTML content to insert to paragraph element
 *
 */

export default class Paragraph {

    /**
     * Get the name of the plugin
     *
     * @returns {string} The plugin name
     */
    static get name() {

        return 'paragraph';

    }

    /**
     * Render plugin`s html and set initial content
     *
     * @param {ParagraphData} data — initial plugin content
     */
    constructor(data = {}) {

        this._CSS = {
            wrapper: 'ce-paragraph'
        };

        this._data = {};

        this._element = this._render();
        this.data = data;


    }

    /**
     * Create div element and add needed css classes
     *
     * @returns {HTMLDivElement} Created DIV element
     * @private
     */
    _render() {

        let div = document.createElement('DIV');

        div.classList.add(this._CSS.wrapper);
        div.contentEditable = true;

        return div;

    }

    /**
     * Check if saved text is empty
     *
     * @param {ParagraphData} savedData — data received from plugins`s element
     * @returns {boolean} false if saved text is empty, true otherwise
     */
    validate(savedData) {

        if (savedData.text.trim() === '') {

            return false;

        }

        return true;

    }

    /**
     * Get plugin`s element HTMLDivElement
     *
     * @returns {HTMLDivElement} Plugin`s element
     */
    get html() {

        return this._element;

    }

    /**
     * Get current plugin`s data
     *
     * @todo sanitize data while saving
     *
     * @returns {ParagraphData} Current data
     */
    get data() {

        let text = this._element.innerHTML;

        this._data.text = text;

        return this._data;

    }

    /**
     * Set new data for plugin
     *
     * @param {ParagraphData} data — data to set
     */
    set data(data) {

        Object.assign(this._data, data);

        this._element.innerHTML = this._data.text || '';

    }

}