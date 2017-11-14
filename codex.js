/**
 * Codex Editor
 *
 *
 *
 *
 * @author CodeX Team
 */
module.exports = class CodexEditor {

    /** Editor version */
    static get version() {

        return VERSION;

    }

    /**
     * Setting for configuration
     * @param config
     */
    set configuration(config = {}) {

        this._configuration.holderId = config.holderId;
        this._configuration.placeholder = config.placeholder || 'write your story...';
        this._configuration.sanitizer = config.sanitizer || {

        };

        this._configuration.hideToolbar = config.hideToolbar ? config.hideToolbar : false;

    }

    /**
     * Returns private property
     * @returns {{}|*}
     */
    get configuration() {

        return this._configuration;

    }

    /**
     * @param config
     *
     * @property this.configuration - editor instance configuration
     * @property this.moduleInstances - editor module instances
     */
    constructor(config) {

        'use strict';

        /** Privates */
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
    init() {

        let Core            = require('./src/modules/core'),
            Tools           = require('./src/modules/tools');
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

        let moduleList = {
            'core' : Core,
            'tools' : Tools
        };

        for(let moduleName in moduleList) {

            let modules = [];

            for(let moduleExtends in moduleList) {

                if (moduleExtends === moduleName) {

                    continue;

                }
                modules.push(moduleList[moduleExtends]);

            }

            this.moduleInstances[moduleName] = new moduleList[moduleName]({
                modules : modules,
                config  : this.configuration,
                state   : this.state,
                nodes   : this.nodes
            });

        }

        // this.moduleInstances['core'].prepare();
        Promise.resolve()
            .then(this.moduleInstances['core'].prepare.bind(this.moduleInstances['core']));
            // .then(this.moduleInstances['ui'].prepare)
            // .then(this.moduleInstances['tools'.prepare])
            // .catch(function (error) {
            //
            //     console.log('Error occured', error);
            //
            // });

    }

};

class Events {

    constructor() {

        this.subscribers = {};

    }

    on(eventName, callback) {

        if (!(eventName in this.subscribers)) {

            this.subscribers[eventName] = [];

        }

        // group by events
        this.subscribers[eventName].push(callback);

    }

    emit(eventName, data) {

        this.subscribers[eventName].reduce(function (previousData, currentHandler) {

            let newData = currentHandler(previousData);

            return newData ? newData : previousData;

        }, data);

    }

}
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
