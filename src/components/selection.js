/**
 * Working with selection
 */
export default class Selection {

    /**
     * @constructor
     */
    constructor() {

        this.instance = null;
        this.selection = null;

    }

    /**
     * Returns window Selection
     * {@link https://developer.mozilla.org/ru/docs/Web/API/Window/getSelection}
     * @return {Selection}
     */
    static get() {

        return window.getSelection();

    }

    /**
     * Returns selected anchor
     * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorNode}
     * @return {Node}
     */
    static getAnchorNode() {

        let selection = window.getSelection();

        if (selection) {

            return selection.anchorNode;

        }

    }

    /**
     * Returns selection offset according to the anchor node
     * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
     * @return {Number}
     */
    static getAnchorOffset() {

        let selection = window.getSelection();

        if (selection) {

            return selection.anchorOffset;

        }

    }

}