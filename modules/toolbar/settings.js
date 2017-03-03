/**
 * Toolbar settings
 *
 * @version 1.0.4
 */

module.exports = (function (settings) {

    let editor = codex.editor;

    settings.opened = false;

    settings.setting = null;
    settings.actions = null;

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
            editor.nodes.pluginSettings.innerHTML = `Плагин «${toolType}» не имеет настроек`;

        } else {

            /**
             * Draw settings block
             */
            var settingsBlock = editor.tools[toolType].makeSettings();

            editor.nodes.pluginSettings.appendChild(settingsBlock);

        }

        /** Open settings block */
        editor.nodes.blockSettings.classList.add('opened');
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
     * Here we will draw buttons and add listeners to components
     */
    settings.makeRemoveBlockButton = function () {

        var removeBlockWrapper  = editor.draw.node('SPAN', 'ce-toolbar__remove-btn', {}),
            settingButton = editor.draw.node('SPAN', 'ce-toolbar__remove-setting', { innerHTML : '<i class="ce-icon-trash"></i>' }),
            actionWrapper = editor.draw.node('DIV', 'ce-toolbar__remove-confirmation', {}),
            confirmAction = editor.draw.node('DIV', 'ce-toolbar__remove-confirm', { textContent : 'Удалить блок' }),
            cancelAction  = editor.draw.node('DIV', 'ce-toolbar__remove-cancel', { textContent : 'Отмена' });

        editor.listeners.add(settingButton, 'click', editor.toolbar.settings.removeButtonClicked, false);

        editor.listeners.add(confirmAction, 'click', editor.toolbar.settings.confirmRemovingRequest, false);

        editor.listeners.add(cancelAction, 'click', editor.toolbar.settings.cancelRemovingRequest, false);

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