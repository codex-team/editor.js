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

    static getSelection() {

        return window.getSelection();

    }

    static getSelectionAnchorNode() {

        let selection = window.getSelection();

        if (selection) {

            return selection.anchorNode;

        }

    }

    static getSelectionAnchorOffset() {

        let selection = window.getSelection();

        if (selection) {

            return selection.anchorOffset;

        }

    }

}