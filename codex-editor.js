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

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	
	/**
	 * All Editor components
	 */
	var modules = [__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./src/modules/dom\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./src/modules/core\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./src/modules/ui\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./src/modules/tools\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))];
	
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
	
	        'use strict';
	
	        /**
	         * Configuration object
	         */
	
	        var _this = this;
	
	        _classCallCheck(this, CodexEditor);
	
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
	
	                _this2.moduleInstances[Module.name] = new Module({
	                    config: _this2.configuration
	                });
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
	
	            return Promise.resolve().then(prepareDecorator(this.moduleInstances['core'])).then(prepareDecorator(this.moduleInstances['ui'])).then(prepareDecorator(this.moduleInstances['tools'])).catch(function (error) {
	
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

/***/ })
/******/ ]);
//# sourceMappingURL=codex-editor.js.map