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
 * @classdesc Abstract Block class that contains block information, tool and tool class instance
 *
 * @property this.tool - Tool instance
 * @property this.html - Returns HTML content of plugin
 * @property this.firstLevelBlock - Div element that wraps block content with plugin content. Has `ce-block` CSS class
 * @property this.blockContent - Div element that wraps plugins content. Has `ce-block__content` CSS class
 * @property this.pluginsContent - HTML content that returns Tool's render function
 */
export default class Block {

    /**
     * @constructor
     * @param {Object} tool — current block plugin`s instance
     */
    constructor(tool) {

        this.tool = tool;
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
     * Make default block wrappers and put tool`s content there
     * @returns {HTMLDivElement}
     */
    compose() {

        this.firstLevelBlock = $.make('div', Block.CSS.wrapper);
        this.blockContent    = $.make('div', Block.CSS.content);
        this.pluginsContent  = this.tool.render();

        this.blockContent.appendChild(this.pluginsContent);
        this.firstLevelBlock.appendChild(this.blockContent);

        return this.firstLevelBlock;

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
     *
     * @return {Object}
     */
    get data() {

        return this.extractData();

    }

    /**
     * Get Block's JSON data
     * @return {Object}
     */
    extractData() {

        let self = this;

        return new Promise(function (resolve) {

            let extractedBlock = self.tool.save(self.pluginsContent);

            if (_.isPromise(extractedBlock)) {

                extractedBlock
                    .then(self.validateData)
                    .then(resolve)
                    .catch(function (error) {

                        _.log(`Saving proccess for ${this.tool.name} tool failed due to the ${error}`, 'log', 'red');

                    });

            } else {

                resolve(extractedBlock);

            }


        });

    }

    /**
     * Uses Tool's validation method to validate output data
     * @param {Object} data
     *
     * @returns {Boolean} valid
     */
    validateData(data) {

        let isValid = true;

        if (this.tool.validate && this.tool.validate instanceof Function) {

            isValid = this.tool.validate(data);

        }

        if (!isValid) {

            return false;

        }

        return data;

    }

    /**
     * Check block for emptiness
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