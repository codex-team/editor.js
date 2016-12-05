var codex = (function(codex){

    var init = function() {

        require('./modules/core');
        require('./modules/ui');
        require('./modules/transport');
        require('./modules/renderer');
        require('./modules/saver');
        require('./modules/content');
        require('./modules/toolbar/toolbar');
        require('./modules/tools');
        require('./modules/callbacks');
        require('./modules/draw');
        require('./modules/caret');
        require('./modules/notifications');
        require('./modules/parser');
    };

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
        blockSettings     : null,
        pluginSettings    : null,
        defaultSettings   : null,
        toolbarButtons    : {}, // { type : DomEl, ... }
        redactor          : null
    };

    /**
     * @public
     *
     * Output state
     */
    codex.state = {
        jsonOutput: [],
        blocks    : [],
        inputs    : []
    };

    /**
     * Initialization
     * @uses Promise cEditor.core.prepare
     * @param {} userSettings are :
     *          - tools [],
     *          - textareaId String
     *          ...
     */
    codex.start = function (userSettings) {

        init();

        /**
         * Load user defined tools
         * Tools must contain this important objects :
         *  @param {String} Type - this is a type of plugin. It can be used as plugin name
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
         *
         */
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



