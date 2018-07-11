/**
 * Module UI
 *
 * @type {UI}
 */

/**
 * Prebuilded sprite of SVG icons
 */
import sprite from '../../../build/sprite.svg';

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
 * @typedef {UI} UI
 * @property {EditorConfig} config   - editor configuration {@link CodexEditor#configuration}
 * @property {Object} Editor         - available editor modules {@link CodexEditor#moduleInstances}
 * @property {Object} nodes          -
 * @property {Element} nodes.holder  - element where we need to append redactor
 * @property {Element} nodes.wrapper  - <codex-editor>
 * @property {Element} nodes.redactor - <ce-redactor>
 */
export default class UI extends Module {
  /**
   * @constructor
   *
   * @param  {EditorConfig} config
   */
  constructor({config}) {
    super({config});

    this.nodes = {
      holder: null,
      wrapper: null,
      redactor: null
    };
  }

  /**
   * Making main interface
   */
  prepare() {
    return this.make()
      /**
       * Append SVG sprite
       */
      .then(() => this.appendSVGSprite())
      /**
       * Make toolbar
       */
      .then(() => this.Editor.Toolbar.make())
      /**
       * Make the Inline toolbar
       */
      .then(() => this.Editor.InlineToolbar.make())
      /**
       * Load and append CSS
       */
      .then(() => this.loadStyles())
      /**
       * Bind events for the UI elements
       */
      .then(() => this.bindEvents())

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

  /**
     * CodeX Editor UI CSS class names
     * @return {{editorWrapper: string, editorZone: string, block: string}}
     */
  get CSS() {
    return {
      editorWrapper : 'codex-editor',
      editorZone    : 'codex-editor__redactor',
    };
  }

  /**
     * Makes CodeX Editor interface
     * @return {Promise<any>}
     */
  make() {
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
      this.nodes.wrapper  = $.make('div', this.CSS.editorWrapper);
      this.nodes.redactor = $.make('div', this.CSS.editorZone);

      this.nodes.wrapper.appendChild(this.nodes.redactor);
      this.nodes.holder.appendChild(this.nodes.wrapper);

      resolve();
    });
  }

  /**
   * Appends CSS
   */
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

  /**
   * Bind events on the CodeX Editor interface
   */
  bindEvents() {
    /**
     * @todo bind events with the Listeners module
     */
    this.Editor.Listeners.on(this.nodes.redactor, 'click', event => this.redactorClicked(event), false );
  }

  /**
   * All clicks on the redactor zone
   *
   * @param {MouseEvent} event
   *
   * @description
   * 1. Save clicked Block as a current {@link BlockManager#currentNode}
   *      it uses for the following:
   *      - add CSS modifier for the selected Block
   *      - on Enter press, we make a new Block under that
   *
   * 2. Move and show the Toolbar
   *
   * 3. Set a Caret
   *
   * 4. By clicks on the Editor's bottom zone:
   *      - if last Block is empty, set a Caret to this
   *      - otherwise, add a new empty Block and set a Caret to that
   *
   * 5. Hide the Inline Toolbar
   *
   * @see selectClickedBlock
   *
   */
  redactorClicked(event) {
    let clickedNode = event.target;

    /**
     * Select clicked Block as Current
     */
    try {
      this.Editor.BlockManager.setCurrentBlockByChildNode(clickedNode);
    } catch (e) {
      /**
       * If clicked outside first-level Blocks, set Caret to the last empty Block
       */
      this.Editor.Caret.setToTheLastBlock();
    }


    /**
     * Close Inline Toolbar when nothing selected
     * use small delay to renew selection
     */
    setTimeout(() => {
      this.Editor.InlineToolbar.handleShowingEvent(event);
    }, 50);


    /**
         *

        /** Update current input index in memory when caret focused into existed input */
    // if (event.target.contentEditable == 'true') {
    //
    //     editor.caret.saveCurrentInputIndex();
    //
    // }

    // if (editor.content.currentNode === null) {
    //
    //     /**
    //      * If inputs in redactor does not exits, then we put input index 0 not -1
    //      */
    //     var indexOfLastInput = editor.state.inputs.length > 0 ? editor.state.inputs.length - 1 : 0;
    //
    //     /** If we have any inputs */
    //     if (editor.state.inputs.length) {
    //
    //         /** getting firstlevel parent of input */
    //         firstLevelBlock = editor.content.getFirstLevelBlock(editor.state.inputs[indexOfLastInput]);
    //
    //     }
    //
    //     /** If input is empty, then we set caret to the last input */
    //     if (editor.state.inputs.length && editor.state.inputs[indexOfLastInput].textContent === '' && firstLevelBlock.dataset.tool == editor.settings.initialBlockPlugin) {
    //
    //         editor.caret.setToBlock(indexOfLastInput);
    //
    //     } else {
    //
    //         /** Create new input when caret clicked in redactors area */
    //         var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
    //
    //         editor.content.insertBlock({
    //             type  : NEW_BLOCK_TYPE,
    //             block : editor.tools[NEW_BLOCK_TYPE].render()
    //         });
    //
    //         /** If there is no inputs except inserted */
    //         if (editor.state.inputs.length === 1) {
    //
    //             editor.caret.setToBlock(indexOfLastInput);
    //
    //         } else {
    //
    //             /** Set caret to this appended input */
    //             editor.caret.setToNextBlock(indexOfLastInput);
    //
    //         }
    //
    //     }
    //
    // } else {
    //
    //     /** Close all panels */
    //     editor.toolbar.settings.close();
    //     editor.toolbar.toolbox.close();
    //
    // }
    //
    /**
     * Move toolbar and open
     */
    this.Editor.Toolbar.move();
    this.Editor.Toolbar.open();
    //
    // var inputIsEmpty = !editor.content.currentNode.textContent.trim(),
    //     currentNodeType = editor.content.currentNode.dataset.tool,
    //     isInitialType = currentNodeType == editor.settings.initialBlockPlugin;
    //
    //

    /**
     * Hide the Plus Button
     * */
    this.Editor.Toolbar.plusButton.hide();

    /**
     * Show the Plus Button if:
     * - Block is an initial-block (Text)
     * - Block is empty
     */
    let isInitialBlock = this.Editor.Tools.isInitial(this.Editor.BlockManager.currentBlock.tool),
      isEmptyBlock = this.Editor.BlockManager.currentBlock.isEmpty;

    if (isInitialBlock && isEmptyBlock) {
      this.Editor.Toolbar.plusButton.show();
    }
  }

  /**
   * Append prebuilded sprite with SVG icons
   */
  appendSVGSprite() {
    let spriteHolder = $.make('div');

    spriteHolder.innerHTML = sprite;

    $.append(this.nodes.wrapper, spriteHolder);
  }
}

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
