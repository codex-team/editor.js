/**
* Some UI experiments for CodeX Editor
* @author Savchenko Peter (vk.com/specc)
*/

    /*
    * TODO
    * выделение нескольких блоков и нажатие энтера - вместо замены новой стро
    *
    * */


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


    /*
     * Импорт содержимого textarea в редактор
     * */
    this.importHtml();


    /** Bind all events */
    this.bindEvents();

};

// All posible tools
ce.prototype.allTools = ['header', 'picture', 'list', 'quote', 'code', 'link', 'twitter', 'instagram', 'smile'];

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


/*
 * Экспорт разметки в итоговый текстареа
 * пока по кнопке "экспорт", потом можно сделать на каждое изменение в редакторе (надо ли это?)
 * */
ce.prototype.exportHtml = function () {
    this.resultTextarea.innerHTML = this.editableWrapper.innerHTML;
    this.resultTextarea.value     = this.editableWrapper.innerHTML;

    return false;
};


/**
 * Импорт разметки из итоговой текстареа
 * пока по кнопке "импорт", потом можно сделать на каждое изменение в редакторе (надо ли это?)
 *
 * TODO
 * 1) удалить лишние узлы, работа с которыми не предполагается в рамках редактора
 * 2) удалить скрипты, стили
 * 3) поочищать содержимое узлов от мусора - должен остаться только текст, теги форматирования (жирность и тд) и переносы строк (или их тоже убираем?)
 * */
ce.prototype.importHtml = function () {
    var node, body, i, nodeType, tmp;

    /*
    * Парсим содержимое textarea.
    * Создаем новый документ, получаем указатель на контенейр body.
    * */
    tmp  = new DOMParser().parseFromString( this.resultTextarea.value, "text/html" );
    body = tmp.getElementsByTagName("body")[0];

    /*
    * Обходим корневые узлы. Проставляем им класс и тип узла.
    * */
    for(i = 0; i < body.children.length; i++){
        node = body.children.item(i);

        if (!node.classList.contains("node"))
            node.classList.add("node");


        switch (node.tagName){
            case "P" :
                nodeType = "text";
            break;

            case "H1" :
            case "H2" :
            case "H3" :
            case "H4" :
            case "H5" :
            case "H6" :
                nodeType = "header";
            break;

            case "UL" :
                nodeType = "list";
            break;

            case "IMG" :
                nodeType = "picture";
            break;

            case "CODE" :
                nodeType = "code";
            break;
        }

        node.dataset["type"] = nodeType;
    }

    this.editableWrapper.innerHTML = body.innerHTML;

};


/**
* All events binds in one place
*/
ce.prototype.bindEvents = function () {

    var _this = this,
        selectedNodeClass = "selected";

    /*
    * Экспорт разметки в итоговый textarea по нажатию на кнопку "сохранить".
    * Кнопка сохранения должна иметь, так же как и textarea, особенный ID.
    * */
    document.getElementById("codex_editor_export_btn").addEventListener('click', function () {
        _this.exportHtml.apply(_this)
    });


    /** All keydowns on Window */
    document.addEventListener('keydown', function (event) {
        _this.globalKeydownCallback(event);
    }, false );


    /** All mouseover on Window */
    document.addEventListener('mouseover', function (event) {
        _this.globalMouseOverCallback(event);
    }, false );


    /** All mouseout on Window */
    document.addEventListener('mouseout', function (event) {
        _this.globalMouseOutCallback(event);
    }, false );

};


/**
 * All window mouseover handles here
*/
ce.prototype.globalMouseOverCallback = function (event) {
    var sender = event.target;

    if (sender.classList.contains("node") && !this.toolbar.isOpened) {
        var toolbar = this.toolbar;

        toolbar.style.top = sender.offsetTop + "px";

        toolbar.classList.add("show");
    }
};


/**
 * All window mouseout handles here
*/
ce.prototype.globalMouseOutCallback = function (event) {
    var sender = event.target;

    if (!this.toolbar.isOpened) {
        var toolbar = this.toolbar;

        toolbar.classList.remove("show");
    }
};


/**
 * Sets focus to node conteneditable child
 * todo depending on node type
*/
ce.prototype.focusNode = function (node) {
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

/*
* Определяет, есть ли выделенный текст
* */
ce.prototype.isTextSelected = function(){
    return !!window.getSelection().toString()
};

/*
* Определяет, относится ли нажатая кнопка к навигационным
* */
ce.prototype.isNavigationKey = function(keyCode){
    return keyCode == this.key.LEFT || keyCode == this.key.UP || keyCode == this.key.DOWN || keyCode == this.key.RIGHT
};

/**
* All window keydowns handles here
*/
ce.prototype.globalKeydownCallback = function (event) {

    /**
     * Обработка клавиш на панеле добавления
     */
    this.processToolBarKeyPressed(event);

    //
    switch (event.keyCode){
        case this.key.TAB   : this.tabKeyPressed(event); break; // TAB
        case this.key.ENTER : this.enterKeyPressed(event); break; // Enter
    }

};


/**
* Обрабатывает нажатие клавиш при открытой панеле добавления
*/
ce.prototype.processToolBarKeyPressed = function(event){
    if (this.toolbar.isOpened) {

        if (this.isNavigationKey(event.which)) {

            this.moveToolBarButtonFocus(event.which == this.key.LEFT || event.which == this.key.UP );

            event.preventDefault();

        } else if (event.which == this.key.ENTER) {
            // will process later
        } else if (event.which != this.key.TAB && event.which != this.key.SHIFT) {

            this.closeToolBar();

        }

    }
};



/**
* Closes tool bar (plus btn)
*/
ce.prototype.closeToolBar = function(){
    var _this = this,
        toolbar = this.toolbar;

    toolbar.isOpened = false;
    this.focusedToolbarBtn.classList.remove("focused");
    this.focusedToolbarBtn = false;

    // repair buttons animation - just add css class async
    setTimeout(function () {
        toolbar.classList.remove("show");
        toolbar.classList.remove(_this.BUTTONS_TOGGLED_CLASSNANE);
    });
};



/**
* Returns node which is currently focused
*/
ce.prototype.getFocusedNode = function(){
    var sel = window.getSelection();
    return sel.anchorNode.tagName ? sel.anchorNode : sel.focusNode.parentElement;
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

/**
* Перемещает фокус на следующую кнопку в панеле добавления (плюс)
* */
ce.prototype.moveToolBarButtonFocus = function(focusPrev){
    var allButtons = this.toolbarButtons;

    var focusedQuery = allButtons.getElementsByClassName("focused");
    var focused;

    if (focusedQuery.length > 0) {
        focused = focusedQuery[0];

        focused.classList.remove("focused");

        if (focusPrev) focused = focused.previousSibling;
        else focused = focused.nextSibling;

        if (!focused) {
            if (focusPrev) focused = allButtons.lastChild;
            else focused = allButtons.firstChild;
        }

        focused.classList.add("focused");
    } else {
        focused = allButtons.firstChild;

        focused.classList.add("focused");
    }

    this.focusedToolbarBtn = focused;
};

/**
* Handle Enter key. Adds new Node;
*/
ce.prototype.enterKeyPressed = function(event) {

    var _this = this,
        curNode = this.getFocusedNode();

    /*
    * обработка выбранной кнопки тулбара
    * */
    if (this.toolbar.isOpened) {

        switch ( this.focusedToolbarBtn.dataset["type"] ){

            case "header":
                var header = this.make.headerNode();

                if (curNode.textContent){

                    header.textContent  = curNode.textContent;
                    curNode.textContent = "";

                    // insert before, if curNode is paragraph or header or some other text-editable node
                    if (curNode.dataset["type"] == "text"){
                        curNode.parentNode.insertBefore(header, curNode);
                        curNode.remove();
                    }
                    // else insert header node after
                    else
                        curNode.parentNode.insertBefore(header, curNode.nextSibling);

                } else {

                    curNode.parentNode.insertBefore(header, curNode);
                    curNode.remove();

                }

                this.focusNode(header);

                break;

        }

        this.closeToolBar();

        // TODO do the same by mouse clicking on any toolbar btn

        event.preventDefault();

    }
    /*
    * Перехват создания нового параграфа при нахождении в заголовке.
    * По-умолчанию создается просто div.
    * */
    else {

        if (curNode.dataset["type"] == "header" && !this.isTextSelected()) {
            var newNode = this.make.textNode();

            /** Add node */
            this.editableWrapper.insertBefore(newNode, curNode.nextSibling);

            /** Set auto focus */
            setTimeout(function () {

                _this.focusNode(newNode);
            });

            event.preventDefault();
        }
    }
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

        node.classList.add("node");
        node.dataset["type"] = "text";

        node.innerHTML = content || '';

        return node;
    }

    /**
    * Header node
    */
    function headerNode (content){

        var node = document.createElement('h2');

        node.classList.add("node");
        node.dataset["type"] = "header";

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
        this.editorWrapper  = editorWrapper;
        this.textNode       = textNode;
        this.headerNode     = headerNode;
    };

    return new ceMake();

}();