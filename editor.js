var codex = (function(codex){

    var init = function() {

        require('./modules/core');
        require('./modules/ui');
        require('./modules/transport');
        require('./modules/renderer');
        require('./modules/saver');

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

        // Prepare editor settings
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



