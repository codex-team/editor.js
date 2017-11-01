/**
 *
 * Codex Editor
 *
 * @author Codex Team
 */
module.exports = class CodexEditor {

    /** Editor version */
    static get version() {

        return VERSION;

    }

    /** Editor script prefixes */
    static get scriptPrefix() {

        return 'cdx-script-';

    }

    /**
     * @param config
     *
     * @property this.configuration - editor instance configuration
     * @property this.instances - editor module instances
     */
    constructor(config) {

        'use strict';

        this.configuration = config;
        this.instances = [];

        let modules = [
                'core',
                'tools',
                'transport',
                'renderer',
                'saver',
                'content',
                'toolbar/toolbar',
                'callbacks',
                'draw',
                'caret',
                'notifications',
                'parser',
                'sanitizer',
                'listeners',
                'destroyer',
                'paste'
            ],
            modulePath = './modules/';

        this.init(modulePath);

    }

    /**
     * Initializes modules:
     *  First: requiring modules from path
     *  Second: memorizing the instances
     *
     *  @param {String} module name
     *  @param {String} module path
     */
    init(path) {

        let core            = require('./modules/core'),
            tools           = require('./modules/tools'),
            transport       = require('./modules/transport'),
            renderer        = require('./modules/renderer'),
            saver           = require('./modules/saver'),
            content         = require('./modules/content'),
            toolbar         = require('./modules/toolbar/toolbar'),
            callbacks       = require('./modules/callbacks'),
            draw            = require('./modules/draw'),
            caret           = require('./modules/caret'),
            notifications   = require('./modules/notifications'),
            parser          = require('./modules/parser'),
            sanitizer       = require('./modules/sanitizer'),
            listeners       = require('./modules/listeners'),
            destroyer       = require('./modules/destroyer'),
            paste           = require('./modules/paste');

        this.instances['core'] = core;
        this.instances['tools'] = tools;


        console.log('Class', this);

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
