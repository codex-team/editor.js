/**
 * Toolbar settings
 *
 * @version 1.0.5
 */

module.exports = (function () {
  let settings = {};

  let editor = this;

  settings.opened = false;

  settings.setting = null;
  settings.actions = null;

    /**
     * Append and open settings
     */
  settings.open = function (tool) {
        /**
         * Append settings content
         * It's stored in tool.settings
         */
    if ( !editor.tools[tool.name] || !tool.makeSettings || typeof tool.makeSettings !== 'function') {
      return;
    }

        /**
         * Draw settings block
         */
    var settingsBlock = tool.makeSettings();

    editor.nodes.pluginSettings.appendChild(settingsBlock);


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
  settings.toggle = function ( tool ) {
    if ( !this.opened ) {
      this.open(tool);
    } else {
      this.close();
    }
  };

    /**
     * Here we will draw buttons and add listeners to components
     */
  settings.makeRemoveBlockButton = function () {
    var removeBlockWrapper  = editor.modules.draw.node('SPAN', 'ce-toolbar__remove-btn', {}),
        settingButton = editor.modules.draw.node('SPAN', 'ce-toolbar__remove-setting', { innerHTML : '<i class="ce-icon-trash"></i>' }),
        actionWrapper = editor.modules.draw.node('DIV', 'ce-toolbar__remove-confirmation', {}),
        confirmAction = editor.modules.draw.node('DIV', 'ce-toolbar__remove-confirm', { textContent : 'Удалить блок' }),
        cancelAction  = editor.modules.draw.node('DIV', 'ce-toolbar__remove-cancel', { textContent : 'Отмена' });

    editor.modules.listeners.add(settingButton, 'click', editor.modules.toolbar.settings.removeButtonClicked, false);

    editor.modules.listeners.add(confirmAction, 'click', editor.modules.toolbar.settings.confirmRemovingRequest, false);

    editor.modules.listeners.add(cancelAction, 'click', editor.modules.toolbar.settings.cancelRemovingRequest, false);

    actionWrapper.appendChild(confirmAction);
    actionWrapper.appendChild(cancelAction);

    removeBlockWrapper.appendChild(settingButton);
    removeBlockWrapper.appendChild(actionWrapper);

        /** Save setting */
    editor.modules.toolbar.settings.setting = settingButton;
    editor.modules.toolbar.settings.actions = actionWrapper;

    return removeBlockWrapper;
  };

  settings.removeButtonClicked = function () {
    var action = editor.modules.toolbar.settings.actions;

    if (action.classList.contains('opened')) {
      editor.modules.toolbar.settings.hideRemoveActions();
    } else {
      editor.modules.toolbar.settings.showRemoveActions();
    }

    editor.modules.toolbar.toolbox.close();
    editor.modules.toolbar.settings.close();
  };

  settings.cancelRemovingRequest = function () {
    editor.modules.toolbar.settings.actions.classList.remove('opened');
  };

  settings.confirmRemovingRequest = function () {
    var currentBlock = editor.modules.content.currentNode,
        firstLevelBlocksCount;

    currentBlock.remove();

    firstLevelBlocksCount = editor.nodes.redactor.childNodes.length;

        /**
         * If all blocks are removed
         */
    if (firstLevelBlocksCount === 0) {
            /** update currentNode variable */
      editor.modules.content.currentNode = null;

            /** Inserting new empty initial block */
      editor.modules.ui.addInitialBlock();
    }

    editor.modules.ui.saveInputs();

    editor.modules.toolbar.close();
  };

  settings.showRemoveActions = function () {
    editor.modules.toolbar.settings.actions.classList.add('opened');
  };

  settings.hideRemoveActions = function () {
    editor.modules.toolbar.settings.actions.classList.remove('opened');
  };

  return settings;
});
