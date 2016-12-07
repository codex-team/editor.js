var codex = require('../../editor');

var settings = (function(settings) {

    settings.init = function() {
        require('../content');
    };

    settings.opened = false;

    settings.setting = null;
    settings.actions = null;

    settings.cover = null;

    /**
     * Append and open settings
     */
    settings.open = function(toolType){

        /**
         * Append settings content
         * It's stored in tool.settings
         */
        if (!codex.tools[toolType] || !codex.core.isDomNode(codex.tools[toolType].settings) ) {

            codex.core.log(`Plugin «${toolType}» has no settings`, 'warn');
            // codex.nodes.pluginSettings.innerHTML = `Плагин «${toolType}» не имеет настроек`;

        } else {

            codex.nodes.pluginSettings.appendChild(codex.tools[toolType].settings);

        }

        var currentBlock = codex.content.currentNode;

        /** Open settings block */
        codex.nodes.blockSettings.classList.add('opened');
        codex.toolbar.settings.addDefaultSettings();
        this.opened = true;
    };

    /**
     * Close and clear settings
     */
    settings.close = function(){

        codex.nodes.blockSettings.classList.remove('opened');
        codex.nodes.pluginSettings.innerHTML = '';

        this.opened = false;

    };

    /**
     * @param {string} toolType - plugin type
     */
    settings.toggle = function( toolType ){

        if ( !this.opened ){

            this.open(toolType);

        } else {

            this.close();

        }

    };

    /**
     * This function adds default core settings
     */
    settings.addDefaultSettings = function() {

        /** list of default settings */
        var feedModeToggler;

        /** Clear block and append initialized settings */
        codex.nodes.defaultSettings.innerHTML = '';


        /** Init all default setting buttons */
        feedModeToggler = codex.toolbar.settings.makeFeedModeToggler();

        /**
         * Fill defaultSettings
         */

        /**
         * Button that enables/disables Feed-mode
         * Feed-mode means that block will be showed in articles-feed like cover
         */
        codex.nodes.defaultSettings.appendChild(feedModeToggler);

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
    settings.makeFeedModeToggler = function() {

        var isFeedModeActivated = codex.toolbar.settings.isFeedModeActivated(),
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

        setting = codex.draw.node('DIV', codex.ui.className.SETTINGS_ITEM, data);
        setting.addEventListener('click', codex.toolbar.settings.updateFeedMode, false);

        return setting;
    };

    /**
     * Updates Feed-mode
     */
    settings.updateFeedMode = function() {

        var currentNode = codex.content.currentNode;

        currentNode.classList.toggle(codex.ui.className.BLOCK_IN_FEED_MODE);

        codex.toolbar.settings.close();
    };

    settings.isFeedModeActivated = function() {

        var currentBlock = codex.content.currentNode;

        if (currentBlock) {
            return currentBlock.classList.contains(codex.ui.className.BLOCK_IN_FEED_MODE);
        } else {
            return false;
        }
    };

    /**
     * Here we will draw buttons and add listeners to components
     */
    settings.makeRemoveBlockButton = function() {

        var removeBlockWrapper  = codex.draw.node('SPAN', 'ce-toolbar__remove-btn', {}),
            settingButton = codex.draw.node('SPAN', 'ce-toolbar__remove-setting', { innerHTML : '<i class="ce-icon-trash"></i>' }),
            actionWrapper = codex.draw.node('DIV', 'ce-toolbar__remove-confirmation', {}),
            confirmAction = codex.draw.node('DIV', 'ce-toolbar__remove-confirm', { textContent : 'Удалить блок' }),
            cancelAction  = codex.draw.node('DIV', 'ce-toolbar__remove-cancel', { textContent : 'Отменить удаление' });

        settingButton.addEventListener('click', codex.toolbar.settings.removeButtonClicked, false);

        confirmAction.addEventListener('click', codex.toolbar.settings.confirmRemovingRequest, false);

        cancelAction.addEventListener('click', codex.toolbar.settings.cancelRemovingRequest, false);

        actionWrapper.appendChild(confirmAction);
        actionWrapper.appendChild(cancelAction);

        removeBlockWrapper.appendChild(settingButton);
        removeBlockWrapper.appendChild(actionWrapper);

        /** Save setting */
        codex.toolbar.settings.setting = settingButton;
        codex.toolbar.settings.actions = actionWrapper;

        return removeBlockWrapper;

    };

    settings.removeButtonClicked = function() {

        var action = codex.toolbar.settings.actions;

        if (action.classList.contains('opened')) {
            codex.toolbar.settings.hideRemoveActions();
        } else {
            codex.toolbar.settings.showRemoveActions();
        }

        codex.toolbar.toolbox.close();
        codex.toolbar.settings.close();

    };

    settings.cancelRemovingRequest = function() {

        codex.toolbar.settings.actions.classList.remove('opened');
    };

    settings.confirmRemovingRequest = function() {

        var currentBlock = codex.content.currentNode,
            firstLevelBlocksCount;

        currentBlock.remove();

        firstLevelBlocksCount = codex.nodes.redactor.childNodes.length;

        /**
         * If all blocks are removed
         */
        if (firstLevelBlocksCount === 0) {

            /** update currentNode variable */
            codex.content.currentNode = null;

            /** Inserting new empty initial block */
            codex.ui.addInitialBlock();
        }

        codex.ui.saveInputs();

        codex.toolbar.close();
    };

    settings.showRemoveActions = function() {
        codex.toolbar.settings.actions.classList.add('opened');
    };

    settings.hideRemoveActions = function() {
        codex.toolbar.settings.actions.classList.remove('opened');
    };

    return settings;

})({});

settings.init();

module.exports = settings;