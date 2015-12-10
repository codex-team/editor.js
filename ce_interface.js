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
        toolbar   = this.make.toolbar();

    this.wrapper = wrapper;
    this.toolbar = toolbar;

    this.toolbarButtons = this.make.toolbarButtons(this.allTools, this.settings.tools);

    /** Add first node  and tool bar*/
    wrapper.appendChild(firstNode);
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

    var _this = this;

    /** All keydowns on Window */
    window.addEventListener('keydown', function (event) {
        _this.globalKeydownCallback(event);
    }, false );

};

/**
 * Sets focus to node conteneditable child
 * todo depending on node type
*/
ce.prototype.focusNode = function (node) {

    var contentEditable = node.getElementsByClassName('ce_node_content');
    contentEditable.length && contentEditable[0].focus();

};

/**
* All window keydowns handles here
*/
ce.prototype.globalKeydownCallback = function (event) {

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

    var toolbar = event.target.parentNode.nextSibling,
        _this = this;

    toolbar.appendChild(this.toolbarButtons);

    // repair buttons animation - just add css class async
    setTimeout(function () {

        if ( !toolbar.className.includes(_this.BUTTONS_TOGGLED_CLASSNANE) ){
            toolbar.className += ' ' + _this.BUTTONS_TOGGLED_CLASSNANE;
            _this.toolbarOpened = true;
        } else {
            toolbar.className = toolbar.className.replace(_this.BUTTONS_TOGGLED_CLASSNANE, '');
            _this.toolbarOpened = false
        }

    });

    event.preventDefault();

};

/**
* Handle Enter key. Adds new Node;
*/
ce.prototype.enterKeyPressed = function(event) {

    if (event.shiftKey){
        document.execCommand('insertHTML', false, '<br><br>');
    } else {
        var newNode = this.make.textNode(),
            toolbar = this.make.toolbar();

        /** Add node */
        this.wrapper.insertBefore(newNode, event.target.parentNode.nextSibling);

        /** Add toolbar to node */
        this.wrapper.insertBefore(toolbar, newNode);

        /** Set auto focus */
        var contentEditable = newNode.getElementsByClassName('ce_node_content');
        contentEditable.length && contentEditable[0].focus();
    }

    event.preventDefault();
};

/**
* Creates HTML elements
*/
ce.prototype.make = function () {

    var _this = this;

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

        var node = document.createElement('div');

        node.className += 'node';
        node.innerHTML = '<p class="ce_node_content" contenteditable="true">' + (content || '') + '</p>';

        return node;
    }

    function editorWrapper () {

        var wrapper = document.createElement('div');

        wrapper.className += 'codex_editor';

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