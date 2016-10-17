/**
 * @author Codex Team
 * @version 1.0.0
 *
 * Methods:
 *   - make
 *   - addTools
 *   - bindEvents
 *   - addBlockHandlers
 *   - saveInputs
 */

var ui = (function() {

    var className = {

        /**
         * @const {string} BLOCK_CLASSNAME - redactor blocks name
         */
        BLOCK_CLASSNAME : 'ce_block',

        /**
         * @const {String} BLOCK_STRETCHED - makes block stretched
         */
        BLOCK_STRETCHED : 'ce_block--stretched',

        /**
         * @const {String} BLOCK_HIGHLIGHTED - adds background
         */
        BLOCK_HIGHLIGHTED : 'ce-block__highlighted',

    };

    /**
     * @private
     *
     * Making main interface
     */
    var make = function () {

        var wrapper,
            toolbar,
            redactor,
            notifications,
            blockButtons,
            blockSettings,
            showPlusButton,
            showSettingsButton,
            showRemoveBlockButton,
            toolbox;

        /** Make editor wrapper */
        wrapper = cEditor.draw.wrapper();

        /** Append editor wrapper after initial textarea */
        cEditor.core.insertAfter(cEditor.nodes.textarea, wrapper);

        /** Append block with notifications to the document */
        notifications = cEditor.draw.alertsHolder();
        cEditor.nodes.notifications = document.body.appendChild(notifications);

        /** Make toolbar and content-editable redactor */
        toolbar               = cEditor.draw.toolbar();
        plusButton            = cEditor.draw.plusButton();
        showRemoveBlockButton = cEditor.draw.removeBlockButton();
        showSettingsButton    = cEditor.draw.settingsButton();
        blockSettings         = cEditor.draw.blockSettings();
        blockButtons          = cEditor.draw.blockButtons();
        toolbox               = cEditor.draw.toolbox();
        redactor              = cEditor.draw.redactor();

        /** Make blocks buttons
         * This block contains settings button and remove block button
         */
        blockButtons.appendChild(showSettingsButton);
        blockButtons.appendChild(blockSettings);
        blockButtons.appendChild(showRemoveBlockButton);

        /** Appending first-level block buttons */
        toolbar.appendChild(blockButtons);

        /** Append plus button */
        toolbar.appendChild(plusButton);

        /** Appending toolbar tools */
        toolbar.appendChild(toolbox);

        wrapper.appendChild(toolbar);
        wrapper.appendChild(redactor);

        /** Save created ui-elements to static nodes state */
        cEditor.nodes.wrapper            = wrapper;
        cEditor.nodes.toolbar            = toolbar;
        cEditor.nodes.plusButton         = plusButton;
        cEditor.nodes.toolbox            = toolbox;
        cEditor.nodes.removeBlockButton  = showRemoveBlockButton;
        cEditor.nodes.blockSettings      = blockSettings;
        cEditor.nodes.showSettingsButton = showSettingsButton;

        cEditor.nodes.redactor = redactor;

    };

    /**
     * @private
     *
     * Append tools passed in cEditor.tools
     */
    var addTools = function () {

        var tool,
            tool_button;

        /** Make toolbar buttons */
        for (var name in cEditor.tools){

            tool = cEditor.tools[name];

            if (!tool.iconClassname) {
                cEditor.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', name);
                continue;
            }

            if (typeof tool.make != 'function') {
                cEditor.core.log('make method missed. Tool %o skipped', 'warn', name);
                continue;
            }

            tool_button = cEditor.draw.toolbarButton(name, tool.iconClassname);

            cEditor.nodes.toolbox.appendChild(tool_button);

            /** Save tools to static nodes */
            cEditor.nodes.toolbarButtons[name] = tool_button;

        }

    };

    /**
     * @private
     *
     * Bind editor UI events
     */
    var bindEvents = function () {

        cEditor.core.log('ui.bindEvents fired', 'info');

        window.addEventListener('error', function (errorMsg, url, lineNumber) {
            cEditor.notifications.errorThrown(errorMsg, event);
        }, false );

        /** All keydowns on Document */
        document.addEventListener('keydown', function (event) {
            cEditor.callback.globalKeydown(event);
        }, false );

        /** All keydowns on Document */
        document.addEventListener('keyup', function (event) {
            cEditor.callback.globalKeyup(event);
        }, false );

        /** Mouse click to radactor */
        cEditor.nodes.redactor.addEventListener('click', function (event) {

            cEditor.callback.redactorClicked(event);

        }, false );

        /**
         * Mouse over to plus button
         */
        cEditor.nodes.plusButton.addEventListener('mouseover', cEditor.toolbar.toolbox.open, false );

        /**
         * Clicks to plus button
         */
        cEditor.nodes.plusButton.addEventListener('click', function(event) {

            cEditor.callback.plusButtonClicked();

        }, false);

        /** Clicks to SETTINGS button in toolbar */
        cEditor.nodes.showSettingsButton.addEventListener('click', function (event) {

            cEditor.callback.showSettingsButtonClicked(event);

        }, false );

        /** All Clicks to Remove tool in toolbar */
        cEditor.nodes.removeBlockButton.addEventListener('click', cEditor.callback.removeBlock, false);

        /**
         *  @deprecated;
         *  Any redactor changes: keyboard input, mouse cut/paste, drag-n-drop text
         */
        cEditor.nodes.redactor.addEventListener('input', function (event) {

            cEditor.callback.redactorInputEvent(event);

        }, false );

        /** Bind click listeners on toolbar buttons */
        for (var button in cEditor.nodes.toolbarButtons){
            cEditor.nodes.toolbarButtons[button].addEventListener('click', function (event) {
                cEditor.callback.toolbarButtonClicked(event, this);
            }, false);
        }

    };

    /**
     * @protected
     *
     * @param block
     */
    var addBlockHandlers = function(block) {

        if (!block) return;

        block.addEventListener('keydown', function(event) {

            cEditor.callback.blockKeydown(event, block);

        }, false);

        block.addEventListener('paste', function (event) {
            cEditor.callback.blockPaste(event, block);
        }, false);

    };

    /**
     * @protected
     *
     * getting all contenteditable elements
     */
    var saveInputs = function() {

        var redactor = cEditor.nodes.redactor,
            elements = [];

        /** Save all inputs in global variable state */
        cEditor.state.inputs = redactor.querySelectorAll('[contenteditable], input');
    };

    /**
     * @protected
     *
     * Adds first initial block on empty redactor
     */
    var addInitialBlock = function() {

        var initialBlockType = cEditor.settings.initialBlockPlugin,
            initialBlock;

        if ( !cEditor.tools[initialBlockType] ){
            cEditor.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
            return;
        }

        initialBlock = cEditor.tools[initialBlockType].render();

        initialBlock.setAttribute('data-placeholder', 'Write your story...');

        cEditor.content.insertBlock({
            type  : initialBlockType,
            block : initialBlock
        });

        cEditor.content.workingNodeChanged(initialBlock);

    };

    return {
        className           : className,
        make                : make,
        addTools            : addTools,
        bindEvents          : bindEvents,
        addBlockHandlers    : addBlockHandlers,
        saveInputs          : saveInputs,
        addInitialBlock     : addInitialBlock
    };

})();

module.exports = ui;