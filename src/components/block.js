/**
 *
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 *
 * @property {Tool} tool — current block tool (Paragraph, for example)
 * @property {Object} CSS — block`s css classes
 *
 */


import $ from './dom';

export default class Block {

    /**
     * @constructor
     *
     * @param {Object} tool — current block plugin`s instance
     */
    constructor(tool) {

        this.tool = tool;

        this.CSS = {
            wrapper: 'ce-block',
            content: 'ce-block__content'
        };

        this._html = this._compose();

    }

    /**
     * Make default block wrappers and put tool`s content there
     *
     * @returns {HTMLDivElement}
     * @private
     */
    _compose() {

        let wrapper = $.make('div', this.CSS.wrapper),
            content = $.make('div', this.CSS.content);

        content.appendChild(this.tool.html);
        wrapper.appendChild(content);

        return wrapper;

    }

    /**
     * Get block`s HTML
     *
     * @returns {HTMLDivElement}
     */
    get html() {

        return this._html;

    }

}