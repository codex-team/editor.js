/**
* Some UI experiments for CodeX Editor
* @author Savchenko Peter (vk.com/specc)
*/

var ce = function(settings) {

    this.resultTextarea = document.getElementById("codex_editor");

    if (typeof this.resultTextarea == undefined || this.resultTextarea == null ){
        console.warn('Textarea not found with ID %o', this.textareaId);
        return this;
    }

    /* Prepare settings */
    if ("undefined" == typeof settings) settings = this.defaultSettings;
    else {
        // todo just merge settings with defaults
    }

    settings.tools = settings.tools || this.allTools;
    this.settings  = settings;


    /** Making a wrapper and interface */
    this.makeInterface();

    /** Bind all events */
    this.bindEvents();

};

// All posible tools
ce.prototype.allTools = ['header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'];

// Default settings configuration
ce.prototype.defaultSettings = {

};

// Add this class when open tool bar for css animation
ce.prototype.BUTTONS_TOGGLED_CLASSNANE = 'buttons_toggled';

// Default tool bar is closed
ce.prototype.toolbarOpened = false;

// Key event constants
ce.prototype.key = { TAB: 9, ENTER: 13, BACKSPACE: 8, DELETE: 46, SPACE: 32, ESC: 27, CTRL: 17, META: 91, SHIFT: 16, ALT: 18, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39 };

/**
 * Editor interface drawing
 * calls one time in editor constructor
*/
ce.prototype.makeInterface = function () {

    var wrapper   = this.make.editorWrapper(),
        firstNode = this.make.textNode('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro quia nihil repellendus aut cupiditate reprehenderit sapiente magnam nobis doloremque eaque! Sint nobis assumenda nisi ducimus minima illo tenetur, cumque facilis.' ),
        toolbar   = this.make.toolbar(),
        editableWrapper;

    this.wrapper = wrapper;
    this.editableWrapper = editableWrapper = wrapper.getElementsByClassName("ce_content")[0];
    this.toolbar = toolbar;

    this.toolbarButtons = this.make.toolbarButtons(this.allTools, this.settings.tools);

    toolbar.appendChild(this.toolbarButtons);


    /** Add first node  and tool bar*/
    editableWrapper.appendChild(firstNode);
    wrapper.appendChild(toolbar);

    /** Insert Editor after initial textarea. Hide textarea */
    this.resultTextarea.parentNode.insertBefore(wrapper, this.resultTextarea.nextSibling);
    this.resultTextarea.hidden = true;

    this.focusNode(firstNode);
};

/**
* All events binds in one place
*/
ce.prototype.bindEvents = function () {

    var _this = this,
        selectedNodeClass = "selected";

    /** All keydowns on Window */
    document.addEventListener('keydown', function (event) {
        _this.globalKeydownCallback(event);
    }, false );


    /** All blur on Window */
    document.addEventListener('mouseover', function (event) {
        // check if currently focused in contenteditable element
        //if ("BODY" == event.target.tagName) return;

        //event.target.classList.add(selectedNodeClass)

        var sender = event.target

        if (sender.classList.contains("node") && !_this.toolbar.isOpened) {
            console.log("hover", sender);
            var toolbar = _this.toolbar;


            toolbar.style.top = sender.offsetTop + "px";

            // repair buttons animation - just add css class async
            //setTimeout(function () {
                toolbar.classList.add("show");

            //});
        }
    }, false );

    /** All blur on Window */
    document.addEventListener('mouseout', function (event) {
        // check if currently focused in contenteditable element
        //if ("BODY" == event.target.tagName) return;

        //event.target.classList.add(selectedNodeClass)

        var sender = event.target

        //
        //var sel = window.getSelection();
        //var curSelectedNode = sel.anchorNode.tagName ? sel.anchorNode : sel.focusNode.parentElement;

        if (!_this.toolbar.isOpened) {
        //if (sender.classList.contains("node")) {
        //debugger
        //if (!curSelectedNode.isEqualNode(sender) && !_this.toolbarButtons.isEqualNode(sender)) {
            //debugger
            console.log("mouseout", sender);
            var toolbar = _this.toolbar;
            //
            //
            //toolbar.style.top = sender.offsetTop + "px";

            // repair buttons animation - just add css class async
            //setTimeout(function () {
                toolbar.classList.remove("show");
                //toolbar.classList.remove(_this.BUTTONS_TOGGLED_CLASSNANE);

            //if (_this.focusedToolbarBtn) {
            //    //console.log("has focused btn", _this.focusedToolbarBtn)
            //
            //    _this.focusedToolbarBtn.classList.remove("focused")
            //    _this.focusedToolbarBtn = false;
            //
            //    event.preventDefault();
            //    return
            //}
            //});
        }
    }, false );

};

/**
 * Sets focus to node conteneditable child
 * todo depending on node type
*/
ce.prototype.focusNode = function (node) {
    //debugger

    //if (node.classList.contains('ce_node_content')) node.focus();
    //else {
    //    var contentEditable = node.getElementsByClassName('ce_node_content');
    //    contentEditable.length && contentEditable[0].focus();
    //}

    node.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(node);
        range.collapse(false);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(node);
        textRange.collapse(false);
        textRange.select();
    }
};

/**
* All window keydowns handles here
*/
ce.prototype.globalKeydownCallback = function (event) {
    console.log("keydown", event);

    var _this = this;

    // TODO process key navigation on toolBar then its opened
    if (this.toolbar.isOpened) {
        if (event.which == this.key.LEFT || event.which == this.key.UP || event.which == this.key.DOWN || event.which == this.key.RIGHT) {
            this.moveToolBarButtonFocus(event.which == this.key.LEFT || event.which == this.key.UP )

            event.preventDefault();
            //return
        } else if (event.which == this.key.ENTER) {
            // TODO process seleceted toolBtn
            //insert new node or change type of current?
            //and close toolbar

            // TODO do the same by mouse clicking on any toolbar btn

            event.preventDefault();
        } else if (event.which != this.key.TAB && event.which != this.key.SHIFT) {

            var toolbar = this.toolbar;

            toolbar.isOpened = false;
            this.focusedToolbarBtn.classList.remove("focused");
            this.focusedToolbarBtn = false;

            // repair buttons animation - just add css class async
            setTimeout(function () {
                toolbar.classList.remove("show");
                toolbar.classList.remove(_this.BUTTONS_TOGGLED_CLASSNANE);
            });

            //event.preventDefault();
            //return
        }

    }

    if (event.which == this.key.TAB)
        this.tabKeyPressed(event)

    //
    //switch (event.keyCode){
    //    case this.key.TAB   : this.tabKeyPressed(event); break; // TAB
    //    case this.key.ENTER : this.enterKeyPressed(event); break; // Enter
    //}

};

/**
*
*/
ce.prototype.tabKeyPressed = function(event) {

    // check if currently focused in contenteditable element
    if ("BODY" == event.target.tagName) return;

    var _this = this;

    var toolbar = this.toolbar;

    if (!toolbar.isOpened) {
        var sel = window.getSelection();
        var curNode = sel.anchorNode.tagName ? sel.anchorNode : sel.focusNode.parentElement;

        toolbar.style.top = curNode.offsetTop + "px";

        if (!toolbar.classList.contains(_this.BUTTONS_TOGGLED_CLASSNANE)) {
            // repair buttons animation - just add css class async
            setTimeout(function () {
                toolbar.classList.add(_this.BUTTONS_TOGGLED_CLASSNANE)
                toolbar.isOpened = true;
            });
        }

    }

    //
    this.moveToolBarButtonFocus(event.shiftKey);

    event.preventDefault();
};

/*
*
* */
ce.prototype.moveToolBarButtonFocus = function(focusPrev){
    var allButtons = this.toolbarButtons;

    var focusedQuery = allButtons.getElementsByClassName("focused");//[0] || allButtons.firstChild;
    var focused;

//debugger
    console.log("focusing", focusedQuery)
    if (focusedQuery.length > 0) {
        focused = focusedQuery[0]

        focused.classList.remove("focused")

        if (focusPrev) focused = focused.previousSibling;
        else focused = focused.nextSibling;

        if (!focused) {
            if (focusPrev) focused = allButtons.lastChild;
            else focused = allButtons.firstChild;
        }

        focused.classList.add("focused")
    } else {
        focused = allButtons.firstChild;


        focused.classList.add("focused")
    }

    this.focusedToolbarBtn = focused;

    //return !!focused;
}

/**
* Handle Enter key. Adds new Node;
*/
ce.prototype.enterKeyPressed = function(event) {

    //var _this = this;


    if (this.toolbar.isOpened) {
        console.log("has focused btn", this.focusedToolbarBtn)

        event.preventDefault();
        return
    }

    this.toolbar.classList.remove("show")
    this.toolbar.classList.remove(this.BUTTONS_TOGGLED_CLASSNANE)

    //if (event.shiftKey){
    //    document.execCommand('insertHTML', false, '<br><br>');
    //} else {
    //    var newNode = this.make.textNode(),
    //        toolbar = this.make.toolbar();
    //
    //    var sel = window.getSelection();
    //    var curNode = sel.focusNode.parentElement;
    //
    //    /** Add node */
    //    this.editableWrapper.insertBefore(newNode, curNode.nextSibling);
    //
    //    /** Add toolbar to node */
    //    //this.editableWrapper.insertBefore(toolbar, newNode);
    //
    //    /** Set auto focus */
    //    setTimeout(function () {
    //
    //        _this.focusNode(newNode);
    //    });
    //}

    //event.preventDefault();
};

/**
* Creates HTML elements
*/
ce.prototype.make = function () {
    /** Empty toolbar with toggler */
    function toolbar () {

        var bar = document.createElement('div');

        bar.className += 'add_buttons';

        /** Toggler button*/
        bar.innerHTML = '<span class="toggler">' +
                            '<i class="plus_btn ce_icon-plus-circled-1"></i>'+
                        '</span>';
        return bar;

    }

    // Creates one button with given type
    function toolbarButton (type) {

        var button = document.createElement('button');

        button.dataset.type = type;
        button.innerHTML    = '<i class="ce_icon-' + type + '"></i>';

        return button;

    }

    // Creates all tool bar buttons from editor settings
    // allTools, usedTools - needs becose cant get them from editor object - bad context
    function toolbarButtons (allTools, usedTools) {

        var toolbarButtons = document.createElement("span");

        toolbarButtons.classList.add("buttons");

        // Walk base buttons list - save buttons origin sorting
        allTools.forEach(function(item) {

            if (usedTools.indexOf(item) >= 0) toolbarButtons.appendChild( this.toolbarButton(item) );

        }, this);

        return toolbarButtons;

    }

    /**
    * Paragraph node
    * @todo set unique id with prefix
    */
    function textNode (content){

        var node = document.createElement('p');

        //node.setAttribute("tabindex", 0);

        node.classList.add("node");
        node.classList.add("ce_node_content");
        node.setAttribute("contenteditable", "true");

        node.innerHTML = content || '';

        return node;
    }

    function editorWrapper () {

        var wrapper = document.createElement('div'),
            editable_wrapper = document.createElement('div');


        editable_wrapper.className += 'ce_content';
        editable_wrapper.setAttribute("contenteditable", "true");

        wrapper.className += 'codex_editor';
        wrapper.appendChild(editable_wrapper);

        return wrapper;
    }

    var ceMake = function () {
        this.toolbar        = toolbar;
        this.toolbarButtons = toolbarButtons;
        this.toolbarButton  = toolbarButton;
        this.textNode       = textNode;
        this.editorWrapper  = editorWrapper;
    };

    return new ceMake();

}();





/**
* Polyfilling ECMAScript 6 method String.includes
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Browser_compatibility
*/
if ( !String.prototype.includes ) {

    String.prototype.includes = function() {

        'use strict';

        return String.prototype.indexOf.apply(this, arguments) !== -1;

    };
}