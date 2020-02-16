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
  private readonly HEIGHT_OF_SCROLL_ZONE = 40;

  /**
   *  Scroll zone type indicators
   */
  private readonly BOTTOM_SCROLL_ZONE = 1;
  private readonly TOP_SCROLL_ZONE = 2;

  /**
   * Id of main button for event.button
   */
  private readonly MAIN_MOUSE_BUTTON = 0;

  /**
   *  Mouse is clamped
   */
  private mousedown: boolean = false;

  /**
   *  Is scrolling now
   */
  private isScrolling: boolean = false;

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
   * Module Preparation
   * Creating rect and hang handlers
   */
  public prepare(): void {
    this.toggleReadOnly(this.config.readOnly);
  }

  /**
   * Set read-only state
   *
   * @param {boolean} readOnlyEnabled
   */
  public toggleReadOnly(readOnlyEnabled: boolean) {
    const {Listeners} = this.Editor;

    if (readOnlyEnabled) {
      Listeners.removeAll();
    } else {
      const {container} = this.genHTML();

      Listeners.on(container, 'mousedown', (event: MouseEvent) => {
        if (event.button !== this.MAIN_MOUSE_BUTTON) {
          return;
        }
        this.startSelection(event.pageX, event.pageY);
      }, false);

      Listeners.on(document.body, 'mousemove', (event: MouseEvent) => {
        this.changingRectangle(event);
        this.scrollByZones(event.clientY);
      }, false);

      Listeners.on(document.body, 'mouseleave', () => {
        this.clearSelection();
        this.endSelection();
      });

      Listeners.on(window, 'scroll', (event) => {
        this.changingRectangle(event);
      }, false);

      Listeners.on(document.body, 'mouseup', () => {
        this.endSelection();
      }, false);
    }
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

    const selectorsToAvoid = [
      `.${Block.CSS.content}`,
      `.${this.Editor.Toolbar.CSS.toolbar}`,
      `.${this.Editor.InlineToolbar.CSS.inlineToolbar}`,
    ];

    const startsInsideEditor = elemWhereSelectionStart.closest('.' + this.Editor.UI.CSS.editorWrapper);
    const startsInSelectorToAvoid = selectorsToAvoid.some(((selector) => !!elemWhereSelectionStart.closest(selector)));

    /**
     * If selection starts outside of the editor or inside the blocks or on Editor UI elements, do not handle it
     */
    if (!startsInsideEditor || startsInSelectorToAvoid) {
      return;
    }

    this.mousedown = true;
    this.startX = pageX;
    this.startY = pageY;
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

  /**
   * Scroll If mouse in scroll zone
   * @param {number} clientY - Y coord of mouse
   */
  private scrollByZones(clientY) {
    this.inScrollZone = null;
    if (clientY <= this.HEIGHT_OF_SCROLL_ZONE) {
      this.inScrollZone = this.TOP_SCROLL_ZONE;
    }
    if (document.documentElement.clientHeight - clientY <= this.HEIGHT_OF_SCROLL_ZONE) {
      this.inScrollZone = this.BOTTOM_SCROLL_ZONE;
    }

    if (!this.inScrollZone) {
      this.isScrolling = false;
      return;
    }

    if (!this.isScrolling) {
      this.scrollVertical(this.inScrollZone === this.TOP_SCROLL_ZONE ? -this.SCROLL_SPEED : this.SCROLL_SPEED);
      this.isScrolling = true;
    }
  }

  private genHTML() {
    const {UI} = this.Editor;

    const container = UI.nodes.holder.querySelector('.' + UI.CSS.editorWrapper);
    const overlay = $.make('div', RectangleSelection.CSS.overlay, {});
    const overlayContainer = $.make('div', RectangleSelection.CSS.overlayContainer, {});
    const overlayRectangle = $.make('div', RectangleSelection.CSS.rect, {});

    overlayContainer.appendChild(overlayRectangle);
    overlay.appendChild(overlayContainer);
    container.appendChild(overlay);

    this.overlayRectangle = overlayRectangle as HTMLDivElement;
    return {
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
    const lastOffset = window.pageYOffset;
    window.scrollBy(0, speed);
    this.mouseY += window.pageYOffset - lastOffset;
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
      for (const it of this.stackOfSelected) {
        this.Editor.BlockSelection.selectBlockByIndex(it);
      }
    }

    if (!this.rectCrossesBlocks && isSelecteMode) {
      for (const it of this.stackOfSelected) {
        this.Editor.BlockSelection.unSelectBlockByIndex(it);
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
    const Y = this.mouseY - window.pageYOffset;
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
    if (!reduction && (index > this.stackOfSelected[sizeStack - 1] ||
      this.stackOfSelected[sizeStack - 1] === undefined)) {
      let ind = this.stackOfSelected[sizeStack - 1] + 1 || index;

      for (ind; ind <= index; ind++) {
        this.addBlockInSelection(ind);
      }
      return;
    }

    // for both directions
    if (!reduction && (index < this.stackOfSelected[sizeStack - 1])) {
      for (let ind = this.stackOfSelected[sizeStack - 1] - 1; ind >= index; ind--) {
        this.addBlockInSelection(ind);
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
