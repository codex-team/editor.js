import Selection from '../selection';
export default class InlineToolbar extends Module {
    /**
     * @constructor
     */
    constructor({ config }) {
        super({ config });
        /**
         * Inline Toolbar elements
         */
        this.nodes = {
            wrapper: null,
        };
        /**
         * CSS styles
         */
        this.CSS = {
            inlineToolbar: 'ce-inline-toolbar',
            inlineToolbarShowed: 'ce-inline-toolbar--showed',
        };
        /**
         * Margin above/below the Toolbar
         */
        this.toolbarVerticalMargin = 20;
    }
    /**
     * Making DOM
     */
    make() {
        this.nodes.wrapper = $.make('div', this.CSS.inlineToolbar);
        /**
         * Append Inline Toolbar to the Editor
         */
        $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
    }
    /**
     * Shows Inline Toolbar by keyup/mouseup
     * @param {KeyboardEvent|MouseEvent} event
     */
    handleShowingEvent(event) {
        if (!this.allowedToShow(event)) {
            this.close();
            return;
        }
        this.move();
        this.open();
    }
    /**
     * Move Toolbar to the selected text
     */
    move() {
        const selectionRect = Selection.rect;
        const wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();
        const newCoords = {
            x: selectionRect.x - wrapperOffset.left,
            y: selectionRect.y
                + selectionRect.height
                // + window.scrollY
                - wrapperOffset.top
                + this.toolbarVerticalMargin,
        };
        /**
         * If we know selections width, place InlineToolbar to center
         */
        if (selectionRect.width) {
            newCoords.x += Math.floor(selectionRect.width / 2);
        }
        this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
        this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
    }
    /**
     * Shows Inline Toolbar
     */
    open() {
        this.nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed);
    }
    /**
     * Hides Inline Toolbar
     */
    close() {
        this.nodes.wrapper.classList.remove(this.CSS.inlineToolbarShowed);
    }
    /**
     * Need to show Inline Toolbar or not
     * @param {KeyboardEvent|MouseEvent} event
     */
    allowedToShow(event) {
        /**
         * Tags conflicts with window.selection function.
         * Ex. IMG tag returns null (Firefox) or Redactors wrapper (Chrome)
         */
        const tagsConflictsWithSelection = ['IMG', 'INPUT'];
        if (event && tagsConflictsWithSelection.includes(event.target.tagName)) {
            return false;
        }
        const currentSelection = Selection.get(), selectedText = Selection.text;
        // old browsers
        if (!currentSelection || !currentSelection.anchorNode) {
            return false;
        }
        // empty selection
        if (currentSelection.isCollapsed || selectedText.length < 1) {
            return false;
        }
        // is enabled by current Block's Tool
        const currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode);
        if (!currentBlock) {
            return false;
        }
        const toolConfig = this.config.toolsConfig[currentBlock.name];
        return toolConfig && toolConfig[this.Editor.Tools.apiSettings.IS_ENABLED_INLINE_TOOLBAR];
    }
}
