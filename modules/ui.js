var ui = (function(ui){

    /**
     * Basic editor classnames
     */
    ui.className = {

        /**
         * @const {string} BLOCK_CLASSNAME - redactor blocks name
         */
        BLOCK_CLASSNAME : 'ce-block',

            /**
             * @const {String} wrapper for plugins content
             */
            BLOCK_CONTENT : 'ce-block__content',

            /**
             * @const {String} BLOCK_STRETCHED - makes block stretched
             */
            BLOCK_STRETCHED : 'ce-block--stretched',

            /**
             * @const {String} BLOCK_HIGHLIGHTED - adds background
             */
            BLOCK_HIGHLIGHTED : 'ce-block--focused',

            /**
             * @const {String} - highlights covered blocks
             */
            BLOCK_IN_FEED_MODE : 'ce-block--feed-mode',

            /**
             * @const {String} - for all default settings
             */
            SETTINGS_ITEM : 'ce-settings__item'

    };

    /**
     * @protected
     *
     * Making main interface
     */
    ui.make = function () {

        var wrapper,
            toolbar,
            toolbarContent,
            inlineToolbar,
            redactor,
            ceBlock,
            notifications,
            blockButtons,
            blockSettings,
            showSettingsButton,
            showCommentButton,
            showTrashButton,
            toolbox,
            plusButton;

        /** Make editor wrapper */
        wrapper = codex.draw.wrapper();

        /** Append editor wrapper after initial textarea */
        codex.core.insertAfter(codex.nodes.textarea, wrapper);

        /** Append block with notifications to the document */
        notifications = codex.draw.alertsHolder();
        codex.nodes.notifications = document.body.appendChild(notifications);

        /** Make toolbar and content-editable redactor */
        toolbar               = codex.draw.toolbar();
        toolbarContent        = codex.draw.toolbarContent();
        inlineToolbar         = codex.draw.inlineToolbar();
        plusButton            = codex.draw.plusButton();
        showSettingsButton    = codex.draw.settingsButton();
        showCommentButton     = codex.draw.commentButton();
        showTrashButton       = codex.toolbar.settings.makeRemoveBlockButton();
        blockSettings         = codex.draw.blockSettings();
        blockButtons          = codex.draw.blockButtons();
        toolbox               = codex.draw.toolbox();
        redactor              = codex.draw.redactor();

        /** settings */
        var defaultSettings = codex.draw.defaultSettings(),
            pluginSettings  = codex.draw.pluginsSettings();

        /** Add default and plugins settings */
        blockSettings.appendChild(pluginSettings);
        blockSettings.appendChild(defaultSettings);

        /** Make blocks buttons
         * This block contains settings button and remove block button
         */
        blockButtons.appendChild(showSettingsButton);
        blockButtons.appendChild(showTrashButton);
        blockButtons.appendChild(showCommentButton);
        blockButtons.appendChild(blockSettings);

        /** Append plus button */
        toolbarContent.appendChild(plusButton);

        /** Appending toolbar tools */
        toolbarContent.appendChild(toolbox);

        /** Appending first-level block buttons */
        toolbar.appendChild(blockButtons);

        /** Append toolbarContent to toolbar */
        toolbar.appendChild(toolbarContent);

        wrapper.appendChild(toolbar);

        wrapper.appendChild(redactor);

        /** Save created ui-elements to static nodes state */
        codex.nodes.wrapper            = wrapper;
        codex.nodes.toolbar            = toolbar;
        codex.nodes.plusButton         = plusButton;
        codex.nodes.toolbox            = toolbox;
        codex.nodes.blockSettings      = blockSettings;
        codex.nodes.pluginSettings     = pluginSettings;
        codex.nodes.defaultSettings    = defaultSettings;
        codex.nodes.showSettingsButton = showSettingsButton;
        codex.nodes.showTrashButton    = showTrashButton;
        codex.nodes.showCommentButton  = showCommentButton;

        codex.nodes.redactor = redactor;

        codex.ui.makeInlineToolbar(inlineToolbar);

        /** fill in default settings */
        codex.toolbar.settings.addDefaultSettings();
    };

    ui.makeInlineToolbar = function(container) {

        /** Append to redactor new inline block */
        codex.nodes.inlineToolbar.wrapper = container;

        /** Draw toolbar buttons */
        codex.nodes.inlineToolbar.buttons = codex.draw.inlineToolbarButtons();

        /** Buttons action or settings */
        codex.nodes.inlineToolbar.actions = codex.draw.inlineToolbarActions();

        /** Append to inline toolbar buttons as part of it */
        codex.nodes.inlineToolbar.wrapper.appendChild(codex.nodes.inlineToolbar.buttons);
        codex.nodes.inlineToolbar.wrapper.appendChild(codex.nodes.inlineToolbar.actions);

        codex.nodes.wrapper.appendChild(codex.nodes.inlineToolbar.wrapper);
    };

    /**
     * @private
     * Append tools passed in codex.tools
     */
    ui.addTools = function () {

        var tool,
            tool_button;

        for(var name in codex.settings.tools) {
            tool = codex.settings.tools[name];
            codex.tools[name] = tool;;
        }

        /** Make toolbar buttons */
        for (var name in codex.tools){

            tool = codex.tools[name];

            if (!tool.displayInToolbox) {
                continue;
            }

            if (!tool.iconClassname) {
                codex.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', name);
                continue;
            }

            if (typeof tool.make != 'function') {
                codex.core.log('make method missed. Tool %o skipped', 'warn', name);
                continue;
            }

            /**
             * if tools is for toolbox
             */
            tool_button = codex.draw.toolbarButton(name, tool.iconClassname);

            codex.nodes.toolbox.appendChild(tool_button);

            /** Save tools to static nodes */
            codex.nodes.toolbarButtons[name] = tool_button;
        }


        /**
         * Add inline toolbar tools
         */
        codex.ui.addInlineToolbarTools();


    };

    ui.addInlineToolbarTools = function() {

        var tools = {

            bold: {
                icon    : 'ce-icon-bold',
                command : 'bold'
            },

            italic: {
                icon    : 'ce-icon-italic',
                command : 'italic'
            },

            underline: {
                icon    : 'ce-icon-underline',
                command : 'underline'
            },

            link: {
                icon    : 'ce-icon-link',
                command : 'createLink',
            }
        };

        var toolButton,
            tool;

        for(var name in tools) {

            tool = tools[name];

            toolButton = codex.draw.toolbarButtonInline(name, tool.icon);

            codex.nodes.inlineToolbar.buttons.appendChild(toolButton);
            /**
             * Add callbacks to this buttons
             */
            codex.ui.setInlineToolbarButtonBehaviour(toolButton, tool.command);
        }

    };

    /**
     * @private
     * Bind editor UI events
     */
    ui.bindEvents = function () {

        codex.core.log('ui.bindEvents fired', 'info');

        window.addEventListener('error', function (errorMsg, url, lineNumber) {
            codex.notifications.errorThrown(errorMsg, event);
        }, false );

        /** All keydowns on Document */
        codex.nodes.redactor.addEventListener('keydown', codex.callback.globalKeydown, false );

        /** All keydowns on Document */
        document.addEventListener('keyup', codex.callback.globalKeyup, false );

        /**
         * Mouse click to radactor
         */
        codex.nodes.redactor.addEventListener('click', codex.callback.redactorClicked, false );

        /**
         * Clicks to the Plus button
         */
        codex.nodes.plusButton.addEventListener('click', codex.callback.plusButtonClicked, false);

        /**
         * Clicks to SETTINGS button in toolbar
         */
        codex.nodes.showSettingsButton.addEventListener('click', codex.callback.showSettingsButtonClicked, false );

        /**
         * Clicks to COMMENT button in toolbar
         */
        codex.nodes.showCommentButton.addEventListener('click', codex.callback.showCommentButtonClicked, false );


        /**
         *  @deprecated ( but now in use for syncronization );
         *  Any redactor changes: keyboard input, mouse cut/paste, drag-n-drop text
         */
        codex.nodes.redactor.addEventListener('input', codex.callback.redactorInputEvent, false );

        /** Bind click listeners on toolbar buttons */
        for (var button in codex.nodes.toolbarButtons){
            codex.nodes.toolbarButtons[button].addEventListener('click', codex.callback.toolbarButtonClicked, false);
        }

    };

    /**
     * Initialize plugins before using
     * Ex. Load scripts or call some internal methods
     */
    ui.preparePlugins = function() {

        for(var tool in codex.tools) {

            if (typeof codex.tools[tool].prepare != 'function')
                continue;

            codex.tools[tool].prepare();
        }
    },

    ui.addBlockHandlers = function(block) {

        if (!block) return;

        /**
         * Block keydowns
         */
        block.addEventListener('keydown', function(event) {
            codex.callback.blockKeydown(event, block);
        }, false);

        /**
         * Pasting content from another source
         */
        block.addEventListener('paste', function (event) {
            codex.callback.blockPaste(event);
        }, false);

        block.addEventListener('mouseup', function(){
            codex.toolbar.inline.show();
        }, false);

    };

    /** getting all contenteditable elements */
    ui.saveInputs = function() {

        var redactor = codex.nodes.redactor,
            elements = [];

        /** Save all inputs in global variable state */
        codex.state.inputs = redactor.querySelectorAll('[contenteditable], input');
    };

    /**
     * Adds first initial block on empty redactor
     */
    ui.addInitialBlock = function(){

        var initialBlockType = codex.settings.initialBlockPlugin,
            initialBlock;

        if ( !codex.tools[initialBlockType] ){
            codex.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
            return;
        }

        initialBlock = codex.tools[initialBlockType].render();

        initialBlock.setAttribute('data-placeholder', 'Write your story...');

        codex.content.insertBlock({
            type  : initialBlockType,
            block : initialBlock
        });

        codex.content.workingNodeChanged(initialBlock);

    };

    ui.setInlineToolbarButtonBehaviour = function(button, type) {

        button.addEventListener('mousedown', function(event) {

            codex.toolbar.inline.toolClicked(event, type);

        }, false);
    };

    return ui;

})({});

module.exports = ui;