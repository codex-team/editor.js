/**
 * Codex Editor UI module
 *
 * @author Codex Team
 * @version 1.1.3
 */

module.exports = (function (ui) {

    let editor = codex.editor;

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
         * @const {String} - Block with anchor
         */
        BLOCK_WITH_ANCHOR : 'ce-block--anchor',

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
            redactor,
            blockButtons,
            blockSettings,
            showSettingsButton,
            showTrashButton,
            toolbox,
            plusButton;

        /** Make editor wrapper */
        wrapper = editor.draw.wrapper();

        /** Append editor wrapper after initial textarea */
        editor.core.insertAfter(editor.nodes.textarea, wrapper);

        /** Append block with notifications to the document */
        editor.notifications.createHolder();

        /** Make toolbar and content-editable redactor */
        toolbar               = editor.draw.toolbar();
        toolbarContent        = editor.draw.toolbarContent();
        plusButton            = editor.draw.plusButton();
        showSettingsButton    = editor.draw.settingsButton();
        showTrashButton       = editor.toolbar.settings.makeRemoveBlockButton();
        blockSettings         = editor.draw.blockSettings();
        blockButtons          = editor.draw.blockButtons();
        toolbox               = editor.draw.toolbox();
        redactor              = editor.draw.redactor();

        /** settings */
        var defaultSettings = editor.draw.defaultSettings(),
            pluginSettings  = editor.draw.pluginsSettings();

        /** Add default and plugins settings */
        blockSettings.appendChild(pluginSettings);
        blockSettings.appendChild(defaultSettings);

        /** Make blocks buttons
         * This block contains settings button and remove block button
         */
        blockButtons.appendChild(showSettingsButton);
        blockButtons.appendChild(showTrashButton);
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
        editor.nodes.wrapper            = wrapper;
        editor.nodes.toolbar            = toolbar;
        editor.nodes.plusButton         = plusButton;
        editor.nodes.toolbox            = toolbox;
        editor.nodes.blockSettings      = blockSettings;
        editor.nodes.pluginSettings     = pluginSettings;
        editor.nodes.defaultSettings    = defaultSettings;
        editor.nodes.showSettingsButton = showSettingsButton;
        editor.nodes.showTrashButton    = showTrashButton;

        editor.nodes.redactor = redactor;

        /** Make container for inline toolbar */
        editor.ui.makeInlineToolbar();

        /** fill in default settings */
        editor.toolbar.settings.addDefaultSettings();

    };

    ui.makeInlineToolbar = function () {

        var container = editor.draw.inlineToolbar();

        /** Append to redactor new inline block */
        editor.nodes.inlineToolbar.wrapper = container;

        /** Draw toolbar buttons */
        editor.nodes.inlineToolbar.buttons = editor.draw.inlineToolbarButtons();

        /** Buttons action or settings */
        editor.nodes.inlineToolbar.actions = editor.draw.inlineToolbarActions();

        /** Append to inline toolbar buttons as part of it */
        editor.nodes.inlineToolbar.wrapper.appendChild(editor.nodes.inlineToolbar.buttons);
        editor.nodes.inlineToolbar.wrapper.appendChild(editor.nodes.inlineToolbar.actions);

        editor.nodes.wrapper.appendChild(editor.nodes.inlineToolbar.wrapper);

    };

    /**
     * @private
     * Append tools passed in editor.tools
     */
    ui.addTools = function () {

        var tool,
            toolName,
            toolButton;

        for ( toolName in editor.settings.tools ) {

            tool = editor.settings.tools[toolName];

            editor.tools[toolName] = tool;

            if (!tool.iconClassname && tool.displayInToolbox) {

                editor.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', toolName);
                continue;

            }

            if (typeof tool.render != 'function') {

                editor.core.log('render method missed. Tool %o skipped', 'warn', toolName);
                continue;

            }

            if (!tool.displayInToolbox) {

                continue;

            } else {

                /** if tools is for toolbox */
                toolButton = editor.draw.toolbarButton(toolName, tool.iconClassname);

                editor.nodes.toolbox.appendChild(toolButton);

                editor.nodes.toolbarButtons[toolName] = toolButton;

            }

        }

        /**
         * Add inline toolbar tools
         */
        editor.ui.addInlineToolbarTools();


    };

    ui.addInlineToolbarTools = function () {

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
                command : 'createLink'
            }
        };

        var toolButton,
            tool;

        for(var name in tools) {

            tool = tools[name];

            toolButton = editor.draw.toolbarButtonInline(name, tool.icon);

            editor.nodes.inlineToolbar.buttons.appendChild(toolButton);
            /**
             * Add callbacks to this buttons
             */
            editor.ui.setInlineToolbarButtonBehaviour(toolButton, tool.command);

        }

    };

    /**
     * @private
     * Bind editor UI events
     */
    ui.bindEvents = function () {

        editor.core.log('ui.bindEvents fired', 'info');

        // window.addEventListener('error', function (errorMsg, url, lineNumber) {
        //     editor.notifications.errorThrown(errorMsg, event);
        // }, false );

        /** All keydowns on Document */
        editor.listeners.add(document, 'keydown', editor.callback.globalKeydown, false);

        /** All keydowns on Redactor zone */
        editor.listeners.add(editor.nodes.redactor, 'keydown', editor.callback.redactorKeyDown, false);

        /** All keydowns on Document */
        editor.listeners.add(document, 'keyup', editor.callback.globalKeyup, false );

        /**
         * Mouse click to radactor
         */
        editor.listeners.add(editor.nodes.redactor, 'click', editor.callback.redactorClicked, false );

        /**
         * Clicks to the Plus button
         */
        editor.listeners.add(editor.nodes.plusButton, 'click', editor.callback.plusButtonClicked, false);

        /**
         * Clicks to SETTINGS button in toolbar
         */
        editor.listeners.add(editor.nodes.showSettingsButton, 'click', editor.callback.showSettingsButtonClicked, false );

        /**
         *  @deprecated ( but now in use for syncronization );
         *  Any redactor changes: keyboard input, mouse cut/paste, drag-n-drop text
         */
        // editor.nodes.redactor.addEventListener('input', editor.callback.redactorInputEvent, false );

        /** Bind click listeners on toolbar buttons */
        for (var button in editor.nodes.toolbarButtons) {

            editor.listeners.add(editor.nodes.toolbarButtons[button], 'click', editor.callback.toolbarButtonClicked, false);

        }

    };

    ui.addBlockHandlers = function (block) {

        if (!block) return;

        /**
         * Block keydowns
         */
        editor.listeners.add(block, 'keydown', editor.callback.blockKeydown, false);

        /**
         * Pasting content from another source
         * We have two type of sanitization
         * First - uses deep-first search algorithm to get sub nodes,
         * sanitizes whole Block_content and replaces cleared nodes
         * This method is deprecated
         * Method is used in editor.callback.blockPaste(event)
         *
         * Secont - uses Mutation observer.
         * Observer "observe" DOM changes and send changings to callback.
         * Callback gets changed node, not whole Block_content.
         * Inserted or changed node, which we've gotten have been cleared and replaced with diry node
         *
         * Method is used in editor.callback.blockPasteViaSanitize(event)
         *
         * @uses html-janitor
         * @example editor.callback.blockPasteViaSanitize(event), the second method.
         *
         */
        editor.listeners.add(block, 'paste', editor.callback.blockPasteCallback, false);

        editor.listeners.add(block, 'mouseup', editor.toolbar.inline.show, false);

    };

    /** getting all contenteditable elements */
    ui.saveInputs = function () {

        var redactor = editor.nodes.redactor;

        /** Save all inputs in global variable state */
        editor.state.inputs = redactor.querySelectorAll('[contenteditable], input:not([type="button"]):not([type="submit"]):not([type="reset"]), textarea');

    };

    /**
     * Adds first initial block on empty redactor
     */
    ui.addInitialBlock = function () {

        var initialBlockType = editor.settings.initialBlockPlugin,
            initialBlock;

        if ( !editor.tools[initialBlockType] ) {

            editor.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
            return;

        }

        initialBlock = editor.tools[initialBlockType].render();

        initialBlock.setAttribute('data-placeholder', 'Расскажите свою историю...');

        editor.content.insertBlock({
            type  : initialBlockType,
            block : initialBlock
        });

        editor.content.workingNodeChanged(initialBlock);

    };

    ui.setInlineToolbarButtonBehaviour = function (button, type) {

        editor.listeners.add(button, 'mousedown', function (event) {

            editor.toolbar.inline.toolClicked(event, type);

        }, false);

    };

    return ui;

})({});