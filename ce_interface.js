/**
* Some UI experiments for CodeX Editor
* @author Savchenko Peter (vk.com/specc)
*/

var ce = function(textareaId) {

    this.resultTextarea = document.getElementById(textareaId);

    if (typeof this.resultTextarea == undefined || this.resultTextarea == null ){

        console.warn('Textarea not found with ID %o', textareaId);
        return this;

    }

    this.toolbarOpened = false;
    this.tools = ['header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'];

    /** Some configurations */
    this.BUTTONS_TOGGLED_CLASSNANE = 'buttons_toggled';
    this.key = { TAB: 9, ENTER: 13, BACKSPACE: 8, DELETE: 46, DOWN: 40, SPACE: 32, ESC: 27, CTRL: 17, META: 91, SHIFT: 16, ALT: 18 };

    /** Making a wrapper and interface */
    this.makeInterface();

    /** Bind all events */
    this.bindEvents();

}

/**
* Editor interface drawing
* @use this.tools to get necessary items
* @todo get tools from user inital-settings
*/
ce.prototype.makeInterface = function () {

    var wrapper   = this.make.editorWrapper(),
        firstNode = this.make.node(null, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro quia nihil repellendus aut cupiditate reprehenderit sapiente magnam nobis doloremque eaque! Sint nobis assumenda nisi ducimus minima illo tenetur, cumque facilis.' ),
        toolbar   = this.make.toolbar(),
        button;

    for (var i = 0; i < this.tools.length; i++) {
        button = this.make.toolbarButton(this.tools[i]);
        toolbar.appendChild(button);
    };

    /**
    * Add toolbar to node
    * @todo make toolbar rendering once
    */
    firstNode.appendChild(toolbar);

    /** Add first node */
    wrapper.appendChild(firstNode);

    /** Insert Editor after initial textarea. Hide textarea */
    this.resultTextarea.parentNode.insertBefore(wrapper, this.resultTextarea.nextSibling);
    this.resultTextarea.hidden = true;

    /** Set auto focus */
    var contentEditable = firstNode.getElementsByClassName('ce_node_content');
    contentEditable.length && contentEditable[0].focus();

}

/**
* All events binds in one place
*/
ce.prototype.bindEvents = function () {

    var _this = this;

    /** All keydowns on Window */
    window.addEventListener('keydown', function (event) {
        _this.globalKeydownCallback(event);
    }, false );

}

/**
* All window keydowns handles here
*/
ce.prototype.globalKeydownCallback = function (event) {

    switch (event.keyCode){
        case this.key.TAB   : this.tabKeyPressed(event); break; // TAB
        case this.key.ENTER : this.enterKeyPressed(event); break; // Enter
    }

}

/**
* @todo: check if currently focused in contenteditable element
*/
ce.prototype.tabKeyPressed = function(event) {

    var toolbar = document.getElementsByClassName('add_buttons');

    if ( !toolbar[0].className.includes(this.BUTTONS_TOGGLED_CLASSNANE) ){
        toolbar[0].className += ' ' + this.BUTTONS_TOGGLED_CLASSNANE;
        this.toolbarOpened = true;
    } else {
        toolbar[0].className = toolbar[0].className.replace(this.BUTTONS_TOGGLED_CLASSNANE, '');
        this.toolbarOpened = false
    }

    event.preventDefault();

}

/**
* Handle Enter key. Adds new Node;
*/
ce.prototype.enterKeyPressed = function(event) {

      console.log('ENTER');

}

/**
* Creates HTML elements
*/
ce.prototype.make = function (window) {

    /** Empty toolbar with toggler */
    function toolbar () {

        var bar = document.createElement('div');

        bar.className += 'add_buttons';

        /** Toggler button*/
        bar.innerHTML = '<span class="toggler">' +
                            '<i class="ce_icon-plus-circled-1"></i>'+
                        '</span>';
        return bar;

    }

    function toolbarButton (type) {

        var button = document.createElement('button');

        button.dataset.type = type;
        button.innerHTML    = '<i class="ce_icon-' + type + '"></i>';

        return button;
    }

    /**
    * Paragraph node
    * @todo set unique id with prefix
    */
    function node (id, content){

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
        this.toolbar       = toolbar;
        this.toolbarButton = toolbarButton;
        this.node          = node;
        this.editorWrapper = editorWrapper;
    }

    return new ceMake();

}(this)





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