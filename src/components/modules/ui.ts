/**
 * Module UI
 *
 * @type {UI}
 */

/**
 * Prebuilded sprite of SVG icons
 */
// tslint:disable-next-line
const sprite = require('../../../build/sprite.svg');

import Module from '../__module';
import $ from '../dom';
import _ from '../utils';

import Selection from '../selection';
import {Configuration} from '../interfaces/data-format';

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
 * @property {Configuration} config   - editor configuration {@link CodexEditor#configuration}
 * @property {Object} Editor         - available editor modules {@link CodexEditor#moduleInstances}
 * @property {Object} nodes          -
 * @property {Element} nodes.holder  - element where we need to append redactor
 * @property {Element} nodes.wrapper  - <codex-editor>
 * @property {Element} nodes.redactor - <ce-redactor>
 */
export default class UI extends Module {

  /**
   * CodeX Editor UI CSS class names
   * @return {{editorWrapper: string, editorZone: string, block: string}}
   */
  public get CSS(): {editorWrapper: string, editorZone: string} {
    return {
      editorWrapper : 'codex-editor',
      editorZone    : 'codex-editor__redactor',
    };
  }
  public nodes: {
    holder: HTMLElement,
    wrapper: HTMLElement,
    redactor: HTMLElement,
  };

  /**
   * @constructor
   *
   * @param  {Configuration} config
   */
  constructor({config}: {config: Configuration}) {
    super({config});

    this.nodes = {
      holder: null,
      wrapper: null,
      redactor: null,
    };
  }

  /**
   * Making main interface
   */
  public async prepare(): Promise<void> {
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
   * Clean editor`s UI
   */
  public destroy(): void {
    this.nodes.holder.innerHTML = '';
  }

  /**
   * Makes CodeX Editor interface
   * @return {Promise<void>}
   */
  private async make(): Promise<void> {
    /**
     * Element where we need to append CodeX Editor
     * @type {Element}
     */
    this.nodes.holder = document.getElementById(this.config.holderId);

    if (!this.nodes.holder) {
      throw Error('Holder wasn\'t found by ID: #' + this.config.holderId);
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
  private loadStyles(): void {
    /**
     * Load CSS
     */
    const styles = require('../../styles/main.css');

    /**
     * Make tag
     */
    const tag = $.make('style', null, {
      textContent: styles.toString(),
    });

    /**
     * Append styles at the top of HEAD tag
     */
    $.prepend(document.head, tag);
  }

  /**
   * Bind events on the CodeX Editor interface
   */
  private bindEvents(): void {
    this.Editor.Listeners.on(
      this.nodes.redactor,
      'click',
      (event) => this.redactorClicked(event as MouseEvent),
      false,
    );
    this.Editor.Listeners.on(document, 'keydown', (event) => this.documentKeydown(event as KeyboardEvent), true );
    this.Editor.Listeners.on(document, 'click', (event) => this.documentClicked(event as MouseEvent), false );
  }

  /**
   * All keydowns on document
   * @param {Event} event
   */
  private documentKeydown(event: KeyboardEvent): void {
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
  private defaultBehaviour(event: KeyboardEvent): void {
    const keyDownOnEditor = (event.target as HTMLElement).closest(`.${this.CSS.editorWrapper}`);

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
  private enterPressed(event: KeyboardEvent): void {
    const hasPointerToBlock = this.Editor.BlockManager.currentBlockIndex >= 0;

    /**
     * If Caret is not set anywhere, event target on Enter is always Element that we handle
     * In our case it is document.body
     *
     * So, BlockManager points some Block and Enter press is on Body
     * We can create a new block
     */
    if (hasPointerToBlock && (event.target as HTMLElement).tagName === 'BODY') {
      /**
       * Insert initial typed Block
       */
      const newBlock = this.Editor.BlockManager.insert();

      this.Editor.Caret.setToBlock(newBlock);

      /**
       * And highlight
       */
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
  private documentClicked(event: MouseEvent): void {
    /**
     * Close Inline Toolbar when nothing selected
     * Do not fire check on clicks at the Inline Toolbar buttons
     */
    const target = event.target as HTMLElement;
    const clickedOnInlineToolbarButton = target.closest(`.${this.Editor.InlineToolbar.CSS.inlineToolbar}`);
    const clickedInsideofEditor = target.closest(`.${this.CSS.editorWrapper}`);

    /** Clear highlightings and pointer on BlockManager */
    if (!clickedInsideofEditor && !Selection.isAtEditor) {
      this.Editor.BlockManager.dropPointer();
      this.Editor.Toolbar.close();
    }

    if (!clickedOnInlineToolbarButton) {
      this.Editor.InlineToolbar.handleShowingEvent(event);
    }

    if (Selection.isAtEditor) {
      this.Editor.BlockManager.setCurrentBlockByChildNode(Selection.anchorNode);
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
  private redactorClicked(event: MouseEvent): void {
    const clickedNode = event.target as HTMLElement;

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

    event.stopImmediatePropagation();
    event.stopPropagation();

    /**
     * Move and open toolbar
     */
    this.Editor.Toolbar.open();

    /**
     * Hide the Plus Button
     */
    this.Editor.Toolbar.plusButton.hide();

    if (!this.Editor.BlockManager.currentBlock) {
      this.Editor.BlockManager.insert();
    }

    /**
     * Show the Plus Button if:
     * - Block is an initial-block (Text)
     * - Block is empty
     */
    const isInitialBlock = this.Editor.Tools.isInitial(this.Editor.BlockManager.currentBlock.tool),
      isEmptyBlock = this.Editor.BlockManager.currentBlock.isEmpty;

    if (isInitialBlock && isEmptyBlock) {
      this.Editor.Toolbar.plusButton.show();
    }
  }

  /**
   * Append prebuilded sprite with SVG icons
   */
  private appendSVGSprite(): void {
    const spriteHolder = $.make('div');

    spriteHolder.hidden = true;
    spriteHolder.style.display = 'none';
    spriteHolder.innerHTML = sprite;

    $.append(this.nodes.wrapper, spriteHolder);
  }
}
