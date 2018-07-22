/**
 * Module UI
 *
 * @type {UI}
 */

/**
 * Prebuilded sprite of SVG icons
 */
import sprite from '../../../build/sprite.svg';
import Selection from '../selection';

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
  async prepare() {
    await this.make();

    /**
     * Append SVG sprite
     */
    await this.appendSVGSprite();

    /**
     * Make toolbar
     */
    await this.Editor.Toolbar.make();

    /**
     * Make the Inline toolbar
     */
    await this.Editor.InlineToolbar.make();

    /**
     * Load and append CSS
     */
    await this.loadStyles();

    /**
     * Bind events for the UI elements
     */
    await this.bindEvents();
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
  async make() {
    /**
     * Element where we need to append CodeX Editor
     * @type {Element}
     */
    this.nodes.holder = document.getElementById(this.config.holderId);

    if (!this.nodes.holder) {
      throw Error("Holder wasn't found by ID: #" + this.config.holderId);
    }

    /**
     * Create and save main UI elements
     */
    this.nodes.wrapper  = $.make('div', this.CSS.editorWrapper);
    this.nodes.redactor = $.make('div', this.CSS.editorZone);

    this.nodes.wrapper.appendChild(this.nodes.redactor);
    this.nodes.holder.appendChild(this.nodes.wrapper);
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
    this.Editor.Listeners.on(this.nodes.redactor, 'click', event => this.redactorClicked(event), false );
    this.Editor.Listeners.on(document, 'keydown', event => this.documentKeydown(event), true );
    this.Editor.Listeners.on(document, 'click', event => this.documentClicked(event), false );
  }

  /**
   * All keydowns on document
   * @param {Event} event
   */
  documentKeydown(event) {
    switch (event.keyCode) {
      case _.keyCodes.ENTER:
        this.enterPressed(event);
        break;
      default:
        this.defaultBehaviour(event);
        break;
    }
  }

  /**
   * Ignore all other document's keydown events
   * @param {KeyboardEvent} event
   */
  defaultBehaviour(event) {
    const keyDownOnEditor = event.target.closest(`.${this.CSS.editorWrapper}`);

    /**
     * Ignore keydowns on document
     * clear pointer and close toolbar
     */
    if (!keyDownOnEditor) {
      /**
       * Remove all highlights and remove caret
       */
      this.Editor.BlockManager.dropPointer();

      /**
       * Close Toolbar
       */
      this.Editor.Toolbar.close();
    }
  }

  /**
   * Enter pressed on document
   * @param event
   */
  enterPressed(event) {
    let hasPointerToBlock = this.Editor.BlockManager.currentBlockIndex >= 0;

    /**
     * If Selection is out of Editor and document has some selection
     */
    if (!Selection.isAtEditor && Selection.anchorNode) {
      return;
    }

    /**
     * If there is no selection (caret is not placed) and BlockManager points some to Block
     */
    if (hasPointerToBlock && !Selection.anchorNode) {
      /**
       * Insert initial typed Block
       */
      this.Editor.BlockManager.insert();
      this.Editor.BlockManager.highlightCurrentNode();

      /**
       * Move toolbar and show plus button because new Block is empty
       */
      this.Editor.Toolbar.move();
      this.Editor.Toolbar.plusButton.show();
    }
  }

  /**
   * All clicks on document
   * @param {MouseEvent} event - Click
   */
  documentClicked(event) {
    /**
     * Close Inline Toolbar when nothing selected
     * Do not fire check on clicks at the Inline Toolbar buttons
     */
    const clickedOnInlineToolbarButton = event.target.closest(`.${this.Editor.InlineToolbar.CSS.inlineToolbar}`);
    const clickedInsideofEditor = event.target.closest(`.${this.CSS.editorWrapper}`);

    /** Clear highlightings and pointer on BlockManager */
    if (!clickedInsideofEditor) {
      this.Editor.BlockManager.dropPointer();
      this.Editor.Toolbar.close();
    }

    if (!clickedOnInlineToolbarButton) {
      this.Editor.InlineToolbar.handleShowingEvent(event);
    }
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
      /**
       * Renew Current Block
       */
      this.Editor.BlockManager.setCurrentBlockByChildNode(clickedNode);

      /**
       * Highlight Current Node
       */
      this.Editor.BlockManager.highlightCurrentNode();
    } catch (e) {
      /**
       * If clicked outside first-level Blocks, set Caret to the last empty Block
       */
      this.Editor.Caret.setToTheLastBlock();
    }

    /**
     * Move toolbar and open
     */
    this.Editor.Toolbar.move();
    this.Editor.Toolbar.open();

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
