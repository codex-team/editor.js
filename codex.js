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
const modules = [
    require('./src/modules/dom'),
    require('./src/modules/core'),
    require('./src/modules/ui')
];

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
module.exports = class CodexEditor {

    /** Editor version */
    static get version() {

        return VERSION;

    }

    /**
     * @param {EditorConfig} config - user configuration
     *
     */
    constructor(config) {

        'use strict';


        /**
         * Configuration object
         */
        this.config = {};

        /**
         * Editor Components
         */
        this.moduleInstances = {};

        Promise.resolve()
            .then(() => {

                this.configuration = config;

            })
            .then(() => this.init())
            .then(() => this.start())
            .then(() => {

                console.log('CodeX Editor is ready');

            })
            .catch(error => {

                console.log('CodeX Editor does not ready beecause of %o', error);

            });

    }

    /**
     * Setting for configuration
     * @param {object} config
     */
    set configuration(config = {}) {

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
    get configuration() {

        return this.config;

    }

    /**
     * Initializes modules:
     *  - make and save instances
     *  - configure
     */
    init() {

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
    constructModules() {

        modules.forEach( Module => {

            this.moduleInstances[Module.name] = new Module({
                config : this.configuration
            });

        });

    }

    /**
     * Modules instances configuration:
     *  - pass other modules to the 'state' property
     *  - ...
     */
    configureModules() {

        for(let name in this.moduleInstances) {

            /**
             * Module does not need self-instance
             */
            this.moduleInstances[name].state = this.getModulesDiff( name );

        }

    }

    /**
     * Return modules without passed name
     */
    getModulesDiff( name ) {

        let modules = {};

        for(let moduleName in this.moduleInstances) {

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
    start() {

        let prepareDecorator = module => module.prepare();

        return Promise.resolve()
            .then(prepareDecorator(this.moduleInstances['core']))
            .then(prepareDecorator(this.moduleInstances['ui']))
            .catch(function (error) {

                console.log('Error occured', error);

            });


    }

};

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
