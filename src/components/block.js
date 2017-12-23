/**
 *
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 *
 * @property {Tool} tool — current block tool (Paragraph, for example)
 * @property {Object} CSS — block`s css classes
 *
 */


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

        this._html = this.compose();

    }

    /**
     * Make default block wrappers and put tool`s content there
     *
     * @returns {HTMLDivElement}
     * @private
     */
    compose() {

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

    /**
     * Check block for emptyness
     *
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

        let emptyText = this._html.textContent.trim().length === 0,
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

}