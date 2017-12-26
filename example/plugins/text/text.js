/**
 * @class Text
 * @classdesc Paragraph plugin for CodexEditor
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX Team 2017
 * @license The MIT License (MIT)
 * @version 2.0.0
 *
 *
 * @typedef {Object} TextData
 * @property {String} text — HTML content to insert to text element
 *
 */

class Text {

    /**
     * Pass true to display this tool in the Editor's Toolbox
     *
     * @returns {boolean}
     */
    static get displayInToolbox() {

        return true;

    }

    /**
     * Class for the Toolbox icon
     *
     * @returns {string}
     */
    static get iconClassName() {

        return 'cdx-text-icon';

    }

    /**
     * Render plugin`s html and set initial content
     *
     * @param {TextData} data — initial plugin content
     */
    constructor(data = {}) {

        this._CSS = {
            wrapper: 'ce-text'
        };

        this._data = {};
        this._element = this.draw();

        this.data = data;
    }

    /**
     * Method fires before rendered data appended to the editors area
     */
    appendCallback() {

        console.log("text appended");

    }

    draw() {

        let div = document.createElement('DIV');

        div.classList.add(this._CSS.wrapper);
        div.contentEditable = true;

        return div;
    }

    /**
     * Create div element and add needed css classes
     * @returns {HTMLDivElement} Created DIV element
     */
    render() {

        return this._element;

    }

    /**
     * Check if saved text is empty
     *
     * @param {TextData} savedData — data received from plugins`s element
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
     * @returns {HTMLDivElement} Plugin`s element
     */
    save(block) {

        return this.data;

    }

    /**
     * Get current plugin`s data
     *
     * @todo sanitize data while saving
     *
     * @returns {TextData} Current data
     */
    get data() {

        let text = this._element.innerHTML;

        this._data.text = text;

        return this._data;

    }

    /**
     * Set new data for plugin
     *
     * @param {TextData} data — data to set
     */
    set data(data) {

        Object.assign(this._data, data);

        this._element.innerHTML = this._data.text || '';

    }

}