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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();exports.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.interopRequireDefault = function (obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
};

exports.toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return Array.from(arr);
  }
};

exports.typeof = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * DOM manupulations helper
 */
module.exports = function () {
    function Dom() {
        __webpack_require__(0).classCallCheck(this, Dom);
    }

    __webpack_require__(0).createClass(Dom, null, [{
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

                (_el$classList = el.classList).add.apply(_el$classList, __webpack_require__(0).toConsumableArray(classNames));
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
        key: 'isNode',
        value: function isNode(node) {

            return node && (typeof node === 'undefined' ? 'undefined' : __webpack_require__(0).typeof(node)) === 'object' && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
        }
    }]);

    return Dom;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Codex Editor
 *
 * Short Description (눈_눈;)
 * @version 2.0.0
 *
 * How to start?
 * Example:
 *           new CodexEditor({
 *                holderId : 'codex-editor',
 *                initialBlock : 'paragraph',
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
 * @property {String} holderId - Element to append Editor
 * ...
 */



/**
 * Require Editor modules places in components/modules dir
 */
// eslint-disable-next-line

var modules = ["blockManager.js","events.js","renderer.js","toolbar.js","tools.js","ui.js"].map(function (module) {
    return __webpack_require__(3)("./" + module);
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
    __webpack_require__(0).createClass(CodexEditor, null, [{
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

        __webpack_require__(0).classCallCheck(this, CodexEditor);

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
     * @param {Object} config
     */


    __webpack_require__(0).createClass(CodexEditor, [{
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
         * @return {Promise}
         */

    }, {
        key: 'start',
        value: function start() {

            var prepareDecorator = function prepareDecorator(module) {
                return module.prepare();
            };

            return Promise.resolve().then(prepareDecorator(this.moduleInstances.UI)).then(prepareDecorator(this.moduleInstances.Tools)).then(prepareDecorator(this.moduleInstances.BlockManager)).catch(function (error) {

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./blockManager.js": 4,
	"./events.js": 6,
	"./renderer.js": 7,
	"./toolbar.js": 8,
	"./tools.js": 9,
	"./ui.js": 11
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
webpackContext.id = 3;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {

var _block = __webpack_require__(5);

var _block2 = __webpack_require__(0).interopRequireDefault(_block);

var BlockManager = function () {

    /**
     * @constructor
     *
     * @param {EditorConfig} config
     */
    function BlockManager(_ref) {
        var config = _ref.config;

        __webpack_require__(0).classCallCheck(this, BlockManager);

        this.config = config;
        this.Editor = null;
        this._blocks = null;
        this._currentBlockIndex = -1;
    }

    /**
     * Editor modules setting
     *
     * @param Editor
     */


    __webpack_require__(0).createClass(BlockManager, [{
        key: 'prepare',


        /**
         * Should be called after Editor.UI preparation
         * Define this._blocks property
         *
         * @returns {Promise}
         */
        value: function prepare() {
            var _this = this;

            return new Promise(function (resolve) {

                var blocks = new Blocks(_this.Editor.UI.nodes.redactor);

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
                _this._blocks = new Proxy(blocks, {
                    set: Blocks.set,
                    get: Blocks.get
                });

                resolve();
            });
        }

        /**
         * Insert new block into _blocks
         *
         * @param {String} toolName — plugin name
         * @param {Object} data — plugin data
         */

    }, {
        key: 'insert',
        value: function insert(toolName, data) {

            var toolInstance = this.Editor.Tools.construct(toolName, data),
                block = new _block2.default(toolInstance);

            this._blocks[++this._currentBlockIndex] = block;
        }

        /**
         * Replace current working block
         *
         * @param {String} toolName — plugin name
         * @param {Object} data — plugin data
         */

    }, {
        key: 'replace',
        value: function replace(toolName, data) {

            var toolInstance = this.Editor.Tools.construct(toolName, data),
                block = new _block2.default(toolInstance);

            this._blocks.insert(this._currentBlockIndex, block, true);
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
        key: 'state',
        set: function set(Editor) {

            this.Editor = Editor;
        }
    }, {
        key: 'currentBlock',
        get: function get() {

            return this._blocks[this._currentBlockIndex];
        }

        /**
         * Get working html element
         *
         * @return {HTMLElement}
         */

    }, {
        key: 'currentNode',
        get: function get() {

            return this._blocks.nodes[this._currentBlockIndex];
        }

        /**
         * Set _currentBlockIndex to passed block
         *
         * @todo get first level block before searching
         *
         * @param {HTMLElement} element
         */
        ,
        set: function set(element) {

            var nodes = this._blocks.nodes;

            this._currentBlockIndex = nodes.indexOf(element);
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
}();

/**
 * @class Blocks
 * @classdesc Class to work with Block instances array
 *
 * @private
 *
 * @property {HTMLElement} workingArea — editor`s working node
 *
 */
/**
 * @class BlockManager
 * @classdesc Manage editor`s blocks storage and appearance
 */

BlockManager.displayName = 'BlockManager';

var Blocks = function () {

    /**
     * @constructor
     *
     * @param {HTMLElement} workingArea — editor`s working node
     */
    function Blocks(workingArea) {
        __webpack_require__(0).classCallCheck(this, Blocks);

        this._blocks = [];
        this.workingArea = workingArea;
    }

    /**
     * Push back new Block
     *
     * @param {Block} block
     */


    __webpack_require__(0).createClass(Blocks, [{
        key: 'push',
        value: function push(block) {

            this._blocks.push(block);
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

                this._blocks[index].html.remove();
            }

            var deleteCount = replace ? 1 : 0;

            this._blocks.splice(index, deleteCount, block);

            if (index > 0) {

                var previousBlock = this._blocks[index - 1];

                previousBlock.html.insertAdjacentElement('afterend', block.html);
            } else {

                var nextBlock = this._blocks[index + 1];

                nextBlock.html.insertAdjacentElement('beforebegin', block.html);
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

            var index = this._blocks.indexOf(targetBlock);

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

            return this._blocks[index];
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

            return this._blocks.indexOf(block);
        }

        /**
         * Get length of Block instances array
         *
         * @returns {Number}
         */

    }, {
        key: 'length',
        get: function get() {

            return this._blocks.length;
        }

        /**
         * Get Block instances array
         *
         * @returns {Block[]}
         */

    }, {
        key: 'array',
        get: function get() {

            return this._blocks;
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


module.exports = BlockManager;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 *
 * @class Block
 * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
 *
 * @property {Tool} tool — current block tool (Paragraph, for example)
 * @property {Object} CSS — block`s css classes
 *
 */

var Block = function () {

    /**
     * @constructor
     *
     * @param {Object} tool — current block plugin`s instance
     */
    function Block(tool) {
        __webpack_require__(0).classCallCheck(this, Block);

        this.tool = tool;

        this.CSS = {
            wrapper: 'ce-block',
            content: 'ce-block__content'
        };

        this._html = this.compose();
    }

    /**
     * Make default block wrappers and put tool`s content there
     *
     * @returns {HTMLDivElement}
     * @private
     */


    __webpack_require__(0).createClass(Block, [{
        key: 'compose',
        value: function compose() {

            var wrapper = $.make('div', this.CSS.wrapper),
                content = $.make('div', this.CSS.content);

            content.appendChild(this.tool.html);
            wrapper.appendChild(content);

            return wrapper;
        }

        /**
         * Get block`s HTML
         *
         * @returns {HTMLDivElement}
         */

    }, {
        key: 'html',
        get: function get() {

            return this._html;
        }
    }]);

    return Block;
}();

Block.displayName = 'Block';
exports.default = Block;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module eventDispatcher
 *
 * Has two important methods:
 *    - {Function} on - appends subscriber to the event. If event doesn't exist - creates new one
 *    - {Function} emit - fires all subscribers with data
 *
 * @version 1.0.0
 */
var Events = function () {
    __webpack_require__(0).createClass(Events, [{
        key: "state",


        /**
         * @param Editor
         * @param Editor.modules {@link CodexEditor#moduleInstances}
         * @param Editor.config {@link CodexEditor#configuration}
         */
        set: function set(Editor) {

            this.Editor = Editor;
        }

        /**
         * @constructor
         *
         * @property {Object} subscribers - all subscribers grouped by event name
         */

    }]);

    function Events() {
        __webpack_require__(0).classCallCheck(this, Events);

        this.subscribers = {};
        this.Editor = null;
    }

    /**
     * @param {String} eventName - event name
     * @param {Function} callback - subscriber
     */


    __webpack_require__(0).createClass(Events, [{
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
         */

    }, {
        key: "destroy",
        value: function destroy() {

            this.Editor = null;
            this.subscribers = null;
        }
    }]);

    return Events;
}();

Events.displayName = "Events";


module.exports = Events;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {

/**
 * Codex Editor Renderer Module
 *
 * @author Codex Team
 * @version 2.0.0
 */

var Renderer = function () {

    /**
     * @constructor
     *
     * @param {EditorConfig} config
     */
    function Renderer(config) {
        __webpack_require__(0).classCallCheck(this, Renderer);

        this.config = config;
        this.Editor = null;
    }

    /**
     * Editor modules setter
     *
     * @param {Object} Editor
     */


    __webpack_require__(0).createClass(Renderer, [{
        key: "render",


        /**
         *
         * Make plugin blocks from array of plugin`s data
         *
         * @param {Object[]} items
         */
        value: function render(items) {
            var _this = this;

            var chainData = [];

            var _loop = function _loop(i) {

                chainData.push({
                    function: function _function() {
                        return _this.insertBlock(items[i]);
                    }
                });
            };

            for (var i = 0; i < items.length; i++) {
                _loop(i);
            }

            _.sequence(chainData);
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
    }, {
        key: "state",
        set: function set(Editor) {

            this.Editor = Editor;
        }
    }]);

    return Renderer;
}();

Renderer.displayName = "Renderer";


module.exports = Renderer;

// module.exports = (function (renderer) {
//
//     let editor = codex.editor;
//
//     /**
//      * Asyncronously parses input JSON to redactor blocks
//      */
//     renderer.makeBlocksFromData = function () {
//
//         /**
//          * If redactor is empty, add first paragraph to start writing
//          */
//         if (editor.core.isEmpty(editor.state.blocks) || !editor.state.blocks.items.length) {
//
//             editor.ui.addInitialBlock();
//             return;
//
//         }
//
//         Promise.resolve()
//
//         /** First, get JSON from state */
//             .then(function () {
//
//                 return editor.state.blocks;
//
//             })
//
//             /** Then, start to iterate they */
//             .then(editor.renderer.appendBlocks)
//
//             /** Write log if something goes wrong */
//             .catch(function (error) {
//
//                 editor.core.log('Error while parsing JSON: %o', 'error', error);
//
//             });
//
//     };
//
//     /**
//      * Parses JSON to blocks
//      * @param {object} data
//      * @return Promise -> nodeList
//      */
//     renderer.appendBlocks = function (data) {
//
//         var blocks = data.items;
//
//         /**
//          * Sequence of one-by-one blocks appending
//          * Uses to save blocks order after async-handler
//          */
//         var nodeSequence = Promise.resolve();
//
//         for (var index = 0; index < blocks.length ; index++ ) {
//
//             /** Add node to sequence at specified index */
//             editor.renderer.appendNodeAtIndex(nodeSequence, blocks, index);
//
//         }
//
//     };
//
//     /**
//      * Append node at specified index
//      */
//     renderer.appendNodeAtIndex = function (nodeSequence, blocks, index) {
//
//         /** We need to append node to sequence */
//         nodeSequence
//
//         /** first, get node async-aware */
//             .then(function () {
//
//                 return editor.renderer.getNodeAsync(blocks, index);
//
//             })
//
//             /**
//              * second, compose editor-block from JSON object
//              */
//             .then(editor.renderer.createBlockFromData)
//
//             /**
//              * now insert block to redactor
//              */
//             .then(function (blockData) {
//
//                 /**
//                  * blockData has 'block', 'type' and 'stretched' information
//                  */
//                 editor.content.insertBlock(blockData);
//
//                 /** Pass created block to next step */
//                 return blockData.block;
//
//             })
//
//             /** Log if something wrong with node */
//             .catch(function (error) {
//
//                 editor.core.log('Node skipped while parsing because %o', 'error', error);
//
//             });
//
//     };
//
//     /**
//      * Asynchronously returns block data from blocksList by index
//      * @return Promise to node
//      */
//     renderer.getNodeAsync = function (blocksList, index) {
//
//         return Promise.resolve().then(function () {
//
//             return {
//                 tool : blocksList[index],
//                 position : index
//             };
//
//         });
//
//     };
//
//     /**
//      * Creates editor block by JSON-data
//      *
//      * @uses render method of each plugin
//      *
//      * @param {Object} toolData.tool
//      *                              { header : {
//      *                                                text: '',
//      *                                                type: 'H3', ...
//      *                                            }
//      *                               }
//      * @param {Number} toolData.position - index in input-blocks array
//      * @return {Object} with type and Element
//      */
//     renderer.createBlockFromData = function ( toolData ) {
//
//         /** New parser */
//         var block,
//             tool = toolData.tool,
//             pluginName = tool.type;
//
//         /** Get first key of object that stores plugin name */
//         // for (var pluginName in blockData) break;
//
//         /** Check for plugin existance */
//         if (!editor.tools[pluginName]) {
//
//             throw Error(`Plugin «${pluginName}» not found`);
//
//         }
//
//         /** Check for plugin having render method */
//         if (typeof editor.tools[pluginName].render != 'function') {
//
//             throw Error(`Plugin «${pluginName}» must have «render» method`);
//
//         }
//
//         if ( editor.tools[pluginName].available === false ) {
//
//             block = editor.draw.unavailableBlock();
//
//             block.innerHTML = editor.tools[pluginName].loadingMessage;
//
//             /**
//             * Saver will extract data from initial block data by position in array
//             */
//             block.dataset.inputPosition = toolData.position;
//
//         } else {
//
//             /** New Parser */
//             block = editor.tools[pluginName].render(tool.data);
//
//         }
//
//         /** is first-level block stretched */
//         var stretched = editor.tools[pluginName].isStretched || false;
//
//         /** Retrun type and block */
//         return {
//             type      : pluginName,
//             block     : block,
//             stretched : stretched
//         };
//
//     };
//
//     return renderer;
//
// })({});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

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
var Toolbar = function () {

  /**
   * @constructor
   */
  function Toolbar() {
    __webpack_require__(0).classCallCheck(this, Toolbar);

    this.Editor = null;

    this.nodes = {
      wrapper: null,
      content: null,
      actions: null,

      // Content Zone
      plusButton: null,
      toolbox: null,

      // Actions Zone
      settingsToggler: null,
      removeBlockButton: null,
      settings: null,

      // Settings Zone: Plugin Settings and Default Settings
      pluginSettings: null,
      defaultSettings: null
    };

    this.CSS = {
      toolbar: 'ce-toolbar',
      content: 'ce-toolbar__content',
      actions: 'ce-toolbar__actions',

      // Content Zone
      toolbox: 'ce-toolbar__toolbox',
      plusButton: 'ce-toolbar__plus',

      // Actions Zone
      settingsToggler: 'ce-toolbar__settings-btn',
      removeBlockButton: 'ce-toolbar__remove-btn',

      // Settings Panel
      settings: 'ce-settings',
      defaultSettings: 'ce-settings_default',
      pluginSettings: 'ce-settings_plugin'
    };
  }

  /**
   * Editor modules setter
   * @param {object} Editor - available editor modules
   */


  __webpack_require__(0).createClass(Toolbar, [{
    key: 'make',


    /**
     * Makes toolbar
     */
    value: function make() {
      var _this = this;

      this.nodes.wrapper = $.make('div', this.CSS.toolbar);

      /**
       * Make Content Zone and Actions Zone
       */
      ['content', 'actions'].forEach(function (el) {

        _this.nodes[el] = $.make('div', _this.CSS[el]);
        $.append(_this.nodes.wrapper, _this.nodes[el]);
      });

      /**
       * Fill Content Zone:
       *  - Plus Button
       *  - Toolbox
       */
      ['plusButton', 'toolbox'].forEach(function (el) {

        _this.nodes[el] = $.make('div', _this.CSS[el]);
        $.append(_this.nodes.content, _this.nodes[el]);
      });

      /**
       * Fill Actions Zone:
       *  - Settings Toggler
       *  - Remove Block Button
       *  - Settings Panel
       */
      this.nodes.settingsToggler = $.make('span', this.CSS.settingsToggler);
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

      this.nodes.settings = $.make('div', this.CSS.settings);

      this.nodes.pluginSettings = $.make('div', this.CSS.pluginSettings);
      this.nodes.defaultSettings = $.make('div', this.CSS.defaultSettings);

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
      return $.make('span', this.CSS.removeBlockButton);
    }
  }, {
    key: 'state',
    set: function set(Editor) {

      this.Editor = Editor;
    }
  }]);

  return Toolbar;
}();

Toolbar.displayName = 'Toolbar';


module.exports = Toolbar;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {

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
 * @todo update according to current API
 *
 * @typedef {Object} Tool
 * @property render
 * @property save
 * @property settings
 * @property validate
 */

/**
 * Class properties:
 *
 * @property {String} name - name of this module
 * @property {Object[]} toolInstances - list of tool instances
 * @property {Tools[]} available - available Tools
 * @property {Tools[]} unavailable - unavailable Tools
 * @property {Object} toolsClasses - all classes
 * @property {EditorConfig} config - Editor config
 */

var Tools = function () {
    __webpack_require__(0).createClass(Tools, [{
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
         * @param Editor
         * @param Editor.modules {@link CodexEditor#moduleInstances}
         * @param Editor.config {@link CodexEditor#configuration}
         */

    }, {
        key: 'state',
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

    }]);

    function Tools(_ref) {
        var config = _ref.config;

        __webpack_require__(0).classCallCheck(this, Tools);

        this.config = config;

        this.toolClasses = {};
        this.toolsAvailable = {};
        this.toolsUnavailable = {};
    }

    /**
     * Creates instances via passed or default configuration
     * @return {boolean}
     */


    __webpack_require__(0).createClass(Tools, [{
        key: 'prepare',
        value: function prepare() {
            var _this = this;

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

                _this.success(data);
            }, function (data) {

                _this.fallback(data);
            });
        }

        /**
         * Binds prepare function of plugins with user or default config
         * @return {Array} list of functions that needs to be fired sequently
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
         * Returns all tools
         * @return {Array}
         */

    }, {
        key: 'getTools',
        value: function getTools() {

            return this.toolInstances;
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

            var instance = new plugin(data, config);

            return instance;
        }
    }]);

    return Tools;
}();

Tools.displayName = 'Tools';


module.exports = Tools;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Codex Editor Util
 */
module.exports = function () {
    function Util() {
        __webpack_require__(0).classCallCheck(this, Util);
    }

    __webpack_require__(0).createClass(Util, null, [{
        key: "sequence",


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

                        successCallback(chainData.data);
                    }).then(resolve).catch(function () {

                        fallbackCallback(chainData.data);

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
        key: "array",
        value: function array(collection) {

            return Array.prototype.slice.call(collection);
        }
    }]);

    return Util;
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

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

var UI = function () {

  /**
   * @constructor
   *
   * @param  {EditorConfig} config
   */
  function UI(_ref) {
    var config = _ref.config;

    __webpack_require__(0).classCallCheck(this, UI);

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


  __webpack_require__(0).createClass(UI, [{
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
        _this.nodes.wrapper = $.make('div', CSS.editorWrapper);
        _this.nodes.redactor = $.make('div', CSS.editorZone);

        _this.nodes.wrapper.appendChild(_this.nodes.redactor);
        _this.nodes.holder.appendChild(_this.nodes.wrapper);

        /**
         * Make toolbar
         */
        _this.Editor.Toolbar.make();

        /**
         * Load and append CSS
         */
        _this.loadStyles();

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

      .catch(function (e) {

        console.error(e);

        // editor.core.log("Can't draw editor interface");
      });
    }
  }, {
    key: 'loadStyles',
    value: function loadStyles() {

      /**
       * Load CSS
       */
      var styles = __webpack_require__(12);

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
  }, {
    key: 'state',
    set: function set(Editor) {

      this.Editor = Editor;
    }
  }]);

  return UI;
}();

UI.displayName = 'UI';


module.exports = UI;

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(undefined);
// imports


// module
exports.push([module.i, ":root {\n\n    /**\n     * Toolbar buttons\n     */\n\n}\n/**\n* Editor wrapper\n*/\n.codex-editor{\n    position: relative;\n    border: 1px solid #ccc;\n    padding: 10px;\n}\n.codex-editor .hide {\n        display: none;\n    }\n", ""]);

// exports


/***/ }),
/* 13 */
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