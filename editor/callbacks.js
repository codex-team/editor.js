/**
 * @author Codex Team
 * @version 1.0.0
 *
 */

var callbacks = (function() {

    var redactorSyncTimeout = null;

    /**
     * @protected
     *
     * For all keydowns
     * @param event
     */
    var globalKeydown = function(event){

        switch (event.keyCode){
            case cEditor.core.keys.TAB   : this.tabKeyPressed(event);       break;
            case cEditor.core.keys.ENTER : this.enterKeyPressed(event);     break;
            case cEditor.core.keys.ESC   : this.escapeKeyPressed(event);    break;
            default                      : this.defaultKeyPressed(event);    break;
        }

    };

    /**
     * @protected
     *
     * For all arrowkeys
     * @param event
     */
    var globalKeyup = function(event){

        switch (event.keyCode){
            case cEditor.core.keys.UP    :
            case cEditor.core.keys.LEFT  :
            case cEditor.core.keys.RIGHT :
            case cEditor.core.keys.DOWN  : this.arrowKeyPressed(event); break;
        }

    };

    /**
     * @protected
     *
     * Tab key pressed
     * @param event
     */
    var tabKeyPressed = function(event){

        if ( !cEditor.toolbar.opened ) {
            cEditor.toolbar.open();
        }

        if (cEditor.toolbar.opened && !cEditor.toolbar.toolbox.opened) {
            cEditor.toolbar.toolbox.open();
        } else {
            cEditor.toolbar.leaf();
        }

        event.preventDefault();
    };

    /**
     * @protected
     *
     * ENTER key handler
     * Makes new paragraph block
     */
    var enterKeyPressed = function(event){

        /** Set current node */
        cEditor.content.workingNodeChanged();

        /** Update input index */
        cEditor.caret.saveCurrentInputIndex();

        var currentInputIndex       = cEditor.caret.getCurrentInputIndex(),
            workingNode             = cEditor.content.currentNode,
            tool                    = workingNode.dataset.type,
            isEnterPressedOnToolbar = cEditor.toolbar.opened &&
                cEditor.toolbar.current &&
                event.target == cEditor.state.inputs[currentInputIndex];

        /** The list of tools which needs the default browser behaviour */
        var enableLineBreaks = cEditor.tools[tool].enableLineBreaks;

        /** This type of block creates when enter is pressed */
        var NEW_BLOCK_TYPE = 'paragraph';

        /**
         * When toolbar is opened, select tool instead of making new paragraph
         */
        if ( isEnterPressedOnToolbar ) {

            event.preventDefault();

            cEditor.toolbar.toolClicked(event);
            cEditor.toolbar.toolbox.close();
            cEditor.toolbar.close();

            return;

        }

        /**
         * Allow making new <p> in same block by SHIFT+ENTER and forbids to prevent default browser behaviour
         */
        if ( event.shiftKey || enableLineBreaks){
            return;
        }

        event.preventDefault();

        /**
         * Divide block into two components - a part which is before caret and a part after.
         * first part we put into current node, and second to new one
         */

        currentblock = cEditor.content.currentNode.querySelector('[contentEditable]');

        /**
         * Split blocks when input has several nodes
         */
        if (currentblock.childNodes.length !== 0) {

            cEditor.content.splitBlock(currentInputIndex);

        } else {

            /**
             * Make new paragraph
             */
            cEditor.content.insertBlock({
                type  : NEW_BLOCK_TYPE,
                block : cEditor.tools[NEW_BLOCK_TYPE].render()
            });

        }

        /** get all inputs after new appending block */
        cEditor.ui.saveInputs();

        /** Timeout for browsers execution */
        setTimeout(function () {

            /** Setting to the new input */
            cEditor.caret.setToNextBlock(currentInputIndex);

            cEditor.toolbar.move();

            cEditor.toolbar.open();

        }, 10);

    };

    /**
     * @protected
     *
     * @param event
     */
    var escapeKeyPressed = function(event){

        /** Close all toolbar */
        cEditor.toolbar.close();

        /** Close toolbox */
        cEditor.toolbar.toolbox.close();

        event.preventDefault();

    };

    /**
     * @protected
     *
     * @param event
     */
    var arrowKeyPressed = function(event){

        cEditor.content.workingNodeChanged();

        /* Closing toolbar */
        cEditor.toolbar.close();
        cEditor.toolbar.move();

    };

    /**
     * @protected
     *
     * @param event
     */
    var defaultKeyPressed = function(event) {

        cEditor.toolbar.close();
    };

    /**
     * @protected
     *
     * @param event
     */
    var redactorClicked = function (event) {

        cEditor.content.workingNodeChanged(event.target);

        cEditor.ui.saveInputs();

        /** Update current input index in memory when caret focused into existed input */
        if (event.target.contentEditable == 'true') {

            cEditor.caret.saveCurrentInputIndex();

        }

        if (cEditor.content.currentNode === null) {

            /** Set caret to the last input */
            var indexOfLastInput = cEditor.state.inputs.length - 1,
                firstLevelBlock  = cEditor.content.getFirstLevelBlock(cEditor.state.inputs[indexOfLastInput]);

            /** If input is empty, then we set caret to the last input */
            if (cEditor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.type == 'paragraph') {

                cEditor.caret.setToBlock(indexOfLastInput);

            } else {

                /** Create new input when caret clicked in redactors area */
                var NEW_BLOCK_TYPE = 'paragraph';

                cEditor.content.insertBlock({
                    type  : NEW_BLOCK_TYPE,
                    block : cEditor.tools[NEW_BLOCK_TYPE].render()
                });

                /** Set caret to this appended input */
                cEditor.caret.setToNextBlock(indexOfLastInput);

            }

            /**
             * Move toolbar to the right position and open
             */
            cEditor.toolbar.move();

            cEditor.toolbar.open();

        } else {

            /**
             * Move toolbar to the right position and open
             */
            cEditor.toolbar.move();

            cEditor.toolbar.open();

            /** Close all panels */
            cEditor.toolbar.settings.close();
            cEditor.toolbar.toolbox.close();
        }

        /** Mark current block*/
        cEditor.content.markBlock();

    };

    /**
     * @protected
     *
     * Toolbar button click handler
     * @param this - cursor to the button
     */
    var toolbarButtonClicked = function (event, button) {

        cEditor.toolbar.current = button.dataset.type;

        cEditor.toolbar.toolClicked(event);
        cEditor.toolbar.close();

    };

    /**
     * @protected
     *
     * @param event
     */
    var redactorInputEvent = function (event) {

        /**
         * Clear previous sync-timeout
         */
        if (this.redactorSyncTimeout){
            clearTimeout(this.redactorSyncTimeout);
        }

        /**
         * Start waiting to input finish and sync redactor
         */
        this.redactorSyncTimeout = setTimeout(function() {

            cEditor.content.sync();

        }, 500);

    };

    /**
     * @protected
     *
     * Show or Hide toolbox when plus button is clicked
     */
    var plusButtonClicked = function() {

        if (!cEditor.nodes.toolbox.classList.contains('opened')) {

            cEditor.toolbar.toolbox.open();

        } else {

            cEditor.toolbar.toolbox.close();

        }
    };

    /**
     * @protected
     *
     * Sets block to removed state or if block's state is removed function deletes it from stream (DOM tree)
     */
    var removeBlock = function(event) {

        var current             = cEditor.content.currentNode,
            removeBlockButton   = cEditor.nodes.removeBlockButton,
            firstLevelBlocksCount;

        /**
         * If block doesn't have 'removing-request' class then we add it
         */
        if (!current.classList.contains('removing-request')) {

            current.classList.add('removing-request');

            /** Make trash tool active */
            removeBlockButton.classList.add('trash-active');

        } else {

            /** If block has 'removing-request' class then remove this block from DOM tree */
            current.remove();

            firstLevelBlocksCount = cEditor.nodes.redactor.childNodes.length;

            /**
             * If all blocks are removed
             */
            if (firstLevelBlocksCount === 0) {

                /** update currentNode variable */
                cEditor.content.currentNode = null;

                /** Inserting new empty initial block */
                cEditor.ui.addInitialBlock();
            }

            /** Close toolbar */
            cEditor.toolbar.close();

        }

        cEditor.ui.saveInputs();

    };

    /**
     * @protected
     *
     * Block handlers for KeyDown events
     */
    var blockKeydown = function(event, block) {

        switch (event.keyCode){

            case cEditor.core.keys.DOWN:
            case cEditor.core.keys.RIGHT:
                cEditor.callback.blockRightOrDownArrowPressed(block);
                break;

            case cEditor.core.keys.ENTER:
                cEditor.callback.enterPressedOnBlock(block, event);
                break;

            case cEditor.core.keys.BACKSPACE:
                cEditor.callback.backspacePressed(block);
                break;

            case cEditor.core.keys.UP:
            case cEditor.core.keys.LEFT:
                cEditor.callback.blockLeftOrUpArrowPressed(block);
                break;

        }
    };

    /**
     * @protected
     *
     * RIGHT or DOWN keydowns on block
     */
    var blockRightOrDownArrowPressed = function (block) {

        var selection   = window.getSelection(),
            inputs      = cEditor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        /** Check for caret existance */
        if (!focusedNode){
            return false;
        }

        /** Looking for closest (parent) contentEditable element of focused node */
        while (focusedNode.contentEditable != 'true') {

            focusedNodeHolder = focusedNode.parentNode;
            focusedNode       = focusedNodeHolder;
        }

        /** Input index in DOM level */
        var editableElementIndex = 0;
        while (focusedNode != inputs[editableElementIndex]) {
            editableElementIndex ++;
        }

        /**
         * Founded contentEditable element doesn't have childs
         * Or maybe New created block
         */
        if (!focusedNode.textContent)
        {
            cEditor.caret.setToNextBlock(editableElementIndex);
            return;
        }

        /**
         * Do nothing when caret doesn not reaches the end of last child
         */
        var caretInLastChild    = false,
            caretAtTheEndOfText = false;

        var lastChild,
            deepestTextnode;

        lastChild = focusedNode.childNodes[focusedNode.childNodes.length - 1 ];

        if (cEditor.core.isDomNode(lastChild)) {

            deepestTextnode = cEditor.content.getDeepestTextNodeFromPosition(lastChild, lastChild.childNodes.length);

        } else {

            deepestTextnode = lastChild;

        }

        caretInLastChild = selection.anchorNode == deepestTextnode;
        caretAtTheEndOfText = deepestTextnode.length == selection.anchorOffset;

        if ( !caretInLastChild  || !caretAtTheEndOfText ) {
            cEditor.core.log('arrow [down|right] : caret does not reached the end');
            return false;
        }

        cEditor.caret.setToNextBlock(editableElementIndex);

    };

    /**
     * @protected
     *
     * LEFT or UP keydowns on block
     */
    var blockLeftOrUpArrowPressed = function (block) {

        var selection   = window.getSelection(),
            inputs      = cEditor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        /** Check for caret existance */
        if (!focusedNode){
            return false;
        }

        /**
         * LEFT or UP not at the beginning
         */
        if ( selection.anchorOffset !== 0) {
            return false;
        }

        /** Looking for parent contentEditable block */
        while (focusedNode.contentEditable != 'true') {
            focusedNodeHolder = focusedNode.parentNode;
            focusedNode       = focusedNodeHolder;
        }

        /** Input index in DOM level */
        var editableElementIndex = 0;
        while (focusedNode != inputs[editableElementIndex]) {
            editableElementIndex ++;
        }

        /**
         * Do nothing if caret is not at the beginning of first child
         */
        var caretInFirstChild   = false,
            caretAtTheBeginning = false;

        var firstChild,
            deepestTextnode;

        /**
         * Founded contentEditable element doesn't have childs
         * Or maybe New created block
         */
        if (!focusedNode.textContent) {
            cEditor.caret.setToPreviousBlock(editableElementIndex);
            return;
        }

        firstChild = focusedNode.childNodes[0];

        if (cEditor.core.isDomNode(firstChild)) {

            deepestTextnode = cEditor.content.getDeepestTextNodeFromPosition(firstChild, 0);

        } else {

            deepestTextnode = firstChild;

        }

        caretInFirstChild   = selection.anchorNode == deepestTextnode;
        caretAtTheBeginning = selection.anchorOffset === 0;

        if ( caretInFirstChild && caretAtTheBeginning ) {

            cEditor.caret.setToPreviousBlock(editableElementIndex);

        }

    };

    /**
     * @protected
     */
    var enterPressedOnBlock = function (block, event) {

        var selection   = window.getSelection(),
            currentNode = selection.anchorNode,
            parentOfFocusedNode = currentNode.parentNode;

        /**
         * We add new block with contentEditable property if enter key is pressed.
         * First we check, if caret is at the end of last node and offset is legth of text node
         * focusedNodeIndex + 1, because that we compare non-arrays index.
         */
        if ( currentNode.length === cEditor.caret.offset &&
            parentOfFocusedNode.childNodes.length == cEditor.caret.focusedNodeIndex + 1) {

            /** Prevent <div></div> creation */
            event.preventDefault();

            /** Create new Block and append it after current */
            var newBlock = cEditor.draw.block('p');

            newBlock.contentEditable = "true";
            newBlock.classList.add(cEditor.ui.className.BLOCK_CLASSNAME);

            /** Add event listeners (Keydown) for new created block */
            cEditor.ui.addBlockHandlers(newBlock);

            cEditor.core.insertAfter(block, newBlock);

            /** set focus to the current (created) block */
            cEditor.caret.setToNextBlock(block);

            cEditor.toolbar.move();
        }
    };

    /**
     * @protected
     *
     * @param block
     */
    var backspacePressed = function (block) {

        if (block.textContent.trim()) {

            var range           = cEditor.content.getRange(),
                selectionLength = range.endOffset - range.startOffset;

            if (cEditor.caret.position.atStart() && !selectionLength) {

                var currentInputIndex = cEditor.caret.getCurrentInputIndex();
                cEditor.content.mergeBlocks(currentInputIndex);

            } else {

                return;

            }
        }

        block.remove();

        var firstLevelBlocksCount = cEditor.nodes.redactor.childNodes.length;

        /**
         * If all blocks are removed
         */
        if (firstLevelBlocksCount === 0) {

            /** update currentNode variable */
            cEditor.content.currentNode = null;

            /** Inserting new empty initial block */
            cEditor.ui.addInitialBlock();

            /** Updating inputs state after deleting last block */
            cEditor.ui.saveInputs();

            /** Set to current appended block */
            setTimeout(function () {

                cEditor.caret.setToPreviousBlock(1);

            }, 10);

        } else {

            if (cEditor.caret.inputIndex !== 0) {

                /** Target block is not first */
                cEditor.caret.setToPreviousBlock(cEditor.caret.inputIndex);

            } else {

                /** If we try to delete first block */
                cEditor.caret.setToNextBlock(cEditor.caret.inputIndex);

            }
        }

        cEditor.toolbar.move();

        if (!cEditor.toolbar.opened) {
            cEditor.toolbar.open();
        }

        /** Updating inputs state */
        cEditor.ui.saveInputs();

        /** Prevent default browser behaviour */
        event.preventDefault();

    };

    /**
     * @protected
     *
     * @param event
     * @param block
     */
    var blockPaste = function(event, block) {

        var clipboardData, pastedData, nodeContent;

        /** Prevent Default Browser behaviour */
        event.preventDefault();

        clipboardData = event.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');

        nodeContent = document.createTextNode(pastedData);

        var index = cEditor.caret.getCurrentInputIndex();

        /** Insert parsed content to the editable block */
        var editableElement = cEditor.state.inputs[index];
        editableElement.appendChild(nodeContent);
    };

    /**
     * @protected
     *
     * Clicks on block settings button
     */
    var showSettingsButtonClicked = function(){

        /**
         * Get type of current block
         * It uses to append settings from tool.settings property.
         * ...
         * Type is stored in data-type attribute on block
         */
        var currentToolType = cEditor.content.currentNode.dataset.type;

        cEditor.toolbar.settings.toggle(currentToolType);

        /** Close toolbox when settings button is active */
        cEditor.toolbar.toolbox.close();

    };

    return {
        redactorSyncTimeout     : redactorSyncTimeout,
        globalKeydown           : globalKeydown,
        globalKeyup             : globalKeyup,
        tabKeyPressed           : tabKeyPressed,
        enterKeyPressed         : enterKeyPressed,
        escapeKeyPressed        : escapeKeyPressed,
        arrowKeyPressed         : arrowKeyPressed,
        defaultKeyPressed       : defaultKeyPressed,
        redactorClicked         : redactorClicked,
        toolbarButtonClicked    : toolbarButtonClicked,
        redactorInputEvent      : redactorInputEvent,
        plusButtonClicked       : plusButtonClicked,
        removeBlock             : removeBlock,
        blockKeydown            : blockKeydown,
        blockRightOrDownArrowPressed    : blockRightOrDownArrowPressed,
        blockLeftOrUpArrowPressed       : blockLeftOrUpArrowPressed,
        enterPressedOnBlock     : enterPressedOnBlock,
        backspacePressed        : backspacePressed,
        blockPaste              : blockPaste,
        showSettingsButtonClicked       : showSettingsButtonClicked
    };

})();

module.exports = callbacks;