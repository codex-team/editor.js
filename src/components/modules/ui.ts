/**
 * Prebuilded sprite of SVG icons
 */
import sprite from '../../../dist/sprite.svg';

/**
 * Module UI
 *
 * @type {UI}
 */
import Module from '../__module';
import $ from '../dom';
import _ from '../utils';

import Selection from '../selection';
import Block from '../block';

/**
 * @class
 *
 * @classdesc Makes Editor.js UI:
 *                <codex-editor>
 *                    <ce-redactor />
 *                    <ce-toolbar />
 *                    <ce-inline-toolbar />
 *                </codex-editor>
 *
 * @typedef {UI} UI
 * @property {EditorConfig} config   - editor configuration {@link EditorJS#configuration}
 * @property {Object} Editor         - available editor modules {@link EditorJS#moduleInstances}
 * @property {Object} nodes          -
 * @property {Element} nodes.holder  - element where we need to append redactor
 * @property {Element} nodes.wrapper  - <codex-editor>
 * @property {Element} nodes.redactor - <ce-redactor>
 */
export default class UI extends Module {

  /**
   * Editor.js UI CSS class names
   * @return {{editorWrapper: string, editorZone: string}}
   */
  public get CSS(): {
    editorWrapper: string, editorWrapperNarrow: string, editorZone: string, editorZoneHidden: string,
    editorLoader: string, editorEmpty: string,
  } {
    return {
      editorWrapper    : 'codex-editor',
      editorWrapperNarrow : 'codex-editor--narrow',
      editorZone       : 'codex-editor__redactor',
      editorZoneHidden : 'codex-editor__redactor--hidden',
      editorLoader     : 'codex-editor__loader',
      editorEmpty      : 'codex-editor--empty',
    };
  }

  /**
   * Return Width of center column of Editor
   * @return {DOMRect}
   */
  public get contentRect(): DOMRect {
    if (this.contentRectCache) {
      return this.contentRectCache;
    }

    const someBlock = this.nodes.wrapper.querySelector(`.${Block.CSS.content}`);

    /**
     * When Editor is not ready, there is no Blocks, so return the default value
     */
    if (!someBlock) {
      return {
        width: 650,
        left: 0,
        right: 0,
      } as DOMRect;
    }

    this.contentRectCache = someBlock.getBoundingClientRect() as DOMRect;

    return this.contentRectCache;
  }

  /**
   * Flag that became true on mobile viewport
   * @type {boolean}
   */
  public isMobile: boolean = false;

  /**
   * HTML Elements used for UI
   */
  public nodes: { [key: string]: HTMLElement } = {
    holder: null,
    wrapper: null,
    redactor: null,
  };

  /**
   * Cache for center column rectangle info
   * Invalidates on window resize
   * @type {DOMRect}
   */
  private contentRectCache: DOMRect = undefined;

  /**
   * Handle window resize only when it finished
   * @type {() => void}
   */
  private resizeDebouncer: () => void = _.debounce(() => {
    this.windowResize();
  }, 200);

  /**
   * Adds loader to editor while content is not ready
   */
  public addLoader(): void {
    this.nodes.loader = $.make('div', this.CSS.editorLoader);
    this.nodes.wrapper.prepend(this.nodes.loader);
    this.nodes.redactor.classList.add(this.CSS.editorZoneHidden);
  }

  /**
   * Removes loader when content has loaded
   */
  public removeLoader(): void {
    this.nodes.loader.remove();
    this.nodes.redactor.classList.remove(this.CSS.editorZoneHidden);
  }

  /**
   * Making main interface
   */
  public async prepare(): Promise<void> {
    /**
     * Detect mobile version
     */
    this.checkIsMobile();

    /**
     * Make main UI elements
     */
    await this.make();

    /**
     * Loader for rendering process
     */
    this.addLoader();

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
     * Make the Converter tool holder
     */
    await this.Editor.ConversionToolbar.make();

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
   * Check if Editor is empty and set CSS class to wrapper
   */
  public checkEmptiness(): void {
    const {BlockManager} = this.Editor;

    this.nodes.wrapper.classList.toggle(this.CSS.editorEmpty, BlockManager.isEditorEmpty);
  }

  /**
   * Clean editor`s UI
   */
  public destroy(): void {
    this.nodes.holder.innerHTML = '';
  }

  /**
   * Check for mobile mode and cache a result
   */
  private checkIsMobile() {
    this.isMobile = window.innerWidth < 650;
  }

  /**
   * Makes Editor.js interface
   * @return {Promise<void>}
   */
  private async make(): Promise<void> {
    /**
     * Element where we need to append Editor.js
     * @type {Element}
     */
    this.nodes.holder = $.getHolder(this.config.holder);

    /**
     * Create and save main UI elements
     */
    this.nodes.wrapper  = $.make('div', this.CSS.editorWrapper);
    this.nodes.redactor = $.make('div', this.CSS.editorZone);

    /**
     * If Editor has injected into the narrow container, enable Narrow Mode
     */
    if (this.nodes.holder.offsetWidth < this.contentRect.width) {
      this.nodes.wrapper.classList.add(this.CSS.editorWrapperNarrow);
    }

    /**
     * Set customizable bottom zone height
     */
    this.nodes.redactor.style.paddingBottom = this.config.minHeight + 'px';

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
   * Bind events on the Editor.js interface
   */
  private bindEvents(): void {
    this.Editor.Listeners.on(
      this.nodes.redactor,
      'click',
      (event) => this.redactorClicked(event as MouseEvent),
      false,
    );
    this.Editor.Listeners.on(document, 'keydown', (event) => this.documentKeydown(event as KeyboardEvent), true);
    this.Editor.Listeners.on(document, 'click', (event) => this.documentClicked(event as MouseEvent), true);

    /**
     * Handle selection change on mobile devices for the Inline Toolbar support
     */
    if (_.isTouchSupported()) {
      this.Editor.Listeners.on(document, 'selectionchange', (event) => {
        this.selectionChanged(event as Event);
      }, true);
    }

    this.Editor.Listeners.on(window, 'resize', () => {
      this.resizeDebouncer();
    }, {
      passive: true,
    });
  }

  /**
   * Resize window handler
   */
  private windowResize(): void {
    /**
     * Invalidate content zone size cached, because it may be changed
     */
    this.contentRectCache = null;

    /**
     * Detect mobile version
     */
    this.checkIsMobile();
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
      case _.keyCodes.BACKSPACE:
        this.backspacePressed(event);
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
    const {currentBlock} = this.Editor.BlockManager;
    const isMetaKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

    /**
     * Ignore keydowns on editor and meta keys
     */
    if (keyDownOnEditor || (currentBlock && isMetaKey)) {
      return;
    }

    /**
     * Remove all highlights and remove caret
     */
    this.Editor.BlockManager.dropPointer();

    /**
     * Close Toolbar
     */
    this.Editor.Toolbar.close();

    /**
     * Close ConversionToolbar
     */
    this.Editor.ConversionToolbar.close();
  }

  /**
   * @param {KeyboardEvent} event
   */
  private backspacePressed(event: KeyboardEvent): void {
    const {BlockManager, BlockSelection, Caret} = this.Editor;

    if (BlockSelection.anyBlockSelected) {
      const selectionPositionIndex = BlockManager.removeSelectedBlocks();
      Caret.setToBlock(BlockManager.insertAtIndex(selectionPositionIndex, true), Caret.positions.START);

      /** Clear selection */
      BlockSelection.clearSelection();

      /**
       * Stop propagations
       * Manipulation with BlockSelections is handled in global backspacePress because they may occur
       * with CMD+A or RectangleSelection and they can be handled on document event
       */
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  /**
   * Enter pressed on document
   * @param event
   */
  private enterPressed(event: KeyboardEvent): void {
    const { BlockManager, BlockSelection, Caret, BlockSettings, ConversionToolbar } = this.Editor;
    const hasPointerToBlock = BlockManager.currentBlockIndex >= 0;

    /**
     * If Block Settings is opened and have some active button
     * Enter press is fired as out of the Block and that's why
     * we handle it here
     */
    if (BlockSettings.opened && BlockSettings.focusedButton) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      /** Click on settings button */
      BlockSettings.focusedButton.click();

      /**
       * Add animation on click
       */
      BlockSettings.focusedButton.classList.add(BlockSettings.CSS.focusedButtonAnimated);

      /**
       * Remove animation class
       */
      _.delay( () => {
        BlockSettings.focusedButton.classList.remove(BlockSettings.CSS.focusedButtonAnimated);
      }, 280)();

      /**
       * Restoring focus on current Block
       *
       * After changing Block state (when settings clicked, for example)
       * Block's content points to the Node that is not in DOM, that's why we can not
       * set caret and leaf next (via Tab)
       *
       * For that set cursor via Caret module to the current Block's content
       * after some timeout
       */
      _.delay( () => {
        Caret.setToBlock(BlockManager.currentBlock);
      }, 10)();

      return;
    }

    if (ConversionToolbar.opened && ConversionToolbar.focusedButton) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      ConversionToolbar.focusedButton.click();
      return;
    }

    if (BlockSelection.anyBlockSelected) {
      const selectionPositionIndex = BlockManager.removeSelectedBlocks();
      Caret.setToBlock(BlockManager.insertAtIndex(selectionPositionIndex, true), Caret.positions.START);

      /** Clear selection */
      BlockSelection.clearSelection();

      /**
       * Stop propagations
       * Manipulation with BlockSelections is handled in global enterPress because they may occur
       * with CMD+A or RectangleSelection
       */
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      return;
    }

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

    this.Editor.BlockSelection.clearSelection();
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
    const clickedInsideOfEditor = this.nodes.holder.contains(target) || Selection.isAtEditor;

    if (!clickedInsideOfEditor) {
      /**
       * Clear highlightings and pointer on BlockManager
       *
       * Current page might contain several instances
       * Click between instances MUST clear focus, pointers and close toolbars
       */
      this.Editor.BlockManager.dropPointer();
      this.Editor.InlineToolbar.close();
      this.Editor.Toolbar.close();
      this.Editor.BlockSelection.clearSelection();
      this.Editor.ConversionToolbar.close();
    }

    if (Selection.isAtEditor) {
      /**
       * Focus clicked Block.
       * Workaround case when user clicks on the bottom of editor
       */
      if (Selection.anchorNode === this.nodes.redactor) {
        this.Editor.Caret.setToTheLastBlock();
      } else {
        this.Editor.BlockManager.setCurrentBlockByChildNode(Selection.anchorNode);
      }
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

    if (!Selection.isCollapsed) {
      return;
    }

    let clickedNode = event.target as HTMLElement;

    /**
     * If click was fired is on Editor`s wrapper, try to get clicked node by elementFromPoint method
     */
    if (clickedNode === this.nodes.redactor) {
      clickedNode = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    }

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
       * If clicked outside first-level Blocks and it is not RectSelection, set Caret to the last empty Block
       */
      if (!this.Editor.RectangleSelection.isRectActivated()) {
        this.Editor.Caret.setToTheLastBlock();
      }
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
    const isInitialBlock = this.Editor.Tools.isInitial(this.Editor.BlockManager.currentBlock.tool);

    if (isInitialBlock) {
      /**
       * Check isEmpty only for paragraphs to prevent unnecessary tree-walking on Tools with many nodes (for ex. Table)
       */
      const isEmptyBlock = this.Editor.BlockManager.currentBlock.isEmpty;

      if (isEmptyBlock) {
        this.Editor.Toolbar.plusButton.show();
      }
    }

    /** Clear selection */
    this.Editor.BlockSelection.clearSelection();
    this.Editor.ConversionToolbar.close();
  }

  /**
   * Handle selection changes on mobile devices
   * Uses for showing the Inline Toolbar
   * @param {Event} event
   */
  private selectionChanged(event: Event): void {
    const focusedElement = Selection.anchorElement as Element;

    /**
     * Event can be fired on clicks at the Editor elements, for example, at the Inline Toolbar
     * We need to skip such firings
     */
    if (!focusedElement || !focusedElement.closest(`.${Block.CSS.content}`)) {
      return;
    }

    this.Editor.InlineToolbar.handleShowingEvent(event);
  }

  /**
   * Append prebuilt sprite with SVG icons
   */
  private appendSVGSprite(): void {
    const spriteHolder = $.make('div');

    spriteHolder.hidden = true;
    spriteHolder.style.display = 'none';
    spriteHolder.innerHTML = sprite;

    $.append(this.nodes.wrapper, spriteHolder);
  }
}
