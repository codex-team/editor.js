/**
 * Codex Editor Draw module
 *
 * @author Codex Team
 * @version 1.0.
 */

module.exports = (function () {

    let draw = {};

    /**
     * Base editor wrapper
     */
    draw.wrapper = function () {

        var wrapper = document.createElement('div');

        wrapper.className += 'codex-editor';

        return wrapper;

    };

    /**
     * Content-editable holder
     */
    draw.redactor = function () {

        var redactor = document.createElement('div');

        redactor.className += 'ce-redactor';

        return redactor;

    };

    draw.ceBlock = function () {

        var block = document.createElement('DIV');

        block.className += 'ce_block';

        return block;

    };

    /**
     * Empty toolbar with toggler
     */
    draw.toolbar = function () {

        var bar = document.createElement('div');

        bar.className += 'ce-toolbar';

        return bar;

    };

    draw.toolbarContent = function () {

        var wrapper = document.createElement('DIV');

        wrapper.classList.add('ce-toolbar__content');

        return wrapper;

    };

    /**
     * Inline toolbar
     */
    draw.inlineToolbar = function () {

        var bar = document.createElement('DIV');

        bar.className += 'ce-toolbar-inline';

        return bar;

    };

    /**
     * Wrapper for inline toobar buttons
     */
    draw.inlineToolbarButtons = function () {

        var wrapper = document.createElement('DIV');

        wrapper.className += 'ce-toolbar-inline__buttons';

        return wrapper;

    };

    /**
     * For some actions
     */
    draw.inlineToolbarActions = function () {

        var wrapper = document.createElement('DIV');

        wrapper.className += 'ce-toolbar-inline__actions';

        return wrapper;

    };

    draw.inputForLink = function () {

        var input = document.createElement('INPUT');

        input.type        = 'input';
        input.className  += 'inputForLink';
        input.placeholder = 'Вставьте ссылку ...';
        input.setAttribute('form', 'defaultForm');

        input.setAttribute('autofocus', 'autofocus');

        return input;

    };

    /**
     * @todo Desc
     */
    draw.blockButtons = function () {

        var block = document.createElement('div');

        block.className += 'ce-toolbar__actions';

        return block;

    };

    /**
     * Block settings panel
     */
    draw.blockSettings = function () {

        var settings = document.createElement('div');

        settings.className += 'ce-settings';

        return settings;

    };

    draw.defaultSettings = function () {

        var div = document.createElement('div');

        div.classList.add('ce-settings_default');

        return div;

    };

    draw.pluginsSettings = function () {

        var div = document.createElement('div');

        div.classList.add('ce-settings_plugin');

        return div;

    };

    draw.plusButton = function () {

        var button = document.createElement('span');

        button.className = 'ce-toolbar__plus';
        // button.innerHTML = '<i class="ce-icon-plus"></i>';

        return button;

    };

    /**
     * Settings button in toolbar
     */
    draw.settingsButton = function () {

        var toggler = document.createElement('span');

        toggler.className = 'ce-toolbar__settings-btn';

        /** Toggler button*/
        toggler.innerHTML = '<i class="ce-icon-cog"></i>';

        return toggler;

    };

    /**
     * Redactor tools wrapper
     */

    draw.toolbox = function () {

        var wrapper = document.createElement('div');

        wrapper.className = 'ce-toolbar__tools';

        return wrapper;

    };

    /**
     * @protected
     *
     * Draws tool buttons for toolbox
     *
     * @param {String} type
     * @param {String} classname
     * @returns {Element}
     */
    draw.toolbarButton = function (type, classname) {

        var button     = document.createElement('li'),
            toolIcon  = document.createElement('i'),
            toolTitle = document.createElement('span');

        button.dataset.type = type;
        button.setAttribute('title', type);

        toolIcon.classList.add(classname);
        toolTitle.classList.add('ce_toolbar_tools--title');


        button.appendChild(toolIcon);
        button.appendChild(toolTitle);

        return button;

    };

    /**
     * @protected
     *
     * Draws tools for inline toolbar
     *
     * @param {String} type
     * @param {String} classname
     */
    draw.toolbarButtonInline = function (type, classname) {

        var button     = document.createElement('BUTTON'),
            toolIcon  = document.createElement('I');

        button.type = 'button';
        button.dataset.type = type;
        toolIcon.classList.add(classname);

        button.appendChild(toolIcon);

        return button;

    };

    /**
     * Redactor block
     */
    draw.block = function (tagName, content) {

        var node = document.createElement(tagName);

        node.innerHTML = content || '';

        return node;

    };

    /**
     * Creates Node with passed tagName and className
     * @param {string}  tagName
     * @param {string} className
     * @param {object} properties - allow to assign properties
     */
    draw.node = function ( tagName, className, properties ) {

        var el = document.createElement( tagName );

        if ( className ) el.className = className;

        if ( properties ) {

            for (var name in properties) {

                el[name] = properties[name];

            }

        }

        return el;

    };

    /**
    * Unavailable plugin block
    */
    draw.unavailableBlock = function () {

        var wrapper = document.createElement('DIV');

        wrapper.classList.add('cdx-unavailable-block');

        return wrapper;

    };

    return draw;

});