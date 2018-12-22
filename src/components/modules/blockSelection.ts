/**
 * @class BlockSelection
 * @classdesc Manages Block selection with shortcut CMD+A and with mouse
 *
 * @module BlockSelection
 * @version 1.0.0
 */
import Module from '../__module';
import _ from '../utils';
import $ from '../dom';

import SelectionUtils from '../selection';

export default class BlockSelection extends Module {
  /**
   * CSS classes for the Block
   * @return {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      contentBlock: 'ce-block__content',
      blockSelected: 'ce-block--selected',
    };
  }

  /**
   * Sanitizer Config
   * @return {SanitizerConfig}
   */
  private get sanitizerConfig() {
    return {
      p: {},
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {},
      ol: {},
      ul: {},
      li: {},
      br: true,
      img: {
        src: true,
        width: true,
        height: true,
      },
      a: {
        href: true,
      },
      b: {},
      i: {},
      u: {},
    };
  }

  /**
   * Flag used to define block selection
   * First CMD+A defines it as true and then second CMD+A selects all Blocks
   * @type {boolean}
   */
  private needToSelectAll: boolean = false;

  /**
   * Flag used to define native input selection
   * In this case we allow double CMD+A to select Block
   * @type {boolean}
   */
  private nativeInputSelected: boolean = false;

  /**
   * SelectionUtils instance
   * @type {SelectionUtils}
   */
  private selection: SelectionUtils;

  /**
   * Using the selection rectangle
   * @type {boolean}
   */
  private rectSelection: boolean;

  private readonly scrollSpeed: number = 3;
  private mousedown: boolean = false;
  private inScrollZone: string | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private stackOfSelected: number[] = [];
  private rectCrossesBlocks: boolean;
  private overlayRectangle: HTMLDivElement;

  /**
   * Flag that identifies all Blocks selection
   * @return {boolean}
   */
  public get allBlocksSelected(): boolean {
    const {BlockManager} = this.Editor;

    return BlockManager.blocks.every((block) => block.selected === true);
  }

  /**
   * Set selected all blocks
   * @param {boolean} state
   */
  public set allBlocksSelected(state: boolean) {
    const {BlockManager} = this.Editor;

    BlockManager.blocks.forEach((block) => block.selected = state);
  }

  /**
   * Flag that identifies any Block selection
   * @return {boolean}
   */
  public get anyBlockSelected(): boolean {
    const {BlockManager} = this.Editor;

    return BlockManager.blocks.some((block) => block.selected === true);
  }

  /**
   * Module Preparation
   * Registers Shortcuts CMD+A and CMD+C
   * to select all and copy them
   */
  public prepare(): void {
    const {Shortcuts, Listeners} = this.Editor;

    /** Selection shortcut */
    Shortcuts.add({
      name: 'CMD+A',
      handler: (event) => {
        this.handleCommandA(event);
      },
    });

    /** Shortcut to copy selected blocks */
    Shortcuts.add({
      name: 'CMD+C',
      handler: (event) => {
        this.handleCommandC(event);
      },
    });

    this.selection = new SelectionUtils();

    /** Mouse Selection */
    const overlay = $.make('div', 'codex-editor-overlay', {});
    const overlayContainer = $.make('div', 'codex-editor-overlay__container', {});
    const overlayRectangle = $.make('div', 'codex-editor-overlay__rectangle', {});
    const overlayTopScrollZone = $.make('div', 'codex-editor-overlay__scroll-zone--top', {});
    const overlayBottomScrollZone = $.make('div', 'codex-editor-overlay__scroll-zone--bottom', {});

    overlayContainer.appendChild(overlayRectangle);
    overlay.appendChild(overlayContainer);
    overlay.appendChild(overlayTopScrollZone);
    overlay.appendChild(overlayBottomScrollZone);
    document.body.appendChild(overlay);

    this.overlayRectangle = overlayRectangle as HTMLDivElement;

    Listeners.on(overlayBottomScrollZone, 'mouseenter', (event) => {
      this.inScrollZone = 'bot';
      this.scrollVertical(this.scrollSpeed);
    });

    Listeners.on(overlayTopScrollZone, 'mouseenter', (event) => {
      this.inScrollZone = 'top';
      this.scrollVertical(-this.scrollSpeed);
    });

    Listeners.on(overlayBottomScrollZone, 'mouseleave', (event) => {
      this.inScrollZone = null;
    });

    Listeners.on(overlayTopScrollZone, 'mouseleave', (event) => {
      this.inScrollZone = null;
    });

    Listeners.on(document.body, 'mousedown', (event: MouseEvent) => {
      this.handleStartRectSelection(event);
    }, false);

    Listeners.on(document.body, 'mousemove', (event) => {
      this.handleRectSelection(event);
    }, false);

    Listeners.on(window, 'scroll', (event) => {
      this.handleRectSelection(event);
    }, false);

    Listeners.on(document.body, 'mouseup', (event) => {
      this.mousedown = false;
      this.overlayRectangle.style.display = 'none';

      this.startX = 0;
      this.startY = 0;
    }, false);
  }

  /**
   * Clear selection from Blocks
   */
  public clearSelection(restoreSelection = false) {
    this.needToSelectAll = false;
    this.nativeInputSelected = false;

    if (!this.anyBlockSelected || this.rectSelection) {
      this.rectSelection = false;
      return;
    }

    /**
     * restore selection when Block is already selected
     * but someone tries to write something.
     */
    if (restoreSelection) {
      this.selection.restore();
    }

    /** Now all blocks cleared */
    this.allBlocksSelected = false;
  }

  // TODO START

  private handleRectSelection(event) {
    if (!this.mousedown) {
      return;
    }
    event.preventDefault();
    this.rectSelection = true;
    if (event.pageY !== undefined) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }

    this.updateSizeOfRectangle(event);

    const info = this.genInfoForMouseSelection();
    if (info.index === -1) {
      return;
    }

    if ((this.startX < info.leftPos && this.mouseX < info.leftPos) ||
      (this.startX > info.rightPos && this.mouseX > info.rightPos)) {
      this.rectCrossesBlocks = false;
    } else {
      this.rectCrossesBlocks = true;
    }

    this.handleNextBlock(info);
    this.correctSelection();
  }

  private correctSelection() {
    const firstBlockInStack = this.Editor.BlockManager.getBlockByIndex(this.stackOfSelected[0]);
    const isSelected = firstBlockInStack.holder.classList.contains(BlockSelection.CSS.blockSelected);

    if (this.rectCrossesBlocks && !isSelected) {
      for (let i = 0; i < this.stackOfSelected.length; i++) {
        this.selectBlockByIndex(this.stackOfSelected[i]);
      }
    }

    if (!this.rectCrossesBlocks && isSelected) {
      for (let i = 0; i < this.stackOfSelected.length; i++) {
        this.unSelectBlockByIndex(this.stackOfSelected[i]);
      }
    }
  }

  private handleNextBlock(info) {
    if (this.stackOfSelected[this.stackOfSelected.length - 1] === info.index) {
      return;
    }

    console.log(this.stackOfSelected);

    const sizeStack = this.stackOfSelected.length;
    let direction;
    if (this.stackOfSelected.length <= 1) {
      direction = 0; // undefined
    } else if (this.stackOfSelected[sizeStack - 1] - this.stackOfSelected[sizeStack - 2] > 0) {
      direction = 1; // down
    } else {
      direction = -1; // up
    }

    let reduction;
    if ((info.index > this.stackOfSelected[sizeStack - 1] && direction === 1) ||
      (info.index < this.stackOfSelected[sizeStack - 1] && direction === -1) || direction === 0) {
      reduction = false;
    } else {
      reduction = true;
    }

    console.log(reduction);

    if (!reduction && (info.index > this.stackOfSelected[sizeStack - 1] || this.stackOfSelected[sizeStack - 1] === undefined)) {
      console.log('1');
      let i = this.stackOfSelected[sizeStack - 1] + 1 || info.index;
      for (i; i <= info.index; i++) {
        if (this.rectCrossesBlocks) {
          this.selectBlockByIndex(i);
        }
        this.stackOfSelected.push(i);
      }
      return;
    }

    if (!reduction && (info.index < this.stackOfSelected[sizeStack - 1])) {
      console.log('2');
      for (let i = this.stackOfSelected[sizeStack - 1] - 1; i >= info.index; i--) {
        if (this.rectCrossesBlocks) {
          this.selectBlockByIndex(i);
        }
        this.stackOfSelected.push(i);
      }
      return;
    }

    if (reduction && (info.index < this.stackOfSelected[sizeStack - 1])) {
      console.log('3');
      let i = sizeStack - 1;
      while (info.index < this.stackOfSelected[i]) {
        if (this.rectCrossesBlocks) {
          this.unSelectBlockByIndex(this.stackOfSelected[i]);
        }
        this.stackOfSelected.pop();
        i--;
      }
      return;
    }

    if (reduction && (info.index > this.stackOfSelected[sizeStack - 1])) {
      console.log('4');
      let i = sizeStack - 1;
      while (info.index > this.stackOfSelected[i]) {
        if (this.rectCrossesBlocks) {
          this.unSelectBlockByIndex(this.stackOfSelected[i]);
        }
        this.stackOfSelected.pop();
        i--;
      }
      return;
    }
  }

  private genInfoForMouseSelection() {
    const widthOfRedactor = window.getComputedStyle(this.Editor.UI.nodes.redactor).width;
    const centerOfRedactor = Number.parseInt(widthOfRedactor, 10) / 2;
    const heightOfScrollZone = 25;
    let Y = this.mouseY;
    // To look at the item below the zone
    if (this.inScrollZone === 'top') {
      Y += heightOfScrollZone;
    }
    if (this.inScrollZone === 'bot') {
      Y -= heightOfScrollZone;
    }
    const elementUnderPos = document.elementFromPoint(centerOfRedactor, Y);
    const blockInCurrentPos = this.Editor.BlockManager.getBlockByChildNode(elementUnderPos);
    let index = -1;
    if (blockInCurrentPos !== undefined) {
      index = this.Editor.BlockManager.blocks.findIndex((block) => block.holder === blockInCurrentPos.holder);
    }
    const template = '.' + BlockSelection.CSS.contentBlock;
    const contentElement = this.Editor.BlockManager.lastBlock.holder.querySelector(template);
    const centerOfBlock = Number.parseInt(window.getComputedStyle(contentElement).width, 10) / 2;
    const leftPos = centerOfRedactor - centerOfBlock;
    const rightPos = centerOfRedactor + centerOfBlock;

    return {
      index,
      leftPos,
      rightPos,
    };
  }

  private updateSizeOfRectangle(event) {
    // Depending on the position of the mouse relative to the starting point,
    // change ththis.e distance from the desired edge of the screen*/
    if (this.mouseY + window.pageYOffset >= this.startY) {
      this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`;
      this.overlayRectangle.style.bottom = `calc(100% - ${event.clientY}px`;
    } else {
      this.overlayRectangle.style.bottom = `calc(100% - ${this.startY - window.pageYOffset}px`;
      this.overlayRectangle.style.top = `${event.clientY}px`;
    }

    if (this.mouseX + window.pageXOffset >= this.startX) {
      this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`;
      this.overlayRectangle.style.right = `calc(100% - ${event.clientX}px`;
    } else {
      this.overlayRectangle.style.right = `calc(100% - ${this.startX - window.pageXOffset}px`;
      this.overlayRectangle.style.left = `${event.clientX}px`;
    }
  }

  private handleStartRectSelection(event: MouseEvent) {
    this.clearSelection();
    this.mousedown = true;
    this.startX = event.pageX;
    this.startY = event.pageY;
    this.stackOfSelected = [];

    this.overlayRectangle.style.left = `${this.startX}px`;
    this.overlayRectangle.style.top = `${this.startY}px`;
    this.overlayRectangle.style.bottom = `calc(100% - ${this.startY}px`;
    this.overlayRectangle.style.right = `calc(100% - ${this.startX}px`;

    this.overlayRectangle.style.display = 'block';
  }

  // activates scrolling if blockSelection is active and mouse is in scroll zone
  private scrollVertical(n) {
    if (this.inScrollZone && this.mousedown) {
      window.scrollBy(0, n);
      setTimeout(() => {
        this.scrollVertical(n);
      }, 0);
    }
  }

  // TODO END
  /**
   * First CMD+A Selects current focused blocks,
   * and consequent second CMD+A keypress selects all blocks
   *
   * @param {keydown} event
   */
  private handleCommandA(event): void {
    this.rectSelection = false;

    /** allow default selection on native inputs */
    if ($.isNativeInput(event.target) && !this.nativeInputSelected) {
      this.nativeInputSelected = true;
      return;
    }

    /** Prevent default selection */
    event.preventDefault();

    if (this.needToSelectAll) {
      this.selectAllBlocks();
      this.needToSelectAll = false;
    } else {
      this.selectBlockByIndex();
      this.needToSelectAll = true;
    }
  }

  /**
   * Copying selected blocks
   * Before putting to the clipboard we sanitize all blocks and then copy to the clipboard
   *
   * @param event
   */
  private handleCommandC(event): void {
    const {BlockManager, Sanitizer} = this.Editor;

    if (!this.anyBlockSelected) {
      return;
    }

    /**
     * Prevent default copy
     * Remove "decline sound" on macOS
     */
    event.preventDefault();

    const fakeClipboard = $.make('div');

    BlockManager.blocks.filter((block) => block.selected)
      .forEach((block) => {
        /**
         * Make <p> tag that holds clean HTML
         */
        const cleanHTML = Sanitizer.clean(block.holder.innerHTML, this.sanitizerConfig);
        const fragment = $.make('p');

        fragment.innerHTML = cleanHTML;
        fakeClipboard.appendChild(fragment);
      });

    _.copyTextToClipboard(fakeClipboard.innerHTML);
  }

  /**
   * Select All Blocks
   * Each Block has selected setter that makes Block copyable
   */
  private selectAllBlocks() {
    const {BlockManager} = this.Editor;

    this.allBlocksSelected = true;
  }

  /**
   * select Block
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  private selectBlockByIndex(index?) {
    const {BlockManager} = this.Editor;

    /**
     * Remove previous focused Block's state
     */
    BlockManager.clearFocused();

    let block;

    if (isNaN(index)) {
      block = BlockManager.currentBlock;
    } else {
      block = BlockManager.getBlockByIndex(index);
    }

    /** Save selection */
    this.selection.save();
    SelectionUtils.get()
      .removeAllRanges();

    block.selected = true;
  }

  /**
   * remove selection of Block
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  private unSelectBlockByIndex(index?) {
    const {BlockManager} = this.Editor;

    let block;

    if (isNaN(index)) {
      block = BlockManager.currentBlock;
    } else {
      block = BlockManager.getBlockByIndex(index);
    }

    block.selected = false;
  }
}
