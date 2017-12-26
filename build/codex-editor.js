var CodexEditor =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @abstract
 * @class      Module
 * @classdesc  All modules inherits from this class.
 *
 * @typedef {Module} Module
 * @property {Object} config - Editor user settings
 * @property {Object} Editor - List of Editor modules
 */
var Module = function () {

  /**
   * @constructor
   *
   * @param  {EditorConfig} config
   */
  function Module() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        config = _ref.config;

    _classCallCheck(this, Module);

    if (new.target === Module) {

      throw new TypeError('Constructors for abstract class Module are not allowed.');
    }

    /**
     * @type {EditorConfig}
     */
    this.config = config;

    /**
     * @type {EditorComponents}
     */
    this.Editor = null;
  }

  /**
   * Editor modules setter
   *
   * @param Editor
   * @param Editor.modules {@link CodexEditor#moduleInstances}
   * @param Editor.config {@link CodexEditor#configuration}
   */


  _createClass(Module, [{
    key: 'state',
    set: function set(Editor) {

      this.Editor = Editor;
    }
  }]);

  return Module;
}();

Module.displayName = 'Module';
exports.default = Module;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Codex Editor Util
 */
var Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: 'log',


        /**
         * Custom logger
         *
         * @param {string} msg  - message
         * @param {string} type - logging type 'log'|'warn'|'error'|'info'
         * @param {*} args      - argument to log with a message
         */
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
         * @typedef {Object} ChainData
         * @property {Object} data - data that will be passed to the success or fallback
         * @property {Function} function - function's that must be called asynchronically
         */

        /**
         * Fires a promise sequence asyncronically
         *
         * @param {Object[]} chains - list or ChainData's
         * @param {Function} success - success callback
         * @param {Function} fallback - callback that fires in case of errors
         *
         * @return {Promise}
         */

    }, {
        key: 'sequence',
        value: function sequence(chains) {
            var success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
            var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};


            return new Promise(function (resolve) {

                /**
                 * pluck each element from queue
                 * First, send resolved Promise as previous value
                 * Each plugins "prepare" method returns a Promise, that's why
                 * reduce current element will not be able to continue while can't get
                 * a resolved Promise
                 */
                chains.reduce(function (previousValue, currentValue, iteration) {

                    return previousValue.then(function () {
                        return waitNextBlock(currentValue, success, fallback);
                    }).then(function () {

                        // finished
                        if (iteration === chains.length - 1) {

                            resolve();
                        }
                    });
                }, Promise.resolve());
            });

            /**
             * Decorator
             *
             * @param {ChainData} chainData
             *
             * @param {Function} successCallback
             * @param {Function} fallbackCallback
             *
             * @return {Promise}
             */
            function waitNextBlock(chainData, successCallback, fallbackCallback) {

                return new Promise(function (resolve) {

                    chainData.function().then(function () {

                        successCallback(chainData.data || {});
                    }).then(resolve).catch(function () {

                        fallbackCallback(chainData.data || {});

                        // anyway, go ahead even it falls
                        resolve();
                    });
                });
            }
        }

        /**
         * Make array from array-like collection
         *
         * @param {*} collection
         *
         * @return {Array}
         */

    }, {
        key: 'array',
        value: function array(collection) {

            return Array.prototype.slice.call(collection);
        }

        /**
         * Checks if object is empty
         *
         * @param {Object} object
         * @return {boolean}
         */

    }, {
        key: 'isEmpty',
        value: function isEmpty(object) {

            return Object.keys(object).length === 0 && object.constructor === Object;
        }

        /**
         * Check if passed object is a Promise
         * @param  {*}  object - object to check
         * @return {Boolean}
         */

    }, {
        key: 'isPromise',
        value: function isPromise(object) {

            return Promise.resolve(object) === object;
        }
    }]);

    return Util;
}();

Util.displayName = 'Util';
exports.default = Util;
;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        key: 'make',


        /**
         * Helper for making Elements with classname and attributes
         *
         * @param  {string} tagName           - new Element tag name
         * @param  {array|string} classNames  - list or name of CSS classname(s)
         * @param  {Object} attributes        - any attributes
         * @return {Element}
         */
        value: function make(tagName) {
            var classNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


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
         * Append one or several elements to the parent
         *
         * @param  {Element} parent    - where to append
         * @param  {Element|Element[]} - element ore elements list
         */

    }, {
        key: 'append',
        value: function append(parent, elements) {

            if (Array.isArray(elements)) {

                elements.forEach(function (el) {
                    return parent.appendChild(el);
                });
            } else {

                parent.appendChild(elements);
            }
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
        key: 'find',
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
        key: 'findAll',
        value: function findAll() {
            var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
            var selector = arguments[1];


            return el.querySelectorAll(selector);
        }

        /**
         * Check if object is DOM node
         *
         * @param {Object} node
         * @returns {boolean}
         */

    }, {
        key: 'isElement',
        value: function isElement(node) {

            return node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
        }
    }]);

    return Dom;
}();

Dom.displayName = 'Dom';
exports.default = Dom;
;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 *
 * @property {Tool} tool — current block tool (Paragraph, for example)
 * @property {Object} CSS — block`s css classes
 *
 */

/**
 * @classdesc Abstract Block class that contains block information, tool and tool class instance
 *
 * @property tool - Tool instance
 * @property html - Returns HTML content of plugin
 * @property wrapper - Div element that wraps block content with Tool's content. Has `ce-block` CSS class
 * @property contentNode - Div element that wraps Tool's content. Has `ce-block__content` CSS class
 * @property pluginsContent - HTML content that returns by Tool's render function
 */
var Block = function () {

    /**
     * @constructor
     * @param {String} toolName - Tool name that passed on initialization
     * @param {Object} toolInstance — passed Tool`s instance that rendered the Block
     */
    function Block(toolName, toolInstance) {
        _classCallCheck(this, Block);

        this.name = toolName;
        this.tool = toolInstance;
        this._html = this.compose();
    }

    /**
     * CSS classes for the Block
     * @return {{wrapper: string, content: string}}
     */


    _createClass(Block, [{
        key: 'compose',


        /**
         * Make default block wrappers and put Tool`s content there
         * @returns {HTMLDivElement}
         */
        value: function compose() {

            this.wrapper = $.make('div', Block.CSS.wrapper);
            this.contentNode = $.make('div', Block.CSS.content);
            this.pluginsContent = this.tool.render();

            this.contentNode.appendChild(this.pluginsContent);
            this.wrapper.appendChild(this.contentNode);

            return this.wrapper;
        }

        /**
         * Calls Tool's method
         *
         * Method checks tool property {MethodName}. Fires method with passes params If it is instance of Function
         *
         * @param {String} methodName
         * @param {Object} params
         */

    }, {
        key: 'call',
        value: function call(methodName, params) {

            /**
             * call Tool's method with the instance context
             */
            if (this.tool[methodName] && this.tool[methodName] instanceof Function) {

                this.tool[methodName].call(this.tool, params);
            }
        }

        /**
         * Get Block`s HTML
         * @returns {HTMLElement}
         */

    }, {
        key: 'save',


        /**
         * Extracts data from Block
         * Groups Tool's save processing time
         * @return {Object}
         */
        value: function save() {
            var _this = this;

            var extractedBlock = this.tool.save(this.pluginsContent);

            /** Measuring execution time*/
            var measuringStart = window.performance.now(),
                measuringEnd = void 0;

            return Promise.resolve(extractedBlock).then(function (finishedExtraction) {

                /** measure promise execution */
                measuringEnd = window.performance.now();

                return {
                    data: finishedExtraction,
                    processInfo: {
                        tool: _this.name,
                        time: measuringEnd - measuringStart
                    }
                };
            }).catch(function (error) {

                _.log('Saving proccess for ' + this.tool.name + ' tool failed due to the ' + error, 'log', 'red');
            });
        }

        /**
         * Uses Tool's validation method to check the correctness of output data
         * Tool's validation method is optional
         *
         * @description Method also can return data if it passed the validation
         *
         * @param {Object} data
         * @returns {Boolean|Object} valid
         */

    }, {
        key: 'validateData',
        value: function validateData(data) {

            var isValid = true;

            if (this.tool.validate instanceof Function) {

                isValid = this.tool.validate(data);
            }

            if (!isValid) {

                return false;
            }

            return data;
        }

        /**
         * Check block for emptiness
         * @return {Boolean}
         */

    }, {
        key: 'html',
        get: function get() {

            return this._html;
        }

        /**
         * Get Block's JSON data
         * @return {Object}
         */

    }, {
        key: 'data',
        get: function get() {

            return this.save();
        }
    }, {
        key: 'isEmpty',
        get: function get() {

            /**
             * Allow Tool to represent decorative contentless blocks: for example "* * *"-tool
             * That Tools are not empty
             */
            if (this.tool.contentless) {

                return false;
            }

            var emptyText = this._html.textContent.trim().length === 0,
                emptyMedia = !this.hasMedia;

            return emptyText && emptyMedia;
        }

        /**
         * Check if block has a media content such as images, iframes and other
         * @return {Boolean}
         */

    }, {
        key: 'hasMedia',
        get: function get() {

            /**
             * This tags represents media-content
             * @type {string[]}
             */
            var mediaTags = ['img', 'iframe', 'video', 'audio', 'source', 'input', 'textarea', 'twitterwidget'];

            return !!this._html.querySelector(mediaTags.join(','));
        }

        /**
         * Set selected state
         * @param {Boolean} state - 'true' to select, 'false' to remove selection
         */

    }, {
        key: 'selected',
        set: function set(state) {

            /**
             * We don't need to mark Block as Selected when it is not empty
             */
            if (state === true && !this.isEmpty) {

                this._html.classList.add(Block.CSS.selected);
            } else {

                this._html.classList.remove(Block.CSS.selected);
            }
        }
    }], [{
        key: 'CSS',
        get: function get() {

            return {
                wrapper: 'ce-block',
                content: 'ce-block__content',
                selected: 'ce-block--selected'
            };
        }
    }]);

    return Block;
}();

Block.displayName = 'Block';
exports.default = Block;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(1)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/**
 * Codex Editor
 *
 * Short Description (눈_눈;)
 * @version 2.0.0
 *
 * How to start?
 * Example:
 *           new CodexEditor({
 *                holderId : 'codex-editor',
 *                initialBlock : 'text',
 *                placeholder : 'Write your story....',
 *                tools: {
 *                    quote: Quote,
 *                    anotherTool : AnotherTool
 *                },
 *                toolsConfig: {
 *                     quote: {
 *                        iconClassname : 'quote-icon',
 *                        displayInToolbox : true,
 *                        enableLineBreaks : true
 *                     },
 *                     anotherTool: {
 *                        iconClassname : 'tool-icon'
 *                     }
 *                 }
 *            });
 *
 * - tools is an object: {
 *       pluginName: PluginClass,
 *       .....
 *   }
 * - toolsConfig is an additional configuration that uses Codex Editor API
 *      iconClassname - CSS classname of toolbox icon
 *      displayInToolbox - if you want to see your Tool in toolbox hided in "plus" button, than set "True". By default : "False"
 *      enableLineBreaks - by default enter creates new block that set as initialblock, but if you set this property "True", enter will break the lines in current block
 *
 * @author CodeX-Team <https://ifmo.su>
 *
 */

/**
 * @typedef {CodexEditor} CodexEditor - editor class
 */

/**
 * @typedef {Object} EditorConfig
 * @property {String} holderId           - Element to append Editor
 * @property {Array} data                - Blocks list in JSON-format
 * @property {Object} tools              - Map for used Tools in format { name : Class, ... }
 * @property {String} initialBlock       - This Tool will be added by default
 * @property {String} placeholder        - First Block placeholder
 * @property {Object} sanitizer          - @todo fill desc
 * @property {Boolean} hideToolbar       - @todo fill desc
 * @property {Object} toolsConfig        - tools configuration {@link Tools#ToolsConfig}
 */

/**
 * Dynamically imported utils
 *
 * @typedef {Dom}   $      - {@link components/dom.js}
 * @typedef {Util}  _      - {@link components/utils.js}
 */



/**
 * Apply polyfills
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Require Editor modules places in components/modules dir
 */
// eslint-disable-next-line
var modules = ["blockManager.js","caret.js","events.js","renderer.js","sanitizer.js","saver.js","toolbar.js","toolbox.js","tools.js","ui.js"].map(function (module) {
    return __webpack_require__(6)("./" + module);
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

            return "2.0.0";
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
         * @type {EditorConfig}
         */
        this.config = {};

        /**
         * @typedef {Object} EditorComponents
         * @property {BlockManager} BlockManager
         * @property {Tools} Tools
         * @property {Events} Events
         * @property {UI} UI
         * @property {Toolbar} Toolbar
         * @property {Toolbox} Toolbox
         * @property {Renderer} Renderer
         */
        this.moduleInstances = {};

        Promise.resolve().then(function () {

            _this.configuration = config;
        }).then(function () {
            return _this.init();
        }).then(function () {
            return _this.start();
        }).then(function () {

            console.log('CodeX Editor is ready!');
        }).catch(function (error) {

            console.log('CodeX Editor does not ready because of %o', error);
        });
    }

    /**
     * Setting for configuration
     * @param {EditorConfig} config
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

                    /**
                     * We use class name provided by displayName property
                     *
                     * On build, Babel will transform all Classes to the Functions so, name will always be 'Function'
                     * To prevent this, we use 'babel-plugin-class-display-name' plugin
                     * @see  https://www.npmjs.com/package/babel-plugin-class-display-name
                     */
                    _this2.moduleInstances[Module.displayName] = new Module({
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

            var diff = {};

            for (var moduleName in this.moduleInstances) {

                /**
                 * Skip module with passed name
                 */
                if (moduleName === name) {

                    continue;
                }
                diff[moduleName] = this.moduleInstances[moduleName];
            }

            return diff;
        }

        /**
         * Start Editor!
         *
         * Get list of modules that needs to be prepared and return a sequence (Promise)
         * @return {Promise}
         */

    }, {
        key: 'start',
        value: function start() {
            var _this3 = this;

            var prepareDecorator = function prepareDecorator(module) {
                return module.prepare();
            };

            return Promise.resolve().then(prepareDecorator(this.moduleInstances.Tools)).then(prepareDecorator(this.moduleInstances.UI)).then(prepareDecorator(this.moduleInstances.BlockManager)).then(function () {

                return _this3.moduleInstances.Renderer.render(_this3.config.data.items);
            });
        }
    }, {
        key: 'configuration',
        set: function set(config) {

            /**
             * Initlai block type
             * Uses in case when there is no items passed
             * @type {{type: (*), data: {text: null}}}
             */
            var initialBlock = {
                type: config.initialBlock,
                data: {}
            };

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
            this.config.data = config.data || {};

            /**
             * Initialize items to pass data to the Renderer
             */
            if (_.isEmpty(this.config.data)) {

                this.config.data = {};
                this.config.data.items = [initialBlock];
            } else {

                if (!this.config.data.items || this.config.data.items.length === 0) {

                    this.config.data.items = [initialBlock];
                }
            }

            /**
             * If initial Block's Tool was not passed, use the first Tool in config.tools
             */
            if (!config.initialBlock) {

                for (this.config.initialBlock in this.config.tools) {
                    break;
                }
            } else {

                this.config.initialBlock = config.initialBlock;
            }
        }

        /**
         * Returns private property
         * @returns {EditorConfig}
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
//         tools     : ['text', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
//         holderId  : 'codex-editor',
//
//         // Type of block showing on empty editor
//         initialBlockPlugin: 'text'
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Element.closest()
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 */
if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest) Element.prototype.closest = function (s) {

    var el = this;

    if (!document.documentElement.contains(el)) return null;
    do {

        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
    } while (el !== null);
    return null;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./blockManager.js": 7,
	"./caret.js": 8,
	"./events.js": 9,
	"./renderer.js": 10,
	"./sanitizer.js": 11,
	"./saver.js": 13,
	"./toolbar.js": 14,
	"./toolbox.js": 15,
	"./tools.js": 16,
	"./ui.js": 17
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 6;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _block = __webpack_require__(3);

var _block2 = _interopRequireDefault(_block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @class BlockManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @classdesc Manage editor`s blocks storage and appearance
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module BlockManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {BlockManager} BlockManager
 * @property {Number} currentBlockIndex - Index of current working block
 * @property {Proxy} _blocks - Proxy for Blocks instance {@link Blocks}
 */
var BlockManager = function (_Module) {
    _inherits(BlockManager, _Module);

    /**
     * @constructor
     * @param {EditorConfig} config
     */
    function BlockManager(_ref) {
        var config = _ref.config;

        _classCallCheck(this, BlockManager);

        /**
         * Proxy for Blocks instance {@link Blocks}
         *
         * @type {Proxy}
         * @private
         */
        var _this = _possibleConstructorReturn(this, (BlockManager.__proto__ || Object.getPrototypeOf(BlockManager)).call(this, { config: config }));

        _this._blocks = null;

        /**
         * Index of current working block
         *
         * @type {number}
         * @private
         */
        _this.currentBlockIndex = -1;

        return _this;
    }

    /**
     * Should be called after Editor.UI preparation
     * Define this._blocks property
     *
     * @returns {Promise}
     */


    _createClass(BlockManager, [{
        key: 'prepare',
        value: function prepare() {
            var _this2 = this;

            return new Promise(function (resolve) {

                var blocks = new Blocks(_this2.Editor.UI.nodes.redactor);

                /**
                 * We need to use Proxy to overload set/get [] operator.
                 * So we can use array-like syntax to access blocks
                 *
                 * @example
                 * this._blocks[0] = new Block(...);
                 *
                 * block = this._blocks[0];
                 *
                 * @todo proxy the enumerate method
                 *
                 * @type {Proxy}
                 * @private
                 */
                _this2._blocks = new Proxy(blocks, {
                    set: Blocks.set,
                    get: Blocks.get
                });

                resolve();
            });
        }

        /**
         * Creates Block instance by tool name
         *
         * @param {String} toolName - tools passed in editor config {@link EditorConfig#tools}
         * @param {Object} data - constructor params
         *
         * @return {Block}
         */

    }, {
        key: 'composeBlock',
        value: function composeBlock(toolName, data) {

            var toolInstance = this.Editor.Tools.construct(toolName, data),
                block = new _block2.default(toolName, toolInstance);

            /**
             * Apply callback before inserting html
             */
            block.call('appendCallback', {});

            return block;
        }

        /**
         * Insert new block into _blocks
         *
         * @param {String} toolName — plugin name
         * @param {Object} data — plugin data
         */

    }, {
        key: 'insert',
        value: function insert(toolName) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            var block = this.composeBlock(toolName, data);

            this._blocks[++this.currentBlockIndex] = block;
        }

        /**
         * Replace current working block
         *
         * @param {String} toolName — plugin name
         * @param {Object} data — plugin data
         */

    }, {
        key: 'replace',
        value: function replace(toolName) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            var block = this.composeBlock(toolName, data);

            this._blocks.insert(this.currentBlockIndex, block, true);
        }

        /**
         * Get Block instance by html element
         *
         * @todo get first level block before searching
         *
         * @param {HTMLElement} element
         * @returns {Block}
         */

    }, {
        key: 'getBlock',
        value: function getBlock(element) {

            var nodes = this._blocks.nodes,
                index = nodes.indexOf(element);

            if (index >= 0) {

                return this._blocks[index];
            }
        }

        /**
         * Get current Block instance
         *
         * @return {Block}
         */

    }, {
        key: 'setCurrentBlockByChildNode',


        /**
         * 1) Find first-level Block from passed child Node
         * 2) Mark it as current
         *
         *  @param {Element|Text} childNode - look ahead from this node.
         *  @throws Error  - when passed Node is not included at the Block
         */
        value: function setCurrentBlockByChildNode(childNode) {

            /**
             * If node is Text TextNode
             */
            if (!$.isElement(childNode)) {

                childNode = childNode.parentNode;
            }

            var parentFirstLevelBlock = childNode.closest('.' + _block2.default.CSS.wrapper);

            if (parentFirstLevelBlock) {

                this.currentNode = parentFirstLevelBlock;
            } else {

                throw new Error('Can not find a Block from this child Node');
            }
        }
    }, {
        key: 'currentBlock',
        get: function get() {

            return this._blocks[this.currentBlockIndex];
        }

        /**
         * Get working html element
         *
         * @return {HTMLElement}
         */

    }, {
        key: 'currentNode',
        get: function get() {

            return this._blocks.nodes[this.currentBlockIndex];
        }

        /**
         * Set currentBlockIndex to passed block
         *
         * @todo get first level block before searching
         *
         * @param {HTMLElement} element
         */
        ,
        set: function set(element) {

            var nodes = this._blocks.nodes;

            /**
             * Update current Block's index
             * @type {number}
             */
            this.currentBlockIndex = nodes.indexOf(element);

            /**
             * Remove previous selected Block's state
             */
            this._blocks.array.forEach(function (block) {
                return block.selected = false;
            });

            /**
             * Mark current Block as selected
             * @type {boolean}
             */
            this.currentBlock.selected = true;
        }

        /**
         * Get array of Block instances
         *
         * @returns {Block[]} {@link Blocks#array}
         */

    }, {
        key: 'blocks',
        get: function get() {

            return this._blocks.array;
        }
    }]);

    return BlockManager;
}(Module);

/**
 * @class Blocks
 * @classdesc Class to work with Block instances array
 *
 * @private
 *
 * @property {HTMLElement} workingArea — editor`s working node
 *
 */


BlockManager.displayName = 'BlockManager';
exports.default = BlockManager;

var Blocks = function () {

    /**
     * @constructor
     *
     * @param {HTMLElement} workingArea — editor`s working node
     */
    function Blocks(workingArea) {
        _classCallCheck(this, Blocks);

        this.blocks = [];
        this.workingArea = workingArea;
    }

    /**
     * Push back new Block
     *
     * @param {Block} block
     */


    _createClass(Blocks, [{
        key: 'push',
        value: function push(block) {

            this.blocks.push(block);
            this.workingArea.appendChild(block.html);
        }

        /**
         * Insert new Block at passed index
         *
         * @param {Number} index — index to insert Block
         * @param {Block} block — Block to insert
         * @param {Boolean} replace — it true, replace block on given index
         */

    }, {
        key: 'insert',
        value: function insert(index, block) {
            var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


            if (!this.length) {

                this.push(block);
                return;
            }

            if (index > this.length) {

                index = this.length;
            }

            if (replace) {

                this.blocks[index].html.remove();
            }

            var deleteCount = replace ? 1 : 0;

            this.blocks.splice(index, deleteCount, block);

            if (index > 0) {

                var previousBlock = this.blocks[index - 1];

                previousBlock.html.insertAdjacentElement('afterend', block.html);
            } else {

                var nextBlock = this.blocks[index + 1];

                if (nextBlock) {

                    nextBlock.html.insertAdjacentElement('beforebegin', block.html);
                } else {

                    this.workingArea.appendChild(block.html);
                }
            }
        }

        /**
         * Insert Block after passed target
         *
         * @todo decide if this method is necessary
         *
         * @param {Block} targetBlock — target after wich Block should be inserted
         * @param {Block} newBlock — Block to insert
         */

    }, {
        key: 'insertAfter',
        value: function insertAfter(targetBlock, newBlock) {

            var index = this.blocks.indexOf(targetBlock);

            this.insert(index + 1, newBlock);
        }

        /**
         * Get Block by index
         *
         * @param {Number} index — Block index
         * @returns {Block}
         */

    }, {
        key: 'get',
        value: function get(index) {

            return this.blocks[index];
        }

        /**
         * Return index of passed Block
         *
         * @param {Block} block
         * @returns {Number}
         */

    }, {
        key: 'indexOf',
        value: function indexOf(block) {

            return this.blocks.indexOf(block);
        }

        /**
         * Get length of Block instances array
         *
         * @returns {Number}
         */

    }, {
        key: 'length',
        get: function get() {

            return this.blocks.length;
        }

        /**
         * Get Block instances array
         *
         * @returns {Block[]}
         */

    }, {
        key: 'array',
        get: function get() {

            return this.blocks;
        }

        /**
         * Get blocks html elements array
         *
         * @returns {HTMLElement[]}
         */

    }, {
        key: 'nodes',
        get: function get() {

            return _.array(this.workingArea.children);
        }

        /**
         * Proxy trap to implement array-like setter
         *
         * @example
         * blocks[0] = new Block(...)
         *
         * @param {Blocks} instance — Blocks instance
         * @param {Number|String} index — block index
         * @param {Block} block — Block to set
         * @returns {Boolean}
         */

    }], [{
        key: 'set',
        value: function set(instance, index, block) {

            if (isNaN(Number(index))) {

                return false;
            }

            instance.insert(index, block);

            return true;
        }

        /**
         * Proxy trap to implement array-like getter
         *
         * @param {Blocks} instance — Blocks instance
         * @param {Number|String} index — Block index
         * @returns {Block|*}
         */

    }, {
        key: 'get',
        value: function get(instance, index) {

            if (isNaN(Number(index))) {

                return instance[index];
            }

            return instance.get(index);
        }
    }]);

    return Blocks;
}();

Blocks.displayName = 'Blocks';
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(1)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Caret
 * @classdesc Contains methods for working Caret
 *
 * @typedef {Caret} Caret
 */
var Caret = function (_Module) {
    _inherits(Caret, _Module);

    /**
     * @constructor
     */
    function Caret(_ref) {
        var config = _ref.config;

        _classCallCheck(this, Caret);

        return _possibleConstructorReturn(this, (Caret.__proto__ || Object.getPrototypeOf(Caret)).call(this, { config: config }));
    }

    /**
     * Set Caret to the last Block
     *
     * If last block is not empty, append another empty block
     */


    _createClass(Caret, [{
        key: 'setToTheLastBlock',
        value: function setToTheLastBlock() {

            var blocks = this.Editor.BlockManager.blocks,
                lastBlock = void 0;

            if (blocks.length) {

                lastBlock = blocks[blocks.length - 1];
            }

            /**
             * If last block is empty and it is an initialBlock, set to that.
             * Otherwise, append new empty block and set to that
             */
            if (lastBlock.isEmpty) {

                this.set(lastBlock.html);
            } else {

                this.Editor.BlockManager.insert(this.config.initialBlock);
            }

            /**
             //      * If inputs in redactor does not exits, then we put input index 0 not -1
             //      */
            //     var indexOfLastInput = editor.state.inputs.length > 0 ? editor.state.inputs.length - 1 : 0;
            //
            //     /** If we have any inputs */
            //     if (editor.state.inputs.length) {
            //
            //         /** getting firstlevel parent of input */
            //         firstLevelBlock = editor.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);
            //
            //     }
            //
            //     /** If input is empty, then we set caret to the last input */
            //     if (editor.state.inputs.length && editor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == editor.settings.initialBlockPlugin) {
            //
            //         editor.caret.setToBlock(indexOfLastInput);
            //
            //     } else {
            //
            //         /** Create new input when caret clicked in redactors area */
            //         var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
            //
            //         editor.content.insertBlock({
            //             type  : NEW_BLOCK_TYPE,
            //             block : editor.tools[NEW_BLOCK_TYPE].render()
            //         });
            //
            //         /** If there is no inputs except inserted */
            //         if (editor.state.inputs.length === 1) {
            //
            //             editor.caret.setToBlock(indexOfLastInput);
            //
            //         } else {
            //
            //             /** Set caret to this appended input */
            //             editor.caret.setToNextBlock(indexOfLastInput);
            //
            //         }
            //
            //     }
        }

        /**
         * Set caret to the passed Node
         * @param {Element} node - content-editable Element
         */

    }, {
        key: 'set',
        value: function set(node) {

            /**
             * @todo add working with Selection
             * tmp: work with textContent
             */

            node.textContent += '|';
        }
    }]);

    return Caret;
}(Module);

Caret.displayName = 'Caret';
exports.default = Caret;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module eventDispatcher
 *
 * Has two important methods:
 *    - {Function} on - appends subscriber to the event. If event doesn't exist - creates new one
 *    - {Function} emit - fires all subscribers with data
 *
 * @version 1.0.0
 *
 * @typedef {Events} Events
 * @property {Object} subscribers - all subscribers grouped by event name
 */
var Events = function (_Module) {
    _inherits(Events, _Module);

    /**
     * @constructor
     */
    function Events(_ref) {
        var config = _ref.config;

        _classCallCheck(this, Events);

        var _this = _possibleConstructorReturn(this, (Events.__proto__ || Object.getPrototypeOf(Events)).call(this, { config: config }));

        _this.subscribers = {};

        return _this;
    }

    /**
     * @param {String} eventName - event name
     * @param {Function} callback - subscriber
     */


    _createClass(Events, [{
        key: "on",
        value: function on(eventName, callback) {

            if (!(eventName in this.subscribers)) {

                this.subscribers[eventName] = [];
            }

            // group by events
            this.subscribers[eventName].push(callback);
        }

        /**
         * @param {String} eventName - event name
         * @param {Object} data - subscribers get this data when they were fired
         */

    }, {
        key: "emit",
        value: function emit(eventName, data) {

            this.subscribers[eventName].reduce(function (previousData, currentHandler) {

                var newData = currentHandler(previousData);

                return newData ? newData : previousData;
            }, data);
        }

        /**
         * Destroyer
         * clears subsribers list
         */

    }, {
        key: "destroy",
        value: function destroy() {

            this.subscribers = null;
        }
    }]);

    return Events;
}(Module);

Events.displayName = "Events";
exports.default = Events;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Codex Editor Renderer Module
 *
 * @module Renderer
 * @author CodeX Team
 *
 * @version 2.0.0
 */
var Renderer = function (_Module) {
    _inherits(Renderer, _Module);

    /**
     * @constructor
     * @param {EditorConfig} config
     */
    function Renderer(_ref) {
        var config = _ref.config;

        _classCallCheck(this, Renderer);

        return _possibleConstructorReturn(this, (Renderer.__proto__ || Object.getPrototypeOf(Renderer)).call(this, { config: config }));
    }

    /**
     * @typedef {Object} RendererItems
     * @property {String} type - tool name
     * @property {Object} data - tool data
     */

    /**
     * @example
     *
     * items: [
     * {
     *    type : 'paragraph',
     *    data : {
     *        text : 'Hello from Codex!'
     *    }
     * },
     * {
     *   type : 'paragraph',
     *   data : {
     *        text : 'Leave feedback if you like it!'
     *   }
     * },
     * ]
     *
     */

    /**
     * Make plugin blocks from array of plugin`s data
     * @param {RendererItems[]} items
     */


    _createClass(Renderer, [{
        key: "render",
        value: function render(items) {
            var _this2 = this;

            var chainData = [];

            var _loop = function _loop(i) {

                chainData.push({
                    function: function _function() {
                        return _this2.insertBlock(items[i]);
                    }
                });
            };

            for (var i = 0; i < items.length; i++) {
                _loop(i);
            }

            return _.sequence(chainData);
        }

        /**
         * Get plugin instance
         * Add plugin instance to BlockManager
         * Insert block to working zone
         *
         * @param {Object} item
         * @returns {Promise.<T>}
         * @private
         */

    }, {
        key: "insertBlock",
        value: function insertBlock(item) {

            var tool = item.type,
                data = item.data;

            this.Editor.BlockManager.insert(tool, data);

            return Promise.resolve();
        }
    }]);

    return Renderer;
}(Module);

Renderer.displayName = "Renderer";
exports.default = Renderer;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * CodeX Sanitizer
 *
 * @module Sanitizer
 * Clears HTML from taint tags
 *
 * @version 2.0.0
 *
 * @example
 *  Module can be used within two ways:
 *     1) When you have an instance
 *         - this.Editor.Sanitizer.clean(yourTaintString);
 *     2) As static method
 *         - CodexEditor.Sanitizer.clean(yourTaintString, yourCustomConfiguration);
 *
 * {@link SanitizerConfig}
 */

/**
 * @typedef {Object} SanitizerConfig
 * @property {Object} tags - define tags restrictions
 *
 * @example
 *
 * tags : {
 *     p: true,
 *     a: {
 *       href: true,
 *       rel: "nofollow",
 *       target: "_blank"
 *     }
 * }
 */
var Sanitizer = function (_Module) {
    _inherits(Sanitizer, _Module);

    /**
     * Initializes Sanitizer module
     * Sets default configuration if custom not exists
     *
     * @property {SanitizerConfig} this.defaultConfig
     * @property {HTMLJanitor} this._sanitizerInstance - Sanitizer library
     *
     * @param {SanitizerConfig} config
     */
    function Sanitizer(_ref) {
        var config = _ref.config;

        _classCallCheck(this, Sanitizer);

        // default config
        var _this = _possibleConstructorReturn(this, (Sanitizer.__proto__ || Object.getPrototypeOf(Sanitizer)).call(this, { config: config }));

        _this.defaultConfig = null;
        _this._sanitizerInstance = null;

        /** Custom configuration */
        _this.sanitizerConfig = config.settings ? config.settings.sanitizer : {};

        /** HTML Janitor library */
        _this.sanitizerInstance = __webpack_require__(12);

        return _this;
    }

    /**
     * If developer uses editor's API, then he can customize sanitize restrictions.
     * Or, sanitizing config can be defined globally in editors initialization. That config will be used everywhere
     * At least, if there is no config overrides, that API uses Default configuration
     *
     * @uses https://www.npmjs.com/package/html-janitor
     *
     * @param {HTMLJanitor} library - sanitizer extension
     */


    _createClass(Sanitizer, [{
        key: 'clean',


        /**
         * Cleans string from unwanted tags
         * @param {String} taintString - HTML string
         * @param {Object} customConfig - custom sanitizer configuration. Method uses default if param is empty
         * @return {String} clean HTML
         */
        value: function clean(taintString) {
            var customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            if (_.isEmpty(customConfig)) {

                return this._sanitizerInstance.clean(taintString);
            } else {

                return Sanitizer.clean(taintString, customConfig);
            }
        }

        /**
         * Cleans string from unwanted tags
         * @static
         *
         * Method allows to use default config
         *
         * @param {String} taintString - taint string
         * @param {SanitizerConfig} customConfig - allowed tags
         *
         * @return {String} clean HTML
         */

    }, {
        key: 'sanitizerInstance',
        set: function set(library) {

            this._sanitizerInstance = new library(this.defaultConfig);
        }

        /**
         * Sets sanitizer configuration. Uses default config if user didn't pass the restriction
         * @param {SanitizerConfig} config
         */

    }, {
        key: 'sanitizerConfig',
        set: function set(config) {

            if (_.isEmpty(config)) {

                this.defaultConfig = {
                    tags: {
                        p: {},
                        a: {
                            href: true,
                            target: '_blank',
                            rel: 'nofollow'
                        }
                    }
                };
            } else {

                this.defaultConfig = config;
            }
        }
    }], [{
        key: 'clean',
        value: function clean(taintString, customConfig) {

            var newInstance = Sanitizer(customConfig);

            return newInstance.clean(taintString);
        }
    }]);

    return Sanitizer;
}(Module);

Sanitizer.displayName = 'Sanitizer';
exports.default = Sanitizer;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Codex Editor Saver
 *
 * @module Saver
 * @author Codex Team
 * @version 2.0.0
 */

/**
 * @typedef {Object} SavedData
 * @property {Date} time - saving proccess time
 * @property {Object} items - extracted data
 * @property {String} version - CodexEditor version
 */

/**
 * @classdesc This method reduces all Blocks asyncronically and calls Block's save method to extract data
 *
 * @typedef {Saver} Saver
 * @property {Element} html - Editor HTML content
 * @property {String} json - Editor JSON output
 */

var Saver = function (_Module) {
    _inherits(Saver, _Module);

    /**
     * @constructor
     * @param config
     */
    function Saver(_ref) {
        var config = _ref.config;

        _classCallCheck(this, Saver);

        var _this = _possibleConstructorReturn(this, (Saver.__proto__ || Object.getPrototypeOf(Saver)).call(this, { config: config }));

        _this.output = null;
        _this.blocksData = [];

        return _this;
    }

    /**
     * Composes new chain of Promises to fire them alternatelly
     * @return {SavedData}
     */


    _createClass(Saver, [{
        key: 'save',
        value: function save() {
            var _this2 = this;

            var blocks = this.Editor.BlockManager.blocks,
                chainData = [];

            blocks.forEach(function (block) {

                chainData.push(block.data);
            });

            return Promise.all(chainData).then(function (allExtractedData) {
                return _this2.makeOutput(allExtractedData);
            }).then(function (outputData) {

                return outputData;
            });
        }

        /**
         * Creates output object with saved data, time and version of editor
         * @param {Object} allExtractedData
         * @return {SavedData}
         */

    }, {
        key: 'makeOutput',
        value: function makeOutput(allExtractedData) {

            var items = [],
                totalTime = 0;

            console.groupCollapsed('[CodexEditor saving]:');

            allExtractedData.forEach(function (extraction, index) {

                /** Group process info */
                console.log('"' + extraction.processInfo.tool + '" extraction info', extraction);
                totalTime += extraction.processInfo.time;
                items.push(extraction.data);
            });

            console.log('Total', totalTime);
            console.groupEnd();

            return {
                time: +new Date(),
                items: items,
                version: "2.0.0"
            };
        }
    }]);

    return Saver;
}(Module);

// module.exports = (function (saver) {
//
//     let editor = codex.editor;
//
//     /**
//      * @public
//      * Save blocks
//      */
//     saver.save = function () {
//
//         /** Save html content of redactor to memory */
//         editor.state.html = editor.nodes.redactor.innerHTML;
//
//         /** Clean jsonOutput state */
//         editor.state.jsonOutput = [];
//
//         return saveBlocks(editor.nodes.redactor.childNodes);
//
//     };
//
//     /**
//      * @private
//      * Save each block data
//      *
//      * @param blocks
//      * @returns {Promise.<TResult>}
//      */
//     let saveBlocks = function (blocks) {
//
//         let data = [];
//
//         for(let index = 0; index < blocks.length; index++) {
//
//             data.push(getBlockData(blocks[index]));
//
//         }
//
//         return Promise.all(data)
//             .then(makeOutput)
//             .catch(editor.core.log);
//
//     };
//
//     /** Save and validate block data */
//     let getBlockData = function (block) {
//
//         return saveBlockData(block)
//             .then(validateBlockData)
//             .catch(editor.core.log);
//
//     };
//
//     /**
//     * @private
//     * Call block`s plugin save method and return saved data
//     *
//     * @param block
//     * @returns {Object}
//     */
//     let saveBlockData = function (block) {
//
//         let pluginName = block.dataset.tool;
//
//         /** Check for plugin existence */
//         if (!editor.tools[pluginName]) {
//
//             editor.core.log(`Plugin «${pluginName}» not found`, 'error');
//             return {data: null, pluginName: null};
//
//         }
//
//         /** Check for plugin having save method */
//         if (typeof editor.tools[pluginName].save !== 'function') {
//
//             editor.core.log(`Plugin «${pluginName}» must have save method`, 'error');
//             return {data: null, pluginName: null};
//
//         }
//
//         /** Result saver */
//         let blockContent   = block.childNodes[0],
//             pluginsContent = blockContent.childNodes[0],
//             position = pluginsContent.dataset.inputPosition;
//
//         /** If plugin wasn't available then return data from cache */
//         if ( editor.tools[pluginName].available === false ) {
//
//             return Promise.resolve({data: codex.editor.state.blocks.items[position].data, pluginName});
//
//         }
//
//         return Promise.resolve(pluginsContent)
//             .then(editor.tools[pluginName].save)
//             .then(data => Object({data, pluginName}));
//
//     };
//
//     /**
//     * Call plugin`s validate method. Return false if validation failed
//     *
//     * @param data
//     * @param pluginName
//     * @returns {Object|Boolean}
//     */
//     let validateBlockData = function ({data, pluginName}) {
//
//         if (!data || !pluginName) {
//
//             return false;
//
//         }
//
//         if (editor.tools[pluginName].validate) {
//
//             let result = editor.tools[pluginName].validate(data);
//
//             /**
//              * Do not allow invalid data
//              */
//             if (!result) {
//
//                 return false;
//
//             }
//
//         }
//
//         return {data, pluginName};
//
//
//     };
//
//     /**
//     * Compile article output
//     *
//     * @param savedData
//     * @returns {{time: number, version, items: (*|Array)}}
//     */
//     let makeOutput = function (savedData) {
//
//         savedData = savedData.filter(blockData => blockData);
//
//         let items = savedData.map(blockData => Object({type: blockData.pluginName, data: blockData.data}));
//
//         editor.state.jsonOutput = items;
//
//         return {
//             id: editor.state.blocks.id || null,
//             time: +new Date(),
//             version: editor.version,
//             items
//         };
//
//     };
//
//     return saver;
//
// })({});


Saver.displayName = 'Saver';
exports.default = Saver;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 *
 * «Toolbar» is the node that moves up/down over current block
 *
 *  ______________________________________ Toolbar ____________________________________________
 * |                                                                                           |
 * |  ..................... Content ....................   ......... Block Actions ..........  |
 * |  .                                                .   .                                .  |
 * |  .                                                .   . [Open Settings] [Remove Block] .  |
 * |  .  [Plus Button]  [Toolbox: {Tool1}, {Tool2}]    .   .                                .  |
 * |  .                                                .   .        [Settings Panel]        .  |
 * |  ..................................................   ..................................  |
 * |                                                                                           |
 * |___________________________________________________________________________________________|
 *
 *
 * Toolbox — its an Element contains tools buttons. Can be shown by Plus Button.
 *
 *  _______________ Toolbox _______________
 * |                                       |
 * | [Header] [Image] [List] [Quote] ...   |
 * |_______________________________________|
 *
 *
 * Settings Panel — is an Element with block settings:
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 *
 *
 * @class
 * @classdesc Toolbar module
 *
 * @typedef {Toolbar} Toolbar
 * @property {Object} nodes
 * @property {Element} nodes.wrapper        - Toolbar main element
 * @property {Element} nodes.content        - Zone with Plus button and toolbox.
 * @property {Element} nodes.actions        - Zone with Block Settings and Remove Button
 * @property {Element} nodes.plusButton     - Button that opens or closes Toolbox
 * @property {Element} nodes.toolbox        - Container for tools
 * @property {Element} nodes.settingsToggler - open/close Settings Panel button
 * @property {Element} nodes.removeBlockButton - Remove Block button
 * @property {Element} nodes.settings          - Settings Panel
 * @property {Element} nodes.pluginSettings    - Plugin Settings section of Settings Panel
 * @property {Element} nodes.defaultSettings   - Default Settings section of Settings Panel
 */
var Toolbar = function (_Module) {
  _inherits(Toolbar, _Module);

  /**
   * @constructor
   */
  function Toolbar(_ref) {
    var config = _ref.config;

    _classCallCheck(this, Toolbar);

    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, { config: config }));

    _this.nodes = {
      wrapper: null,
      content: null,
      actions: null,

      // Content Zone
      plusButton: null,

      // Actions Zone
      settingsToggler: null,
      removeBlockButton: null,
      settings: null,

      // Settings Zone: Plugin Settings and Default Settings
      pluginSettings: null,
      defaultSettings: null
    };

    return _this;
  }

  /**
   * CSS styles
   * @return {Object}
   * @constructor
   */


  _createClass(Toolbar, [{
    key: 'make',


    /**
     * Makes toolbar
     */
    value: function make() {
      var _this2 = this;

      this.nodes.wrapper = $.make('div', Toolbar.CSS.toolbar);

      /**
       * Make Content Zone and Actions Zone
       */
      ['content', 'actions'].forEach(function (el) {

        _this2.nodes[el] = $.make('div', Toolbar.CSS[el]);
        $.append(_this2.nodes.wrapper, _this2.nodes[el]);
      });

      /**
       * Fill Content Zone:
       *  - Plus Button
       *  - Toolbox
       */
      this.nodes.plusButton = $.make('div', Toolbar.CSS.plusButton);
      $.append(this.nodes.content, this.nodes.plusButton);
      this.nodes.plusButton.addEventListener('click', function (event) {
        return _this2.plusButtonClicked(event);
      }, false);

      /**
       * Make a Toolbox
       */
      this.Editor.Toolbox.make();

      /**
       * Fill Actions Zone:
       *  - Settings Toggler
       *  - Remove Block Button
       *  - Settings Panel
       */
      this.nodes.settingsToggler = $.make('span', Toolbar.CSS.settingsToggler);
      this.nodes.removeBlockButton = this.makeRemoveBlockButton();

      $.append(this.nodes.actions, [this.nodes.settingsToggler, this.nodes.removeBlockButton]);

      /**
       * Make and append Settings Panel
       */
      this.makeBlockSettingsPanel();

      /**
       * Append toolbar to the Editor
       */
      $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
    }

    /**
     * Panel with block settings with 2 sections:
     *
     * @return {Element}
     */

  }, {
    key: 'makeBlockSettingsPanel',
    value: function makeBlockSettingsPanel() {

      this.nodes.settings = $.make('div', Toolbar.CSS.settings);

      this.nodes.pluginSettings = $.make('div', Toolbar.CSS.pluginSettings);
      this.nodes.defaultSettings = $.make('div', Toolbar.CSS.defaultSettings);

      $.append(this.nodes.settings, [this.nodes.pluginSettings, this.nodes.defaultSettings]);
      $.append(this.nodes.actions, this.nodes.settings);
    }

    /**
     * Makes Remove Block button, and confirmation panel
     * @return {Element} wrapper with button and panel
     */

  }, {
    key: 'makeRemoveBlockButton',
    value: function makeRemoveBlockButton() {

      /**
       * @todo  add confirmation panel and handlers
       * @see  {@link settings#makeRemoveBlockButton}
       */
      return $.make('span', Toolbar.CSS.removeBlockButton);
    }

    /**
     * Move Toolbar to the Current Block
     */

  }, {
    key: 'move',
    value: function move() {

      /** Close Toolbox when we move toolbar */
      this.Editor.Toolbox.close();

      var currentNode = this.Editor.BlockManager.currentNode;

      /**
       * If no one Block selected as a Current
       */
      if (!currentNode) {

        return;
      }

      /**
       * @todo Compute dynamically on prepare
       * @type {number}
       */
      var defaultToolbarHeight = 49;
      var defaultOffset = 34;

      var newYCoordinate = currentNode.offsetTop - defaultToolbarHeight / 2 + defaultOffset;

      this.nodes.wrapper.style.transform = 'translate3D(0, ' + Math.floor(newYCoordinate) + 'px, 0)';

      /** Close trash actions */
      // editor.toolbar.settings.hideRemoveActions();
    }

    /**
     * Open Toolbar with Plus Button
     */

  }, {
    key: 'open',
    value: function open() {

      this.nodes.wrapper.classList.add(Toolbar.CSS.toolbarOpened);
    }

    /**
     * Close the Toolbar
     */

  }, {
    key: 'close',
    value: function close() {

      this.nodes.wrapper.classList.remove(Toolbar.CSS.toolbarOpened);
    }

    /**
     * Plus Button public methods
     * @return {{hide: function(): void, show: function(): void}}
     */

  }, {
    key: 'plusButtonClicked',


    /**
     * Handler for Plus Button
     * @param {MouseEvent} event
     */
    value: function plusButtonClicked(event) {

      this.Editor.Toolbox.toggle();
    }
  }, {
    key: 'plusButton',
    get: function get() {
      var _this3 = this;

      return {
        hide: function hide() {
          return _this3.nodes.plusButton.classList.add(Toolbar.CSS.plusButtonHidden);
        },
        show: function show() {
          return _this3.nodes.plusButton.classList.remove(Toolbar.CSS.plusButtonHidden);
        }
      };
    }
  }], [{
    key: 'CSS',
    get: function get() {

      return {
        toolbar: 'ce-toolbar',
        content: 'ce-toolbar__content',
        actions: 'ce-toolbar__actions',

        toolbarOpened: 'ce-toolbar--opened',

        // Content Zone
        plusButton: 'ce-toolbar__plus',
        plusButtonHidden: 'ce-toolbar__plus--hidden',

        // Actions Zone
        settingsToggler: 'ce-toolbar__settings-btn',
        removeBlockButton: 'ce-toolbar__remove-btn',

        // Settings Panel
        settings: 'ce-settings',
        defaultSettings: 'ce-settings_default',
        pluginSettings: 'ce-settings_plugin'
      };
    }
  }]);

  return Toolbar;
}(Module);

Toolbar.displayName = 'Toolbar';
exports.default = Toolbar;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Toolbox
 * @classdesc Holder for Tools
 *
 * @typedef {Toolbox} Toolbox
 * @property {Boolean} opened - opening state
 * @property {Object} nodes   - Toolbox nodes
 * @property {Object} CSS     - CSS class names
 *
 */
var Toolbox = function (_Module) {
    _inherits(Toolbox, _Module);

    /**
     * @constructor
     */
    function Toolbox(_ref) {
        var config = _ref.config;

        _classCallCheck(this, Toolbox);

        var _this = _possibleConstructorReturn(this, (Toolbox.__proto__ || Object.getPrototypeOf(Toolbox)).call(this, { config: config }));

        _this.nodes = {
            toolbox: null,
            buttons: []
        };

        /**
         * Opening state
         * @type {boolean}
         */
        _this.opened = false;

        return _this;
    }

    /**
     * CSS styles
     * @return {{toolbox: string, toolboxButton: string, toolboxOpened: string}}
     */


    _createClass(Toolbox, [{
        key: 'make',


        /**
         * Makes the Toolbox
         */
        value: function make() {

            this.nodes.toolbox = $.make('div', Toolbox.CSS.toolbox);
            $.append(this.Editor.Toolbar.nodes.content, this.nodes.toolbox);

            this.addTools();
        }

        /**
         * Iterates available tools and appends them to the Toolbox
         */

    }, {
        key: 'addTools',
        value: function addTools() {

            var tools = this.Editor.Tools.toolsAvailable;

            for (var toolName in tools) {

                this.addTool(toolName, tools[toolName]);
            }
        }

        /**
         * Append Tool to the Toolbox
         *
         * @param {string} toolName  - tool name
         * @param {Tool}  tool      - tool class
         */

    }, {
        key: 'addTool',
        value: function addTool(toolName, tool) {
            var _this2 = this;

            if (tool.displayInToolbox && !tool.iconClassName) {

                _.log('Toolbar icon class name is missed. Tool %o skipped', 'warn', toolName);
                return;
            }

            /**
             * @todo Add checkup for the render method
             */
            // if (typeof tool.render !== 'function') {
            //
            //     _.log('render method missed. Tool %o skipped', 'warn', tool);
            //     return;
            //
            // }

            /**
             * Skip tools that pass 'displayInToolbox=false'
             */
            if (!tool.displayInToolbox) {

                return;
            }

            var button = $.make('li', [Toolbox.CSS.toolboxButton, tool.iconClassName], {
                title: toolName
            });

            /**
             * Save tool's name in the button data-name
             */
            button.dataset.name = toolName;

            $.append(this.nodes.toolbox, button);

            this.nodes.toolbox.appendChild(button);
            this.nodes.buttons.push(button);

            /**
             * @todo add event with module Listeners
             */
            // this.Editor.Listeners.add();
            button.addEventListener('click', function (event) {

                _this2.buttonClicked(event);
            }, false);
        }

        /**
         * Toolbox button click listener
         * 1) if block is empty -> replace
         * 2) if block is not empty -> add new block below
         *
         * @param {MouseEvent} event
         */

    }, {
        key: 'buttonClicked',
        value: function buttonClicked(event) {

            var toolButton = event.target,
                toolName = toolButton.dataset.name,
                tool = this.Editor.Tools.toolClasses[toolName];

            /**
             * @type {Block}
             */
            var currentBlock = this.Editor.BlockManager.currentBlock;

            /**
             * We do replace if:
             * - block is empty
             * - block is not irreplaceable
             * @type {Array}
             */
            if (!tool.irreplaceable && currentBlock.isEmpty) {

                this.Editor.BlockManager.replace(toolName);
            } else {

                this.Editor.BlockManager.insert(toolName);
            }

            /**
             * @todo set caret to the new block
             */

            // window.setTimeout(function () {

            /** Set caret to current block */
            // editor.caret.setToBlock(currentInputIndex);

            // }, 10);

            /**
             * Move toolbar when node is changed
             */
            this.Editor.Toolbar.move();
        }

        /**
         * Open Toolbox with Tools
         */

    }, {
        key: 'open',
        value: function open() {

            this.nodes.toolbox.classList.add(Toolbox.CSS.toolboxOpened);
            this.opened = true;
        }

        /**
         * Close Toolbox
         */

    }, {
        key: 'close',
        value: function close() {

            this.nodes.toolbox.classList.remove(Toolbox.CSS.toolboxOpened);
            this.opened = false;
        }

        /**
         * Close Toolbox
         */

    }, {
        key: 'toggle',
        value: function toggle() {

            if (!this.opened) {

                this.open();
            } else {

                this.close();
            }
        }
    }], [{
        key: 'CSS',
        get: function get() {

            return {
                toolbox: 'ce-toolbox',
                toolboxButton: 'ce-toolbox__button',
                toolboxOpened: 'ce-toolbox--opened'
            };
        }
    }]);

    return Toolbox;
}(Module);

Toolbox.displayName = 'Toolbox';
exports.default = Toolbox;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(1)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module Codex Editor Tools Submodule
 *
 * Creates Instances from Plugins and binds external config to the instances
 */

/**
 * Each Tool must contain the following important objects:
 *
 * @typedef {Object} ToolConfig {@link docs/tools.md}
 * @property {String} iconClassname - this a icon in toolbar
 * @property {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
 * @property {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
 * @property render @todo add description
 * @property save @todo add description
 * @property settings @todo add description
 * @property validate - method that validates output data before saving
 */

/**
 * @typedef {Function} Tool {@link docs/tools.md}
 * @property {Boolean}      displayInToolbox      - By default, tools won't be added in the Toolbox. Pass true to add.
 * @property {String}       iconClassName         - CSS class name for the Toolbox button
 * @property {Boolean}      irreplaceable         - Toolbox behaviour: replace or add new block below
 * @property render
 * @property save
 * @property settings
 * @property validate
 *
 * @todo update according to current API
 * @todo describe Tool in the {@link docs/tools.md}
 */

/**
 * Class properties:
 *
 * @typedef {Tools} Tools
 * @property {Tools[]} toolsAvailable - available Tools
 * @property {Tools[]} toolsUnavailable - unavailable Tools
 * @property {Object} toolsClasses - all classes
 * @property {EditorConfig} config - Editor config
 */
var Tools = function (_Module) {
    _inherits(Tools, _Module);

    _createClass(Tools, [{
        key: 'available',


        /**
         * Returns available Tools
         * @return {Tool[]}
         */
        get: function get() {

            return this.toolsAvailable;
        }

        /**
         * Returns unavailable Tools
         * @return {Tool[]}
         */

    }, {
        key: 'unavailable',
        get: function get() {

            return this.toolsUnavailable;
        }

        /**
         * Static getter for default Tool config fields
         *
         * @usage Tools.defaultConfig.displayInToolbox
         * @return {ToolConfig}
         */

    }], [{
        key: 'defaultConfig',
        get: function get() {

            return {
                iconClassName: '',
                displayInToolbox: false,
                enableLineBreaks: false,
                irreplaceable: false
            };
        }

        /**
         * @constructor
         *
         * @param {EditorConfig} config
         */

    }]);

    function Tools(_ref) {
        var config = _ref.config;

        _classCallCheck(this, Tools);

        /**
         * Map {name: Class, ...} where:
         *  name — block type name in JSON. Got from EditorConfig.tools keys
         * @type {Object}
         */
        var _this = _possibleConstructorReturn(this, (Tools.__proto__ || Object.getPrototypeOf(Tools)).call(this, { config: config }));

        _this.toolClasses = {};

        /**
         * Available tools list
         * {name: Class, ...}
         * @type {Object}
         */
        _this.toolsAvailable = {};

        /**
         * Tools that rejected a prepare method
         * {name: Class, ... }
         * @type {Object}
         */
        _this.toolsUnavailable = {};

        return _this;
    }

    /**
     * Creates instances via passed or default configuration
     * @return {Promise}
     */


    _createClass(Tools, [{
        key: 'prepare',
        value: function prepare() {
            var _this2 = this;

            if (!this.config.hasOwnProperty('tools')) {

                return Promise.reject("Can't start without tools");
            }

            for (var toolName in this.config.tools) {

                this.toolClasses[toolName] = this.config.tools[toolName];
            }

            /**
             * getting classes that has prepare method
             */
            var sequenceData = this.getListOfPrepareFunctions();

            /**
             * if sequence data contains nothing then resolve current chain and run other module prepare
             */
            if (sequenceData.length === 0) {

                return Promise.resolve();
            }

            /**
             * to see how it works {@link Util#sequence}
             */
            return _.sequence(sequenceData, function (data) {

                _this2.success(data);
            }, function (data) {

                _this2.fallback(data);
            });
        }

        /**
         * Binds prepare function of plugins with user or default config
         * @return {Array} list of functions that needs to be fired sequentially
         */

    }, {
        key: 'getListOfPrepareFunctions',
        value: function getListOfPrepareFunctions() {

            var toolPreparationList = [];

            for (var toolName in this.toolClasses) {

                var toolClass = this.toolClasses[toolName];

                if (typeof toolClass.prepare === 'function') {

                    toolPreparationList.push({
                        function: toolClass.prepare,
                        data: {
                            toolName: toolName
                        }
                    });
                } else {

                    /**
                     * If Tool hasn't a prepare method, mark it as available
                     */
                    this.toolsAvailable[toolName] = toolClass;
                }
            }

            return toolPreparationList;
        }

        /**
         * @param {ChainData.data} data - append tool to available list
         */

    }, {
        key: 'success',
        value: function success(data) {

            this.toolsAvailable[data.toolName] = this.toolClasses[data.toolName];
        }

        /**
         * @param {ChainData.data} data - append tool to unavailable list
         */

    }, {
        key: 'fallback',
        value: function fallback(data) {

            this.toolsUnavailable[data.toolName] = this.toolClasses[data.toolName];
        }

        /**
         * Return tool`a instance
         *
         * @param {String} tool — tool name
         * @param {Object} data — initial data
         *
         * @todo throw exceptions if tool doesnt exist
         *
         */

    }, {
        key: 'construct',
        value: function construct(tool, data) {

            var plugin = this.toolClasses[tool],
                config = this.config.toolsConfig[tool];

            if (!config) {

                config = this.defaultConfig;
            }

            var instance = new plugin(data, config);

            return instance;
        }

        /**
         * Check if passed Tool is an instance of Initial Block Tool
         * @param {Tool} tool - Tool to check
         * @return {Boolean}
         */

    }, {
        key: 'isInitial',
        value: function isInitial(tool) {

            return tool instanceof this.available[this.config.initialBlock];
        }
    }]);

    return Tools;
}(Module);

Tools.displayName = 'Tools';
exports.default = Tools;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _block = __webpack_require__(3);

var _block2 = _interopRequireDefault(_block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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
 * @typedef {UI} UI
 * @property {EditorConfig} config   - editor configuration {@link CodexEditor#configuration}
 * @property {Object} Editor         - available editor modules {@link CodexEditor#moduleInstances}
 * @property {Object} nodes          -
 * @property {Element} nodes.holder  - element where we need to append redactor
 * @property {Element} nodes.wrapper  - <codex-editor>
 * @property {Element} nodes.redactor - <ce-redactor>
 */
var UI = function (_Module) {
  _inherits(UI, _Module);

  /**
   * @constructor
   *
   * @param  {EditorConfig} config
   */
  function UI(_ref) {
    var config = _ref.config;

    _classCallCheck(this, UI);

    var _this = _possibleConstructorReturn(this, (UI.__proto__ || Object.getPrototypeOf(UI)).call(this, { config: config }));

    _this.nodes = {
      holder: null,
      wrapper: null,
      redactor: null
    };

    return _this;
  }

  /**
   * Making main interface
   */


  _createClass(UI, [{
    key: 'prepare',
    value: function prepare() {
      var _this2 = this;

      return this.make()
      /**
       * Make toolbar
       */
      .then(function () {
        return _this2.Editor.Toolbar.make();
      })
      /**
       * Load and append CSS
       */
      .then(function () {
        return _this2.loadStyles();
      })
      /**
       * Bind events for the UI elements
       */
      .then(function () {
        return _this2.bindEvents();
      })

      /** Make container for inline toolbar */
      // .then(makeInlineToolbar_)

      /** Add inline toolbar tools */
      // .then(addInlineToolbarTools_)

      /** Draw wrapper for notifications */
      // .then(makeNotificationHolder_)

      /** Add eventlisteners to redactor elements */
      // .then(bindEvents_)

      .catch(function (e) {

        console.error(e);

        // editor.core.log("Can't draw editor interface");
      });
    }

    /**
     * CodeX Editor UI CSS class names
     * @return {{editorWrapper: string, editorZone: string, block: string}}
     */

  }, {
    key: 'make',


    /**
     * Makes CodeX Editor interface
     * @return {Promise<any>}
     */
    value: function make() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {

        /**
         * Element where we need to append CodeX Editor
         * @type {Element}
         */
        _this3.nodes.holder = document.getElementById(_this3.config.holderId);

        if (!_this3.nodes.holder) {

          reject(Error("Holder wasn't found by ID: #" + _this3.config.holderId));
          return;
        }

        /**
         * Create and save main UI elements
         */
        _this3.nodes.wrapper = $.make('div', _this3.CSS.editorWrapper);
        _this3.nodes.redactor = $.make('div', _this3.CSS.editorZone);

        _this3.nodes.wrapper.appendChild(_this3.nodes.redactor);
        _this3.nodes.holder.appendChild(_this3.nodes.wrapper);

        resolve();
      });
    }

    /**
     * Appends CSS
     */

  }, {
    key: 'loadStyles',
    value: function loadStyles() {

      /**
       * Load CSS
       */
      var styles = __webpack_require__(18);

      /**
       * Make tag
       */
      var tag = $.make('style', null, {
        textContent: styles.toString()
      });

      /**
       * Append styles
       */
      $.append(document.head, tag);
    }

    /**
     * Bind events on the CodeX Editor interface
     */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this4 = this;

      /**
       * @todo bind events with the Listeners module
       */
      this.nodes.redactor.addEventListener('click', function (event) {
        return _this4.redactorClicked(event);
      }, false);
    }

    /**
     * All clicks on the redactor zone
     *
     * @param {MouseEvent} event
     *
     * @description
     * 1. Save clicked Block as a current {@link BlockManager#currentNode}
     *      it uses for the following:
     *      - add CSS modifier for the selected Block
     *      - on Enter press, we make a new Block under that
     *
     * 2. Move and show the Toolbar
     *
     * 3. Set a Caret
     *
     * 4. By clicks on the Editor's bottom zone:
     *      - if last Block is empty, set a Caret to this
     *      - otherwise, add a new empty Block and set a Caret to that
     *
     * 5. Hide the Inline Toolbar
     *
     * @see selectClickedBlock
     *
     */

  }, {
    key: 'redactorClicked',
    value: function redactorClicked(event) {

      var clickedNode = event.target;

      /**
       * Select clicked Block as Current
       */
      try {

        this.Editor.BlockManager.setCurrentBlockByChildNode(clickedNode);

        /**
         * If clicked outside first-level Blocks, set Caret to the last empty Block
         */
      } catch (e) {

        this.Editor.Caret.setToTheLastBlock();
      }

      /**
       * @todo hide the Inline Toolbar
       */
      // var selectedText = editor.toolbar.inline.getSelectionText(),
      //     firstLevelBlock;

      /** If selection range took off, then we hide inline toolbar */
      // if (selectedText.length === 0) {

      // editor.toolbar.inline.close();

      // }

      /**
       *
       /** Update current input index in memory when caret focused into existed input */
      // if (event.target.contentEditable == 'true') {
      //
      //     editor.caret.saveCurrentInputIndex();
      //
      // }

      // if (editor.content.currentNode === null) {
      //
      //     /**
      //      * If inputs in redactor does not exits, then we put input index 0 not -1
      //      */
      //     var indexOfLastInput = editor.state.inputs.length > 0 ? editor.state.inputs.length - 1 : 0;
      //
      //     /** If we have any inputs */
      //     if (editor.state.inputs.length) {
      //
      //         /** getting firstlevel parent of input */
      //         firstLevelBlock = editor.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);
      //
      //     }
      //
      //     /** If input is empty, then we set caret to the last input */
      //     if (editor.state.inputs.length && editor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == editor.settings.initialBlockPlugin) {
      //
      //         editor.caret.setToBlock(indexOfLastInput);
      //
      //     } else {
      //
      //         /** Create new input when caret clicked in redactors area */
      //         var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
      //
      //         editor.content.insertBlock({
      //             type  : NEW_BLOCK_TYPE,
      //             block : editor.tools[NEW_BLOCK_TYPE].render()
      //         });
      //
      //         /** If there is no inputs except inserted */
      //         if (editor.state.inputs.length === 1) {
      //
      //             editor.caret.setToBlock(indexOfLastInput);
      //
      //         } else {
      //
      //             /** Set caret to this appended input */
      //             editor.caret.setToNextBlock(indexOfLastInput);
      //
      //         }
      //
      //     }
      //
      // } else {
      //
      //     /** Close all panels */
      //     editor.toolbar.settings.close();
      //     editor.toolbar.toolbox.close();
      //
      // }
      //
      /**
       * Move toolbar and open
       */
      this.Editor.Toolbar.move();
      this.Editor.Toolbar.open();
      //
      // var inputIsEmpty = !editor.content.currentNode.textContent.trim(),
      //     currentNodeType = editor.content.currentNode.dataset.tool,
      //     isInitialType = currentNodeType == editor.settings.initialBlockPlugin;
      //
      //

      /**
       * Hide the Plus Button
       * */
      this.Editor.Toolbar.plusButton.hide();

      /**
       * Show the Plus Button if:
       * - Block is an initial-block (Text)
       * - Block is empty
       */
      var isInitialBlock = this.Editor.Tools.isInitial(this.Editor.BlockManager.currentBlock.tool),
          isEmptyBlock = this.Editor.BlockManager.currentBlock.isEmpty;

      if (isInitialBlock && isEmptyBlock) {

        this.Editor.Toolbar.plusButton.show();
      }
    }
  }, {
    key: 'CSS',
    get: function get() {

      return {
        editorWrapper: 'codex-editor',
        editorZone: 'codex-editor__redactor'
      };
    }
  }]);

  return UI;
}(Module);

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
//     /** Draw notifications holder */
//     var makeNotificationHolder_ = function () {
//
//         /** Append block with notifications to the document */
//         editor.nodes.notifications = editor.notifications.createHolder();
//
//     };
//
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


UI.displayName = 'UI';
exports.default = UI;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(19)(undefined);
// imports


// module
exports.push([module.i, ":root {\n\n    /**\n     * Toolbar buttons\n     */\n\n    /**\n     * Block content width\n     */\n\n    /**\n     * Toolbar Plus Button and Toolbox buttons height and width\n     */\n\n}\n/**\n* Editor wrapper\n*/\n.codex-editor {\n    position: relative;\n    border: 1px solid #ccc;\n    padding: 10px;\n    box-sizing: border-box;\n}\n.codex-editor .hide {\n        display: none;\n    }\n.codex-editor__redactor {\n        padding-bottom: 300px;\n    }\n.ce-toolbar {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 100ms ease;\n  will-change: opacity, transform;\n}\n.ce-toolbar--opened {\n    opacity: 1;\n    visibility: visible;\n  }\n.ce-toolbar__content {\n    max-width: 650px;\n    margin: 0 auto;\n    position: relative;\n  }\n.ce-toolbar__plus {\n    position: absolute;\n    left: calc(-34px - 10px);\n    display: inline-block;\n    background-color: #eff2f5;\n    width: 34px;\n    height: 34px;\n    line-height: 34px;\n    text-align: center;\n    border-radius: 50%\n  }\n.ce-toolbar__plus::after {\n    content: '+';\n    font-size: 26px;\n    display: block;\n    margin-top: -2px;\n    margin-right: -2px;\n\n}\n.ce-toolbar__plus--hidden {\n      display: none;\n\n}\n.ce-toolbox {\n    visibility: hidden;\n    transition: opacity 100ms ease;\n    will-change: opacity;\n}\n.ce-toolbox--opened {\n        opacity: 1;\n        visibility: visible;\n    }\n.ce-toolbox__button {\n        display: inline-block;\n        list-style: none;\n        margin: 0;\n        background: #eff2f5;\n        width: 34px;\n        height: 34px;\n        border-radius: 30px;\n        overflow: hidden;\n        text-align: center;\n        line-height: 34px\n    }\n.ce-toolbox__button::before {\n    content: attr(title);\n    font-size: 22px;\n    font-weight: 500;\n    letter-spacing: 1em;\n    -webkit-font-feature-settings: \"smcp\", \"c2sc\";\n            font-feature-settings: \"smcp\", \"c2sc\";\n    font-variant-caps: all-small-caps;\n    padding-left: 11.5px;\n    margin-top: -1px;\n    display: inline-block;\n\n}\n.ce-block {\n  border: 1px dotted #ccc;\n  margin: 2px 0;\n}\n.ce-block--selected {\n    background-color: #eff2f5;\n  }\n.ce-block__content {\n    max-width: 650px;\n    margin: 0 auto;\n  }\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ })
/******/ ]);
//# sourceMappingURL=codex-editor.js.map