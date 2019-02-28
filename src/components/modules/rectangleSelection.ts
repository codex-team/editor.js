/**
 * @class RectangleSelection
 * @classdesc Manages Block selection with mouse
 *
 * @module RectangleSelection
 * @version 1.0.0
 */
import Module from '../__module';
import $ from '../dom';

import SelectionUtils from '../selection';
import Block from '../block';
import UI from './ui';

export default class RectangleSelection extends Module {
  /**
   * CSS classes for the Block
   * @return {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      overlay: 'codex-editor-overlay',
      overlayContainer: 'codex-editor-overlay__container',
      rect: 'codex-editor-overlay__rectangle',
      topScrollZone: 'codex-editor-overlay__scroll-zone--top',
      bottomScrollZone: 'codex-editor-overlay__scroll-zone--bottom',
    };
  }

  /**
   * Using the selection rectangle
   * @type {boolean}
   */
  private isRectSelectionActivated: boolean = false;

  /**
   *  Speed of Scrolling
   */
  private readonly SCROLL_SPEED: number = 3;

  /**
   *  Height of scroll zone on boundary of screen
   */
  private readonly HEIGHT_OF_SCROLL_ZONE = 25;

  /**
   *  Scroll zone type indicators
   */
  private readonly BOTTOM_SCROLL_ZONE = 1;
  private readonly TOP_SCROLL_ZONE = 2;

  /**
   *  Mouse is clamped
   */
  private mousedown: boolean = false;

  /**
   *  Mouse is in scroll zone
   */
  private inScrollZone: number | null = null;

  /**
   *  Coords of rect
   */
  private startX: number = 0;
  private startY: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;

  /**
   * Selected blocks
   */
  private stackOfSelected: number[] = [];

  /**
   * Does the rectangle intersect blocks
   */
  private rectCrossesBlocks: boolean;

  /**
   * Selection rectangle
   */
  private overlayRectangle: HTMLDivElement;

  /**
   * Coords of redactor
   */
  private left;
  private top;

  /**
   * Module Preparation
   * Creating rect and hang handlers
   */
  public prepare(): void {
    const {Listeners} = this.Editor;
    const {overlayTopScrollZone, overlayBottomScrollZone, container, overlay} = this.genHTML();

    Listeners.on(overlayBottomScrollZone, 'mouseenter', (event) => {
      this.inScrollZone = this.BOTTOM_SCROLL_ZONE;
      this.scrollVertical(this.SCROLL_SPEED);
    });

    Listeners.on(overlayTopScrollZone, 'mouseenter', (event) => {
      this.inScrollZone = this.TOP_SCROLL_ZONE;
      this.scrollVertical(-this.SCROLL_SPEED);
    });

    Listeners.on(overlayBottomScrollZone, 'mouseleave', (event) => {
      this.inScrollZone = null;
    });

    Listeners.on(overlayTopScrollZone, 'mouseleave', (event) => {
      this.inScrollZone = null;
    });

    Listeners.on(container, 'mousedown', (event: MouseEvent) => {
      this.startSelection(event.pageX, event.pageY);
    }, false);

    Listeners.on(document.body, 'mousemove', (event) => {
      this.changingRectangle(event);
    }, false);

    Listeners.on(document.body, 'mouseleave', (event) => {
      this.clearSelection();
      this.endSelection();
    });

    Listeners.on(window, 'scroll', (event) => {
      this.changingRectangle(event);
    }, false);

    Listeners.on(document.body, 'mouseup', (event) => {
      this.endSelection();
    }, false);
  }

  /**
   * Init rect params
   * @param {number} pageX - X coord of mouse
   * @param {number} pageY - Y coord of mouse
   */
  public startSelection(pageX, pageY) {
    this.Editor.BlockSelection.allBlocksSelected = false;
    this.clearSelection();
    this.stackOfSelected = [];

    const elemWhereSelectionStart = document.elementFromPoint(pageX - window.pageXOffset, pageY - window.pageYOffset);
    if (!(elemWhereSelectionStart.closest('.' + UI.CSS.editorWrapper) &&
      !elemWhereSelectionStart.closest('.' + Block.CSS.content))) {
      return;
    }

    this.mousedown = true;
    this.startX = pageX;
    this.startY = pageY;
    const container = document.querySelector('.' + UI.CSS.editorWrapper);
  }

  /**
   * Clear all params to end selection
   */
  public endSelection() {
    this.mousedown = false;
    this.startX = 0;
    this.startY = 0;
    this.overlayRectangle.style.display = 'none';
  }

  /**
   * is RectSelection Activated
   */
  public isRectActivated() {
    return this.isRectSelectionActivated;
  }

  /**
   * Mark that selection is end
   */
  public clearSelection() {
    this.isRectSelectionActivated = false;
  }

  private genHTML() {
    const container = document.querySelector('.' + UI.CSS.editorWrapper);
    const overlay = $.make('div', RectangleSelection.CSS.overlay, {});
    const overlayContainer = $.make('div', RectangleSelection.CSS.overlayContainer, {});
    const overlayRectangle = $.make('div', RectangleSelection.CSS.rect, {});
    const overlayTopScrollZone = $.make('div', RectangleSelection.CSS.topScrollZone, {});
    const overlayBottomScrollZone = $.make('div', RectangleSelection.CSS.bottomScrollZone, {});

    overlayContainer.appendChild(overlayRectangle);
    overlay.appendChild(overlayContainer);
    document.body.appendChild(overlayTopScrollZone);
    document.body.appendChild(overlayBottomScrollZone);
    container.appendChild(overlay);

    this.overlayRectangle = overlayRectangle as HTMLDivElement;
    return {
      overlayBottomScrollZone,
      overlayTopScrollZone,
      container,
      overlay,
    };
  }

  /**
   * Activates scrolling if blockSelection is active and mouse is in scroll zone
   * @param {number} speed - speed of scrolling
   */
  private scrollVertical(speed) {
    if (!(this.inScrollZone && this.mousedown)) {
      return;
    }
    this.mouseY += speed;
    window.scrollBy(0, speed);
    setTimeout(() => {
      this.scrollVertical(speed);
    }, 0);
  }

  /**
   * Handles the change in the rectangle and its effect
   * @param {MouseEvent} event
   */
  private changingRectangle(event) {
    if (!this.mousedown) {
      return;
    }

    if (event.pageY !== undefined) {
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
    }

    const {rightPos, leftPos, index} = this.genInfoForMouseSelection();
    // There is not new block in selection

    const rectIsOnRighSideOfredactor = this.startX > rightPos && this.mouseX > rightPos;
    const rectISOnLeftSideOfRedactor = this.startX < leftPos && this.mouseX < leftPos;
    this.rectCrossesBlocks = !(rectIsOnRighSideOfredactor || rectISOnLeftSideOfRedactor);

    if (!this.isRectSelectionActivated) {
      this.rectCrossesBlocks = false;
      this.isRectSelectionActivated = true;
      this.shrinkRectangleToPoint();
      this.overlayRectangle.style.display = 'block';
    }

    this.updateRectangleSize();

    if (index === undefined) {
      return;
    }

    this.trySelectNextBlock(index);
    // For case, when rect is out from blocks
    this.inverseSelection();

    SelectionUtils.get().removeAllRanges();
    event.preventDefault();
  }

  /**
   * Shrink rect to singular point
   */
  private shrinkRectangleToPoint() {
    this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`;
    this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`;
    this.overlayRectangle.style.bottom = `calc(100% - ${this.startY - window.pageYOffset}px`;
    this.overlayRectangle.style.right = `calc(100% - ${this.startX - window.pageXOffset}px`;
  }

  /**
   * Select or unselect all of blocks in array if rect is out or in selectable area
   */
  private inverseSelection() {
    const firstBlockInStack = this.Editor.BlockManager.getBlockByIndex(this.stackOfSelected[0]);
    const isSelecteMode = firstBlockInStack.selected;

    if (this.rectCrossesBlocks && !isSelecteMode) {
      for (let i = 0; i < this.stackOfSelected.length; i++) {
        this.Editor.BlockSelection.selectBlockByIndex(this.stackOfSelected[i]);
      }
    }

    if (!this.rectCrossesBlocks && isSelecteMode) {
      for (let i = 0; i < this.stackOfSelected.length; i++) {
        this.Editor.BlockSelection.unSelectBlockByIndex(this.stackOfSelected[i]);
      }
    }
  }

  /**
   * Updates size of rectangle
   */
  private updateRectangleSize() {
    // Depending on the position of the mouse relative to the starting point,
    // change this.e distance from the desired edge of the screen*/
    if (this.mouseY >= this.startY) {
      this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`;
      this.overlayRectangle.style.bottom = `calc(100% - ${this.mouseY - window.pageYOffset}px`;
    } else {
      this.overlayRectangle.style.bottom = `calc(100% - ${this.startY - window.pageYOffset}px`;
      this.overlayRectangle.style.top = `${this.mouseY - window.pageYOffset}px`;
    }

    if (this.mouseX >= this.startX) {
      this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`;
      this.overlayRectangle.style.right = `calc(100% - ${this.mouseX - window.pageXOffset}px`;
    } else {
      this.overlayRectangle.style.right = `calc(100% - ${this.startX - window.pageXOffset}px`;
      this.overlayRectangle.style.left = `${this.mouseX - window.pageXOffset}px`;
    }
  }

  /**
   * Collects information needed to determine the behavior of the rectangle
   * @return {number} index - index next Block, leftPos - start of left border of Block, rightPos - right border
   */
  private genInfoForMouseSelection() {
    const widthOfRedactor = document.body.offsetWidth;
    const centerOfRedactor = widthOfRedactor / 2;
    const Y = this.getHorizontalMousePosition();
    const elementUnderMouse = document.elementFromPoint(centerOfRedactor, Y);
    const blockInCurrentPos = this.Editor.BlockManager.getBlockByChildNode(elementUnderMouse);
    let index;
    if (blockInCurrentPos !== undefined) {
      index = this.Editor.BlockManager.blocks.findIndex((block) => block.holder === blockInCurrentPos.holder);
    }
    const contentElement = this.Editor.BlockManager.lastBlock.holder.querySelector('.' + Block.CSS.content);
    const centerOfBlock = Number.parseInt(window.getComputedStyle(contentElement).width, 10) / 2;
    const leftPos = centerOfRedactor - centerOfBlock;
    const rightPos = centerOfRedactor + centerOfBlock;

    return {
      index,
      leftPos,
      rightPos,
    };
  }

  /**
   * Get mouse Y coord with accounting Scroll zone
   */
  private getHorizontalMousePosition() {
    let value = this.mouseY - window.pageYOffset;
    // To look at the item below the zone
    if (this.inScrollZone === this.TOP_SCROLL_ZONE) {
      value += this.HEIGHT_OF_SCROLL_ZONE;
    }
    if (this.inScrollZone === this.BOTTOM_SCROLL_ZONE) {
      value -= this.HEIGHT_OF_SCROLL_ZONE;
    }
    return value;
  }

  /**
   * Select block with index index
   * @param index - index of block in redactor
   */
  private addBlockInSelection(index) {
    if (this.rectCrossesBlocks) {
      this.Editor.BlockSelection.selectBlockByIndex(index);
    }
    this.stackOfSelected.push(index);
  }

  /**
   * Adds a block to the selection and determines which blocks should be selected
   * @param {object} index - index of new block in the reactor
   */
  private trySelectNextBlock(index) {
    const sameBlock = this.stackOfSelected[this.stackOfSelected.length - 1] === index;
    const sizeStack = this.stackOfSelected.length;
    const down = 1, up = -1, undef = 0;

    if (sameBlock) {
      return;
    }

    const blockNumbersIncrease = this.stackOfSelected[sizeStack - 1] - this.stackOfSelected[sizeStack - 2] > 0;
    const direction = sizeStack <= 1 ? undef : blockNumbersIncrease ? down : up;
    const selectionInDownDurection = index > this.stackOfSelected[sizeStack - 1] && direction === down;
    const selectionInUpDirection = index < this.stackOfSelected[sizeStack - 1] && direction === up;
    const generalSelection = selectionInDownDurection || selectionInUpDirection || direction === undef;
    const reduction = !generalSelection;

    // When the selection is too fast, some blocks do not have time to be noticed. Fix it.
    if (!reduction && (index > this.stackOfSelected[sizeStack - 1] || this.stackOfSelected[sizeStack - 1] === undefined)) {
      let i = this.stackOfSelected[sizeStack - 1] + 1 || index;

      for (i; i <= index; i++) {
        this.addBlockInSelection(i);
      }
      return;
    }

    // for both directions
    if (!reduction && (index < this.stackOfSelected[sizeStack - 1])) {
      for (let i = this.stackOfSelected[sizeStack - 1] - 1; i >= index; i--) {
        this.addBlockInSelection(i);
      }
      return;
    }

    if (!reduction) {
      return;
    }

    let i = sizeStack - 1;
    let cmp;

    // cmp for different directions
    if (index > this.stackOfSelected[sizeStack - 1]) {
      cmp = () => index > this.stackOfSelected[i];
    } else {
      cmp = () => index < this.stackOfSelected[i];
    }

    // Remove blocks missed due to speed.
    // cmp checks if we have removed all the necessary blocks
    while (cmp()) {
      if (this.rectCrossesBlocks) {
        this.Editor.BlockSelection.unSelectBlockByIndex(this.stackOfSelected[i]);
      }
      this.stackOfSelected.pop();
      i--;
    }
    return;
  }
}
