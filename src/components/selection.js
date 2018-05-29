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
     * @return {Node|null}
     */
    static getAnchorNode() {

        let selection = window.getSelection();

        return selection ? selection.anchorNode : null;

    }

    /**
     * Returns selection offset according to the anchor node
     * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
     * @return {Number|null}
     */
    static getAnchorOffset() {

        let selection = window.getSelection();

        return selection ? selection.anchorOffset : null;

    }

    /**
     * Is current selection range collapsed
     * @return {boolean|null}
     */
    static get isCollapsed() {

        let selection = window.getSelection();

        return selection ? selection.isCollapsed : null;

    }

}