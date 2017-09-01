/**
 * @module Codex Editor Callbacks module
 * @description Module works with editor added Elements
 *
 * @author Codex Team
 * @version 1.4.0
 */

module.exports = (function () {

    let callbacks = {};

    let editor = this;

    /**
     * used by UI module
     * @description Routes all keydowns on document
     * @param {Object} event
     */
    callbacks.globalKeydown = function (event) {

        switch (event.keyCode) {
            case editor.modules.core.keys.ENTER : enterKeyPressed_(event);     break;
        }

    };

    /**
     * used by UI module
     * @description Routes all keydowns on redactors area
     * @param {Object} event
     */
    callbacks.redactorKeyDown = function (event) {

        switch (event.keyCode) {
            case editor.modules.core.keys.TAB   : tabKeyPressedOnRedactorsZone_(event);                     break;
            case editor.modules.core.keys.ENTER : enterKeyPressedOnRedactorsZone_(event);                   break;
            case editor.modules.core.keys.ESC   : escapeKeyPressedOnRedactorsZone_(event);                  break;
            default                     : defaultKeyPressedOnRedactorsZone_(event);                 break;
        }

    };

    /**
     * used by UI module
     * @description Routes all keyup events
     * @param {Object} event
     */
    callbacks.globalKeyup = function (event) {

        switch (event.keyCode) {
            case editor.modules.core.keys.UP    :
            case editor.modules.core.keys.LEFT  :
            case editor.modules.core.keys.RIGHT :
            case editor.modules.core.keys.DOWN  : arrowKeyPressed_(event); break;
        }

    };

    /**
     * @param {Object} event
     * @private
     *
     * Handles behaviour when tab pressed
     * @description if Content is empty show toolbox (if it is closed) or leaf tools
     * uses Toolbars toolbox module to handle the situation
     */
    var tabKeyPressedOnRedactorsZone_ = function (event) {

        /**
         * Wait for solution. Would like to know the behaviour
         * @todo Add spaces
         */
        event.preventDefault();


        if (!editor.modules.core.isBlockEmpty(editor.modules.content.currentNode)) {

            return;

        }

        if ( !editor.modules.toolbar.opened  ) {

            editor.modules.toolbar.open();

        }

        if (editor.modules.toolbar.opened && !editor.modules.toolbar.toolbox.opened) {

            editor.modules.toolbar.toolbox.open();

        } else {

            editor.modules.toolbar.toolbox.leaf();

        }

    };

    /**
     * Handles global EnterKey Press
     * @see enterPressedOnBlock_
     * @param {Object} event
     */
    var enterKeyPressed_ = function () {

        if (editor.modules.content.editorAreaHightlighted) {

            /**
             * it means that we lose input index, saved index before is not correct
             * therefore we need to set caret when we insert new block
             */
            editor.modules.caret.inputIndex = -1;

            enterPressedOnBlock_();

        }

    };

    /**
     * Callback for enter key pressing in first-level block area
     *
     * @param {Event} event
     * @private
     *
     * @description Inserts new block with initial type from settings
     */
    var enterPressedOnBlock_ = function () {

        var NEW_BLOCK_TYPE  = editor.settings.initialBlockPlugin;

        editor.modules.content.insertBlock({
            type  : NEW_BLOCK_TYPE,
            block : editor.tools[NEW_BLOCK_TYPE].render()
        }, true );

        editor.modules.toolbar.move();
        editor.modules.toolbar.open();

    };


    /**
     * ENTER key handler
     *
     * @param {Object} event
     * @private
     *
     * @description Makes new block with initial type from settings
     */
    var enterKeyPressedOnRedactorsZone_ = function (event) {

        if (event.target.contentEditable == 'true') {

            /** Update input index */
            editor.modules.caret.saveCurrentInputIndex();

        }

        var currentInputIndex       = editor.modules.caret.getCurrentInputIndex() || 0,
            workingNode             = editor.modules.content.currentNode,
            tool                    = workingNode.dataset.tool,
            isEnterPressedOnToolbar = editor.modules.toolbar.opened &&
                                        editor.modules.toolbar.current &&
                                        event.target == editor.state.inputs[currentInputIndex];

        /** The list of tools which needs the default browser behaviour */
        var enableLineBreaks = editor.tools[tool].enableLineBreaks;

        /** This type of block creates when enter is pressed */
        var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;

        /**
         * When toolbar is opened, select tool instead of making new paragraph
         */
        if ( isEnterPressedOnToolbar ) {

            event.preventDefault();

            editor.modules.toolbar.toolbox.toolClicked(event);

            editor.modules.toolbar.close();

            /**
             * Stop other listeners callback executions
             */
            event.stopPropagation();
            event.stopImmediatePropagation();

            return;

        }

        /**
         * Allow paragraph lineBreaks with shift enter
         * Or if shiftkey pressed and enter and enabledLineBreaks, the let new block creation
         */
        if ( event.shiftKey || enableLineBreaks ) {

            event.stopPropagation();
            event.stopImmediatePropagation();
            return;

        }

        var currentSelection = window.getSelection(),
            currentSelectedNode = currentSelection.anchorNode,
            caretAtTheEndOfText = editor.modules.caret.position.atTheEnd(),
            isTextNodeHasParentBetweenContenteditable = false;

        /**
         * Allow making new <p> in same block by SHIFT+ENTER and forbids to prevent default browser behaviour
         */
        if ( event.shiftKey && !enableLineBreaks ) {

            editor.modules.callback.enterPressedOnBlock(editor.modules.content.currentBlock, event);
            event.preventDefault();
            return;

        }

        /**
         * Workaround situation when caret at the Text node that has some wrapper Elements
         * Split block cant handle this.
         * We need to save default behavior
         */
        isTextNodeHasParentBetweenContenteditable = currentSelectedNode && currentSelectedNode.parentNode.contentEditable != 'true';

        /**
         * Split blocks when input has several nodes and caret placed in textNode
         */
        if (
            currentSelectedNode.nodeType == editor.modules.core.nodeTypes.TEXT &&
            !isTextNodeHasParentBetweenContenteditable &&
            !caretAtTheEndOfText
        ) {

            event.preventDefault();

            editor.modules.core.log('Splitting Text node...');

            editor.modules.content.splitBlock(currentInputIndex);

            /** Show plus button when next input after split is empty*/
            if (!editor.state.inputs[currentInputIndex + 1].textContent.trim()) {

                editor.modules.toolbar.showPlusButton();

            }

        } else {

            var islastNode = editor.modules.content.isLastNode(currentSelectedNode);

            if ( islastNode && caretAtTheEndOfText ) {

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                editor.modules.core.log('ENTER clicked in last textNode. Create new BLOCK');

                editor.modules.content.insertBlock({
                    type: NEW_BLOCK_TYPE,
                    block: editor.modules.renderer.makeBlockFromData({type: NEW_BLOCK_TYPE})
                }, true);

                editor.modules.toolbar.move();
                editor.modules.toolbar.open();

                /** Show plus button with empty block */
                editor.modules.toolbar.showPlusButton();

            }

        }

        /** get all inputs after new appending block */
        editor.modules.ui.saveInputs();

    };

    /**
     * Escape behaviour
     * @param event
     * @private
     *
     * @description Closes toolbox and toolbar. Prevents default behaviour
     */
    var escapeKeyPressedOnRedactorsZone_ = function (event) {

        /** Close all toolbar */
        editor.modules.toolbar.close();

        /** Close toolbox */
        editor.modules.toolbar.toolbox.close();

        event.preventDefault();

    };

    /**
     * @param {Event} event
     * @private
     *
     * closes and moves toolbar
     */
    var arrowKeyPressed_ = function (event) {

        editor.modules.content.workingNodeChanged();

        /* Closing toolbar */
        editor.modules.toolbar.close();
        editor.modules.toolbar.move();

    };

    /**
     * @private
     * @param {Event} event
     *
     * @description Closes all opened bars from toolbar.
     * If block is mark, clears highlightning
     */
    var defaultKeyPressedOnRedactorsZone_ = function () {

        editor.modules.toolbar.close();

        if (!editor.modules.toolbar.inline.actionsOpened) {

            editor.modules.toolbar.inline.close();
            editor.modules.content.clearMark();

        }

    };

    /**
     * Handler when clicked on redactors area
     *
     * @protected
     * @param event
     *
     * @description Detects clicked area. If it is first-level block area, marks as detected and
     * on next enter press will be inserted new block
     * Otherwise, save carets position (input index) and put caret to the editable zone.
     *
     * @see detectWhenClickedOnFirstLevelBlockArea_
     *
     */
    callbacks.redactorClicked = function (event) {

        detectWhenClickedOnFirstLevelBlockArea_();

        editor.modules.content.workingNodeChanged(event.target);
        editor.modules.ui.saveInputs();

        var selectedText = editor.modules.toolbar.inline.getSelectionText(),
            firstLevelBlock;

        /** If selection range took off, then we hide inline toolbar */
        if (selectedText.length === 0) {

            editor.modules.toolbar.inline.close();

        }

        /** Update current input index in memory when caret focused into existed input */
        if (event.target.contentEditable == 'true') {

            editor.modules.caret.saveCurrentInputIndex();

        }

        if (editor.modules.content.currentNode === null) {

            /**
             * If inputs in redactor does not exits, then we put input index 0 not -1
             */
            var indexOfLastInput = editor.state.inputs.length > 0 ? editor.state.inputs.length - 1 : 0;

            /** If we have any inputs */
            if (editor.state.inputs.length) {

                /** getting firstlevel parent of input */
                firstLevelBlock = editor.modules.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);

            }

            /** If input is empty, then we set caret to the last input */
            if (editor.state.inputs.length && editor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == editor.settings.initialBlockPlugin) {

                editor.modules.caret.setToBlock(indexOfLastInput);

            } else {

                /** Create new input when caret clicked in redactors area */
                var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;

                editor.modules.content.insertBlock({
                    type  : NEW_BLOCK_TYPE,
                    block : editor.modules.renderer.makeBlockFromData({type: NEW_BLOCK_TYPE})
                });

                /** If there is no inputs except inserted */
                if (editor.state.inputs.length === 1) {

                    editor.modules.caret.setToBlock(indexOfLastInput);

                } else {

                    /** Set caret to this appended input */
                    editor.modules.caret.setToNextBlock(indexOfLastInput);

                }

            }

        } else {

            /** Close all panels */
            editor.modules.toolbar.settings.close();
            editor.modules.toolbar.toolbox.close();

        }

        /**
         * Move toolbar and open
         */
        editor.modules.toolbar.move();
        editor.modules.toolbar.open();

        var inputIsEmpty = !editor.modules.content.currentNode.textContent.trim(),
            currentNodeType = editor.modules.content.currentNode.dataset.tool,
            isInitialType = currentNodeType == editor.settings.initialBlockPlugin;


        /** Hide plus buttons */
        editor.modules.toolbar.hidePlusButton();

        if (!inputIsEmpty) {

            /** Mark current block */
            editor.modules.content.markBlock();

        }

        if ( isInitialType && inputIsEmpty ) {

            /** Show plus button */
            editor.modules.toolbar.showPlusButton();

        }


    };

    /**
     * This method allows to define, is caret in contenteditable element or not.
     *
     * @private
     *
     * @description Otherwise, if we get TEXT node from range container, that will means we have input index.
     * In this case we use default browsers behaviour (if plugin allows that) or overwritten action.
     * Therefore, to be sure that we've clicked first-level block area, we should have currentNode, which always
     * specifies to the first-level block. Other cases we just ignore.
     */
    var detectWhenClickedOnFirstLevelBlockArea_ = function () {

        var selection  = window.getSelection(),
            anchorNode = selection.anchorNode,
            flag = false;

        if (selection.rangeCount === 0) {

            editor.modules.content.editorAreaHightlighted = true;

        } else {

            if (!editor.modules.core.isDomNode(anchorNode)) {

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
            editor.modules.content.editorAreaHightlighted = !flag;

        }

    };

    /**
     * Toolbar button click handler
     *
     * @param {Object} event - cursor to the button
     * @protected
     *
     * @description gets current tool and calls render method
     */
    callbacks.toolbarButtonClicked = function (event) {

        var button = this;

        editor.modules.toolbar.current = button.dataset.type;

        editor.modules.toolbar.toolbox.toolClicked(event);
        editor.modules.toolbar.close();

    };

    /**
     * Show or Hide toolbox when plus button is clicked
     */
    callbacks.plusButtonClicked = function () {

        if (!editor.nodes.toolbox.classList.contains('opened')) {

            editor.modules.toolbar.toolbox.open();

        } else {

            editor.modules.toolbar.toolbox.close();

        }

    };

    /**
     * Block handlers for KeyDown events
     *
     * @protected
     * @param {Object} event
     *
     * Handles keydowns on block
     * @see blockRightOrDownArrowPressed_
     * @see backspacePressed_
     * @see blockLeftOrUpArrowPressed_
     */
    callbacks.blockKeydown = function (event) {

        let block = event.target; // event.target is input

        switch (event.keyCode) {

            case editor.modules.core.keys.DOWN:
            case editor.modules.core.keys.RIGHT:
                blockRightOrDownArrowPressed_(event);
                break;

            case editor.modules.core.keys.BACKSPACE:
                backspacePressed_(block, event);
                break;

            case editor.modules.core.keys.UP:
            case editor.modules.core.keys.LEFT:
                blockLeftOrUpArrowPressed_(event);
                break;

        }

    };

    /**
     * RIGHT or DOWN keydowns on block
     *
     * @param {Object} event
     * @private
     *
     * @description watches the selection and gets closest editable element.
     * Uses method getDeepestTextNodeFromPosition to get the last node of next block
     * Sets caret if it is contenteditable
     */
    var blockRightOrDownArrowPressed_ = function (event) {

        var selection   = window.getSelection(),
            inputs      = editor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        /** Check for caret existance */
        if (!focusedNode) {

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
        if (!focusedNode.textContent) {

            editor.modules.caret.setToNextBlock(editableElementIndex);
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

        if (editor.modules.core.isDomNode(lastChild)) {

            deepestTextnode = editor.modules.content.getDeepestTextNodeFromPosition(lastChild, lastChild.childNodes.length);

        } else {

            deepestTextnode = lastChild;

        }

        caretInLastChild = selection.anchorNode == deepestTextnode;
        caretAtTheEndOfText = deepestTextnode.length == selection.anchorOffset;

        if ( !caretInLastChild  || !caretAtTheEndOfText ) {

            editor.modules.core.log('arrow [down|right] : caret does not reached the end');
            return false;

        }

        editor.modules.caret.setToNextBlock(editableElementIndex);

    };

    /**
     * LEFT or UP keydowns on block
     *
     * @param {Object} event
     * @private
     *
     * watches the selection and gets closest editable element.
     * Uses method getDeepestTextNodeFromPosition to get the last node of previous block
     * Sets caret if it is contenteditable
     *
     */
    var blockLeftOrUpArrowPressed_ = function (event) {

        var selection   = window.getSelection(),
            inputs      = editor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        /** Check for caret existance */
        if (!focusedNode) {

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

            editor.modules.caret.setToPreviousBlock(editableElementIndex);
            return;

        }

        firstChild = focusedNode.childNodes[0];

        if (editor.modules.core.isDomNode(firstChild)) {

            deepestTextnode = editor.modules.content.getDeepestTextNodeFromPosition(firstChild, 0);

        } else {

            deepestTextnode = firstChild;

        }

        caretInFirstChild   = selection.anchorNode == deepestTextnode;
        caretAtTheBeginning = selection.anchorOffset === 0;

        if ( caretInFirstChild && caretAtTheBeginning ) {

            editor.modules.caret.setToPreviousBlock(editableElementIndex);

        }

    };

    /**
     * Handles backspace keydown
     *
     * @param {Element} block
     * @param {Object} event
     * @private
     *
     * @description if block is empty, delete the block and set caret to the previous block
     * If block is not empty, try to merge two blocks - current and previous
     * But it we try'n to remove first block, then we should set caret to the next block, not previous.
     * If we removed the last block, create new one
     */
    var backspacePressed_ = function (block, event) {

        var currentInputIndex = editor.modules.caret.getCurrentInputIndex(),
            range,
            selectionLength,
            firstLevelBlocksCount;

        if (editor.modules.core.isNativeInput(event.target)) {

            /** If input value is empty - remove block */
            if (event.target.value.trim() == '') {

                block.remove();

            } else {

                return;

            }

        }

        if (block.textContent.trim()) {

            range           = editor.modules.content.getRange();
            selectionLength = range.endOffset - range.startOffset;

            if (editor.modules.caret.position.atStart() && !selectionLength && editor.state.inputs[currentInputIndex - 1]) {

                editor.modules.content.mergeBlocks(currentInputIndex);

            } else {

                return;

            }

        }

        if (!selectionLength) {

            block.remove();

        }


        firstLevelBlocksCount = editor.nodes.redactor.childNodes.length;

        /**
         * If all blocks are removed
         */
        if (firstLevelBlocksCount === 0) {

            /** update currentNode variable */
            editor.modules.content.currentNode = null;

            /** Inserting new empty initial block */
            editor.modules.ui.addInitialBlock();

            /** Updating inputs state after deleting last block */
            editor.modules.ui.saveInputs();

            /** Set to current appended block */
            window.setTimeout(function () {

                editor.modules.caret.setToPreviousBlock(1);

            }, 10);

        } else {

            if (editor.modules.caret.inputIndex !== 0) {

                /** Target block is not first */
                editor.modules.caret.setToPreviousBlock(editor.modules.caret.inputIndex);

            } else {

                /** If we try to delete first block */
                editor.modules.caret.setToNextBlock(editor.modules.caret.inputIndex);

            }

        }

        editor.modules.toolbar.move();

        if (!editor.modules.toolbar.opened) {

            editor.modules.toolbar.open();

        }

        /** Updating inputs state */
        editor.modules.ui.saveInputs();

        /** Prevent default browser behaviour */
        event.preventDefault();

    };

    /**
     * used by UI module
     * Clicks on block settings button
     *
     * @param {Object} event
     * @protected
     * @description Opens toolbar settings
     */
    callbacks.showSettingsButtonClicked = function (event) {

        /**
         * Get type of current block
         * It uses to append settings from tool.settings property.
         * ...
         * Type is stored in data-type attribute on block
         */
        var currentTool = editor.modules.content.currentNode.childNodes[0].childNodes[0].tool;

        editor.modules.toolbar.settings.toggle(currentTool);

        /** Close toolbox when settings button is active */
        editor.modules.toolbar.toolbox.close();
        editor.modules.toolbar.settings.hideRemoveActions();

    };

    return callbacks;

});