/**
* CodeX Editor
* https://ifmo.su/editor
* @author CodeX team team@ifmo.su
*/

var cEditor = (function (cEditor) {

    // Default settings
    cEditor.settings = {
        tools      : ['header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
        textareaId : 'codex-editor',

        // First-level tags viewing as separated blocks. Other'll be inserted as child
        blockTags  : ['P','BLOCKQUOTE','UL','CODE','OL','H1','H2','H3','H4','H5','H6']
    };

    // Static nodes
    cEditor.nodes = {
        textarea : null,
        wrapper  : null,
        toolbar  : null,
        toolbarButtons : {}, // { type : DomEl, ... }
        redactor : null,
    }

    // Current editor state
    cEditor.state = {
        html   : '',
        blocks : []
    }

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
            .then(this.parser.parseTextareaContent)
            .catch(function (error) {
                cEditor.core.log('Initialization failed with error: %o', 'warn', error);
            })

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

            cEditor.nodes.textarea = document.getElementById(userSettings.textareaId || cEditor.settings.textareaId);

            if (typeof cEditor.nodes.textarea == undefined || cEditor.nodes.textarea == null) {
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
    * Helper for insert one element after another
    */
    insertAfter : function (target, element) {
        target.parentNode.insertBefore(element, target.nextSibling);
    },

    /**
    * Readable DOM-node types map
    */
    nodeTypes : {
        TAG     : 1,
        TEXT    : 3,
        COMMENT : 8
    },

    /**
    * Readable keys map
    */
    keys : { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39, DELETE: 46, META: 91 },

    /**
    * Check object for DOM node
    */
    isDomNode : function (el) {
        return el && typeof el === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;
    }

}

cEditor.ui = {

    /** Blocks name. */
    BLOCK_CLASSNAME : 'ce_block',

    /**
    * Making main interface
    */
    make : function () {

        var wrapper,
            toolbar,
            tool,
            redactor;

        /** Make editor wrapper */
        wrapper = cEditor.draw.wrapper();

        /** Append editor wrapper after initial textarea */
        cEditor.core.insertAfter(cEditor.nodes.textarea, wrapper);


        /** Make toolbar and content-editable redactor */
        toolbar  = cEditor.draw.toolbar();
        redactor = cEditor.draw.redactor();

        wrapper.appendChild(toolbar);
        wrapper.appendChild(redactor);

        /** Save created ui-elements to static nodes state */
        cEditor.nodes.wrapper  = wrapper;
        cEditor.nodes.toolbar  = toolbar;

        cEditor.nodes.redactor = redactor;

    },

    /**
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

            tool_button = cEditor.draw.toolbarButton(name, tool.iconClassname);
            cEditor.nodes.toolbar.appendChild(tool_button);

            /** Save tools to static nodes */
            cEditor.nodes.toolbarButtons[name] = tool_button;

        }

    },

    /**
    * Bind editor UI events
    */
    bindEvents : function () {

        cEditor.core.log('ui.bindEvents fired', 'info');

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

            cEditor.caret.save();

        }, false );

        /**
         *  @deprecated;
         *  Any redactor changes: keyboard input, mouse cut/paste, drag-n-drop text
        */
        cEditor.nodes.redactor.addEventListener('input', function (event) {

            /** Saving caret in every modifications */
            cEditor.caret.save();

            cEditor.callback.redactorInputEvent(event);

        }, false );

        /** Bind click listeners on toolbar buttons */
        for (button in cEditor.nodes.toolbarButtons){
            cEditor.nodes.toolbarButtons[button].addEventListener('click', function (event) {
                cEditor.callback.toolbarButtonClicked(event, this);
            }, false);
        };

    },

    addBlockHandlers : function(block) {

        if (!block) return;

        block.addEventListener('keydown', function(event) {

            cEditor.callback.blockKeydown(event, block);

        }, false);

        block.addEventListener('paste', function (event) {
            cEditor.callback.blockPaste(event, block);
        }, false);

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
        } else {
            cEditor.toolbar.leaf();
        }

        event.preventDefault();

    },

    enterKeyPressed : function(event){

        cEditor.content.workingNodeChanged();

        if ( cEditor.toolbar.opened && event.target == cEditor.content.currentNode) {
            event.preventDefault();

            cEditor.toolbar.toolClicked(event);
            cEditor.toolbar.close();

        };

    },

    escapeKeyPressed : function(event){

        cEditor.toolbar.close();

        event.preventDefault();

    },

    arrowKeyPressed : function(event){

        cEditor.content.workingNodeChanged();

        /* Closing toolbar */
        cEditor.toolbar.close();
        cEditor.toolbar.move();

    },

    redactorClicked : function (event) {

        cEditor.content.workingNodeChanged();

        cEditor.toolbar.move();

        cEditor.toolbar.open();

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
                cEditor.callback.enterPressed(block);
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
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        /** Check for caret existance */
        if (!focusedNode){
            return false;
        }

        /** Saving caret after keydown event happend */
        cEditor.caret.save();

        /** Looking for closest (parent) contentEditable element of focused node */
        while (focusedNode.className != cEditor.ui.BLOCK_CLASSNAME) {

            focusedNodeHolder = focusedNode.parentNode;
            focusedNode       = focusedNodeHolder;
        }

        /** Founded contentEditable element doesn't have childs */
        if (focusedNode.childNodes.length === 0)
        {
            cEditor.caret.setToNextBlock(block);
            return;
        }

        /**
        * Find deepest child node
        * Iterate child nodes and find LAST DEEPEST node
        * We need to check caret positon (it must be at the end)
        * @param focusedNodeIndex is index of childnode by length
        * @param focusedTextNode is Text node founded by DFS algorithm
        */
        var focusedTextNode = '',
            focusedNodeIndex = cEditor.caret.focusedNodeIndex + 1;

        if (focusedNodeHolder.childNodes){
            /** Looking from the END of node */
            focusedTextNode = cEditor.content.getDeepestTextNodeFromPosition(focusedNodeHolder, focusedNodeHolder.childNodes.length);
        }

        /**
        * Stop transition when caret is not at the end of Text node
        * When we click "DOWN" or "RIGHT", caret moves to the end of node.
        * We should check caret position before we transmit/switch the block.
        */
        if ( block.childNodes.length != focusedNodeIndex || focusedTextNode.length != selection.anchorOffset) {
            return false;
        }

        cEditor.caret.setToNextBlock(block);

    },

    /**
    * LEFT or UP keydowns on block
    */
    blockLeftOrUpArrowPressed : function (block) {

        var selection   = window.getSelection(),
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        /** Check for caret existance */
        if (!focusedNode){
            return false;
        }

        /** Saving caret after keydown event happend */
        cEditor.caret.save();

        /** Looking for parent contentEditable block */
        while (focusedNode.className != cEditor.ui.BLOCK_CLASSNAME) {
            focusedNodeHolder = focusedNode.parentNode;
            focusedNode       = focusedNodeHolder;
        }

        /**
        * Find deepest child node
        * Iterate child nodes and find First DEEPEST node
        * We need it to check caret positon (it must be at the begining)
        */
        focusedNodeHolder = focusedNodeHolder || focusedNode;

        if (focusedNodeHolder.childNodes.length !== 0) {

            var focusedTextNode = '';

            if (focusedNodeHolder.childNodes){
                /** Looking from the first child */
                focusedTextNode = cEditor.content.getDeepestTextNodeFromPosition(focusedNodeHolder, 0);
            }
        }
        /**
        * When we click "UP" or "LEFT", caret behaviour is as default.
        * We should check caret position before we transmit/switch the block.
        */
        if ( selection.anchorOffset !== 0) {
            return false;
        }

        /**
        * We can't switch block till caret is not at the begining of first node and has zero offset
        */
        if ( (cEditor.caret.offset !== 0 || cEditor.caret.focusedNodeIndex !== 0) && focusedNodeHolder.childNodes.length !== 0 ) {
            return;
        }

        cEditor.caret.setToPreviousBlock(block);

    },

    enterPressed: function (block) {

        var selection   = window.getSelection(),
            currentNode = selection.anchorNode,
            parentOfFocusedNode = currentNode.parentNode;

        /**
        * We add new block with contentEditable property if enter key is pressed.
        * First we check, if caret is at the end of last node and offset is legth of text node
        * focusedNodeIndex + 1, because that we compare non-arrays index.
        */
        if ( currentNode.length === cEditor.caret.offset
            && parentOfFocusedNode.childNodes.length == cEditor.caret.focusedNodeIndex + 1) {

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

        if (block.textContent.trim()) return;

        cEditor.caret.setToPreviousBlock(block);

        block.remove();

        cEditor.toolbar.move();

        event.preventDefault();

    },

    blockPaste: function(event, block) {

        var clipboardData, pastedData, nodeContent;

        event.preventDefault();

        clipboardData = event.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');

        nodeContent = document.createTextNode(pastedData);
        block.appendChild(nodeContent);

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

    getNodeFocused : function() {

        var selection = window.getSelection(),
            focused;

        if (selection.anchorNode != null) {

            if ( selection.anchorNode.nodeType == cEditor.core.nodeTypes.TAG ) {
                focused = selection.anchorNode;
            } else {
                focused = selection.focusNode.parentElement;
            }
        }

        if ( !cEditor.parser.isFirstLevelBlock(focused) ) {
            focused = focused.parentElement;
        }

        if (focused != cEditor.nodes.redactor){
            return focused;
        }

        return null;

    },

    /**
    * Trigger this event when working node changed
    */
    workingNodeChanged : function (setCurrent) {

        this.currentNode = setCurrent || this.getNodeFocused();

    },

    switchBlock : function (targetBlock, newBlockTagname) {

        if (!targetBlock || !newBlockTagname) return;

        var nodeToReplace;

        /**
        * First-level nodes replaces as-is,
        * otherwise we need to replace parent node
        */
        if (cEditor.parser.isFirstLevelBlock(targetBlock)) {
            nodeToReplace = targetBlock;
        } else {
            nodeToReplace = targetBlock.parentNode;
        }

        /**
        * Make new node with original content
        */
        var nodeCreated = cEditor.draw.block(newBlockTagname, targetBlock.innerHTML);

        /** Mark node as redactor block */
        nodeCreated.contentEditable = "true";
        nodeCreated.classList.add(cEditor.ui.BLOCK_CLASSNAME);

        /**
        * If it is a first-level node, replace as-is.
        */
        if (cEditor.parser.isFirstLevelBlock(nodeCreated)) {

            cEditor.nodes.redactor.replaceChild(nodeCreated, nodeToReplace);

            /**
            * Set new node as current
            */

            cEditor.content.workingNodeChanged(nodeCreated);

            /**
            * Setting caret
            */
            cEditor.caret.set(nodeCreated);

            /** Add event listeners for created node */
            cEditor.ui.addBlockHandlers(nodeCreated);

            return;

        }

        /**
        * If it is not a first-level node, for example LI or IMG
        * we need to wrap it in block-tag (<p> or <ul>)
        */
        var newNodeWrapperTagname,
            newNodeWrapper;

        switch (newBlockTagname){
            case 'LI' : newNodeWrapperTagname = 'UL'; break;
            default   : newNodeWrapperTagname = 'P'; break;
        }

        newNodeWrapper = cEditor.draw.block(newNodeWrapperTagname);
        newNodeWrapper.appendChild(nodeCreated);


        cEditor.nodes.redactor.replaceChild(newNodeWrapper, nodeToReplace);

        /**
        * Set new node as current
        */
        cEditor.content.workingNodeChanged(nodeCreated);

        cEditor.caret.set(nodeCreated);
    },


    /**
    * Iterates between child noted and looking for #text node on deepest level
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
                if (text == '') {

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
    }

}

cEditor.caret = {

    /**
    * @var {int} offset - caret position in a text node.
    */

    offset : null,

    /**
    * @var {int} focusedNodeIndex - we get index of child node from first-level block
    */

    focusedNodeIndex: null,

    /**
    * We need to save caret before we change the block,
    * so that we could return it to original position in a new tag.
    * We save caret offset in a text and index of child node.
    */
    save : function() {

        var selection = window.getSelection();
        var parentElement   = selection.anchorNode,
            previousElement = selection.anchorNode.previousSibling,
            nodeIndex = 0;

        /**
        * We get index of node which is child of #BLOCK_CLASSNAME.
        * if selected node is not below the block container, we get the closest TAG which is below #BLOCK_CLASSNAME
        */
        if ( parentElement.className !== cEditor.ui.BLOCK_CLASSNAME ) {

            while (parentElement.parentNode.className !== cEditor.ui.BLOCK_CLASSNAME) {

                parentElement = parentElement.parentNode;

            }

            previousElement = parentElement.previousSibling;
        }

        /** Counting index of focused node */
        while (previousElement != null) {

            nodeIndex ++;
            previousElement = previousElement.previousSibling;

        }

        this.offset            = selection.anchorOffset;
        this.focusedNodeIndex  = nodeIndex;

    },

    /**
    * Creates Document Range and sets caret to the element.
    * @uses caret.save — if you need to save caret position
    * @param {Element} el - Changed Node.
    * @todo remove saving positon
    * @todo - Check nodeToSet for type: if TAG -> look for nearest TextNode
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

        var range     = document.createRange(),
            selection = window.getSelection();

        setTimeout(function() {

            range.setStart(nodeToSet, offset);
            range.setEnd(nodeToSet, offset);

            selection.removeAllRanges();
            selection.addRange(range);

        }, 50);
    },

    /**
    * @param {Element} - block element where we should find caret position
    */
    get : function (el) {

    },

    /**
    * @param {Element} block - element from which we take next block
    */
    setToNextBlock : function(block) {

        if ( !block.nextSibling ) {
            return false;
        }

        cEditor.caret.offset            = 0;
        cEditor.caret.focusedNodeIndex  = 0;

        cEditor.caret.set(block.nextSibling, 0, 0);
        cEditor.content.workingNodeChanged(block.nextSibling);
    },

    setToPreviousBlock : function(block) {

        if ( !block.previousSibling ) {
            return false;
        }

        var lastChildOfPreiviousBlockIndex = block.previousSibling.childNodes.length,
            previousBlock = block.previousSibling,
            theEndOfPreviousBlockLastNode = 0;

        /** Index in childs Array */
        if (block.previousSibling.childNodes.length !== 0) {

            previousBlock = cEditor.content.getDeepestTextNodeFromPosition(block.previousSibling, lastChildOfPreiviousBlockIndex);
            theEndOfPreviousBlockLastNode = previousBlock.length;
            lastChildOfPreiviousBlockIndex = 0;

        }

        cEditor.caret.offset            = theEndOfPreviousBlockLastNode;
        cEditor.caret.focusedNodeIndex  = lastChildOfPreiviousBlockIndex;

        cEditor.caret.set(previousBlock, lastChildOfPreiviousBlockIndex, theEndOfPreviousBlockLastNode);

        cEditor.content.workingNodeChanged(block.previousSibling);
    },
};

cEditor.toolbar = {

    /**
    * Margin between focused node and toolbar
    */
    defaultToolbarHeight : 43,

    defaultOffset : 10,

    opened : false,

    current : null,

    open : function (){

        if (this.opened) {
            return;
        }

        cEditor.nodes.toolbar.classList.add('opened');
        this.opened = true;

    },

    close : function(){

        cEditor.nodes.toolbar.classList.remove('opened');

        this.opened  = false;
        this.current = null;
        for (var button in cEditor.nodes.toolbarButtons){
            cEditor.nodes.toolbarButtons[button].classList.remove('selected');
        }

    },

    toggle : function(){

        if ( !this.opened ){

            this.open();

        } else {

            this.close();

        }

    },

    leaf : function(){

        var currentTool = this.current,
            tools       = cEditor.settings.tools,
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

        var workingNode = cEditor.content.currentNode,
            newTag,
            appendCallback;

        switch (cEditor.toolbar.current) {
            case 'paragraph' : newTag = 'P'; break;
            case 'header'    : newTag = 'H1'; break;
            case 'quote'     : newTag = 'BLOCKQUOTE'; break;
            case 'code'      : newTag = 'CODE'; break;
            case 'list'      : newTag = 'LI'; break;
        }

        cEditor.content.switchBlock(workingNode, newTag);

        /** Fire tool append callback  */
        appendCallback = cEditor.tools[cEditor.toolbar.current].appendCallback;

        if (appendCallback && typeof appendCallback == 'function') {
            appendCallback.call();
        }


    },


    /**
    * Moving toolbar to the specified node
    */
    move : function() {

        if (!cEditor.content.currentNode) {
            return;
        }

        var toolbarHeight = cEditor.nodes.toolbar.clientHeight || cEditor.toolbar.defaultToolbarHeight,
            newYCoordinate = cEditor.content.currentNode.offsetTop - cEditor.toolbar.defaultOffset - toolbarHeight;

        cEditor.nodes.toolbar.style.transform = "translateY(" + newYCoordinate + "px)";

    },

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

        return parentBlock;

    },

    /**
    * Check DOM node for display style: separated block or child-view
    */
    isFirstLevelBlock : function (node) {

        return node.nodeType == cEditor.core.nodeTypes.TAG &&
               cEditor.settings.blockTags.indexOf(node.tagName) !== -1;

    }

};

cEditor.tools = {

    paragraph : {

        type           : 'paragraph',
        iconClassname  : 'ce_icon-smile',
        append         : document.createElement('P'),
        appendCallback : function () {
                            console.log('paragraph added');
                        },
        settings       : null,

    },

    header : {

        type           : 'header',
        iconClassname  : 'ce_icon-header',
        append         : document.createElement('H2'),
        appendCallback : function () {
                            console.log('header added');
                        },
        settings       : null,

    },

    quote : {

        type           : 'quote',
        iconClassname  : 'ce_icon-quote',
        append         : document.createElement('BLOCKQUOTE'),
        appendCallback : function () {
                            console.log('quote added');
                        },
        settings       : null,

    },

    code : {

        type           : 'code',
        iconClassname  : 'ce_icon-code',
        append         : document.createElement('CODE'),
        appendCallback : function () {
                            console.log('code added');
                        },
        settings       : null,

    },

    list : {

        type           : 'code',
        iconClassname  : 'ce_icon-list',
        append         : document.createElement('LI'),
        appendCallback : function () {
                            console.log('code added');
                        },
        settings       : null,

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

        /** Toggler button*/
        bar.innerHTML = '<span class="toggler">' +
                            '<i class="plus_btn ce_icon-plus-circled-1"></i>'+
                        '</span>';
        return bar;
    },

    /**
    * Toolbar button
    */
    toolbarButton : function (type, classname) {

        var button = document.createElement("li");

        button.dataset.type = type;
        button.innerHTML    = '<i class="' + classname + '"></i>';

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


}
