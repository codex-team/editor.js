var codex = codex || {}; codex["editor"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 *
	 * Codex Editor
	 *
	 * @author Codex Team
	 */
	
	module.exports = function (editor) {
	
	    'use strict';
	
	    editor.version = ("1.4.0");
	
	    var init = function init() {
	
	        editor.core = __webpack_require__(1);
	        editor.ui = __webpack_require__(2);
	        editor.transport = __webpack_require__(3);
	        editor.renderer = __webpack_require__(4);
	        editor.saver = __webpack_require__(5);
	        editor.content = __webpack_require__(6);
	        editor.toolbar = __webpack_require__(7);
	        editor.callback = __webpack_require__(11);
	        editor.draw = __webpack_require__(12);
	        editor.caret = __webpack_require__(13);
	        editor.notifications = __webpack_require__(14);
	        editor.parser = __webpack_require__(15);
	        editor.sanitizer = __webpack_require__(16);
	    };
	
	    /**
	     * @public
	     *
	     * holds initial settings
	     */
	    editor.settings = {
	        tools: ['paragraph', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
	        textareaId: 'codex-editor',
	        uploadImagesUrl: '/editor/transport/',
	
	        // Type of block showing on empty editor
	        initialBlockPlugin: 'paragraph'
	    };
	
	    /**
	     * public
	     *
	     * Static nodes
	     */
	    editor.nodes = {
	        textarea: null,
	        wrapper: null,
	        toolbar: null,
	        inlineToolbar: {
	            wrapper: null,
	            buttons: null,
	            actions: null
	        },
	        toolbox: null,
	        notifications: null,
	        plusButton: null,
	        showSettingsButton: null,
	        showTrashButton: null,
	        blockSettings: null,
	        pluginSettings: null,
	        defaultSettings: null,
	        toolbarButtons: {}, // { type : DomEl, ... }
	        redactor: null
	    };
	
	    /**
	     * @public
	     *
	     * Output state
	     */
	    editor.state = {
	        jsonOutput: [],
	        blocks: [],
	        inputs: []
	    };
	
	    /**
	    * @public
	    * Editor plugins
	    */
	    editor.tools = {};
	
	    /**
	     * Initialization
	     * @uses Promise cEditor.core.prepare
	     * @param {} userSettings are :
	     *          - tools [],
	     *          - textareaId String
	     *          ...
	     *
	     * Load user defined tools
	     * Tools must contain this important objects :
	     *  @param {String} type - this is a type of plugin. It can be used as plugin name
	     *  @param {String} iconClassname - this a icon in toolbar
	     *  @param {Object} make - what should plugin do, when it is clicked
	     *  @param {Object} appendCallback - callback after clicking
	     *  @param {Element} settings - what settings does it have
	     *  @param {Object} render - plugin get JSON, and should return HTML
	     *  @param {Object} save - plugin gets HTML content, returns JSON
	     *  @param {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
	     *  @param {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
	     *
	     * @example
	     *   -  type             : 'header',
	     *   -  iconClassname    : 'ce-icon-header',
	     *   -  make             : headerTool.make,
	     *   -  appendCallback   : headerTool.appendCallback,
	     *   -  settings         : headerTool.makeSettings(),
	     *   -  render           : headerTool.render,
	     *   -  save             : headerTool.save,
	     *   -  displayInToolbox : true,
	     *   -  enableLineBreaks : false
	     */
	    editor.start = function (userSettings) {
	
	        init();
	
	        editor.core.prepare(userSettings)
	
	        // If all ok, make UI, bind events and parse initial-content
	        .then(editor.ui.make).then(editor.ui.addTools).then(editor.ui.bindEvents).then(editor.ui.preparePlugins).then(editor.transport.prepare).then(editor.renderer.makeBlocksFromData).then(editor.ui.saveInputs).catch(function (error) {
	
	            editor.core.log('Initialization failed with error: %o', 'warn', error);
	        });
	    };
	
	    return editor;
	}({});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Codex Editor Core
	 *
	 * @author Codex Team
	 * @version 1.1.2
	 */
	
	var editor = codex.editor;
	
	var core = function (core) {
	
	    /**
	     * @public
	     *
	     * Editor preparing method
	     * @return Promise
	     */
	    core.prepare = function (userSettings) {
	
	        return new Promise(function (resolve, reject) {
	
	            if (userSettings) {
	
	                editor.settings.tools = userSettings.tools || editor.settings.tools;
	            }
	
	            if (userSettings.data) {
	
	                editor.state.blocks = userSettings.data;
	            }
	
	            if (userSettings.initialBlockPlugin) {
	
	                editor.settings.initialBlockPlugin = userSettings.initialBlockPlugin;
	            }
	
	            if (userSettings.uploadImagesUrl) {
	
	                editor.settings.uploadImagesUrl = userSettings.uploadImagesUrl;
	            }
	
	            editor.nodes.textarea = document.getElementById(userSettings.textareaId || editor.settings.textareaId);
	
	            if (_typeof(editor.nodes.textarea) === undefined || editor.nodes.textarea === null) {
	
	                reject(Error("Textarea wasn't found by ID: #" + userSettings.textareaId));
	            } else {
	
	                resolve();
	            }
	        });
	    };
	
	    /**
	     * Logging method
	     * @param type = ['log', 'info', 'warn']
	     */
	    core.log = function (msg, type, arg) {
	
	        type = type || 'log';
	
	        if (!arg) {
	
	            arg = msg || 'undefined';
	            msg = '[codex-editor]:      %o';
	        } else {
	
	            msg = '[codex-editor]:      ' + msg;
	        }
	
	        try {
	
	            if ('console' in window && console[type]) {
	
	                if (arg) console[type](msg, arg);else console[type](msg);
	            }
	        } catch (e) {}
	    };
	
	    /**
	     * @protected
	     *
	     * Helper for insert one element after another
	     */
	    core.insertAfter = function (target, element) {
	
	        target.parentNode.insertBefore(element, target.nextSibling);
	    };
	
	    /**
	     * @const
	     *
	     * Readable DOM-node types map
	     */
	    core.nodeTypes = {
	        TAG: 1,
	        TEXT: 3,
	        COMMENT: 8
	    };
	
	    /**
	     * @const
	     * Readable keys map
	     */
	    core.keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39, DELETE: 46, META: 91 };
	
	    /**
	     * @protected
	     *
	     * Check object for DOM node
	     */
	    core.isDomNode = function (el) {
	
	        return el && (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;
	    };
	
	    /**
	     * Native Ajax
	     */
	    core.ajax = function (data) {
	
	        if (!data || !data.url) {
	
	            return;
	        }
	
	        var XMLHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
	            success_function = function success_function() {},
	            params = '',
	            obj;
	
	        data.async = true;
	        data.type = data.type || 'GET';
	        data.data = data.data || '';
	        data['content-type'] = data['content-type'] || 'application/json; charset=utf-8';
	        success_function = data.success || success_function;
	
	        if (data.type == 'GET' && data.data) {
	
	            data.url = /\?/.test(data.url) ? data.url + '&' + data.data : data.url + '?' + data.data;
	        } else {
	
	            for (obj in data.data) {
	
	                params += obj + '=' + encodeURIComponent(data.data[obj]) + '&';
	            }
	        }
	
	        if (data.withCredentials) {
	
	            XMLHTTP.withCredentials = true;
	        }
	
	        if (data.beforeSend && typeof data.beforeSend == 'function') {
	
	            data.beforeSend.call();
	        }
	
	        XMLHTTP.open(data.type, data.url, data.async);
	        XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	        XMLHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	
	        XMLHTTP.onreadystatechange = function () {
	
	            if (XMLHTTP.readyState == 4 && XMLHTTP.status == 200) {
	
	                success_function(XMLHTTP.responseText);
	            }
	        };
	
	        XMLHTTP.send(params);
	    };
	
	    /**
	    * Appends script to head of document
	    * @return Promise
	    */
	    core.importScript = function (scriptPath, instanceName) {
	
	        return new Promise(function (resolve, reject) {
	
	            var instancePrefix = 'cdx-script-';
	
	            var script = void 0;
	
	            /** Script is already loaded */
	            if (!instanceName) {
	
	                reject('Instance name is missed');
	            } else if (document.getElementById(instancePrefix + instanceName)) {
	
	                resolve(scriptPath);
	            }
	
	            script = document.createElement('SCRIPT');
	            script.async = true;
	            script.defer = true;
	            script.id = instancePrefix + instanceName;
	
	            script.onload = function () {
	
	                resolve(scriptPath);
	            };
	
	            script.onerror = function () {
	
	                reject(scriptPath);
	            };
	
	            script.src = scriptPath;
	            document.head.appendChild(script);
	        });
	    };
	
	    return core;
	}({});
	
	module.exports = core;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor UI module
	 *
	 * @author Codex Team
	 * @version 1.1
	 */
	
	var editor = codex.editor;
	
	var ui = function (ui) {
	
	    /**
	     * Basic editor classnames
	     */
	    ui.className = {
	
	        /**
	         * @const {string} BLOCK_CLASSNAME - redactor blocks name
	         */
	        BLOCK_CLASSNAME: 'ce-block',
	
	        /**
	         * @const {String} wrapper for plugins content
	         */
	        BLOCK_CONTENT: 'ce-block__content',
	
	        /**
	         * @const {String} BLOCK_STRETCHED - makes block stretched
	         */
	        BLOCK_STRETCHED: 'ce-block--stretched',
	
	        /**
	         * @const {String} BLOCK_HIGHLIGHTED - adds background
	         */
	        BLOCK_HIGHLIGHTED: 'ce-block--focused',
	
	        /**
	         * @const {String} - highlights covered blocks
	         */
	        BLOCK_IN_FEED_MODE: 'ce-block--feed-mode',
	
	        /**
	         * @const {String} - for all default settings
	         */
	        SETTINGS_ITEM: 'ce-settings__item'
	
	    };
	
	    /**
	     * @protected
	     *
	     * Making main interface
	     */
	    ui.make = function () {
	
	        var wrapper, toolbar, toolbarContent, inlineToolbar, redactor, ceBlock, notifications, blockButtons, blockSettings, showSettingsButton, showTrashButton, toolbox, plusButton;
	
	        /** Make editor wrapper */
	        wrapper = editor.draw.wrapper();
	
	        /** Append editor wrapper after initial textarea */
	        editor.core.insertAfter(editor.nodes.textarea, wrapper);
	
	        /** Append block with notifications to the document */
	        notifications = editor.draw.alertsHolder();
	        editor.nodes.notifications = document.body.appendChild(notifications);
	
	        /** Make toolbar and content-editable redactor */
	        toolbar = editor.draw.toolbar();
	        toolbarContent = editor.draw.toolbarContent();
	        inlineToolbar = editor.draw.inlineToolbar();
	        plusButton = editor.draw.plusButton();
	        showSettingsButton = editor.draw.settingsButton();
	        showTrashButton = editor.toolbar.settings.makeRemoveBlockButton();
	        blockSettings = editor.draw.blockSettings();
	        blockButtons = editor.draw.blockButtons();
	        toolbox = editor.draw.toolbox();
	        redactor = editor.draw.redactor();
	
	        /** settings */
	        var defaultSettings = editor.draw.defaultSettings(),
	            pluginSettings = editor.draw.pluginsSettings();
	
	        /** Add default and plugins settings */
	        blockSettings.appendChild(pluginSettings);
	        blockSettings.appendChild(defaultSettings);
	
	        /** Make blocks buttons
	         * This block contains settings button and remove block button
	         */
	        blockButtons.appendChild(showSettingsButton);
	        blockButtons.appendChild(showTrashButton);
	        blockButtons.appendChild(blockSettings);
	
	        /** Append plus button */
	        toolbarContent.appendChild(plusButton);
	
	        /** Appending toolbar tools */
	        toolbarContent.appendChild(toolbox);
	
	        /** Appending first-level block buttons */
	        toolbar.appendChild(blockButtons);
	
	        /** Append toolbarContent to toolbar */
	        toolbar.appendChild(toolbarContent);
	
	        wrapper.appendChild(toolbar);
	
	        wrapper.appendChild(redactor);
	
	        /** Save created ui-elements to static nodes state */
	        editor.nodes.wrapper = wrapper;
	        editor.nodes.toolbar = toolbar;
	        editor.nodes.plusButton = plusButton;
	        editor.nodes.toolbox = toolbox;
	        editor.nodes.blockSettings = blockSettings;
	        editor.nodes.pluginSettings = pluginSettings;
	        editor.nodes.defaultSettings = defaultSettings;
	        editor.nodes.showSettingsButton = showSettingsButton;
	        editor.nodes.showTrashButton = showTrashButton;
	
	        editor.nodes.redactor = redactor;
	
	        editor.ui.makeInlineToolbar(inlineToolbar);
	
	        /** fill in default settings */
	        editor.toolbar.settings.addDefaultSettings();
	    };
	
	    ui.makeInlineToolbar = function (container) {
	
	        /** Append to redactor new inline block */
	        editor.nodes.inlineToolbar.wrapper = container;
	
	        /** Draw toolbar buttons */
	        editor.nodes.inlineToolbar.buttons = editor.draw.inlineToolbarButtons();
	
	        /** Buttons action or settings */
	        editor.nodes.inlineToolbar.actions = editor.draw.inlineToolbarActions();
	
	        /** Append to inline toolbar buttons as part of it */
	        editor.nodes.inlineToolbar.wrapper.appendChild(editor.nodes.inlineToolbar.buttons);
	        editor.nodes.inlineToolbar.wrapper.appendChild(editor.nodes.inlineToolbar.actions);
	
	        editor.nodes.wrapper.appendChild(editor.nodes.inlineToolbar.wrapper);
	    };
	
	    /**
	     * @private
	     * Append tools passed in editor.tools
	     */
	    ui.addTools = function () {
	
	        var tool, toolName, toolButton;
	
	        for (toolName in editor.settings.tools) {
	
	            tool = editor.settings.tools[toolName];
	
	            editor.tools[toolName] = tool;
	
	            if (!tool.displayInToolbox) {
	
	                continue;
	            }
	
	            if (!tool.iconClassname) {
	
	                editor.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', toolName);
	                continue;
	            }
	
	            if (typeof tool.render != 'function') {
	
	                editor.core.log('render method missed. Tool %o skipped', 'warn', toolName);
	                continue;
	            }
	
	            /**
	             * if tools is for toolbox
	             */
	            toolButton = editor.draw.toolbarButton(toolName, tool.iconClassname);
	
	            editor.nodes.toolbox.appendChild(toolButton);
	
	            /** Save tools to static nodes */
	            editor.nodes.toolbarButtons[toolName] = toolButton;
	        }
	
	        /**
	         * Add inline toolbar tools
	         */
	        editor.ui.addInlineToolbarTools();
	    };
	
	    ui.addInlineToolbarTools = function () {
	
	        var tools = {
	
	            bold: {
	                icon: 'ce-icon-bold',
	                command: 'bold'
	            },
	
	            italic: {
	                icon: 'ce-icon-italic',
	                command: 'italic'
	            },
	
	            underline: {
	                icon: 'ce-icon-underline',
	                command: 'underline'
	            },
	
	            link: {
	                icon: 'ce-icon-link',
	                command: 'createLink'
	            }
	        };
	
	        var toolButton, tool;
	
	        for (var name in tools) {
	
	            tool = tools[name];
	
	            toolButton = editor.draw.toolbarButtonInline(name, tool.icon);
	
	            editor.nodes.inlineToolbar.buttons.appendChild(toolButton);
	            /**
	             * Add callbacks to this buttons
	             */
	            editor.ui.setInlineToolbarButtonBehaviour(toolButton, tool.command);
	        }
	    };
	
	    /**
	     * @private
	     * Bind editor UI events
	     */
	    ui.bindEvents = function () {
	
	        editor.core.log('ui.bindEvents fired', 'info');
	
	        // window.addEventListener('error', function (errorMsg, url, lineNumber) {
	        //     editor.notifications.errorThrown(errorMsg, event);
	        // }, false );
	
	        /** All keydowns on Document */
	        document.addEventListener('keydown', editor.callback.globalKeydown, false);
	
	        /** All keydowns on Redactor zone */
	        editor.nodes.redactor.addEventListener('keydown', editor.callback.redactorKeyDown, false);
	
	        /** All keydowns on Document */
	        document.addEventListener('keyup', editor.callback.globalKeyup, false);
	
	        /**
	         * Mouse click to radactor
	         */
	        editor.nodes.redactor.addEventListener('click', editor.callback.redactorClicked, false);
	
	        /**
	         * Clicks to the Plus button
	         */
	        editor.nodes.plusButton.addEventListener('click', editor.callback.plusButtonClicked, false);
	
	        /**
	         * Clicks to SETTINGS button in toolbar
	         */
	        editor.nodes.showSettingsButton.addEventListener('click', editor.callback.showSettingsButtonClicked, false);
	
	        /**
	         *  @deprecated ( but now in use for syncronization );
	         *  Any redactor changes: keyboard input, mouse cut/paste, drag-n-drop text
	         */
	        editor.nodes.redactor.addEventListener('input', editor.callback.redactorInputEvent, false);
	
	        /** Bind click listeners on toolbar buttons */
	        for (var button in editor.nodes.toolbarButtons) {
	
	            editor.nodes.toolbarButtons[button].addEventListener('click', editor.callback.toolbarButtonClicked, false);
	        }
	    };
	
	    /**
	     * Initialize plugins before using
	     * Ex. Load scripts or call some internal methods
	     * @return Promise
	     */
	    ui.preparePlugins = function () {
	
	        return new Promise(function (resolve, reject) {
	
	            var pluginName = void 0,
	                plugin = void 0;
	
	            for (pluginName in editor.tools) {
	
	                plugin = editor.tools[pluginName];
	
	                if (typeof plugin.prepare != 'function') {
	
	                    continue;
	                }
	
	                plugin.prepare(plugin.config || {}).then(function () {
	
	                    resolve();
	                }).catch(function (error) {
	
	                    reject(error);
	                });
	            }
	        });
	    };
	
	    ui.addBlockHandlers = function (block) {
	
	        if (!block) return;
	
	        /**
	         * Block keydowns
	         */
	        block.addEventListener('keydown', function (event) {
	
	            editor.callback.blockKeydown(event, block);
	        }, false);
	
	        /**
	         * Pasting content from another source
	         * We have two type of sanitization
	         * First - uses deep-first search algorithm to get sub nodes,
	         * sanitizes whole Block_content and replaces cleared nodes
	         * This method is deprecated
	         * Method is used in editor.callback.blockPaste(event)
	         *
	         * Secont - uses Mutation observer.
	         * Observer "observe" DOM changes and send changings to callback.
	         * Callback gets changed node, not whole Block_content.
	         * Inserted or changed node, which we've gotten have been cleared and replaced with diry node
	         *
	         * Method is used in editor.callback.blockPasteViaSanitize(event)
	         *
	         * @uses html-janitor
	         * @example editor.callback.blockPasteViaSanitize(event), the second method.
	         *
	         */
	        block.addEventListener('paste', editor.callback.blockPasteCallback, false);
	
	        block.addEventListener('mouseup', function () {
	
	            editor.toolbar.inline.show();
	        }, false);
	    };
	
	    /** getting all contenteditable elements */
	    ui.saveInputs = function () {
	
	        var redactor = editor.nodes.redactor,
	            elements = [];
	
	        /** Save all inputs in global variable state */
	        editor.state.inputs = redactor.querySelectorAll('[contenteditable], input');
	    };
	
	    /**
	     * Adds first initial block on empty redactor
	     */
	    ui.addInitialBlock = function () {
	
	        var initialBlockType = editor.settings.initialBlockPlugin,
	            initialBlock;
	
	        if (!editor.tools[initialBlockType]) {
	
	            editor.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
	            return;
	        }
	
	        initialBlock = editor.tools[initialBlockType].render();
	
	        initialBlock.setAttribute('data-placeholder', 'Расскажите свою историю...');
	
	        editor.content.insertBlock({
	            type: initialBlockType,
	            block: initialBlock
	        });
	
	        editor.content.workingNodeChanged(initialBlock);
	    };
	
	    ui.setInlineToolbarButtonBehaviour = function (button, type) {
	
	        button.addEventListener('mousedown', function (event) {
	
	            editor.toolbar.inline.toolClicked(event, type);
	        }, false);
	    };
	
	    return ui;
	}({});
	
	module.exports = ui;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 *
	 * Codex.Editor Transport Module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	var editor = codex.editor;
	
	var transport = function (transport) {
	
	    transport.input = null;
	
	    /**
	     * @property {Object} arguments - keep plugin settings and defined callbacks
	     */
	    transport.arguments = null;
	
	    transport.prepare = function () {
	
	        var input = document.createElement('INPUT');
	
	        input.type = 'file';
	        input.addEventListener('change', editor.transport.fileSelected);
	
	        editor.transport.input = input;
	    };
	
	    /** Clear input when files is uploaded */
	    transport.clearInput = function () {
	
	        /** Remove old input */
	        this.input = null;
	
	        /** Prepare new one */
	        this.prepare();
	    };
	
	    /**
	     * Callback for file selection
	     */
	    transport.fileSelected = function (event) {
	
	        var input = this,
	            files = input.files,
	            filesLength = files.length,
	            formdData = new FormData(),
	            file,
	            i;
	
	        formdData.append('files', files[0], files[0].name);
	
	        editor.transport.ajax({
	            data: formdData,
	            beforeSend: editor.transport.arguments.beforeSend,
	            success: editor.transport.arguments.success,
	            error: editor.transport.arguments.error
	        });
	    };
	
	    /**
	     * Use plugin callbacks
	     * @protected
	     */
	    transport.selectAndUpload = function (args) {
	
	        this.arguments = args;
	        this.input.click();
	    };
	
	    /**
	     * Ajax requests module
	     */
	    transport.ajax = function (params) {
	
	        var xhr = new XMLHttpRequest(),
	            beforeSend = typeof params.beforeSend == 'function' ? params.beforeSend : function () {},
	            success = typeof params.success == 'function' ? params.success : function () {},
	            error = typeof params.error == 'function' ? params.error : function () {};
	
	        beforeSend();
	
	        xhr.open('POST', editor.settings.uploadImagesUrl, true);
	
	        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	
	        xhr.onload = function () {
	
	            if (xhr.status === 200) {
	
	                success(xhr.responseText);
	            } else {
	
	                console.log('request error: %o', xhr);
	                error();
	            }
	        };
	
	        xhr.send(params.data);
	        this.clearInput();
	    };
	
	    return transport;
	}({});
	
	module.exports = transport;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Renderer Module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	var editor = codex.editor;
	
	var renderer = function (renderer) {
	
	    /**
	     * Asyncronously parses input JSON to redactor blocks
	     */
	    renderer.makeBlocksFromData = function () {
	
	        /**
	         * If redactor is empty, add first paragraph to start writing
	         */
	        if (!editor.state.blocks.items.length) {
	
	            editor.ui.addInitialBlock();
	            return;
	        }
	
	        Promise.resolve()
	
	        /** First, get JSON from state */
	        .then(function () {
	
	            return editor.state.blocks;
	        })
	
	        /** Then, start to iterate they */
	        .then(editor.renderer.appendBlocks)
	
	        /** Write log if something goes wrong */
	        .catch(function (error) {
	
	            editor.core.log('Error while parsing JSON: %o', 'error', error);
	        });
	    };
	
	    /**
	     * Parses JSON to blocks
	     * @param {object} data
	     * @return Primise -> nodeList
	     */
	    renderer.appendBlocks = function (data) {
	
	        var blocks = data.items;
	
	        /**
	         * Sequence of one-by-one blocks appending
	         * Uses to save blocks order after async-handler
	         */
	        var nodeSequence = Promise.resolve();
	
	        for (var index = 0; index < blocks.length; index++) {
	
	            /** Add node to sequence at specified index */
	            editor.renderer.appendNodeAtIndex(nodeSequence, blocks, index);
	        }
	    };
	
	    /**
	     * Append node at specified index
	     */
	    renderer.appendNodeAtIndex = function (nodeSequence, blocks, index) {
	
	        /** We need to append node to sequence */
	        nodeSequence
	
	        /** first, get node async-aware */
	        .then(function () {
	
	            return editor.renderer.getNodeAsync(blocks, index);
	        })
	
	        /**
	         * second, compose editor-block from JSON object
	         */
	        .then(editor.renderer.createBlockFromData)
	
	        /**
	         * now insert block to redactor
	         */
	        .then(function (blockData) {
	
	            /**
	             * blockData has 'block', 'type' and 'stretched' information
	             */
	            editor.content.insertBlock(blockData);
	
	            /** Pass created block to next step */
	            return blockData.block;
	        })
	
	        /** Log if something wrong with node */
	        .catch(function (error) {
	
	            editor.core.log('Node skipped while parsing because %o', 'error', error);
	        });
	    };
	
	    /**
	     * Asynchronously returns block data from blocksList by index
	     * @return Promise to node
	     */
	    renderer.getNodeAsync = function (blocksList, index) {
	
	        return Promise.resolve().then(function () {
	
	            return blocksList[index];
	        });
	    };
	
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
	    renderer.createBlockFromData = function (blockData) {
	
	        /** New parser */
	        var pluginName = blockData.type,
	            cover = blockData.cover;
	
	        /** Get first key of object that stores plugin name */
	        // for (var pluginName in blockData) break;
	
	        /** Check for plugin existance */
	        if (!editor.tools[pluginName]) {
	
	            throw Error('Plugin \xAB' + pluginName + '\xBB not found');
	        }
	
	        /** Check for plugin having render method */
	        if (typeof editor.tools[pluginName].render != 'function') {
	
	            throw Error('Plugin \xAB' + pluginName + '\xBB must have \xABrender\xBB method');
	        }
	
	        /** New Parser */
	        var block = editor.tools[pluginName].render(blockData.data);
	
	        /** is first-level block stretched */
	        var stretched = editor.tools[pluginName].isStretched || false;
	
	        /** Retrun type and block */
	        return {
	            type: pluginName,
	            block: block,
	            stretched: stretched,
	            cover: cover
	        };
	    };
	
	    return renderer;
	}({});
	
	module.exports = renderer;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Saver
	 *
	 * @author Codex Team
	 * @version 1.0.2
	 */
	
	var editor = codex.editor;
	
	var saver = function (saver) {
	
	    /**
	     * Saves blocks
	     * @private
	     */
	    saver.saveBlocks = function () {
	
	        /** Save html content of redactor to memory */
	        editor.state.html = editor.nodes.redactor.innerHTML;
	
	        /** Empty jsonOutput state */
	        editor.state.jsonOutput = [];
	
	        Promise.resolve().then(function () {
	
	            return editor.nodes.redactor.childNodes;
	        })
	        /** Making a sequence from separate blocks */
	        .then(editor.saver.makeQueue).then(function () {
	            // editor.nodes.textarea.innerHTML = editor.state.html;
	        }).catch(function (error) {
	
	            console.log('Something happend');
	        });
	    };
	
	    saver.makeQueue = function (blocks) {
	
	        var queue = Promise.resolve();
	
	        for (var index = 0; index < blocks.length; index++) {
	
	            /** Add node to sequence at specified index */
	            editor.saver.getBlockData(queue, blocks, index);
	        }
	    };
	
	    /** Gets every block and makes From Data */
	    saver.getBlockData = function (queue, blocks, index) {
	
	        queue.then(function () {
	
	            return editor.saver.getNodeAsync(blocks, index);
	        }).then(editor.saver.makeFormDataFromBlocks);
	    };
	
	    /**
	     * Asynchronously returns block data from blocksList by index
	     * @return Promise to node
	     */
	    saver.getNodeAsync = function (blocksList, index) {
	
	        return Promise.resolve().then(function () {
	
	            return blocksList[index];
	        });
	    };
	
	    saver.makeFormDataFromBlocks = function (block) {
	
	        var pluginName = block.dataset.tool;
	
	        /** Check for plugin existance */
	        if (!editor.tools[pluginName]) {
	
	            throw Error('Plugin \xAB' + pluginName + '\xBB not found');
	        }
	
	        /** Check for plugin having render method */
	        if (typeof editor.tools[pluginName].save != 'function') {
	
	            throw Error('Plugin \xAB' + pluginName + '\xBB must have save method');
	        }
	
	        /** Result saver */
	        var blockContent = block.childNodes[0],
	            pluginsContent = blockContent.childNodes[0],
	            savedData = editor.tools[pluginName].save(pluginsContent),
	            output;
	
	        output = {
	            type: pluginName,
	            data: savedData
	        };
	
	        if (editor.tools[pluginName].validate) {
	
	            var result = editor.tools[pluginName].validate(savedData);
	
	            /**
	             * Do not allow invalid data
	             */
	            if (!result) return;
	        }
	
	        /** Marks Blocks that will be in main page */
	        output.cover = block.classList.contains(editor.ui.className.BLOCK_IN_FEED_MODE);
	
	        editor.state.jsonOutput.push(output);
	    };
	
	    return saver;
	}({});
	
	module.exports = saver;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Content Module
	 * Works with DOM
	 *
	 * @author Codex Team
	 * @version 1.3.11
	 */
	var editor = codex.editor;
	
	var content = function (content) {
	
	    /**
	     * Links to current active block
	     * @type {null | Element}
	     */
	    content.currentNode = null;
	
	    /**
	     * clicked in redactor area
	     * @type {null | Boolean}
	     */
	    content.editorAreaHightlighted = null;
	
	    /**
	     * Synchronizes redactor with original textarea
	     */
	    content.sync = function () {
	
	        editor.core.log('syncing...');
	
	        /**
	         * Save redactor content to editor.state
	         */
	        editor.state.html = editor.nodes.redactor.innerHTML;
	    };
	
	    /**
	     * @deprecated
	     */
	    content.getNodeFocused = function () {
	
	        var selection = window.getSelection(),
	            focused;
	
	        if (selection.anchorNode === null) {
	
	            return null;
	        }
	
	        if (selection.anchorNode.nodeType == editor.core.nodeTypes.TAG) {
	
	            focused = selection.anchorNode;
	        } else {
	
	            focused = selection.focusNode.parentElement;
	        }
	
	        if (!editor.parser.isFirstLevelBlock(focused)) {
	
	            /** Iterate with parent nodes to find first-level*/
	            var parent = focused.parentNode;
	
	            while (parent && !editor.parser.isFirstLevelBlock(parent)) {
	
	                parent = parent.parentNode;
	            }
	
	            focused = parent;
	        }
	
	        if (focused != editor.nodes.redactor) {
	
	            return focused;
	        }
	
	        return null;
	    };
	
	    /**
	     * Appends background to the block
	     */
	    content.markBlock = function () {
	
	        editor.content.currentNode.classList.add(editor.ui.className.BLOCK_HIGHLIGHTED);
	    };
	
	    /**
	     * Clear background
	     */
	    content.clearMark = function () {
	
	        if (editor.content.currentNode) {
	
	            editor.content.currentNode.classList.remove(editor.ui.className.BLOCK_HIGHLIGHTED);
	        }
	    };
	
	    /**
	     * @private
	     *
	     * Finds first-level block
	     * @param {Element} node - selected or clicked in redactors area node
	     */
	    content.getFirstLevelBlock = function (node) {
	
	        if (!editor.core.isDomNode(node)) {
	
	            node = node.parentNode;
	        }
	
	        if (node === editor.nodes.redactor || node === document.body) {
	
	            return null;
	        } else {
	
	            while (!node.classList.contains(editor.ui.className.BLOCK_CLASSNAME)) {
	
	                node = node.parentNode;
	            }
	
	            return node;
	        }
	    };
	
	    /**
	     * Trigger this event when working node changed
	     * @param {Element} targetNode - first-level of this node will be current
	     * If targetNode is first-level then we set it as current else we look for parents to find first-level
	     */
	    content.workingNodeChanged = function (targetNode) {
	
	        /** Clear background from previous marked block before we change */
	        editor.content.clearMark();
	
	        if (!targetNode) {
	
	            return;
	        }
	
	        this.currentNode = this.getFirstLevelBlock(targetNode);
	    };
	
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
	    content.replaceBlock = function function_name(targetBlock, newBlock) {
	
	        if (!targetBlock || !newBlock) {
	
	            editor.core.log('replaceBlock: missed params');
	            return;
	        }
	
	        /** If target-block is not a frist-level block, then we iterate parents to find it */
	        while (!targetBlock.classList.contains(editor.ui.className.BLOCK_CLASSNAME)) {
	
	            targetBlock = targetBlock.parentNode;
	        }
	
	        /**
	         * Check is this block was in feed
	         * If true, than set switched block also covered
	         */
	        if (targetBlock.classList.contains(editor.ui.className.BLOCK_IN_FEED_MODE)) {
	
	            newBlock.classList.add(editor.ui.className.BLOCK_IN_FEED_MODE);
	        }
	
	        /** Replacing */
	        editor.nodes.redactor.replaceChild(newBlock, targetBlock);
	
	        /**
	         * Set new node as current
	         */
	        editor.content.workingNodeChanged(newBlock);
	
	        /**
	         * Add block handlers
	         */
	        editor.ui.addBlockHandlers(newBlock);
	
	        /**
	         * Save changes
	         */
	        editor.ui.saveInputs();
	    };
	
	    /**
	     * @private
	     *
	     * Inserts new block to redactor
	     * Wrapps block into a DIV with BLOCK_CLASSNAME class
	     *
	     * @param blockData          {object}
	     * @param blockData.block    {Element}   element with block content
	     * @param blockData.type     {string}    block plugin
	     * @param needPlaceCaret     {bool}      pass true to set caret in new block
	     *
	     */
	    content.insertBlock = function (blockData, needPlaceCaret) {
	
	        var workingBlock = editor.content.currentNode,
	            newBlockContent = blockData.block,
	            blockType = blockData.type,
	            cover = blockData.cover,
	            isStretched = blockData.stretched;
	
	        var newBlock = editor.content.composeNewBlock(newBlockContent, blockType, isStretched);
	
	        if (cover === true) {
	
	            newBlock.classList.add(editor.ui.className.BLOCK_IN_FEED_MODE);
	        }
	
	        if (workingBlock) {
	
	            editor.core.insertAfter(workingBlock, newBlock);
	        } else {
	
	            /**
	             * If redactor is empty, append as first child
	             */
	            editor.nodes.redactor.appendChild(newBlock);
	        }
	
	        /**
	         * Block handler
	         */
	        editor.ui.addBlockHandlers(newBlock);
	
	        /**
	         * Set new node as current
	         */
	        editor.content.workingNodeChanged(newBlock);
	
	        /**
	         * Save changes
	         */
	        editor.ui.saveInputs();
	
	        if (needPlaceCaret) {
	
	            /**
	             * If we don't know input index then we set default value -1
	             */
	            var currentInputIndex = editor.caret.getCurrentInputIndex() || -1;
	
	            if (currentInputIndex == -1) {
	
	                var editableElement = newBlock.querySelector('[contenteditable]'),
	                    emptyText = document.createTextNode('');
	
	                editableElement.appendChild(emptyText);
	                editor.caret.set(editableElement, 0, 0);
	
	                editor.toolbar.move();
	                editor.toolbar.showPlusButton();
	            } else {
	
	                if (currentInputIndex === editor.state.inputs.length - 1) return;
	
	                /** Timeout for browsers execution */
	                setTimeout(function () {
	
	                    /** Setting to the new input */
	                    editor.caret.setToNextBlock(currentInputIndex);
	                    editor.toolbar.move();
	                    editor.toolbar.open();
	                }, 10);
	            }
	        }
	
	        /**
	         * Block is inserted, wait for new click that defined focusing on editors area
	         * @type {boolean}
	         */
	        content.editorAreaHightlighted = false;
	    };
	
	    /**
	     * Replaces blocks with saving content
	     * @protected
	     * @param {Element} noteToReplace
	     * @param {Element} newNode
	     * @param {Element} blockType
	     */
	    content.switchBlock = function (blockToReplace, newBlock, tool) {
	
	        var newBlockComposed = editor.content.composeNewBlock(newBlock, tool);
	
	        /** Replacing */
	        editor.content.replaceBlock(blockToReplace, newBlockComposed);
	
	        /** Save new Inputs when block is changed */
	        editor.ui.saveInputs();
	    };
	
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
	    content.getDeepestTextNodeFromPosition = function (block, position) {
	
	        /**
	         * Clear Block from empty and useless spaces with trim.
	         * Such nodes we should remove
	         */
	        var blockChilds = block.childNodes,
	            index,
	            node,
	            text;
	
	        for (index = 0; index < blockChilds.length; index++) {
	
	            node = blockChilds[index];
	
	            if (node.nodeType == editor.core.nodeTypes.TEXT) {
	
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
	        if (position < 0) position = 1;
	
	        var looking_from_start = false;
	
	        /** For looking from START */
	        if (position === 0) {
	
	            looking_from_start = true;
	            position = 1;
	        }
	
	        while (position) {
	
	            /** initial verticle of node. */
	            if (looking_from_start) {
	
	                block = block.childNodes[0];
	            } else {
	
	                block = block.childNodes[position - 1];
	            }
	
	            if (block.nodeType == editor.core.nodeTypes.TAG) {
	
	                position = block.childNodes.length;
	            } else if (block.nodeType == editor.core.nodeTypes.TEXT) {
	
	                position = 0;
	            }
	        }
	
	        return block;
	    };
	
	    /**
	     * @private
	     */
	    content.composeNewBlock = function (block, tool, isStretched) {
	
	        var newBlock = editor.draw.node('DIV', editor.ui.className.BLOCK_CLASSNAME, {}),
	            blockContent = editor.draw.node('DIV', editor.ui.className.BLOCK_CONTENT, {});
	
	        blockContent.appendChild(block);
	        newBlock.appendChild(blockContent);
	
	        if (isStretched) {
	
	            blockContent.classList.add(editor.ui.className.BLOCK_STRETCHED);
	        }
	
	        newBlock.dataset.tool = tool;
	        return newBlock;
	    };
	
	    /**
	     * Returns Range object of current selection
	     */
	    content.getRange = function () {
	
	        var selection = window.getSelection().getRangeAt(0);
	
	        return selection;
	    };
	
	    /**
	     * Divides block in two blocks (after and before caret)
	     * @private
	     * @param {Int} inputIndex - target input index
	     */
	    content.splitBlock = function (inputIndex) {
	
	        var selection = window.getSelection(),
	            anchorNode = selection.anchorNode,
	            anchorNodeText = anchorNode.textContent,
	            caretOffset = selection.anchorOffset,
	            textBeforeCaret,
	            textNodeBeforeCaret,
	            textAfterCaret,
	            textNodeAfterCaret;
	
	        var currentBlock = editor.content.currentNode.querySelector('[contentEditable]');
	
	        textBeforeCaret = anchorNodeText.substring(0, caretOffset);
	        textAfterCaret = anchorNodeText.substring(caretOffset);
	
	        textNodeBeforeCaret = document.createTextNode(textBeforeCaret);
	
	        if (textAfterCaret) {
	
	            textNodeAfterCaret = document.createTextNode(textAfterCaret);
	        }
	
	        var previousChilds = [],
	            nextChilds = [],
	            reachedCurrent = false;
	
	        if (textNodeAfterCaret) {
	
	            nextChilds.push(textNodeAfterCaret);
	        }
	
	        for (var i = 0, child; !!(child = currentBlock.childNodes[i]); i++) {
	
	            if (child != anchorNode) {
	
	                if (!reachedCurrent) {
	
	                    previousChilds.push(child);
	                } else {
	
	                    nextChilds.push(child);
	                }
	            } else {
	
	                reachedCurrent = true;
	            }
	        }
	
	        /** Clear current input */
	        editor.state.inputs[inputIndex].innerHTML = '';
	
	        /**
	         * Append all childs founded before anchorNode
	         */
	        var previousChildsLength = previousChilds.length;
	
	        for (i = 0; i < previousChildsLength; i++) {
	
	            editor.state.inputs[inputIndex].appendChild(previousChilds[i]);
	        }
	
	        editor.state.inputs[inputIndex].appendChild(textNodeBeforeCaret);
	
	        /**
	         * Append text node which is after caret
	         */
	        var nextChildsLength = nextChilds.length,
	            newNode = document.createElement('div');
	
	        for (i = 0; i < nextChildsLength; i++) {
	
	            newNode.appendChild(nextChilds[i]);
	        }
	
	        newNode = newNode.innerHTML;
	
	        /** This type of block creates when enter is pressed */
	        var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
	
	        /**
	         * Make new paragraph with text after caret
	         */
	        editor.content.insertBlock({
	            type: NEW_BLOCK_TYPE,
	            block: editor.tools[NEW_BLOCK_TYPE].render({
	                text: newNode
	            })
	        }, true);
	    };
	
	    /**
	     * Merges two blocks — current and target
	     * If target index is not exist, then previous will be as target
	     */
	    content.mergeBlocks = function (currentInputIndex, targetInputIndex) {
	
	        /** If current input index is zero, then prevent method execution */
	        if (currentInputIndex === 0) {
	
	            return;
	        }
	
	        var targetInput,
	            currentInputContent = editor.state.inputs[currentInputIndex].innerHTML;
	
	        if (!targetInputIndex) {
	
	            targetInput = editor.state.inputs[currentInputIndex - 1];
	        } else {
	
	            targetInput = editor.state.inputs[targetInputIndex];
	        }
	
	        targetInput.innerHTML += currentInputContent;
	    };
	
	    /**
	     * @private
	     *
	     * Callback for HTML Mutations
	     * @param {Array} mutation - Mutation Record
	     */
	    content.paste = function (mutation) {
	
	        var workingNode = editor.content.currentNode,
	            tool = workingNode.dataset.tool;
	
	        if (editor.tools[tool].allowedToPaste) {
	
	            editor.content.sanitize.call(this, mutation.target);
	        } else {
	
	            editor.content.pasteTextContent(mutation.addedNodes);
	        }
	    };
	
	    /**
	     * @private
	     *
	     * gets only text/plain content of node
	     * @param {Element} target - HTML node
	     */
	    content.pasteTextContent = function (nodes) {
	
	        var node = nodes[0],
	            textNode;
	
	        if (!node) {
	
	            return;
	        }
	
	        if (node.nodeType == editor.core.nodeTypes.TEXT) {
	
	            textNode = document.createTextNode(node);
	        } else {
	
	            textNode = document.createTextNode(node.textContent);
	        }
	
	        if (editor.core.isDomNode(node)) {
	
	            node.parentNode.replaceChild(textNode, node);
	        }
	    };
	
	    /**
	     * @private
	     *
	     * Sanitizes HTML content
	     * @param {Element} target - inserted element
	     * @uses Sanitize library html-janitor
	     */
	    content.sanitize = function (target) {
	
	        if (!target) {
	
	            return;
	        }
	
	        var node = target[0];
	
	        if (!node) {
	
	            return;
	        }
	
	        /**
	         * Disconnect Observer
	         * hierarchy of function calls inherits context of observer
	         */
	        this.disconnect();
	
	        /**
	         * Don't sanitize text node
	         */
	        if (node.nodeType == editor.core.nodeTypes.TEXT) {
	
	            return;
	        }
	
	        /**
	         * Clear dirty content
	         */
	        var cleaner = editor.sanitizer.init(editor.satinizer.Config.BASIC),
	            clean = cleaner.clean(target.outerHTML);
	
	        var div = editor.draw.node('DIV', [], { innerHTML: clean });
	
	        node.replaceWith(div.childNodes[0]);
	    };
	
	    /**
	     * Iterates all right siblings and parents, which has right siblings
	     * while it does not reached the first-level block
	     *
	     * @param {Element} node
	     * @return {boolean}
	     */
	    content.isLastNode = function (node) {
	
	        // console.log('погнали перебор родителей');
	
	        var allChecked = false;
	
	        while (!allChecked) {
	
	            // console.log('Смотрим на %o', node);
	            // console.log('Проверим, пустые ли соседи справа');
	
	            if (!allSiblingsEmpty_(node)) {
	
	                // console.log('Есть непустые соседи. Узел не последний. Выходим.');
	                return false;
	            }
	
	            node = node.parentNode;
	
	            /**
	             * Проверяем родителей до тех пор, пока не найдем блок первого уровня
	             */
	            if (node.classList.contains(editor.ui.className.BLOCK_CONTENT)) {
	
	                allChecked = true;
	            }
	        }
	
	        return true;
	    };
	
	    /**
	     * Checks if all element right siblings is empty
	     * @param node
	     */
	    var allSiblingsEmpty_ = function allSiblingsEmpty_(node) {
	
	        /**
	         * Нужно убедиться, что после пустого соседа ничего нет
	         */
	        var sibling = node.nextSibling;
	
	        while (sibling) {
	
	            if (sibling.textContent.length) {
	
	                return false;
	            }
	
	            sibling = sibling.nextSibling;
	        }
	
	        return true;
	    };
	
	    /**
	     * @public
	     *
	     * @param [String] htmlString - html content as string
	     * @return {string} - html content as string
	     */
	    content.wrapTextWithParagraphs = function (htmlString) {
	
	        var wrapper = document.createElement('DIV'),
	            newWrapper = document.createElement('DIV'),
	            i,
	            paragraph,
	            firstLevelBlocks = ['DIV', 'P'],
	            blockTyped,
	            node;
	
	        /**
	         * Make HTML Element to Wrap Text
	         * It allows us to work with input data as HTML content
	         */
	        wrapper.innerHTML = htmlString;
	        paragraph = document.createElement('P');
	
	        for (i = 0; i < wrapper.childNodes.length; i++) {
	
	            node = wrapper.childNodes[i];
	
	            blockTyped = firstLevelBlocks.indexOf(node.tagName) != -1;
	
	            /**
	             * If node is first-levet
	             * we add this node to our new wrapper
	             */
	            if (blockTyped) {
	
	                /**
	                 * If we had splitted inline nodes to paragraph before
	                 */
	                if (paragraph.childNodes.length) {
	
	                    newWrapper.appendChild(paragraph.cloneNode(true));
	
	                    /** empty paragraph */
	                    paragraph = null;
	                    paragraph = document.createElement('P');
	                }
	
	                newWrapper.appendChild(node.cloneNode(true));
	            } else {
	
	                /** Collect all inline nodes to one as paragraph */
	                paragraph.appendChild(node.cloneNode(true));
	
	                /** if node is last we should append this node to paragraph and paragraph to new wrapper */
	                if (i == wrapper.childNodes.length - 1) {
	
	                    newWrapper.appendChild(paragraph.cloneNode(true));
	                }
	            }
	        }
	
	        return newWrapper.innerHTML;
	    };
	
	    return content;
	}({});
	
	module.exports = content;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Codex Editor toolbar module
	 *
	 * Contains:
	 *  - Inline toolbox
	 *  - Toolbox within plus button
	 *  - Settings section
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	var editor = codex.editor;
	
	var toolbar = function (toolbar) {
	
	    toolbar.init = function () {
	
	        toolbar.settings = __webpack_require__(8);
	        toolbar.inline = __webpack_require__(9);
	        toolbar.toolbox = __webpack_require__(10);
	    };
	
	    /**
	     * Margin between focused node and toolbar
	     */
	    toolbar.defaultToolbarHeight = 49;
	
	    toolbar.defaultOffset = 34;
	
	    toolbar.opened = false;
	
	    toolbar.current = null;
	
	    /**
	     * @protected
	     */
	    toolbar.open = function () {
	
	        editor.nodes.toolbar.classList.add('opened');
	        this.opened = true;
	    };
	
	    /**
	     * @protected
	     */
	    toolbar.close = function () {
	
	        editor.nodes.toolbar.classList.remove('opened');
	
	        toolbar.opened = false;
	        toolbar.current = null;
	
	        for (var button in editor.nodes.toolbarButtons) {
	
	            editor.nodes.toolbarButtons[button].classList.remove('selected');
	        }
	
	        /** Close toolbox when toolbar is not displayed */
	        editor.toolbar.toolbox.close();
	        editor.toolbar.settings.close();
	    };
	
	    toolbar.toggle = function () {
	
	        if (!this.opened) {
	
	            this.open();
	        } else {
	
	            this.close();
	        }
	    };
	
	    toolbar.hidePlusButton = function () {
	
	        editor.nodes.plusButton.classList.add('hide');
	    };
	
	    toolbar.showPlusButton = function () {
	
	        editor.nodes.plusButton.classList.remove('hide');
	    };
	
	    /**
	     * Moving toolbar to the specified node
	     */
	    toolbar.move = function () {
	
	        /** Close Toolbox when we move toolbar */
	        editor.toolbar.toolbox.close();
	
	        if (!editor.content.currentNode) {
	
	            return;
	        }
	
	        var toolbarHeight = editor.nodes.toolbar.clientHeight || editor.toolbar.defaultToolbarHeight,
	            newYCoordinate = editor.content.currentNode.offsetTop - editor.toolbar.defaultToolbarHeight / 2 + editor.toolbar.defaultOffset;
	
	        editor.nodes.toolbar.style.transform = 'translate3D(0, ' + Math.floor(newYCoordinate) + 'px, 0)';
	
	        /** Close trash actions */
	        editor.toolbar.settings.hideRemoveActions();
	    };
	
	    return toolbar;
	}({});
	
	toolbar.init();
	
	module.exports = toolbar;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Toolbar settings
	 *
	 * @version 1.0.4
	 */
	
	var editor = codex.editor;
	
	var settings = function (settings) {
	
	    settings.init = function () {
	        __webpack_require__(6);
	    };
	
	    settings.opened = false;
	
	    settings.setting = null;
	    settings.actions = null;
	
	    settings.cover = null;
	
	    /**
	     * Append and open settings
	     */
	    settings.open = function (toolType) {
	
	        /**
	         * Append settings content
	         * It's stored in tool.settings
	         */
	        if (!editor.tools[toolType] || !editor.tools[toolType].makeSettings) {
	
	            editor.core.log('Plugin \xAB' + toolType + '\xBB has no settings', 'warn');
	            // editor.nodes.pluginSettings.innerHTML = `Плагин «${toolType}» не имеет настроек`;
	        } else {
	
	            /**
	             * Draw settings block
	             */
	            var settingsBlock = editor.tools[toolType].makeSettings();
	            editor.nodes.pluginSettings.appendChild(settingsBlock);
	        }
	
	        var currentBlock = editor.content.currentNode;
	
	        /** Open settings block */
	        editor.nodes.blockSettings.classList.add('opened');
	        editor.toolbar.settings.addDefaultSettings();
	        this.opened = true;
	    };
	
	    /**
	     * Close and clear settings
	     */
	    settings.close = function () {
	
	        editor.nodes.blockSettings.classList.remove('opened');
	        editor.nodes.pluginSettings.innerHTML = '';
	
	        this.opened = false;
	    };
	
	    /**
	     * @param {string} toolType - plugin type
	     */
	    settings.toggle = function (toolType) {
	
	        if (!this.opened) {
	
	            this.open(toolType);
	        } else {
	
	            this.close();
	        }
	    };
	
	    /**
	     * This function adds default core settings
	     */
	    settings.addDefaultSettings = function () {
	
	        /** list of default settings */
	        var feedModeToggler;
	
	        /** Clear block and append initialized settings */
	        editor.nodes.defaultSettings.innerHTML = '';
	
	        /** Init all default setting buttons */
	        feedModeToggler = editor.toolbar.settings.makeFeedModeToggler();
	
	        /**
	         * Fill defaultSettings
	         */
	
	        /**
	         * Button that enables/disables Feed-mode
	         * Feed-mode means that block will be showed in articles-feed like cover
	         */
	        editor.nodes.defaultSettings.appendChild(feedModeToggler);
	    };
	
	    /**
	     * Cover setting.
	     * This tune highlights block, so that it may be used for showing target block on main page
	     * Draw different setting when block is marked for main page
	     * If TRUE, then we show button that removes this selection
	     * Also defined setting "Click" events will be listened and have separate callbacks
	     *
	     * @return {Element} node/button that we place in default settings block
	     */
	    settings.makeFeedModeToggler = function () {
	
	        var isFeedModeActivated = editor.toolbar.settings.isFeedModeActivated(),
	            setting,
	            data;
	
	        if (!isFeedModeActivated) {
	
	            data = {
	                innerHTML: '<i class="ce-icon-newspaper"></i>Вывести в ленте'
	            };
	        } else {
	
	            data = {
	                innerHTML: '<i class="ce-icon-newspaper"></i>Не выводить в ленте'
	            };
	        }
	
	        setting = editor.draw.node('DIV', editor.ui.className.SETTINGS_ITEM, data);
	        setting.addEventListener('click', editor.toolbar.settings.updateFeedMode, false);
	
	        return setting;
	    };
	
	    /**
	     * Updates Feed-mode
	     */
	    settings.updateFeedMode = function () {
	
	        var currentNode = editor.content.currentNode;
	
	        currentNode.classList.toggle(editor.ui.className.BLOCK_IN_FEED_MODE);
	
	        editor.toolbar.settings.close();
	    };
	
	    settings.isFeedModeActivated = function () {
	
	        var currentBlock = editor.content.currentNode;
	
	        if (currentBlock) {
	            return currentBlock.classList.contains(editor.ui.className.BLOCK_IN_FEED_MODE);
	        } else {
	            return false;
	        }
	    };
	
	    /**
	     * Here we will draw buttons and add listeners to components
	     */
	    settings.makeRemoveBlockButton = function () {
	
	        var removeBlockWrapper = editor.draw.node('SPAN', 'ce-toolbar__remove-btn', {}),
	            settingButton = editor.draw.node('SPAN', 'ce-toolbar__remove-setting', { innerHTML: '<i class="ce-icon-trash"></i>' }),
	            actionWrapper = editor.draw.node('DIV', 'ce-toolbar__remove-confirmation', {}),
	            confirmAction = editor.draw.node('DIV', 'ce-toolbar__remove-confirm', { textContent: 'Удалить блок' }),
	            cancelAction = editor.draw.node('DIV', 'ce-toolbar__remove-cancel', { textContent: 'Отмена' });
	
	        settingButton.addEventListener('click', editor.toolbar.settings.removeButtonClicked, false);
	
	        confirmAction.addEventListener('click', editor.toolbar.settings.confirmRemovingRequest, false);
	
	        cancelAction.addEventListener('click', editor.toolbar.settings.cancelRemovingRequest, false);
	
	        actionWrapper.appendChild(confirmAction);
	        actionWrapper.appendChild(cancelAction);
	
	        removeBlockWrapper.appendChild(settingButton);
	        removeBlockWrapper.appendChild(actionWrapper);
	
	        /** Save setting */
	        editor.toolbar.settings.setting = settingButton;
	        editor.toolbar.settings.actions = actionWrapper;
	
	        return removeBlockWrapper;
	    };
	
	    settings.removeButtonClicked = function () {
	
	        var action = editor.toolbar.settings.actions;
	
	        if (action.classList.contains('opened')) {
	            editor.toolbar.settings.hideRemoveActions();
	        } else {
	            editor.toolbar.settings.showRemoveActions();
	        }
	
	        editor.toolbar.toolbox.close();
	        editor.toolbar.settings.close();
	    };
	
	    settings.cancelRemovingRequest = function () {
	
	        editor.toolbar.settings.actions.classList.remove('opened');
	    };
	
	    settings.confirmRemovingRequest = function () {
	
	        var currentBlock = editor.content.currentNode,
	            firstLevelBlocksCount;
	
	        currentBlock.remove();
	
	        firstLevelBlocksCount = editor.nodes.redactor.childNodes.length;
	
	        /**
	         * If all blocks are removed
	         */
	        if (firstLevelBlocksCount === 0) {
	
	            /** update currentNode variable */
	            editor.content.currentNode = null;
	
	            /** Inserting new empty initial block */
	            editor.ui.addInitialBlock();
	        }
	
	        editor.ui.saveInputs();
	
	        editor.toolbar.close();
	    };
	
	    settings.showRemoveActions = function () {
	        editor.toolbar.settings.actions.classList.add('opened');
	    };
	
	    settings.hideRemoveActions = function () {
	        editor.toolbar.settings.actions.classList.remove('opened');
	    };
	
	    return settings;
	}({});
	
	settings.init();
	
	module.exports = settings;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Inline toolbar
	 *
	 * Contains from tools:
	 * Bold, Italic, Underline and Anchor
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	var editor = codex.editor;
	
	module.exports = function (inline) {
	
	    inline.buttonsOpened = null;
	    inline.actionsOpened = null;
	    inline.wrappersOffset = null;
	
	    /**
	     * saving selection that need for execCommand for styling
	     *
	     */
	    inline.storedSelection = null;
	
	    /**
	     * @protected
	     *
	     * Open inline toobar
	     */
	    inline.show = function () {
	
	        var currentNode = editor.content.currentNode,
	            tool = currentNode.dataset.tool,
	            plugin;
	
	        /**
	         * tool allowed to open inline toolbar
	         */
	        plugin = editor.tools[tool];
	
	        if (!plugin.showInlineToolbar) return;
	
	        var selectedText = this.getSelectionText(),
	            toolbar = editor.nodes.inlineToolbar.wrapper,
	            buttons = editor.nodes.inlineToolbar.buttons;
	
	        if (selectedText.length > 0) {
	
	            /** Move toolbar and open */
	            editor.toolbar.inline.move();
	
	            /** Open inline toolbar */
	            toolbar.classList.add('opened');
	
	            /** show buttons of inline toolbar */
	            editor.toolbar.inline.showButtons();
	        }
	    };
	
	    /**
	     * @protected
	     *
	     * Closes inline toolbar
	     */
	    inline.close = function () {
	
	        var toolbar = editor.nodes.inlineToolbar.wrapper;
	
	        toolbar.classList.remove('opened');
	    };
	
	    /**
	     * @private
	     *
	     * Moving toolbar
	     */
	    inline.move = function () {
	
	        if (!this.wrappersOffset) {
	
	            this.wrappersOffset = this.getWrappersOffset();
	        }
	
	        var coords = this.getSelectionCoords(),
	            defaultOffset = 0,
	            toolbar = editor.nodes.inlineToolbar.wrapper,
	            newCoordinateX,
	            newCoordinateY;
	
	        if (toolbar.offsetHeight === 0) {
	
	            defaultOffset = 40;
	        }
	
	        newCoordinateX = coords.x - this.wrappersOffset.left;
	        newCoordinateY = coords.y + window.scrollY - this.wrappersOffset.top - defaultOffset - toolbar.offsetHeight;
	
	        toolbar.style.transform = 'translate3D(' + Math.floor(newCoordinateX) + 'px, ' + Math.floor(newCoordinateY) + 'px, 0)';
	
	        /** Close everything */
	        editor.toolbar.inline.closeButtons();
	        editor.toolbar.inline.closeAction();
	    };
	
	    /**
	     * @private
	     *
	     * Tool Clicked
	     */
	
	    inline.toolClicked = function (event, type) {
	
	        /**
	         * For simple tools we use default browser function
	         * For more complicated tools, we should write our own behavior
	         */
	        switch (type) {
	            case 'createLink':
	                editor.toolbar.inline.createLinkAction(event, type);break;
	            default:
	                editor.toolbar.inline.defaultToolAction(type);break;
	        }
	
	        /**
	         * highlight buttons
	         * after making some action
	         */
	        editor.nodes.inlineToolbar.buttons.childNodes.forEach(editor.toolbar.inline.hightlight);
	    };
	
	    /**
	     * @private
	     *
	     * Saving wrappers offset in DOM
	     */
	    inline.getWrappersOffset = function () {
	
	        var wrapper = editor.nodes.wrapper,
	            offset = this.getOffset(wrapper);
	
	        this.wrappersOffset = offset;
	        return offset;
	    };
	
	    /**
	     * @private
	     *
	     * Calculates offset of DOM element
	     *
	     * @param el
	     * @returns {{top: number, left: number}}
	     */
	    inline.getOffset = function (el) {
	
	        var _x = 0;
	        var _y = 0;
	
	        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
	
	            _x += el.offsetLeft + el.clientLeft;
	            _y += el.offsetTop + el.clientTop;
	            el = el.offsetParent;
	        }
	        return { top: _y, left: _x };
	    };
	
	    /**
	     * @private
	     *
	     * Calculates position of selected text
	     * @returns {{x: number, y: number}}
	     */
	    inline.getSelectionCoords = function () {
	
	        var sel = document.selection,
	            range;
	        var x = 0,
	            y = 0;
	
	        if (sel) {
	
	            if (sel.type != 'Control') {
	
	                range = sel.createRange();
	                range.collapse(true);
	                x = range.boundingLeft;
	                y = range.boundingTop;
	            }
	        } else if (window.getSelection) {
	
	            sel = window.getSelection();
	
	            if (sel.rangeCount) {
	
	                range = sel.getRangeAt(0).cloneRange();
	                if (range.getClientRects) {
	
	                    range.collapse(true);
	                    var rect = range.getClientRects()[0];
	
	                    if (!rect) {
	
	                        return;
	                    }
	
	                    x = rect.left;
	                    y = rect.top;
	                }
	            }
	        }
	        return { x: x, y: y };
	    };
	
	    /**
	     * @private
	     *
	     * Returns selected text as String
	     * @returns {string}
	     */
	    inline.getSelectionText = function getSelectionText() {
	
	        var selectedText = '';
	
	        // all modern browsers and IE9+
	        if (window.getSelection) {
	
	            selectedText = window.getSelection().toString();
	        }
	
	        return selectedText;
	    };
	
	    /** Opens buttons block */
	    inline.showButtons = function () {
	
	        var buttons = editor.nodes.inlineToolbar.buttons;
	
	        buttons.classList.add('opened');
	
	        editor.toolbar.inline.buttonsOpened = true;
	
	        /** highlight buttons */
	        editor.nodes.inlineToolbar.buttons.childNodes.forEach(editor.toolbar.inline.hightlight);
	    };
	
	    /** Makes buttons disappear */
	    inline.closeButtons = function () {
	
	        var buttons = editor.nodes.inlineToolbar.buttons;
	
	        buttons.classList.remove('opened');
	
	        editor.toolbar.inline.buttonsOpened = false;
	    };
	
	    /** Open buttons defined action if exist */
	    inline.showActions = function () {
	
	        var action = editor.nodes.inlineToolbar.actions;
	
	        action.classList.add('opened');
	
	        editor.toolbar.inline.actionsOpened = true;
	    };
	
	    /** Close actions block */
	    inline.closeAction = function () {
	
	        var action = editor.nodes.inlineToolbar.actions;
	
	        action.innerHTML = '';
	        action.classList.remove('opened');
	        editor.toolbar.inline.actionsOpened = false;
	    };
	
	    /** Action for link creation or for setting anchor */
	    inline.createLinkAction = function (event, type) {
	
	        var isActive = this.isLinkActive();
	
	        var editable = editor.content.currentNode,
	            storedSelection = editor.toolbar.inline.storedSelection;
	
	        if (isActive) {
	
	            var selection = window.getSelection(),
	                anchorNode = selection.anchorNode;
	
	            storedSelection = editor.toolbar.inline.saveSelection(editable);
	
	            /**
	             * Changing stored selection. if we want to remove anchor from word
	             * we should remove anchor from whole word, not only selected part.
	             * The solution is than we get the length of current link
	             * Change start position to - end of selection minus length of anchor
	             */
	            editor.toolbar.inline.restoreSelection(editable, storedSelection);
	
	            editor.toolbar.inline.defaultToolAction('unlink');
	        } else {
	
	            /** Create input and close buttons */
	            var action = editor.draw.inputForLink();
	
	            editor.nodes.inlineToolbar.actions.appendChild(action);
	
	            editor.toolbar.inline.closeButtons();
	            editor.toolbar.inline.showActions();
	
	            storedSelection = editor.toolbar.inline.saveSelection(editable);
	
	            /**
	             * focus to input
	             * Solution: https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/focus
	             * Prevents event after showing input and when we need to focus an input which is in unexisted form
	             */
	            action.focus();
	            event.preventDefault();
	
	            /** Callback to link action */
	            action.addEventListener('keydown', function (event) {
	
	                if (event.keyCode == editor.core.keys.ENTER) {
	
	                    editor.toolbar.inline.restoreSelection(editable, storedSelection);
	                    editor.toolbar.inline.setAnchor(action.value);
	
	                    /**
	                     * Preventing events that will be able to happen
	                     */
	                    event.preventDefault();
	                    event.stopImmediatePropagation();
	
	                    editor.toolbar.inline.clearRange();
	                }
	            }, false);
	        }
	    };
	
	    inline.isLinkActive = function () {
	
	        var isActive = false;
	
	        editor.nodes.inlineToolbar.buttons.childNodes.forEach(function (tool) {
	
	            var dataType = tool.dataset.type;
	
	            if (dataType == 'link' && tool.classList.contains('hightlighted')) {
	
	                isActive = true;
	            }
	        });
	
	        return isActive;
	    };
	
	    /** default action behavior of tool */
	    inline.defaultToolAction = function (type) {
	
	        document.execCommand(type, false, null);
	    };
	
	    /**
	     * @private
	     *
	     * Sets URL
	     *
	     * @param {String} url - URL
	     */
	    inline.setAnchor = function (url) {
	
	        document.execCommand('createLink', false, url);
	
	        /** Close after URL inserting */
	        editor.toolbar.inline.closeAction();
	    };
	
	    /**
	     * @private
	     *
	     * Saves selection
	     */
	    inline.saveSelection = function (containerEl) {
	
	        var range = window.getSelection().getRangeAt(0),
	            preSelectionRange = range.cloneRange(),
	            start;
	
	        preSelectionRange.selectNodeContents(containerEl);
	        preSelectionRange.setEnd(range.startContainer, range.startOffset);
	
	        start = preSelectionRange.toString().length;
	
	        return {
	            start: start,
	            end: start + range.toString().length
	        };
	    };
	
	    /**
	     * @private
	     *
	     * Sets to previous selection (Range)
	     *
	     * @param {Element} containerEl - editable element where we restore range
	     * @param {Object} savedSel - range basic information to restore
	     */
	    inline.restoreSelection = function (containerEl, savedSel) {
	
	        var range = document.createRange(),
	            charIndex = 0;
	
	        range.setStart(containerEl, 0);
	        range.collapse(true);
	
	        var nodeStack = [containerEl],
	            node,
	            foundStart = false,
	            stop = false,
	            nextCharIndex;
	
	        while (!stop && (node = nodeStack.pop())) {
	
	            if (node.nodeType == 3) {
	
	                nextCharIndex = charIndex + node.length;
	
	                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
	
	                    range.setStart(node, savedSel.start - charIndex);
	                    foundStart = true;
	                }
	                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
	
	                    range.setEnd(node, savedSel.end - charIndex);
	                    stop = true;
	                }
	                charIndex = nextCharIndex;
	            } else {
	
	                var i = node.childNodes.length;
	
	                while (i--) {
	
	                    nodeStack.push(node.childNodes[i]);
	                }
	            }
	        }
	
	        var sel = window.getSelection();
	
	        sel.removeAllRanges();
	        sel.addRange(range);
	    };
	
	    /**
	     * @private
	     *
	     * Removes all ranges from window selection
	     */
	    inline.clearRange = function () {
	
	        var selection = window.getSelection();
	
	        selection.removeAllRanges();
	    };
	
	    /**
	     * @private
	     *
	     * sets or removes hightlight
	     */
	    inline.hightlight = function (tool) {
	
	        var dataType = tool.dataset.type;
	
	        if (document.queryCommandState(dataType)) {
	
	            editor.toolbar.inline.setButtonHighlighted(tool);
	        } else {
	
	            editor.toolbar.inline.removeButtonsHighLight(tool);
	        }
	
	        /**
	         *
	         * hightlight for anchors
	         */
	        var selection = window.getSelection(),
	            tag = selection.anchorNode.parentNode;
	
	        if (tag.tagName == 'A' && dataType == 'link') {
	
	            editor.toolbar.inline.setButtonHighlighted(tool);
	        }
	    };
	
	    /**
	     * @private
	     *
	     * Mark button if text is already executed
	     */
	    inline.setButtonHighlighted = function (button) {
	
	        button.classList.add('hightlighted');
	
	        /** At link tool we also change icon */
	        if (button.dataset.type == 'link') {
	
	            var icon = button.childNodes[0];
	
	            icon.classList.remove('ce-icon-link');
	            icon.classList.add('ce-icon-unlink');
	        }
	    };
	
	    /**
	     * @private
	     *
	     * Removes hightlight
	     */
	    inline.removeButtonsHighLight = function (button) {
	
	        button.classList.remove('hightlighted');
	
	        /** At link tool we also change icon */
	        if (button.dataset.type == 'link') {
	
	            var icon = button.childNodes[0];
	
	            icon.classList.remove('ce-icon-unlink');
	            icon.classList.add('ce-icon-link');
	        }
	    };
	
	    return inline;
	}({});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Codex Editor toolbox
	 *
	 * All tools be able to appended here
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	var editor = codex.editor;
	
	var toolbox = function (toolbox) {
	
	    toolbox.init = function () {
	
	        __webpack_require__(7);
	    };
	
	    toolbox.opened = false;
	
	    /** Shows toolbox */
	    toolbox.open = function () {
	
	        /** Close setting if toolbox is opened */
	        if (editor.toolbar.settings.opened) {
	
	            editor.toolbar.settings.close();
	        }
	
	        /** display toolbox */
	        editor.nodes.toolbox.classList.add('opened');
	
	        /** Animate plus button */
	        editor.nodes.plusButton.classList.add('clicked');
	
	        /** toolbox state */
	        editor.toolbar.toolbox.opened = true;
	    };
	
	    /** Closes toolbox */
	    toolbox.close = function () {
	
	        /** Makes toolbox disapear */
	        editor.nodes.toolbox.classList.remove('opened');
	
	        /** Rotate plus button */
	        editor.nodes.plusButton.classList.remove('clicked');
	
	        /** toolbox state */
	        editor.toolbar.toolbox.opened = false;
	    };
	
	    toolbox.leaf = function () {
	
	        var currentTool = editor.toolbar.current,
	            tools = Object.keys(editor.tools),
	            barButtons = editor.nodes.toolbarButtons,
	            nextToolIndex,
	            hiddenToolsAmount = 0,
	            toolToSelect;
	
	        /** Count toolbox hidden tools */
	        for (var tool in editor.tools) {
	
	            if (!editor.tools[tool].displayInToolbox) {
	
	                hiddenToolsAmount++;
	            }
	        }
	
	        if (!currentTool) {
	
	            /** Get first tool from object*/
	            for (toolToSelect in barButtons) {
	                break;
	            }
	        } else {
	
	            nextToolIndex = tools.indexOf(currentTool) + 1;
	
	            var toolIsLastInToolbox = nextToolIndex == tools.length - (hiddenToolsAmount - 2);
	
	            if (toolIsLastInToolbox) {
	
	                nextToolIndex = 0;
	
	                /** getting first displayed tool */
	                for (var tool in editor.tools) {
	
	                    if (editor.tools[tool].displayInToolbox) {
	
	                        break;
	                    }
	
	                    nextToolIndex++;
	                }
	            }
	
	            toolToSelect = tools[nextToolIndex];
	        }
	
	        for (var button in barButtons) {
	            barButtons[button].classList.remove('selected');
	        }barButtons[toolToSelect].classList.add('selected');
	        editor.toolbar.current = toolToSelect;
	    };
	
	    /**
	     * Transforming selected node type into selected toolbar element type
	     * @param {event} event
	     */
	    toolbox.toolClicked = function () {
	
	        /**
	         * UNREPLACEBLE_TOOLS this types of tools are forbidden to replace even they are empty
	         */
	        var UNREPLACEBLE_TOOLS = ['image', 'link', 'list', 'instagram', 'twitter', 'embed'],
	            tool = editor.tools[editor.toolbar.current],
	            workingNode = editor.content.currentNode,
	            currentInputIndex = editor.caret.inputIndex,
	            newBlockContent,
	            appendCallback,
	            blockData;
	
	        /** Make block from plugin */
	        newBlockContent = tool.render();
	
	        /** information about block */
	        blockData = {
	            block: newBlockContent,
	            type: tool.type,
	            stretched: false
	        };
	
	        if (workingNode && UNREPLACEBLE_TOOLS.indexOf(workingNode.dataset.tool) === -1 && workingNode.textContent.trim() === '') {
	
	            /** Replace current block */
	            editor.content.switchBlock(workingNode, newBlockContent, tool.type);
	        } else {
	
	            /** Insert new Block from plugin */
	            editor.content.insertBlock(blockData);
	
	            /** increase input index */
	            currentInputIndex++;
	        }
	
	        /** Fire tool append callback  */
	        appendCallback = tool.appendCallback;
	
	        if (appendCallback && typeof appendCallback == 'function') {
	
	            appendCallback.call(event);
	        }
	
	        setTimeout(function () {
	
	            /** Set caret to current block */
	            editor.caret.setToBlock(currentInputIndex);
	        }, 10);
	
	        /**
	         * Changing current Node
	         */
	        editor.content.workingNodeChanged();
	
	        /**
	         * Move toolbar when node is changed
	         */
	        editor.toolbar.move();
	    };
	
	    return toolbox;
	}({});
	
	toolbox.init();
	
	module.exports = toolbox;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor callbacks module
	 *
	 * @author Codex Team
	 * @version 1.3.5
	 */
	var editor = codex.editor;
	
	var callbacks = function (callbacks) {
	
	    callbacks.redactorSyncTimeout = null;
	
	    callbacks.globalKeydown = function (event) {
	
	        switch (event.keyCode) {
	            case editor.core.keys.ENTER:
	                editor.callback.enterKeyPressed(event);break;
	        }
	    };
	
	    callbacks.redactorKeyDown = function (event) {
	
	        switch (event.keyCode) {
	            case editor.core.keys.TAB:
	                editor.callback.tabKeyPressed(event);break;
	            case editor.core.keys.ENTER:
	                editor.callback.enterKeyPressedOnRedactorZone(event);break;
	            case editor.core.keys.ESC:
	                editor.callback.escapeKeyPressed(event);break;
	            default:
	                editor.callback.defaultKeyPressed(event);break;
	        }
	    };
	
	    callbacks.globalKeyup = function (event) {
	
	        switch (event.keyCode) {
	            case editor.core.keys.UP:
	            case editor.core.keys.LEFT:
	            case editor.core.keys.RIGHT:
	            case editor.core.keys.DOWN:
	                editor.callback.arrowKeyPressed(event);break;
	        }
	    };
	
	    callbacks.tabKeyPressed = function (event) {
	
	        if (!editor.toolbar.opened) {
	
	            editor.toolbar.open();
	        }
	
	        if (editor.toolbar.opened && !editor.toolbar.toolbox.opened) {
	
	            editor.toolbar.toolbox.open();
	        } else {
	
	            editor.toolbar.toolbox.leaf();
	        }
	
	        event.preventDefault();
	    };
	
	    callbacks.enterKeyPressed = function (event) {
	
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
	
	        var currentInputIndex = editor.caret.getCurrentInputIndex() || 0,
	            workingNode = editor.content.currentNode,
	            tool = workingNode.dataset.tool,
	            isEnterPressedOnToolbar = editor.toolbar.opened && editor.toolbar.current && event.target == editor.state.inputs[currentInputIndex];
	
	        /** The list of tools which needs the default browser behaviour */
	        var enableLineBreaks = editor.tools[tool].enableLineBreaks;
	
	        /** This type of block creates when enter is pressed */
	        var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
	
	        /**
	         * When toolbar is opened, select tool instead of making new paragraph
	         */
	        if (isEnterPressedOnToolbar) {
	
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
	        if (event.shiftKey || enableLineBreaks) {
	
	            event.stopPropagation();
	            event.stopImmediatePropagation();
	            return;
	        }
	
	        var isLastTextNode = false,
	            currentSelection = window.getSelection(),
	            currentSelectedNode = currentSelection.anchorNode,
	            caretAtTheEndOfText = editor.caret.position.atTheEnd(),
	            isTextNodeHasParentBetweenContenteditable = false;
	
	        /**
	         * Allow making new <p> in same block by SHIFT+ENTER and forbids to prevent default browser behaviour
	         */
	        if (event.shiftKey && !enableLineBreaks) {
	
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
	        if (currentSelectedNode.nodeType == editor.core.nodeTypes.TEXT && !isTextNodeHasParentBetweenContenteditable && !caretAtTheEndOfText) {
	
	            event.preventDefault();
	
	            editor.core.log('Splitting Text node...');
	
	            editor.content.splitBlock(currentInputIndex);
	
	            /** Show plus button when next input after split is empty*/
	            if (!editor.state.inputs[currentInputIndex + 1].textContent.trim()) {
	
	                editor.toolbar.showPlusButton();
	            }
	        } else {
	
	            var islastNode = editor.content.isLastNode(currentSelectedNode);
	
	            if (islastNode && caretAtTheEndOfText) {
	
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
	
	    callbacks.arrowKeyPressed = function (event) {
	
	        editor.content.workingNodeChanged();
	
	        /* Closing toolbar */
	        editor.toolbar.close();
	        editor.toolbar.move();
	    };
	
	    callbacks.defaultKeyPressed = function (event) {
	
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
	
	        var selectedText = editor.toolbar.inline.getSelectionText();
	
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
	
	                /** getting firstlevel parent of input */
	                var firstLevelBlock = editor.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);
	            }
	
	            /** If input is empty, then we set caret to the last input */
	            if (editor.state.inputs.length && editor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == editor.settings.initialBlockPlugin) {
	
	                editor.caret.setToBlock(indexOfLastInput);
	            } else {
	
	                /** Create new input when caret clicked in redactors area */
	                var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
	
	                editor.content.insertBlock({
	                    type: NEW_BLOCK_TYPE,
	                    block: editor.tools[NEW_BLOCK_TYPE].render()
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
	
	        if (isInitialType && inputIsEmpty) {
	
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
	
	        var selection = window.getSelection(),
	            anchorNode = selection.anchorNode,
	            flag = false;
	
	        if (selection.rangeCount == 0) {
	
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
	
	    callbacks.redactorInputEvent = function (event) {
	
	        /**
	         * Clear previous sync-timeout
	         */
	        if (this.redactorSyncTimeout) {
	
	            clearTimeout(this.redactorSyncTimeout);
	        }
	
	        /**
	         * Start waiting to input finish and sync redactor
	         */
	        this.redactorSyncTimeout = setTimeout(function () {
	
	            editor.content.sync();
	        }, 500);
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
	    callbacks.blockKeydown = function (event, block) {
	
	        switch (event.keyCode) {
	
	            case editor.core.keys.DOWN:
	            case editor.core.keys.RIGHT:
	                editor.callback.blockRightOrDownArrowPressed(block);
	                break;
	
	            case editor.core.keys.BACKSPACE:
	                editor.callback.backspacePressed(block);
	                break;
	
	            case editor.core.keys.UP:
	            case editor.core.keys.LEFT:
	                editor.callback.blockLeftOrUpArrowPressed(block);
	                break;
	
	        }
	    };
	
	    /**
	     * RIGHT or DOWN keydowns on block
	     */
	    callbacks.blockRightOrDownArrowPressed = function (block) {
	
	        var selection = window.getSelection(),
	            inputs = editor.state.inputs,
	            focusedNode = selection.anchorNode,
	            focusedNodeHolder;
	
	        /** Check for caret existance */
	        if (!focusedNode) {
	
	            return false;
	        }
	
	        /** Looking for closest (parent) contentEditable element of focused node */
	        while (focusedNode.contentEditable != 'true') {
	
	            focusedNodeHolder = focusedNode.parentNode;
	            focusedNode = focusedNodeHolder;
	        }
	
	        /** Input index in DOM level */
	        var editableElementIndex = 0;
	
	        while (focusedNode != inputs[editableElementIndex]) {
	
	            editableElementIndex++;
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
	        var caretInLastChild = false,
	            caretAtTheEndOfText = false;
	
	        var lastChild, deepestTextnode;
	
	        lastChild = focusedNode.childNodes[focusedNode.childNodes.length - 1];
	
	        if (editor.core.isDomNode(lastChild)) {
	
	            deepestTextnode = editor.content.getDeepestTextNodeFromPosition(lastChild, lastChild.childNodes.length);
	        } else {
	
	            deepestTextnode = lastChild;
	        }
	
	        caretInLastChild = selection.anchorNode == deepestTextnode;
	        caretAtTheEndOfText = deepestTextnode.length == selection.anchorOffset;
	
	        if (!caretInLastChild || !caretAtTheEndOfText) {
	
	            editor.core.log('arrow [down|right] : caret does not reached the end');
	            return false;
	        }
	
	        editor.caret.setToNextBlock(editableElementIndex);
	    };
	
	    /**
	     * LEFT or UP keydowns on block
	     */
	    callbacks.blockLeftOrUpArrowPressed = function (block) {
	
	        var selection = window.getSelection(),
	            inputs = editor.state.inputs,
	            focusedNode = selection.anchorNode,
	            focusedNodeHolder;
	
	        /** Check for caret existance */
	        if (!focusedNode) {
	
	            return false;
	        }
	
	        /**
	         * LEFT or UP not at the beginning
	         */
	        if (selection.anchorOffset !== 0) {
	
	            return false;
	        }
	
	        /** Looking for parent contentEditable block */
	        while (focusedNode.contentEditable != 'true') {
	
	            focusedNodeHolder = focusedNode.parentNode;
	            focusedNode = focusedNodeHolder;
	        }
	
	        /** Input index in DOM level */
	        var editableElementIndex = 0;
	
	        while (focusedNode != inputs[editableElementIndex]) {
	
	            editableElementIndex++;
	        }
	
	        /**
	         * Do nothing if caret is not at the beginning of first child
	         */
	        var caretInFirstChild = false,
	            caretAtTheBeginning = false;
	
	        var firstChild, deepestTextnode;
	
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
	
	        caretInFirstChild = selection.anchorNode == deepestTextnode;
	        caretAtTheBeginning = selection.anchorOffset === 0;
	
	        if (caretInFirstChild && caretAtTheBeginning) {
	
	            editor.caret.setToPreviousBlock(editableElementIndex);
	        }
	    };
	
	    /**
	     * Callback for enter key pressing in first-level block area
	     */
	    callbacks.enterPressedOnBlock = function (event) {
	
	        var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
	
	        editor.content.insertBlock({
	            type: NEW_BLOCK_TYPE,
	            block: editor.tools[NEW_BLOCK_TYPE].render()
	        }, true);
	
	        editor.toolbar.move();
	        editor.toolbar.open();
	    };
	
	    callbacks.backspacePressed = function (block) {
	
	        var currentInputIndex = editor.caret.getCurrentInputIndex(),
	            range,
	            selectionLength,
	            firstLevelBlocksCount;
	
	        if (block.textContent.trim()) {
	
	            range = editor.content.getRange();
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
	            setTimeout(function () {
	
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
	     * @deprecated
	     *
	     * @param event
	     */
	    callbacks.blockPaste = function (event) {
	
	        var currentInputIndex = editor.caret.getCurrentInputIndex(),
	            node = editor.state.inputs[currentInputIndex];
	
	        setTimeout(function () {
	
	            editor.content.sanitize(node);
	
	            event.preventDefault();
	        }, 10);
	
	        event.stopImmediatePropagation();
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
	    callbacks._blockPasteCallback = function (event) {
	
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
	            subtree: true
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
	
	        /** get html pasted data - dirty data */
	        var data = event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain');
	
	        /** Temporary DIV that is used to work with childs as arrays item */
	        var div = editor.draw.node('DIV', '', {}),
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
	        while (node = div.firstChild) {
	
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
	        // document.execCommand('insertParagraph', false, "<p>");
	
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
	}({});
	
	module.exports = callbacks;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Draw module
	 *
	 * @author Codex Team
	 * @version 1.0.
	 */
	
	var draw = function (draw) {
	
	    /**
	     * Base editor wrapper
	     */
	    draw.wrapper = function () {
	
	        var wrapper = document.createElement('div');
	
	        wrapper.className += 'codex-editor';
	
	        return wrapper;
	    };
	
	    /**
	     * Content-editable holder
	     */
	    draw.redactor = function () {
	
	        var redactor = document.createElement('div');
	
	        redactor.className += 'ce-redactor';
	
	        return redactor;
	    };
	
	    draw.ceBlock = function () {
	
	        var block = document.createElement('DIV');
	
	        block.className += 'ce_block';
	
	        return block;
	    };
	
	    /**
	     * Empty toolbar with toggler
	     */
	    draw.toolbar = function () {
	
	        var bar = document.createElement('div');
	
	        bar.className += 'ce-toolbar';
	
	        return bar;
	    };
	
	    draw.toolbarContent = function () {
	
	        var wrapper = document.createElement('DIV');
	
	        wrapper.classList.add('ce-toolbar__content');
	
	        return wrapper;
	    };
	
	    /**
	     * Inline toolbar
	     */
	    draw.inlineToolbar = function () {
	
	        var bar = document.createElement('DIV');
	
	        bar.className += 'ce-toolbar-inline';
	
	        return bar;
	    };
	
	    /**
	     * Wrapper for inline toobar buttons
	     */
	    draw.inlineToolbarButtons = function () {
	
	        var wrapper = document.createElement('DIV');
	
	        wrapper.className += 'ce-toolbar-inline__buttons';
	
	        return wrapper;
	    };
	
	    /**
	     * For some actions
	     */
	    draw.inlineToolbarActions = function () {
	
	        var wrapper = document.createElement('DIV');
	
	        wrapper.className += 'ce-toolbar-inline__actions';
	
	        return wrapper;
	    };
	
	    draw.inputForLink = function () {
	
	        var input = document.createElement('INPUT');
	
	        input.type = 'input';
	        input.className += 'inputForLink';
	        input.placeholder = 'Вставьте ссылку ...';
	        input.setAttribute('form', 'defaultForm');
	
	        input.setAttribute('autofocus', 'autofocus');
	
	        return input;
	    };
	
	    /**
	     * Block with notifications
	     */
	    draw.alertsHolder = function () {
	
	        var block = document.createElement('div');
	
	        block.classList.add('ce_notifications-block');
	
	        return block;
	    };
	
	    /**
	     * @todo Desc
	     */
	    draw.blockButtons = function () {
	
	        var block = document.createElement('div');
	
	        block.className += 'ce-toolbar__actions';
	
	        return block;
	    };
	
	    /**
	     * Block settings panel
	     */
	    draw.blockSettings = function () {
	
	        var settings = document.createElement('div');
	
	        settings.className += 'ce-settings';
	
	        return settings;
	    };
	
	    draw.defaultSettings = function () {
	
	        var div = document.createElement('div');
	
	        div.classList.add('ce-settings_default');
	
	        return div;
	    };
	
	    draw.pluginsSettings = function () {
	
	        var div = document.createElement('div');
	
	        div.classList.add('ce-settings_plugin');
	
	        return div;
	    };
	
	    draw.plusButton = function () {
	
	        var button = document.createElement('span');
	
	        button.className = 'ce-toolbar__plus';
	        // button.innerHTML = '<i class="ce-icon-plus"></i>';
	
	        return button;
	    };
	
	    /**
	     * Settings button in toolbar
	     */
	    draw.settingsButton = function () {
	
	        var toggler = document.createElement('span');
	
	        toggler.className = 'ce-toolbar__settings-btn';
	
	        /** Toggler button*/
	        toggler.innerHTML = '<i class="ce-icon-cog"></i>';
	
	        return toggler;
	    };
	
	    /**
	     * Redactor tools wrapper
	     */
	
	    draw.toolbox = function () {
	
	        var wrapper = document.createElement('div');
	
	        wrapper.className = 'ce-toolbar__tools';
	
	        return wrapper;
	    };
	
	    /**
	     * @protected
	     *
	     * Draws tool buttons for toolbox
	     *
	     * @param {String} type
	     * @param {String} classname
	     * @returns {Element}
	     */
	    draw.toolbarButton = function (type, classname) {
	
	        var button = document.createElement('li'),
	            tool_icon = document.createElement('i'),
	            tool_title = document.createElement('span');
	
	        button.dataset.type = type;
	        button.setAttribute('title', type);
	
	        tool_icon.classList.add(classname);
	        tool_title.classList.add('ce_toolbar_tools--title');
	
	        button.appendChild(tool_icon);
	        button.appendChild(tool_title);
	
	        return button;
	    };
	
	    /**
	     * @protected
	     *
	     * Draws tools for inline toolbar
	     *
	     * @param {String} type
	     * @param {String} classname
	     */
	    draw.toolbarButtonInline = function (type, classname) {
	
	        var button = document.createElement('BUTTON'),
	            tool_icon = document.createElement('I');
	
	        button.type = 'button';
	        button.dataset.type = type;
	        tool_icon.classList.add(classname);
	
	        button.appendChild(tool_icon);
	
	        return button;
	    };
	
	    /**
	     * Redactor block
	     */
	    draw.block = function (tagName, content) {
	
	        var node = document.createElement(tagName);
	
	        node.innerHTML = content || '';
	
	        return node;
	    };
	
	    /**
	     * Creates Node with passed tagName and className
	     * @param {string}  tagName
	     * @param {string} className
	     * @param {object} properties - allow to assign properties
	     */
	    draw.node = function (tagName, className, properties) {
	
	        var el = document.createElement(tagName);
	
	        if (className) el.className = className;
	
	        if (properties) {
	
	            for (var name in properties) {
	
	                el[name] = properties[name];
	            }
	        }
	
	        return el;
	    };
	
	    draw.pluginsRender = function (type, content) {
	
	        return {
	            type: type,
	            block: cEditor.tools[type].render({
	                text: content
	            })
	        };
	    };
	
	    return draw;
	}({});
	
	module.exports = draw;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Caret Module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	var editor = codex.editor;
	
	var caret = function (caret) {
	
	    /**
	     * @var {int} InputIndex - editable element in DOM
	     */
	    caret.inputIndex = null;
	
	    /**
	     * @var {int} offset - caret position in a text node.
	     */
	    caret.offset = null;
	
	    /**
	     * @var {int} focusedNodeIndex - we get index of child node from first-level block
	     */
	    caret.focusedNodeIndex = null;
	
	    /**
	     * Creates Document Range and sets caret to the element.
	     * @protected
	     * @uses caret.save — if you need to save caret position
	     * @param {Element} el - Changed Node.
	     */
	    caret.set = function (el, index, offset) {
	
	        offset = offset || this.offset || 0;
	        index = index || this.focusedNodeIndex || 0;
	
	        var childs = el.childNodes,
	            nodeToSet;
	
	        if (childs.length === 0) {
	
	            nodeToSet = el;
	        } else {
	
	            nodeToSet = childs[index];
	        }
	
	        /** If Element is INPUT */
	        if (el.tagName == 'INPUT') {
	
	            el.focus();
	            return;
	        }
	
	        if (editor.core.isDomNode(nodeToSet)) {
	
	            nodeToSet = editor.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);
	        }
	
	        var range = document.createRange(),
	            selection = window.getSelection();
	
	        setTimeout(function () {
	
	            range.setStart(nodeToSet, offset);
	            range.setEnd(nodeToSet, offset);
	
	            selection.removeAllRanges();
	            selection.addRange(range);
	
	            editor.caret.saveCurrentInputIndex();
	        }, 20);
	    };
	
	    /**
	     * @protected
	     * Updates index of input and saves it in caret object
	     */
	    caret.saveCurrentInputIndex = function () {
	
	        /** Index of Input that we paste sanitized content */
	        var selection = window.getSelection(),
	            inputs = editor.state.inputs,
	            focusedNode = selection.anchorNode,
	            focusedNodeHolder;
	
	        if (!focusedNode) {
	
	            return;
	        }
	
	        /** Looking for parent contentEditable block */
	        while (focusedNode.contentEditable != 'true') {
	
	            focusedNodeHolder = focusedNode.parentNode;
	            focusedNode = focusedNodeHolder;
	        }
	
	        /** Input index in DOM level */
	        var editableElementIndex = 0;
	
	        while (focusedNode != inputs[editableElementIndex]) {
	
	            editableElementIndex++;
	        }
	
	        this.inputIndex = editableElementIndex;
	    };
	
	    /**
	     * Returns current input index (caret object)
	     */
	    caret.getCurrentInputIndex = function () {
	
	        return this.inputIndex;
	    };
	
	    /**
	     * @param {int} index - index of first-level block after that we set caret into next input
	     */
	    caret.setToNextBlock = function (index) {
	
	        var inputs = editor.state.inputs,
	            nextInput = inputs[index + 1];
	
	        if (!nextInput) {
	
	            editor.core.log('We are reached the end');
	            return;
	        }
	
	        /**
	         * When new Block created or deleted content of input
	         * We should add some text node to set caret
	         */
	        if (!nextInput.childNodes.length) {
	
	            var emptyTextElement = document.createTextNode('');
	
	            nextInput.appendChild(emptyTextElement);
	        }
	
	        editor.caret.inputIndex = index + 1;
	        editor.caret.set(nextInput, 0, 0);
	        editor.content.workingNodeChanged(nextInput);
	    };
	
	    /**
	     * @param {int} index - index of target input.
	     * Sets caret to input with this index
	     */
	    caret.setToBlock = function (index) {
	
	        var inputs = editor.state.inputs,
	            targetInput = inputs[index];
	
	        console.assert(targetInput, 'caret.setToBlock: target input does not exists');
	
	        if (!targetInput) {
	
	            return;
	        }
	
	        /**
	         * When new Block created or deleted content of input
	         * We should add some text node to set caret
	         */
	        if (!targetInput.childNodes.length) {
	
	            var emptyTextElement = document.createTextNode('');
	
	            targetInput.appendChild(emptyTextElement);
	        }
	
	        editor.caret.inputIndex = index;
	        editor.caret.set(targetInput, 0, 0);
	        editor.content.workingNodeChanged(targetInput);
	    };
	
	    /**
	     * @param {int} index - index of input
	     */
	    caret.setToPreviousBlock = function (index) {
	
	        index = index || 0;
	
	        var inputs = editor.state.inputs,
	            previousInput = inputs[index - 1],
	            lastChildNode,
	            lengthOfLastChildNode,
	            emptyTextElement;
	
	        if (!previousInput) {
	
	            editor.core.log('We are reached first node');
	            return;
	        }
	
	        lastChildNode = editor.content.getDeepestTextNodeFromPosition(previousInput, previousInput.childNodes.length);
	        lengthOfLastChildNode = lastChildNode.length;
	
	        /**
	         * When new Block created or deleted content of input
	         * We should add some text node to set caret
	         */
	        if (!previousInput.childNodes.length) {
	
	            emptyTextElement = document.createTextNode('');
	            previousInput.appendChild(emptyTextElement);
	        }
	        editor.caret.inputIndex = index - 1;
	        editor.caret.set(previousInput, previousInput.childNodes.length - 1, lengthOfLastChildNode);
	        editor.content.workingNodeChanged(inputs[index - 1]);
	    };
	
	    caret.position = {
	
	        atStart: function atStart() {
	
	            var selection = window.getSelection(),
	                anchorOffset = selection.anchorOffset,
	                anchorNode = selection.anchorNode,
	                firstLevelBlock = editor.content.getFirstLevelBlock(anchorNode),
	                pluginsRender = firstLevelBlock.childNodes[0];
	
	            if (!editor.core.isDomNode(anchorNode)) {
	
	                anchorNode = anchorNode.parentNode;
	            }
	
	            var isFirstNode = anchorNode === pluginsRender.childNodes[0],
	                isOffsetZero = anchorOffset === 0;
	
	            return isFirstNode && isOffsetZero;
	        },
	
	        atTheEnd: function atTheEnd() {
	
	            var selection = window.getSelection(),
	                anchorOffset = selection.anchorOffset,
	                anchorNode = selection.anchorNode;
	
	            /** Caret is at the end of input */
	            return !anchorNode || !anchorNode.length || anchorOffset === anchorNode.length;
	        }
	    };
	
	    return caret;
	}({});
	
	module.exports = caret;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Notification Module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	var editor = codex.editor;
	
	var notifications = function (notifications) {
	
	    /**
	     * Error notificator. Shows block with message
	     * @protected
	     */
	    notifications.errorThrown = function (errorMsg, event) {
	
	        editor.notifications.send('This action is not available currently', event.type, false);
	    };
	
	    /**
	     * Appends notification with different types
	     * @param message {string} - Error or alert message
	     * @param type {string} - Type of message notification. Ex: Error, Warning, Danger ...
	     * @param append {boolean} - can be True or False when notification should be inserted after
	     */
	    notifications.send = function (message, type, append) {
	
	        var notification = editor.draw.block('div');
	
	        notification.textContent = message;
	        notification.classList.add('ce_notification-item', 'ce_notification-' + type, 'flipInX');
	
	        if (!append) {
	
	            editor.nodes.notifications.innerHTML = '';
	        }
	
	        editor.nodes.notifications.appendChild(notification);
	
	        setTimeout(function () {
	
	            notification.remove();
	        }, 3000);
	    };
	
	    return notifications;
	}({});
	
	module.exports = notifications;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Codex Editor Parser Module
	 *
	 * @author Codex Team
	 * @version 1.1
	 */
	var editor = codex.editor;
	
	var parser = function (parser) {
	
	    /** inserting text */
	    parser.insertPastedContent = function (blockType, tag) {
	
	        editor.content.insertBlock({
	            type: blockType.type,
	            block: blockType.render({
	                text: tag.innerHTML
	            })
	        });
	    };
	
	    /**
	     * Check DOM node for display style: separated block or child-view
	     */
	    parser.isFirstLevelBlock = function (node) {
	
	        return node.nodeType == cEditor.core.nodeTypes.TAG && node.classList.contains(cEditor.ui.className.BLOCK_CLASSNAME);
	    };
	
	    return parser;
	}({});
	
	module.exports = parser;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Codex Sanitizer
	 */
	
	var janitor = __webpack_require__(17);
	
	var sanitizer = function (sanitizer) {
	
	    /**
	     * Basic config
	     */
	    var Config = {
	
	        BASIC: {
	
	            tags: {
	                p: {},
	                a: {
	                    href: true,
	                    target: '_blank',
	                    rel: 'nofollow'
	                },
	                i: {},
	                b: {},
	                strong: {},
	                em: {},
	                span: {}
	            }
	        }
	    };
	
	    sanitizer.Config = Config;
	
	    sanitizer.init = janitor;
	
	    return sanitizer;
	}({});
	
	module.exports = sanitizer;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    module.exports = factory();
	  } else {
	    root.HTMLJanitor = factory();
	  }
	}(this, function () {
	
	  /**
	   * @param {Object} config.tags Dictionary of allowed tags.
	   * @param {boolean} config.keepNestedBlockElements Default false.
	   */
	  function HTMLJanitor(config) {
	
	    var tagDefinitions = config['tags'];
	    var tags = Object.keys(tagDefinitions);
	
	    var validConfigValues = tags
	      .map(function(k) { return typeof tagDefinitions[k]; })
	      .every(function(type) { return type === 'object' || type === 'boolean' || type === 'function'; });
	
	    if(!validConfigValues) {
	      throw new Error("The configuration was invalid");
	    }
	
	    this.config = config;
	  }
	
	  // TODO: not exhaustive?
	  var blockElementNames = ['P', 'LI', 'TD', 'TH', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE'];
	  function isBlockElement(node) {
	    return blockElementNames.indexOf(node.nodeName) !== -1;
	  }
	
	  var inlineElementNames = ['A', 'B', 'STRONG', 'I', 'EM', 'SUB', 'SUP', 'U', 'STRIKE'];
	  function isInlineElement(node) {
	    return inlineElementNames.indexOf(node.nodeName) !== -1;
	  }
	
	  HTMLJanitor.prototype.clean = function (html) {
	    var sandbox = document.createElement('div');
	    sandbox.innerHTML = html;
	
	    this._sanitize(sandbox);
	
	    return sandbox.innerHTML;
	  };
	
	  HTMLJanitor.prototype._sanitize = function (parentNode) {
	    var treeWalker = createTreeWalker(parentNode);
	    var node = treeWalker.firstChild();
	    if (!node) { return; }
	
	    do {
	      // Ignore nodes that have already been sanitized
	      if (node._sanitized) {
	        continue;
	      }
	
	      if (node.nodeType === Node.TEXT_NODE) {
	        // If this text node is just whitespace and the previous or next element
	        // sibling is a block element, remove it
	        // N.B.: This heuristic could change. Very specific to a bug with
	        // `contenteditable` in Firefox: http://jsbin.com/EyuKase/1/edit?js,output
	        // FIXME: make this an option?
	        if (node.data.trim() === ''
	            && ((node.previousElementSibling && isBlockElement(node.previousElementSibling))
	                 || (node.nextElementSibling && isBlockElement(node.nextElementSibling)))) {
	          parentNode.removeChild(node);
	          this._sanitize(parentNode);
	          break;
	        } else {
	          continue;
	        }
	      }
	
	      // Remove all comments
	      if (node.nodeType === Node.COMMENT_NODE) {
	        parentNode.removeChild(node);
	        this._sanitize(parentNode);
	        break;
	      }
	
	      var isInline = isInlineElement(node);
	      var containsBlockElement;
	      if (isInline) {
	        containsBlockElement = Array.prototype.some.call(node.childNodes, isBlockElement);
	      }
	
	      // Block elements should not be nested (e.g. <li><p>...); if
	      // they are, we want to unwrap the inner block element.
	      var isNotTopContainer = !! parentNode.parentNode;
	      var isNestedBlockElement =
	            isBlockElement(parentNode) &&
	            isBlockElement(node) &&
	            isNotTopContainer;
	
	      var nodeName = node.nodeName.toLowerCase();
	
	      var allowedAttrs = getAllowedAttrs(this.config, nodeName, node);
	
	      var isInvalid = isInline && containsBlockElement;
	
	      // Drop tag entirely according to the whitelist *and* if the markup
	      // is invalid.
	      if (isInvalid || shouldRejectNode(node, allowedAttrs)
	          || (!this.config.keepNestedBlockElements && isNestedBlockElement)) {
	        // Do not keep the inner text of SCRIPT/STYLE elements.
	        if (! (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE')) {
	          while (node.childNodes.length > 0) {
	            parentNode.insertBefore(node.childNodes[0], node);
	          }
	        }
	        parentNode.removeChild(node);
	
	        this._sanitize(parentNode);
	        break;
	      }
	
	      // Sanitize attributes
	      for (var a = 0; a < node.attributes.length; a += 1) {
	        var attr = node.attributes[a];
	
	        if (shouldRejectAttr(attr, allowedAttrs, node)) {
	          node.removeAttribute(attr.name);
	          // Shift the array to continue looping.
	          a = a - 1;
	        }
	      }
	
	      // Sanitize children
	      this._sanitize(node);
	
	      // Mark node as sanitized so it's ignored in future runs
	      node._sanitized = true;
	    } while ((node = treeWalker.nextSibling()));
	  };
	
	  function createTreeWalker(node) {
	    return document.createTreeWalker(node,
	                                     NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
	                                     null, false);
	  }
	
	  function getAllowedAttrs(config, nodeName, node){
	    if (typeof config.tags[nodeName] === 'function') {
	      return config.tags[nodeName](node);
	    } else {
	      return config.tags[nodeName];
	    }
	  }
	
	  function shouldRejectNode(node, allowedAttrs){
	    if (typeof allowedAttrs === 'undefined') {
	      return true;
	    } else if (typeof allowedAttrs === 'boolean') {
	      return !allowedAttrs;
	    }
	
	    return false;
	  }
	
	  function shouldRejectAttr(attr, allowedAttrs, node){
	    var attrName = attr.name.toLowerCase();
	
	    if (allowedAttrs === true){
	      return false;
	    } else if (typeof allowedAttrs[attrName] === 'function'){
	      return !allowedAttrs[attrName](attr.value, node);
	    } else if (typeof allowedAttrs[attrName] === 'undefined'){
	      return true;
	    } else if (allowedAttrs[attrName] === false) {
	      return true;
	    } else if (typeof allowedAttrs[attrName] === 'string') {
	      return (allowedAttrs[attrName] !== attr.value);
	    }
	
	    return false;
	  }
	
	  return HTMLJanitor;
	
	}));


/***/ }
/******/ ]);
//# sourceMappingURL=codex-editor.js.map