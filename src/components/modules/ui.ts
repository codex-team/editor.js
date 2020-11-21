/* eslint-disable jsdoc/no-undefined-types */
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
import * as _ from '../utils';

import Selection from '../selection';
import Block from '../block';
import Flipper from '../flipper';

/**
 * HTML Elements used for UI
 */
interface UINodes {
  holder: HTMLElement;
  wrapper: HTMLElement;
  redactor: HTMLElement;
  loader: HTMLElement;
}

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
 * @property {object} Editor         - available editor modules {@link EditorJS#moduleInstances}
 * @property {object} nodes          -
 * @property {Element} nodes.holder  - element where we need to append redactor
 * @property {Element} nodes.wrapper  - <codex-editor>
 * @property {Element} nodes.redactor - <ce-redactor>
 */
export default class UI extends Module<UINodes> {
  /**
   * Editor.js UI CSS class names
   *
   * @returns {{editorWrapper: string, editorZone: string}}
   */
  public get CSS(): {
    editorWrapper: string; editorWrapperNarrow: string; editorZone: string; editorZoneHidden: string;
    editorLoader: string; editorEmpty: string; editorRtlFix: string;
    } {
    return {
      editorWrapper: 'codex-editor',
      editorWrapperNarrow: 'codex-editor--narrow',
      editorZone: 'codex-editor__redactor',
      editorZoneHidden: 'codex-editor__redactor--hidden',
      editorLoader: 'codex-editor__loader',
      editorEmpty: 'codex-editor--empty',
      editorRtlFix: 'codex-editor--rtl',
    };
  }

  /**
   * Return Width of center column of Editor
   *
   * @returns {DOMRect}
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
   *
   * @type {boolean}
   */
  public isMobile = false;

  /**
   * Cache for center column rectangle info
   * Invalidates on window resize
   *
   * @type {DOMRect}
   */
  private contentRectCache: DOMRect = undefined;

  /**
   * Handle window resize only when it finished
   *
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
    this.make();

    /**
     * Loader for rendering process
     */
    this.addLoader();

    /**
     * Append SVG sprite
     */
    this.appendSVGSprite();

    /**
     * Load and append CSS
     */
    this.loadStyles();
  }

  /**
   * Toggle read-only state
   *
   * If readOnly is true:
   *  - removes all listeners from main UI module elements
   *
   * if readOnly is false:
   *  - enables all listeners to UI module elements
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    /**
     * Prepare components based on read-only state
     */
    if (!readOnlyEnabled) {
      /**
       * Unbind all events
       */
      this.enableModuleBindings();
    } else {
      /**
       * Bind events for the UI elements
       */
      this.disableModuleBindings();
    }
  }

  /**
   * Check if Editor is empty and set CSS class to wrapper
   */
  public checkEmptiness(): void {
    const { BlockManager } = this.Editor;

    this.nodes.wrapper.classList.toggle(this.CSS.editorEmpty, BlockManager.isEditorEmpty);
  }

  /**
   * Check if one of Toolbar is opened
   * Used to prevent global keydowns (for example, Enter) conflicts with Enter-on-toolbar
   *
   * @returns {boolean}
   */
  public get someToolbarOpened(): boolean {
    const { Toolbox, BlockSettings, InlineToolbar, ConversionToolbar } = this.Editor;

    return BlockSettings.opened || InlineToolbar.opened || ConversionToolbar.opened || Toolbox.opened;
  }

  /**
   * Check for some Flipper-buttons is under focus
   */
  public get someFlipperButtonFocused(): boolean {
    return Object.entries(this.Editor).filter(([moduleName, moduleClass]) => {
      return moduleClass.flipper instanceof Flipper;
    })
      .some(([moduleName, moduleClass]) => {
        return moduleClass.flipper.currentItem;
      });
  }

  /**
   * Clean editor`s UI
   */
  public destroy(): void {
    this.nodes.holder.innerHTML = '';
  }

  /**
   * Close all Editor's toolbars
   */
  public closeAllToolbars(): void {
    const { Toolbox, BlockSettings, InlineToolbar, ConversionToolbar } = this.Editor;

    BlockSettings.close();
    InlineToolbar.close();
    ConversionToolbar.close();
    Toolbox.close();
  }

  /**
   * Check for mobile mode and cache a result
   */
  private checkIsMobile(): void {
    this.isMobile = window.innerWidth < 650;
  }

  /**
   * Makes Editor.js interface
   */
  private make(): void {
    /**
     * Element where we need to append Editor.js
     *
     * @type {Element}
     */
    this.nodes.holder = $.getHolder(this.config.holder);

    /**
     * Create and save main UI elements
     */
    this.nodes.wrapper = $.make('div', [
      this.CSS.editorWrapper,
      ...(this.isRtl ? [ this.CSS.editorRtlFix ] : []),
    ]);
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const styles = require('../../styles/main.css');
    const styleTagId = 'editor-js-styles';

    /**
     * Do not append styles again if they are already on the page
     */
    if ($.get(styleTagId)) {
      return;
    }

    /**
     * Make tag
     */
    const tag = $.make('style', null, {
      id: styleTagId,
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
  private enableModuleBindings(): void {
    this.readOnlyMutableListeners.on(this.nodes.redactor, 'click', (event: MouseEvent) => {
      this.redactorClicked(event);
    }, false);

    this.readOnlyMutableListeners.on(this.nodes.redactor, 'mousedown', (event: MouseEvent | TouchEvent) => {
      this.documentTouched(event);
    }, true);

    this.readOnlyMutableListeners.on(this.nodes.redactor, 'touchstart', (event: MouseEvent | TouchEvent) => {
      this.documentTouched(event);
    }, true);

    this.readOnlyMutableListeners.on(document, 'keydown', (event: KeyboardEvent) => {
      this.documentKeydown(event);
    }, true);

    this.readOnlyMutableListeners.on(document, 'click', (event: MouseEvent) => {
      this.documentClicked(event);
    }, true);

    /**
     * Handle selection change to manipulate Inline Toolbar appearance
     */
    this.readOnlyMutableListeners.on(document, 'selectionchange', (event: Event) => {
      this.selectionChanged(event);
    }, true);

    this.readOnlyMutableListeners.on(window, 'resize', () => {
      this.resizeDebouncer();
    }, {
      passive: true,
    });
  }

  /**
   * Unbind events on the Editor.js interface
   */
  private disableModuleBindings(): void {
    this.readOnlyMutableListeners.clearAll();
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
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  private documentKeydown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case _.keyCodes.ENTER:
        this.enterPressed(event);
        break;

      case _.keyCodes.BACKSPACE:
        this.backspacePressed(event);
        break;

      case _.keyCodes.ESC:
        this.escapePressed(event);
        break;

      default:
        this.defaultBehaviour(event);
        break;
    }
  }

  /**
   * Ignore all other document's keydown events
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  private defaultBehaviour(event: KeyboardEvent): void {
    const { currentBlock } = this.Editor.BlockManager;
    const keyDownOnEditor = (event.target as HTMLElement).closest(`.${this.CSS.editorWrapper}`);
    const isMetaKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

    /**
     * When some block is selected, but the caret is not set inside the editor, treat such keydowns as keydown on selected block.
     */
    if (currentBlock !== undefined && keyDownOnEditor === null) {
      this.Editor.BlockEvents.keydown(event);

      return;
    }

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
  }

  /**
   * @param {KeyboardEvent} event - keyboard event
   */
  private backspacePressed(event: KeyboardEvent): void {
    const { BlockManager, BlockSelection, Caret } = this.Editor;

    /**
     * If any block selected and selection doesn't exists on the page (that means no other editable element is focused),
     * remove selected blocks
     */
    if (BlockSelection.anyBlockSelected && !Selection.isSelectionExists) {
      const selectionPositionIndex = BlockManager.removeSelectedBlocks();

      Caret.setToBlock(BlockManager.insertDefaultBlockAtIndex(selectionPositionIndex, true), Caret.positions.START);

      /** Clear selection */
      BlockSelection.clearSelection(event);

      /**
       * Stop propagations
       * Manipulation with BlockSelections is handled in global backspacePress because they may occur
       * with CMD+A or RectangleSelection and they can be handled on document event
       */
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  /**
   * Escape pressed
   * If some of Toolbar components are opened, then close it otherwise close Toolbar
   *
   * @param {Event} event - escape keydown event
   */
  private escapePressed(event): void {
    /**
     * Clear blocks selection by ESC
     */
    this.Editor.BlockSelection.clearSelection(event);

    if (this.Editor.Toolbox.opened) {
      this.Editor.Toolbox.close();
    } else if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    } else if (this.Editor.ConversionToolbar.opened) {
      this.Editor.ConversionToolbar.close();
    } else if (this.Editor.InlineToolbar.opened) {
      this.Editor.InlineToolbar.close();
    } else {
      this.Editor.Toolbar.close();
    }
  }

  /**
   * Enter pressed on document
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  private enterPressed(event: KeyboardEvent): void {
    const { BlockManager, BlockSelection } = this.Editor;
    const hasPointerToBlock = BlockManager.currentBlockIndex >= 0;

    /**
     * If any block selected and selection doesn't exists on the page (that means no other editable element is focused),
     * remove selected blocks
     */
    if (BlockSelection.anyBlockSelected && !Selection.isSelectionExists) {
      /** Clear selection */
      BlockSelection.clearSelection(event);

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
    if (!this.someToolbarOpened && hasPointerToBlock && (event.target as HTMLElement).tagName === 'BODY') {
      /**
       * Insert the default typed Block
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

    this.Editor.BlockSelection.clearSelection(event);
  }

  /**
   * All clicks on document
   *
   * @param {MouseEvent} event - Click event
   */
  private documentClicked(event: MouseEvent): void {
    /**
     * Sometimes we emulate click on some UI elements, for example by Enter on Block Settings button
     * We don't need to handle such events, because they handled in other place.
     */
    if (!event.isTrusted) {
      return;
    }
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
      this.Editor.ConversionToolbar.close();
    }

    /**
     * Clear Selection if user clicked somewhere
     */
    if (!this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted) {
      this.Editor.BlockSelection.clearSelection(event);
    }
  }

  /**
   * First touch on editor
   * Fired before click
   *
   * Used to change current block — we need to do it before 'selectionChange' event.
   * Also:
   * - Move and show the Toolbar
   * - Set a Caret
   *
   * @param {MouseEvent | TouchEvent} event - touch or mouse event
   */
  private documentTouched(event: MouseEvent | TouchEvent): void {
    let clickedNode = event.target as HTMLElement;

    /**
     * If click was fired is on Editor`s wrapper, try to get clicked node by elementFromPoint method
     */
    if (clickedNode === this.nodes.redactor) {
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

      clickedNode = document.elementFromPoint(clientX, clientY) as HTMLElement;
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

    /**
     * Move and open toolbar
     */
    this.Editor.Toolbar.open();

    /**
     * Hide the Plus Button
     */
    this.Editor.Toolbar.plusButton.hide();
  }

  /**
   * All clicks on the redactor zone
   *
   * @param {MouseEvent} event - click event
   *
   * @description
   * - By clicks on the Editor's bottom zone:
   *      - if last Block is empty, set a Caret to this
   *      - otherwise, add a new empty Block and set a Caret to that
   */
  private redactorClicked(event: MouseEvent): void {
    if (!Selection.isCollapsed) {
      return;
    }

    const stopPropagation = (): void => {
      event.stopImmediatePropagation();
      event.stopPropagation();
    };

    /**
     * case when user clicks on anchor element
     * if it is clicked via ctrl key, then we open new window with url
     */
    const element = event.target as Element;
    const ctrlKey = event.metaKey || event.ctrlKey;

    if ($.isAnchor(element) && ctrlKey) {
      stopPropagation();

      const href = element.getAttribute('href');
      const validUrl = _.getValidUrl(href);

      _.openTab(validUrl);

      return;
    }

    if (!this.Editor.BlockManager.currentBlock) {
      stopPropagation();

      this.Editor.BlockManager.insert();
    }

    /**
     * Show the Plus Button if:
     * - Block is an default-block (Text)
     * - Block is empty
     */
    const isDefaultBlock = this.Editor.Tools.isDefault(this.Editor.BlockManager.currentBlock.tool);

    if (isDefaultBlock) {
      stopPropagation();

      /**
       * Check isEmpty only for paragraphs to prevent unnecessary tree-walking on Tools with many nodes (for ex. Table)
       */
      const isEmptyBlock = this.Editor.BlockManager.currentBlock.isEmpty;

      if (isEmptyBlock) {
        this.Editor.Toolbar.plusButton.show();
      }
    }
  }

  /**
   * Handle selection changes on mobile devices
   * Uses for showing the Inline Toolbar
   *
   * @param {Event} event - selection event
   */
  private selectionChanged(event: Event): void {
    const { CrossBlockSelection, BlockSelection } = this.Editor;
    const focusedElement = Selection.anchorElement;

    if (CrossBlockSelection.isCrossBlockSelectionStarted) {
      // Removes all ranges when any Block is selected
      if (BlockSelection.anyBlockSelected) {
        Selection.get().removeAllRanges();
      }
    }

    /**
     * Event can be fired on clicks at the Editor elements, for example, at the Inline Toolbar
     * We need to skip such firings
     */
    if (!focusedElement || !focusedElement.closest(`.${Block.CSS.content}`)) {
      /**
       * If new selection is not on Inline Toolbar, we need to close it
       */
      if (!this.Editor.InlineToolbar.containsNode(focusedElement)) {
        this.Editor.InlineToolbar.close();
      }

      return;
    }

    /**
     * Set current block when entering to Editor.js by tab key
     */
    if (!this.Editor.BlockManager.currentBlock) {
      this.Editor.BlockManager.setCurrentBlockByChildNode(focusedElement);
    }

    /**
     * @todo add debounce
     */
    this.Editor.InlineToolbar.tryToShow(true);
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
