var CodexEditor =
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
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Codex Editor
	 *
	 *
	 *
	 *
	 * @author CodeX Team
	 */
	
	/**
	 * @typedef {CodexEditor} CodexEditor - editor class
	 */
	
	/**
	 * @typedef {Object} EditorConfig
	 * @property {String} holderId - Element to append Editor
	 * ...
	 */
	
	'use strict';
	
	/**
	 * Require Editor modules places in components/modules dir
	 */
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var modules = (["eventDispatcher.js","tools.js","ui.js"]).map(function (module) {
	
	    return __webpack_require__(1)("./" + module);
	});
	
	/**
	 * @class
	 *
	 * @classdesc CodeX Editor base class
	 *
	 * @property this.config - all settings
	 * @property this.moduleInstances - constructed editor components
	 *
	 * @type {CodexEditor}
	 */
	module.exports = function () {
	    _createClass(CodexEditor, null, [{
	        key: 'version',
	
	
	        /** Editor version */
	        get: function get() {
	
	            return ("2.0.0");
	        }
	
	        /**
	         * @param {EditorConfig} config - user configuration
	         *
	         */
	
	    }]);
	
	    function CodexEditor(config) {
	        var _this = this;
	
	        _classCallCheck(this, CodexEditor);
	
	        /**
	         * Configuration object
	         */
	        this.config = {};
	
	        /**
	         * Editor Components
	         */
	        this.moduleInstances = {};
	
	        Promise.resolve().then(function () {
	
	            _this.configuration = config;
	        }).then(function () {
	            return _this.init();
	        }).then(function () {
	            return _this.start();
	        }).then(function () {
	
	            console.log('CodeX Editor is ready');
	        }).catch(function (error) {
	
	            console.log('CodeX Editor does not ready beecause of %o', error);
	        });
	    }
	
	    /**
	     * Setting for configuration
	     * @param {object} config
	     */
	
	
	    _createClass(CodexEditor, [{
	        key: 'init',
	
	
	        /**
	         * Initializes modules:
	         *  - make and save instances
	         *  - configure
	         */
	        value: function init() {
	
	            /**
	             * Make modules instances and save it to the @property this.moduleInstances
	             */
	            this.constructModules();
	
	            /**
	             * Modules configuration
	             */
	            this.configureModules();
	        }
	
	        /**
	         * Make modules instances and save it to the @property this.moduleInstances
	         */
	
	    }, {
	        key: 'constructModules',
	        value: function constructModules() {
	            var _this2 = this;
	
	            modules.forEach(function (Module) {
	
	                try {
	
	                    _this2.moduleInstances[Module.name] = new Module({
	                        config: _this2.configuration
	                    });
	                } catch (e) {
	
	                    console.log('Module %o skipped because %o', Module, e);
	                }
	            });
	        }
	
	        /**
	         * Modules instances configuration:
	         *  - pass other modules to the 'state' property
	         *  - ...
	         */
	
	    }, {
	        key: 'configureModules',
	        value: function configureModules() {
	
	            for (var name in this.moduleInstances) {
	
	                /**
	                 * Module does not need self-instance
	                 */
	                this.moduleInstances[name].state = this.getModulesDiff(name);
	            }
	        }
	
	        /**
	         * Return modules without passed name
	         */
	
	    }, {
	        key: 'getModulesDiff',
	        value: function getModulesDiff(name) {
	
	            var modules = {};
	
	            for (var moduleName in this.moduleInstances) {
	
	                /**
	                 * Skip module with passed name
	                 */
	                if (moduleName == name) {
	
	                    continue;
	                }
	                modules[moduleName] = this.moduleInstances[moduleName];
	            }
	
	            return modules;
	        }
	
	        /**
	         * Start Editor!
	         *
	         * @return {Promise}
	         */
	
	    }, {
	        key: 'start',
	        value: function start() {
	
	            var prepareDecorator = function prepareDecorator(module) {
	                return module.prepare();
	            };
	
	            return Promise.resolve().then(prepareDecorator(this.moduleInstances.ui)).then(prepareDecorator(this.moduleInstances.tools)).catch(function (error) {
	
	                console.log('Error occured', error);
	            });
	        }
	    }, {
	        key: 'configuration',
	        set: function set() {
	            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	
	            this.config.holderId = config.holderId;
	            this.config.placeholder = config.placeholder || 'write your story...';
	            this.config.sanitizer = config.sanitizer || {
	                p: true,
	                b: true,
	                a: true
	            };
	
	            this.config.hideToolbar = config.hideToolbar ? config.hideToolbar : false;
	            this.config.tools = config.tools || {};
	            this.config.toolsConfig = config.toolsConfig || {};
	        }
	
	        /**
	         * Returns private property
	         * @returns {{}|*}
	         */
	        ,
	        get: function get() {
	
	            return this.config;
	        }
	    }]);
	
	    return CodexEditor;
	}();
	
	// module.exports = (function (editor) {
	//
	//     'use strict';
	//
	//     editor.version = VERSION;
	//     editor.scriptPrefix = 'cdx-script-';
	//
	//     var init = function () {
	//
	//         editor.core          = require('./modules/core');
	//         editor.tools         = require('./modules/tools');
	//         editor.ui            = require('./modules/ui');
	//         editor.transport     = require('./modules/transport');
	//         editor.renderer      = require('./modules/renderer');
	//         editor.saver         = require('./modules/saver');
	//         editor.content       = require('./modules/content');
	//         editor.toolbar       = require('./modules/toolbar/toolbar');
	//         editor.callback      = require('./modules/callbacks');
	//         editor.draw          = require('./modules/draw');
	//         editor.caret         = require('./modules/caret');
	//         editor.notifications = require('./modules/notifications');
	//         editor.parser        = require('./modules/parser');
	//         editor.sanitizer     = require('./modules/sanitizer');
	//         editor.listeners     = require('./modules/listeners');
	//         editor.destroyer     = require('./modules/destroyer');
	//         editor.paste         = require('./modules/paste');
	//
	//     };
	//
	//     /**
	//      * @public
	//      * holds initial settings
	//      */
	//     editor.settings = {
	//         tools     : ['paragraph', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
	//         holderId  : 'codex-editor',
	//
	//         // Type of block showing on empty editor
	//         initialBlockPlugin: 'paragraph'
	//     };
	//
	//     /**
	//      * public
	//      *
	//      * Static nodes
	//      */
	//     editor.nodes = {
	//         holder            : null,
	//         wrapper           : null,
	//         toolbar           : null,
	//         inlineToolbar     : {
	//             wrapper : null,
	//             buttons : null,
	//             actions : null
	//         },
	//         toolbox           : null,
	//         notifications     : null,
	//         plusButton        : null,
	//         showSettingsButton: null,
	//         showTrashButton   : null,
	//         blockSettings     : null,
	//         pluginSettings    : null,
	//         defaultSettings   : null,
	//         toolbarButtons    : {}, // { type : DomEl, ... }
	//         redactor          : null
	//     };
	//
	//     /**
	//      * @public
	//      *
	//      * Output state
	//      */
	//     editor.state = {
	//         jsonOutput  : [],
	//         blocks      : [],
	//         inputs      : []
	//     };
	//
	//     /**
	//     * @public
	//     * Editor plugins
	//     */
	//     editor.tools = {};
	//
	//     editor.start = function (userSettings) {
	//
	//         init();
	//
	//         editor.core.prepare(userSettings)
	//
	//         // If all ok, make UI, bind events and parse initial-content
	//             .then(editor.ui.prepare)
	//             .then(editor.tools.prepare)
	//             .then(editor.sanitizer.prepare)
	//             .then(editor.paste.prepare)
	//             .then(editor.transport.prepare)
	//             .then(editor.renderer.makeBlocksFromData)
	//             .then(editor.ui.saveInputs)
	//             .catch(function (error) {
	//
	//                 editor.core.log('Initialization failed with error: %o', 'warn', error);
	//
	//             });
	//
	//     };
	//
	//     return editor;
	//
	// })({});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./_anchors": 2,
		"./_anchors.js": 2,
		"./_callbacks": 3,
		"./_callbacks.js": 3,
		"./_caret": 4,
		"./_caret.js": 4,
		"./_content": 5,
		"./_content.js": 5,
		"./_destroyer": 6,
		"./_destroyer.js": 6,
		"./_listeners": 7,
		"./_listeners.js": 7,
		"./_notifications": 8,
		"./_notifications.js": 8,
		"./_parser": 9,
		"./_parser.js": 9,
		"./_paste": 10,
		"./_paste.js": 10,
		"./_renderer": 11,
		"./_renderer.js": 11,
		"./_sanitizer": 12,
		"./_sanitizer.js": 12,
		"./_saver": 14,
		"./_saver.js": 14,
		"./_transport": 15,
		"./_transport.js": 15,
		"./eventDispatcher": 16,
		"./eventDispatcher.js": 16,
		"./toolbar/inline": 17,
		"./toolbar/inline.js": 17,
		"./toolbar/settings": 18,
		"./toolbar/settings.js": 18,
		"./toolbar/toolbar": 19,
		"./toolbar/toolbar.js": 19,
		"./toolbar/toolbox": 20,
		"./toolbar/toolbox.js": 20,
		"./tools": 21,
		"./tools.js": 21,
		"./ui": 22,
		"./ui.js": 22
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Anchors module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	module.exports = function (anchors) {
	
	    var editor = codex.editor;
	
	    anchors.input = null;
	    anchors.currentNode = null;
	
	    anchors.settingsOpened = function (currentBlock) {
	
	        anchors.currentNode = currentBlock;
	        anchors.input.value = anchors.currentNode.dataset.anchor || '';
	    };
	
	    anchors.anchorChanged = function (e) {
	
	        var newAnchor = e.target.value = anchors.rusToTranslit(e.target.value);
	
	        anchors.currentNode.dataset.anchor = newAnchor;
	
	        if (newAnchor.trim() !== '') {
	
	            anchors.currentNode.classList.add(editor.ui.className.BLOCK_WITH_ANCHOR);
	        } else {
	
	            anchors.currentNode.classList.remove(editor.ui.className.BLOCK_WITH_ANCHOR);
	        }
	    };
	
	    anchors.keyDownOnAnchorInput = function (e) {
	
	        if (e.keyCode == editor.core.keys.ENTER) {
	
	            e.preventDefault();
	            e.stopPropagation();
	
	            e.target.blur();
	            editor.toolbar.settings.close();
	        }
	    };
	
	    anchors.keyUpOnAnchorInput = function (e) {
	
	        if (e.keyCode >= editor.core.keys.LEFT && e.keyCode <= editor.core.keys.DOWN) {
	
	            e.stopPropagation();
	        }
	    };
	
	    anchors.rusToTranslit = function (string) {
	
	        var ru = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Ь', 'Э', 'Ю', 'Я'],
	            en = ['A', 'B', 'V', 'G', 'D', 'E', 'E', 'Zh', 'Z', 'I', 'Y', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Ch', 'Sh', 'Sch', '', 'Y', '', 'E', 'Yu', 'Ya'];
	
	        for (var i = 0; i < ru.length; i++) {
	
	            string = string.split(ru[i]).join(en[i]);
	            string = string.split(ru[i].toLowerCase()).join(en[i].toLowerCase());
	        }
	
	        string = string.replace(/[^0-9a-zA-Z_]+/g, '-');
	
	        return string;
	    };
	
	    return anchors;
	}({});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * @module Codex Editor Callbacks module
	 * @description Module works with editor added Elements
	 *
	 * @author Codex Team
	 * @version 1.4.0
	 */
	
	module.exports = function (callbacks) {
	
	    var editor = codex.editor;
	
	    /**
	     * used by UI module
	     * @description Routes all keydowns on document
	     * @param {Object} event
	     */
	    callbacks.globalKeydown = function (event) {
	
	        switch (event.keyCode) {
	            case editor.core.keys.ENTER:
	                enterKeyPressed_(event);break;
	        }
	    };
	
	    /**
	     * used by UI module
	     * @description Routes all keydowns on redactors area
	     * @param {Object} event
	     */
	    callbacks.redactorKeyDown = function (event) {
	
	        switch (event.keyCode) {
	            case editor.core.keys.TAB:
	                tabKeyPressedOnRedactorsZone_(event);break;
	            case editor.core.keys.ENTER:
	                enterKeyPressedOnRedactorsZone_(event);break;
	            case editor.core.keys.ESC:
	                escapeKeyPressedOnRedactorsZone_(event);break;
	            default:
	                defaultKeyPressedOnRedactorsZone_(event);break;
	        }
	    };
	
	    /**
	     * used by UI module
	     * @description Routes all keyup events
	     * @param {Object} event
	     */
	    callbacks.globalKeyup = function (event) {
	
	        switch (event.keyCode) {
	            case editor.core.keys.UP:
	            case editor.core.keys.LEFT:
	            case editor.core.keys.RIGHT:
	            case editor.core.keys.DOWN:
	                arrowKeyPressed_(event);break;
	        }
	    };
	
	    /**
	     * @param {Object} event
	     * @private
	     *
	     * Handles behaviour when tab pressed
	     * @description if Content is empty show toolbox (if it is closed) or leaf tools
	     * uses Toolbars toolbox module to handle the situation
	     */
	    var tabKeyPressedOnRedactorsZone_ = function tabKeyPressedOnRedactorsZone_(event) {
	
	        /**
	         * Wait for solution. Would like to know the behaviour
	         * @todo Add spaces
	         */
	        event.preventDefault();
	
	        if (!editor.core.isBlockEmpty(editor.content.currentNode)) {
	
	            return;
	        }
	
	        if (!editor.toolbar.opened) {
	
	            editor.toolbar.open();
	        }
	
	        if (editor.toolbar.opened && !editor.toolbar.toolbox.opened) {
	
	            editor.toolbar.toolbox.open();
	        } else {
	
	            editor.toolbar.toolbox.leaf();
	        }
	    };
	
	    /**
	     * Handles global EnterKey Press
	     * @see enterPressedOnBlock_
	     * @param {Object} event
	     */
	    var enterKeyPressed_ = function enterKeyPressed_() {
	
	        if (editor.content.editorAreaHightlighted) {
	
	            /**
	             * it means that we lose input index, saved index before is not correct
	             * therefore we need to set caret when we insert new block
	             */
	            editor.caret.inputIndex = -1;
	
	            enterPressedOnBlock_();
	        }
	    };
	
	    /**
	     * Callback for enter key pressing in first-level block area
	     *
	     * @param {Event} event
	     * @private
	     *
	     * @description Inserts new block with initial type from settings
	     */
	    var enterPressedOnBlock_ = function enterPressedOnBlock_() {
	
	        var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
	
	        editor.content.insertBlock({
	            type: NEW_BLOCK_TYPE,
	            block: editor.tools[NEW_BLOCK_TYPE].render()
	        }, true);
	
	        editor.toolbar.move();
	        editor.toolbar.open();
	    };
	
	    /**
	     * ENTER key handler
	     *
	     * @param {Object} event
	     * @private
	     *
	     * @description Makes new block with initial type from settings
	     */
	    var enterKeyPressedOnRedactorsZone_ = function enterKeyPressedOnRedactorsZone_(event) {
	
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
	
	        var currentSelection = window.getSelection(),
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
	
	    /**
	     * Escape behaviour
	     * @param event
	     * @private
	     *
	     * @description Closes toolbox and toolbar. Prevents default behaviour
	     */
	    var escapeKeyPressedOnRedactorsZone_ = function escapeKeyPressedOnRedactorsZone_(event) {
	
	        /** Close all toolbar */
	        editor.toolbar.close();
	
	        /** Close toolbox */
	        editor.toolbar.toolbox.close();
	
	        event.preventDefault();
	    };
	
	    /**
	     * @param {Event} event
	     * @private
	     *
	     * closes and moves toolbar
	     */
	    var arrowKeyPressed_ = function arrowKeyPressed_(event) {
	
	        editor.content.workingNodeChanged();
	
	        /* Closing toolbar */
	        editor.toolbar.close();
	        editor.toolbar.move();
	    };
	
	    /**
	     * @private
	     * @param {Event} event
	     *
	     * @description Closes all opened bars from toolbar.
	     * If block is mark, clears highlightning
	     */
	    var defaultKeyPressedOnRedactorsZone_ = function defaultKeyPressedOnRedactorsZone_() {
	
	        editor.toolbar.close();
	
	        if (!editor.toolbar.inline.actionsOpened) {
	
	            editor.toolbar.inline.close();
	            editor.content.clearMark();
	        }
	    };
	
	    /**
	     * Handler when clicked on redactors area
	     *
	     * @protected
	     * @param event
	     *
	     * @description Detects clicked area. If it is first-level block area, marks as detected and
	     * on next enter press will be inserted new block
	     * Otherwise, save carets position (input index) and put caret to the editable zone.
	     *
	     * @see detectWhenClickedOnFirstLevelBlockArea_
	     *
	     */
	    callbacks.redactorClicked = function (event) {
	
	        detectWhenClickedOnFirstLevelBlockArea_();
	
	        editor.content.workingNodeChanged(event.target);
	        editor.ui.saveInputs();
	
	        var selectedText = editor.toolbar.inline.getSelectionText(),
	            firstLevelBlock;
	
	        /** If selection range took off, then we hide inline toolbar */
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
	                firstLevelBlock = editor.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);
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
	        } else {
	
	            /** Close all panels */
	            editor.toolbar.settings.close();
	            editor.toolbar.toolbox.close();
	        }
	
	        /**
	         * Move toolbar and open
	         */
	        editor.toolbar.move();
	        editor.toolbar.open();
	
	        var inputIsEmpty = !editor.content.currentNode.textContent.trim(),
	            currentNodeType = editor.content.currentNode.dataset.tool,
	            isInitialType = currentNodeType == editor.settings.initialBlockPlugin;
	
	        /** Hide plus buttons */
	        editor.toolbar.hidePlusButton();
	
	        if (!inputIsEmpty) {
	
	            /** Mark current block */
	            editor.content.markBlock();
	        }
	
	        if (isInitialType && inputIsEmpty) {
	
	            /** Show plus button */
	            editor.toolbar.showPlusButton();
	        }
	    };
	
	    /**
	     * This method allows to define, is caret in contenteditable element or not.
	     *
	     * @private
	     *
	     * @description Otherwise, if we get TEXT node from range container, that will means we have input index.
	     * In this case we use default browsers behaviour (if plugin allows that) or overwritten action.
	     * Therefore, to be sure that we've clicked first-level block area, we should have currentNode, which always
	     * specifies to the first-level block. Other cases we just ignore.
	     */
	    var detectWhenClickedOnFirstLevelBlockArea_ = function detectWhenClickedOnFirstLevelBlockArea_() {
	
	        var selection = window.getSelection(),
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
	            editor.content.editorAreaHightlighted = !flag;
	        }
	    };
	
	    /**
	     * Toolbar button click handler
	     *
	     * @param {Object} event - cursor to the button
	     * @protected
	     *
	     * @description gets current tool and calls render method
	     */
	    callbacks.toolbarButtonClicked = function (event) {
	
	        var button = this;
	
	        editor.toolbar.current = button.dataset.type;
	
	        editor.toolbar.toolbox.toolClicked(event);
	        editor.toolbar.close();
	    };
	
	    /**
	     * Show or Hide toolbox when plus button is clicked
	     */
	    callbacks.plusButtonClicked = function () {
	
	        if (!editor.nodes.toolbox.classList.contains('opened')) {
	
	            editor.toolbar.toolbox.open();
	        } else {
	
	            editor.toolbar.toolbox.close();
	        }
	    };
	
	    /**
	     * Block handlers for KeyDown events
	     *
	     * @protected
	     * @param {Object} event
	     *
	     * Handles keydowns on block
	     * @see blockRightOrDownArrowPressed_
	     * @see backspacePressed_
	     * @see blockLeftOrUpArrowPressed_
	     */
	    callbacks.blockKeydown = function (event) {
	
	        var block = event.target; // event.target is input
	
	        switch (event.keyCode) {
	
	            case editor.core.keys.DOWN:
	            case editor.core.keys.RIGHT:
	                blockRightOrDownArrowPressed_(event);
	                break;
	
	            case editor.core.keys.BACKSPACE:
	                backspacePressed_(block, event);
	                break;
	
	            case editor.core.keys.UP:
	            case editor.core.keys.LEFT:
	                blockLeftOrUpArrowPressed_(event);
	                break;
	
	        }
	    };
	
	    /**
	     * RIGHT or DOWN keydowns on block
	     *
	     * @param {Object} event
	     * @private
	     *
	     * @description watches the selection and gets closest editable element.
	     * Uses method getDeepestTextNodeFromPosition to get the last node of next block
	     * Sets caret if it is contenteditable
	     */
	    var blockRightOrDownArrowPressed_ = function blockRightOrDownArrowPressed_(event) {
	
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
	     *
	     * @param {Object} event
	     * @private
	     *
	     * watches the selection and gets closest editable element.
	     * Uses method getDeepestTextNodeFromPosition to get the last node of previous block
	     * Sets caret if it is contenteditable
	     *
	     */
	    var blockLeftOrUpArrowPressed_ = function blockLeftOrUpArrowPressed_(event) {
	
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
	     * Handles backspace keydown
	     *
	     * @param {Element} block
	     * @param {Object} event
	     * @private
	     *
	     * @description if block is empty, delete the block and set caret to the previous block
	     * If block is not empty, try to merge two blocks - current and previous
	     * But it we try'n to remove first block, then we should set caret to the next block, not previous.
	     * If we removed the last block, create new one
	     */
	    var backspacePressed_ = function backspacePressed_(block, event) {
	
	        var currentInputIndex = editor.caret.getCurrentInputIndex(),
	            range,
	            selectionLength,
	            firstLevelBlocksCount;
	
	        if (editor.core.isNativeInput(event.target)) {
	
	            /** If input value is empty - remove block */
	            if (event.target.value.trim() == '') {
	
	                block.remove();
	            } else {
	
	                return;
	            }
	        }
	
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
	     * used by UI module
	     * Clicks on block settings button
	     *
	     * @param {Object} event
	     * @protected
	     * @description Opens toolbar settings
	     */
	    callbacks.showSettingsButtonClicked = function (event) {
	
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

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Caret Module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	module.exports = function (caret) {
	
	    var editor = codex.editor;
	
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
	
	        offset = offset || caret.offset || 0;
	        index = index || caret.focusedNodeIndex || 0;
	
	        var childs = el.childNodes,
	            nodeToSet;
	
	        if (childs.length === 0) {
	
	            nodeToSet = el;
	        } else {
	
	            nodeToSet = childs[index];
	        }
	
	        /** If Element is INPUT */
	        if (el.contentEditable != 'true') {
	
	            el.focus();
	            return;
	        }
	
	        if (editor.core.isDomNode(nodeToSet)) {
	
	            nodeToSet = editor.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);
	        }
	
	        var range = document.createRange(),
	            selection = window.getSelection();
	
	        window.setTimeout(function () {
	
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
	
	        caret.inputIndex = editableElementIndex;
	    };
	
	    /**
	     * Returns current input index (caret object)
	     */
	    caret.getCurrentInputIndex = function () {
	
	        return caret.inputIndex;
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
	
	    /**
	     * Inserts node at the caret location
	     * @param {HTMLElement|DocumentFragment} node
	     */
	    caret.insertNode = function (node) {
	
	        var selection,
	            range,
	            lastNode = node;
	
	        if (node.nodeType == editor.core.nodeTypes.DOCUMENT_FRAGMENT) {
	
	            lastNode = node.lastChild;
	        }
	
	        selection = window.getSelection();
	
	        range = selection.getRangeAt(0);
	        range.deleteContents();
	
	        range.insertNode(node);
	
	        range.setStartAfter(lastNode);
	        range.collapse(true);
	
	        selection.removeAllRanges();
	        selection.addRange(range);
	    };
	
	    return caret;
	}({});

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Content Module
	 * Works with DOM
	 *
	 * @module Codex Editor content module
	 *
	 * @author Codex Team
	 * @version 1.3.13
	 *
	 * @description Module works with Elements that have been appended to the main DOM
	 */
	
	module.exports = function (content) {
	
	    var editor = codex.editor;
	
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
	     * @deprecated
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
	     * Appends background to the block
	     *
	     * @description add CSS class to highlight visually first-level block area
	     */
	    content.markBlock = function () {
	
	        editor.content.currentNode.classList.add(editor.ui.className.BLOCK_HIGHLIGHTED);
	    };
	
	    /**
	     * Clear background
	     *
	     * @description clears styles that highlights block
	     */
	    content.clearMark = function () {
	
	        if (editor.content.currentNode) {
	
	            editor.content.currentNode.classList.remove(editor.ui.className.BLOCK_HIGHLIGHTED);
	        }
	    };
	
	    /**
	     * Finds first-level block
	     *
	     * @param {Element} node - selected or clicked in redactors area node
	     * @protected
	     *
	     * @description looks for first-level block.
	     * gets parent while node is not first-level
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
	     * @protected
	     *
	     * @description If targetNode is first-level then we set it as current else we look for parents to find first-level
	     */
	    content.workingNodeChanged = function (targetNode) {
	
	        /** Clear background from previous marked block before we change */
	        editor.content.clearMark();
	
	        if (!targetNode) {
	
	            return;
	        }
	
	        content.currentNode = content.getFirstLevelBlock(targetNode);
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
	    content.replaceBlock = function (targetBlock, newBlock) {
	
	        if (!targetBlock || !newBlock) {
	
	            editor.core.log('replaceBlock: missed params');
	            return;
	        }
	
	        /** If target-block is not a frist-level block, then we iterate parents to find it */
	        while (!targetBlock.classList.contains(editor.ui.className.BLOCK_CLASSNAME)) {
	
	            targetBlock = targetBlock.parentNode;
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
	     * @protected
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
	            isStretched = blockData.stretched;
	
	        var newBlock = composeNewBlock_(newBlockContent, blockType, isStretched);
	
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
	                window.setTimeout(function () {
	
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
	
	        tool = tool || editor.content.currentNode.dataset.tool;
	        var newBlockComposed = composeNewBlock_(newBlock, tool);
	
	        /** Replacing */
	        editor.content.replaceBlock(blockToReplace, newBlockComposed);
	
	        /** Save new Inputs when block is changed */
	        editor.ui.saveInputs();
	    };
	
	    /**
	     * Iterates between child noted and looking for #text node on deepest level
	     * @protected
	     *
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
	
	        var lookingFromStart = false;
	
	        /** For looking from START */
	        if (position === 0) {
	
	            lookingFromStart = true;
	            position = 1;
	        }
	
	        while (position) {
	
	            /** initial verticle of node. */
	            if (lookingFromStart) {
	
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
	     * @param {Element} block - current plugins render
	     * @param {String} tool - plugins name
	     * @param {Boolean} isStretched - make stretched block or not
	     *
	     * @description adds necessary information to wrap new created block by first-level holder
	     */
	    var composeNewBlock_ = function composeNewBlock_(block, tool, isStretched) {
	
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
	     * @protected
	     */
	    content.getRange = function () {
	
	        var selection = window.getSelection().getRangeAt(0);
	
	        return selection;
	    };
	
	    /**
	     * Divides block in two blocks (after and before caret)
	     *
	     * @protected
	     * @param {int} inputIndex - target input index
	     *
	     * @description splits current input content to the separate blocks
	     * When enter is pressed among the words, that text will be splited.
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
	     *
	     * @protected
	     * @param {int} currentInputIndex
	     * @param {int} targetInputIndex
	     *
	     * @description gets two inputs indexes and merges into one
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
	     * @param {string} htmlData - html content as string
	     * @param {string} plainData - plain text
	     * @return {string} - html content as string
	     */
	    content.wrapTextWithParagraphs = function (htmlData, plainData) {
	
	        if (!htmlData.trim()) {
	
	            return wrapPlainTextWithParagraphs(plainData);
	        }
	
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
	        wrapper.innerHTML = htmlData;
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
	
	    /**
	     * Splits strings on new line and wraps paragraphs with <p> tag
	     * @param plainText
	     * @returns {string}
	     */
	    var wrapPlainTextWithParagraphs = function wrapPlainTextWithParagraphs(plainText) {
	
	        if (!plainText) return '';
	
	        return '<p>' + plainText.split('\n\n').join('</p><p>') + '</p>';
	    };
	
	    /**
	    * Finds closest Contenteditable parent from Element
	    * @param {Element} node     element looking from
	    * @return {Element} node    contenteditable
	    */
	    content.getEditableParent = function (node) {
	
	        while (node && node.contentEditable != 'true') {
	
	            node = node.parentNode;
	        }
	
	        return node;
	    };
	
	    /**
	    * Clear editors content
	     *
	     * @param {Boolean} all — if true, delete all article data (content, id, etc.)
	    */
	    content.clear = function (all) {
	
	        editor.nodes.redactor.innerHTML = '';
	        editor.content.sync();
	        editor.ui.saveInputs();
	        if (all) {
	
	            editor.state.blocks = {};
	        } else if (editor.state.blocks) {
	
	            editor.state.blocks.items = [];
	        }
	
	        editor.content.currentNode = null;
	    };
	
	    /**
	    *
	     * Load new data to editor
	     * If editor is not empty, just append articleData.items
	     *
	    * @param articleData.items
	    */
	    content.load = function (articleData) {
	
	        var currentContent = Object.assign({}, editor.state.blocks);
	
	        editor.content.clear();
	
	        if (!Object.keys(currentContent).length) {
	
	            editor.state.blocks = articleData;
	        } else if (!currentContent.items) {
	
	            currentContent.items = articleData.items;
	            editor.state.blocks = currentContent;
	        } else {
	
	            currentContent.items = currentContent.items.concat(articleData.items);
	            editor.state.blocks = currentContent;
	        }
	
	        editor.renderer.makeBlocksFromData();
	    };
	
	    return content;
	}({});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Codex Editor Destroyer module
	 *
	 * @auhor Codex Team
	 * @version 1.0
	 */
	
	module.exports = function (destroyer) {
	
	    var editor = codex.editor;
	
	    destroyer.removeNodes = function () {
	
	        editor.nodes.wrapper.remove();
	        editor.nodes.notifications.remove();
	    };
	
	    destroyer.destroyPlugins = function () {
	
	        for (var tool in editor.tools) {
	
	            if (typeof editor.tools[tool].destroy === 'function') {
	
	                editor.tools[tool].destroy();
	            }
	        }
	    };
	
	    destroyer.destroyScripts = function () {
	
	        var scripts = document.getElementsByTagName('SCRIPT');
	
	        for (var i = 0; i < scripts.length; i++) {
	
	            if (scripts[i].id.indexOf(editor.scriptPrefix) + 1) {
	
	                scripts[i].remove();
	                i--;
	            }
	        }
	    };
	
	    /**
	     * Delete editor data from webpage.
	     * You should send settings argument with boolean flags:
	     * @param settings.ui- remove redactor event listeners and DOM nodes
	     * @param settings.scripts - remove redactor scripts from DOM
	     * @param settings.plugins - remove plugin's objects
	     * @param settings.core - remove editor core. You can remove core only if UI and scripts flags is true
	     * }
	     *
	     */
	    destroyer.destroy = function (settings) {
	
	        if (!settings || (typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) !== 'object') {
	
	            return;
	        }
	
	        if (settings.ui) {
	
	            destroyer.removeNodes();
	            editor.listeners.removeAll();
	        }
	
	        if (settings.scripts) {
	
	            destroyer.destroyScripts();
	        }
	
	        if (settings.plugins) {
	
	            destroyer.destroyPlugins();
	        }
	
	        if (settings.ui && settings.scripts && settings.core) {
	
	            delete codex.editor;
	        }
	    };
	
	    return destroyer;
	}({});

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";
	
	/**
	 * Codex Editor Listeners module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	/**
	 * Module-decorator for event listeners assignment
	 */
	module.exports = function (listeners) {
	
	    var allListeners = [];
	
	    /**
	     * Search methods
	     *
	     * byElement, byType and byHandler returns array of suitable listeners
	     * one and all takes element, eventType, and handler and returns first (all) suitable listener
	     *
	     */
	    listeners.search = function () {
	
	        var byElement = function byElement(element, context) {
	
	            var listenersOnElement = [];
	
	            context = context || allListeners;
	
	            for (var i = 0; i < context.length; i++) {
	
	                var listener = context[i];
	
	                if (listener.element === element) {
	
	                    listenersOnElement.push(listener);
	                }
	            }
	
	            return listenersOnElement;
	        };
	
	        var byType = function byType(eventType, context) {
	
	            var listenersWithType = [];
	
	            context = context || allListeners;
	
	            for (var i = 0; i < context.length; i++) {
	
	                var listener = context[i];
	
	                if (listener.type === eventType) {
	
	                    listenersWithType.push(listener);
	                }
	            }
	
	            return listenersWithType;
	        };
	
	        var byHandler = function byHandler(handler, context) {
	
	            var listenersWithHandler = [];
	
	            context = context || allListeners;
	
	            for (var i = 0; i < context.length; i++) {
	
	                var listener = context[i];
	
	                if (listener.handler === handler) {
	
	                    listenersWithHandler.push(listener);
	                }
	            }
	
	            return listenersWithHandler;
	        };
	
	        var one = function one(element, eventType, handler) {
	
	            var result = allListeners;
	
	            if (element) result = byElement(element, result);
	
	            if (eventType) result = byType(eventType, result);
	
	            if (handler) result = byHandler(handler, result);
	
	            return result[0];
	        };
	
	        var all = function all(element, eventType, handler) {
	
	            var result = allListeners;
	
	            if (element) result = byElement(element, result);
	
	            if (eventType) result = byType(eventType, result);
	
	            if (handler) result = byHandler(handler, result);
	
	            return result;
	        };
	
	        return {
	            byElement: byElement,
	            byType: byType,
	            byHandler: byHandler,
	            one: one,
	            all: all
	        };
	    }();
	
	    listeners.add = function (element, eventType, handler, isCapture) {
	
	        element.addEventListener(eventType, handler, isCapture);
	
	        var data = {
	            element: element,
	            type: eventType,
	            handler: handler
	        };
	
	        var alreadyAddedListener = listeners.search.one(element, eventType, handler);
	
	        if (!alreadyAddedListener) {
	
	            allListeners.push(data);
	        }
	    };
	
	    listeners.remove = function (element, eventType, handler) {
	
	        element.removeEventListener(eventType, handler);
	
	        var existingListeners = listeners.search.all(element, eventType, handler);
	
	        for (var i = 0; i < existingListeners.length; i++) {
	
	            var index = allListeners.indexOf(existingListeners[i]);
	
	            if (index > 0) {
	
	                allListeners.splice(index, 1);
	            }
	        }
	    };
	
	    listeners.removeAll = function () {
	
	        allListeners.map(function (current) {
	
	            listeners.remove(current.element, current.type, current.handler);
	        });
	    };
	
	    listeners.get = function (element, eventType, handler) {
	
	        return listeners.search.all(element, eventType, handler);
	    };
	
	    return listeners;
	}({});

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Notification Module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	module.exports = function (notifications) {
	
	    var editor = codex.editor;
	
	    var queue = [];
	
	    var addToQueue = function addToQueue(settings) {
	
	        queue.push(settings);
	
	        var index = 0;
	
	        while (index < queue.length && queue.length > 5) {
	
	            if (queue[index].type == 'confirm' || queue[index].type == 'prompt') {
	
	                index++;
	                continue;
	            }
	
	            queue[index].close();
	            queue.splice(index, 1);
	        }
	    };
	
	    notifications.createHolder = function () {
	
	        var holder = editor.draw.node('DIV', 'cdx-notifications-block');
	
	        editor.nodes.notifications = document.body.appendChild(holder);
	
	        return holder;
	    };
	
	    /**
	     * Error notificator. Shows block with message
	     * @protected
	     */
	    notifications.errorThrown = function (errorMsg, event) {
	
	        editor.notifications.notification({ message: 'This action is not available currently', type: event.type });
	    };
	
	    /**
	     *
	     * Appends notification
	     *
	     *  settings = {
	     *      type        - notification type (reserved types: alert, confirm, prompt). Just add class 'cdx-notification-'+type
	     *      message     - notification message
	     *      okMsg       - confirm button text (default - 'Ok')
	     *      cancelBtn   - cancel button text (default - 'Cancel'). Only for confirm and prompt types
	     *      confirm     - function-handler for ok button click
	     *      cancel      - function-handler for cancel button click. Only for confirm and prompt types
	     *      time        - time (in seconds) after which notification will close (default - 10s)
	     *  }
	     *
	     * @param settings
	     */
	    notifications.notification = function (constructorSettings) {
	
	        /** Private vars and methods */
	        var notification = null,
	            cancel = null,
	            type = null,
	            confirm = null,
	            inputField = null;
	
	        var confirmHandler = function confirmHandler() {
	
	            close();
	
	            if (typeof confirm !== 'function') {
	
	                return;
	            }
	
	            if (type == 'prompt') {
	
	                confirm(inputField.value);
	                return;
	            }
	
	            confirm();
	        };
	
	        var cancelHandler = function cancelHandler() {
	
	            close();
	
	            if (typeof cancel !== 'function') {
	
	                return;
	            }
	
	            cancel();
	        };
	
	        /** Public methods */
	        function create(settings) {
	
	            if (!(settings && settings.message)) {
	
	                editor.core.log('Can\'t create notification. Message is missed');
	                return;
	            }
	
	            settings.type = settings.type || 'alert';
	            settings.time = settings.time * 1000 || 10000;
	
	            var wrapper = editor.draw.node('DIV', 'cdx-notification'),
	                message = editor.draw.node('DIV', 'cdx-notification__message'),
	                input = editor.draw.node('INPUT', 'cdx-notification__input'),
	                okBtn = editor.draw.node('SPAN', 'cdx-notification__ok-btn'),
	                cancelBtn = editor.draw.node('SPAN', 'cdx-notification__cancel-btn');
	
	            message.textContent = settings.message;
	            okBtn.textContent = settings.okMsg || 'ОК';
	            cancelBtn.textContent = settings.cancelMsg || 'Отмена';
	
	            editor.listeners.add(okBtn, 'click', confirmHandler);
	            editor.listeners.add(cancelBtn, 'click', cancelHandler);
	
	            wrapper.appendChild(message);
	
	            if (settings.type == 'prompt') {
	
	                wrapper.appendChild(input);
	            }
	
	            wrapper.appendChild(okBtn);
	
	            if (settings.type == 'prompt' || settings.type == 'confirm') {
	
	                wrapper.appendChild(cancelBtn);
	            }
	
	            wrapper.classList.add('cdx-notification-' + settings.type);
	            wrapper.dataset.type = settings.type;
	
	            notification = wrapper;
	            type = settings.type;
	            confirm = settings.confirm;
	            cancel = settings.cancel;
	            inputField = input;
	
	            if (settings.type != 'prompt' && settings.type != 'confirm') {
	
	                window.setTimeout(close, settings.time);
	            }
	        };
	
	        /**
	        * Show notification block
	        */
	        function send() {
	
	            editor.nodes.notifications.appendChild(notification);
	            inputField.focus();
	
	            editor.nodes.notifications.classList.add('cdx-notification__notification-appending');
	
	            window.setTimeout(function () {
	
	                editor.nodes.notifications.classList.remove('cdx-notification__notification-appending');
	            }, 100);
	
	            addToQueue({ type: type, close: close });
	        };
	
	        /**
	        *  Remove notification block
	        */
	        function close() {
	
	            notification.remove();
	        };
	
	        if (constructorSettings) {
	
	            create(constructorSettings);
	            send();
	        }
	
	        return {
	            create: create,
	            send: send,
	            close: close
	        };
	    };
	
	    notifications.clear = function () {
	
	        editor.nodes.notifications.innerHTML = '';
	        queue = [];
	    };
	
	    return notifications;
	}({});

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	
	/**
	 * Codex Editor Parser Module
	 *
	 * @author Codex Team
	 * @version 1.1
	 */
	
	module.exports = function (parser) {
	
	    var editor = codex.editor;
	
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
	
	        return node.nodeType == editor.core.nodeTypes.TAG && node.classList.contains(editor.ui.className.BLOCK_CLASSNAME);
	    };
	
	    return parser;
	}({});

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Paste module
	 *
	 * @author Codex Team
	 * @version 1.1.1
	 */
	
	module.exports = function (paste) {
	
	    var editor = codex.editor;
	
	    var patterns = [];
	
	    paste.prepare = function () {
	
	        var tools = editor.tools;
	
	        for (var tool in tools) {
	
	            if (!tools[tool].renderOnPastePatterns || !Array.isArray(tools[tool].renderOnPastePatterns)) {
	
	                continue;
	            }
	
	            tools[tool].renderOnPastePatterns.map(function (pattern) {
	
	                patterns.push(pattern);
	            });
	        }
	
	        return Promise.resolve();
	    };
	
	    /**
	     * Saves data
	     * @param event
	     */
	    paste.pasted = function (event) {
	
	        var clipBoardData = event.clipboardData || window.clipboardData,
	            content = clipBoardData.getData('Text');
	
	        var result = analize(content);
	
	        if (result) {
	
	            event.preventDefault();
	            event.stopImmediatePropagation();
	        }
	
	        return result;
	    };
	
	    /**
	     * Analizes pated string and calls necessary method
	     */
	
	    var analize = function analize(string) {
	
	        var result = false,
	            content = editor.content.currentNode,
	            plugin = content.dataset.tool;
	
	        patterns.map(function (pattern) {
	
	            var execArray = pattern.regex.exec(string),
	                match = execArray && execArray[0];
	
	            if (match && match === string.trim()) {
	
	                /** current block is not empty */
	                if (content.textContent.trim() && plugin == editor.settings.initialBlockPlugin) {
	
	                    pasteToNewBlock_();
	                }
	
	                pattern.callback(string, pattern);
	                result = true;
	            }
	        });
	
	        return result;
	    };
	
	    var pasteToNewBlock_ = function pasteToNewBlock_() {
	
	        /** Create new initial block */
	        editor.content.insertBlock({
	
	            type: editor.settings.initialBlockPlugin,
	            block: editor.tools[editor.settings.initialBlockPlugin].render({
	                text: ''
	            })
	
	        }, false);
	    };
	
	    /**
	     * This method prevents default behaviour.
	     *
	     * @param {Object} event
	     * @protected
	     *
	     * @description We get from clipboard pasted data, sanitize, make a fragment that contains of this sanitized nodes.
	     * Firstly, we need to memorize the caret position. We can do that by getting the range of selection.
	     * After all, we insert clear fragment into caret placed position. Then, we should move the caret to the last node
	     */
	    paste.blockPasteCallback = function (event) {
	
	        if (!needsToHandlePasteEvent(event.target)) {
	
	            return;
	        }
	
	        /** Prevent default behaviour */
	        event.preventDefault();
	
	        /** get html pasted data - dirty data */
	        var htmlData = event.clipboardData.getData('text/html'),
	            plainData = event.clipboardData.getData('text/plain');
	
	        /** Temporary DIV that is used to work with text's paragraphs as DOM-elements*/
	        var paragraphs = editor.draw.node('DIV', '', {}),
	            cleanData,
	            wrappedData;
	
	        /** Create fragment, that we paste to range after proccesing */
	        cleanData = editor.sanitizer.clean(htmlData);
	
	        /**
	         * We wrap pasted text with <p> tags to split it logically
	         * @type {string}
	         */
	        wrappedData = editor.content.wrapTextWithParagraphs(cleanData, plainData);
	        paragraphs.innerHTML = wrappedData;
	
	        /**
	         * If there only one paragraph, just insert in at the caret location
	         */
	        if (paragraphs.childNodes.length == 1) {
	
	            emulateUserAgentBehaviour(paragraphs.firstChild);
	            return;
	        }
	
	        insertPastedParagraphs(paragraphs.childNodes);
	    };
	
	    /**
	     * Checks if we should handle paste event on block
	     * @param block
	     *
	     * @return {boolean}
	     */
	    var needsToHandlePasteEvent = function needsToHandlePasteEvent(block) {
	
	        /** If area is input or textarea then allow default behaviour */
	        if (editor.core.isNativeInput(block)) {
	
	            return false;
	        }
	
	        var editableParent = editor.content.getEditableParent(block);
	
	        /** Allow paste when event target placed in Editable element */
	        if (!editableParent) {
	
	            return false;
	        }
	
	        return true;
	    };
	
	    /**
	     * Inserts new initial plugin blocks with data in paragraphs
	     *
	     * @param {Array} paragraphs - array of paragraphs (<p></p>) whit content, that should be inserted
	     */
	    var insertPastedParagraphs = function insertPastedParagraphs(paragraphs) {
	
	        var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin,
	            currentNode = editor.content.currentNode;
	
	        paragraphs.forEach(function (paragraph) {
	
	            /** Don't allow empty paragraphs */
	            if (editor.core.isBlockEmpty(paragraph)) {
	
	                return;
	            }
	
	            editor.content.insertBlock({
	                type: NEW_BLOCK_TYPE,
	                block: editor.tools[NEW_BLOCK_TYPE].render({
	                    text: paragraph.innerHTML
	                })
	            });
	
	            editor.caret.inputIndex++;
	        });
	
	        editor.caret.setToPreviousBlock(editor.caret.getCurrentInputIndex() + 1);
	
	        /**
	         * If there was no data in working node, remove it
	         */
	        if (editor.core.isBlockEmpty(currentNode)) {
	
	            currentNode.remove();
	            editor.ui.saveInputs();
	        }
	    };
	
	    /**
	     * Inserts node content at the caret position
	     *
	     * @param {Node} node - DOM node (could be DocumentFragment), that should be inserted at the caret location
	     */
	    var emulateUserAgentBehaviour = function emulateUserAgentBehaviour(node) {
	
	        var newNode;
	
	        if (node.childElementCount) {
	
	            newNode = document.createDocumentFragment();
	
	            node.childNodes.forEach(function (current) {
	
	                if (!editor.core.isDomNode(current) && current.data.trim() === '') {
	
	                    return;
	                }
	
	                newNode.appendChild(current.cloneNode(true));
	            });
	        } else {
	
	            newNode = document.createTextNode(node.textContent);
	        }
	
	        editor.caret.insertNode(newNode);
	    };
	
	    return paste;
	}({});

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Renderer Module
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	module.exports = function (renderer) {
	
	    var editor = codex.editor;
	
	    /**
	     * Asyncronously parses input JSON to redactor blocks
	     */
	    renderer.makeBlocksFromData = function () {
	
	        /**
	         * If redactor is empty, add first paragraph to start writing
	         */
	        if (editor.core.isEmpty(editor.state.blocks) || !editor.state.blocks.items.length) {
	
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
	
	            return {
	                tool: blocksList[index],
	                position: index
	            };
	        });
	    };
	
	    /**
	     * Creates editor block by JSON-data
	     *
	     * @uses render method of each plugin
	     *
	     * @param {Object} toolData.tool
	     *                              { header : {
	     *                                                text: '',
	     *                                                type: 'H3', ...
	     *                                            }
	     *                               }
	     * @param {Number} toolData.position - index in input-blocks array
	     * @return {Object} with type and Element
	     */
	    renderer.createBlockFromData = function (toolData) {
	
	        /** New parser */
	        var block,
	            tool = toolData.tool,
	            pluginName = tool.type;
	
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
	
	        if (editor.tools[pluginName].available === false) {
	
	            block = editor.draw.unavailableBlock();
	
	            block.innerHTML = editor.tools[pluginName].loadingMessage;
	
	            /**
	            * Saver will extract data from initial block data by position in array
	            */
	            block.dataset.inputPosition = toolData.position;
	        } else {
	
	            /** New Parser */
	            block = editor.tools[pluginName].render(tool.data);
	        }
	
	        /** is first-level block stretched */
	        var stretched = editor.tools[pluginName].isStretched || false;
	
	        /** Retrun type and block */
	        return {
	            type: pluginName,
	            block: block,
	            stretched: stretched
	        };
	    };
	
	    return renderer;
	}({});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Codex Sanitizer
	 */
	
	module.exports = function (sanitizer) {
	
	    /** HTML Janitor library */
	    var janitor = __webpack_require__(13);
	
	    /** Codex Editor */
	    var editor = codex.editor;
	
	    sanitizer.prepare = function () {
	
	        if (editor.settings.sanitizer && !editor.core.isEmpty(editor.settings.sanitizer)) {
	
	            Config.CUSTOM = editor.settings.sanitizer;
	        }
	    };
	
	    /**
	     * Basic config
	     */
	    var Config = {
	
	        /** User configuration */
	        CUSTOM: null,
	
	        BASIC: {
	
	            tags: {
	                p: {},
	                a: {
	                    href: true,
	                    target: '_blank',
	                    rel: 'nofollow'
	                }
	            }
	        }
	    };
	
	    sanitizer.Config = Config;
	
	    /**
	     *
	     * @param userCustomConfig
	     * @returns {*}
	     * @private
	     *
	     * @description If developer uses editor's API, then he can customize sane restrictions.
	     * Or, sane config can be defined globally in editors initialization. That config will be used everywhere
	     * At least, if there is no config overrides, that API uses BASIC Default configation
	     */
	    var init_ = function init_(userCustomConfig) {
	
	        var configuration = userCustomConfig || Config.CUSTOM || Config.BASIC;
	
	        return new janitor(configuration);
	    };
	
	    /**
	     * Cleans string from unwanted tags
	     * @protected
	     * @param {String} dirtyString - taint string
	     * @param {Object} customConfig - allowed tags
	     */
	    sanitizer.clean = function (dirtyString, customConfig) {
	
	        var janitorInstance = init_(customConfig);
	
	        return janitorInstance.clean(dirtyString);
	    };
	
	    return sanitizer;
	}({});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor Saver
	 *
	 * @author Codex Team
	 * @version 1.1.0
	 */
	
	module.exports = function (saver) {
	
	    var editor = codex.editor;
	
	    /**
	     * @public
	     * Save blocks
	     */
	    saver.save = function () {
	
	        /** Save html content of redactor to memory */
	        editor.state.html = editor.nodes.redactor.innerHTML;
	
	        /** Clean jsonOutput state */
	        editor.state.jsonOutput = [];
	
	        return saveBlocks(editor.nodes.redactor.childNodes);
	    };
	
	    /**
	     * @private
	     * Save each block data
	     *
	     * @param blocks
	     * @returns {Promise.<TResult>}
	     */
	    var saveBlocks = function saveBlocks(blocks) {
	
	        var data = [];
	
	        for (var index = 0; index < blocks.length; index++) {
	
	            data.push(getBlockData(blocks[index]));
	        }
	
	        return Promise.all(data).then(makeOutput).catch(editor.core.log);
	    };
	
	    /** Save and validate block data */
	    var getBlockData = function getBlockData(block) {
	
	        return saveBlockData(block).then(validateBlockData).catch(editor.core.log);
	    };
	
	    /**
	     * @private
	     * Call block`s plugin save method and return saved data
	     *
	     * @param block
	     * @returns {Object}
	     */
	    var saveBlockData = function saveBlockData(block) {
	
	        var pluginName = block.dataset.tool;
	
	        /** Check for plugin existence */
	        if (!editor.tools[pluginName]) {
	
	            editor.core.log('Plugin \xAB' + pluginName + '\xBB not found', 'error');
	            return { data: null, pluginName: null };
	        }
	
	        /** Check for plugin having save method */
	        if (typeof editor.tools[pluginName].save !== 'function') {
	
	            editor.core.log('Plugin \xAB' + pluginName + '\xBB must have save method', 'error');
	            return { data: null, pluginName: null };
	        }
	
	        /** Result saver */
	        var blockContent = block.childNodes[0],
	            pluginsContent = blockContent.childNodes[0],
	            position = pluginsContent.dataset.inputPosition;
	
	        /** If plugin wasn't available then return data from cache */
	        if (editor.tools[pluginName].available === false) {
	
	            return Promise.resolve({ data: codex.editor.state.blocks.items[position].data, pluginName: pluginName });
	        }
	
	        return Promise.resolve(pluginsContent).then(editor.tools[pluginName].save).then(function (data) {
	            return Object({ data: data, pluginName: pluginName });
	        });
	    };
	
	    /**
	     * Call plugin`s validate method. Return false if validation failed
	     *
	     * @param data
	     * @param pluginName
	     * @returns {Object|Boolean}
	     */
	    var validateBlockData = function validateBlockData(_ref) {
	        var data = _ref.data,
	            pluginName = _ref.pluginName;
	
	
	        if (!data || !pluginName) {
	
	            return false;
	        }
	
	        if (editor.tools[pluginName].validate) {
	
	            var result = editor.tools[pluginName].validate(data);
	
	            /**
	             * Do not allow invalid data
	             */
	            if (!result) {
	
	                return false;
	            }
	        }
	
	        return { data: data, pluginName: pluginName };
	    };
	
	    /**
	     * Compile article output
	     *
	     * @param savedData
	     * @returns {{time: number, version, items: (*|Array)}}
	     */
	    var makeOutput = function makeOutput(savedData) {
	
	        savedData = savedData.filter(function (blockData) {
	            return blockData;
	        });
	
	        var items = savedData.map(function (blockData) {
	            return Object({ type: blockData.pluginName, data: blockData.data });
	        });
	
	        editor.state.jsonOutput = items;
	
	        return {
	            id: editor.state.blocks.id || null,
	            time: +new Date(),
	            version: editor.version,
	            items: items
	        };
	    };
	
	    return saver;
	}({});

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 *
	 * Codex.Editor Transport Module
	 *
	 * @copyright 2017 Codex-Team
	 * @version 1.2.0
	 */
	
	module.exports = function (transport) {
	
	    var editor = codex.editor;
	
	    /**
	     * @private {Object} current XmlHttpRequest instance
	     */
	    var currentRequest = null;
	
	    /**
	     * @type {null} | {DOMElement} input - keeps input element in memory
	     */
	    transport.input = null;
	
	    /**
	     * @property {Object} arguments - keep plugin settings and defined callbacks
	     */
	    transport.arguments = null;
	
	    /**
	     * Prepares input element where will be files
	     */
	    transport.prepare = function () {
	
	        var input = editor.draw.node('INPUT', '', { type: 'file' });
	
	        editor.listeners.add(input, 'change', editor.transport.fileSelected);
	        editor.transport.input = input;
	    };
	
	    /** Clear input when files is uploaded */
	    transport.clearInput = function () {
	
	        /** Remove old input */
	        transport.input = null;
	
	        /** Prepare new one */
	        transport.prepare();
	    };
	
	    /**
	     * Callback for file selection
	     * @param {Event} event
	     */
	    transport.fileSelected = function () {
	
	        var input = this,
	            i,
	            files = input.files,
	            formData = new FormData();
	
	        if (editor.transport.arguments.multiple === true) {
	
	            for (i = 0; i < files.length; i++) {
	
	                formData.append('files[]', files[i], files[i].name);
	            }
	        } else {
	
	            formData.append('files', files[0], files[0].name);
	        }
	
	        currentRequest = editor.core.ajax({
	            type: 'POST',
	            data: formData,
	            url: editor.transport.arguments.url,
	            beforeSend: editor.transport.arguments.beforeSend,
	            success: editor.transport.arguments.success,
	            error: editor.transport.arguments.error,
	            progress: editor.transport.arguments.progress
	        });
	
	        /** Clear input */
	        transport.clearInput();
	    };
	
	    /**
	     * Use plugin callbacks
	     * @protected
	     *
	     * @param {Object} args - can have :
	     * @param {String} args.url - fetch URL
	     * @param {Function} args.beforeSend - function calls before sending ajax
	     * @param {Function} args.success - success callback
	     * @param {Function} args.error - on error handler
	     * @param {Function} args.progress - xhr onprogress handler
	     * @param {Boolean} args.multiple - allow select several files
	     * @param {String} args.accept - adds accept attribute
	     */
	    transport.selectAndUpload = function (args) {
	
	        transport.arguments = args;
	
	        if (args.multiple === true) {
	
	            transport.input.setAttribute('multiple', 'multiple');
	        }
	
	        if (args.accept) {
	
	            transport.input.setAttribute('accept', args.accept);
	        }
	
	        transport.input.click();
	    };
	
	    transport.abort = function () {
	
	        currentRequest.abort();
	
	        currentRequest = null;
	    };
	
	    return transport;
	}({});

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function () {
	    function Events() {
	        _classCallCheck(this, Events);
	
	        this.subscribers = {};
	    }
	
	    _createClass(Events, [{
	        key: "on",
	        value: function on(eventName, callback) {
	
	            if (!(eventName in this.subscribers)) {
	
	                this.subscribers[eventName] = [];
	            }
	
	            // group by events
	            this.subscribers[eventName].push(callback);
	        }
	    }, {
	        key: "emit",
	        value: function emit(eventName, data) {
	
	            this.subscribers[eventName].reduce(function (previousData, currentHandler) {
	
	                var newData = currentHandler(previousData);
	
	                return newData ? newData : previousData;
	            }, data);
	        }
	    }]);
	
	    return Events;
	}();

/***/ }),
/* 17 */
/***/ (function(module, exports) {

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
	
	module.exports = function (inline) {
	
	    var editor = codex.editor;
	
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
	
	        var selectedText = inline.getSelectionText(),
	            toolbar = editor.nodes.inlineToolbar.wrapper;
	
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
	    inline.getSelectionText = function () {
	
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
	
	    /**
	    * Callback for keydowns in inline toolbar "Insert link..." input
	    */
	    var inlineToolbarAnchorInputKeydown_ = function inlineToolbarAnchorInputKeydown_(event) {
	
	        if (event.keyCode != editor.core.keys.ENTER) {
	
	            return;
	        }
	
	        var editable = editor.content.currentNode,
	            storedSelection = editor.toolbar.inline.storedSelection;
	
	        editor.toolbar.inline.restoreSelection(editable, storedSelection);
	        editor.toolbar.inline.setAnchor(this.value);
	
	        /**
	         * Preventing events that will be able to happen
	         */
	        event.preventDefault();
	        event.stopImmediatePropagation();
	
	        editor.toolbar.inline.clearRange();
	    };
	
	    /** Action for link creation or for setting anchor */
	    inline.createLinkAction = function (event) {
	
	        var isActive = this.isLinkActive();
	
	        var editable = editor.content.currentNode,
	            storedSelection = editor.toolbar.inline.saveSelection(editable);
	
	        /** Save globally selection */
	        editor.toolbar.inline.storedSelection = storedSelection;
	
	        if (isActive) {
	
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
	
	            /**
	             * focus to input
	             * Solution: https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/focus
	             * Prevents event after showing input and when we need to focus an input which is in unexisted form
	             */
	            action.focus();
	            event.preventDefault();
	
	            /** Callback to link action */
	            editor.listeners.add(action, 'keydown', inlineToolbarAnchorInputKeydown_, false);
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

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Toolbar settings
	 *
	 * @version 1.0.5
	 */
	
	module.exports = function (settings) {
	
	    var editor = codex.editor;
	
	    settings.opened = false;
	
	    settings.setting = null;
	    settings.actions = null;
	
	    /**
	     * Append and open settings
	     */
	    settings.open = function (toolType) {
	
	        /**
	         * Append settings content
	         * It's stored in tool.settings
	         */
	        if (!editor.tools[toolType] || !editor.tools[toolType].makeSettings) {
	
	            return;
	        }
	
	        /**
	         * Draw settings block
	         */
	        var settingsBlock = editor.tools[toolType].makeSettings();
	
	        editor.nodes.pluginSettings.appendChild(settingsBlock);
	
	        /** Open settings block */
	        editor.nodes.blockSettings.classList.add('opened');
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
	     * Here we will draw buttons and add listeners to components
	     */
	    settings.makeRemoveBlockButton = function () {
	
	        var removeBlockWrapper = editor.draw.node('SPAN', 'ce-toolbar__remove-btn', {}),
	            settingButton = editor.draw.node('SPAN', 'ce-toolbar__remove-setting', { innerHTML: '<i class="ce-icon-trash"></i>' }),
	            actionWrapper = editor.draw.node('DIV', 'ce-toolbar__remove-confirmation', {}),
	            confirmAction = editor.draw.node('DIV', 'ce-toolbar__remove-confirm', { textContent: 'Удалить блок' }),
	            cancelAction = editor.draw.node('DIV', 'ce-toolbar__remove-cancel', { textContent: 'Отмена' });
	
	        editor.listeners.add(settingButton, 'click', editor.toolbar.settings.removeButtonClicked, false);
	
	        editor.listeners.add(confirmAction, 'click', editor.toolbar.settings.confirmRemovingRequest, false);
	
	        editor.listeners.add(cancelAction, 'click', editor.toolbar.settings.cancelRemovingRequest, false);
	
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

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

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
	
	module.exports = function (toolbar) {
	
	    var editor = codex.editor;
	
	    toolbar.settings = __webpack_require__(18);
	    toolbar.inline = __webpack_require__(17);
	    toolbar.toolbox = __webpack_require__(20);
	
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
	
	        if (editor.hideToolbar) {
	
	            return;
	        }
	
	        var toolType = editor.content.currentNode.dataset.tool;
	
	        if (!editor.tools[toolType] || !editor.tools[toolType].makeSettings) {
	
	            editor.nodes.showSettingsButton.classList.add('hide');
	        } else {
	
	            editor.nodes.showSettingsButton.classList.remove('hide');
	        }
	
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
	
	        var newYCoordinate = editor.content.currentNode.offsetTop - editor.toolbar.defaultToolbarHeight / 2 + editor.toolbar.defaultOffset;
	
	        editor.nodes.toolbar.style.transform = 'translate3D(0, ' + Math.floor(newYCoordinate) + 'px, 0)';
	
	        /** Close trash actions */
	        editor.toolbar.settings.hideRemoveActions();
	    };
	
	    return toolbar;
	}({});

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Codex Editor toolbox
	 *
	 * All tools be able to appended here
	 *
	 * @author Codex Team
	 * @version 1.0
	 */
	
	module.exports = function (toolbox) {
	
	    var editor = codex.editor;
	
	    toolbox.opened = false;
	    toolbox.openedOnBlock = null;
	
	    /** Shows toolbox */
	    toolbox.open = function () {
	
	        /** Close setting if toolbox is opened */
	        if (editor.toolbar.settings.opened) {
	
	            editor.toolbar.settings.close();
	        }
	
	        /** Add 'toolbar-opened' class for current block **/
	        toolbox.openedOnBlock = editor.content.currentNode;
	        toolbox.openedOnBlock.classList.add('toolbar-opened');
	
	        /** display toolbox */
	        editor.nodes.toolbox.classList.add('opened');
	
	        /** Animate plus button */
	        editor.nodes.plusButton.classList.add('clicked');
	
	        /** toolbox state */
	        editor.toolbar.toolbox.opened = true;
	    };
	
	    /** Closes toolbox */
	    toolbox.close = function () {
	
	        /** Remove 'toolbar-opened' class from current block **/
	        if (toolbox.openedOnBlock) toolbox.openedOnBlock.classList.remove('toolbar-opened');
	        toolbox.openedOnBlock = null;
	
	        /** Makes toolbox disappear */
	        editor.nodes.toolbox.classList.remove('opened');
	
	        /** Rotate plus button */
	        editor.nodes.plusButton.classList.remove('clicked');
	
	        /** toolbox state */
	        editor.toolbar.toolbox.opened = false;
	
	        editor.toolbar.current = null;
	    };
	
	    toolbox.leaf = function () {
	
	        var currentTool = editor.toolbar.current,
	            tools = Object.keys(editor.tools),
	            barButtons = editor.nodes.toolbarButtons,
	            nextToolIndex = 0,
	            toolToSelect = void 0,
	            visibleTool = void 0,
	            tool = void 0;
	
	        if (!currentTool) {
	
	            /** Get first tool from object*/
	            for (tool in editor.tools) {
	
	                if (editor.tools[tool].displayInToolbox) {
	
	                    break;
	                }
	
	                nextToolIndex++;
	            }
	        } else {
	
	            nextToolIndex = (tools.indexOf(currentTool) + 1) % tools.length;
	            visibleTool = tools[nextToolIndex];
	
	            while (!editor.tools[visibleTool].displayInToolbox) {
	
	                nextToolIndex = (nextToolIndex + 1) % tools.length;
	                visibleTool = tools[nextToolIndex];
	            }
	        }
	
	        toolToSelect = tools[nextToolIndex];
	
	        for (var button in barButtons) {
	
	            barButtons[button].classList.remove('selected');
	        }
	
	        barButtons[toolToSelect].classList.add('selected');
	        editor.toolbar.current = toolToSelect;
	    };
	
	    /**
	     * Transforming selected node type into selected toolbar element type
	     * @param {event} event
	     */
	    toolbox.toolClicked = function (event) {
	
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
	
	        window.setTimeout(function () {
	
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

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * @module Codex Editor Tools Submodule
	 *
	 * Creates Instances from Plugins and binds external config to the instances
	 */
	
	/**
	 * Load user defined tools
	 * Tools must contain the following important objects:
	 *
	 * @typedef {Object} ToolsConfig
	 * @property {String} iconClassname - this a icon in toolbar
	 * @property {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
	 * @property {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
	 */
	
	/**
	 * Class properties:
	 *
	 * @property {String} this.name - name of this module
	 * @property {Array} this.toolInstances - list of tool instances
	 * @property {EditorConfig} this.config - Editor config
	 *
	 */
	module.exports = function () {
	    _createClass(Tools, [{
	        key: 'state',
	
	
	        /**
	         * @param Editor
	         * @param Editor.modules {@link CodexEditor#moduleInstances}
	         * @param Editor.config {@link CodexEditor#configuration}
	         */
	        set: function set(Editor) {
	
	            this.Editor = Editor;
	        }
	
	        /**
	         * If config wasn't passed by user
	         * @return {ToolsConfig}
	         */
	
	    }, {
	        key: 'defaultConfig',
	        get: function get() {
	
	            return {
	                iconClassName: 'default-icon',
	                displayInToolbox: false,
	                enableLineBreaks: false
	            };
	        }
	
	        /**
	         * @constructor
	         *
	         * @param {ToolsConfig} config
	         */
	
	    }], [{
	        key: 'name',
	        get: function get() {
	
	            return 'tools';
	        }
	    }]);
	
	    function Tools(_ref) {
	        var config = _ref.config;
	
	        _classCallCheck(this, Tools);
	
	        this.config = config;
	        this.toolInstances = [];
	
	        this.util = __webpack_require__(23);
	    }
	
	    /**
	     * Creates instances via passed or default configuration
	     * @return {boolean}
	     */
	
	
	    _createClass(Tools, [{
	        key: 'prepare',
	        value: function prepare() {
	
	            if (!this.config.hasOwnProperty('tools')) {
	
	                return Promise.reject("Can't start without tools");
	            }
	
	            var plugins = this.getListOfPrepareFunctions();
	
	            return this.util.sequence(plugins, this.success, this.fallback);
	        }
	    }, {
	        key: 'success',
	        value: function success(tool) {
	
	            console.log('Success!', tool);
	        }
	    }, {
	        key: 'fallback',
	        value: function fallback(tool) {
	
	            console.log('Module is not available', tool);
	        }
	
	        /**
	         * Binds prepare function of plugins with user or default config
	         *
	         * @return {Array} list of functions that needs to be fired sequently
	         */
	
	    }, {
	        key: 'getListOfPrepareFunctions',
	        value: function getListOfPrepareFunctions() {
	
	            var toolConfig = this.defaultConfig;
	            var toolPreparationList = [];
	
	            for (var tool in this.config.tools) {
	
	                var toolClass = this.config.tools[tool],
	                    toolName = toolClass.name.toLowerCase();
	
	                if (toolName in this.config.toolsConfig) {
	
	                    toolConfig = this.config.toolsConfig[toolName];
	                }
	
	                if (toolClass.prepare && typeof toolClass.prepare === 'function') {
	
	                    toolPreparationList.push(toolClass.prepare.bind(toolConfig));
	                }
	            }
	
	            return toolPreparationList;
	        }
	
	        /**
	         * Returns all tools
	         * @return {Array}
	         */
	
	    }, {
	        key: 'getTools',
	        value: function getTools() {
	
	            return this.toolInstances;
	        }
	    }]);
	
	    return Tools;
	}();
	// /**
	// * Module working with plugins
	// */
	// module.exports = (function () {
	//
	//     let editor = codex.editor;
	//
	//     /**
	//      * Initialize plugins before using
	//      * Ex. Load scripts or call some internal methods
	//      * @return Promise
	//      */
	//     function prepare() {
	//
	//         return new Promise(function (resolve_, reject_) {
	//
	//             Promise.resolve()
	//
	//                 /**
	//                 * Compose a sequence of plugins that requires preparation
	//                 */
	//                 .then(function () {
	//
	//                     let pluginsRequiresPreparation = [],
	//                         allPlugins = editor.tools;
	//
	//                     for ( let pluginName in allPlugins ) {
	//
	//                         let plugin = allPlugins[pluginName];
	//
	//                         if (plugin.prepare && typeof plugin.prepare != 'function' || !plugin.prepare) {
	//
	//                             continue;
	//
	//                         }
	//
	//                         pluginsRequiresPreparation.push(plugin);
	//
	//                     }
	//
	//                     /**
	//                     * If no one passed plugins requires preparation, finish prepare() and go ahead
	//                     */
	//                     if (!pluginsRequiresPreparation.length) {
	//
	//                         resolve_();
	//
	//                     }
	//
	//                     return pluginsRequiresPreparation;
	//
	//                 })
	//
	//                 /** Wait plugins while they prepares */
	//                 .then(waitAllPluginsPreparation_)
	//
	//                 .then(function () {
	//
	//                     editor.core.log('Plugins loaded', 'info');
	//                     resolve_();
	//
	//                 }).catch(function (error) {
	//
	//                     reject_(error);
	//
	//                 });
	//
	//         });
	//
	//     }
	//
	//     /**
	//     * @param {array} plugins - list of tools that requires preparation
	//     * @return {Promise} resolved while all plugins will be ready or failed
	//     */
	//     function waitAllPluginsPreparation_(plugins) {
	//
	//         /**
	//         * @calls allPluginsProcessed__ when all plugins prepared or failed
	//         */
	//         return new Promise (function (allPluginsProcessed__) {
	//
	//             plugins.reduce(function (previousValue, plugin, iteration) {
	//
	//                 return previousValue.then(function () {
	//
	//                     /**
	//                     * Wait till plugins prepared
	//                     * @calls pluginIsReady__ when plugin is ready or failed
	//                     */
	//                     return new Promise ( function (pluginIsReady__) {
	//
	//                         callPluginsPrepareMethod_( plugin )
	//
	//                             .then( pluginIsReady__ )
	//                             .then( function () {
	//
	//                                 plugin.available = true;
	//
	//                             })
	//
	//                             .catch(function (error) {
	//
	//                                 editor.core.log(`Plugin «${plugin.type}» was not loaded. Preparation failed because %o`, 'warn', error);
	//                                 plugin.available = false;
	//                                 plugin.loadingMessage = error;
	//
	//                                 /** Go ahead even some plugin has problems */
	//                                 pluginIsReady__();
	//
	//                             })
	//
	//                             .then(function () {
	//
	//                                 /** If last plugin has problems then just ignore and continue */
	//                                 if (iteration == plugins.length - 1) {
	//
	//                                     allPluginsProcessed__();
	//
	//                                 }
	//
	//                             });
	//
	//                     });
	//
	//                 });
	//
	//             }, Promise.resolve() );
	//
	//         });
	//
	//     }
	//
	//     var callPluginsPrepareMethod_ = function (plugin) {
	//
	//         return plugin.prepare( plugin.config || {} );
	//
	//     };
	//
	//     return {
	//         prepare: prepare
	//     };
	//
	// }());

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _dom = __webpack_require__(24);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Module UI
	 *
	 * @type {UI}
	 */
	// let className = {
	
	/**
	 * @const {string} BLOCK_CLASSNAME - redactor blocks name
	 */
	// BLOCK_CLASSNAME : 'ce-block',
	
	/**
	 * @const {String} wrapper for plugins content
	 */
	// BLOCK_CONTENT : 'ce-block__content',
	
	/**
	 * @const {String} BLOCK_STRETCHED - makes block stretched
	 */
	// BLOCK_STRETCHED : 'ce-block--stretched',
	
	/**
	 * @const {String} BLOCK_HIGHLIGHTED - adds background
	 */
	// BLOCK_HIGHLIGHTED : 'ce-block--focused',
	
	/**
	 * @const {String} - for all default settings
	 */
	// SETTINGS_ITEM : 'ce-settings__item'
	// };
	
	var CSS = {
	  editorWrapper: 'codex-editor',
	  editorZone: 'ce-redactor'
	};
	
	/**
	 * @class
	 *
	 * @classdesc Makes CodeX Editor UI:
	 *                <codex-editor>
	 *                    <ce-redactor />
	 *                    <ce-toolbar />
	 *                    <ce-inline-toolbar />
	 *                </codex-editor>
	 *
	 * @property {EditorConfig} config   - editor configuration {@link CodexEditor#configuration}
	 * @property {Object} Editor         - available editor modules {@link CodexEditor#moduleInstances}
	 * @property {Object} nodes          -
	 * @property {Element} nodes.wrapper  - element where we need to append redactor
	 * @property {Element} nodes.wrapper  - <codex-editor>
	 * @property {Element} nodes.redactor - <ce-redactor>
	 */
	module.exports = function () {
	  _createClass(UI, null, [{
	    key: 'name',
	
	
	    /**
	     * Module key name
	     * @returns {string}
	     */
	    get: function get() {
	
	      return 'ui';
	    }
	
	    /**
	     * @constructor
	     *
	     * @param  {EditorConfig} config
	     */
	
	  }]);
	
	  function UI(_ref) {
	    var config = _ref.config;
	
	    _classCallCheck(this, UI);
	
	    this.config = config;
	    this.Editor = null;
	
	    this.nodes = {
	      holder: null,
	      wrapper: null,
	      redactor: null
	    };
	  }
	
	  /**
	   * Editor modules setter
	   * @param {object} Editor - available editor modules
	   */
	
	
	  _createClass(UI, [{
	    key: 'prepare',
	
	
	    /**
	     * @protected
	     *
	     * Making main interface
	     */
	    value: function prepare() {
	      var _this = this;
	
	      return new Promise(function (resolve, reject) {
	
	        /**
	         * Element where we need to append CodeX Editor
	         * @type {Element}
	         */
	        _this.nodes.holder = document.getElementById(_this.config.holderId);
	
	        if (!_this.nodes.holder) {
	
	          reject(Error("Holder wasn't found by ID: #" + _this.config.holderId));
	          return;
	        }
	
	        /**
	         * Create and save main UI elements
	         */
	        _this.nodes.wrapper = _dom2.default.make('div', CSS.editorWrapper);
	        _this.nodes.redactor = _dom2.default.make('div', CSS.editorZone);
	        // toolbar  = makeToolBar_();
	
	        // wrapper.appendChild(toolbar);
	        _this.nodes.wrapper.appendChild(_this.nodes.redactor);
	        /**
	         * Append editor wrapper with redactor zone into holder
	         */
	        _this.nodes.holder.appendChild(_this.nodes.wrapper);
	
	        resolve();
	      })
	
	      /** Add toolbox tools */
	      // .then(addTools_)
	
	      /** Make container for inline toolbar */
	      // .then(makeInlineToolbar_)
	
	      /** Add inline toolbar tools */
	      // .then(addInlineToolbarTools_)
	
	      /** Draw wrapper for notifications */
	      // .then(makeNotificationHolder_)
	
	      /** Add eventlisteners to redactor elements */
	      // .then(bindEvents_)
	
	      .catch(function () {
	
	        // editor.core.log("Can't draw editor interface");
	
	      });
	    }
	  }, {
	    key: 'state',
	    set: function set(Editor) {
	
	      this.Editor = Editor;
	    }
	  }]);
	
	  return UI;
	}();
	// /**
	//  * Codex Editor UI module
	//  *
	//  * @author Codex Team
	//  * @version 1.2.0
	//  */
	//
	// module.exports = (function (ui) {
	//
	//     let editor = codex.editor;
	//
	//     /**
	//      * Basic editor classnames
	//      */
	//     ui.prepare = function () {
	//
	
	//
	//     };
	//
	//     /**
	//      * @private
	//      * Draws inline toolbar zone
	//      */
	//     var makeInlineToolbar_ = function () {
	//
	//         var container = editor.draw.inlineToolbar();
	//
	//         /** Append to redactor new inline block */
	//         editor.nodes.inlineToolbar.wrapper = container;
	//
	//         /** Draw toolbar buttons */
	//         editor.nodes.inlineToolbar.buttons = editor.draw.inlineToolbarButtons();
	//
	//         /** Buttons action or settings */
	//         editor.nodes.inlineToolbar.actions = editor.draw.inlineToolbarActions();
	//
	//         /** Append to inline toolbar buttons as part of it */
	//         editor.nodes.inlineToolbar.wrapper.appendChild(editor.nodes.inlineToolbar.buttons);
	//         editor.nodes.inlineToolbar.wrapper.appendChild(editor.nodes.inlineToolbar.actions);
	//
	//         editor.nodes.wrapper.appendChild(editor.nodes.inlineToolbar.wrapper);
	//
	//     };
	//
	//     var makeToolBar_ = function () {
	//
	//         let toolbar         = editor.draw.toolbar(),
	//             blockButtons    = makeToolbarSettings_(),
	//             toolbarContent  = makeToolbarContent_();
	//
	//         /** Appending first-level block buttons */
	//         toolbar.appendChild(blockButtons);
	//
	//         /** Append toolbarContent to toolbar */
	//         toolbar.appendChild(toolbarContent);
	//
	//         /** Make toolbar global */
	//         editor.nodes.toolbar = toolbar;
	//
	//         return toolbar;
	//
	//     };
	//
	//     var makeToolbarContent_ = function () {
	//
	//         let toolbarContent = editor.draw.toolbarContent(),
	//             toolbox        = editor.draw.toolbox(),
	//             plusButton     = editor.draw.plusButton();
	//
	//         /** Append plus button */
	//         toolbarContent.appendChild(plusButton);
	//
	//         /** Appending toolbar tools */
	//         toolbarContent.appendChild(toolbox);
	//
	//         /** Make Toolbox and plusButton global */
	//         editor.nodes.toolbox    = toolbox;
	//         editor.nodes.plusButton = plusButton;
	//
	//         return toolbarContent;
	//
	//     };
	//
	//     var makeToolbarSettings_ = function () {
	//
	//         let blockSettings       = editor.draw.blockSettings(),
	//             blockButtons        = editor.draw.blockButtons(),
	//             defaultSettings     = editor.draw.defaultSettings(),
	//             showSettingsButton  = editor.draw.settingsButton(),
	//             showTrashButton     = editor.toolbar.settings.makeRemoveBlockButton(),
	//             pluginSettings      = editor.draw.pluginsSettings();
	//
	//         /** Add default and plugins settings */
	//         blockSettings.appendChild(pluginSettings);
	//         blockSettings.appendChild(defaultSettings);
	//
	//         /**
	//          * Make blocks buttons
	//          * This block contains settings button and remove block button
	//          */
	//         blockButtons.appendChild(showSettingsButton);
	//         blockButtons.appendChild(showTrashButton);
	//         blockButtons.appendChild(blockSettings);
	//
	//         /** Make BlockSettings, PluginSettings, DefaultSettings global */
	//         editor.nodes.blockSettings      = blockSettings;
	//         editor.nodes.pluginSettings     = pluginSettings;
	//         editor.nodes.defaultSettings    = defaultSettings;
	//         editor.nodes.showSettingsButton = showSettingsButton;
	//         editor.nodes.showTrashButton    = showTrashButton;
	//
	//         return blockButtons;
	//
	//     };
	//
	//     /** Draw notifications holder */
	//     var makeNotificationHolder_ = function () {
	//
	//         /** Append block with notifications to the document */
	//         editor.nodes.notifications = editor.notifications.createHolder();
	//
	//     };
	//
	//     /**
	//      * @private
	//      * Append tools passed in editor.tools
	//      */
	//     var addTools_ = function () {
	//
	//         var tool,
	//             toolName,
	//             toolButton;
	//
	//         for ( toolName in editor.settings.tools ) {
	//
	//             tool = editor.settings.tools[toolName];
	//
	//             editor.tools[toolName] = tool;
	//
	//             if (!tool.iconClassname && tool.displayInToolbox) {
	//
	//                 editor.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', toolName);
	//                 continue;
	//
	//             }
	//
	//             if (typeof tool.render != 'function') {
	//
	//                 editor.core.log('render method missed. Tool %o skipped', 'warn', toolName);
	//                 continue;
	//
	//             }
	//
	//             if (!tool.displayInToolbox) {
	//
	//                 continue;
	//
	//             } else {
	//
	//                 /** if tools is for toolbox */
	//                 toolButton = editor.draw.toolbarButton(toolName, tool.iconClassname);
	//
	//                 editor.nodes.toolbox.appendChild(toolButton);
	//
	//                 editor.nodes.toolbarButtons[toolName] = toolButton;
	//
	//             }
	//
	//         }
	//
	//     };
	//
	//     var addInlineToolbarTools_ = function () {
	//
	//         var tools = {
	//
	//             bold: {
	//                 icon    : 'ce-icon-bold',
	//                 command : 'bold'
	//             },
	//
	//             italic: {
	//                 icon    : 'ce-icon-italic',
	//                 command : 'italic'
	//             },
	//
	//             link: {
	//                 icon    : 'ce-icon-link',
	//                 command : 'createLink'
	//             }
	//         };
	//
	//         var toolButton,
	//             tool;
	//
	//         for(var name in tools) {
	//
	//             tool = tools[name];
	//
	//             toolButton = editor.draw.toolbarButtonInline(name, tool.icon);
	//
	//             editor.nodes.inlineToolbar.buttons.appendChild(toolButton);
	//             /**
	//              * Add callbacks to this buttons
	//              */
	//             editor.ui.setInlineToolbarButtonBehaviour(toolButton, tool.command);
	//
	//         }
	//
	//     };
	//
	//     /**
	//      * @private
	//      * Bind editor UI events
	//      */
	//     var bindEvents_ = function () {
	//
	//         editor.core.log('ui.bindEvents fired', 'info');
	//
	//         // window.addEventListener('error', function (errorMsg, url, lineNumber) {
	//         //     editor.notifications.errorThrown(errorMsg, event);
	//         // }, false );
	//
	//         /** All keydowns on Document */
	//         editor.listeners.add(document, 'keydown', editor.callback.globalKeydown, false);
	//
	//         /** All keydowns on Redactor zone */
	//         editor.listeners.add(editor.nodes.redactor, 'keydown', editor.callback.redactorKeyDown, false);
	//
	//         /** All keydowns on Document */
	//         editor.listeners.add(document, 'keyup', editor.callback.globalKeyup, false );
	//
	//         /**
	//          * Mouse click to radactor
	//          */
	//         editor.listeners.add(editor.nodes.redactor, 'click', editor.callback.redactorClicked, false );
	//
	//         /**
	//          * Clicks to the Plus button
	//          */
	//         editor.listeners.add(editor.nodes.plusButton, 'click', editor.callback.plusButtonClicked, false);
	//
	//         /**
	//          * Clicks to SETTINGS button in toolbar
	//          */
	//         editor.listeners.add(editor.nodes.showSettingsButton, 'click', editor.callback.showSettingsButtonClicked, false );
	//
	//         /** Bind click listeners on toolbar buttons */
	//         for (var button in editor.nodes.toolbarButtons) {
	//
	//             editor.listeners.add(editor.nodes.toolbarButtons[button], 'click', editor.callback.toolbarButtonClicked, false);
	//
	//         }
	//
	//     };
	//
	//     ui.addBlockHandlers = function (block) {
	//
	//         if (!block) return;
	//
	//         /**
	//          * Block keydowns
	//          */
	//         editor.listeners.add(block, 'keydown', editor.callback.blockKeydown, false);
	//
	//         /**
	//          * Pasting content from another source
	//          * We have two type of sanitization
	//          * First - uses deep-first search algorithm to get sub nodes,
	//          * sanitizes whole Block_content and replaces cleared nodes
	//          * This method is deprecated
	//          * Method is used in editor.callback.blockPaste(event)
	//          *
	//          * Secont - uses Mutation observer.
	//          * Observer "observe" DOM changes and send changings to callback.
	//          * Callback gets changed node, not whole Block_content.
	//          * Inserted or changed node, which we've gotten have been cleared and replaced with diry node
	//          *
	//          * Method is used in editor.callback.blockPasteViaSanitize(event)
	//          *
	//          * @uses html-janitor
	//          * @example editor.callback.blockPasteViaSanitize(event), the second method.
	//          *
	//          */
	//         editor.listeners.add(block, 'paste', editor.paste.blockPasteCallback, false);
	//
	//         /**
	//          * Show inline toolbar for selected text
	//          */
	//         editor.listeners.add(block, 'mouseup', editor.toolbar.inline.show, false);
	//         editor.listeners.add(block, 'keyup', editor.toolbar.inline.show, false);
	//
	//     };
	//
	//     /** getting all contenteditable elements */
	//     ui.saveInputs = function () {
	//
	//         var redactor = editor.nodes.redactor;
	//
	//         editor.state.inputs = [];
	//
	//         /** Save all inputs in global variable state */
	//         var inputs = redactor.querySelectorAll('[contenteditable], input, textarea');
	//
	//         Array.prototype.map.call(inputs, function (current) {
	//
	//             if (!current.type || current.type == 'text' || current.type == 'textarea') {
	//
	//                 editor.state.inputs.push(current);
	//
	//             }
	//
	//         });
	//
	//     };
	//
	//     /**
	//      * Adds first initial block on empty redactor
	//      */
	//     ui.addInitialBlock = function () {
	//
	//         var initialBlockType = editor.settings.initialBlockPlugin,
	//             initialBlock;
	//
	//         if ( !editor.tools[initialBlockType] ) {
	//
	//             editor.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
	//             return;
	//
	//         }
	//
	//         initialBlock = editor.tools[initialBlockType].render();
	//
	//         initialBlock.setAttribute('data-placeholder', editor.settings.placeholder);
	//
	//         editor.content.insertBlock({
	//             type  : initialBlockType,
	//             block : initialBlock
	//         });
	//
	//         editor.content.workingNodeChanged(initialBlock);
	//
	//     };
	//
	//     ui.setInlineToolbarButtonBehaviour = function (button, type) {
	//
	//         editor.listeners.add(button, 'mousedown', function (event) {
	//
	//             editor.toolbar.inline.toolClicked(event, type);
	//
	//         }, false);
	//
	//     };
	//
	//     return ui;
	//
	// })({});

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Codex Editor Util
	 */
	module.exports = function () {
	    function Util() {
	        _classCallCheck(this, Util);
	    }
	
	    _createClass(Util, null, [{
	        key: "sequence",
	
	
	        /**
	         * Fires a promise sequence asyncronically
	         *
	         * @param chain
	         * @param success
	         * @param fallback
	         * @return {Promise}
	         */
	        value: function sequence(chain, success, fallback) {
	
	            return new Promise(function (resolve, reject) {
	
	                if (chain.length === 0) {
	
	                    resolve();
	                } else {
	
	                    /**
	                     * pluck each element from queue
	                     * First, send resolved Promise as previous value
	                     * Each plugins "prepare" method returns a Promise, that's why
	                     * reduce current element will not be able to continue while can't get
	                     * a resolved Promise
	                     */
	                    chain.reduce(function (previousBlock, currentBlock, iteration) {
	
	                        return previousBlock.then(function () {
	                            return waitNextBlock(currentBlock, success, fallback);
	                        }).then(function () {
	
	                            // finished
	                            if (iteration == chain.length - 1) {
	
	                                resolve();
	                            }
	                        });
	                    }, Promise.resolve());
	                }
	            });
	
	            /**
	             * Decorator
	             *
	             * @param {Function} block
	             * @param {Function} success
	             * @param {Function} fallback
	             *
	             * @return {Promise}
	             */
	            function waitNextBlock(block, success, fallback) {
	
	                return new Promise(function (resolve, reject) {
	
	                    block().then(function () {
	
	                        success.call(null, block);
	                    }).then(resolve).catch(function (error) {
	
	                        fallback(error);
	
	                        // anyway, go ahead even plugin is not available
	                        resolve();
	                    });
	                });
	            }
	        }
	    }]);
	
	    return Util;
	}();

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * DOM manupulations helper
	 */
	var Dom = function () {
	    function Dom() {
	        _classCallCheck(this, Dom);
	    }
	
	    _createClass(Dom, null, [{
	        key: "make",
	
	
	        /**
	         * Helper for making Elements with classname and attributes
	         *
	         * @param  {string} tagName           - new Element tag name
	         * @param  {array|string} classNames  - list or name of CSS classname(s)
	         * @param  {Object} attributes        - any attributes
	         * @return {Element}
	         */
	        value: function make(tagName, classNames, attributes) {
	
	            var el = document.createElement(tagName);
	
	            if (Array.isArray(classNames)) {
	                var _el$classList;
	
	                (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(classNames));
	            } else if (classNames) {
	
	                el.classList.add(classNames);
	            }
	
	            for (var attrName in attributes) {
	
	                el[attrName] = attributes[attrName];
	            }
	
	            return el;
	        }
	
	        /**
	         * Selector Decorator
	         *
	         * Returns first match
	         *
	         * @param {Element} el - element we searching inside. Default - DOM Document
	         * @param {String} selector - searching string
	         *
	         * @returns {Element}
	         */
	
	    }, {
	        key: "find",
	        value: function find() {
	            var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
	            var selector = arguments[1];
	
	
	            return el.querySelector(selector);
	        }
	
	        /**
	         * Selector Decorator.
	         *
	         * Returns all matches
	         *
	         * @param {Element} el - element we searching inside. Default - DOM Document
	         * @param {String} selector - searching string
	         * @returns {NodeList}
	         */
	
	    }, {
	        key: "findAll",
	        value: function findAll() {
	            var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
	            var selector = arguments[1];
	
	
	            return el.querySelectorAll(selector);
	        }
	    }]);
	
	    return Dom;
	}();
	
	exports.default = Dom;
	;

/***/ })
/******/ ]);
//# sourceMappingURL=codex-editor.js.map