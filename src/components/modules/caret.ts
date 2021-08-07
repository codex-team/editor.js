/**
 * @class Caret
 * @classdesc Contains methods for working Caret
 *
 * Uses Range methods to manipulate with caret
 *
 * @module Caret
 *
 * @version 2.0.0
 */

import Selection from '../selection';
import Module from '../__module';
import Block from '../block';
import $ from '../dom';
import * as _ from '../utils';
import SelectionUtils from '../selection';

/**
 * The result of detection an next or previous line
 */
interface Position {
  /**
   * Detected Block
   */
  block: Block;

  /**
   * Detected Tool's input
   */
  input?: HTMLElement;

  /**
   * The detected offset of the block or input
   */
  offset: number;
}

/**
 * Enumeration of possible cursor directions
 */
export enum Direction {
  Left = _.keyCodes.LEFT,
  Up = _.keyCodes.UP,
  Right = _.keyCodes.RIGHT,
  Down = _.keyCodes.DOWN,
}

/**
 * @typedef {Caret} Caret
 */
export default class Caret extends Module {
  /**
   * Allowed caret positions in input
   *
   * @static
   * @returns {{START: string, END: string, DEFAULT: string}}
   */
  public get positions(): {START: string; END: string; DEFAULT: string} {
    return {
      START: 'start',
      END: 'end',
      DEFAULT: 'default',
    };
  }

  /**
   * Elements styles that can be useful for Caret Module
   */
  private static get CSS(): {shadowCaret: string} {
    return {
      shadowCaret: 'cdx-shadow-caret',
    };
  }

  /**
   * Get's deepest first node and checks if offset is zero
   *
   * @returns {boolean}
   */
  public get isAtStart(): boolean {
    const selection = Selection.get();
    const firstNode = $.getDeepestNode(this.Editor.BlockManager.currentBlock.currentInput);
    let focusNode = selection.focusNode;

    /** In case lastNode is native input */
    if ($.isNativeInput(firstNode)) {
      return (firstNode as HTMLInputElement).selectionEnd === 0;
    }

    /** Case when selection have been cleared programmatically, for example after CBS */
    if (!selection.anchorNode) {
      return false;
    }

    /**
     * Workaround case when caret in the text like " |Hello!"
     * selection.anchorOffset is 1, but real caret visible position is 0
     *
     * @type {number}
     */

    let firstLetterPosition = focusNode.textContent.search(/\S/);

    if (firstLetterPosition === -1) { // empty text
      firstLetterPosition = 0;
    }

    /**
     * If caret was set by external code, it might be set to text node wrapper.
     * <div>|hello</div> <---- Selection references to <div> instead of text node
     *
     * In this case, anchor node has ELEMENT_NODE node type.
     * Anchor offset shows amount of children between start of the element and caret position.
     *
     * So we use child with focusOffset index as new anchorNode.
     */
    let focusOffset = selection.focusOffset;

    if (focusNode.nodeType !== Node.TEXT_NODE && focusNode.childNodes.length) {
      if (focusNode.childNodes[focusOffset]) {
        focusNode = focusNode.childNodes[focusOffset];
        focusOffset = 0;
      } else {
        focusNode = focusNode.childNodes[focusOffset - 1];
        focusOffset = focusNode.textContent.length;
      }
    }

    /**
     * In case of
     * <div contenteditable>
     *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
     *     |adaddad         <-- focus node
     * </div>
     */
    if ($.isLineBreakTag(firstNode as HTMLElement) || $.isEmpty(firstNode)) {
      const leftSiblings = this.getHigherLevelSiblings(focusNode as HTMLElement, 'left');
      const nothingAtLeft = leftSiblings.every((node) => {
        /**
         * Workaround case when block starts with several <br>'s (created by SHIFT+ENTER)
         *
         * @see https://github.com/codex-team/editor.js/issues/726
         * We need to allow to delete such linebreaks, so in this case caret IS NOT AT START
         */
        const regularLineBreak = $.isLineBreakTag(node);
        /**
         * Workaround SHIFT+ENTER in Safari, that creates <div><br></div> instead of <br>
         */
        const lineBreakInSafari = node.children.length === 1 && $.isLineBreakTag(node.children[0] as HTMLElement);
        const isLineBreak = regularLineBreak || lineBreakInSafari;

        return $.isEmpty(node) && !isLineBreak;
      });

      if (nothingAtLeft && focusOffset === firstLetterPosition) {
        return true;
      }
    }

    /**
     * We use <= comparison for case:
     * "| Hello"  <--- selection.anchorOffset is 0, but firstLetterPosition is 1
     */
    return firstNode === null || (focusNode === firstNode && focusOffset <= firstLetterPosition);
  }

  /**
   * Get's deepest last node and checks if offset is last node text length
   *
   * @returns {boolean}
   */
  public get isAtEnd(): boolean {
    const selection = Selection.get();
    let focusNode = selection.focusNode;

    const lastNode = $.getDeepestNode(this.Editor.BlockManager.currentBlock.currentInput, true);

    /** In case lastNode is native input */
    if ($.isNativeInput(lastNode)) {
      return (lastNode as HTMLInputElement).selectionEnd === (lastNode as HTMLInputElement).value.length;
    }

    /** Case when selection have been cleared programmatically, for example after CBS */
    if (!selection.focusNode) {
      return false;
    }

    /**
     * If caret was set by external code, it might be set to text node wrapper.
     * <div>hello|</div> <---- Selection references to <div> instead of text node
     *
     * In this case, anchor node has ELEMENT_NODE node type.
     * Anchor offset shows amount of children between start of the element and caret position.
     *
     * So we use child with anchofocusOffset - 1 as new focusNode.
     */
    let focusOffset = selection.focusOffset;

    if (focusNode.nodeType !== Node.TEXT_NODE && focusNode.childNodes.length) {
      if (focusNode.childNodes[focusOffset - 1]) {
        focusNode = focusNode.childNodes[focusOffset - 1];
        focusOffset = focusNode.textContent.length;
      } else {
        focusNode = focusNode.childNodes[0];
        focusOffset = 0;
      }
    }

    /**
     * In case of
     * <div contenteditable>
     *     adaddad|         <-- anchor node
     *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
     * </div>
     */
    if ($.isLineBreakTag(lastNode as HTMLElement) || $.isEmpty(lastNode)) {
      const rightSiblings = this.getHigherLevelSiblings(focusNode as HTMLElement, 'right');
      const nothingAtRight = rightSiblings.every((node, i) => {
        /**
         * If last right sibling is BR isEmpty returns false, but there actually nothing at right
         */
        const isLastBR = i === rightSiblings.length - 1 && $.isLineBreakTag(node as HTMLElement);

        return isLastBR || ($.isEmpty(node) && !$.isLineBreakTag(node));
      });

      if (nothingAtRight && focusOffset === focusNode.textContent.length) {
        return true;
      }
    }

    /**
     * Workaround case:
     * hello |     <--- anchorOffset will be 5, but textContent.length will be 6.
     * Why not regular .trim():
     *  in case of ' hello |' trim() will also remove space at the beginning, so length will be lower than anchorOffset
     */
    const rightTrimmedText = lastNode.textContent.replace(/\s+$/, '');

    /**
     * We use >= comparison for case:
     * "Hello |"  <--- selection.anchorOffset is 7, but rightTrimmedText is 6
     */
    return focusNode === lastNode && focusOffset >= rightTrimmedText.length;
  }

  /**
   * Cache for last caret range bounding client rect
   */
  public lastCaretRect: DOMRect | null = null;

  /**
   * Method gets Block instance and puts caret to the text node with offset
   * There two ways that method applies caret position:
   *   - first found text node: sets at the beginning, but you can pass an offset
   *   - last found text node: sets at the end of the node. Also, you can customize the behaviour
   *
   * @param {Block} block - Block class
   * @param {string} position - position where to set caret.
   *                            If default - leave default behaviour and apply offset if it's passed
   * @param {number} offset - caret offset regarding to the text node
   */
  public setToBlock(block: Block, position: string = this.positions.DEFAULT, offset = 0): void {
    const { BlockManager } = this.Editor;
    let element;

    switch (position) {
      case this.positions.START:
        element = block.firstInput;
        break;
      case this.positions.END:
        element = block.lastInput;
        break;
      default:
        element = block.currentInput || block.firstInput;
    }

    if (!element) {
      return;
    }

    switch (true) {
      case position === this.positions.START:
        offset = 0;
        break;
      case position === this.positions.END:
        offset = $.getContentLength(element);
        break;
    }

    /**
     * @todo try to fix via Promises or use querySelectorAll to not to use timeout
     */
    _.delay(() => {
      this.set(element, offset);
    }, 20)();

    BlockManager.setCurrentBlockByChildNode(block.holder);
    BlockManager.currentBlock.currentInput = element;
  }

  /**
   * Set caret to the current input of current Block.
   *
   * @param {HTMLElement} input - input where caret should be set
   * @param {string} position - position of the caret.
   *                            If default - leave default behaviour and apply offset if it's passed
   * @param {number} offset - caret offset regarding to the text node
   */
  public setToInput(input: HTMLElement, position: string = this.positions.DEFAULT, offset = 0): void {
    const { currentBlock } = this.Editor.BlockManager;

    switch (position) {
      case this.positions.START:
        this.set(input, 0);
        break;

      case this.positions.END:
        this.set(input, $.getContentLength(input));
        break;

      default:
        if (offset) {
          this.set(input, offset);
        }
    }

    currentBlock.currentInput = input;
  }

  /**
   * Creates Document Range and sets caret to the element with offset
   *
   * @param {HTMLElement} element - target node.
   * @param {number} offset - offset.
   */
  public set(element: HTMLElement, offset = 0): void {
    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    let detectedNode = treeWalker.firstChild() as Text;
    let detectedOffset = offset;

    while (detectedNode) {
      if (detectedNode.length >= detectedOffset) {
        break;
      }

      detectedOffset -= detectedNode.length;
      detectedNode = treeWalker.nextNode() as Text;
    }

    let position: DOMRect;

    if (detectedNode) {
      position = Selection.setCursor(detectedNode, detectedOffset);
    } else if ($.isNativeInput(element) || $.isContentEditable(element)) {
      position = Selection.setCursor(element, offset);
    }

    /** If new cursor position is not visible, scroll to it */
    const { innerHeight } = window;
    const { top, bottom } = position;

    if (top < 0) {
      window.scrollBy(0, top);
    }
    if (bottom > innerHeight) {
      window.scrollBy(0, bottom - innerHeight);
    }
  }

  /**
   * Set Caret to the last Block
   * If last block is not empty, append another empty block
   */
  public setToTheLastBlock(): void {
    this.lastCaretRect = null;

    const lastBlock = this.Editor.BlockManager.lastBlock;

    if (!lastBlock) {
      return;
    }

    /**
     * If last block is empty and it is an defaultBlock, set to that.
     * Otherwise, append new empty block and set to that
     */
    if (lastBlock.tool.isDefault && lastBlock.isEmpty) {
      this.setToBlock(lastBlock);
    } else {
      const newBlock = this.Editor.BlockManager.insertAtEnd();

      this.setToBlock(newBlock);
    }
  }

  /**
   * Extract content fragment of current Block from Caret position to the end of the Block
   */
  public extractFragmentFromCaretPosition(): void|DocumentFragment {
    const selection = Selection.get();

    if (selection.rangeCount) {
      const selectRange = selection.getRangeAt(0);
      const currentBlockInput = this.Editor.BlockManager.currentBlock.currentInput;

      selectRange.deleteContents();

      if (currentBlockInput) {
        if ($.isNativeInput(currentBlockInput)) {
          /**
           * If input is native text input we need to use it's value
           * Text before the caret stays in the input,
           * while text after the caret is returned as a fragment to be inserted after the block.
           */
          const input = currentBlockInput as HTMLInputElement | HTMLTextAreaElement;
          const newFragment = document.createDocumentFragment();

          const inputRemainingText = input.value.substring(0, input.selectionStart);
          const fragmentText = input.value.substring(input.selectionStart);

          newFragment.textContent = fragmentText;
          input.value = inputRemainingText;

          return newFragment;
        } else {
          const range = selectRange.cloneRange();

          range.selectNodeContents(currentBlockInput);
          range.setStart(selectRange.endContainer, selectRange.endOffset);

          return range.extractContents();
        }
      }
    }
  }

  /**
   * Set's caret to the next Block or Tool`s input
   * Before moving caret, we should check if caret position is at the end of Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {'down' | 'right'} direction - the direction of navigation
   *
   * @returns {boolean}
   */
  public navigateNext(direction: Direction): boolean {
    const shouldNavigateToNext = this.isAtEnd || (direction === Direction.Down && !this.doesLineExist('next'));

    if (direction === Direction.Right || !this.lastCaretRect) {
      const range = SelectionUtils.range;

      this.lastCaretRect = range?.getBoundingClientRect() || null;
    }

    const next = shouldNavigateToNext && this.detectNextLinePosition();

    if (next) {
      const offset = direction === Direction.Down ? next.offset : 0;

      /** If next Tool`s input exists, focus on it. Otherwise set caret to the next Block */
      if (next.input) {
        this.setToInput(next.input, this.positions.DEFAULT, offset);
      } else {
        this.setToBlock(next.block, this.positions.DEFAULT, offset);
      }

      return true;
    }

    return false;
  }

  /**
   * Set's caret to the previous Tool`s input or Block
   * Before moving caret, we should check if caret position is start of the Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {'left' | 'up'} direction - the direction of navigation
   *
   * @returns {boolean}
   */
  public navigatePrevious(direction: Direction): boolean {
    const shouldNavigateToPrevious = this.isAtStart || (direction === Direction.Up && !this.doesLineExist('previous'));

    if (direction === Direction.Left || !this.lastCaretRect) {
      const range = SelectionUtils.range;

      this.lastCaretRect = range?.getBoundingClientRect() || null;
    }

    const previous = shouldNavigateToPrevious && this.detectPreviousLinePosition();

    if (previous) {
      const position = direction === Direction.Up ? this.positions.DEFAULT : this.positions.END;

      /** If previous Tool`s input exists, focus on it. Otherwise set caret to the previous Block */
      if (previous.input) {
        this.setToInput(previous.input, position, previous.offset);
      } else {
        this.setToBlock(previous.block, position, previous.offset);
      }

      return true;
    }

    return false;
  }

  /**
   * Inserts shadow element after passed element where caret can be placed
   *
   * @param {Element} element - element after which shadow caret should be inserted
   */
  public createShadow(element: Element): void {
    const shadowCaret = document.createElement('span');

    shadowCaret.classList.add(Caret.CSS.shadowCaret);
    element.insertAdjacentElement('beforeend', shadowCaret);
  }

  /**
   * Restores caret position
   *
   * @param {HTMLElement} element - element where caret should be restored
   */
  public restoreCaret(element: HTMLElement): void {
    const shadowCaret = element.querySelector(`.${Caret.CSS.shadowCaret}`);

    if (!shadowCaret) {
      return;
    }

    /**
     * After we set the caret to the required place
     * we need to clear shadow caret
     *
     * - make new range
     * - select shadowed span
     * - use extractContent to remove it from DOM
     */
    const sel = new Selection();

    sel.expandToTag(shadowCaret as HTMLElement);

    setTimeout(() => {
      const newRange = document.createRange();

      newRange.selectNode(shadowCaret);
      newRange.extractContents();
    }, 50);
  }

  /**
   * Inserts passed content at caret position
   *
   * @param {string} content - content to insert
   */
  public insertContentAtCaretPosition(content: string): void {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    const selection = Selection.get();
    const range = Selection.range;

    wrapper.innerHTML = content;

    Array.from(wrapper.childNodes).forEach((child: Node) => fragment.appendChild(child));

    /**
     * If there is no child node, append empty one
     */
    if (fragment.childNodes.length === 0) {
      fragment.appendChild(new Text(''));
    }

    const lastChild = fragment.lastChild;

    range.deleteContents();
    range.insertNode(fragment);

    /** Cross-browser caret insertion */
    const newRange = document.createRange();

    newRange.setStart(lastChild, lastChild.textContent.length);

    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  /**
   * Detect an next line position from the caret position
   */
  private detectNextLinePosition(): Position | false {
    const { BlockManager, Tools } = this.Editor;

    const nextInput = BlockManager.currentBlock.nextInput;
    let nextBlock = BlockManager.nextContentfulBlock;

    if (!nextBlock && !nextInput) {
      /**
       * If there is a last block and it is default, do nothing
       * This code allows to exit from the last non-initial tool:
       * https://github.com/codex-team/editor.js/issues/1103
       */
      if (BlockManager.currentBlock.tool.isDefault) {
        return false;
      }

      /**
       * If there is no nextBlock, but currentBlock is not default,
       * insert new default block at the end and navigate to it
       */
      nextBlock = BlockManager.insertAtEnd();
    }

    return this.detectPosition('next', nextBlock, nextInput);
  }

  /**
   * Detect a previous line position from the caret position
   */
  private detectPreviousLinePosition(): Position | false {
    const { BlockManager } = this.Editor;

    const previousInput = BlockManager.currentBlock.previousInput;
    const previousBlock = BlockManager.previousContentfulBlock;

    if (!previousBlock && !previousInput) {
      return false;
    }

    return this.detectPosition('previous', previousBlock, previousInput);
  }

  /**
   * Detect an next or previous line position from the caret position
   *
   * @param {'next' | 'previous'} direction - the direction of detection
   * @param {Block} block - next or previous Block
   * @param {HTMLElement | undefined} input - next or previous Tool's input
   */
  private detectPosition(direction: 'next' | 'previous', block: Block, input?: HTMLElement): Position {
    const caretRange = SelectionUtils.range;
    const root = input ?? block.firstInput;

    let position = {
      block,
      input,
      offset: direction === 'next' ? root.textContent.length : 0,
    };

    if (!caretRange) {
      return position;
    }

    const caretBoundingClientRect = this.lastCaretRect || caretRange.getBoundingClientRect();

    const range = new Range();

    let offset = direction === 'next' ? 0 : root.textContent.length - 1;
    let previousBoundingClientRect: DOMRect | undefined;

    const getXOffset = (rectWidth: number): number => direction === 'previous' ? rectWidth : 0;

    /**
     * Detect the nearest offset by horizontal position
     */
    this.walkTextNodeChars(root, direction, (textNode, index) => {
      range.setStart(textNode, index);
      range.setEnd(textNode, index);

      const currentBoundingClientRect = range.getBoundingClientRect();

      if (previousBoundingClientRect) {
        const caretX = caretBoundingClientRect.x + getXOffset(caretBoundingClientRect.width);
        const currentX = currentBoundingClientRect.x + getXOffset(currentBoundingClientRect.width);
        const previousX = previousBoundingClientRect.x + getXOffset(previousBoundingClientRect.width);

        if (Math.abs(caretX - previousX) < Math.abs(caretX - currentX)) {
          let detectedOffset = offset + (direction === 'next' ? -1 : 1);

          /**
           * Set the caret to the right side of detected offset
           */
          if (direction === 'previous' && currentBoundingClientRect.y >= previousBoundingClientRect.y) {
            detectedOffset++;
          }

          position = {
            block,
            input,
            offset: detectedOffset,
          };

          return true;
        }
      }

      direction === 'next' ? offset++ : offset--;
      previousBoundingClientRect = currentBoundingClientRect;

      return false;
    });

    return position;
  }

  /**
   * Get all first-level (first child of [contenteditabel]) siblings from passed node
   * Then you can check it for emptiness
   *
   * @example
   * <div contenteditable>
   * <p></p>                            |
   * <p></p>                            | left first-level siblings
   * <p></p>                            |
   * <blockquote><a><b>adaddad</b><a><blockquote>       <-- passed node for example <b>
   * <p></p>                            |
   * <p></p>                            | right first-level siblings
   * <p></p>                            |
   * </div>
   *
   * @param {HTMLElement} from - element from which siblings should be searched
   * @param {'left' | 'right'} direction - direction of search
   *
   * @returns {HTMLElement[]}
   */
  private getHigherLevelSiblings(from: HTMLElement, direction?: 'left' | 'right'): HTMLElement[] {
    let current = from;
    const siblings = [];

    /**
     * Find passed node's firs-level parent (in example - blockquote)
     */
    while (current.parentNode && (current.parentNode as HTMLElement).contentEditable !== 'true') {
      current = current.parentNode as HTMLElement;
    }

    const sibling = direction === 'left' ? 'previousSibling' : 'nextSibling';

    /**
     * Find all left/right siblings
     */
    while (current[sibling]) {
      current = current[sibling] as HTMLElement;
      siblings.push(current);
    }

    return siblings;
  }

  /**
   * Judge if next or previous line exists
   *
   * @param {'next' | 'previous'} direction - the direction of searching
   */
  private doesLineExist(direction: 'next' | 'previous'): boolean {
    const { currentBlock } = this.Editor.BlockManager;
    const range = SelectionUtils.range;

    if (!range) {
      return false;
    }

    const referenceRange = new Range();
    const deepestTextNode = $.getDeepestTextNode(currentBlock.currentInput, direction === 'next');

    referenceRange.selectNodeContents(deepestTextNode);
    referenceRange.collapse(direction === 'previous');

    const { y: currentY } = range.getBoundingClientRect();
    const { y: referenceY } = referenceRange.getBoundingClientRect();

    return currentY !== referenceY;
  }

  /**
   * Walk the characters in text nodes, and execute callback for each character
   *
   * @param {Node} root - The root of TreeWalker
   * @param {'next' | 'previous'} direction - the direction of walking
   * @param {boolean} callback - Function to execute on each characters. returns that walking should be broken.
   *
   * @returns {boolean} - Is walking broken.
   */
  private walkTextNodeChars(root: Node, direction: 'next' | 'previous', callback: (textNode: Text, index: number) => boolean): boolean {
    const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    let node = (direction === 'next' ? treeWalker.firstChild() : treeWalker.lastChild()) as Text;

    while (node) {
      let index = direction === 'next' ? 0 : node.length - 1;

      while (direction === 'next' ? index < node.length : index >= 0) {
        const shouldBreak = callback(node, index);

        if (shouldBreak) {
          return true;
        }

        direction === 'next' ? index++ : index--;
      }

      node = (direction === 'next' ? treeWalker.nextNode() : treeWalker.previousNode()) as Text;
    }

    return false;
  }
}
