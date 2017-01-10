/**
 * Codex Editor callbacks module
 *
 * @author Codex Team
 * @version 1.2.5
 */

var callbacks = (function(callbacks) {

    callbacks.redactorSyncTimeout = null;

    callbacks.globalKeydown = function(event){
        switch (event.keyCode){
            case codex.core.keys.ENTER : codex.callback.enterKeyPressed(event);     break;
        }
    };

    callbacks.redactorKeyDown = function(event) {
        switch (event.keyCode){
            case codex.core.keys.TAB   : codex.callback.tabKeyPressed(event);                     break;
            case codex.core.keys.ENTER : codex.callback.enterKeyPressedOnRedactorZone(event);     break;
            case codex.core.keys.ESC   : codex.callback.escapeKeyPressed(event);                  break;
            default                    : codex.callback.defaultKeyPressed(event);                 break;
        }
    };

    callbacks.globalKeyup = function(event){
        switch (event.keyCode){
            case codex.core.keys.UP    :
            case codex.core.keys.LEFT  :
            case codex.core.keys.RIGHT :
            case codex.core.keys.DOWN  : codex.callback.arrowKeyPressed(event); break;
        }
    };

    callbacks.tabKeyPressed = function(event){

        if ( !codex.toolbar.opened ) {
            codex.toolbar.open();
        }

        if (codex.toolbar.opened && !codex.toolbar.toolbox.opened) {
            codex.toolbar.toolbox.open();
        } else {
            codex.toolbar.toolbox.leaf();
        }

        event.preventDefault();
    };

    callbacks.enterKeyPressed = function(event) {

        if (codex.content.editorAreaHightlighted) {

            /**
             * it means that we lose input index, saved index before is not correct
             * therefore we need to set caret when we insert new block
             */
            codex.caret.inputIndex = -1;

            codex.callback.enterPressedOnBlock();
        }
    };

    /**
     * ENTER key handler
     * Makes new paragraph block
     */
    callbacks.enterKeyPressedOnRedactorZone = function(event){

        if (event.target.contentEditable == 'true') {

            /** Update input index */
            codex.caret.saveCurrentInputIndex();
        }

        if (!codex.content.currentNode) {
            /**
             * Enter key pressed in first-level block area
             */
            codex.callback.enterPressedOnBlock(event);
            return;
        }


        var currentInputIndex       = codex.caret.getCurrentInputIndex() || 0,
            workingNode             = codex.content.currentNode,
            tool                    = workingNode.dataset.tool,
            isEnterPressedOnToolbar = codex.toolbar.opened &&
                codex.toolbar.current &&
                event.target == codex.state.inputs[currentInputIndex];

        /** The list of tools which needs the default browser behaviour */
        var enableLineBreaks = codex.tools[tool].enableLineBreaks;

        /** This type of block creates when enter is pressed */
        var NEW_BLOCK_TYPE = codex.settings.initialBlockPlugin;

        /**
         * When toolbar is opened, select tool instead of making new paragraph
         */
        if ( isEnterPressedOnToolbar ) {

            event.preventDefault();

            codex.toolbar.toolbox.toolClicked(event);

            codex.toolbar.close();

            /**
             * Stop other listeners callback executions
             */
            event.stopPropagation();
            event.stopImmediatePropagation();

            return;

        }

        /**
         * Allow making new <p> in same block by SHIFT+ENTER and forbids to prevent default browser behaviour
         */
        if ( event.shiftKey && !enableLineBreaks) {
            codex.callback.enterPressedOnBlock(codex.content.currentBlock, event);
            event.preventDefault();

        } else if ( (event.shiftKey && !enableLineBreaks) || (!event.shiftKey && enableLineBreaks) ){
            /** XOR */
            return;
        }

        var isLastTextNode = false,
            currentSelection = window.getSelection(),
            currentSelectedNode = currentSelection.anchorNode,
            caretAtTheEndOfText = codex.caret.position.atTheEnd(),
            isTextNodeHasParentBetweenContenteditable = false;

        /**
         * Workaround situation when caret at the Text node that has some wrapper Elements
         * Split block cant handle this.
         * We need to save default behavior
         */
        isTextNodeHasParentBetweenContenteditable = currentSelectedNode && currentSelectedNode.parentNode.contentEditable != "true";

        /**
         * Split blocks when input has several nodes and caret placed in textNode
         */
        if (
            currentSelectedNode.nodeType == codex.core.nodeTypes.TEXT &&
            !isTextNodeHasParentBetweenContenteditable &&
            !caretAtTheEndOfText
        ){

            event.preventDefault();

            codex.core.log('Splitting Text node...');

            codex.content.splitBlock(currentInputIndex);

            /** Show plus button when next input after split is empty*/
            if (!codex.state.inputs[currentInputIndex + 1].textContent.trim()) {
                codex.toolbar.showPlusButton();
            }

        } else {

            if ( currentSelectedNode && currentSelectedNode.parentNode) {

                isLastTextNode = !currentSelectedNode.parentNode.nextSibling;

            }

            if ( isLastTextNode && caretAtTheEndOfText ) {

                event.preventDefault();

                codex.core.log('ENTER clicked in last textNode. Create new BLOCK');

                codex.content.insertBlock({
                    type  : NEW_BLOCK_TYPE,
                    block : codex.tools[NEW_BLOCK_TYPE].render()
                }, true );

                codex.toolbar.move();
                codex.toolbar.open();

                /** Show plus button with empty block */
                codex.toolbar.showPlusButton();

            } else {

                codex.core.log('Default ENTER behavior.');

            }

        }

        /** get all inputs after new appending block */
        codex.ui.saveInputs();

    };

    callbacks.escapeKeyPressed = function(event){

        /** Close all toolbar */
        codex.toolbar.close();

        /** Close toolbox */
        codex.toolbar.toolbox.close();

        event.preventDefault();

    };

    callbacks.arrowKeyPressed = function(event){

        codex.content.workingNodeChanged();

        /* Closing toolbar */
        codex.toolbar.close();
        codex.toolbar.move();

    };

    callbacks.defaultKeyPressed = function(event) {

        codex.toolbar.close();

        if (!codex.toolbar.inline.actionsOpened) {
            codex.toolbar.inline.close();
            codex.content.clearMark();
        }
    };

    callbacks.redactorClicked = function (event) {

        callbacks.markWhenClickedOnFirstLevelBlockArea();

        codex.content.workingNodeChanged(event.target);

        codex.ui.saveInputs();

        var selectedText = codex.toolbar.inline.getSelectionText();

        /**
         * If selection range took off, then we hide inline toolbar
         */
        if (selectedText.length === 0) {
            codex.toolbar.inline.close();
        }

        /** Update current input index in memory when caret focused into existed input */
        if (event.target.contentEditable == 'true') {

            codex.caret.saveCurrentInputIndex();

        }

        if (codex.content.currentNode === null) {

            /**
             * If inputs in redactor does not exits, then we put input index 0 not -1
             */
            var indexOfLastInput = codex.state.inputs.length > 0 ? codex.state.inputs.length - 1 : 0;

            /** If we have any inputs */
            if (codex.state.inputs.length) {

                /** getting firstlevel parent of input */
                var firstLevelBlock  = codex.content.getFirstLevelBlock(codex.state.inputs[indexOfLastInput]);
            }

            /** If input is empty, then we set caret to the last input */
            if (codex.state.inputs.length && codex.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == codex.settings.initialBlockPlugin) {

                codex.caret.setToBlock(indexOfLastInput);

            } else {

                /** Create new input when caret clicked in redactors area */
                var NEW_BLOCK_TYPE = codex.settings.initialBlockPlugin;

                codex.content.insertBlock({
                    type  : NEW_BLOCK_TYPE,
                    block : codex.tools[NEW_BLOCK_TYPE].render()
                });

                /** If there is no inputs except inserted */
                if (codex.state.inputs.length === 1) {

                    codex.caret.setToBlock(indexOfLastInput);

                } else {

                    /** Set caret to this appended input */
                    codex.caret.setToNextBlock(indexOfLastInput);
                }
            }

            /**
             * Move toolbar to the right position and open
             */
            codex.toolbar.move();


            codex.toolbar.open();

        } else {

            /**
             * Move toolbar to the new position and open
             */
            codex.toolbar.move();

            codex.toolbar.open();

            /** Close all panels */
            codex.toolbar.settings.close();
            codex.toolbar.toolbox.close();
        }


        var inputIsEmpty = !codex.content.currentNode.textContent.trim();

        if (inputIsEmpty) {

            /** Show plus button */
            codex.toolbar.showPlusButton();

        } else {

            /** Hide plus buttons */
            codex.toolbar.hidePlusButton();

        }

        var currentNodeType = codex.content.currentNode.dataset.tool;

        /** Mark current block*/
        if (currentNodeType != codex.settings.initialBlockPlugin || !inputIsEmpty) {

            codex.content.markBlock();

        }

    };

    /**
     * This method allows to define, is caret in contenteditable element or not.
     * Otherwise, if we get TEXT node from range container, that will means we have input index.
     * In this case we use default browsers behaviour (if plugin allows that) or overwritten action.
     * Therefore, to be sure that we've clicked first-level block area, we should have currentNode, which always
     * specifies to the first-level block. Other cases we just ignore.
     */
    callbacks.markWhenClickedOnFirstLevelBlockArea = function() {

        var selection  = window.getSelection(),
            anchorNode = selection.anchorNode,
            flag = false;

        if (selection.rangeCount == 0) {

            codex.content.editorAreaHightlighted = true;

        } else {

            if (!codex.core.isDomNode(anchorNode)) {
                anchorNode = anchorNode.parentNode;
            }

            /** Already founded, without loop */
            if (anchorNode.contentEditable == 'true') {
                flag = true;
            }

            while (anchorNode.contentEditable != 'true') {
                anchorNode = anchorNode.parentNode;

                if (anchorNode.contentEditable == 'true') {
                    flag = true;
                }

                if (anchorNode == document.body) {
                    break;
                }
            }

            /** If editable element founded, flag is "TRUE", Therefore we return "FALSE" */
            codex.content.editorAreaHightlighted = flag ? false : true;
        }

    };

    /**
     * Toolbar button click handler
     * @param this - cursor to the button
     */
    callbacks.toolbarButtonClicked = function (event) {

        var button = this;

        codex.toolbar.current = button.dataset.type;

        codex.toolbar.toolbox.toolClicked(event);
        codex.toolbar.close();

    };

    callbacks.redactorInputEvent = function (event) {

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

            codex.content.sync();

        }, 500);

    };

    /** Show or Hide toolbox when plus button is clicked */
    callbacks.plusButtonClicked = function() {

        if (!codex.nodes.toolbox.classList.contains('opened')) {

            codex.toolbar.toolbox.open();

        } else {

            codex.toolbar.toolbox.close();

        }
    };

    /**
     * Block handlers for KeyDown events
     */
    callbacks.blockKeydown = function(event, block) {

        switch (event.keyCode){

            case codex.core.keys.DOWN:
            case codex.core.keys.RIGHT:
                codex.callback.blockRightOrDownArrowPressed(block);
                break;

            case codex.core.keys.BACKSPACE:
                codex.callback.backspacePressed(block);
                break;

            case codex.core.keys.UP:
            case codex.core.keys.LEFT:
                codex.callback.blockLeftOrUpArrowPressed(block);
                break;

        }
    };

    /**
     * RIGHT or DOWN keydowns on block
     */
    callbacks.blockRightOrDownArrowPressed = function (block) {

        var selection   = window.getSelection(),
            inputs      = codex.state.inputs,
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
            codex.caret.setToNextBlock(editableElementIndex);
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

        if (codex.core.isDomNode(lastChild)) {

            deepestTextnode = codex.content.getDeepestTextNodeFromPosition(lastChild, lastChild.childNodes.length);

        } else {

            deepestTextnode = lastChild;

        }

        caretInLastChild = selection.anchorNode == deepestTextnode;
        caretAtTheEndOfText = deepestTextnode.length == selection.anchorOffset;

        if ( !caretInLastChild  || !caretAtTheEndOfText ) {
            codex.core.log('arrow [down|right] : caret does not reached the end');
            return false;
        }

        codex.caret.setToNextBlock(editableElementIndex);

    };

    /**
     * LEFT or UP keydowns on block
     */
    callbacks.blockLeftOrUpArrowPressed = function (block) {

        var selection   = window.getSelection(),
            inputs      = codex.state.inputs,
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
            codex.caret.setToPreviousBlock(editableElementIndex);
            return;
        }

        firstChild = focusedNode.childNodes[0];

        if (codex.core.isDomNode(firstChild)) {

            deepestTextnode = codex.content.getDeepestTextNodeFromPosition(firstChild, 0);

        } else {

            deepestTextnode = firstChild;

        }

        caretInFirstChild   = selection.anchorNode == deepestTextnode;
        caretAtTheBeginning = selection.anchorOffset === 0;

        if ( caretInFirstChild && caretAtTheBeginning ) {

            codex.caret.setToPreviousBlock(editableElementIndex);

        }

    };

    /**
     * Callback for enter key pressing in first-level block area
     */
    callbacks.enterPressedOnBlock = function (event) {

        var NEW_BLOCK_TYPE  = codex.settings.initialBlockPlugin;

        codex.content.insertBlock({
            type  : NEW_BLOCK_TYPE,
            block : codex.tools[NEW_BLOCK_TYPE].render()
        }, true );

        codex.toolbar.move();
        codex.toolbar.open();

    };

    callbacks.backspacePressed = function (block) {

        var currentInputIndex = codex.caret.getCurrentInputIndex(),
            range,
            selectionLength,
            firstLevelBlocksCount;

        if (block.textContent.trim()) {

            range           = codex.content.getRange();
            selectionLength = range.endOffset - range.startOffset;


            if (codex.caret.position.atStart() && !selectionLength && codex.state.inputs[currentInputIndex - 1]) {

                codex.content.mergeBlocks(currentInputIndex);

            } else {

                return;

            }
        }

        if (!selectionLength) {
            block.remove();
        }


        firstLevelBlocksCount = codex.nodes.redactor.childNodes.length;

        /**
         * If all blocks are removed
         */
        if (firstLevelBlocksCount === 0) {

            /** update currentNode variable */
            codex.content.currentNode = null;

            /** Inserting new empty initial block */
            codex.ui.addInitialBlock();

            /** Updating inputs state after deleting last block */
            codex.ui.saveInputs();

            /** Set to current appended block */
            setTimeout(function () {

                codex.caret.setToPreviousBlock(1);

            }, 10);

        } else {

            if (codex.caret.inputIndex !== 0) {

                /** Target block is not first */
                codex.caret.setToPreviousBlock(codex.caret.inputIndex);

            } else {

                /** If we try to delete first block */
                codex.caret.setToNextBlock(codex.caret.inputIndex);

            }
        }

        codex.toolbar.move();

        if (!codex.toolbar.opened) {
            codex.toolbar.open();
        }

        /** Updating inputs state */
        codex.ui.saveInputs();

        /** Prevent default browser behaviour */
        event.preventDefault();

    };

    callbacks.blockPaste = function(event) {

        var currentInputIndex = codex.caret.getCurrentInputIndex(),
            node = codex.state.inputs[currentInputIndex];

        setTimeout(function() {

            codex.content.sanitize(node);

            event.preventDefault();

        }, 10);

        event.stopImmediatePropagation();

    };

    callbacks._blockPaste = function(event) {

        var currentInputIndex = codex.caret.getCurrentInputIndex();

        /**
         * create an observer instance
         */
        var observer = new MutationObserver(codex.callback.handlePasteEvents);

        /**
         * configuration of the observer:
         */
        var config = {
            attributes: true,
            childList: true,
            characterData: false,
            subtree : true
        };

        // pass in the target node, as well as the observer options
        observer.observe(codex.state.inputs[currentInputIndex], config);
    };

    /**
     * Sends all mutations to paste handler
     */
    callbacks.handlePasteEvents = function(mutations) {

        var self = this;

        /**
         * Calling function with context of this function.
         * Also, we should sanitize pasted or changed data one time and ignore
         * changings which makes sanitize method.
         * For that, we need to send Context, MutationObserver.__proto__ that contains
         * observer disconnect method.
         */
        mutations.forEach(function(mutation) {
            codex.content.paste.call(self, mutation);
        });
    };

    /**
     * Clicks on block settings button
     */
    callbacks.showSettingsButtonClicked = function(){

        /**
         * Get type of current block
         * It uses to append settings from tool.settings property.
         * ...
         * Type is stored in data-type attribute on block
         */
        var currentToolType = codex.content.currentNode.dataset.tool;

        codex.toolbar.settings.toggle(currentToolType);

        /** Close toolbox when settings button is active */
        codex.toolbar.toolbox.close();
        codex.toolbar.settings.hideRemoveActions();

    };

    return callbacks;

})({});

module.exports  = callbacks;
