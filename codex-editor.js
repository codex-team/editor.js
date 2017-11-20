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
	module.exports = function () {
	    _createClass(CodexEditor, [{
	        key: 'configuration',
	
	
	        /**
	         * Setting for configuration
	         * @param config
	         */
	        set: function set() {
	            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	
	            this._configuration.holderId = config.holderId;
	            this._configuration.placeholder = config.placeholder || 'write your story...';
	            this._configuration.sanitizer = config.sanitizer || {
	                p: true,
	                b: true,
	                a: true
	            };
	
	            this._configuration.hideToolbar = config.hideToolbar ? config.hideToolbar : false;
	        }
	
	        /**
	         * Returns private property
	         * @returns {{}|*}
	         */
	        ,
	        get: function get() {
	
	            return this._configuration;
	        }
	
	        /**
	         * @param config
	         *
	         * @property this.configuration - editor instance configuration
	         * @property this.moduleInstances - editor module instances
	         */
	
	    }], [{
	        key: 'version',
	
	
	        /** Editor version */
	        get: function get() {
	
	            return ("2.0.0");
	        }
	    }]);
	
	    function CodexEditor(config) {
	
	        'use strict';
	
	        /** Privates */
	
	        var _this = this;
	
	        _classCallCheck(this, CodexEditor);
	
	        this._configuration = {};
	
	        this.configuration = config;
	        this.moduleInstances = [];
	
	        this.eventsDispatcher = new Events();
	
	        return Promise.resolve().then(function () {
	            return _this.init();
	        }).then(function () {
	            return _this.prepare();
	        });
	    }
	
	    /**
	     * Initializes modules:
	     *  First: requiring modules from path
	     *  Second: memorizing the instances
	     */
	
	
	    _createClass(CodexEditor, [{
	        key: 'init',
	        value: function init() {
	
	            var Dom = __webpack_require__(1),
	                Core = __webpack_require__(2),
	                Ui = __webpack_require__(3);
	            // transport       = require('./src/modules/transport'),
	            // renderer        = require('./src/modules/renderer'),
	            // saver           = require('./src/modules/saver'),
	            // content         = require('./src/modules/content'),
	            // toolbar         = require('./src/modules/toolbar/toolbar'),
	            // callbacks       = require('./src/modules/callbacks'),
	            // draw            = require('./src/modules/draw'),
	            // caret           = require('./src/modules/caret'),
	            // notifications   = require('./src/modules/notifications'),
	            // parser          = require('./src/modules/parser'),
	            // sanitizer       = require('./src/modules/sanitizer'),
	            // listeners       = require('./src/modules/listeners'),
	            // destroyer       = require('./src/modules/destroyer'),
	            // paste           = require('./src/modules/paste');
	
	            var moduleList = {
	                'dom': Dom,
	                'core': Core,
	                'ui': Ui
	            };
	
	            for (var moduleName in moduleList) {
	
	                var modules = {};
	
	                for (var moduleExtends in moduleList) {
	
	                    if (moduleExtends === moduleName) {
	
	                        continue;
	                    }
	                    modules[moduleExtends] = moduleList[moduleExtends];
	                }
	
	                this.moduleInstances[moduleName] = new moduleList[moduleName]({
	                    modules: modules,
	                    config: this.configuration,
	                    state: this.state,
	                    nodes: this.nodes
	                });
	            }
	        }
	
	        /**
	         * @param module - module instance
	         * @returns {*}
	         */
	
	    }, {
	        key: 'prepare',
	        value: function prepare(module) {
	
	            function prepareDecorator(module) {
	
	                return module.prepare();
	            }
	
	            return Promise.resolve().then(prepareDecorator(this.moduleInstances['core'])).then(prepareDecorator(this.moduleInstances['ui']));
	            // .then(this.moduleInstances['tools'.prepare])
	            // .catch(function (error) {
	            //
	            //     console.log('Error occured', error);
	            //
	            // });
	
	        }
	    }]);
	
	    return CodexEditor;
	}();
	
	var Events = function () {
	    function Events() {
	        _classCallCheck(this, Events);
	
	        this.subscribers = {};
	    }
	
	    _createClass(Events, [{
	        key: 'on',
	        value: function on(eventName, callback) {
	
	            if (!(eventName in this.subscribers)) {
	
	                this.subscribers[eventName] = [];
	            }
	
	            // group by events
	            this.subscribers[eventName].push(callback);
	        }
	    }, {
	        key: 'emit',
	        value: function emit(eventName, data) {
	
	            this.subscribers[eventName].reduce(function (previousData, currentHandler) {
	
	                var newData = currentHandler(previousData);
	
	                return newData ? newData : previousData;
	            }, data);
	        }
	    }]);
	
	    return Events;
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
	//     /**
	//      * Initialization
	//      * @uses Promise cEditor.core.prepare
	//      * @param {Object} userSettings
	//      * @param {Array}  userSettings.tools       list of plugins
	//      * @param {String} userSettings.holderId    Element's id to append editor
	//      *
	//      * Load user defined tools
	//      * Tools must contain this important objects :
	//      *  @param {String} type - this is a type of plugin. It can be used as plugin name
	//      *  @param {String} iconClassname - this a icon in toolbar
	//      *  @param {Object} make - what should plugin do, when it is clicked
	//      *  @param {Object} appendCallback - callback after clicking
	//      *  @param {Element} settings - what settings does it have
	//      *  @param {Object} render - plugin get JSON, and should return HTML
	//      *  @param {Object} save - plugin gets HTML content, returns JSON
	//      *  @param {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
	//      *  @param {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
	//      *
	//      * @example
	//      *   -  type             : 'header',
	//      *   -  iconClassname    : 'ce-icon-header',
	//      *   -  make             : headerTool.make,
	//      *   -  appendCallback   : headerTool.appendCallback,
	//      *   -  settings         : headerTool.makeSettings(),
	//      *   -  render           : headerTool.render,
	//      *   -  save             : headerTool.save,
	//      *   -  displayInToolbox : true,
	//      *   -  enableLineBreaks : false
	//      */
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
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function () {
	    function Dom() {
	        _classCallCheck(this, Dom);
	    }
	
	    _createClass(Dom, [{
	        key: "make",
	
	
	        /**
	         * Draws element with class and properties
	         *
	         * @param {String} el - Element name
	         * @param {Array} classList - array of CSS classes
	         * @param {Object} properties - list of objects/properties
	         *
	         * @returns {Element}
	         */
	        value: function make(el, classList, properties) {
	
	            var element = document.createElement(el);
	
	            classList.forEach(function (className) {
	
	                element.classList.add(className);
	            });
	
	            for (property in properties) {
	
	                element.property = properties[property];
	            }
	
	            return element;
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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Codex Editor Core
	 *
	 * @author Codex Team
	 * @version 1.1.3
	 */
	module.exports = function () {
	    _createClass(Core, null, [{
	        key: 'scriptPrefix',
	
	
	        /** Editor script prefixes */
	        get: function get() {
	
	            return 'cdx-script-';
	        }
	    }]);
	
	    function Core(Editor) {
	        _classCallCheck(this, Core);
	
	        this.Editor = Editor;
	
	        this.sanitizer = null;
	        this.state = {};
	    }
	
	    /**
	     * @public
	     *
	     * Editor preparing method
	     * @return Promise
	     */
	
	
	    _createClass(Core, [{
	        key: 'prepare',
	        value: function prepare() {
	
	            var self = this;
	
	            return new Promise(function (resolve, reject) {
	
	                if (_typeof(self.Editor.config.holderId) === undefined) {
	
	                    reject(Error("Holder wasn't found by ID: #" + userSettings.holderId));
	                } else {
	
	                    resolve();
	                }
	
	                resolve();
	            });
	        }
	
	        /**
	         * Core custom logger
	         *
	         * @param msg
	         * @param type
	         * @param args
	         */
	
	    }, {
	        key: 'log',
	        value: function log(msg, type, args) {
	
	            type = type || 'log';
	
	            if (!args) {
	
	                args = msg || 'undefined';
	                msg = '[codex-editor]:      %o';
	            } else {
	
	                msg = '[codex-editor]:      ' + msg;
	            }
	
	            try {
	
	                if ('console' in window && window.console[type]) {
	
	                    if (args) window.console[type](msg, args);else window.console[type](msg);
	                }
	            } catch (e) {
	                // do nothing
	            }
	        }
	
	        /**
	         * Native Ajax
	         * @param {String}   settings.url         - request URL
	         * @param {function} settings.beforeSend  - returned value will be passed as context to the Success, Error and Progress callbacks
	         * @param {function} settings.success
	         * @param {function} settings.progress
	         */
	
	    }, {
	        key: 'ajax',
	        value: function ajax(settings) {
	
	            if (!settings || !settings.url) {
	
	                return;
	            }
	
	            var XMLHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
	                encodedString,
	                isFormData,
	                prop;
	
	            settings.async = true;
	            settings.type = settings.type || 'GET';
	            settings.data = settings.data || '';
	            settings['content-type'] = settings['content-type'] || 'application/json; charset=utf-8';
	
	            if (settings.type == 'GET' && settings.data) {
	
	                settings.url = /\?/.test(settings.url) ? settings.url + '&' + settings.data : settings.url + '?' + settings.data;
	            } else {
	
	                encodedString = '';
	                for (prop in settings.data) {
	
	                    encodedString += prop + '=' + encodeURIComponent(settings.data[prop]) + '&';
	                }
	            }
	
	            if (settings.withCredentials) {
	
	                XMLHTTP.withCredentials = true;
	            }
	
	            /**
	             * Value returned in beforeSend funtion will be passed as context to the other response callbacks
	             * If beforeSend returns false, AJAX will be blocked
	             */
	            var responseContext = void 0,
	                beforeSendResult = void 0;
	
	            if (typeof settings.beforeSend === 'function') {
	
	                beforeSendResult = settings.beforeSend.call();
	
	                if (beforeSendResult === false) {
	
	                    return;
	                }
	            }
	
	            XMLHTTP.open(settings.type, settings.url, settings.async);
	
	            /**
	             * If we send FormData, we need no content-type header
	             */
	            isFormData = isFormData_(settings.data);
	
	            if (!isFormData) {
	
	                if (settings.type !== 'POST') {
	
	                    XMLHTTP.setRequestHeader('Content-type', settings['content-type']);
	                } else {
	
	                    XMLHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	                }
	            }
	
	            XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	
	            responseContext = beforeSendResult || XMLHTTP;
	
	            if (typeof settings.progress === 'function') {
	
	                XMLHTTP.upload.onprogress = settings.progress.bind(responseContext);
	            }
	
	            XMLHTTP.onreadystatechange = function () {
	
	                if (XMLHTTP.readyState === 4) {
	
	                    if (XMLHTTP.status === 200) {
	
	                        if (typeof settings.success === 'function') {
	
	                            settings.success.call(responseContext, XMLHTTP.responseText);
	                        }
	                    } else {
	
	                        if (typeof settings.error === 'function') {
	
	                            settings.error.call(responseContext, XMLHTTP.responseText, XMLHTTP.status);
	                        }
	                    }
	                }
	            };
	
	            if (isFormData) {
	
	                // Sending FormData
	                XMLHTTP.send(settings.data);
	            } else {
	
	                // POST requests
	                XMLHTTP.send(encodedString);
	            }
	
	            return XMLHTTP;
	        }
	    }]);
	
	    return Core;
	}();
	// module.exports = (function (core) {
	//
	//     let editor = codex.editor;
	//
	//
	//     /**
	//      * @protected
	//      *
	//      * Helper for insert one element after another
	//      */
	//     core.insertAfter = function (target, element) {
	//
	//         target.parentNode.insertBefore(element, target.nextSibling);
	//
	//     };
	//
	//     /**
	//      * @const
	//      *
	//      * Readable DOM-node types map
	//      */
	//     core.nodeTypes = {
	//         TAG     : 1,
	//         TEXT    : 3,
	//         COMMENT : 8,
	//         DOCUMENT_FRAGMENT: 11
	//     };
	//
	//     /**
	//      * @const
	//      * Readable keys map
	//      */
	//     core.keys = { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, DOWN: 40, RIGHT: 39, DELETE: 46, META: 91 };
	//
	//     /**
	//      * @protected
	//      *
	//      * Check object for DOM node
	//      */
	//     core.isDomNode = function (el) {
	//
	//         return el && typeof el === 'object' && el.nodeType && el.nodeType == this.nodeTypes.TAG;
	//
	//     };
	//
	//     /**
	//     * Checks passed object for emptiness
	//     * @require ES5 - Object.keys
	//     * @param {object}
	//     */
	//     core.isEmpty = function ( obj ) {
	//
	//         return Object.keys(obj).length === 0;
	//
	//     };
	//
	//     /**
	//     * Appends script to head of document
	//     * @return Promise
	//     */
	//     core.importScript = function (scriptPath, instanceName) {
	//
	//         return new Promise(function (resolve, reject) {
	//
	//             let script;
	//
	//             /** Script is already loaded */
	//             if ( !instanceName ) {
	//
	//                 reject('Instance name is missed');
	//
	//             } else if ( document.getElementById(editor.scriptPrefix + instanceName) ) {
	//
	//                 resolve(scriptPath);
	//
	//             }
	//
	//             script = document.createElement('SCRIPT');
	//             script.async = true;
	//             script.defer = true;
	//             script.id = editor.scriptPrefix + instanceName;
	//
	//             script.onload = function () {
	//
	//                 resolve(scriptPath);
	//
	//             };
	//
	//             script.onerror = function () {
	//
	//                 reject(scriptPath);
	//
	//             };
	//
	//             script.src = scriptPath;
	//             document.head.appendChild(script);
	//
	//         });
	//
	//     };
	//
	//     /**
	//      * Function for checking is it FormData object to send.
	//      * @param {Object} object to check
	//      * @return boolean
	//      */
	//     var isFormData_ = function (object) {
	//
	//         return object instanceof FormData;
	//
	//     };
	//
	//     /**
	//      * Check block
	//      * @param target
	//      * @description Checks target is it native input
	//      */
	//     core.isNativeInput = function (target) {
	//
	//         var nativeInputAreas = ['INPUT', 'TEXTAREA'];
	//
	//         return nativeInputAreas.indexOf(target.tagName) != -1;
	//
	//     };
	//
	//     /**
	//      * Check if block is empty
	//      * We should check block textContent, child native inputs and some exceptions like IMG and IFRAME
	//      *
	//      * @param block
	//      * @returns {boolean}
	//      */
	//     core.isBlockEmpty = function (block) {
	//
	//         const EXCEPTION_TAGS = ['IMG', 'IFRAME'];
	//
	//         var nativeInputs         = block.querySelectorAll('textarea, input'),
	//             nativeInputsAreEmpty = true,
	//             textContentIsEmpty   = !block.textContent.trim();
	//
	//         Array.prototype.forEach.call(nativeInputs, function (input) {
	//
	//             if (input.type == 'textarea' || input.type == 'text') {
	//
	//                 nativeInputsAreEmpty = nativeInputsAreEmpty && !input.value.trim();
	//
	//             }
	//
	//         });
	//
	//         return textContentIsEmpty && nativeInputsAreEmpty && !EXCEPTION_TAGS.includes(block.tagName);
	//
	//     };
	//
	//
	//     return core;
	//
	// })({});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Module UI
	 *
	 * @type {UI}
	 */
	var className = {
	
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
	     * @const {String} - for all default settings
	     */
	    SETTINGS_ITEM: 'ce-settings__item'
	};
	
	var CSS_ = {
	    editorWrapper: 'codex-editor',
	    editorZone: 'ce-redactor'
	};
	
	module.exports = function () {
	    function UI(Editor) {
	        _classCallCheck(this, UI);
	
	        this.Editor = Editor;
	
	        this.modules = this.Editor.modules;
	    }
	
	    /**
	     * @protected
	     *
	     * Making main interface
	     */
	
	
	    _createClass(UI, [{
	        key: 'prepare',
	        value: function prepare() {
	
	            return new Promise(function (resolve, reject) {
	
	                var wrapper = this.modules.dom.make('DIV', [CSS_.editorWrapper], {}),
	                    redactor = this.modules.dom.make('DIV', [CSS_.editorZone], {}),
	                    toolbar = makeToolBar_();
	
	                wrapper.appendChild(toolbar);
	                wrapper.appendChild(redactor);
	
	                /** Save created ui-elements to static nodes state */
	                editor.nodes.wrapper = wrapper;
	                editor.nodes.redactor = redactor;
	
	                /** Append editor wrapper with redactor zone into holder */
	                editor.nodes.holder.appendChild(wrapper);
	
	                resolve();
	            })
	
	            /** Add toolbox tools */
	            .then(addTools_)
	
	            /** Make container for inline toolbar */
	            .then(makeInlineToolbar_)
	
	            /** Add inline toolbar tools */
	            .then(addInlineToolbarTools_)
	
	            /** Draw wrapper for notifications */
	            .then(makeNotificationHolder_)
	
	            /** Add eventlisteners to redactor elements */
	            .then(bindEvents_).catch(function () {
	
	                editor.core.log("Can't draw editor interface");
	            });
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

/***/ })
/******/ ]);
//# sourceMappingURL=codex-editor.js.map