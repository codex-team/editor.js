var main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Codex.Editor initial file
	 *
	 * @author Codex team
	 * @version 1.0.0
	 *
	 */

	// var core            = require('./editor/core');
	// var renderer        = require('./editor/renderer');
	// var saver           = require('./editor/saver');
	// var ui              = require('./editor/ui');
	// var callbacks       = require('./editor/callbacks');
	// var content         = require('./editor/content');
	// var caret           = require('./editor/caret');
	// var toolbar         = require('./editor/toolbar');
	// var transport       = require('./editor/transport');
	// var parser          = require('./editor/parser');
	// var draw            = require('./editor/draw');
	// var notifications   = require('./editor/notifications');

	/**
	 *
	 * @type {{settings, nodes, state, start}}
	 */
	var codex_editor = (function() {

	    /**
	     * @protected
	     *
	     *
	     * Default settings
	     * @type {{tools: string[], textareaId: string, blockTags: string[], uploadImagesUrl: string, initialBlockPlugin: string}}
	     */
	    var settings = {
	        tools     : ['paragraph', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
	        textareaId: 'codex-editor',

	        /**
	         * First-level tags viewing as separated blocks. Other'll be inserted as child
	         */
	        blockTags      : ['P', 'BLOCKQUOTE', 'UL', 'CODE', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],

	        /**
	         * Upload images with ajax
	         */
	        uploadImagesUrl: '/editor/transport/',

	        /**
	         * Type of block showing on empty editor
	         */
	        initialBlockPlugin: "paragraph"
	    };

	    /**
	     * @protected
	     *
	     * @type {{textarea: null, wrapper: null, toolbar: null, toolbox: null, notifications: null, plusButton: null, removeBlockButton: null, showSettingsButton: null, blockSettings: null, toolbarButtons: {}, redactor: null}}
	     */
	    var nodes = {
	        textarea          : null,
	        wrapper           : null,
	        toolbar           : null,
	        toolbox           : null,
	        notifications     : null,
	        plusButton        : null,
	        removeBlockButton : null,
	        showSettingsButton: null,
	        blockSettings     : null,
	        toolbarButtons    : {}, // { type : DomEl, ... }
	        redactor          : null
	    };

	    /**
	     * @protected
	     *
	     * @type {{jsonOutput: Array, blocks: Array, inputs: Array}}
	     */
	    var state = {
	        jsonOutput: [],
	        blocks    : [],
	        inputs    : []
	    };

	    /**
	     * @protected
	     *
	     * Initialization
	     * @uses Promise cEditor.core.prepare
	     * @param {} userSettings are :
	     *          - tools [],
	     *          - textareaId String
	     *          ...
	     */
	    var start = function (userSettings) {

	        /**
	         * Prepare editor settings
	         */
	        core.prepare(userSettings)

	        /**
	         * If all is okay, than make UI, bind events and parse initial-content
	         */
	            .then(ui.make)
	            .then(ui.addTools)
	            .then(ui.bindEvents)
	            .then(transport.prepare)
	            .then(renderer.makeBlocksFromData)
	            .then(ui.saveInputs)
	            .catch(function (error) {
	                core.log('Initialization failed with error: %o', 'warn', error);
	            });

	    };

	    return {
	        settings : settings,
	        nodes    : nodes,
	        state    : state,
	        start    : start
	    };

	})();

	module.exports = codex_editor;

/***/ }
/******/ ]);