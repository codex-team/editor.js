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
        redactor : null
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
    keys : { TAB: 9, ENTER: 13, BACKSPACE: 8, DELETE: 46, SPACE: 32, ESC: 27, CTRL: 17, META: 91, SHIFT: 16, ALT: 18, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39 },

    /**
    * Check object for DOM node
    */
    isDomNode : function (el) {
        return el && typeof el === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;
    }

}

cEditor.ui = {

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

        /** Make toolbar buttons */
        cEditor.settings.tools.forEach(function(type) {

            tool = cEditor.draw.toolbarButton(type);
            toolbar.appendChild(tool);

            /** Save tools to static nodes */
            cEditor.nodes.toolbarButtons[type] = tool;

        });

        /** Save created ui-elements to static nodes state */
        cEditor.nodes.wrapper  = wrapper;
        cEditor.nodes.toolbar  = toolbar;
        cEditor.nodes.redactor = redactor;

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
        }, false );

    }

};

cEditor.callback = {

    globalKeydown : function(event){

        switch (event.keyCode){
            case cEditor.core.keys.TAB   : this.tabKeyPressed(event); break;
            case cEditor.core.keys.ENTER : this.enterKeyPressed(event); break;
            case cEditor.core.keys.ESC   : this.escapeKeyPressed(event); break;
        }

    },

    globalKeyup : function(event){

        switch (event.keyCode){
            case cEditor.core.keys.UP    :
            case cEditor.core.keys.DOWN  : this.arrowKeyPressed(event); break;
        }

    },


    tabKeyPressed : function(event){



        console.log('TAB pressed: %o', event);

        if ( !cEditor.toolbar.opened ) {
            cEditor.toolbar.open();
        } else {
            cEditor.toolbar.leaf();
        }

        event.preventDefault();

        // return false;

    },

    enterKeyPressed : function(event){

        console.log('Enter pressed, event.target: %o', event.target);

        if (cEditor.toolbar.opened && event.target == cEditor.nodes.redactor) {

            event.preventDefault();
            cEditor.toolbar.toolClicked();
            cEditor.toolbar.close();

        };

    },

    escapeKeyPressed : function(event){

        event.preventDefault();
        console.log('Escape pressed');
        cEditor.toolbar.close();

    },

    arrowKeyPressed : function(event){

        console.log('Arrow pressed');

        cEditor.toolbar.close();

        var nodeFocused = cEditor.html.getNodeFocused();

        if (!nodeFocused) {
            return;
        }

        cEditor.toolbar.move(nodeFocused);

    },

    redactorClicked : function (event) {

        var nodeFocused = cEditor.html.getNodeFocused();

        if (!nodeFocused) {
            return;
        }

        cEditor.toolbar.move(nodeFocused);


    }

};

cEditor.toolbar = {

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

        console.log('close!');

        cEditor.nodes.toolbar.classList.remove('opened');

        this.opened  = false;
        this.current = null;
        for (button in cEditor.nodes.toolbarButtons){
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
            nextToolIndex;

        if ( !currentTool ) {

            for (toolToSelect in barButtons) break;

        } else {

            nextToolIndex = tools.indexOf(currentTool) + 1;

            if ( nextToolIndex == tools.length) nextToolIndex = 0;

            toolToSelect = tools[nextToolIndex];

        }

        for (button in barButtons) barButtons[button].classList.remove('selected')

        barButtons[toolToSelect].classList.add('selected');

        this.current = toolToSelect;

    },

    /**
    * Transforming selected node type into selected toolbar element type
    */
    toolClicked : function() {

        var nodeFocused = cEditor.html.getNodeFocused(),
            newTag;

        console.log(cEditor.toolbar.current);

        switch (cEditor.toolbar.current) {
            case 'header' : newTag = 'H1'; break;
            case 'quote'  : newTag = 'BLOCKQUOTE'; break;
            case 'code'   : newTag = 'CODE'; break;
        };

        cEditor.html.switchNode(nodeFocused, newTag);

    },


    /**
    * Moving toolbar to the specified node
    */
    move : function(destinationBlock) {

        console.log(cEditor.nodes.toolbar);

        var newYCoordinate = destinationBlock.offsetTop - cEditor.toolbar.defaultOffset -
                             cEditor.nodes.toolbar.clientHeight;

        cEditor.nodes.toolbar.style.transform = "translateY(" + newYCoordinate + "px)";

    }

};

cEditor.html = {

    getNodeFocused : function() {

        var selection = window.getSelection();

        if (selection.anchorNode != null) {
            return selection.anchorNode.tagName ? selection.anchorNode : selection.focusNode.parentElement;
        } else {
            return null;
        }

    },

    switchNode : function (targetNode, tagName) {

        /**  */
        if (!targetNode && !tagName) return;

        var newNode = cEditor.draw.block(tagName, targetNode.innerHTML);

        cEditor.nodes.redactor.replaceChild(newNode, targetNode);

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
            })

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

                    /** Append block to the redactor */
                    cEditor.nodes.redactor.appendChild(block);

                    /** Save block to the cEditor.state array */
                    cEditor.state.blocks.push(block);
                };

            })

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
        redactor.contentEditable = true;

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
    toolbarButton : function (type) {

        var button = document.createElement("li");

        button.dataset.type = type;
        button.innerHTML    = '<i class="ce_icon-' + type + '"></i>';

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