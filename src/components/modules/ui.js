/**
 * Module UI
 *
 * @type {UI}
 */
// let className = {

/**
     * @const {string} BLOCK_CLASSNAME - redactor blocks name
     */
// BLOCK_CLASSNAME : 'ce-block',

/**
     * @const {String} wrapper for plugins content
     */
// BLOCK_CONTENT : 'ce-block__content',

/**
     * @const {String} BLOCK_STRETCHED - makes block stretched
     */
// BLOCK_STRETCHED : 'ce-block--stretched',

/**
     * @const {String} BLOCK_HIGHLIGHTED - adds background
     */
// BLOCK_HIGHLIGHTED : 'ce-block--focused',

/**
     * @const {String} - for all default settings
     */
// SETTINGS_ITEM : 'ce-settings__item'
// };

let CSS = {
    editorWrapper : 'codex-editor',
    editorZone    : 'ce-redactor'
};


import $ from '../dom';


/**
 * @class
 *
 * @classdesc Makes CodeX Editor UI:
 *                <codex-editor>
 *                    <ce-redactor />
 *                    <ce-toolbar />
 *                    <ce-inline-toolbar />
 *                </codex-editor>
 *
 * @property {EditorConfig} config   - editor configuration {@link CodexEditor#configuration}
 * @property {Object} Editor         - available editor modules {@link CodexEditor#moduleInstances}
 * @property {Object} nodes          -
 * @property {Element} nodes.wrapper  - element where we need to append redactor
 * @property {Element} nodes.wrapper  - <codex-editor>
 * @property {Element} nodes.redactor - <ce-redactor>
 */
class UI {

    /**
     * @constructor
     *
     * @param  {EditorConfig} config
     */
    constructor({ config }) {

        this.config = config;
        this.Editor = null;

        this.nodes = {
            holder: null,
            wrapper: null,
            redactor: null
        };

    }


    /**
     * Editor modules setter
     * @param {object} Editor - available editor modules
     */
    set state(Editor) {

        this.Editor = Editor;

    }

    /**
     * @protected
     *
     * Making main interface
     */
    prepare() {

        return new Promise( (resolve, reject) => {

            /**
             * Element where we need to append CodeX Editor
             * @type {Element}
             */
            this.nodes.holder = document.getElementById(this.config.holderId);

            if (!this.nodes.holder) {

                reject(Error("Holder wasn't found by ID: #" + this.config.holderId));
                return;

            }

            /**
             * Create and save main UI elements
             */
            this.nodes.wrapper  = $.make('div', CSS.editorWrapper);
            this.nodes.redactor = $.make('div', CSS.editorZone);

            this.nodes.wrapper.appendChild(this.nodes.redactor);
            this.nodes.holder.appendChild(this.nodes.wrapper);

            /**
             * Make toolbar
             */
            this.Editor.Toolbar.make();

            /**
             * Load and append CSS
             */
            this.loadStyles();

            resolve();

        })

        /** Add toolbox tools */
        // .then(addTools_)

        /** Make container for inline toolbar */
        // .then(makeInlineToolbar_)

        /** Add inline toolbar tools */
        // .then(addInlineToolbarTools_)

        /** Draw wrapper for notifications */
        // .then(makeNotificationHolder_)

        /** Add eventlisteners to redactor elements */
        // .then(bindEvents_)

            .catch(e => {

                console.error(e);

            // editor.core.log("Can't draw editor interface");

            });

    }

    loadStyles() {

        /**
         * Load CSS
         */
        let styles = require('../../styles/main.css');

        /**
         * Make tag
         */
        let tag = $.make('style', null, {
            textContent: styles.toString()
        });

        /**
         * Append styles
         */
        $.append(document.head, tag);

    }

}

module.exports = UI;


// /**
//  * Codex Editor UI module
//  *
//  * @author Codex Team
//  * @version 1.2.0
//  */
//
// module.exports = (function (ui) {
//
//     let editor = codex.editor;
//
//     /**
//      * Basic editor classnames
//      */
//     ui.prepare = function () {
//

//
//     };
//
//     /** Draw notifications holder */
//     var makeNotificationHolder_ = function () {
//
//         /** Append block with notifications to the document */
//         editor.nodes.notifications = editor.notifications.createHolder();
//
//     };
//
//     /**
//      * @private
//      * Append tools passed in editor.tools
//      */
//     var addTools_ = function () {
//
//         var tool,
//             toolName,
//             toolButton;
//
//         for ( toolName in editor.settings.tools ) {
//
//             tool = editor.settings.tools[toolName];
//
//             editor.tools[toolName] = tool;
//
//             if (!tool.iconClassname && tool.displayInToolbox) {
//
//                 editor.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', toolName);
//                 continue;
//
//             }
//
//             if (typeof tool.render != 'function') {
//
//                 editor.core.log('render method missed. Tool %o skipped', 'warn', toolName);
//                 continue;
//
//             }
//
//             if (!tool.displayInToolbox) {
//
//                 continue;
//
//             } else {
//
//                 /** if tools is for toolbox */
//                 toolButton = editor.draw.toolbarButton(toolName, tool.iconClassname);
//
//                 editor.nodes.toolbox.appendChild(toolButton);
//
//                 editor.nodes.toolbarButtons[toolName] = toolButton;
//
//             }
//
//         }
//
//     };
//
//     var addInlineToolbarTools_ = function () {
//
//         var tools = {
//
//             bold: {
//                 icon    : 'ce-icon-bold',
//                 command : 'bold'
//             },
//
//             italic: {
//                 icon    : 'ce-icon-italic',
//                 command : 'italic'
//             },
//
//             link: {
//                 icon    : 'ce-icon-link',
//                 command : 'createLink'
//             }
//         };
//
//         var toolButton,
//             tool;
//
//         for(var name in tools) {
//
//             tool = tools[name];
//
//             toolButton = editor.draw.toolbarButtonInline(name, tool.icon);
//
//             editor.nodes.inlineToolbar.buttons.appendChild(toolButton);
//             /**
//              * Add callbacks to this buttons
//              */
//             editor.ui.setInlineToolbarButtonBehaviour(toolButton, tool.command);
//
//         }
//
//     };
//
//     /**
//      * @private
//      * Bind editor UI events
//      */
//     var bindEvents_ = function () {
//
//         editor.core.log('ui.bindEvents fired', 'info');
//
//         // window.addEventListener('error', function (errorMsg, url, lineNumber) {
//         //     editor.notifications.errorThrown(errorMsg, event);
//         // }, false );
//
//         /** All keydowns on Document */
//         editor.listeners.add(document, 'keydown', editor.callback.globalKeydown, false);
//
//         /** All keydowns on Redactor zone */
//         editor.listeners.add(editor.nodes.redactor, 'keydown', editor.callback.redactorKeyDown, false);
//
//         /** All keydowns on Document */
//         editor.listeners.add(document, 'keyup', editor.callback.globalKeyup, false );
//
//         /**
//          * Mouse click to radactor
//          */
//         editor.listeners.add(editor.nodes.redactor, 'click', editor.callback.redactorClicked, false );
//
//         /**
//          * Clicks to the Plus button
//          */
//         editor.listeners.add(editor.nodes.plusButton, 'click', editor.callback.plusButtonClicked, false);
//
//         /**
//          * Clicks to SETTINGS button in toolbar
//          */
//         editor.listeners.add(editor.nodes.showSettingsButton, 'click', editor.callback.showSettingsButtonClicked, false );
//
//         /** Bind click listeners on toolbar buttons */
//         for (var button in editor.nodes.toolbarButtons) {
//
//             editor.listeners.add(editor.nodes.toolbarButtons[button], 'click', editor.callback.toolbarButtonClicked, false);
//
//         }
//
//     };
//
//     ui.addBlockHandlers = function (block) {
//
//         if (!block) return;
//
//         /**
//          * Block keydowns
//          */
//         editor.listeners.add(block, 'keydown', editor.callback.blockKeydown, false);
//
//         /**
//          * Pasting content from another source
//          * We have two type of sanitization
//          * First - uses deep-first search algorithm to get sub nodes,
//          * sanitizes whole Block_content and replaces cleared nodes
//          * This method is deprecated
//          * Method is used in editor.callback.blockPaste(event)
//          *
//          * Secont - uses Mutation observer.
//          * Observer "observe" DOM changes and send changings to callback.
//          * Callback gets changed node, not whole Block_content.
//          * Inserted or changed node, which we've gotten have been cleared and replaced with diry node
//          *
//          * Method is used in editor.callback.blockPasteViaSanitize(event)
//          *
//          * @uses html-janitor
//          * @example editor.callback.blockPasteViaSanitize(event), the second method.
//          *
//          */
//         editor.listeners.add(block, 'paste', editor.paste.blockPasteCallback, false);
//
//         /**
//          * Show inline toolbar for selected text
//          */
//         editor.listeners.add(block, 'mouseup', editor.toolbar.inline.show, false);
//         editor.listeners.add(block, 'keyup', editor.toolbar.inline.show, false);
//
//     };
//
//     /** getting all contenteditable elements */
//     ui.saveInputs = function () {
//
//         var redactor = editor.nodes.redactor;
//
//         editor.state.inputs = [];
//
//         /** Save all inputs in global variable state */
//         var inputs = redactor.querySelectorAll('[contenteditable], input, textarea');
//
//         Array.prototype.map.call(inputs, function (current) {
//
//             if (!current.type || current.type == 'text' || current.type == 'textarea') {
//
//                 editor.state.inputs.push(current);
//
//             }
//
//         });
//
//     };
//
//     /**
//      * Adds first initial block on empty redactor
//      */
//     ui.addInitialBlock = function () {
//
//         var initialBlockType = editor.settings.initialBlockPlugin,
//             initialBlock;
//
//         if ( !editor.tools[initialBlockType] ) {
//
//             editor.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
//             return;
//
//         }
//
//         initialBlock = editor.tools[initialBlockType].render();
//
//         initialBlock.setAttribute('data-placeholder', editor.settings.placeholder);
//
//         editor.content.insertBlock({
//             type  : initialBlockType,
//             block : initialBlock
//         });
//
//         editor.content.workingNodeChanged(initialBlock);
//
//     };
//
//     ui.setInlineToolbarButtonBehaviour = function (button, type) {
//
//         editor.listeners.add(button, 'mousedown', function (event) {
//
//             editor.toolbar.inline.toolClicked(event, type);
//
//         }, false);
//
//     };
//
//     return ui;
//
// })({});
