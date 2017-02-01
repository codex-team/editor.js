/**
 *
 * Codex Editor
 *
 * @author Codex Team
 * @version 1.3.0
 */

var codex = (function(codex){

    var init = function() {

        codex.core          = require('./modules/core');
        codex.ui            = require('./modules/ui');
        codex.transport     = require('./modules/transport');
        codex.renderer      = require('./modules/renderer');
        codex.saver         = require('./modules/saver');
        codex.content       = require('./modules/content');
        codex.toolbar       = require('./modules/toolbar/toolbar');
        codex.tools         = require('./modules/tools');
        codex.callback      = require('./modules/callbacks');
        codex.draw          = require('./modules/draw');
        codex.caret         = require('./modules/caret');
        codex.notifications = require('./modules/notifications');
        codex.parser        = require('./modules/parser');
        codex.sanitizer     = require('./modules/sanitizer');
        codex.comments      = require('./modules/comments');
    };

    codex.version = VERSION;

    /**
     * @public
     *
     * holds initial settings
     */
    codex.settings = {
        tools     : ['paragraph', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
        textareaId: 'codex-editor',
        uploadImagesUrl: '/editor/transport/',

        // Type of block showing on empty editor
        initialBlockPlugin: "paragraph"
    };

    /**
     * public
     *
     * Static nodes
     */
    codex.nodes = {
        textarea          : null,
        wrapper           : null,
        toolbar           : null,
        inlineToolbar     : {
            wrapper : null,
            buttons : null,
            actions : null
        },
        toolbox           : null,
        notifications     : null,
        plusButton        : null,
        showSettingsButton: null,
        showTrashButton   : null,
        showCommentButton : null,
        blockSettings     : null,
        pluginSettings    : null,
        defaultSettings   : null,
        toolbarButtons    : {}, // { type : DomEl, ... }
        redactor          : null,
        commentsSidebar   : null
    };

    /**
     * @public
     *
     * Output state
     */
    codex.state = {
        jsonOutput: [],
        blocks    : [],
        inputs    : [],
        comments  : []
    };

    /**
     * Initialization
     * @uses Promise cEditor.core.prepare
     * @param {} userSettings are :
     *          - tools [],
     *          - textareaId String
     *          ...
     *
     * Load user defined tools
     * Tools must contain this important objects :
     *  @param {String} type - this is a type of plugin. It can be used as plugin name
     *  @param {String} iconClassname - this a icon in toolbar
     *  @param {Object} make - what should plugin do, when it is clicked
     *  @param {Object} appendCallback - callback after clicking
     *  @param {Element} settings - what settings does it have
     *  @param {Object} render - plugin get JSON, and should return HTML
     *  @param {Object} save - plugin gets HTML content, returns JSON
     *  @param {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
     *  @param {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
     *
     * @example
     *   -  type             : 'header',
     *   -  iconClassname    : 'ce-icon-header',
     *   -  make             : headerTool.make,
     *   -  appendCallback   : headerTool.appendCallback,
     *   -  settings         : headerTool.makeSettings(),
     *   -  render           : headerTool.render,
     *   -  save             : headerTool.save,
     *   -  displayInToolbox : true,
     *   -  enableLineBreaks : false
     */
    codex.start = function (userSettings) {

        init();

        this.core.prepare(userSettings)

        // If all ok, make UI, bind events and parse initial-content
            .then(this.ui.make)
            .then(this.ui.addTools)
            .then(this.ui.bindEvents)
            .then(this.ui.preparePlugins)
            .then(this.transport.prepare)
            .then(this.renderer.makeBlocksFromData)
            .then(this.ui.saveInputs)
            .catch(function (error) {
                codex.core.log('Initialization failed with error: %o', 'warn', error);
            });

    };

    return codex;

})({});

module.exports = codex;



