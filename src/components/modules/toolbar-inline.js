/**
 * Inline toolbar with actions that modifies selected text fragment
 *
 *  ________________________
 * |                        |
 * |   B  i [link] [mark]   |
 * | _______________________|
 */

export default class InlineToolbar extends Module {

    /**
     * @constructor
     */
    constructor({config}) {

        super({config});

        this.nodes = {};

    }

    /**
     * CSS styles
     * @return {Object}
     * @constructor
     */
    static get CSS() {

        return {
            inlineToolbar: 'ce-inline-toolbar',
        };

    }

    /**
     * Making DOM
     */
    make() {

        this.nodes.wrapper = $.make('div', InlineToolbar.CSS.inlineToolbar);

        /**
         * Append Inline Toolbar to the Editor
         */
        $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

    }

}