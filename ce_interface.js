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
ce.prototype.key = { TAB: 9, ENTER: 13, BACKSPACE: 8, DELETE: 46, DOWN: 40, SPACE: 32, ESC: 27, CTRL: 17, META: 91, SHIFT: 16, ALT: 18 };

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
    document.addEventListener('focus', function (event) {
        // check if currently focused in contenteditable element
        if ("BODY" == event.target.tagName) return;

        event.target.classList.add(selectedNodeClass)
    }, false );

};

/**
 * Sets focus to node conteneditable child
 * todo depending on node type
*/
ce.prototype.focusNode = function (node) {
    debugger
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

    switch (event.keyCode){
        case this.key.TAB   : this.tabKeyPressed(event); break; // TAB
        case this.key.ENTER : this.enterKeyPressed(event); break; // Enter
    }

};

/**
*
*/
ce.prototype.tabKeyPressed = function(event) {

    // check if currently focused in contenteditable element
    if ("BODY" == event.target.tagName) return;

    var toolbar = event.target.nextSibling,
        _this = this;

    toolbar.appendChild(this.toolbarButtons);


    var sel = window.getSelection();
    var curNode = sel.anchorNode.tagName ? sel.anchorNode : sel.focusNode.parentElement;

    //debugger
    var posTop =
    toolbar.style.top = curNode.offsetTop + "px";

    // repair buttons animation - just add css class async
    setTimeout(function () {

        if ( !toolbar.className.includes(_this.BUTTONS_TOGGLED_CLASSNANE) ){
            toolbar.className += ' ' + _this.BUTTONS_TOGGLED_CLASSNANE;
            _this.toolbarOpened = true;
        } else {
            toolbar.className = toolbar.className.replace(' ' + _this.BUTTONS_TOGGLED_CLASSNANE, '');
            _this.toolbarOpened = false
        }

    });

    event.preventDefault();

};

/**
* Handle Enter key. Adds new Node;
*/
ce.prototype.enterKeyPressed = function(event) {

    var _this = this;

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