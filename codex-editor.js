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
	            this._configuration.sanitizer = config.sanitizer || {};
	
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
	
	            return ("1.7.8");
	        }
	    }]);
	
	    function CodexEditor(config) {
	
	        'use strict';
	
	        /** Privates */
	
	        _classCallCheck(this, CodexEditor);
	
	        this._configuration = {};
	
	        this.configuration = config;
	        this.moduleInstances = [];
	
	        this.eventsDispatcher = new Events();
	
	        this.init();
	    }
	
	    /**
	     * Initializes modules:
	     *  First: requiring modules from path
	     *  Second: memorizing the instances
	     */
	
	
	    _createClass(CodexEditor, [{
	        key: 'init',
	        value: function init() {
	
	            var Core = __webpack_require__(1),
	                Tools = __webpack_require__(2);
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
	                'core': Core,
	                'tools': Tools
	            };
	
	            for (var moduleName in moduleList) {
	
	                var modules = [];
	
	                for (var moduleExtends in moduleList) {
	
	                    if (moduleExtends === moduleName) {
	
	                        continue;
	                    }
	                    modules.push(moduleList[moduleExtends]);
	                }
	
	                this.moduleInstances[moduleName] = new moduleList[moduleName]({
	                    modules: modules,
	                    config: this.configuration,
	                    state: this.state,
	                    nodes: this.nodes
	                });
	            }
	
	            // this.moduleInstances['core'].prepare();
	            Promise.resolve().then(this.moduleInstances['core'].prepare.bind(this.moduleInstances['core']));
	            // .then(this.moduleInstances['ui'].prepare)
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

	'use strict';
	
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
	
	    _createClass(Core, [{
	        key: 'prepare',
	        value: function prepare() {
	
	            console.log(this);
	            var self = this;
	
	            return new Promise(function (resolve, reject) {
	
	                console.log(self);
	                // if (typeof editor.nodes.holder === undefined || editor.nodes.holder === null) {
	                //
	                //     reject(Error("Holder wasn't found by ID: #" + userSettings.holderId));
	                //
	                // } else {
	                //
	                //     resolve();
	                //
	                // }
	                //
	                // resolve();
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
	    }]);
	
	    return Core;
	}();
	// module.exports = (function (core) {
	//
	//     let editor = codex.editor;
	//
	//     /**
	//      * @public
	//      *
	//      * Editor preparing method
	//      * @return Promise
	//      */
	//     core.prepare = function (userSettings) {
	//
	//         return new Promise(function (resolve, reject) {
	//
	//             if ( userSettings ) {
	//
	//                 editor.settings.tools = userSettings.tools || editor.settings.tools;
	//
	//             }
	//
	//             if (userSettings.data) {
	//
	//                 editor.state.blocks = userSettings.data;
	//
	//             }
	//
	//             if (userSettings.initialBlockPlugin) {
	//
	//                 editor.settings.initialBlockPlugin = userSettings.initialBlockPlugin;
	//
	//             }
	//
	//             if (userSettings.sanitizer) {
	//
	//                 editor.settings.sanitizer = userSettings.sanitizer;
	//
	//             }
	//
	//             editor.hideToolbar = userSettings.hideToolbar;
	//
	//             editor.settings.placeholder = userSettings.placeholder || '';
	//
	//             editor.nodes.holder = document.getElementById(userSettings.holderId || editor.settings.holderId);
	//
	//             if (typeof editor.nodes.holder === undefined || editor.nodes.holder === null) {
	//
	//                 reject(Error("Holder wasn't found by ID: #" + userSettings.holderId));
	//
	//             } else {
	//
	//                 resolve();
	//
	//             }
	//
	//         });
	//
	//     };
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
	//      * Native Ajax
	//      * @param {String}   settings.url         - request URL
	//      * @param {function} settings.beforeSend  - returned value will be passed as context to the Success, Error and Progress callbacks
	//      * @param {function} settings.success
	//      * @param {function} settings.progress
	//      */
	//     core.ajax = function (settings) {
	//
	//         if (!settings || !settings.url) {
	//
	//             return;
	//
	//         }
	//
	//         var XMLHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
	//             encodedString,
	//             isFormData,
	//             prop;
	//
	//
	//         settings.async           = true;
	//         settings.type            = settings.type || 'GET';
	//         settings.data            = settings.data || '';
	//         settings['content-type'] = settings['content-type'] || 'application/json; charset=utf-8';
	//
	//         if (settings.type == 'GET' && settings.data) {
	//
	//             settings.url = /\?/.test(settings.url) ? settings.url + '&' + settings.data : settings.url + '?' + settings.data;
	//
	//         } else {
	//
	//             encodedString = '';
	//             for(prop in settings.data) {
	//
	//                 encodedString += (prop + '=' + encodeURIComponent(settings.data[prop]) + '&');
	//
	//             }
	//
	//         }
	//
	//         if (settings.withCredentials) {
	//
	//             XMLHTTP.withCredentials = true;
	//
	//         }
	//
	//         /**
	//          * Value returned in beforeSend funtion will be passed as context to the other response callbacks
	//          * If beforeSend returns false, AJAX will be blocked
	//          */
	//         let responseContext,
	//             beforeSendResult;
	//
	//         if (typeof settings.beforeSend === 'function') {
	//
	//             beforeSendResult = settings.beforeSend.call();
	//
	//             if (beforeSendResult === false) {
	//
	//                 return;
	//
	//             }
	//
	//         }
	//
	//         XMLHTTP.open( settings.type, settings.url, settings.async );
	//
	//         /**
	//          * If we send FormData, we need no content-type header
	//          */
	//         isFormData = isFormData_(settings.data);
	//
	//         if (!isFormData) {
	//
	//             if (settings.type !== 'POST') {
	//
	//                 XMLHTTP.setRequestHeader('Content-type', settings['content-type']);
	//
	//             } else {
	//
	//                 XMLHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	//
	//             }
	//
	//         }
	//
	//         XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	//
	//         responseContext = beforeSendResult || XMLHTTP;
	//
	//         if (typeof settings.progress === 'function') {
	//
	//             XMLHTTP.upload.onprogress = settings.progress.bind(responseContext);
	//
	//         }
	//
	//         XMLHTTP.onreadystatechange = function () {
	//
	//             if (XMLHTTP.readyState === 4) {
	//
	//                 if (XMLHTTP.status === 200) {
	//
	//                     if (typeof settings.success === 'function') {
	//
	//                         settings.success.call(responseContext, XMLHTTP.responseText);
	//
	//                     }
	//
	//                 } else {
	//
	//                     if (typeof settings.error === 'function') {
	//
	//                         settings.error.call(responseContext, XMLHTTP.responseText, XMLHTTP.status);
	//
	//                     }
	//
	//                 }
	//
	//             }
	//
	//         };
	//
	//         if (isFormData) {
	//
	//             // Sending FormData
	//             XMLHTTP.send(settings.data);
	//
	//         } else {
	//
	//             // POST requests
	//             XMLHTTP.send(encodedString);
	//
	//         }
	//
	//         return XMLHTTP;
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
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function () {
	    function Tools() {
	        _classCallCheck(this, Tools);
	    }
	
	    _createClass(Tools, [{
	        key: "prepare",
	        value: function prepare() {}
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
	//             /**
	//              * pluck each element from queue
	//              * First, send resolved Promise as previous value
	//              * Each plugins "prepare" method returns a Promise, that's why
	//              * reduce current element will not be able to continue while can't get
	//              * a resolved Promise
	//              *
	//              * If last plugin is "prepared" then go to the next stage of initialization
	//              */
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

/***/ })
/******/ ]);
//# sourceMappingURL=codex-editor.js.map