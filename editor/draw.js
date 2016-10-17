/**
 * Creates HTML elements
 *
 * @author Codex team
 * @version 1.0.0
 */

var draw = (function() {

    /**
     * @protected
     *
     * Base editor wrapper
     */
    var wrapper = function () {

        var wrapper = document.createElement('div');

        wrapper.className += 'ce_wrapper';

        return wrapper;

    };

    /**
     * @protected
     *
     * Content-editable holder
     */
    var redactor = function () {

        var redactor = document.createElement('div');

        redactor.className += 'ce_redactor';

        return redactor;

    };

    /**
     * @protected
     *
     * Empty toolbar with toggler
     */
    var toolbar = function () {

        var bar = document.createElement('div');

        bar.className += 'ce_toolbar';

        return bar;
    };

    /**
     * @protected
     *
     * Block with notifications
     */
    var alertsHolder = function() {

        var block = document.createElement('div');

        block.classList.add('ce_notifications-block');

        return block;

    };

    /**
     * @protected
     *
     */
    var blockButtons = function() {

        var block = document.createElement('div');

        block.className += 'ce_block_blockButtons';

        return block;
    };

    /**
     * @protected
     *
     * Block settings panel
     */
    var blockSettings = function () {

        var settings = document.createElement('div');

        settings.className += 'ce_block_settings';

        return settings;
    };

    /**
     * @protected
     *
     */
    var plusButton = function() {

        var button = document.createElement('span');

        button.className = 'ce_redactor_plusButton';

        button.innerHTML = '<i class="ce-icon-plus"></i>';

        return button;
    };

    /**
     * @protected
     *
     */
    var removeBlockButton = function() {

        var toggler = document.createElement('span');

        toggler.className = 'trash-toggler';

        toggler.innerHTML = '<i class="remove_btn ce-icon-trash"></i>';

        return toggler;

    };

    /**
     * @protected
     *
     * Settings button in toolbar
     */
    var settingsButton = function () {

        var toggler = document.createElement('span');

        toggler.className = 'toggler';

        /** Toggler button*/
        toggler.innerHTML = '<i class="settings_btn ce-icon-cog"></i>';

        return toggler;
    };

    /**
     * @protected
     *
     * Redactor tools wrapper
     */
    var toolbox = function() {

        var wrapper = document.createElement('div');

        wrapper.className = 'ce_redactor_tools';

        return wrapper;
    };

    /**
     * @protected
     *
     * Toolbar button
     */
    var toolbarButton = function (type, classname) {

        var button     = document.createElement("li"),
            tool_icon  = document.createElement("i"),
            tool_title = document.createElement("span");

        button.dataset.type = type;

        tool_icon.classList.add(classname);

        tool_title.innerHTML = type;
        tool_title.classList.add('ce_toolbar_tools--title');

        button.appendChild(tool_icon);
        button.appendChild(tool_title);

        return button;

    };

    /**
     * @protected
     *
     * Redactor block
     */
    var block = function (tagName, content) {

        var node = document.createElement(tagName);

        node.innerHTML = content || '';

        return node;

    };

    return {
        wrapper             : wrapper,
        redactor            : redactor,
        toolbar             : toolbar,
        alertsHolder        : alertsHolder,
        blockButtons        : blockButtons,
        blockSettings       : blockSettings,
        plusButton          : plusButton,
        removeBlockButton   : removeBlockButton,
        settingsButton      : settingsButton,
        toolbox             : toolbox,
        toolbarButton       : toolbarButton,
        block               : block
    };

})();

module.exports = draw;