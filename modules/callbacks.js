/**
 * Codex Editor callbacks module
 *
 * @author Codex Team
 * @version 1.3.7
 */
let editor = codex.editor;

module.exports = (function (callbacks) {

    callbacks.globalKeydown = function (event) {

        switch (event.keyCode) {
            case editor.core.keys.ENTER : editor.callback.enterKeyPressed(event);     break;
        }

    };

    callbacks.redactorKeyDown = function (event) {

        switch (event.keyCode) {
            case editor.core.keys.TAB   : editor.callback.tabKeyPressed(event);                     break;
            case editor.core.keys.ENTER : editor.callback.enterKeyPressedOnRedactorZone(event);     break;
            case editor.core.keys.ESC   : editor.callback.escapeKeyPressed(event);                  break;
            default                    : editor.callback.defaultKeyPressed(event);                 break;
        }

    };

    callbacks.globalKeyup = function (event) {

        switch (event.keyCode) {
            case editor.core.keys.UP    :
            case editor.core.keys.LEFT  :
            case editor.core.keys.RIGHT :
            case editor.core.keys.DOWN  : editor.callback.arrowKeyPressed(event); break;
        }

    };

    callbacks.tabKeyPressed = function (event) {

        if ( !editor.toolbar.opened ) {

            editor.toolbar.open();

        }

        if (editor.toolbar.opened && !editor.toolbar.toolbox.opened) {

            editor.toolbar.toolbox.open();

        } else {

            editor.toolbar.toolbox.leaf();

        }

        event.preventDefault();

    };

    /**
    * @param {Event} event
    */
    callbacks.enterKeyPressed = function () {

        if (editor.content.editorAreaHightlighted) {

            /**
             * it means that we lose input index, saved index before is not correct
             * therefore we need to set caret when we insert new block
             */
            editor.caret.inputIndex = -1;

            editor.callback.enterPressedOnBlock();

        }

    };

    /**
     * ENTER key handler
     * Makes new paragraph block
     */
    callbacks.enterKeyPressedOnRedactorZone = function (event) {

        if (event.target.contentEditable == 'true') {

            /** Update input index */
            editor.caret.saveCurrentInputIndex();

        }

        var currentInputIndex       = editor.caret.getCurrentInputIndex() || 0,
            workingNode             = editor.content.currentNode,
            tool                    = workingNode.dataset.tool,
            isEnterPressedOnToolbar = editor.toolbar.opened &&
                                        editor.toolbar.current &&
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

            editor.toolbar.toolbox.toolClicked(event);

            editor.toolbar.close();

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
            caretAtTheEndOfText = editor.caret.position.atTheEnd(),
            isTextNodeHasParentBetweenContenteditable = false;

        /**
         * Allow making new <p> in same block by SHIFT+ENTER and forbids to prevent default browser behaviour
         */
        if ( event.shiftKey && !enableLineBreaks ) {

            editor.callback.enterPressedOnBlock(editor.content.currentBlock, event);
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
            currentSelectedNode.nodeType == editor.core.nodeTypes.TEXT &&
            !isTextNodeHasParentBetweenContenteditable &&
            !caretAtTheEndOfText
        ) {

            event.preventDefault();

            editor.core.log('Splitting Text node...');

            editor.content.splitBlock(currentInputIndex);

            /** Show plus button when next input after split is empty*/
            if (!editor.state.inputs[currentInputIndex + 1].textContent.trim()) {

                editor.toolbar.showPlusButton();

            }

        } else {

            var islastNode = editor.content.isLastNode(currentSelectedNode);

            if ( islastNode && caretAtTheEndOfText ) {

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                editor.core.log('ENTER clicked in last textNode. Create new BLOCK');

                editor.content.insertBlock({
                    type: NEW_BLOCK_TYPE,
                    block: editor.tools[NEW_BLOCK_TYPE].render()
                }, true);

                editor.toolbar.move();
                editor.toolbar.open();

                /** Show plus button with empty block */
                editor.toolbar.showPlusButton();

            }

        }

        /** get all inputs after new appending block */
        editor.ui.saveInputs();

    };

    callbacks.escapeKeyPressed = function (event) {

        /** Close all toolbar */
        editor.toolbar.close();

        /** Close toolbox */
        editor.toolbar.toolbox.close();

        event.preventDefault();

    };

    /**
    * @param {Event} event
    */
    callbacks.arrowKeyPressed = function () {

        editor.content.workingNodeChanged();

        /* Closing toolbar */
        editor.toolbar.close();
        editor.toolbar.move();

    };

    /**
    * @param {Event} event
    */
    callbacks.defaultKeyPressed = function () {

        editor.toolbar.close();

        if (!editor.toolbar.inline.actionsOpened) {

            editor.toolbar.inline.close();
            editor.content.clearMark();

        }

    };

    callbacks.redactorClicked = function (event) {

        callbacks.detectWhenClickedOnFirstLevelBlockArea();

        editor.content.workingNodeChanged(event.target);

        editor.ui.saveInputs();

        var selectedText = editor.toolbar.inline.getSelectionText(),
            firstLevelBlock;

        /**
         * If selection range took off, then we hide inline toolbar
         */
        if (selectedText.length === 0) {

            editor.toolbar.inline.close();

        }

        /** Update current input index in memory when caret focused into existed input */
        if (event.target.contentEditable == 'true') {

            editor.caret.saveCurrentInputIndex();

        }

        if (editor.content.currentNode === null) {

            /**
             * If inputs in redactor does not exits, then we put input index 0 not -1
             */
            var indexOfLastInput = editor.state.inputs.length > 0 ? editor.state.inputs.length - 1 : 0;

            /** If we have any inputs */
            if (editor.state.inputs.length) {

                /**
                * @todo Refactor
                */

                /** getting firstlevel parent of input */
                firstLevelBlock = editor.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);

            }

            /** If input is empty, then we set caret to the last input */
            if (editor.state.inputs.length && editor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == editor.settings.initialBlockPlugin) {

                editor.caret.setToBlock(indexOfLastInput);

            } else {

                /** Create new input when caret clicked in redactors area */
                var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;

                editor.content.insertBlock({
                    type  : NEW_BLOCK_TYPE,
                    block : editor.tools[NEW_BLOCK_TYPE].render()
                });

                /** If there is no inputs except inserted */
                if (editor.state.inputs.length === 1) {

                    editor.caret.setToBlock(indexOfLastInput);

                } else {

                    /** Set caret to this appended input */
                    editor.caret.setToNextBlock(indexOfLastInput);

                }

            }

            /**
             * Move toolbar to the right position and open
             */
            editor.toolbar.move();
            editor.toolbar.open();

        } else {

            /**
             * Move toolbar to the new position and open
             */
            editor.toolbar.move();
            editor.toolbar.open();

            /** Close all panels */
            editor.toolbar.settings.close();
            editor.toolbar.toolbox.close();

        }


        var inputIsEmpty = !editor.content.currentNode.textContent.trim(),
            currentNodeType = editor.content.currentNode.dataset.tool,
            isInitialType = currentNodeType == editor.settings.initialBlockPlugin;


        /** Hide plus buttons */
        editor.toolbar.hidePlusButton();

        /** Mark current block */
        editor.content.markBlock();


        if ( isInitialType && inputIsEmpty ) {

            /** Show plus button */
            editor.toolbar.showPlusButton();

        }


    };

    /**
     * This method allows to define, is caret in contenteditable element or not.
     * Otherwise, if we get TEXT node from range container, that will means we have input index.
     * In this case we use default browsers behaviour (if plugin allows that) or overwritten action.
     * Therefore, to be sure that we've clicked first-level block area, we should have currentNode, which always
     * specifies to the first-level block. Other cases we just ignore.
     */
    callbacks.detectWhenClickedOnFirstLevelBlockArea = function () {

        var selection  = window.getSelection(),
            anchorNode = selection.anchorNode,
            flag = false;

        if (selection.rangeCount === 0) {

            editor.content.editorAreaHightlighted = true;

        } else {

            if (!editor.core.isDomNode(anchorNode)) {

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
            editor.content.editorAreaHightlighted = flag ? false : true;

        }

    };

    /**
     * Toolbar button click handler
     * @param this - cursor to the button
     */
    callbacks.toolbarButtonClicked = function (event) {

        var button = this;

        editor.toolbar.current = button.dataset.type;

        editor.toolbar.toolbox.toolClicked(event);
        editor.toolbar.close();

    };

    /** Show or Hide toolbox when plus button is clicked */
    callbacks.plusButtonClicked = function () {

        if (!editor.nodes.toolbox.classList.contains('opened')) {

            editor.toolbar.toolbox.open();

        } else {

            editor.toolbar.toolbox.close();

        }

    };

    /**
     * Block handlers for KeyDown events
     */
    callbacks.blockKeydown = function (event) {

        let block = this; // event.target input

        switch (event.keyCode) {

            case editor.core.keys.DOWN:
            case editor.core.keys.RIGHT:
                editor.callback.blockRightOrDownArrowPressed();
                break;

            case editor.core.keys.BACKSPACE:
                editor.callback.backspacePressed(block, event);
                break;

            case editor.core.keys.UP:
            case editor.core.keys.LEFT:
                editor.callback.blockLeftOrUpArrowPressed();
                break;

        }

    };

    /**
     * RIGHT or DOWN keydowns on block
     */
    callbacks.blockRightOrDownArrowPressed = function () {

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

            editor.caret.setToNextBlock(editableElementIndex);
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

        if (editor.core.isDomNode(lastChild)) {

            deepestTextnode = editor.content.getDeepestTextNodeFromPosition(lastChild, lastChild.childNodes.length);

        } else {

            deepestTextnode = lastChild;

        }

        caretInLastChild = selection.anchorNode == deepestTextnode;
        caretAtTheEndOfText = deepestTextnode.length == selection.anchorOffset;

        if ( !caretInLastChild  || !caretAtTheEndOfText ) {

            editor.core.log('arrow [down|right] : caret does not reached the end');
            return false;

        }

        editor.caret.setToNextBlock(editableElementIndex);

    };

    /**
     * LEFT or UP keydowns on block
     */
    callbacks.blockLeftOrUpArrowPressed = function () {

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

            editor.caret.setToPreviousBlock(editableElementIndex);
            return;

        }

        firstChild = focusedNode.childNodes[0];

        if (editor.core.isDomNode(firstChild)) {

            deepestTextnode = editor.content.getDeepestTextNodeFromPosition(firstChild, 0);

        } else {

            deepestTextnode = firstChild;

        }

        caretInFirstChild   = selection.anchorNode == deepestTextnode;
        caretAtTheBeginning = selection.anchorOffset === 0;

        if ( caretInFirstChild && caretAtTheBeginning ) {

            editor.caret.setToPreviousBlock(editableElementIndex);

        }

    };

    /**
     * Callback for enter key pressing in first-level block area
     * @param {Event} event
     */
    callbacks.enterPressedOnBlock = function () {

        var NEW_BLOCK_TYPE  = editor.settings.initialBlockPlugin;

        editor.content.insertBlock({
            type  : NEW_BLOCK_TYPE,
            block : editor.tools[NEW_BLOCK_TYPE].render()
        }, true );

        editor.toolbar.move();
        editor.toolbar.open();

    };

    callbacks.backspacePressed = function (block, event) {

        var currentInputIndex = editor.caret.getCurrentInputIndex(),
            range,
            selectionLength,
            firstLevelBlocksCount;

        if (block.textContent.trim()) {

            range           = editor.content.getRange();
            selectionLength = range.endOffset - range.startOffset;

            if (editor.caret.position.atStart() && !selectionLength && editor.state.inputs[currentInputIndex - 1]) {

                editor.content.mergeBlocks(currentInputIndex);

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
            editor.content.currentNode = null;

            /** Inserting new empty initial block */
            editor.ui.addInitialBlock();

            /** Updating inputs state after deleting last block */
            editor.ui.saveInputs();

            /** Set to current appended block */
            window.setTimeout(function () {

                editor.caret.setToPreviousBlock(1);

            }, 10);

        } else {

            if (editor.caret.inputIndex !== 0) {

                /** Target block is not first */
                editor.caret.setToPreviousBlock(editor.caret.inputIndex);

            } else {

                /** If we try to delete first block */
                editor.caret.setToNextBlock(editor.caret.inputIndex);

            }

        }

        editor.toolbar.move();

        if (!editor.toolbar.opened) {

            editor.toolbar.open();

        }

        /** Updating inputs state */
        editor.ui.saveInputs();

        /** Prevent default browser behaviour */
        event.preventDefault();

    };

    /**
     * This method is used to observe pasted dirty data.
     *
     * Mutation handlers send to separate observers each mutation (added, changed and so on), which will be
     * passed from handler that sanitizes and replaces data.
     *
     * Probably won't be used
     *
     * @deprecated
     *
     * @param event
     * @private
     */
    callbacks._blockPasteCallback = function () {

        var currentInputIndex = editor.caret.getCurrentInputIndex();

        /**
         * create an observer instance
         */
        var observer = new MutationObserver(editor.callback.handleMutationsOnPaste);

        /**
         * configuration of the observer:
         */
        var config = {
            attributes: true,
            childList: false,
            characterData: false,
            subtree : true
        };

        // pass in the target node, as well as the observer options
        observer.observe(editor.state.inputs[currentInputIndex], config);

    };

    /**
     * This method prevents default behaviour.
     *
     * We get from clipboard pasted data, sanitize, make a fragment that contains of this sanitized nodes.
     * Firstly, we need to memorize the caret position. We can do that by getting the range of selection.
     * After all, we insert clear fragment into caret placed position. Then, we should move the caret to the last node
     *
     * @param event
     */
    callbacks.blockPasteCallback = function (event) {

        /** Prevent default behaviour */
        event.preventDefault();

        /** Allow paste when event target is editable */
        if (event.target.contentEditable != 'true') {

            return;

        }

        /** get html pasted data - dirty data */
        var data = event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain');

        /** Temporary DIV that is used to work with childs as arrays item */
        var div     = editor.draw.node('DIV', '', {}),
            cleaner = new editor.sanitizer.init(editor.sanitizer.Config.BASIC),
            cleanData,
            fragment;

        /** Create fragment, that we paste to range after proccesing */
        fragment = document.createDocumentFragment();

        cleanData = cleaner.clean(data);

        div.innerHTML = cleanData;

        var node, lastNode;

        /**
         * and fill in fragment
         */
        while (( node = div.firstChild) ) {

            lastNode = fragment.appendChild(node);

        }

        /**
         * work with selection and range
         */
        var selection, range;

        selection = window.getSelection();

        range = selection.getRangeAt(0);
        range.deleteContents();

        range.insertNode(fragment);

        /** Preserve the selection */
        if (lastNode) {

            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

        }

    };

    /**
     * Sends all mutations to paste handler
     */
    callbacks.handleMutationsOnPaste = function (mutations) {

        var self = this;

        /**
         * Calling function with context of this function.
         * Also, we should sanitize pasted or changed data one time and ignore
         * changings which makes sanitize method.
         * For that, we need to send Context, MutationObserver.__proto__ that contains
         * observer disconnect method.
         */
        mutations.forEach(function (mutation) {

            editor.content.paste.call(self, mutation);

        });

    };

    /**
     * Clicks on block settings button
     */
    callbacks.showSettingsButtonClicked = function () {

        /**
         * Get type of current block
         * It uses to append settings from tool.settings property.
         * ...
         * Type is stored in data-type attribute on block
         */
        var currentToolType = editor.content.currentNode.dataset.tool;

        editor.toolbar.settings.toggle(currentToolType);

        /** Close toolbox when settings button is active */
        editor.toolbar.toolbox.close();
        editor.toolbar.settings.hideRemoveActions();

    };

    return callbacks;

})({});