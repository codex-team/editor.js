/**
* CodeX Editor
* https://ifmo.su/editor
* @author CodeX team team@ifmo.su
*/

var cEditor = (function (cEditor) {

    // Default settings
    cEditor.settings = {
        tools      : ['paragraph', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
        textareaId : 'codex-editor',

        // First-level tags viewing as separated blocks. Other'll be inserted as child
        blockTags: ['P', 'BLOCKQUOTE', 'UL', 'CODE', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
        uploadImagesUrl: '/editor/transport/',

        // Type of block showing on empty editor
        initialBlockPlugin : "paragraph"
    };

    // Static nodes
    cEditor.nodes = {
        textarea : null,
        wrapper  : null,
        toolbar  : null,
        toolbox            : null,
        notifications      : null,
        plusButton         : null,
        removeBlockButton  : null,
        showSettingsButton : null,
        blockSettings      : null,
        toolbarButtons     : {}, // { type : DomEl, ... }
        redactor           : null
    };

    // Current editor state
    cEditor.state = {
        jsonOutput  : [],
        blocks      : [],
        inputs      : []
    };

    /**
    * Initialization
    * @uses Promise cEditor.core.prepare
    * @param {} userSettings are :
    *          - tools [],
    *          - textareaId String
    *          ...
    */
    cEditor.start = function (userSettings) {

        // Prepare editor settings
        this.core.prepare(userSettings)

            // If all ok, make UI, bind events and parse initial-content
            .then(this.ui.make)
            .then(this.ui.addTools)
            .then(this.ui.bindEvents)
            .then(this.transport.prepare)
            // .then(this.parser.parseTextareaContent)
            .then(this.renderer.makeBlocksFromData)
            .then(this.ui.saveInputs)
            .catch(function (error) {
                cEditor.core.log('Initialization failed with error: %o', 'warn', error);
            });

    };

    return cEditor;

})({});


/**
* Redactor core methods
* Methods:
*   - init
*   - log
*   - insertAfter
*   - isDomNode
*/
cEditor.core = {

    /**
    * Editor preparing method
    * @return Promise
    */
    prepare : function (userSettings) {

        return new Promise(function(resolve, reject){

            if ( userSettings ) {

                cEditor.settings.tools = userSettings.tools || cEditor.settings.tools;

            }

            if (userSettings.data) {
                cEditor.state.blocks = userSettings.data;
            }

            cEditor.nodes.textarea = document.getElementById(userSettings.textareaId || cEditor.settings.textareaId);

            if (typeof cEditor.nodes.textarea === undefined || cEditor.nodes.textarea === null) {
                reject(Error("Textarea wasn't found by ID: #" + userSettings.textareaId));
            } else {
                resolve();
            }

        });

    },

    /**
    * Logging method
    * @param type = ['log', 'info', 'warn']
    */
    log : function (msg, type, arg) {

        type = type || 'log';

        if (!arg) {
            arg  = msg || 'undefined';
            msg  = '[codex-editor]:      %o';
        } else {
            msg  = '[codex-editor]:      ' + msg;
        }

        try{
            if ( 'console' in window && console[ type ] ){
                if ( arg ) console[ type ]( msg , arg );
                else console[ type ]( msg );
            }

        }catch(e){}

    },

    /**
    * @protected
    * Helper for insert one element after another
    */
    insertAfter : function (target, element) {
        target.parentNode.insertBefore(element, target.nextSibling);
    },

    /**
    * @const
    * Readable DOM-node types map
    */
    nodeTypes : {
        TAG     : 1,
        TEXT    : 3,
        COMMENT : 8
    },

    /**
    * @const
    * Readable keys map
    */
    keys : { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39, DELETE: 46, META: 91 },

    /**
    * @protected
    * Check object for DOM node
    */
    isDomNode : function (el) {
        return el && typeof el === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;
    }

};


/**
* Methods for parsing JSON reactor data to HTML blocks
*/
cEditor.renderer = {

    /**
    * Asyncronously parses input JSON to redactor blocks
    */
    makeBlocksFromData : function () {

        /**
        * If redactor is empty, add first paragraph to start writing
        */
        if (!cEditor.state.blocks.length) {

            cEditor.ui.addInitialBlock();
            return;

        }

        Promise.resolve()

                        /** First, get JSON from state */
                        .then(function() {
                            return cEditor.state.blocks;
                        })

                        /** Then, start to iterate they */
                        .then(cEditor.renderer.appendBlocks)

                        /** Write log if something goes wrong */
                        .catch(function(error) {
                            cEditor.core.log('Error while parsing JSON: %o', 'error', error);
                        });

    },

    /**
    * Parses JSON to blocks
    * @param {object} data
    * @return Primise -> nodeList
    */
    appendBlocks : function (data) {

        var blocks = data.items;

        /**
        * Sequence of one-by-one blocks appending
        * Uses to save blocks order after async-handler
        */
        var nodeSequence = Promise.resolve();

        for (var index = 0; index < blocks.length ; index++ ) {

            /** Add node to sequence at specified index */
            cEditor.renderer.appendNodeAtIndex(nodeSequence, blocks, index);

        }

    },

    /**
    * Append node at specified index
    */
    appendNodeAtIndex : function (nodeSequence, blocks, index) {

        /** We need to append node to sequence */
        nodeSequence

            /** first, get node async-aware */
            .then(function() {

                return cEditor.renderer.getNodeAsync(blocks , index);

            })

            /**
            * second, compose editor-block from JSON object
            */
            .then(cEditor.renderer.createBlockFromData)

            /**
            * now insert block to redactor
            */
            .then(function(blockData){

                /**
                * blockData has 'block', 'type' and 'stretched' information
                */
                cEditor.content.insertBlock(blockData);

                /** Pass created block to next step */
                return blockData.block;

            })

            /** Log if something wrong with node */
            .catch(function(error) {
                cEditor.core.log('Node skipped while parsing because %o', 'error', error);
            });

    },


    /**
    * Asynchronously returns block data from blocksList by index
    * @return Promise to node
    */
    getNodeAsync : function (blocksList, index) {

        return Promise.resolve().then(function() {

            return blocksList[index];

        });
    },

    /**
    * Creates editor block by JSON-data
    *
    * @uses render method of each plugin
    *
    * @param {object} blockData looks like
    *                            { header : {
    *                                            text: '',
    *                                            type: 'H3', ...
    *                                        }
    *                            }
    * @return {object} with type and Element
    */
    createBlockFromData : function (blockData) {

        /** New parser */
        var pluginName = blockData.type;

        /** Get first key of object that stores plugin name */
        // for (var pluginName in blockData) break;

        /** Check for plugin existance */
        if (!cEditor.tools[pluginName]) {
            throw Error(`Plugin «${pluginName}» not found`);
        }

        /** Check for plugin having render method */
        if (typeof cEditor.tools[pluginName].render != 'function') {

            throw Error(`Plugin «${pluginName}» must have «render» method`);
        }

        /** New Parser */
        var block = cEditor.tools[pluginName].render(blockData.data);

        /** Fire the render method with data */
        // var block = cEditor.tools[pluginName].render(blockData[pluginName]);

        /** is first-level block stretched */
        var stretched = cEditor.tools[pluginName].isStretched || false;

        /** Retrun type and block */
        return {
            type      : pluginName,
            block     : block,
            stretched : stretched
        };

    },

};

/**
* Methods for saving HTML blocks to JSON object
*/
cEditor.saver = {

    /**
    * Saves blocks
    */
    saveBlocks : function () {

        /** Save html content of redactor to memory */
        // cEditor.state.html = cEditor.nodes.redactor.innerHTML;

        Promise.resolve()

                    .then(function() {
                        return cEditor.nodes.redactor.childNodes;
                    })
                    /** Making a sequence from separate blocks */
                    .then(cEditor.saver.makeQueue)

                    .catch( function(error) {
                        console.log('Something happend');
                    });

    },

    makeQueue : function(blocks) {

        var queue = Promise.resolve();

        for(var index = 0; index < blocks.length; index++) {

            /** Add node to sequence at specified index */
            cEditor.saver.getBlockData(queue, blocks, index);

        }

    },
    /** Gets every block and makes From Data */
    getBlockData : function(queue, blocks, index) {

        queue.then(function() {
            return cEditor.saver.getNodeAsync(blocks, index);
        })

        .then(cEditor.saver.makeFormDataFromBlocks);

    },


    /**
    * Asynchronously returns block data from blocksList by index
    * @return Promise to node
    */
    getNodeAsync : function (blocksList, index) {

        return Promise.resolve().then(function() {

            return blocksList[index];

        });
    },

    makeFormDataFromBlocks : function(block) {

        var pluginName = block.dataset.type;

        /** Check for plugin existance */
        if (!cEditor.tools[pluginName]) {
            throw Error(`Plugin «${pluginName}» not found`);
        }

        /** Check for plugin having render method */
        if (typeof cEditor.tools[pluginName].save != 'function') {

            throw Error(`Plugin «${pluginName}» must have save method`);
        }

        /** Result saver */
        var blockContent = block.childNodes,
            savedData    = cEditor.tools[pluginName].save(blockContent);

        cEditor.state.jsonOutput.push(savedData);
    }

};

/**
* Methods:
*   - make
*   - addTools
*   - bindEvents
*   - addBlockHandlers
*   - saveInputs
*/

cEditor.ui = {

    /**
    * @const {String} BLOCK_STRETCHED - makes block stretched
    */
    BLOCK_STRETCHED : 'ce_block--stretched',

    /**
    * @const {string} BLOCK_CLASSNAME - redactor blocks name
    */
    BLOCK_CLASSNAME : 'ce_block',

    /**
    * @private
    * Making main interface
    */
    make : function () {

        var wrapper,
            toolbar,
            redactor,
            notifications,
            blockButtons,
            blockSettings,
            showPlusButton,
            showSettingsButton,
            showRemoveBlockButton,
            toolbox;

        /** Make editor wrapper */
        wrapper = cEditor.draw.wrapper();

        /** Append editor wrapper after initial textarea */
        cEditor.core.insertAfter(cEditor.nodes.textarea, wrapper);

        /** Append block with notifications to the document */
        notifications = cEditor.draw.alertsHolder();
        cEditor.nodes.notifications = document.body.appendChild(notifications);

        /** Make toolbar and content-editable redactor */
        toolbar                 = cEditor.draw.toolbar();
        plusButton              = cEditor.draw.plusButton();
        showRemoveBlockButton   = cEditor.draw.removeBlockButton();
        showSettingsButton      = cEditor.draw.settingsButton();
        blockSettings           = cEditor.draw.blockSettings();
        blockButtons            = cEditor.draw.blockButtons();
        toolbox                 = cEditor.draw.toolbox();
        redactor                = cEditor.draw.redactor();

        /** Make blocks buttons
        * This block contains settings button and remove block button
        */
        blockButtons.appendChild(showSettingsButton);
        blockButtons.appendChild(blockSettings);
        blockButtons.appendChild(showRemoveBlockButton);

        /** Appending first-level block buttons */
        toolbar.appendChild(blockButtons);

        /** Append plus button */
        toolbar.appendChild(plusButton);

        /** Appending toolbar tools */
        toolbar.appendChild(toolbox);

        wrapper.appendChild(toolbar);
        wrapper.appendChild(redactor);

        /** Save created ui-elements to static nodes state */
        cEditor.nodes.wrapper  = wrapper;
        cEditor.nodes.toolbar  = toolbar;
        cEditor.nodes.plusButton          = plusButton;
        cEditor.nodes.toolbox             = toolbox;
        cEditor.nodes.removeBlockButton   = showRemoveBlockButton;
        cEditor.nodes.blockSettings       = blockSettings;
        cEditor.nodes.showSettingsButton  = showSettingsButton;

        cEditor.nodes.redactor = redactor;

    },

    /**
    * @private
    * Append tools passed in cEditor.tools
    */
    addTools : function () {

        var tool,
            tool_button;

        /** Make toolbar buttons */
        for (var name in cEditor.tools){

            tool = cEditor.tools[name];

            if (!tool.iconClassname) {
                cEditor.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', name);
                continue;
            }

            if (typeof tool.make != 'function') {
                cEditor.core.log('make method missed. Tool %o skipped', 'warn', name);
                continue;
            }

            tool_button = cEditor.draw.toolbarButton(name, tool.iconClassname);

            cEditor.nodes.toolbox.appendChild(tool_button);

            /** Save tools to static nodes */
            cEditor.nodes.toolbarButtons[name] = tool_button;

        }

    },

    /**
    * @private
    * Bind editor UI events
    */
    bindEvents : function () {

        cEditor.core.log('ui.bindEvents fired', 'info');

        window.addEventListener('error', function (errorMsg, url, lineNumber) {
            cEditor.notifications.errorThrown(errorMsg, event);
        }, false );

        /** All keydowns on Document */
        document.addEventListener('keydown', function (event) {
            cEditor.callback.globalKeydown(event);
        }, false );

        /** All keydowns on Document */
        document.addEventListener('keyup', function (event) {
            cEditor.callback.globalKeyup(event);
        }, false );

        /** Mouse click to radactor */
        cEditor.nodes.redactor.addEventListener('click', function (event) {

            cEditor.callback.redactorClicked(event);

        }, false );

        /**
        * Mouse over to plus to plus
        * @deprecated
        */
        cEditor.nodes.plusButton.addEventListener('mouseover', function(event) {

            cEditor.callback.plusButtonActive();

        }, false );

        /**
        * @deprecated
        * @todo Comment
        */
        cEditor.nodes.plusButton.addEventListener('click', function(event) {

            cEditor.callback.plusButtonDeactived();

        }, false);

        /** Clicks to SETTINGS button in toolbar */
        cEditor.nodes.showSettingsButton.addEventListener('click', function (event) {

            cEditor.callback.showSettingsButtonClicked(event);

        }, false );

        /** All Clicks to Remove tool in toolbar */
        cEditor.nodes.removeBlockButton.addEventListener('click', cEditor.callback.removeBlock, false);

        /**
         *  @deprecated;
         *  Any redactor changes: keyboard input, mouse cut/paste, drag-n-drop text
        */
        cEditor.nodes.redactor.addEventListener('input', function (event) {

            cEditor.callback.redactorInputEvent(event);

        }, false );

        /** Bind click listeners on toolbar buttons */
        for (var button in cEditor.nodes.toolbarButtons){
            cEditor.nodes.toolbarButtons[button].addEventListener('click', function (event) {
                cEditor.callback.toolbarButtonClicked(event, this);
            }, false);
        }

    },

    addBlockHandlers : function(block) {

        if (!block) return;

        block.addEventListener('keydown', function(event) {

            cEditor.callback.blockKeydown(event, block);

        }, false);

        block.addEventListener('paste', function (event) {
            cEditor.callback.blockPaste(event, block);
        }, false);

    },

    /** getting all contenteditable elements */
    saveInputs : function() {

        var redactor = cEditor.nodes.redactor,
            elements = [];

        setTimeout(function () {

            /** Save all inputs in global variable state */
            cEditor.state.inputs = redactor.querySelectorAll('[contenteditable], input');

        }, 10);

    },

    /**
    * Adds first initial block on empty redactor
    */
    addInitialBlock : function(){

        var initialBlockType = cEditor.settings.initialBlockPlugin,
            initialBlock;

        if ( !cEditor.tools[initialBlockType] ){
            cEditor.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
            return;
        }

        initialBlock = cEditor.tools[initialBlockType].render();

        initialBlock.setAttribute('data-placeholder', 'Write your story...');

        cEditor.content.insertBlock({
            type  : initialBlockType,
            block : initialBlock
        });

        cEditor.content.workingNodeChanged(initialBlock);

    }

};

cEditor.callback = {


    redactorSyncTimeout : null,

    globalKeydown : function(event){

        switch (event.keyCode){
            case cEditor.core.keys.TAB   : this.tabKeyPressed(event);       break;
            case cEditor.core.keys.ENTER : this.enterKeyPressed(event);     break;
            case cEditor.core.keys.ESC   : this.escapeKeyPressed(event);    break;
        }

    },

    globalKeyup : function(event){

        switch (event.keyCode){
            case cEditor.core.keys.UP    :
            case cEditor.core.keys.LEFT  :
            case cEditor.core.keys.RIGHT :
            case cEditor.core.keys.DOWN  : this.arrowKeyPressed(event); break;
        }

    },


    tabKeyPressed : function(event){

        if ( !cEditor.toolbar.opened ) {
            cEditor.toolbar.open();
        }

        if (cEditor.toolbar.opened && !cEditor.toolbar.toolbox.opened) {
            cEditor.toolbar.toolbox.open();
        } else {
            cEditor.toolbar.leaf();
        }

        event.preventDefault();
    },

    /**
    * ENTER key handler
    * Makes new paragraph block
    */
    enterKeyPressed : function(event){

        cEditor.content.workingNodeChanged();

        var currentInputIndex       = cEditor.caret.inputIndex,
            workingNode             = cEditor.content.currentNode,
            isEnterPressedOnToolbar = cEditor.toolbar.opened &&
                                      cEditor.toolbar.current &&
                                      event.target == cEditor.state.inputs[currentInputIndex];

        /** The list of tools which needs the default browser behaviour */
        var DISABLE_PREVENTDEFAULT = ['list'];

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
        if ( event.shiftKey || DISABLE_PREVENTDEFAULT.indexOf(workingNode.dataset.type) != -1){
            return;
        }


        event.preventDefault();

        /**
        * Make new paragraph
        */
        cEditor.content.insertBlock({
            type  : NEW_BLOCK_TYPE,
            block : cEditor.tools[NEW_BLOCK_TYPE].render()
        });

        /** get all inputs after new appending block */
        cEditor.ui.saveInputs();


        setTimeout(function () {

            /** Setting to the new input */
            cEditor.caret.setToNextBlock(currentInputIndex);

            cEditor.toolbar.move();

            cEditor.toolbar.open();

        }, 50);

    },

    escapeKeyPressed : function(event){

        /** Close all toolbar */
        cEditor.toolbar.close();

        /** Close toolbox */
        cEditor.toolbar.toolbox.close();

        event.preventDefault();

    },

    arrowKeyPressed : function(event){

        cEditor.content.workingNodeChanged();

        /* Closing toolbar */
        cEditor.toolbar.close();
        cEditor.toolbar.move();

    },

    redactorClicked : function (event) {

        cEditor.content.workingNodeChanged(event.target);

        if (event.target.contentEditable == 'true') {
            cEditor.caret.updateCurrentInputIndex();
        }

        if (cEditor.content.currentNode === null) {

            /** Set caret to the last input */
            var indexOfLastInput = cEditor.state.inputs.length;
            cEditor.caret.setToPreviousBlock(indexOfLastInput);

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

    },

    /**
    * Toolbar button click handler
    * @param this - cursor to the button
    */
    toolbarButtonClicked : function (event, button) {

        cEditor.toolbar.current = button.dataset.type;

        cEditor.toolbar.toolClicked(event);
        cEditor.toolbar.close();

    },

    redactorInputEvent : function (event) {

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

    },

    /** Show toolbox when plus button is clicked */
    plusButtonActive : function() {

        if (!cEditor.nodes.toolbox.classList.contains('opened')) {

            cEditor.toolbar.toolbox.open();

        }
    },

    /** Hide toolbox */
    plusButtonDeactived : function() {

        if (cEditor.nodes.toolbox.classList.contains('opened')) {

            cEditor.toolbar.toolbox.close();

        }
    },

    /**
    * Sets block to removed state or if block's state is removed function deletes it from stream (DOM tree)
    */
    removeBlock : function(event) {

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

    },

    /**
    * Block handlers for KeyDown events
    */
    blockKeydown : function(event, block) {

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
    },

    /**
    * RIGHT or DOWN keydowns on block
    */
    blockRightOrDownArrowPressed : function (block) {

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

    },

    /**
    * LEFT or UP keydowns on block
    */
    blockLeftOrUpArrowPressed : function (block) {

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

    },

    enterPressedOnBlock: function (block, event) {

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
            newBlock.classList.add(cEditor.ui.BLOCK_CLASSNAME);

            /** Add event listeners (Keydown) for new created block */
            cEditor.ui.addBlockHandlers(newBlock);

            cEditor.core.insertAfter(block, newBlock);

            /** set focus to the current (created) block */
            cEditor.caret.setToNextBlock(block);

            cEditor.toolbar.move();
        }
    },

    backspacePressed: function (block) {

        if (block.textContent.trim()) {
            return;
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

            cEditor.caret.setToPreviousBlock(cEditor.caret.inputIndex);

        }

        cEditor.toolbar.move();

        if (!cEditor.toolbar.opened) {
            cEditor.toolbar.open();
        }

        /** Updating inputs state */
        cEditor.ui.saveInputs();


        event.preventDefault();

    },

    blockPaste: function(event, block) {

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
    },

    /**
    * Clicks on block settings button
    */
    showSettingsButtonClicked : function(){

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

    }

};

cEditor.content = {

    currentNode : null,

    /**
    * Synchronizes redactor with original textarea
    */
    sync : function () {

        cEditor.core.log('syncing...');

        /**
        * Save redactor content to cEditor.state
        */
        cEditor.state.html = cEditor.nodes.redactor.innerHTML;

        /**
        * Put it to the textarea
        */
        cEditor.nodes.textarea.value = cEditor.state.html;

    },

    /**
    * @deprecated
    */
    getNodeFocused : function() {

        var selection = window.getSelection(),
            focused;

        if (selection.anchorNode === null) {
            return null;
        }

        if ( selection.anchorNode.nodeType == cEditor.core.nodeTypes.TAG ) {
            focused = selection.anchorNode;
        } else {
            focused = selection.focusNode.parentElement;
        }

        if ( !cEditor.parser.isFirstLevelBlock(focused) ) {

            /** Iterate with parent nodes to find first-level*/
            var parent = focused.parentNode;

            while (parent && !cEditor.parser.isFirstLevelBlock(parent)){
                parent = parent.parentNode;
            }

            focused = parent;
        }

        if (focused != cEditor.nodes.redactor){
            return focused;
        }

        return null;

    },

    /**
    * Finds first-level block
    * @param {Element} node - selected or clicked in redactors area node
    */
    getFirstLevelBlock : function(node) {

        if (node === cEditor.nodes.redactor) {

            return null;

        } else {

            while(!node.classList.contains(cEditor.ui.BLOCK_CLASSNAME)) {
                node = node.parentNode;
            }

            return node;
        }


    },

    /**
    * Trigger this event when working node changed
    * @param {Element} targetNode - first-level of this node will be current
    * If targetNode is first-level then we set it as current else we look for parents to find first-level
    */
    workingNodeChanged : function (targetNode) {

        if (!targetNode) {
            return;
        }

        this.currentNode = this.getFirstLevelBlock(targetNode);

    },

    /**
    * Replaces one redactor block with another
    * @protected
    * @param {Element} targetBlock - block to replace. Mostly currentNode.
    * @param {Element} newBlock
    * @param {string} newBlockType - type of new block; we need to store it to data-attribute
    *
    * [!] Function does not saves old block content.
    *     You can get it manually and pass with newBlock.innerHTML
    */
    replaceBlock : function function_name(targetBlock, newBlock, newBlockType) {

        if (!targetBlock || !newBlock || !newBlockType){
            cEditor.core.log('replaceBlock: missed params');
            return;
        }

        /** Store block type */
        newBlock.dataset.type = newBlockType;

        /** If target-block is not a frist-level block, then we iterate parents to find it */
        while(!targetBlock.classList.contains(cEditor.ui.BLOCK_CLASSNAME)) {
            targetBlock = targetBlock.parentNode;
        }

        /** Replacing */
        cEditor.nodes.redactor.replaceChild(newBlock, targetBlock);

        /**
        * Set new node as current
        */
        cEditor.content.workingNodeChanged(newBlock);

        /**
        * Add block handlers
        */
        cEditor.ui.addBlockHandlers(newBlock);

        /**
        * Save changes
        */
        cEditor.ui.saveInputs();

    },

    /**
    * Inserts new block to redactor
    * Wrapps block into a DIV with BLOCK_CLASSNAME class
    * @private
    */
    insertBlock : function(blockData) {

        var workingBlock    = cEditor.content.currentNode,
            newBlockContent = blockData.block,
            blockType       = blockData.type,
            isStretched     = blockData.stretched;

        var newBlock = cEditor.content.composeNewBlock(newBlockContent, blockType, isStretched);

        if (workingBlock) {

            cEditor.core.insertAfter(workingBlock, newBlock);

        } else {

            /**
            * If redactor is empty, append as first child
            */
            cEditor.nodes.redactor.appendChild(newBlock);

        }
        /**
        * Save changes
        */
        cEditor.ui.saveInputs();

        /**
        * Block handler
        */
        cEditor.ui.addBlockHandlers(newBlock);

        /**
        * Set new node as current
        */
        cEditor.content.workingNodeChanged(newBlock);

    },

    /**
    * Replaces blocks with saving content
    * @protected
    * @param {Element} noteToReplace
    * @param {Element} newNode
    * @param {Element} blockType
    */
    switchBlock : function(blockToReplace, newBlock, blockType){

        var newBlockComposed = cEditor.content.composeNewBlock(newBlock, blockType);

        /** Replacing */
        cEditor.content.replaceBlock(blockToReplace, newBlockComposed, blockType);

        /** Save new Inputs when block is changed */
        cEditor.ui.saveInputs();

    },


    /**
    * Iterates between child noted and looking for #text node on deepest level
    * @private
    * @param {Element} block - node where find
    * @param {int} postiton - starting postion
    *      Example: childNodex.length to find from the end
    *               or 0 to find from the start
    * @return {Text} block
    * @uses DFS
    */
    getDeepestTextNodeFromPosition : function (block, position) {

        /**
        * Clear Block from empty and useless spaces with trim.
        * Such nodes we should remove
        */
        var index,
            blockChilds = block.childNodes;

        for(index = 0; index < blockChilds.length; index++)
        {
            var node = blockChilds[index];

            if (node.nodeType == cEditor.core.nodeTypes.TEXT) {

                text = node.textContent.trim();

                /** Text is empty. We should remove this child from node before we start DFS
                * decrease the quantity of childs.
                */
                if (text === '') {

                    block.removeChild(node);
                    position--;
                }
            }
        }

        if (block.childNodes.length === 0) {
            return document.createTextNode('');
        }

        /** Setting default position when we deleted all empty nodes */
        if ( position < 0 )
            position = 1;

        var looking_from_start = false;

        /** For looking from START */
        if (position === 0) {
            looking_from_start = true;
            position = 1;
        }

        while ( position ) {

            /** initial verticle of node. */
            if ( looking_from_start ) {
                block = block.childNodes[0];
            } else {
                block = block.childNodes[position - 1];
            }

            if ( block.nodeType == cEditor.core.nodeTypes.TAG ){

                position = block.childNodes.length;

            } else if (block.nodeType == cEditor.core.nodeTypes.TEXT ){

                position = 0;
            }

        }

        return block;
    },

    /**
    * @private
    */
    composeNewBlock : function (block, blockType, isStretched) {

        newBlock = cEditor.draw.block('DIV');

        newBlock.classList.add(cEditor.ui.BLOCK_CLASSNAME);

        if (isStretched) {
            newBlock.classList.add(cEditor.ui.BLOCK_STRETCHED);
        }
        newBlock.dataset.type = blockType;

        newBlock.appendChild(block);

        return newBlock;

    }

};

cEditor.caret = {

    /**
    * @var {int} InputIndex - editable element in DOM
    */
    inputIndex : null,

    /**
    * @var {int} offset - caret position in a text node.
    */

    offset : null,

    /**
    * @var {int} focusedNodeIndex - we get index of child node from first-level block
    */

    focusedNodeIndex: null,

    /**
    * Creates Document Range and sets caret to the element.
    * @protected
    * @uses caret.save — if you need to save caret position
    * @param {Element} el - Changed Node.
    */
    set : function( el , index, offset) {

        offset = offset || this.offset || 0;
        index  = index  || this.focusedNodeIndex || 0;

        var childs = el.childNodes,
            nodeToSet;

        if ( childs.length === 0 ) {

            nodeToSet = el;

        } else {

            nodeToSet = childs[index];

        }

        /** If Element is INPUT */
        if (el.tagName == 'INPUT') {
            el.focus();
            return;
        }

        if (cEditor.core.isDomNode(nodeToSet)) {

            nodeToSet = cEditor.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);
        }

        var range     = document.createRange(),
            selection = window.getSelection();

        setTimeout(function() {

            range.setStart(nodeToSet, offset);
            range.setEnd(nodeToSet, offset);

            selection.removeAllRanges();
            selection.addRange(range);

        }, 20);
    },

    /**
    * @protected
    * updates index of input and saves it in caret object
    */
    updateCurrentInputIndex : function () {

        /** Index of Input that we paste sanitized content */
        var selection   = window.getSelection(),
            inputs      = cEditor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        if (!cEditor.core.isDomNode(focusedNode)) {
            return;
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

        this.inputIndex = editableElementIndex;
    },

    /**
    * Returns current input index (caret object)
    *
    */
    getCurrentInputIndex : function() {
        return this.inputIndex;
    },

    /**
    * @param {int} index - index of first-level block after that we set caret into next input
    */
    setToNextBlock : function(index) {

        var inputs = cEditor.state.inputs,
            nextInput = inputs[index + 1];

        /**
        * When new Block created or deleted content of input
        * We should add some text node to set caret
        */
        if (!nextInput.childNodes.length) {
            var emptyTextElement = document.createTextNode('');
            nextInput.appendChild(emptyTextElement);
        }

        cEditor.caret.inputIndex = index + 1;
        cEditor.caret.set(nextInput, 0, 0);
        cEditor.content.workingNodeChanged(nextInput);

    },

    setToPreviousBlock : function(index) {

        index = index || 0;

        var inputs = cEditor.state.inputs,
            previousInput = inputs[index - 1];

        var lastChildNode = cEditor.content.getDeepestTextNodeFromPosition(previousInput, previousInput.childNodes.length),
            lengthOfLastChildNode = lastChildNode.length;

        /**
        * When new Block created or deleted content of input
        * We should add some text node to set caret
        */
        if (!previousInput.childNodes.length) {
            var emptyTextElement = document.createTextNode('');
            previousInput.appendChild(emptyTextElement);
        }
        cEditor.caret.inputIndex = index - 1;
        cEditor.caret.set(previousInput, previousInput.childNodes.length - 1, lengthOfLastChildNode);
        cEditor.content.workingNodeChanged(inputs[index - 1]);
    },
};

cEditor.toolbar = {

    /**
    * Margin between focused node and toolbar
    */
    defaultToolbarHeight : 49,

    defaultOffset : 12.5,

    opened : false,

    current : null,

    /**
    * @protected
    */
    open : function (){

        var current             = cEditor.content.currentNode,
            removeBlockButton   = cEditor.nodes.removeBlockButton;

        /** Set trash state before we open the block */
        if (current.classList.contains('removing-request')) {
            removeBlockButton.classList.add('trash-active');
        } else {
            removeBlockButton.classList.remove('trash-active');
        }

        if (this.opened) {
            return;
        }

        cEditor.nodes.toolbar.classList.add('opened');
        this.opened = true;

    },

    /**
    * @protected
    */
    close : function(){

        cEditor.nodes.toolbar.classList.remove('opened');

        this.opened  = false;
        this.current = null;
        for (var button in cEditor.nodes.toolbarButtons){
            cEditor.nodes.toolbarButtons[button].classList.remove('selected');
        }

        /** Close toolbox when toolbar is not displayed */
        cEditor.toolbar.toolbox.close();

    },

    toggle : function(){

        if ( !this.opened ){

            this.open();

        } else {

            this.close();

        }

    },

    /**
    * Panel which wrappes all User defined plugins (tools)
    */
    toolbox : {

        opened : false,

        /** Shows toolbox */
        open : function() {

            /** Close setting if toolbox is opened */
            if (cEditor.toolbar.settings.opened) {
                cEditor.toolbar.settings.close();
            }

            /** display toolbox */
            cEditor.nodes.toolbox.classList.add('opened');

            /** Animate plus button */
            cEditor.nodes.plusButton.classList.add('ce_redactor_plusButton--clicked');

            /** toolbox state */
            cEditor.toolbar.toolbox.opened = true;

        },

        /** Closes toolbox */
        close : function() {

            /** Makes toolbox disapear */
            cEditor.nodes.toolbox.classList.remove('opened');

            /** Rotate plus button */
            cEditor.nodes.plusButton.classList.remove('ce_redactor_plusButton--clicked');

            /** toolbox state */
            cEditor.toolbar.toolbox.opened = false;

        },

    },

    leaf : function(){

        var currentTool = this.current,
            tools       = Object.keys(cEditor.tools),
            barButtons  = cEditor.nodes.toolbarButtons,
            nextToolIndex,
            toolToSelect;

        if ( !currentTool ) {

            /** Get first tool from object*/
            for (toolToSelect in barButtons) break;

        } else {

            nextToolIndex = tools.indexOf(currentTool) + 1;

            if ( nextToolIndex == tools.length) nextToolIndex = 0;

            toolToSelect = tools[nextToolIndex];

        }

        for (var button in barButtons) barButtons[button].classList.remove('selected');

        barButtons[toolToSelect].classList.add('selected');

        this.current = toolToSelect;

    },

    /**
    * Transforming selected node type into selected toolbar element type
    * @param {event} event
    */
    toolClicked : function() {

        /**
        * UNREPLACEBLE_TOOLS this types of tools are forbidden to replace even they are empty
        */
        var UNREPLACEBLE_TOOLS = ['image', 'link', 'list'],
            tool             = cEditor.tools[cEditor.toolbar.current],
            workingNode      = cEditor.content.currentNode,
            appendCallback,
            currentInputIndex = cEditor.caret.inputIndex,
            newBlockContent,
            blockData;

        /** Make block from plugin */
        newBlockContent = tool.make();

        /** information about block */
        blockData = {
            block     : newBlockContent,
            type      : tool.type,
            stretched : false
        };

        /**
        * if block is empty, then we can replace current block with tool plugins block
        */
        if (workingNode && UNREPLACEBLE_TOOLS.indexOf(workingNode.dataset.type) === -1 && workingNode.textContent.trim() === '') {

            /** Replace current block */
            cEditor.content.switchBlock(workingNode, newBlockContent, tool.type);

            setTimeout(function () {

                cEditor.caret.setToPreviousBlock(currentInputIndex + 1);

            }, 10);

        } else {

            /** Insert new Block from plugin */
            cEditor.content.insertBlock(blockData);

            /** Set caret to the next inserted block */
            setTimeout(function () {

                cEditor.caret.setToNextBlock(currentInputIndex);

            }, 10);

        }

        /** Fire tool append callback  */
        appendCallback = cEditor.tools[cEditor.toolbar.current].appendCallback;

        if (appendCallback && typeof appendCallback == 'function') {
            appendCallback.call();
        }

        /**
        * Changing current Node
        */
        cEditor.content.workingNodeChanged();

        /**
        * Move toolbar when node is changed
        */
        cEditor.toolbar.move();

    },


    /**
    * Moving toolbar to the specified node
    */
    move : function() {

        /** Close Toolbox when we move toolbar */
        cEditor.toolbar.toolbox.close();

        if (!cEditor.content.currentNode) {
            return;
        }

        var toolbarHeight = cEditor.nodes.toolbar.clientHeight || cEditor.toolbar.defaultToolbarHeight,
            newYCoordinate = cEditor.content.currentNode.offsetTop - (cEditor.toolbar.defaultToolbarHeight / 2) + cEditor.toolbar.defaultOffset;

        cEditor.nodes.toolbar.style.transform = "translateY(" + newYCoordinate + "px)";

    },

    /**
    * Block settings methods
    */
    settings : {

        opened : false,

        /**
        * Append and open settings
        */
        open : function(toolType){

            /**
            * Append settings content
            * It's stored in tool.settings
            */
            if (!cEditor.tools[toolType] || !cEditor.core.isDomNode(cEditor.tools[toolType].settings) ) {

                cEditor.core.log('Wrong tool type', 'warn');
                cEditor.nodes.blockSettings.innerHTML = `Плагин «${toolType}» не имеет настроек`;

            } else {

                cEditor.nodes.blockSettings.appendChild(cEditor.tools[toolType].settings);

            }

            cEditor.nodes.blockSettings.classList.add('opened');
            this.opened = true;

        },

        /**
        * Close and clear settings
        */
        close : function(){

            cEditor.nodes.blockSettings.classList.remove('opened');
            cEditor.nodes.blockSettings.innerHTML = '';

            this.opened = false;

        },

        /**
        * @param {string} toolType - plugin type
        */
        toggle : function( toolType ){

            if ( !this.opened ){

                this.open(toolType);

            } else {

                this.close();

            }

        },

    }

};

/**
* File transport module
*/
cEditor.transport = {

    input : null,

    /**
    * @property {Object} arguments - keep plugin settings and defined callbacks
    */
    arguments : null,

    prepare : function(){

        var input = document.createElement('INPUT');

        input.type = 'file';
        input.addEventListener('change', cEditor.transport.fileSelected);

        cEditor.transport.input = input;

    },

    /**
    * Callback for file selection
    */
    fileSelected : function(event){

        var input       = this,
            files       = input.files,
            filesLength = files.length,
            formdData   = new FormData(),
            file,
            i;

        formdData.append('files', files[0], files[0].name);

        cEditor.transport.ajax({
            data : formdData,
            success : cEditor.transport.arguments.success,
            error   : cEditor.transport.arguments.error,
        });

    },

    /**
    * Use plugin callbacks
    * @protected
    */
    selectAndUpload : function (args) {

        this.arguments = args;
        this.input.click();

    },

    /**
    * Ajax requests module
    */
    ajax : function(params){

        var xhr = new XMLHttpRequest(),
            success = typeof params.success == 'function' ? params.success : function(){},
            error   = typeof params.error   == 'function' ? params.error   : function(){};

        xhr.open('POST', cEditor.settings.uploadImagesUrl, true);

        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.responseText);
            } else {
                console.log("request error: %o", xhr);
            }
        };

        xhr.send(params.data);

    }

};


/**
* Content parsing module
*/
cEditor.parser = {

    /**
    * Asynchronously parses textarea input string to HTML editor blocks
    */
    parseTextareaContent : function () {

        var initialContent = cEditor.nodes.textarea.value;

        if ( initialContent.trim().length === 0 ) return true;


        cEditor.parser

            /** Get child nodes async-aware */
            .getNodesFromString(initialContent)

            /** Then append nodes to the redactor */
            .then(cEditor.parser.appendNodesToRedactor)

            /** Write log if something goes wrong */
            .catch(function(error) {
                cEditor.core.log('Error while parsing content: %o', 'warn', error);
            });

    },

    /**
    * Parses string to nodeList
    * @param string inputString
    * @return Primise -> nodeList
    */
    getNodesFromString : function (inputString) {

        return Promise.resolve().then(function() {

                var contentHolder = document.createElement('div');

                contentHolder.innerHTML = inputString;

                /**
                *    Returning childNodes will include:
                *        - Elements (html-tags),
                *        - Texts (empty-spaces or non-wrapped strings )
                *        - Comments and other
                */
                return contentHolder.childNodes;

        });
    },

    /**
    * Appends nodes to the redactor
    * @param nodeList nodes - list for nodes to append
    */
    appendNodesToRedactor : function(nodes) {

        /**
        * Sequence of one-by-one nodes appending
        * Uses to save blocks order after async-handler
        */
        var nodeSequence = Promise.resolve();


        for (var index = 0; index < nodes.length ; index++ ) {

            /** Add node to sequence at specified index */
            cEditor.parser.appendNodeAtIndex(nodeSequence, nodes, index);

        }

    },

    /**
    * Append node at specified index
    */
    appendNodeAtIndex : function (nodeSequence, nodes, index) {

        /** We need to append node to sequence */
        nodeSequence

            /** first, get node async-aware */
            .then(function() {

                return cEditor.parser.getNodeAsync(nodes , index);

            })

            /**
            *    second, compose editor-block from node
            *    and append it to redactor
            */
            .then(function(node){

                var block = cEditor.parser.createBlockByDomNode(node);

                if ( cEditor.core.isDomNode(block) ) {

                    block.contentEditable = "true";

                    /** Mark node as redactor block*/
                    block.classList.add('ce_block');

                    /** Append block to the redactor */
                    cEditor.nodes.redactor.appendChild(block);

                    /** Save block to the cEditor.state array */
                    cEditor.state.blocks.push(block);

                    return block;

                }
                return null;
            })

            .then(cEditor.ui.addBlockHandlers)

            /** Log if something wrong with node */
            .catch(function(error) {
                cEditor.core.log('Node skipped while parsing because %o', 'warn', error);
            });

    },

    /**
    * Asynchronously returns node from nodeList by index
    * @return Promise to node
    */
    getNodeAsync : function (nodeList, index) {

        return Promise.resolve().then(function() {

            return nodeList.item(index);

        });
    },

    /**
    * Creates editor block by DOM node
    *
    * First-level blocks (see cEditor.settings.blockTags) saves as-is,
    * other wrapps with <p>-tag
    *
    * @param DOMnode node
    * @return First-level node (paragraph)
    */
    createBlockByDomNode : function (node) {

        /** First level nodes already appears as blocks */
        if ( cEditor.parser.isFirstLevelBlock(node) ){

            /** Save plugin type in data-type */
            node = this.storeBlockType(node);

            return node;
        }

        /** Other nodes wraps into parent block (paragraph-tag) */
        var parentBlock,
            nodeContent     = node.textContent.trim(),
            isPlainTextNode = node.nodeType != cEditor.core.nodeTypes.TAG;


        /** Skip empty textNodes with space-symbols */
        if (isPlainTextNode && !nodeContent.length) return null;

        /** Make <p> tag */
        parentBlock = cEditor.draw.block('P');

        if (isPlainTextNode){
            parentBlock.textContent = nodeContent.replace(/(\s){2,}/, '$1'); // remove double spaces
        } else {
            parentBlock.appendChild(node);
        }

        /** Save plugin type in data-type */
        parentBlock = this.storeBlockType(parentBlock);

        return parentBlock;

    },

    /**
    * It's a crutch
    * - - - - - - -
    * We need block type stored as data-attr
    * Now supports only simple blocks : P, HEADER, QUOTE, CODE
    * Remove it after updating parser module for the block-oriented structure:
    *       - each block must have stored type
    * @param {Element} node
    */
    storeBlockType : function (node) {

        switch (node.tagName) {
            case 'P' :          node.dataset.type = 'paragraph'; break;
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':          node.dataset.type = 'header'; break;
            case 'BLOCKQUOTE':  node.dataset.type = 'quote'; break;
            case 'CODE':        node.dataset.type = 'code'; break;
        }

        return node;

    },

    /**
    * Check DOM node for display style: separated block or child-view
    */
    isFirstLevelBlock : function (node) {

        return node.nodeType == cEditor.core.nodeTypes.TAG &&
               node.classList.contains(cEditor.ui.BLOCK_CLASSNAME);

    }

};

/**
* Creates HTML elements
*/
cEditor.draw = {

    /**
    * Base editor wrapper
    */
    wrapper : function () {

        var wrapper = document.createElement('div');

        wrapper.className += 'ce_wrapper';

        return wrapper;

    },

    /**
    * Content-editable holder
    */
    redactor : function () {

        var redactor = document.createElement('div');

        redactor.className += 'ce_redactor';

        return redactor;

    },

    /**
    * Empty toolbar with toggler
    */
    toolbar : function () {

        var bar = document.createElement('div');

        bar.className += 'ce_toolbar';

        return bar;
    },

    /**
    * Block with notifications
    */
    alertsHolder : function() {

        var block = document.createElement('div');

        block.classList.add('ce_notifications-block');

        return block;

    },

    /**
    * @todo Desc
    */
    blockButtons : function() {

        var block = document.createElement('div');

        block.className += 'ce_block_blockButtons';

        return block;
    },

    /**
    * Block settings panel
    */
    blockSettings : function () {

        var settings = document.createElement('div');

        settings.className += 'ce_block_settings';

        return settings;
    },

    plusButton : function() {

        var button = document.createElement('span');

        button.className = 'ce_redactor_plusButton';

        button.innerHTML = '<i class="ce-icon-plus"></i>';

        return button;
    },

    removeBlockButton : function() {

        var toggler = document.createElement('span');

        toggler.className = 'trash-toggler';

        toggler.innerHTML = '<i class="remove_btn ce-icon-trash"></i>';

        return toggler;

    },

    /**
    * Settings button in toolbar
    */
    settingsButton : function () {

        var toggler = document.createElement('span');

        toggler.className = 'toggler';

        /** Toggler button*/
        toggler.innerHTML = '<i class="settings_btn ce-icon-cog"></i>';

        return toggler;
    },

    /**
    * Redactor tools wrapper
    */

    toolbox : function() {

        var wrapper = document.createElement('div');

        wrapper.className = 'ce_redactor_tools';

        return wrapper;
    },

    /**
    * Toolbar button
    */
    toolbarButton : function (type, classname) {

        var button     = document.createElement("li"),
            tool_icon  = document.createElement("i"),
            tool_title = document.createElement("span");

        button.dataset.type = type;

        tool_icon.classList.add(classname);

        tool_title.innerHTML = type;
        tool_title.classList.add('ce_toolbar_tools--title');

        button.appendChild(tool_icon);
        button.appendChild(tool_title);

        return button;

    },

    /**
    * Redactor block
    */
    block : function (tagName, content) {

        var node = document.createElement(tagName);

        node.innerHTML = content || '';

        return node;

    }

};

/** Module which extends notifications and make different animations for logs */
cEditor.notifications = {

    /**
    * Error notificator. Shows block with message
    * @protected
    */
    errorThrown : function(errorMsg, event) {

        cEditor.notifications.send('This action is not available currently', event.type, false);

    },

    /**
    * Appends notification with different types
    * @param message {string} - Error or alert message
    * @param type {string} - Type of message notification. Ex: Error, Warning, Danger ...
    * @param append {boolean} - can be True or False when notification should be inserted after
    */
    send : function(message, type, append) {

        var notification = cEditor.draw.block('div');

        notification.textContent = message;
        notification.classList.add('ce_notification-item', 'ce_notification-' + type, 'flipInX');

        if (!append) {
            cEditor.nodes.notifications.innerHTML = '';
        }

        cEditor.nodes.notifications.appendChild(notification);

        setTimeout(function () {
            notification.remove();
        }, 3000);

    },
}


/**
* Developer plugins
*/

cEditor.tools = {

};
