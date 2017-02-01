/**
 * Toolbar settings
 *
 * @version 1.0.4
 */

let editor = codex.editor;

var settings = (function (settings) {

    settings.init = function () {

        require('../content');

    };

    settings.opened = false;

    settings.setting = null;
    settings.actions = null;

    settings.cover = null;

    /**
     * Append and open settings
     */
    settings.open = function (toolType) {

        /**
         * Append settings content
         * It's stored in tool.settings
         */
        if (!editor.tools[toolType] || !editor.tools[toolType].makeSettings ) {

            editor.core.log(`Plugin «${toolType}» has no settings`, 'warn');
            // editor.nodes.pluginSettings.innerHTML = `Плагин «${toolType}» не имеет настроек`;

        } else {

            /**
             * Draw settings block
             */
            var settingsBlock = editor.tools[toolType].makeSettings();

            editor.nodes.pluginSettings.appendChild(settingsBlock);

        }

        var currentBlock = editor.content.currentNode;

        /** Open settings block */
        editor.nodes.blockSettings.classList.add('opened');
        editor.toolbar.settings.addDefaultSettings();
        this.opened = true;

    };

    /**
     * Close and clear settings
     */
    settings.close = function () {

        editor.nodes.blockSettings.classList.remove('opened');
        editor.nodes.pluginSettings.innerHTML = '';

        this.opened = false;

    };

    /**
     * @param {string} toolType - plugin type
     */
    settings.toggle = function ( toolType ) {

        if ( !this.opened ) {

            this.open(toolType);

        } else {

            this.close();

        }

    };

    /**
     * This function adds default core settings
     */
    settings.addDefaultSettings = function () {

        /** list of default settings */
        var feedModeToggler;

        /** Clear block and append initialized settings */
        editor.nodes.defaultSettings.innerHTML = '';


        /** Init all default setting buttons */
        feedModeToggler = editor.toolbar.settings.makeFeedModeToggler();

        /**
         * Fill defaultSettings
         */

        /**
         * Button that enables/disables Feed-mode
         * Feed-mode means that block will be showed in articles-feed like cover
         */
        editor.nodes.defaultSettings.appendChild(feedModeToggler);

    };

    /**
     * Cover setting.
     * This tune highlights block, so that it may be used for showing target block on main page
     * Draw different setting when block is marked for main page
     * If TRUE, then we show button that removes this selection
     * Also defined setting "Click" events will be listened and have separate callbacks
     *
     * @return {Element} node/button that we place in default settings block
     */
    settings.makeFeedModeToggler = function () {

        var isFeedModeActivated = editor.toolbar.settings.isFeedModeActivated(),
            setting,
            data;

        if (!isFeedModeActivated) {

            data = {
                innerHTML : '<i class="ce-icon-newspaper"></i>Вывести в ленте'
            };

        } else {

            data = {
                innerHTML : '<i class="ce-icon-newspaper"></i>Не выводить в ленте'
            };

        }

        setting = editor.draw.node('DIV', editor.ui.className.SETTINGS_ITEM, data);
        setting.addEventListener('click', editor.toolbar.settings.updateFeedMode, false);

        return setting;

    };

    /**
     * Updates Feed-mode
     */
    settings.updateFeedMode = function () {

        var currentNode = editor.content.currentNode;

        currentNode.classList.toggle(editor.ui.className.BLOCK_IN_FEED_MODE);

        editor.toolbar.settings.close();

    };

    settings.isFeedModeActivated = function () {

        var currentBlock = editor.content.currentNode;

        if (currentBlock) {

            return currentBlock.classList.contains(editor.ui.className.BLOCK_IN_FEED_MODE);

        } else {

            return false;

        }

    };

    /**
     * Here we will draw buttons and add listeners to components
     */
    settings.makeRemoveBlockButton = function () {

        var removeBlockWrapper  = editor.draw.node('SPAN', 'ce-toolbar__remove-btn', {}),
            settingButton = editor.draw.node('SPAN', 'ce-toolbar__remove-setting', { innerHTML : '<i class="ce-icon-trash"></i>' }),
            actionWrapper = editor.draw.node('DIV', 'ce-toolbar__remove-confirmation', {}),
            confirmAction = editor.draw.node('DIV', 'ce-toolbar__remove-confirm', { textContent : 'Удалить блок' }),
            cancelAction  = editor.draw.node('DIV', 'ce-toolbar__remove-cancel', { textContent : 'Отмена' });

        settingButton.addEventListener('click', editor.toolbar.settings.removeButtonClicked, false);

        confirmAction.addEventListener('click', editor.toolbar.settings.confirmRemovingRequest, false);

        cancelAction.addEventListener('click', editor.toolbar.settings.cancelRemovingRequest, false);

        actionWrapper.appendChild(confirmAction);
        actionWrapper.appendChild(cancelAction);

        removeBlockWrapper.appendChild(settingButton);
        removeBlockWrapper.appendChild(actionWrapper);

        /** Save setting */
        editor.toolbar.settings.setting = settingButton;
        editor.toolbar.settings.actions = actionWrapper;

        return removeBlockWrapper;

    };

    settings.removeButtonClicked = function () {

        var action = editor.toolbar.settings.actions;

        if (action.classList.contains('opened')) {

            editor.toolbar.settings.hideRemoveActions();

        } else {

            editor.toolbar.settings.showRemoveActions();

        }

        editor.toolbar.toolbox.close();
        editor.toolbar.settings.close();

    };

    settings.cancelRemovingRequest = function () {

        editor.toolbar.settings.actions.classList.remove('opened');

    };

    settings.confirmRemovingRequest = function () {

        var currentBlock = editor.content.currentNode,
            firstLevelBlocksCount;

        currentBlock.remove();

        firstLevelBlocksCount = editor.nodes.redactor.childNodes.length;

        /**
         * If all blocks are removed
         */
        if (firstLevelBlocksCount === 0) {

            /** update currentNode variable */
            editor.content.currentNode = null;

            /** Inserting new empty initial block */
            editor.ui.addInitialBlock();

        }

        editor.ui.saveInputs();

        editor.toolbar.close();

    };

    settings.showRemoveActions = function () {

        editor.toolbar.settings.actions.classList.add('opened');

    };

    settings.hideRemoveActions = function () {

        editor.toolbar.settings.actions.classList.remove('opened');

    };

    return settings;

})({});

settings.init();

module.exports = settings;