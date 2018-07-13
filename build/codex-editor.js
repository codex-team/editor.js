(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CodexEditor"] = factory();
	else
		root["CodexEditor"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/codex.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/sprite.svg":
/*!**************************!*\
  !*** ./build/sprite.svg ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\">\n<symbol id=\"arrow-down\" viewBox=\"0 0 14 14\">\n  <path transform=\"matrix(1 0 0 -1 0 14)\" d=\"M8.024 4.1v8.6a1.125 1.125 0 0 1-2.25 0V4.1L2.18 7.695A1.125 1.125 0 1 1 .59 6.104L6.103.588c.44-.439 1.151-.439 1.59 0l5.516 5.516a1.125 1.125 0 0 1-1.59 1.59L8.023 4.1z\"/>\n\n</symbol>\n<symbol id=\"arrow-up\" viewBox=\"0 0 14 14\">\n    <path d=\"M8.024 4.1v8.6a1.125 1.125 0 0 1-2.25 0V4.1L2.18 7.695A1.125 1.125 0 1 1 .59 6.104L6.103.588c.44-.439 1.151-.439 1.59 0l5.516 5.516a1.125 1.125 0 0 1-1.59 1.59L8.023 4.1z\"/>\n\n</symbol>\n<symbol id=\"bold\" viewBox=\"0 0 13 15\">\n  <path d=\"M5.996 13.9H1.752c-.613 0-1.05-.137-1.312-.412-.262-.275-.393-.712-.393-1.312V1.737C.047 1.125.18.684.449.416.718.147 1.152.013 1.752.013h4.5a10.5 10.5 0 0 1 1.723.123c.487.082.922.24 1.308.474a3.43 3.43 0 0 1 1.449 1.738c.132.363.199.747.199 1.151 0 1.39-.695 2.406-2.084 3.05 1.825.581 2.737 1.712 2.737 3.391 0 .777-.199 1.477-.596 2.099a3.581 3.581 0 0 1-1.61 1.378c-.424.177-.91.301-1.46.374-.549.073-1.19.109-1.922.109zm-.209-6.167H2.86v4.055h3.022c1.9 0 2.851-.686 2.851-2.056 0-.7-.246-1.21-.739-1.525-.492-.316-1.228-.474-2.207-.474zM2.86 2.125v3.59h2.577c.7 0 1.242-.066 1.624-.198a1.55 1.55 0 0 0 .876-.758c.158-.265.237-.562.237-.89 0-.702-.25-1.167-.748-1.398-.499-.23-1.26-.346-2.283-.346H2.86z\"/>\n\n</symbol>\n<symbol id=\"cross\" viewBox=\"0 0 237 237\">\n  <path transform=\"rotate(45 280.675 51.325)\" d=\"M191 191V73c0-5.523 4.477-10 10-10h25c5.523 0 10 4.477 10 10v118h118c5.523 0 10 4.477 10 10v25c0 5.523-4.477 10-10 10H236v118c0 5.523-4.477 10-10 10h-25c-5.523 0-10-4.477-10-10V236H73c-5.523 0-10-4.477-10-10v-25c0-5.523 4.477-10 10-10h118z\"/>\n\n</symbol>\n<symbol id=\"dots\" viewBox=\"0 0 18 4\">\n  <g fill-rule=\"evenodd\">\n    <circle cx=\"9\" cy=\"2\" r=\"2\"/>\n    <circle cx=\"2\" cy=\"2\" r=\"2\"/>\n    <circle cx=\"16\" cy=\"2\" r=\"2\"/>\n  </g>\n\n</symbol>\n<symbol id=\"italic\" viewBox=\"0 0 6 15\">\n  <path d=\"M4 5.2l-1.368 7.474c-.095.518-.29.91-.585 1.175a1.468 1.468 0 0 1-1.01.398c-.379 0-.662-.136-.85-.407-.186-.272-.234-.66-.141-1.166L1.4 5.276c.093-.511.282-.896.567-1.155a1.43 1.43 0 0 1 .994-.389c.38 0 .668.13.867.389.199.259.256.618.172 1.08zm-.79-2.67c-.36 0-.648-.111-.863-.332-.215-.221-.286-.534-.212-.938.067-.366.253-.668.559-.905A1.57 1.57 0 0 1 3.673 0c.334 0 .612.107.831.322.22.215.292.527.217.938-.073.398-.256.709-.55.933a1.55 1.55 0 0 1-.961.336z\"/>\n\n</symbol>\n<symbol id=\"link\" viewBox=\"0 0 15 14\">\n    <path transform=\"rotate(-45 11.83 6.678)\" d=\"M11.332 4.013a51.07 51.07 0 0 1-2.28.001A1.402 1.402 0 0 0 7.7 2.25H3.65a1.4 1.4 0 1 0 0 2.8h.848c.206.86.693 1.61 1.463 2.25H3.65a3.65 3.65 0 1 1 0-7.3H7.7a3.65 3.65 0 0 1 3.632 4.013zM10.9 0h2a3.65 3.65 0 0 1 0 7.3H8.85a3.65 3.65 0 0 1-3.632-4.011A62.68 62.68 0 0 1 7.5 3.273 1.401 1.401 0 0 0 8.85 5.05h4.05a1.4 1.4 0 0 0 0-2.8h-.48C12.274 1.664 11.694.785 10.9 0z\"/>\n\n</symbol>\n<symbol id=\"plus\" viewBox=\"0 0 14 14\">\n    <path d=\"M8.05 5.8h4.625a1.125 1.125 0 0 1 0 2.25H8.05v4.625a1.125 1.125 0 0 1-2.25 0V8.05H1.125a1.125 1.125 0 0 1 0-2.25H5.8V1.125a1.125 1.125 0 0 1 2.25 0V5.8z\"/>\n\n</symbol>\n<symbol id=\"unlink\" viewBox=\"0 0 16 18\">\n    <path transform=\"rotate(-45 8.358 11.636)\" d=\"M9.14 9.433c.008-.12-.087-.686-.112-.81a1.4 1.4 0 0 0-1.64-1.106l-3.977.772a1.4 1.4 0 0 0 .535 2.749l.935-.162s.019 1.093.592 2.223l-1.098.148A3.65 3.65 0 1 1 2.982 6.08l3.976-.773c1.979-.385 3.838.919 4.28 2.886.51 2.276-1.084 2.816-1.073 2.935.011.12-.394-1.59-1.026-1.696zm3.563-.875l2.105 3.439a3.65 3.65 0 0 1-6.19 3.868L6.47 12.431c-1.068-1.71-.964-2.295-.49-3.07.067-.107 1.16-1.466 1.48-.936-.12.036.9 1.33.789 1.398-.656.41-.28.76.13 1.415l2.145 3.435a1.4 1.4 0 0 0 2.375-1.484l-1.132-1.941c.42-.435 1.237-1.054.935-2.69zm1.88-2.256h3.4a1.125 1.125 0 0 1 0 2.25h-3.4a1.125 1.125 0 0 1 0-2.25zM11.849.038c.62 0 1.125.503 1.125 1.125v3.4a1.125 1.125 0 0 1-2.25 0v-3.4c0-.622.503-1.125 1.125-1.125z\"/>\n\n</symbol></svg>"

/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
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


/***/ }),

/***/ "./node_modules/html-janitor/src/html-janitor.js":
/*!*******************************************************!*\
  !*** ./node_modules/html-janitor/src/html-janitor.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
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

/***/ "./src/codex.js":
/*!**********************!*\
  !*** ./src/codex.js ***!
  \**********************/
/*! no static exports found */
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
 * @property {Object} toolsConfig        - tools configuration {@link tools#ToolConfig}
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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(/*! components/polyfills */ "./src/components/polyfills.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Require Editor modules places in components/modules dir
 */
// eslint-disable-next-line
var modules = ["api-blocks.ts","api-events.ts","api-listener.ts","api-sanitizer.ts","api-selection.ts","api-toolbar.ts","api.ts","blockManager.js","caret.js","events.js","keyboard.js","listeners.js","renderer.js","sanitizer.js","saver.js","toolbar-blockSettings.js","toolbar-inline.ts","toolbar-toolbox.js","toolbar.js","tools.js","ui.js"].map(function (module) {
  return __webpack_require__("./src/components/modules sync [^_](api-blocks.ts|api-events.ts|api-listener.ts|api-sanitizer.ts|api-selection.ts|api-toolbar.ts|api.ts|blockManager.js|caret.js|events.js|keyboard.js|listeners.js|renderer.js|sanitizer.js|saver.js|toolbar-blockSettings.js|toolbar-inline.ts|toolbar-toolbox.js|toolbar.js|tools.js|ui.js)$")("./" + module);
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

var CodexEditor = function () {
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
     * @property {BlockSettings} BlockSettings
     * @property {Renderer} Renderer
     * @property {InlineToolbar} InlineToolbar
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

CodexEditor.displayName = 'CodexEditor';
exports.default = CodexEditor;
;

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

module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/__module.ts":
/*!************************************!*\
  !*** ./src/components/__module.ts ***!
  \************************************/
/*! no static exports found */
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
   * @param {EditorConfig} config
   */
  function Module(_ref) {
    var config = _ref.config;

    _classCallCheck(this, Module);

    /**
     * Editor modules list
     * @type {EditorComponents}
     */
    this.Editor = null;
    /**
     * Editor configuration object
     * @type {EditorConfig}
     */
    this.config = {};
    if (new.target === Module) {
      throw new TypeError('Constructors for abstract class Module are not allowed.');
    }
    this.config = config;
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

/***/ "./src/components/block-tunes/block-tune-delete.ts":
/*!*********************************************************!*\
  !*** ./src/components/block-tunes/block-tune-delete.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeleteTune = function () {
    /**
     * DeleteTune constructor
     *
     * @param {Object} api
     */
    function DeleteTune(_ref) {
        var _this = this;

        var api = _ref.api;

        _classCallCheck(this, DeleteTune);

        /**
         * Styles
         * @type {{wrapper: string}}
         */
        this.CSS = {
            wrapper: 'ass',
            button: 'ce-settings__button',
            buttonDelete: 'ce-settings__button--delete',
            buttonConfirm: 'ce-settings__button--confirm'
        };
        /**
         * Tune nodes
         */
        this.nodes = {
            button: null
        };
        this.api = api;
        this.resetConfirmation = function () {
            _this.setConfirmation(false);
        };
    }
    /**
     * Create "Delete" button and add click event listener
     * @returns [Element}
     */


    _createClass(DeleteTune, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            this.nodes.button = $.make('div', [this.CSS.button, this.CSS.buttonDelete], {});
            this.nodes.button.appendChild($.svg('cross', 12, 12));
            this.api.listener.on(this.nodes.button, 'click', function (event) {
                return _this2.handleClick(event);
            }, false);
            return this.nodes.button;
        }
        /**
         * Delete block conditions passed
         * @param {MouseEvent} event
         */

    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            /**
             * if block is not waiting the confirmation, subscribe on block-settings-closing event to reset
             * otherwise delete block
             */
            if (!this.needConfirmation) {
                this.setConfirmation(true);
                /**
                 * Subscribe on event.
                 * When toolbar block settings is closed but block deletion is not confirmed,
                 * then reset confirmation state
                 */
                this.api.events.on('block-settings-closed', this.resetConfirmation);
            } else {
                /**
                 * Unsubscribe from block-settings closing event
                 */
                this.api.events.off('block-settings-closed', this.resetConfirmation);
                this.api.blocks.delete();
            }
        }
        /**
         * change tune state
         */

    }, {
        key: 'setConfirmation',
        value: function setConfirmation(state) {
            this.needConfirmation = state;
            this.nodes.button.classList.add(this.CSS.buttonConfirm);
        }
    }]);

    return DeleteTune;
}();

DeleteTune.displayName = 'DeleteTune';
exports.default = DeleteTune;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! dom */ "./src/components/dom.js")))

/***/ }),

/***/ "./src/components/block-tunes/block-tune-move-up.ts":
/*!**********************************************************!*\
  !*** ./src/components/block-tunes/block-tune-move-up.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MoveUpTune = function () {
    /**
     * MoveUpTune constructor
     *
     * @param {Object} api
     */
    function MoveUpTune(_ref) {
        var api = _ref.api;

        _classCallCheck(this, MoveUpTune);

        /**
         * Styles
         * @type {{wrapper: string}}
         */
        this.CSS = {
            button: 'ce-settings__button',
            wrapper: 'ce-settings-move-up',
            btnDisabled: 'ce-settings-move-up--disabled'
        };
        this.api = api;
    }
    /**
     * Create "MoveUp" button and add click event listener
     * @returns [Element}
     */


    _createClass(MoveUpTune, [{
        key: 'render',
        value: function render() {
            var _this = this;

            var moveUpButton = $.make('div', [this.CSS.button, this.CSS.wrapper], {});
            moveUpButton.appendChild($.svg('arrow-up', 14, 14));
            if (this.api.blocks.getCurrentBlockIndex() === 0) {
                moveUpButton.classList.add(this.CSS.btnDisabled);
            } else {
                this.api.listener.on(moveUpButton, 'click', function (event) {
                    return _this.handleClick(event);
                }, false);
            }
            return moveUpButton;
        }
        /**
         * Move current block up
         * @param {MouseEvent} event
         */

    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            var currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
            if (currentBlockIndex === 0) {
                return;
            }
            var currentBlockElement = this.api.blocks.getBlockByIndex(currentBlockIndex).html,
                previousBlockElement = this.api.blocks.getBlockByIndex(currentBlockIndex - 1).html;
            /**
             * Here is two cases:
             *  - when previous block has negative offset and part of it is visible on window, then we scroll
             *  by window's height and add offset which is mathematically difference between two blocks
             *
             *  - when previous block is visible and has offset from the window,
             *      than we scroll window to the difference between this offsets.
             */
            var currentBlockElementClientCoords = currentBlockElement.getBoundingClientRect(),
                previoutBlockElementClientCoords = previousBlockElement.getBoundingClientRect();
            var scrollUpOffset = void 0;
            if (previoutBlockElementClientCoords.top > 0) {
                scrollUpOffset = Math.abs(currentBlockElementClientCoords.top) - Math.abs(previoutBlockElementClientCoords.top);
            } else {
                scrollUpOffset = window.innerHeight - Math.abs(currentBlockElementClientCoords.top) + Math.abs(previoutBlockElementClientCoords.top);
            }
            window.scrollBy(0, -1 * scrollUpOffset);
            /** Change blocks state */
            this.api.blocks.swap(currentBlockIndex, currentBlockIndex - 1);
        }
    }]);

    return MoveUpTune;
}();

MoveUpTune.displayName = 'MoveUpTune';
exports.default = MoveUpTune;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! dom */ "./src/components/dom.js")))

/***/ }),

/***/ "./src/components/block.js":
/*!*********************************!*\
  !*** ./src/components/block.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, _) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @class Block
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @classdesc This class describes editor`s block, including block`s HTMLElement, data and tool
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @property {Tool} tool — current block tool (Paragraph, for example)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @property {Object} CSS — block`s css classes
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

/** Import default tunes */


var _blockTuneMoveUp = __webpack_require__(/*! ./block-tunes/block-tune-move-up */ "./src/components/block-tunes/block-tune-move-up.ts");

var _blockTuneMoveUp2 = _interopRequireDefault(_blockTuneMoveUp);

var _blockTuneDelete = __webpack_require__(/*! ./block-tunes/block-tune-delete */ "./src/components/block-tunes/block-tune-delete.ts");

var _blockTuneDelete2 = _interopRequireDefault(_blockTuneDelete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc Abstract Block class that contains Block information, Tool name and Tool class instance
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
   * @param {Object} settings - default settings
   * @param {Object} apiMethods - Editor API
   */
  function Block(toolName, toolInstance, settings, apiMethods) {
    _classCallCheck(this, Block);

    this.name = toolName;
    this.tool = toolInstance;
    this.settings = settings;
    this.api = apiMethods;
    this._html = this.compose();

    /**
     * @type {IBlockTune[]}
     */
    this.tunes = this.makeTunes();
  }

  /**
   * CSS classes for the Block
   * @return {{wrapper: string, content: string}}
   */


  _createClass(Block, [{
    key: 'compose',


    /**
     * Make default Block wrappers and put Tool`s content there
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
    key: 'mergeWith',


    /**
     * Call plugins merge method
     * @param {Object} data
     */
    value: function mergeWith(data) {
      var _this = this;

      return Promise.resolve().then(function () {
        _this.tool.merge(data);
      });
    }
    /**
     * Extracts data from Block
     * Groups Tool's save processing time
     * @return {Object}
     */

  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      var extractedBlock = this.tool.save(this.pluginsContent);

      /** Measuring execution time*/
      var measuringStart = window.performance.now(),
          measuringEnd = void 0;

      return Promise.resolve(extractedBlock).then(function (finishedExtraction) {
        /** measure promise execution */
        measuringEnd = window.performance.now();

        return {
          tool: _this2.name,
          data: finishedExtraction,
          time: measuringEnd - measuringStart
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
     * Make an array with default settings
     * Each block has default tune instance that have states
     * @return {IBlockTune[]}
     */

  }, {
    key: 'makeTunes',
    value: function makeTunes() {
      var _this3 = this;

      var tunesList = [_blockTuneMoveUp2.default, _blockTuneDelete2.default];

      // Pluck tunes list and return tune instances with passed Editor API and settings
      return tunesList.map(function (tune) {
        return new tune({
          api: _this3.api,
          settings: _this3.settings
        });
      });
    }

    /**
     * Enumerates initialized tunes and returns fragment that can be appended to the toolbars area
     * @return {DocumentFragment}
     */

  }, {
    key: 'renderTunes',
    value: function renderTunes() {
      var tunesElement = document.createDocumentFragment();

      this.tunes.forEach(function (tune) {
        $.append(tunesElement, tune.render());
      });

      return tunesElement;
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

    /**
     * is block mergeable
     * We plugin have merge function then we call it mergable
     * @return {boolean}
     */

  }, {
    key: 'mergeable',
    get: function get() {
      return typeof this.tool.merge === 'function';
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

      var emptyText = $.isEmpty(this.pluginsContent),
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! dom */ "./src/components/dom.js"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/dom.js":
/*!*******************************!*\
  !*** ./src/components/dom.js ***!
  \*******************************/
/*! no static exports found */
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
 * DOM manipulations helper
 */
var Dom = function () {
  function Dom() {
    _classCallCheck(this, Dom);
  }

  _createClass(Dom, null, [{
    key: 'isSingleTag',

    /**
     * Check if passed tag has no closed tag
     * @param  {Element}  tag
     * @return {Boolean}
     */
    value: function isSingleTag(tag) {
      return tag.tagName && ['AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'].includes(tag.tagName);
    }
  }, {
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
     * Creates Text Node with the passed content
     * @param {String} content - text content
     * @return {Text}
     */

  }, {
    key: 'text',
    value: function text(content) {
      return document.createTextNode(content);
    }

    /**
     * Creates SVG icon linked to the sprite
     * @param {string} name - name (id) of icon from sprite
     * @param {number} width
     * @param {number} height
     * @return {SVGElement}
     */

  }, {
    key: 'svg',
    value: function svg(name) {
      var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 14;
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 14;

      var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      icon.classList.add('icon', 'icon--' + name);
      icon.setAttribute('width', width + 'px');
      icon.setAttribute('height', height + 'px');
      icon.innerHTML = '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + name + '"></use>';

      return icon;
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
     * Search for deepest node which is Leaf.
     * Leaf is the vertex that doesn't have any child nodes
     *
     * @description Method recursively goes throw the all Node until it finds the Leaf
     *
     * @param {Node} node - root Node. From this vertex we start Deep-first search {@link https://en.wikipedia.org/wiki/Depth-first_search}
     * @param {Boolean} atLast - find last text node
     * @return {Node} - it can be text Node or Element Node, so that caret will able to work with it
     */

  }, {
    key: 'getDeepestNode',
    value: function getDeepestNode(node) {
      var atLast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      /**
       * Current function have two directions:
       *  - starts from first child and every time gets first or nextSibling in special cases
       *  - starts from last child and gets last or previousSibling
       * @type {string}
       */
      var child = atLast ? 'lastChild' : 'firstChild',
          sibling = atLast ? 'previousSibling' : 'nextSibling';

      if (node && node.nodeType === Node.ELEMENT_NODE && node[child]) {
        var nodeChild = node[child];

        /**
         * special case when child is single tag that can't contain any content
         */
        if (Dom.isSingleTag(nodeChild)) {
          /**
           * 1) We need to check the next sibling. If it is Node Element then continue searching for deepest
           * from sibling
           *
           * 2) If single tag's next sibling is null, then go back to parent and check his sibling
           * In case of Node Element continue searching
           *
           * 3) If none of conditions above happened return parent Node Element
           */
          if (nodeChild[sibling]) {
            nodeChild = nodeChild[sibling];
          } else if (nodeChild.parentNode[sibling]) {
            nodeChild = nodeChild.parentNode[sibling];
          } else {
            return nodeChild.parentNode;
          }
        }

        return this.getDeepestNode(nodeChild, atLast);
      }

      return node;
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

    /**
     * Checks target if it is native input
     * @param {Element|String} target - HTML element or string
     * @return {Boolean}
     */

  }, {
    key: 'isNativeInput',
    value: function isNativeInput(target) {
      var nativeInputs = ['INPUT', 'TEXTAREA'];

      return target ? nativeInputs.includes(target.tagName) : false;
    }

    /**
     * Checks node if it is empty
     *
     * @description Method checks simple Node without any childs for emptiness
     * If you have Node with 2 or more children id depth, you better use {@link Dom#isEmpty} method
     *
     * @param {Node} node
     * @return {Boolean} true if it is empty
     */

  }, {
    key: 'isNodeEmpty',
    value: function isNodeEmpty(node) {
      var nodeText = void 0;

      if (this.isElement(node) && this.isNativeInput(node)) {
        nodeText = node.value;
      } else {
        nodeText = node.textContent.replace('\u200B', '');
      }

      return nodeText.trim().length === 0;
    }

    /**
     * checks node if it is doesn't have any child nodes
     * @param {Node} node
     * @return {boolean}
     */

  }, {
    key: 'isLeaf',
    value: function isLeaf(node) {
      if (!node) {
        return false;
      }

      return node.childNodes.length === 0;
    }

    /**
     * breadth-first search (BFS)
     * {@link https://en.wikipedia.org/wiki/Breadth-first_search}
     *
     * @description Pushes to stack all DOM leafs and checks for emptiness
     *
     * @param {Node} node
     * @return {boolean}
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty(node) {
      var _this = this;

      var treeWalker = [],
          leafs = [];

      if (!node) {
        return true;
      }

      if (!node.childNodes.length) {
        return this.isNodeEmpty(node);
      }

      treeWalker.push(node.firstChild);

      while (treeWalker.length > 0) {
        node = treeWalker.shift();

        if (!node) continue;

        if (this.isLeaf(node)) {
          leafs.push(node);
        } else {
          treeWalker.push(node.firstChild);
        }

        while (node && node.nextSibling) {
          node = node.nextSibling;

          if (!node) continue;

          treeWalker.push(node);
        }

        /**
         * If one of childs is not empty, checked Node is not empty too
         */
        if (node && !this.isNodeEmpty(node)) {
          return false;
        }
      }

      return leafs.every(function (leaf) {
        return _this.isNodeEmpty(leaf);
      });
    }
  }]);

  return Dom;
}();

Dom.displayName = 'Dom';
exports.default = Dom;
;
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/inline-tools/inline-tool-bold.ts":
/*!*********************************************************!*\
  !*** ./src/components/inline-tools/inline-tool-bold.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Bold Tool
 *
 * Inline Toolbar Tool
 *
 * Makes selected text bolder
 */
var BoldInlineTool = function () {
  function BoldInlineTool(api) {
    _classCallCheck(this, BoldInlineTool);

    /**
     * Native Document's command that uses for Bold
     */
    this.commandName = 'bold';
    /**
     * Styles
     */
    this.CSS = {
      button: 'ce-inline-tool',
      buttonActive: 'ce-inline-tool--active',
      buttonModifier: 'ce-inline-tool--bold'
    };
    /**
     * Elements
     */
    this.nodes = {
      button: null
    };
    console.log('Bold Inline Tool is ready');
  }
  /**
   * Create button for Inline Toolbar
   */


  _createClass(BoldInlineTool, [{
    key: 'render',
    value: function render() {
      this.nodes.button = document.createElement('button');
      this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
      this.nodes.button.appendChild($.svg('bold', 13, 15));
      return this.nodes.button;
    }
    /**
     * Wrap range with <b> tag
     * @param {Range} range
     */

  }, {
    key: 'surround',
    value: function surround(range) {
      document.execCommand(this.commandName);
    }
    /**
     * Check selection and set activated state to button if there are <b> tag
     * @param {Selection} selection
     */

  }, {
    key: 'checkState',
    value: function checkState(selection) {
      var isActive = document.queryCommandState(this.commandName);
      this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);
      return isActive;
    }
  }]);

  return BoldInlineTool;
}();

BoldInlineTool.displayName = 'BoldInlineTool';
exports.default = BoldInlineTool;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! dom */ "./src/components/dom.js")))

/***/ }),

/***/ "./src/components/inline-tools/inline-tool-italic.ts":
/*!***********************************************************!*\
  !*** ./src/components/inline-tools/inline-tool-italic.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Italic Tool
 *
 * Inline Toolbar Tool
 *
 * Style selected text with italic
 */
var ItalicInlineTool = function () {
  function ItalicInlineTool(api) {
    _classCallCheck(this, ItalicInlineTool);

    /**
     * Native Document's command that uses for Italic
     */
    this.commandName = 'italic';
    /**
     * Styles
     */
    this.CSS = {
      button: 'ce-inline-tool',
      buttonActive: 'ce-inline-tool--active',
      buttonModifier: 'ce-inline-tool--italic'
    };
    /**
     * Elements
     */
    this.nodes = {
      button: null
    };
    console.log('Italic Inline Tool is ready');
  }
  /**
   * Create button for Inline Toolbar
   */


  _createClass(ItalicInlineTool, [{
    key: 'render',
    value: function render() {
      this.nodes.button = document.createElement('button');
      this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
      this.nodes.button.appendChild($.svg('italic', 6, 15));
      return this.nodes.button;
    }
    /**
     * Wrap range with <i> tag
     * @param {Range} range
     */

  }, {
    key: 'surround',
    value: function surround(range) {
      document.execCommand(this.commandName);
    }
    /**
     * Check selection and set activated state to button if there are <i> tag
     * @param {Selection} selection
     */

  }, {
    key: 'checkState',
    value: function checkState(selection) {
      var isActive = document.queryCommandState(this.commandName);
      this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);
      return isActive;
    }
  }]);

  return ItalicInlineTool;
}();

ItalicInlineTool.displayName = 'ItalicInlineTool';
exports.default = ItalicInlineTool;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! dom */ "./src/components/dom.js")))

/***/ }),

/***/ "./src/components/inline-tools/inline-tool-link.ts":
/*!*********************************************************!*\
  !*** ./src/components/inline-tools/inline-tool-link.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _selection = __webpack_require__(/*! ../selection */ "./src/components/selection.js");

var _selection2 = _interopRequireDefault(_selection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Link Tool
 *
 * Inline Toolbar Tool
 *
 * Wrap selected text with <a> tag
 */
var LinkInlineTool = function () {
    /**
     * @param {object} api - CodeX Editor API
     * @param {object} api.toolbar - Inline Toolbar API
     */
    function LinkInlineTool(api) {
        _classCallCheck(this, LinkInlineTool);

        /**
         * Native Document's commands for link/unlink
         */
        this.commandLink = 'createLink';
        this.commandUnlink = 'unlink';
        /**
         * Enter key code
         */
        this.ENTER_KEY = 13;
        /**
         * Styles
         */
        this.CSS = {
            button: 'ce-inline-tool',
            buttonActive: 'ce-inline-tool--active',
            buttonModifier: 'ce-inline-tool--link',
            buttonUnlink: 'ce-inline-tool--unlink',
            input: 'ce-inline-tool-input',
            inputShowed: 'ce-inline-tool-input--showed'
        };
        /**
         * Elements
         */
        this.nodes = {
            button: null,
            input: null
        };
        /**
         * Input opening state
         */
        this.inputOpened = false;
        this.inlineToolbar = api.toolbar;
        this.selection = new _selection2.default();
    }
    /**
     * Create button for Inline Toolbar
     */


    _createClass(LinkInlineTool, [{
        key: 'render',
        value: function render() {
            this.nodes.button = document.createElement('button');
            this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
            this.nodes.button.appendChild($.svg('link', 15, 14));
            this.nodes.button.appendChild($.svg('unlink', 16, 18));
            return this.nodes.button;
        }
        /**
         * Input for the link
         */

    }, {
        key: 'renderActions',
        value: function renderActions() {
            var _this = this;

            this.nodes.input = document.createElement('input');
            this.nodes.input.placeholder = 'Add a link';
            this.nodes.input.classList.add(this.CSS.input);
            this.nodes.input.addEventListener('keydown', function (event) {
                if (event.keyCode === _this.ENTER_KEY) {
                    _this.enterPressed(event);
                }
            });
            return this.nodes.input;
        }
        /**
         * Handle clicks on the Inline Toolbar icon
         * @param {Range} range
         */

    }, {
        key: 'surround',
        value: function surround(range) {
            /**
             * Range will be null when user makes second click on the 'link icon' to close opened input
             */
            if (range) {
                /**
                 * Save selection before change focus to the input
                 */
                this.selection.save();
                var parentAnchor = this.selection.findParentTag('A');
                /**
                 * Unlink icon pressed
                 */
                if (parentAnchor) {
                    this.selection.expandToTag(parentAnchor);
                    this.unlink();
                    this.closeActions();
                    this.checkState();
                    this.inlineToolbar.close();
                    return;
                }
            }
            this.toggleActions();
        }
        /**
         * Check selection and set activated state to button if there are <a> tag
         * @param {Selection} selection
         */

    }, {
        key: 'checkState',
        value: function checkState(selection) {
            var anchorTag = this.selection.findParentTag('A');
            if (anchorTag) {
                this.nodes.button.classList.add(this.CSS.buttonUnlink);
                this.nodes.button.classList.add(this.CSS.buttonActive);
                this.openActions();
                /**
                 * Fill input value with link href
                 */
                var hrefAttr = anchorTag.getAttribute('href');
                this.nodes.input.value = hrefAttr !== 'null' ? hrefAttr : '';
                this.selection.save();
            } else {
                this.nodes.button.classList.remove(this.CSS.buttonUnlink);
                this.nodes.button.classList.remove(this.CSS.buttonActive);
            }
            return !!anchorTag;
        }
        /**
         * Function called with Inline Toolbar closing
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.closeActions();
        }
    }, {
        key: 'toggleActions',
        value: function toggleActions() {
            if (!this.inputOpened) {
                this.openActions(true);
            } else {
                this.closeActions(false);
            }
        }
        /**
         * @param {boolean} needFocus - on link creation we need to focus input. On editing - nope.
         */

    }, {
        key: 'openActions',
        value: function openActions() {
            var needFocus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.nodes.input.classList.add(this.CSS.inputShowed);
            if (needFocus) {
                this.nodes.input.focus();
            }
            this.inputOpened = true;
        }
        /**
         * Close input
         * @param {boolean} clearSavedSelection — we don't need to clear saved selection
         *                                        on toggle-clicks on the icon of opened Toolbar
         */

    }, {
        key: 'closeActions',
        value: function closeActions() {
            var clearSavedSelection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.nodes.input.classList.remove(this.CSS.inputShowed);
            this.nodes.input.value = '';
            if (clearSavedSelection) {
                this.selection.clearSaved();
            }
            this.inputOpened = false;
        }
        /**
         * Enter pressed on input
         * @param {KeyboardEvent} event
         */

    }, {
        key: 'enterPressed',
        value: function enterPressed(event) {
            var value = this.nodes.input.value || '';
            if (!value.trim()) {
                this.selection.restore();
                this.unlink();
                event.preventDefault();
                this.closeActions();
            }
            if (!this.validateURL(value)) {
                /**
                 * @todo show notification 'Incorrect Link'
                 */
                _.log('Incorrect Link pasted', 'warn', value);
                return;
            }
            value = this.prepareLink(value);
            this.selection.restore();
            this.insertLink(value);
            /**
             * Preventing events that will be able to happen
             */
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            this.closeActions();
            this.inlineToolbar.close();
            this.checkState();
        }
        /**
         * Detects if passed string is URL
         * @param  {string}  str
         * @return {Boolean}
         */

    }, {
        key: 'validateURL',
        value: function validateURL(str) {
            /**
             * Don't allow spaces
             */
            return !/\s/.test(str);
        }
        /**
         * Process link before injection
         * - sanitize
         * - add protocol for links like 'google.com'
         * @param {string} link - raw user input
         */

    }, {
        key: 'prepareLink',
        value: function prepareLink(link) {
            link = link.trim();
            link = this.addProtocol(link);
            return link;
        }
        /**
         * Add 'http' protocol to the links like 'vc.ru', 'google.com'
         * @param {String} link
         */

    }, {
        key: 'addProtocol',
        value: function addProtocol(link) {
            /**
             * If protocol already exists, do nothing
             */
            if (/^(\w+):\/\//.test(link)) {
                return link;
            }
            /**
             * We need to add missed HTTP protocol to the link, but skip 2 cases:
             *     1) Internal links like "/general"
             *     2) Anchors looks like "#results"
             *     3) Protocol-relative URLs like "//google.com"
             */
            var isInternal = /^\/[^\/\s]/.test(link),
                isAnchor = link.substring(0, 1) === '#',
                isProtocolRelative = /^\/\/[^\/\s]/.test(link);
            if (!isInternal && !isAnchor && !isProtocolRelative) {
                link = 'http://' + link;
            }
            return link;
        }
        /**
         * Inserts <a> tag with "href"
         * @param {string} link - "href" value
         */

    }, {
        key: 'insertLink',
        value: function insertLink(link) {
            /**
             * Edit all link, not selected part
             */
            var anchorTag = this.selection.findParentTag('A');
            if (anchorTag) {
                this.selection.expandToTag(anchorTag);
            }
            document.execCommand(this.commandLink, false, link);
        }
        /**
         * Removes <a> tag
         */

    }, {
        key: 'unlink',
        value: function unlink() {
            document.execCommand(this.commandUnlink);
        }
    }]);

    return LinkInlineTool;
}();

LinkInlineTool.displayName = 'LinkInlineTool';
exports.default = LinkInlineTool;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! dom */ "./src/components/dom.js"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules sync [^_](api-blocks.ts|api-events.ts|api-listener.ts|api-sanitizer.ts|api-selection.ts|api-toolbar.ts|api.ts|blockManager.js|caret.js|events.js|keyboard.js|listeners.js|renderer.js|sanitizer.js|saver.js|toolbar-blockSettings.js|toolbar-inline.ts|toolbar-toolbox.js|toolbar.js|tools.js|ui.js)$":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/components/modules sync nonrecursive [^_](api-blocks.ts|api-events.ts|api-listener.ts|api-sanitizer.ts|api-selection.ts|api-toolbar.ts|api.ts|blockManager.js|caret.js|events.js|keyboard.js|listeners.js|renderer.js|sanitizer.js|saver.js|toolbar-blockSettings.js|toolbar-inline.ts|toolbar-toolbox.js|toolbar.js|tools.js|ui.js)$ ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./api-blocks.ts": "./src/components/modules/api-blocks.ts",
	"./api-events.ts": "./src/components/modules/api-events.ts",
	"./api-listener.ts": "./src/components/modules/api-listener.ts",
	"./api-sanitizer.ts": "./src/components/modules/api-sanitizer.ts",
	"./api-selection.ts": "./src/components/modules/api-selection.ts",
	"./api-toolbar.ts": "./src/components/modules/api-toolbar.ts",
	"./api.ts": "./src/components/modules/api.ts",
	"./blockManager.js": "./src/components/modules/blockManager.js",
	"./caret.js": "./src/components/modules/caret.js",
	"./events.js": "./src/components/modules/events.js",
	"./keyboard.js": "./src/components/modules/keyboard.js",
	"./listeners.js": "./src/components/modules/listeners.js",
	"./renderer.js": "./src/components/modules/renderer.js",
	"./sanitizer.js": "./src/components/modules/sanitizer.js",
	"./saver.js": "./src/components/modules/saver.js",
	"./toolbar-blockSettings.js": "./src/components/modules/toolbar-blockSettings.js",
	"./toolbar-inline.ts": "./src/components/modules/toolbar-inline.ts",
	"./toolbar-toolbox.js": "./src/components/modules/toolbar-toolbox.js",
	"./toolbar.js": "./src/components/modules/toolbar.js",
	"./tools.js": "./src/components/modules/tools.js",
	"./ui.js": "./src/components/modules/ui.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/components/modules sync [^_](api-blocks.ts|api-events.ts|api-listener.ts|api-sanitizer.ts|api-selection.ts|api-toolbar.ts|api.ts|blockManager.js|caret.js|events.js|keyboard.js|listeners.js|renderer.js|sanitizer.js|saver.js|toolbar-blockSettings.js|toolbar-inline.ts|toolbar-toolbox.js|toolbar.js|tools.js|ui.js)$";

/***/ }),

/***/ "./src/components/modules/api-blocks.ts":
/*!**********************************************!*\
  !*** ./src/components/modules/api-blocks.ts ***!
  \**********************************************/
/*! no static exports found */
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
 * @class BlocksAPI
 * provides with methods working with Block
 */
var BlocksAPI = function (_Module) {
    _inherits(BlocksAPI, _Module);

    /**
     * Save Editor config. API provides passed configuration to the Blocks
     * @param {EditorsConfig} config
     */
    function BlocksAPI(_ref) {
        var config = _ref.config;

        _classCallCheck(this, BlocksAPI);

        return _possibleConstructorReturn(this, (BlocksAPI.__proto__ || Object.getPrototypeOf(BlocksAPI)).call(this, { config: config }));
    }
    /**
     * Available methods
     * @return {IBlocksAPI}
     */


    _createClass(BlocksAPI, [{
        key: "getCurrentBlockIndex",

        /**
         * Returns current block index
         * @return {number}
         */
        value: function getCurrentBlockIndex() {
            return this.Editor.BlockManager.currentBlockIndex;
        }
        /**
         * Returns Current Block
         * @param {Number} index
         *
         * @return {Object}
         */

    }, {
        key: "getBlockByIndex",
        value: function getBlockByIndex(index) {
            return this.Editor.BlockManager.getBlockByIndex(index);
        }
        /**
         * Call Block Manager method that swap blocks in state
         * @param {number} fromIndex
         * @param {number} toIndex
         */

    }, {
        key: "swap",
        value: function swap(fromIndex, toIndex) {
            /** First we change positions on DOM tree */
            var toIndexBlockElement = this.Editor.BlockManager.getBlockByIndex(toIndex).html,
                fromIndexBlockElement = this.Editor.BlockManager.getBlockByIndex(fromIndex).html;
            toIndexBlockElement.parentNode.insertBefore(fromIndexBlockElement, toIndexBlockElement);
            this.Editor.BlockManager.swap(fromIndex, toIndex);
        }
        /**
         * Deletes Block
         * @param blockIndex
         */

    }, {
        key: "delete",
        value: function _delete(blockIndex) {
            this.Editor.BlockManager.removeBlock(blockIndex);
            /**
             * in case of last block deletion
             * Insert new initial empty block
             */
            if (this.Editor.BlockManager.blocks.length === 0) {
                this.Editor.BlockManager.insert();
            }
            /**
             * In case of deletion first block we need to set caret to the current Block
             */
            if (this.Editor.BlockManager.currentBlockIndex === 0) {
                if (this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock)) {
                    this.Editor.Toolbar.close();
                }
            } else {
                if (this.Editor.Caret.navigatePrevious(true)) {
                    this.Editor.Toolbar.close();
                }
            }
        }
    }, {
        key: "methods",
        get: function get() {
            var _this2 = this;

            return {
                delete: function _delete() {
                    return _this2.delete();
                },
                swap: function swap(fromIndex, toIndex) {
                    return _this2.swap(fromIndex, toIndex);
                },
                getBlockByIndex: function getBlockByIndex(index) {
                    return _this2.getBlockByIndex(index);
                },
                getCurrentBlockIndex: function getCurrentBlockIndex() {
                    return _this2.getCurrentBlockIndex();
                }
            };
        }
    }]);

    return BlocksAPI;
}(Module);

BlocksAPI.displayName = "BlocksAPI";
exports.default = BlocksAPI;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/api-events.ts":
/*!**********************************************!*\
  !*** ./src/components/modules/api-events.ts ***!
  \**********************************************/
/*! no static exports found */
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
 * @class EventsAPI
 * provides with methods working with Toolbar
 */
var EventsAPI = function (_Module) {
    _inherits(EventsAPI, _Module);

    /**
     * Save Editor config. API provides passed configuration to the Blocks
     * @param {EditorsConfig} config
     */
    function EventsAPI(_ref) {
        var config = _ref.config;

        _classCallCheck(this, EventsAPI);

        return _possibleConstructorReturn(this, (EventsAPI.__proto__ || Object.getPrototypeOf(EventsAPI)).call(this, { config: config }));
    }
    /**
     * Available methods
     * @return {IEventsAPI}
     */


    _createClass(EventsAPI, [{
        key: "on",

        /**
         * Subscribe on Events
         * @param {String} eventName
         * @param {Function} callback
         */
        value: function on(eventName, callback) {
            this.Editor.Events.on(eventName, callback);
        }
        /**
         * Emit event with data
         * @param {String} eventName
         * @param {Object} data
         */

    }, {
        key: "emit",
        value: function emit(eventName, data) {
            this.Editor.Events.emit(eventName, data);
        }
        /**
         * Unsubscribe from Event
         * @param {String} eventName
         * @param {Function} callback
         */

    }, {
        key: "off",
        value: function off(eventName, callback) {
            this.Editor.Events.off(eventName, callback);
        }
    }, {
        key: "methods",
        get: function get() {
            var _this2 = this;

            return {
                emit: function emit(eventName, data) {
                    return _this2.emit(eventName, data);
                },
                off: function off(eventName, callback) {
                    return _this2.off(eventName, callback);
                },
                on: function on(eventName, callback) {
                    return _this2.on(eventName, callback);
                }
            };
        }
    }]);

    return EventsAPI;
}(Module);

EventsAPI.displayName = "EventsAPI";
exports.default = EventsAPI;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/api-listener.ts":
/*!************************************************!*\
  !*** ./src/components/modules/api-listener.ts ***!
  \************************************************/
/*! no static exports found */
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
 * @class API
 * Provides with methods working with DOM Listener
 */
var ListenerAPI = function (_Module) {
    _inherits(ListenerAPI, _Module);

    /**
     * Save Editor config. API provides passed configuration to the Blocks
     * @param {EditorsConfig} config
     */
    function ListenerAPI(_ref) {
        var config = _ref.config;

        _classCallCheck(this, ListenerAPI);

        return _possibleConstructorReturn(this, (ListenerAPI.__proto__ || Object.getPrototypeOf(ListenerAPI)).call(this, { config: config }));
    }
    /**
     * Available methods
     * @return {IToolbarAPI}
     */


    _createClass(ListenerAPI, [{
        key: "on",

        /**
         * adds DOM event listener
         *
         * @param {HTMLElement} element
         * @param {string} eventType
         * @param {() => void} handler
         * @param {boolean} useCapture
         */
        value: function on(element, eventType, handler, useCapture) {
            this.Editor.Listeners.on(element, eventType, handler, useCapture);
        }
        /**
         * Removes DOM listener from element
         *
         * @param element
         * @param eventType
         * @param handler
         */

    }, {
        key: "off",
        value: function off(element, eventType, handler) {
            this.Editor.Listeners.on(element, eventType, handler);
        }
    }, {
        key: "methods",
        get: function get() {
            var _this2 = this;

            return {
                on: function on(element, eventType, handler, useCapture) {
                    return _this2.on(element, eventType, handler, useCapture);
                },
                off: function off(element, eventType, handler) {
                    return _this2.off(element, eventType, handler);
                }
            };
        }
    }]);

    return ListenerAPI;
}(Module);

ListenerAPI.displayName = "ListenerAPI";
exports.default = ListenerAPI;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/api-sanitizer.ts":
/*!*************************************************!*\
  !*** ./src/components/modules/api-sanitizer.ts ***!
  \*************************************************/
/*! no static exports found */
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
 * @class API
 * Provides CodeX Editor Sanitizer that allows developers to clean their HTML
 */
var SanitizerAPI = function (_Module) {
    _inherits(SanitizerAPI, _Module);

    /**
     * Save Editor config. API provides passed configuration to the Blocks
     * @param {EditorsConfig} config
     */
    function SanitizerAPI(_ref) {
        var config = _ref.config;

        _classCallCheck(this, SanitizerAPI);

        return _possibleConstructorReturn(this, (SanitizerAPI.__proto__ || Object.getPrototypeOf(SanitizerAPI)).call(this, { config: config }));
    }
    /**
     * Available methods
     * @return {ISanitizerAPI}
     */


    _createClass(SanitizerAPI, [{
        key: "clean",
        value: function clean(taintString, config) {
            return this.Editor.Sanitizer.clean(taintString, config);
        }
    }, {
        key: "methods",
        get: function get() {
            var _this2 = this;

            return {
                clean: function clean(taintString, config) {
                    return _this2.clean(taintString, config);
                }
            };
        }
    }]);

    return SanitizerAPI;
}(Module);

SanitizerAPI.displayName = "SanitizerAPI";
exports.default = SanitizerAPI;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/api-selection.ts":
/*!*************************************************!*\
  !*** ./src/components/modules/api-selection.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _selection = __webpack_require__(/*! ../selection */ "./src/components/selection.js");

var _selection2 = _interopRequireDefault(_selection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class API
 * Provides with methods working with Selection
 */
var SelectionAPI = function (_Module) {
    _inherits(SelectionAPI, _Module);

    /**
     * Save Editor config. API provides passed configuration to the Blocks
     * @param {EditorsConfig} config
     */
    function SelectionAPI(_ref) {
        var config = _ref.config;

        _classCallCheck(this, SelectionAPI);

        return _possibleConstructorReturn(this, (SelectionAPI.__proto__ || Object.getPrototypeOf(SelectionAPI)).call(this, { config: config }));
    }
    /**
     * Available methods
     * @return {ISelectionAPI}
     */


    _createClass(SelectionAPI, [{
        key: 'findParentTag',

        /**
         * Looks ahead from selection and find passed tag with class name
         * @param {string} tagName - tag to find
         * @param {string} className - tag's class name
         * @return {HTMLElement|null}
         */
        value: function findParentTag(tagName, className) {
            return new _selection2.default().findParentTag(tagName, className);
        }
        /**
         * Expand selection to passed tag
         * @param {HTMLElement} node - tag that should contain selection
         */

    }, {
        key: 'expandToTag',
        value: function expandToTag(node) {
            new _selection2.default().expandToTag(node);
        }
    }, {
        key: 'methods',
        get: function get() {
            var _this2 = this;

            return {
                findParentTag: function findParentTag(tagName, className) {
                    return _this2.findParentTag(tagName, className);
                },
                expandToTag: function expandToTag(node) {
                    return _this2.expandToTag(node);
                }
            };
        }
    }]);

    return SelectionAPI;
}(Module);

SelectionAPI.displayName = 'SelectionAPI';
exports.default = SelectionAPI;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/api-toolbar.ts":
/*!***********************************************!*\
  !*** ./src/components/modules/api-toolbar.ts ***!
  \***********************************************/
/*! no static exports found */
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
 * @class ToolbarsAPI
 * provides with methods working with Toolbar
 */
var ToolbarsAPI = function (_Module) {
    _inherits(ToolbarsAPI, _Module);

    /**
     * Save Editor config. API provides passed configuration to the Blocks
     * @param {EditorsConfig} config
     */
    function ToolbarsAPI(_ref) {
        var config = _ref.config;

        _classCallCheck(this, ToolbarsAPI);

        return _possibleConstructorReturn(this, (ToolbarsAPI.__proto__ || Object.getPrototypeOf(ToolbarsAPI)).call(this, { config: config }));
    }
    /**
     * Available methods
     * @return {IToolbarAPI}
     */


    _createClass(ToolbarsAPI, [{
        key: "open",

        /**
         * Open toolbar
         */
        value: function open() {
            this.Editor.Toolbar.open();
        }
        /**
         * Close toolbar and all included elements
         */

    }, {
        key: "close",
        value: function close() {
            this.Editor.Toolbar.close();
        }
    }, {
        key: "methods",
        get: function get() {
            var _this2 = this;

            return {
                close: function close() {
                    return _this2.close();
                },
                open: function open() {
                    return _this2.open();
                }
            };
        }
    }]);

    return ToolbarsAPI;
}(Module);

ToolbarsAPI.displayName = "ToolbarsAPI";
exports.default = ToolbarsAPI;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/api.ts":
/*!***************************************!*\
  !*** ./src/components/modules/api.ts ***!
  \***************************************/
/*! no static exports found */
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
 * @class API
 */
var API = function (_Module) {
    _inherits(API, _Module);

    /**
     * Save Editor config. API provides passed configuration to the Blocks
     * @param {EditorsConfig} config
     */
    function API(_ref) {
        var config = _ref.config;

        _classCallCheck(this, API);

        return _possibleConstructorReturn(this, (API.__proto__ || Object.getPrototypeOf(API)).call(this, { config: config }));
    }

    _createClass(API, [{
        key: "methods",
        get: function get() {
            return {
                blocks: this.Editor.BlocksAPI.methods,
                caret: {},
                events: this.Editor.EventsAPI.methods,
                sanitizer: this.Editor.SanitizerAPI.methods,
                selection: this.Editor.SelectionAPI.methods,
                toolbar: this.Editor.ToolbarsAPI.methods,
                listener: this.Editor.ListenerAPI.methods
            };
        }
    }]);

    return API;
}(Module);

API.displayName = "API";
exports.default = API;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/blockManager.js":
/*!************************************************!*\
  !*** ./src/components/modules/blockManager.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $, _) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _block = __webpack_require__(/*! ../block */ "./src/components/block.js");

var _block2 = _interopRequireDefault(_block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @class BlockManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @classdesc Manage editor`s blocks storage and appearance
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module BlockManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 2.0.0
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
     * @param {Object} settings - block settings
     *
     * @return {Block}
     */

  }, {
    key: 'composeBlock',
    value: function composeBlock(toolName, data, settings) {
      var toolInstance = this.Editor.Tools.construct(toolName, data),
          block = new _block2.default(toolName, toolInstance, settings, this.Editor.API.methods);

      this.bindEvents(block);
      /**
       * Apply callback before inserting html
       */
      block.call('appendCallback', {});

      return block;
    }

    /**
     * Bind Events
     * @param {Object} block
     */

  }, {
    key: 'bindEvents',
    value: function bindEvents(block) {
      var _this3 = this;

      this.Editor.Listeners.on(block.pluginsContent, 'keydown', function (event) {
        return _this3.Editor.Keyboard.blockKeydownsListener(event);
      });
      this.Editor.Listeners.on(block.pluginsContent, 'mouseup', function (event) {
        _this3.Editor.InlineToolbar.handleShowingEvent(event);
      });
      this.Editor.Listeners.on(block.pluginsContent, 'keyup', function (event) {
        _this3.Editor.InlineToolbar.handleShowingEvent(event);
      });
    }

    /**
     * Insert new block into _blocks
     *
     * @param {String} toolName — plugin name, by default method inserts initial block type
     * @param {Object} data — plugin data
     * @param {Object} settings - default settings
     *
     * @return {Block}
     */

  }, {
    key: 'insert',
    value: function insert() {
      var toolName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.initialBlock;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var block = this.composeBlock(toolName, data, settings);

      this._blocks[++this.currentBlockIndex] = block;
      this.Editor.Caret.setToBlock(block);

      return block;
    }

    /**
     * Merge two blocks
     * @param {Block} targetBlock - previous block will be append to this block
     * @param {Block} blockToMerge - block that will be merged with target block
     *
     * @return {Promise} - the sequence that can be continued
     */

  }, {
    key: 'mergeBlocks',
    value: function mergeBlocks(targetBlock, blockToMerge) {
      var _this4 = this;

      var blockToMergeIndex = this._blocks.indexOf(blockToMerge);

      return Promise.resolve().then(function () {
        if (blockToMerge.isEmpty) {
          return;
        }

        return blockToMerge.data.then(function (blockToMergeInfo) {
          targetBlock.mergeWith(blockToMergeInfo.data);
        });
      }).then(function () {
        _this4.removeBlock(blockToMergeIndex);
        _this4.currentBlockIndex = _this4._blocks.indexOf(targetBlock);
      });
    }

    /**
     * Remove block with passed index or remove last
     * @param {Number|null} index
     */

  }, {
    key: 'removeBlock',
    value: function removeBlock(index) {
      if (!index) {
        index = this.currentBlockIndex;
      }
      this._blocks.remove(index);
    }

    /**
     * Split current Block
     * 1. Extract content from Caret position to the Block`s end
     * 2. Insert a new Block below current one with extracted content
     */

  }, {
    key: 'split',
    value: function split() {
      var extractedFragment = this.Editor.Caret.extractFragmentFromCaretPosition(),
          wrapper = $.make('div');

      wrapper.append(extractedFragment);

      /**
       * @todo make object in accordance with Tool
       */
      var data = {
        text: $.isEmpty(wrapper) ? '' : wrapper.innerHTML
      };

      /**
       * Renew current Block
       * @type {Block}
       */
      var blockInserted = this.insert(this.config.initialBlock, data);

      this.currentNode = blockInserted.pluginsContent;
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
     * returns last Block
     * @return {Block}
     */

  }, {
    key: 'getBlockByIndex',


    /**
     * Returns Block by passed index
     * @param {Number} index
     * @return {Block}
     */
    value: function getBlockByIndex(index) {
      return this._blocks[index];
    }

    /**
     * Get Block instance by html element
     * @param {Node} element
     * @returns {Block}
     */

  }, {
    key: 'getBlock',
    value: function getBlock(element) {
      if (!$.isElement(element)) {
        element = element.parentNode;
      }

      var nodes = this._blocks.nodes,
          firstLevelBlock = element.closest('.' + _block2.default.CSS.wrapper),
          index = nodes.indexOf(firstLevelBlock);

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

    /**
     * Swap Blocks Position
     * @param {Number} fromIndex
     * @param {Number} toIndex
     */

  }, {
    key: 'swap',
    value: function swap(fromIndex, toIndex) {
      /** Move up current Block */
      this._blocks.swap(fromIndex, toIndex);

      /** Now actual block moved up so that current block index decreased */
      this.currentBlockIndex = toIndex;

      /**
       * Move toolbar
       * DO not close the settings
       */
      this.Editor.Toolbar.move(false);
    }
  }, {
    key: 'lastBlock',
    get: function get() {
      return this._blocks[this._blocks.length - 1];
    }
  }, {
    key: 'currentBlock',
    get: function get() {
      return this._blocks[this.currentBlockIndex];
    }

    /**
     * Returns next Block instance
     * @return {Block|null}
     */

  }, {
    key: 'nextBlock',
    get: function get() {
      var isLastBlock = this.currentBlockIndex === this._blocks.length - 1;

      if (isLastBlock) {
        return null;
      }

      return this._blocks[this.currentBlockIndex + 1];
    }

    /**
     * Returns previous Block instance
     * @return {Block|null}
     */

  }, {
    key: 'previousBlock',
    get: function get() {
      var isFirstBlock = this.currentBlockIndex === 0;

      if (isFirstBlock) {
        return null;
      }

      return this._blocks[this.currentBlockIndex - 1];
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
     * @param {HTMLElement} element
     */
    ,
    set: function set(element) {
      var nodes = this._blocks.nodes,
          firstLevelBlock = element.closest('.' + _block2.default.CSS.wrapper);

      /**
       * Update current Block's index
       * @type {number}
       */
      this.currentBlockIndex = nodes.indexOf(firstLevelBlock);

      /**
       * Remove previous selected Block's state
       */
      this.blocks.forEach(function (block) {
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

BlockManager.displayName = 'BlockManager';
exports.default = BlockManager;
;

/**
 * @class Blocks
 * @classdesc Class to work with Block instances array
 *
 * @private
 *
 * @property {HTMLElement} workingArea — editor`s working node
 *
 */

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
     * Swaps blocks with indexes first and second
     * @param {Number} first - first block index
     * @param {Number} second - second block index
     */

  }, {
    key: 'swap',
    value: function swap(first, second) {
      var secondBlock = this.blocks[second];

      this.blocks[second] = this.blocks[first];
      this.blocks[first] = secondBlock;
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
     * Remove block
     * @param {Number|null} index
     */

  }, {
    key: 'remove',
    value: function remove(index) {
      if (isNaN(index)) {
        index = this.length - 1;
      }

      this.blocks[index].html.remove();
      this.blocks.splice(index, 1);
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
     * Move Block with passed index up
     *
     * - change first level block position in DOM tree
     * - swap in blocks array to actualize Editor Blocks state
     *
     * @param {Number} index
     */

  }, {
    key: 'moveUp',
    value: function moveUp(index) {
      if (index === 0) {
        return;
      }

      /** Actualize Blocks state */
      this.swap(index, index - 1);
    }
  }, {
    key: 'get',


    /**
     * Get Block by index
     *
     * @param {Number} index — Block index
     * @returns {Block}
     */
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! dom */ "./src/components/dom.js"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/caret.js":
/*!*****************************************!*\
  !*** ./src/components/modules/caret.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $, _) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _selection = __webpack_require__(/*! ../selection */ "./src/components/selection.js");

var _selection2 = _interopRequireDefault(_selection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @class Caret
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @classdesc Contains methods for working Caret
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Uses Range methods to manipulate with caret
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module Caret
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 2.0.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
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
   * Method gets Block instance and puts caret to the text node with offset
   * There two ways that method applies caret position:
   *   - first found text node: sets at the beginning, but you can pass an offset
   *   - last found text node: sets at the end of the node. Also, you can customize the behaviour
   *
   * @param {Block} block - Block class
   * @param {Number} offset - caret offset regarding to the text node
   * @param {Boolean} atEnd - put caret at the end of the text node or not
   *
   * @returns {Boolean} - caret was set or not
   */


  _createClass(Caret, [{
    key: 'setToBlock',
    value: function setToBlock(block) {
      var _this2 = this;

      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var atEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var element = block.pluginsContent;

      /** If Element is INPUT */
      if ($.isNativeInput(element)) {
        element.focus();
        return true;
      }

      var nodeToSet = $.getDeepestNode(element, atEnd);

      if (atEnd || offset > nodeToSet.length) {
        offset = nodeToSet.length;
      }

      /** if found deepest node is native input */
      if ($.isNativeInput(nodeToSet)) {
        nodeToSet.focus();
        return true;
      }

      /**
       * @todo try to fix via Promises or use querySelectorAll to not to use timeout
       */
      _.delay(function () {
        _this2.set(nodeToSet, offset);
      }, 20)();

      this.Editor.BlockManager.currentNode = block.wrapper;
      return true;
    }

    /**
     * Creates Document Range and sets caret to the element with offset
     * @param {Element} element - target node.
     * @param {Number} offset - offset
     */

  }, {
    key: 'set',
    value: function set(element) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var range = document.createRange(),
          selection = _selection2.default.get();

      range.setStart(element, offset);
      range.setEnd(element, offset);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, {
    key: 'setToTheLastBlock',


    /**
     * Set Caret to the last Block
     * If last block is not empty, append another empty block
     */
    value: function setToTheLastBlock() {
      var lastBlock = this.Editor.BlockManager.lastBlock;

      if (!lastBlock) return;

      /**
       * If last block is empty and it is an initialBlock, set to that.
       * Otherwise, append new empty block and set to that
       */
      if (lastBlock.isEmpty) {
        this.setToBlock(lastBlock);
      } else {
        this.Editor.BlockManager.insert(this.config.initialBlock);
      }
    }

    /**
     * Extract content fragment of current Block from Caret position to the end of the Block
     */

  }, {
    key: 'extractFragmentFromCaretPosition',
    value: function extractFragmentFromCaretPosition() {
      var selection = _selection2.default.get();

      if (selection.rangeCount) {
        var selectRange = selection.getRangeAt(0),
            blockElem = this.Editor.BlockManager.currentBlock.pluginsContent;

        selectRange.deleteContents();

        if (blockElem) {
          var range = selectRange.cloneRange(true);

          range.selectNodeContents(blockElem);
          range.setStart(selectRange.endContainer, selectRange.endOffset);
          return range.extractContents();
        }
      }
    }

    /**
     * Get all first-level (first child of [contenteditabel]) siblings from passed node
     * Then you can check it for emptiness
     *
     * @example
     * <div contenteditable>
     *     <p></p>                            |
     *     <p></p>                            | left first-level siblings
     *     <p></p>                            |
     *     <blockquote><a><b>adaddad</b><a><blockquote>       <-- passed node for example <b>
     *     <p></p>                            |
     *     <p></p>                            | right first-level siblings
     *     <p></p>                            |
     * </div>
     *
     * @return {Element[]}
     */

  }, {
    key: 'getHigherLevelSiblings',
    value: function getHigherLevelSiblings(from, direction) {
      var current = from,
          siblings = [];

      /**
       * Find passed node's firs-level parent (in example - blockquote)
       */
      while (current.parentNode && current.parentNode.contentEditable !== 'true') {
        current = current.parentNode;
      }

      var sibling = direction === 'left' ? 'previousSibling' : 'nextSibling';

      /**
       * Find all left/right siblings
       */
      while (current[sibling]) {
        current = current[sibling];
        siblings.push(current);
      }

      return siblings;
    }

    /**
     * Set's caret to the next Block
     * Before moving caret, we should check if caret position is at the end of Plugins node
     * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
     *
     * @param {Boolean} force - force navigation even if caret is not at the end
     *
     * @return {Boolean}
     */

  }, {
    key: 'navigateNext',
    value: function navigateNext() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var nextBlock = this.Editor.BlockManager.nextBlock;

      if (!nextBlock) {
        return false;
      }

      if (force || this.isAtEnd) {
        return this.setToBlock(nextBlock);
      }

      return false;
    }

    /**
     * Set's caret to the previous Block
     * Before moving caret, we should check if caret position is start of the Plugins node
     * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
     *
     * @param {Boolean} force - force navigation even if caret is not at the start
     *
     * @return {Boolean}
     */

  }, {
    key: 'navigatePrevious',
    value: function navigatePrevious() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var previousBlock = this.Editor.BlockManager.previousBlock;

      if (!previousBlock) {
        return false;
      }

      if (force || this.isAtStart) {
        return this.setToBlock(previousBlock, 0, true);
      }

      return false;
    }

    /**
     * Get's deepest first node and checks if offset is zero
     * @return {boolean}
     */

  }, {
    key: 'isAtStart',
    get: function get() {
      /**
       * Don't handle ranges
       */
      if (!_selection2.default.isCollapsed) {
        return false;
      }

      var selection = _selection2.default.get(),
          anchorNode = selection.anchorNode,
          firstNode = $.getDeepestNode(this.Editor.BlockManager.currentBlock.pluginsContent);

      /**
       * Workaround case when caret in the text like " |Hello!"
       * selection.anchorOffset is 1, but real caret visible position is 0
       * @type {number}
       */
      var firstLetterPosition = anchorNode.textContent.search(/\S/);

      if (firstLetterPosition === -1) {
        // empty text
        firstLetterPosition = 0;
      }

      /**
       * In case of
       * <div contenteditable>
       *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
       *     |adaddad         <-- anchor node
       * </div>
       */
      if ($.isEmpty(firstNode)) {
        var leftSiblings = this.getHigherLevelSiblings(anchorNode, 'left'),
            nothingAtLeft = leftSiblings.every(function (node) {
          return $.isEmpty(node);
        });

        if (nothingAtLeft && selection.anchorOffset === firstLetterPosition) {
          return true;
        }
      }

      return firstNode === null || anchorNode === firstNode && selection.anchorOffset === firstLetterPosition;
    }

    /**
     * Get's deepest last node and checks if offset is last node text length
     * @return {boolean}
     */

  }, {
    key: 'isAtEnd',
    get: function get() {
      /**
       * Don't handle ranges
       */
      if (!_selection2.default.isCollapsed) {
        return false;
      }

      var selection = _selection2.default.get(),
          anchorNode = selection.anchorNode,
          lastNode = $.getDeepestNode(this.Editor.BlockManager.currentBlock.pluginsContent, true);

      /**
       * In case of
       * <div contenteditable>
       *     adaddad|         <-- anchor node
       *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
       * </div>
       */
      if ($.isEmpty(lastNode)) {
        var leftSiblings = this.getHigherLevelSiblings(anchorNode, 'right'),
            nothingAtRight = leftSiblings.every(function (node) {
          return $.isEmpty(node);
        });

        if (nothingAtRight && selection.anchorOffset === anchorNode.textContent.length) {
          return true;
        }
      }

      return anchorNode === lastNode && selection.anchorOffset === lastNode.textContent.length;
    }
  }]);

  return Caret;
}(Module);

Caret.displayName = 'Caret';
exports.default = Caret;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! dom */ "./src/components/dom.js"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/events.js":
/*!******************************************!*\
  !*** ./src/components/modules/events.js ***!
  \******************************************/
/*! no static exports found */
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
 *    - {Function off - unsubsribes callback
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
   * Subscribe any event on callback
   *
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
     * Emit callbacks with passed data
     *
     * @param {String} eventName - event name
     * @param {Object} data - subscribers get this data when they were fired
     */

  }, {
    key: "emit",
    value: function emit(eventName, data) {
      if (!this.subscribers[eventName]) {
        return;
      }

      this.subscribers[eventName].reduce(function (previousData, currentHandler) {
        var newData = currentHandler(previousData);

        return newData ? newData : previousData;
      }, data);
    }

    /**
     * Unsubsribe callback from event
     *
     * @param eventName
     * @param callback
     */

  }, {
    key: "off",
    value: function off(eventName, callback) {
      for (var i = 0; i < this.subscribers[eventName].length; i++) {
        if (this.subscribers[eventName][i] === callback) {
          delete this.subscribers[eventName][i];
          break;
        }
      }
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/keyboard.js":
/*!********************************************!*\
  !*** ./src/components/modules/keyboard.js ***!
  \********************************************/
/*! no static exports found */
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
 * @class Keyboard
 * @classdesc Сlass to handle the keydowns
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX Team 2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

/**
 * @typedef {Keyboard} Keyboard
 */
var Keyboard = function (_Module) {
  _inherits(Keyboard, _Module);

  /**
   * @constructor
   */
  function Keyboard(_ref) {
    var config = _ref.config;

    _classCallCheck(this, Keyboard);

    return _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, { config: config }));
  }

  /**
   * Handler on Block for keyboard keys at keydown event
   *
   * @param {KeyboardEvent} event
   */


  _createClass(Keyboard, [{
    key: 'blockKeydownsListener',
    value: function blockKeydownsListener(event) {
      switch (event.keyCode) {
        case _.keyCodes.BACKSPACE:

          _.log('Backspace key pressed');
          this.backspacePressed(event);
          break;

        case _.keyCodes.ENTER:

          _.log('Enter key pressed');
          this.enterPressed(event);
          break;

        case _.keyCodes.DOWN:
        case _.keyCodes.RIGHT:

          _.log('Right/Down key pressed');
          this.arrowRightAndDownPressed();
          break;

        case _.keyCodes.UP:
        case _.keyCodes.LEFT:

          _.log('Left/Up key pressed');
          this.arrowLeftAndUpPressed();
          break;

        default:

          break;
      }
    }

    /**
     * Handle pressing enter key
     *
     * @param {KeyboardEvent} event
     */

  }, {
    key: 'enterPressed',
    value: function enterPressed(event) {
      var currentBlock = this.Editor.BlockManager.currentBlock,
          toolsConfig = this.config.toolsConfig[currentBlock.name];

      /**
       * Don't handle Enter keydowns when Tool sets enableLineBreaks to true.
       * Uses for Tools like <code> where line breaks should be handled by default behaviour.
       */
      if (toolsConfig && toolsConfig[this.Editor.Tools.apiSettings.IS_ENABLED_LINE_BREAKS]) {
        return;
      }

      /**
       * Allow to create linebreaks by Shift+Enter
       */
      if (event.shiftKey) {
        return;
      }

      /**
       * Split the Current Block into two blocks
       */
      this.Editor.BlockManager.split();

      /**
       * Renew local current node after split
       */
      var newCurrent = this.Editor.BlockManager.currentBlock;

      this.Editor.Toolbar.move();
      this.Editor.Toolbar.open();

      if (this.Editor.Tools.isInitial(newCurrent.tool) && newCurrent.isEmpty) {
        this.Editor.Toolbar.plusButton.show();
      }

      event.preventDefault();
    }

    /**
     * Handle backspace keypress on block
     * @param {KeyboardEvent} event - keydown
     */

  }, {
    key: 'backspacePressed',
    value: function backspacePressed(event) {
      var _this2 = this;

      var BM = this.Editor.BlockManager;

      var isFirstBlock = BM.currentBlockIndex === 0,
          canMergeBlocks = this.Editor.Caret.isAtStart && !isFirstBlock;

      if (!canMergeBlocks) {
        return;
      }

      // preventing browser default behaviour
      event.preventDefault();

      var targetBlock = BM.getBlockByIndex(BM.currentBlockIndex - 1),
          blockToMerge = BM.currentBlock;

      /**
       * Blocks that can be merged:
       * 1) with the same Name
       * 2) Tool has 'merge' method
       *
       * other case will handle as usual ARROW LEFT behaviour
       */
      if (blockToMerge.name !== targetBlock.name || !targetBlock.mergeable) {
        if (this.Editor.Caret.navigatePrevious()) {
          this.Editor.Toolbar.close();
        }
      }

      var setCaretToTheEnd = !targetBlock.isEmpty;

      BM.mergeBlocks(targetBlock, blockToMerge).then(function () {
        // @todo figure out without timeout
        window.setTimeout(function () {
          // set caret to the block without offset at the end
          if (_this2.Editor.Caret.setToBlock(BM.currentBlock, 0, setCaretToTheEnd)) {
            _this2.Editor.Toolbar.close();
          }
        }, 10);
      });
    }

    /**
     * Handle right and down keyboard keys
     */

  }, {
    key: 'arrowRightAndDownPressed',
    value: function arrowRightAndDownPressed() {
      if (!this.Editor.Caret.navigateNext()) {
        return;
      }

      this.Editor.Toolbar.close();
    }

    /**
     * Handle left and up keyboard keys
     */

  }, {
    key: 'arrowLeftAndUpPressed',
    value: function arrowLeftAndUpPressed() {
      if (!this.Editor.Caret.navigatePrevious()) {
        return;
      }

      this.Editor.Toolbar.close();
    }
  }]);

  return Keyboard;
}(Module);

Keyboard.displayName = 'Keyboard';
exports.default = Keyboard;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/listeners.js":
/*!*********************************************!*\
  !*** ./src/components/modules/listeners.js ***!
  \*********************************************/
/*! no static exports found */
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
 * Codex Editor Listeners module
 *
 * @module Listeners
 *
 * Module-decorator for event listeners assignment
 *
 * @author Codex Team
 * @version 2.0.0
 */

/**
 * @typedef {Listeners} Listeners
 * @property {Array} allListeners
 */
var Listeners = function (_Module) {
  _inherits(Listeners, _Module);

  /**
   * @constructor
   * @param {EditorConfig} config
   */
  function Listeners(_ref) {
    var config = _ref.config;

    _classCallCheck(this, Listeners);

    var _this = _possibleConstructorReturn(this, (Listeners.__proto__ || Object.getPrototypeOf(Listeners)).call(this, { config: config }));

    _this.allListeners = [];
    return _this;
  }

  /**
   * Assigns event listener on element
   *
   * @param {Element} element - DOM element that needs to be listened
   * @param {String} eventType - event type
   * @param {Function} handler - method that will be fired on event
   * @param {Boolean} useCapture - use event bubbling
   */


  _createClass(Listeners, [{
    key: "on",
    value: function on(element, eventType, handler) {
      var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var assignedEventData = {
        element: element,
        eventType: eventType,
        handler: handler,
        useCapture: useCapture
      };

      var alreadyExist = this.findOne(element, eventType, handler);

      if (alreadyExist) return;

      this.allListeners.push(assignedEventData);
      element.addEventListener(eventType, handler, useCapture);
    }

    /**
     * Removes event listener from element
     *
     * @param {Element} element - DOM element that we removing listener
     * @param {String} eventType - event type
     * @param {Function} handler - remove handler, if element listens several handlers on the same event type
     * @param {Boolean} useCapture - use event bubbling
     */

  }, {
    key: "off",
    value: function off(element, eventType, handler) {
      var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var existingListeners = this.findAll(element, eventType, handler);

      for (var i = 0; i < existingListeners.length; i++) {
        var index = this.allListeners.indexOf(existingListeners[i]);

        if (index > 0) {
          this.allListeners.splice(index, 1);
        }
      }

      element.removeEventListener(eventType, handler, useCapture);
    }

    /**
     * Search method: looks for listener by passed element
     * @param {Element} element - searching element
     * @returns {Array} listeners that found on element
     */

  }, {
    key: "findByElement",
    value: function findByElement(element) {
      var listenersOnElement = [];

      for (var i = 0; i < this.allListeners.length; i++) {
        var listener = this.allListeners[i];

        if (listener.element === element) {
          listenersOnElement.push(listener);
        }
      }

      return listenersOnElement;
    }

    /**
     * Search method: looks for listener by passed event type
     * @param {String} eventType
     * @return {Array} listeners that found on element
     */

  }, {
    key: "findByType",
    value: function findByType(eventType) {
      var listenersWithType = [];

      for (var i = 0; i < this.allListeners.length; i++) {
        var listener = this.allListeners[i];

        if (listener.type === eventType) {
          listenersWithType.push(listener);
        }
      }

      return listenersWithType;
    }

    /**
     * Search method: looks for listener by passed handler
     * @param {Function} handler
     * @return {Array} listeners that found on element
     */

  }, {
    key: "findByHandler",
    value: function findByHandler(handler) {
      var listenersWithHandler = [];

      for (var i = 0; i < this.allListeners.length; i++) {
        var listener = this.allListeners[i];

        if (listener.handler === handler) {
          listenersWithHandler.push(listener);
        }
      }

      return listenersWithHandler;
    }

    /**
     * @param {Element} element
     * @param {String} eventType
     * @param {Function} handler
     * @return {Element|null}
     */

  }, {
    key: "findOne",
    value: function findOne(element, eventType, handler) {
      var foundListeners = this.findAll(element, eventType, handler);

      return foundListeners.length > 0 ? foundListeners[0] : null;
    }

    /**
     * @param {Element} element
     * @param {String} eventType
     * @param {Function} handler
     * @return {Array}
     */

  }, {
    key: "findAll",
    value: function findAll(element, eventType, handler) {
      var found = void 0,
          foundByElements = element ? this.findByElement(element) : [];
      // foundByEventType = eventType ? this.findByType(eventType) : [],
      // foundByHandler = handler ? this.findByHandler(handler) : [];

      if (element && eventType && handler) {
        found = foundByElements.filter(function (event) {
          return event.eventType === eventType && event.handler === handler;
        });
      } else if (element && eventType) {
        found = foundByElements.filter(function (event) {
          return event.eventType === eventType;
        });
      } else {
        found = foundByElements;
      }

      return found;
    }

    /**
     * Removes all listeners
     */

  }, {
    key: "removeAll",
    value: function removeAll() {
      this.allListeners.map(function (current) {
        current.element.removeEventListener(current.eventType, current.handler);
      });

      this.allListeners = [];
    }
  }]);

  return Listeners;
}(Module);

Listeners.displayName = "Listeners";
exports.default = Listeners;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/renderer.js":
/*!********************************************!*\
  !*** ./src/components/modules/renderer.js ***!
  \********************************************/
/*! no static exports found */
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
          data = item.data,
          settings = item.settings;

      this.Editor.BlockManager.insert(tool, data, settings);

      return Promise.resolve();
    }
  }]);

  return Renderer;
}(Module);

Renderer.displayName = "Renderer";
exports.default = Renderer;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/sanitizer.js":
/*!*********************************************!*\
  !*** ./src/components/modules/sanitizer.js ***!
  \*********************************************/
/*! no static exports found */
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
    _this.sanitizerInstance = __webpack_require__(/*! html-janitor */ "./node_modules/html-janitor/src/html-janitor.js");
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/saver.js":
/*!*****************************************!*\
  !*** ./src/components/modules/saver.js ***!
  \*****************************************/
/*! no static exports found */
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

      allExtractedData.forEach(function (extraction) {
        /** Group process info */
        console.log('\xAB' + extraction.tool + '\xBB saving info', extraction);
        totalTime += extraction.time;
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts")))

/***/ }),

/***/ "./src/components/modules/toolbar-blockSettings.js":
/*!*********************************************************!*\
  !*** ./src/components/modules/toolbar-blockSettings.js ***!
  \*********************************************************/
/*! no static exports found */
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
 * Block Settings
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 */
var BlockSettings = function (_Module) {
  _inherits(BlockSettings, _Module);

  /**
   * @constructor
   */
  function BlockSettings(_ref) {
    var config = _ref.config;

    _classCallCheck(this, BlockSettings);

    var _this = _possibleConstructorReturn(this, (BlockSettings.__proto__ || Object.getPrototypeOf(BlockSettings)).call(this, { config: config }));

    _this.nodes = {
      wrapper: null,
      toolSettings: null,
      defaultSettings: null
    };
    return _this;
  }

  /**
   * Module Events
   * @return {{opened: string, closed: string}}
   */


  _createClass(BlockSettings, [{
    key: 'make',


    /**
     * Panel with block settings with 2 sections:
     *  - Tool's Settings
     *  - Default Settings [Move, Remove, etc]
     *
     * @return {Element}
     */
    value: function make() {
      this.nodes.wrapper = $.make('div', BlockSettings.CSS.wrapper);

      this.nodes.toolSettings = $.make('div', BlockSettings.CSS.toolSettings);
      this.nodes.defaultSettings = $.make('div', BlockSettings.CSS.defaultSettings);

      $.append(this.nodes.wrapper, [this.nodes.toolSettings, this.nodes.defaultSettings]);
    }

    /**
     * Add Tool's settings
     */

  }, {
    key: 'addToolSettings',
    value: function addToolSettings() {
      if (typeof this.Editor.BlockManager.currentBlock.tool.makeSettings === 'function') {
        $.append(this.nodes.toolSettings, this.Editor.BlockManager.currentBlock.tool.makeSettings());
      }
    }

    /**
     * Add default settings
     */

  }, {
    key: 'addDefaultSettings',
    value: function addDefaultSettings() {
      $.append(this.nodes.defaultSettings, this.Editor.BlockManager.currentBlock.renderTunes());
    }

    /**
     * Is Block Settings opened or not
     * @returns {boolean}
     */

  }, {
    key: 'open',


    /**
     * Open Block Settings pane
     */
    value: function open() {
      this.nodes.wrapper.classList.add(BlockSettings.CSS.wrapperOpened);

      /**
       * Fill Tool's settings
       */
      this.addToolSettings();

      /**
       * Add default settings that presents for all Blocks
       */
      this.addDefaultSettings();

      /** Tell to subscribers that block settings is opened */
      this.Editor.Events.emit(this.events.opened);
    }

    /**
     * Close Block Settings pane
     */

  }, {
    key: 'close',
    value: function close() {
      this.nodes.wrapper.classList.remove(BlockSettings.CSS.wrapperOpened);

      /** Clear settings */
      this.nodes.toolSettings.innerHTML = '';
      this.nodes.defaultSettings.innerHTML = '';

      /** Tell to subscribers that block settings is closed */
      this.Editor.Events.emit(this.events.closed);
    }
  }, {
    key: 'events',
    get: function get() {
      return {
        opened: 'block-settings-opened',
        closed: 'block-settings-closed'
      };
    }

    /**
     * Block Settings CSS
     * @return {{wrapper, wrapperOpened, toolSettings, defaultSettings, button}}
     */

  }, {
    key: 'opened',
    get: function get() {
      return this.nodes.wrapper.classList.contains(BlockSettings.CSS.wrapperOpened);
    }
  }], [{
    key: 'CSS',
    get: function get() {
      return {
        // Settings Panel
        wrapper: 'ce-settings',
        wrapperOpened: 'ce-settings--opened',
        toolSettings: 'ce-settings__plugin-zone',
        defaultSettings: 'ce-settings__default-zone',

        button: 'ce-settings__button'
      };
    }
  }]);

  return BlockSettings;
}(Module);

BlockSettings.displayName = 'BlockSettings';
exports.default = BlockSettings;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! dom */ "./src/components/dom.js")))

/***/ }),

/***/ "./src/components/modules/toolbar-inline.ts":
/*!**************************************************!*\
  !*** ./src/components/modules/toolbar-inline.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inlineToolBold = __webpack_require__(/*! ../inline-tools/inline-tool-bold */ "./src/components/inline-tools/inline-tool-bold.ts");

var _inlineToolBold2 = _interopRequireDefault(_inlineToolBold);

var _inlineToolItalic = __webpack_require__(/*! ../inline-tools/inline-tool-italic */ "./src/components/inline-tools/inline-tool-italic.ts");

var _inlineToolItalic2 = _interopRequireDefault(_inlineToolItalic);

var _inlineToolLink = __webpack_require__(/*! ../inline-tools/inline-tool-link */ "./src/components/inline-tools/inline-tool-link.ts");

var _inlineToolLink2 = _interopRequireDefault(_inlineToolLink);

var _selection = __webpack_require__(/*! ../selection */ "./src/components/selection.js");

var _selection2 = _interopRequireDefault(_selection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InlineToolbar = function (_Module) {
    _inherits(InlineToolbar, _Module);

    /**
     * @constructor
     */
    function InlineToolbar(_ref) {
        var config = _ref.config;

        _classCallCheck(this, InlineToolbar);

        /**
         * CSS styles
         */
        var _this = _possibleConstructorReturn(this, (InlineToolbar.__proto__ || Object.getPrototypeOf(InlineToolbar)).call(this, { config: config }));

        _this.CSS = {
            inlineToolbar: 'ce-inline-toolbar',
            inlineToolbarShowed: 'ce-inline-toolbar--showed',
            buttonsWrapper: 'ce-inline-toolbar__buttons',
            actionsWrapper: 'ce-inline-toolbar__actions'
        };
        /**
         * Inline Toolbar elements
         */
        _this.nodes = {
            wrapper: null,
            buttons: null,
            /**
             * Zone below the buttons where Tools can create additional actions by 'renderActions()' method
             * For example, input for the 'link' tool or textarea for the 'comment' tool
             */
            actions: null
        };
        /**
         * Margin above/below the Toolbar
         */
        _this.toolbarVerticalMargin = 20;
        return _this;
    }
    /**
     * Inline Toolbar Tools
     * @todo Merge internal tools with external
     */


    _createClass(InlineToolbar, [{
        key: 'make',

        /**
         * Making DOM
         */
        value: function make() {
            this.nodes.wrapper = $.make('div', this.CSS.inlineToolbar);
            this.nodes.buttons = $.make('div', this.CSS.buttonsWrapper);
            this.nodes.actions = $.make('div', this.CSS.actionsWrapper);
            /**
             * Append Inline Toolbar to the Editor
             */
            $.append(this.nodes.wrapper, [this.nodes.buttons, this.nodes.actions]);
            $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
            /**
             * Append Inline Toolbar Tools
             */
            this.addTools();
        }
        /**
         *
         *
         *  Moving / appearance
         *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         *
         */
        /**
         * Shows Inline Toolbar by keyup/mouseup
         * @param {KeyboardEvent|MouseEvent} event
         */

    }, {
        key: 'handleShowingEvent',
        value: function handleShowingEvent(event) {
            if (!this.allowedToShow(event)) {
                this.close();
                return;
            }
            this.move();
            this.open();
            /** Check Tools state for selected fragment */
            this.checkToolsState();
        }
        /**
         * Move Toolbar to the selected text
         */

    }, {
        key: 'move',
        value: function move() {
            var selectionRect = _selection2.default.rect;
            var wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();
            var newCoords = {
                x: selectionRect.x - wrapperOffset.left,
                y: selectionRect.y + selectionRect.height
                // + window.scrollY
                - wrapperOffset.top + this.toolbarVerticalMargin
            };
            /**
             * If we know selections width, place InlineToolbar to center
             */
            if (selectionRect.width) {
                newCoords.x += Math.floor(selectionRect.width / 2);
            }
            this.nodes.wrapper.style.left = Math.floor(newCoords.x) + 'px';
            this.nodes.wrapper.style.top = Math.floor(newCoords.y) + 'px';
        }
        /**
         * Shows Inline Toolbar
         */

    }, {
        key: 'open',
        value: function open() {
            this.nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed);
            this.tools.forEach(function (tool) {
                if (typeof tool.clear === 'function') {
                    tool.clear();
                }
            });
        }
        /**
         * Hides Inline Toolbar
         */

    }, {
        key: 'close',
        value: function close() {
            this.nodes.wrapper.classList.remove(this.CSS.inlineToolbarShowed);
            this.tools.forEach(function (tool) {
                if (typeof tool.clear === 'function') {
                    tool.clear();
                }
            });
        }
        /**
         * Need to show Inline Toolbar or not
         * @param {KeyboardEvent|MouseEvent} event
         */

    }, {
        key: 'allowedToShow',
        value: function allowedToShow(event) {
            /**
             * Tags conflicts with window.selection function.
             * Ex. IMG tag returns null (Firefox) or Redactors wrapper (Chrome)
             */
            var tagsConflictsWithSelection = ['IMG', 'INPUT'];
            if (event && tagsConflictsWithSelection.includes(event.target.tagName)) {
                return false;
            }
            var currentSelection = _selection2.default.get(),
                selectedText = _selection2.default.text;
            // old browsers
            if (!currentSelection || !currentSelection.anchorNode) {
                return false;
            }
            // empty selection
            if (currentSelection.isCollapsed || selectedText.length < 1) {
                return false;
            }
            // is enabled by current Block's Tool
            var currentBlock = this.Editor.BlockManager.getBlock(currentSelection.anchorNode);
            if (!currentBlock) {
                return false;
            }
            var toolConfig = this.config.toolsConfig[currentBlock.name];
            return toolConfig && toolConfig[this.Editor.Tools.apiSettings.IS_ENABLED_INLINE_TOOLBAR];
        }
        /**
         *
         *
         *  Working with Tools
         *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         *
         */
        /**
         * Fill Inline Toolbar with Tools
         */

    }, {
        key: 'addTools',
        value: function addTools() {
            var _this2 = this;

            this.tools.forEach(function (tool) {
                _this2.addTool(tool);
            });
        }
        /**
         * Add tool button and activate clicks
         * @param {InlineTool} tool - Tool's instance
         */

    }, {
        key: 'addTool',
        value: function addTool(tool) {
            var _this3 = this;

            var button = tool.render();
            if (!button) {
                _.log('Render method must return an instance of Node', 'warn', tool);
                return;
            }
            this.nodes.buttons.appendChild(button);
            if (typeof tool.renderActions === 'function') {
                var actions = tool.renderActions();
                this.nodes.actions.appendChild(actions);
            }
            this.Editor.Listeners.on(button, 'click', function () {
                _this3.toolClicked(tool);
            });
        }
        /**
         * Inline Tool button clicks
         * @param {InlineTool} tool - Tool's instance
         */

    }, {
        key: 'toolClicked',
        value: function toolClicked(tool) {
            var range = _selection2.default.range;
            tool.surround(range);
            this.checkToolsState();
        }
        /**
         * Check Tools` state by selection
         */

    }, {
        key: 'checkToolsState',
        value: function checkToolsState() {
            this.tools.forEach(function (tool) {
                tool.checkState(_selection2.default.get());
            });
        }
    }, {
        key: 'tools',
        get: function get() {
            var _this4 = this;

            if (!this.toolsInstances) {
                this.toolsInstances = [new _inlineToolBold2.default(this.Editor.API.methods), new _inlineToolItalic2.default(this.Editor.API.methods), new _inlineToolLink2.default(this.Editor.API.methods)].concat(_toConsumableArray(this.Editor.Tools.inline.map(function (Tool) {
                    return new Tool(_this4.Editor.API.methods);
                })));
            }
            return this.toolsInstances;
        }
    }]);

    return InlineToolbar;
}(Module);

InlineToolbar.displayName = 'InlineToolbar';
exports.default = InlineToolbar;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! dom */ "./src/components/dom.js"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/toolbar-toolbox.js":
/*!***************************************************!*\
  !*** ./src/components/modules/toolbar-toolbox.js ***!
  \***************************************************/
/*! no static exports found */
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

      var api = this.Editor.Tools.apiSettings;

      if (tool[api.IS_DISPLAYED_IN_TOOLBOX] && !tool[api.TOOLBAR_ICON_CLASS]) {
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
      if (!tool[api.IS_DISPLAYED_IN_TOOLBOX]) {
        return;
      }

      var button = $.make('li', [Toolbox.CSS.toolboxButton, tool[api.TOOLBAR_ICON_CLASS]], {
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
      if (!tool[this.Editor.Tools.apiSettings.IS_IRREPLACEBLE_TOOL] && currentBlock.isEmpty) {
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! dom */ "./src/components/dom.js"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/toolbar.js":
/*!*******************************************!*\
  !*** ./src/components/modules/toolbar.js ***!
  \*******************************************/
/*! no static exports found */
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
 * |  .                                                .   .        [Open Settings]         .  |
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
 * @property {Element} nodes.blockActionsButtons   - Zone with Block Buttons: [Settings]
 * @property {Element} nodes.plusButton     - Button that opens or closes Toolbox
 * @property {Element} nodes.toolbox        - Container for tools
 * @property {Element} nodes.settingsToggler - open/close Settings Panel button
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
      blockActionsButtons: null,
      settingsToggler: null
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
      $.append(this.nodes.plusButton, $.svg('plus', 14, 14));
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
      this.nodes.blockActionsButtons = $.make('div', Toolbar.CSS.blockActionsButtons);
      this.nodes.settingsToggler = $.make('span', Toolbar.CSS.settingsToggler);
      var settingsIcon = $.svg('dots', 18, 4);

      $.append(this.nodes.settingsToggler, settingsIcon);
      $.append(this.nodes.blockActionsButtons, this.nodes.settingsToggler);
      $.append(this.nodes.actions, this.nodes.blockActionsButtons);

      /**
       * Make and append Settings Panel
       */
      this.Editor.BlockSettings.make();
      $.append(this.nodes.actions, this.Editor.BlockSettings.nodes.wrapper);

      /**
       * Append toolbar to the Editor
       */
      $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

      /**
       * Bind events on the Toolbar elements
       */
      this.bindEvents();
    }

    /**
     * Move Toolbar to the Current Block
     * @param {Boolean} forceClose - force close Toolbar Settings and Toolbar
     */

  }, {
    key: 'move',
    value: function move() {
      var forceClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (forceClose) {
        /** Close Toolbox when we move toolbar */
        this.Editor.Toolbox.close();
        this.Editor.BlockSettings.close();
      }

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
    value: function plusButtonClicked() {
      this.Editor.Toolbox.toggle();
    }

    /**
     * Bind events on the Toolbar Elements:
     * - Block Settings
     */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this3 = this;

      /**
       * Settings toggler
       */
      this.Editor.Listeners.on(this.nodes.settingsToggler, 'click', function (event) {
        _this3.settingsTogglerClicked(event);
      });
    }

    /**
     * Clicks on the Block Settings toggler
     */

  }, {
    key: 'settingsTogglerClicked',
    value: function settingsTogglerClicked() {
      if (this.Editor.BlockSettings.opened) {
        this.Editor.BlockSettings.close();
      } else {
        this.Editor.BlockSettings.open();
      }
    }
  }, {
    key: 'plusButton',
    get: function get() {
      var _this4 = this;

      return {
        hide: function hide() {
          return _this4.nodes.plusButton.classList.add(Toolbar.CSS.plusButtonHidden);
        },
        show: function show() {
          return _this4.nodes.plusButton.classList.remove(Toolbar.CSS.plusButtonHidden);
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
        blockActionsButtons: 'ce-toolbar__actions-buttons',
        settingsToggler: 'ce-toolbar__settings-btn'
      };
    }
  }]);

  return Toolbar;
}(Module);

Toolbar.displayName = 'Toolbar';
exports.default = Toolbar;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! dom */ "./src/components/dom.js")))

/***/ }),

/***/ "./src/components/modules/tools.js":
/*!*****************************************!*\
  !*** ./src/components/modules/tools.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, _) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
 * @property {Boolean|String[]} inlineToolbar - Pass `true` to enable the Inline Toolbar with all Tools, all pass an array with specified Tools list |
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
     * Return Tools for the Inline Toolbar
     * @return {Array} - array of Inline Tool's classes
     */

  }, {
    key: 'inline',
    get: function get() {
      var _this2 = this;

      return Object.values(this.available).filter(function (tool) {
        if (!tool[_this2.apiSettings.IS_INLINE]) {
          return false;
        }

        /**
         * Some Tools validation
         */
        var inlineToolRequiredMethods = ['render', 'surround', 'checkState'];
        var notImplementedMethods = inlineToolRequiredMethods.filter(function (method) {
          return !new tool()[method];
        });

        if (notImplementedMethods.length) {
          _.log('Incorrect Inline Tool: ' + tool.name + '. Some of required methods is not implemented %o', 'warn', notImplementedMethods);
          return false;
        }

        return true;
      });
    }

    /**
     * Constant for available Tools Settings
     * @return {object}
     */

  }, {
    key: 'apiSettings',
    get: function get() {
      return {
        IS_INLINE: 'isInline',
        TOOLBAR_ICON_CLASS: 'iconClassName',
        IS_DISPLAYED_IN_TOOLBOX: 'displayInToolbox',
        IS_ENABLED_LINE_BREAKS: 'enableLineBreaks',
        IS_IRREPLACEBLE_TOOL: 'irreplaceable',
        IS_ENABLED_INLINE_TOOLBAR: 'inlineToolbar'
      };
    }

    /**
     * Static getter for default Tool config fields
     * @return {ToolConfig}
     */

  }, {
    key: 'defaultConfig',
    get: function get() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, this.apiSettings.TOOLBAR_ICON_CLASS, false), _defineProperty(_ref, this.apiSettings.IS_DISPLAYED_IN_TOOLBOX, false), _defineProperty(_ref, this.apiSettings.IS_ENABLED_LINE_BREAKS, false), _defineProperty(_ref, this.apiSettings.IS_IRREPLACEBLE_TOOL, false), _defineProperty(_ref, this.apiSettings.IS_ENABLED_INLINE_TOOLBAR, false), _ref;
    }

    /**
     * @constructor
     *
     * @param {EditorConfig} config
     */

  }]);

  function Tools(_ref2) {
    var config = _ref2.config;

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
      var _this3 = this;

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
        _this3.success(data);
      }, function (data) {
        _this3.fallback(data);
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

      var instance = new plugin(data, config || {});

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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/modules/ui.js":
/*!**************************************!*\
  !*** ./src/components/modules/ui.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Module, $) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sprite = __webpack_require__(/*! ../../../build/sprite.svg */ "./build/sprite.svg");

var _sprite2 = _interopRequireDefault(_sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Module UI
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @type {UI}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Prebuilded sprite of SVG icons
 */


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
       * Append SVG sprite
       */
      .then(function () {
        return _this2.appendSVGSprite();
      })
      /**
       * Make toolbar
       */
      .then(function () {
        return _this2.Editor.Toolbar.make();
      })
      /**
       * Make the Inline toolbar
       */
      .then(function () {
        return _this2.Editor.InlineToolbar.make();
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
      var styles = __webpack_require__(/*! ../../styles/main.css */ "./src/styles/main.css");

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

      this.Editor.Listeners.on(this.nodes.redactor, 'click', function (event) {
        return _this4.redactorClicked(event);
      }, false);
      this.Editor.Listeners.on(document, 'click', function (event) {
        return _this4.documentClicked(event);
      }, false);
    }

    /**
     * All clicks on document
     * @param {MouseEvent} event - Click
     */

  }, {
    key: 'documentClicked',
    value: function documentClicked(event) {
      /**
       * Close Inline Toolbar when nothing selected
       * Do not fire check on clicks at the Inline Toolbar buttons
       */
      var clickedOnInlineToolbarButton = event.target.closest('.' + this.Editor.InlineToolbar.CSS.inlineToolbar);

      if (!clickedOnInlineToolbarButton) {
        this.Editor.InlineToolbar.handleShowingEvent(event);
      }
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
      } catch (e) {
        /**
         * If clicked outside first-level Blocks, set Caret to the last empty Block
         */
        this.Editor.Caret.setToTheLastBlock();
      }

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

    /**
     * Append prebuilded sprite with SVG icons
     */

  }, {
    key: 'appendSVGSprite',
    value: function appendSVGSprite() {
      var spriteHolder = $.make('div');

      spriteHolder.innerHTML = _sprite2.default;

      $.append(this.nodes.wrapper, spriteHolder);
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../__module.ts */ "./src/components/__module.ts"), __webpack_require__(/*! dom */ "./src/components/dom.js")))

/***/ }),

/***/ "./src/components/polyfills.js":
/*!*************************************!*\
  !*** ./src/components/polyfills.js ***!
  \*************************************/
/*! no static exports found */
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

/***/ "./src/components/selection.js":
/*!*************************************!*\
  !*** ./src/components/selection.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Working with selection
 * @typedef {Selection} Selection
 */
var Selection = function () {
  /**
   * @constructor
   */
  function Selection() {
    _classCallCheck(this, Selection);

    this.instance = null;
    this.selection = null;

    /**
     * This property can store Selection's range for restoring later
     * @type {Range|null}
     */
    this.savedSelectionRange = null;
  }

  /**
   * Returns window Selection
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Window/getSelection}
   * @return {Selection}
   */


  _createClass(Selection, [{
    key: 'save',


    /**
     * Save Selection's range
     */
    value: function save() {
      this.savedSelectionRange = Selection.range;
    }

    /**
     * Restore saved Selection's range
     */

  }, {
    key: 'restore',
    value: function restore() {
      if (!this.savedSelectionRange) {
        return;
      }

      var sel = window.getSelection();

      sel.removeAllRanges();
      sel.addRange(this.savedSelectionRange);
    }

    /**
     * Clears saved selection
     */

  }, {
    key: 'clearSaved',
    value: function clearSaved() {
      this.savedSelectionRange = null;
    }

    /**
     * Looks ahead to find passed tag from current selection
     *
     * @param  {String} tagName       - tag to found
     * @param  {String} [className]   - tag's class name
     * @param  {Number} [searchDepth] - count of tags that can be included. For better performance.
     * @return {HTMLElement|null}
     */

  }, {
    key: 'findParentTag',
    value: function findParentTag(tagName, className) {
      var searchDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

      var selection = window.getSelection(),
          parentTag = null;

      /**
       * If selection is missing or no anchorNode or focusNode were found then return null
       */
      if (!selection || !selection.anchorNode || !selection.focusNode) {
        return null;
      }

      /**
       * Define Nodes for start and end of selection
       */
      var boundNodes = [
      /** the Node in which the selection begins */
      selection.anchorNode,
      /** the Node in which the selection ends */
      selection.focusNode];

      /**
       * For each selection parent Nodes we try to find target tag [with target class name]
       * It would be saved in parentTag variable
       */
      boundNodes.forEach(function (parent) {
        /** Reset tags limit */
        var searchDepthIterable = searchDepth;

        while (searchDepthIterable > 0 && parent.parentNode) {
          /**
           * Check tag's name
           */
          if (parent.tagName === tagName) {
            /**
             * Optional additional check for class-name matching
             */
            if (className && parent.classList && !parent.classList.contains(className)) {
              continue;
            }

            /**
             * If we have found required tag with class then save the result and go out from cycle
             */
            parentTag = parent;
            break;
          }

          /**
           * Target tag was not found. Go up to the parent and check it
           */
          parent = parent.parentNode;
          searchDepthIterable--;
        }
      });

      /**
       * Return found tag or null
       */
      return parentTag;
    }

    /**
     * Expands selection range to the passed parent node
     *
     * @param {HTMLElement} node
     */

  }, {
    key: 'expandToTag',
    value: function expandToTag(node) {
      var selection = window.getSelection();

      selection.removeAllRanges();
      var range = document.createRange();

      range.selectNodeContents(node);
      selection.addRange(range);
    }
  }], [{
    key: 'get',
    value: function get() {
      return window.getSelection();
    }

    /**
     * Returns selected anchor
     * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorNode}
     * @return {Node|null}
     */

  }, {
    key: 'anchorNode',
    get: function get() {
      var selection = window.getSelection();

      return selection ? selection.anchorNode : null;
    }

    /**
     * Returns selection offset according to the anchor node
     * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
     * @return {Number|null}
     */

  }, {
    key: 'anchorOffset',
    get: function get() {
      var selection = window.getSelection();

      return selection ? selection.anchorOffset : null;
    }

    /**
     * Is current selection range collapsed
     * @return {boolean|null}
     */

  }, {
    key: 'isCollapsed',
    get: function get() {
      var selection = window.getSelection();

      return selection ? selection.isCollapsed : null;
    }

    /**
     * Return first range
     * @return {Range|null}
     */

  }, {
    key: 'range',
    get: function get() {
      var selection = window.getSelection();

      return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    /**
     * Calculates position and size of selected text
     * @return {{x, y, width, height, top?, left?, bottom?, right?}}
     */

  }, {
    key: 'rect',
    get: function get() {
      var sel = document.selection,
          range = void 0;
      var rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };

      if (sel && sel.type !== 'Control') {
        range = sel.createRange();
        rect.x = range.boundingLeft;
        rect.y = range.boundingTop;
        rect.width = range.boundingWidth;
        rect.height = range.boundingHeight;

        return rect;
      }

      if (!window.getSelection) {
        _.log('Method window.getSelection is not supported', 'warn');
        return rect;
      }

      sel = window.getSelection();

      if (!sel.rangeCount) {
        _.log('Method Selection.rangeCount() is not supported', 'warn');
        return rect;
      }

      range = sel.getRangeAt(0).cloneRange();

      if (range.getBoundingClientRect) {
        rect = range.getBoundingClientRect();
      }
      // Fall back to inserting a temporary element
      if (rect.x === 0 && rect.y === 0) {
        var span = document.createElement('span');

        if (span.getBoundingClientRect) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild(document.createTextNode('\u200B'));
          range.insertNode(span);
          rect = span.getBoundingClientRect();

          var spanParent = span.parentNode;

          spanParent.removeChild(span);

          // Glue any broken text nodes back together
          spanParent.normalize();
        }
      }

      return rect;
    }

    /**
     * Returns selected text as String
     * @returns {string}
     */

  }, {
    key: 'text',
    get: function get() {
      return window.getSelection ? window.getSelection().toString() : '';
    }
  }]);

  return Selection;
}();

Selection.displayName = 'Selection';
exports.default = Selection;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! utils */ "./src/components/utils.js")))

/***/ }),

/***/ "./src/components/utils.js":
/*!*********************************!*\
  !*** ./src/components/utils.js ***!
  \*********************************/
/*! no static exports found */
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
     * Returns basic keycodes as constants
     * @return {{}}
     */

  }, {
    key: 'sequence',


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

    /**
     * Check if passed element is contenteditable
     * @param element
     * @return {boolean}
     */

  }, {
    key: 'isContentEditable',
    value: function isContentEditable(element) {
      return element.contentEditable === 'true';
    }

    /**
     * Delays method execution
     *
     * @param method
     * @param timeout
     */

  }, {
    key: 'delay',
    value: function delay(method, timeout) {
      return function () {
        var context = this,
            args = arguments;

        window.setTimeout(function () {
          return method.apply(context, args);
        }, timeout);
      };
    }
  }, {
    key: 'keyCodes',
    get: function get() {
      return {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        DOWN: 40,
        RIGHT: 39,
        DELETE: 46,
        META: 91
      };
    }
  }]);

  return Util;
}();

Util.displayName = 'Util';
exports.default = Util;
;
module.exports = exports['default'];

/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ":root {\n  /**\n   * Toolbar buttons\n   */\n  --bg-light: #eff2f5;\n\n  /**\n   * All gray texts: placeholders, settings\n   */\n  --grayText: #707684;\n\n  /** Blue icons */\n  --color-active-icon: #388AE5;\n\n  /**\n   * Block content width\n   */\n  --content-width: 650px;\n\n  /**\n   * Toolbar Plus Button and Toolbox buttons height and width\n   */\n  --toolbar-buttons-size: 34px;\n\n  /**\n   * Confirm deletion bg\n   */\n  --color-confirm: #E24A4A;\n}\n/**\n* Editor wrapper\n*/\n.codex-editor {\n  position: relative;\n  box-sizing: border-box;\n\n\n}\n.codex-editor .hide {\n    display: none;\n  }\n.codex-editor__redactor {\n    padding-bottom: 300px;\n  }\n.codex-editor svg {\n    fill: currentColor;\n    vertical-align: middle;\n    max-height: 100%;\n  }\n::-moz-selection{\n  background-color: rgba(61,166,239,0.63);\n}\n::selection{\n  background-color: rgba(61,166,239,0.63);\n}\n.ce-tune-moveup{}\n.ce-settings-delete:hover {\n    cursor: pointer;\n  }\n.ce-settings-delete::before {\n    content: 'delete'\n  }\n.ce-toolbar {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  /*opacity: 0;*/\n  /*visibility: hidden;*/\n  transition: opacity 100ms ease;\n  will-change: opacity, transform;\n  display: none;\n}\n.ce-toolbar--opened {\n    display: block;\n    /*opacity: 1;*/\n    /*visibility: visible;*/\n  }\n.ce-toolbar__content {\n    max-width: 650px;\n    max-width: var(--content-width);\n    margin: 0 auto;\n    position: relative;\n  }\n.ce-toolbar__plus {\n    position: absolute;\n    left: calc(calc(34px + 10px) * -1);\n    left: calc(calc(var(--toolbar-buttons-size) + 10px) * -1);\n    display: inline-block;\n    background-color: #eff2f5;\n    background-color: var(--bg-light);\n    width: 34px;\n    width: var(--toolbar-buttons-size);\n    height: 34px;\n    height: var(--toolbar-buttons-size);\n    line-height: 34px;\n    text-align: center;\n    border-radius: 50%;\n    cursor: pointer;\n  }\n.ce-toolbar__plus--hidden {\n      display: none;\n    }\n/**\n   * Block actions Zone\n   * -------------------------\n   */\n.ce-toolbar__actions {\n    position: absolute;\n    right: 0;\n    top: 0;\n    padding-right: 16px;\n  }\n.ce-toolbar__actions-buttons {\n      text-align: right;\n    }\n.ce-toolbar__settings-btn {\n    display: inline-block;\n    width: 24px;\n    height: 24px;\n    color: #707684;\n    color: var(--grayText);\n    cursor: pointer;\n  }\n.ce-toolbox {\n    position: absolute;\n    visibility: hidden;\n    transition: opacity 100ms ease;\n    will-change: opacity;\n}\n.ce-toolbox--opened {\n        opacity: 1;\n        visibility: visible;\n    }\n.ce-toolbox__button {\n        display: inline-block;\n        list-style: none;\n        margin: 0;\n        background: #eff2f5;\n        background: var(--bg-light);\n        width: 34px;\n        width: var(--toolbar-buttons-size);\n        height: 34px;\n        height: var(--toolbar-buttons-size);\n        border-radius: 30px;\n        overflow: hidden;\n        text-align: center;\n        line-height: 34px;\n        line-height: var(--toolbar-buttons-size)\n    }\n.ce-toolbox__button::before {\n            content: attr(title);\n            font-size: 22px;\n            font-weight: 500;\n            letter-spacing: 1em;\n            -webkit-font-feature-settings: \"smcp\", \"c2sc\";\n                    font-feature-settings: \"smcp\", \"c2sc\";\n            font-variant-caps: all-small-caps;\n            padding-left: 11.5px;\n            margin-top: -1px;\n            display: inline-block;\n        }\n.ce-inline-toolbar {\n  position: absolute;\n  background-color: #FFFFFF;\n  box-shadow: 0 8px 23px -6px rgba(21,40,54,0.31), 22px -14px 34px -18px rgba(33,48,73,0.26);\n  border-radius: 4px;\n  z-index: 2\n}\n.ce-inline-toolbar::before {\n  content: '';\n  width: 15px;\n  height: 15px;\n  position: absolute;\n  top: -7px;\n  left: 50%;\n  margin-left: -7px;\n  transform: rotate(-45deg);\n  background-color: #fff;\n  z-index: -1;\n      }\n.ce-inline-toolbar {\n  padding: 6px;\n  transform: translateX(-50%);\n  display: none;\n  box-shadow: 0 6px 12px -6px rgba(131, 147, 173, 0.46),\n              5px -12px 34px -13px rgba(97, 105, 134, 0.6),\n              0 26px 52px 3px rgba(147, 165, 186, 0.24);\n}\n.ce-inline-toolbar--showed {\n    display: block;\n  }\n.ce-inline-tool {\n  display: inline-block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  border-radius: 3px;\n  cursor: pointer;\n  border: 0;\n  outline: none;\n  background-color: transparent;\n  vertical-align: bottom;\n  color: #707684;\n  color: var(--grayText)\n}\n.ce-inline-tool:not(:last-of-type){\n  margin-right: 5px;\n    }\n.ce-inline-tool:hover {\n  background-color: #eff2f5;\n  background-color: var(--bg-light);\n    }\n.ce-inline-tool {\n  line-height: normal;\n}\n.ce-inline-tool--active {\n  color: #388AE5;\n  color: var(--color-active-icon);\n    }\n.ce-inline-tool--link .icon {\n      margin-top: -2px;\n    }\n.ce-inline-tool--link .icon--unlink {\n      display: none;\n    }\n.ce-inline-tool--unlink .icon--link {\n      display: none;\n    }\n.ce-inline-tool--unlink .icon--unlink {\n      display: inline-block;\n    }\n.ce-inline-tool-input {\n    background-color: #eff2f5;\n    background-color: var(--bg-light);\n    outline: none;\n    border: 0;\n    border-radius: 3px;\n    margin: 6px 0 0;\n    font-size: 13px;\n    padding: 8px;\n    width: 100%;\n    box-sizing: border-box;\n    display: none\n  }\n.ce-inline-tool-input::-webkit-input-placeholder {\n      color: #707684;\n      color: var(--grayText);\n    }\n.ce-inline-tool-input:-ms-input-placeholder {\n      color: #707684;\n      color: var(--grayText);\n    }\n.ce-inline-tool-input::placeholder {\n      color: #707684;\n      color: var(--grayText);\n    }\n.ce-inline-tool-input--showed {\n      display: block;\n    }\n.ce-settings {\n  position: absolute;\n  background-color: #FFFFFF;\n  box-shadow: 0 8px 23px -6px rgba(21,40,54,0.31), 22px -14px 34px -18px rgba(33,48,73,0.26);\n  border-radius: 4px;\n  z-index: 2\n}\n.ce-settings::before {\n  content: '';\n  width: 15px;\n  height: 15px;\n  position: absolute;\n  top: -7px;\n  left: 50%;\n  margin-left: -7px;\n  transform: rotate(-45deg);\n  background-color: #fff;\n  z-index: -1;\n      }\n.ce-settings {\n  right: 5px;\n  top: 35px;\n  min-width: 124px\n}\n.ce-settings::before{\n    left: auto;\n    right: 12px;\n  }\n.ce-settings {\n\n  display: none;\n}\n.ce-settings--opened {\n    display: block;\n  }\n.ce-settings__plugin-zone:not(:empty){\n      padding: 6px;\n    }\n.ce-settings__default-zone:not(:empty){\n      padding: 6px;\n    }\n.ce-settings__button {\n  display: inline-block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  border-radius: 3px;\n  cursor: pointer;\n  border: 0;\n  outline: none;\n  background-color: transparent;\n  vertical-align: bottom;\n  color: #707684;\n  color: var(--grayText)\n  }\n.ce-settings__button:not(:last-of-type){\n  margin-right: 5px;\n    }\n.ce-settings__button:hover {\n  background-color: #eff2f5;\n  background-color: var(--bg-light);\n    }\n.ce-settings__button--active {\n  color: #388AE5;\n  color: var(--color-active-icon);\n    }\n.ce-settings__button--delete {\n      transition: background-color 300ms ease;\n      will-change: background-color;\n    }\n.ce-settings__button--delete .icon {\n        transition: transform 200ms ease-out;\n        will-change: transform;\n      }\n.ce-settings__button--confirm {\n      background-color: #E24A4A;\n      background-color: var(--color-confirm);\n      color: #fff\n    }\n.ce-settings__button--confirm:hover {\n        background-color: rgb(213, 74, 74) !important;\n        background-color: rgb(213, 74, 74) !important;\n      }\n.ce-settings__button--confirm .icon {\n        transform: rotate(90deg);\n      }\n.ce-settings-move-up:hover {\n    cursor: pointer;\n  }\n.ce-settings-move-up--disabled {\n    cursor: not-allowed !important;\n    opacity: .3;\n  }\n.ce-block:first-of-type {\n    margin-top: 0;\n  }\n.ce-block--selected {\n    background-image: linear-gradient(17deg, rgba(243, 248, 255, 0.03) 63.45%, rgba(207, 214, 229, 0.27) 98%);\n    border-radius: 3px;\n  }\n.ce-block__content {\n    max-width: 650px;\n    max-width: var(--content-width);\n    margin: 0 auto;\n  }\n", ""]);

// exports


/***/ })

/******/ });
});
//# sourceMappingURL=codex-editor.js.map