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

/**
 * @typedef {Caret} Caret
 */
export default class Caret extends Module {
  /**
   * @constructor
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Elements styles that can be useful for Caret Module
   */
  static get CSS() {
    return {
      shadowCaret: 'cdx-shadow-caret'
    };
  };

  /**
   * Method gets Block instance and puts caret to the text node with offset
   * There two ways that method applies caret position:
   *   - first found text node: sets at the beginning, but you can pass an offset
   *   - last found text node: sets at the end of the node. Also, you can customize the behaviour
   *
   * @param {Block} block - Block class
   * @param {Number} offset - caret offset regarding to the text node
   * @param {Boolean} atEnd - put caret at the end of the text node or not
   */
  setToBlock(block, offset = 0, atEnd = false) {
    let element = block.pluginsContent;

    /** If Element is INPUT */
    if ($.isNativeInput(element)) {
      element.focus();
      return;
    }

    let nodeToSet = $.getDeepestNode(element, atEnd);

    if (atEnd || offset > nodeToSet.length) {
      offset = nodeToSet.length;
    }

    /** if found deepest node is native input */
    if ($.isNativeInput(nodeToSet)) {
      nodeToSet.focus();
      return;
    }

    /**
     * @todo try to fix via Promises or use querySelectorAll to not to use timeout
     */
    _.delay( () => {
      this.set(nodeToSet, offset);
    }, 20)();

    this.Editor.BlockManager.currentNode = block.holder;
  }

  /**
   * Creates Document Range and sets caret to the element with offset
   * @param {Element} element - target node.
   * @param {Number} offset - offset
   */
  set( element, offset = 0) {
    let range     = document.createRange(),
      selection = Selection.get();

    range.setStart(element, offset);
    range.setEnd(element, offset);

    selection.removeAllRanges();
    selection.addRange(range);
  };

  /**
   * Set Caret to the last Block
   * If last block is not empty, append another empty block
   */
  setToTheLastBlock() {
    let lastBlock = this.Editor.BlockManager.lastBlock;

    if (!lastBlock) return;

    /**
     * If last block is empty and it is an initialBlock, set to that.
     * Otherwise, append new empty block and set to that
     */
    if (lastBlock.isEmpty) {
      this.setToBlock(lastBlock);
    } else {
      let newBlock = this.Editor.BlockManager.insertAtEnd();

      this.setToBlock(newBlock);
    }
  }

  /**
   * Extract content fragment of current Block from Caret position to the end of the Block
   */
  extractFragmentFromCaretPosition() {
    let selection = Selection.get();

    if (selection.rangeCount) {
      let selectRange = selection.getRangeAt(0),
        blockElem = this.Editor.BlockManager.currentBlock.pluginsContent;

      selectRange.deleteContents();

      if (blockElem) {
        let range = selectRange.cloneRange(true);

        range.selectNodeContents(blockElem);
        range.setStart(selectRange.endContainer, selectRange.endOffset);
        return range.extractContents();
      }
    }
  }

  /**
   * Get all first-level (first child of [contenteditabel]) siblings from passed node
   * Then you can check it for emptiness
   *
   * @example
   * <div contenteditable>
   *     <p></p>                            |
   *     <p></p>                            | left first-level siblings
   *     <p></p>                            |
   *     <blockquote><a><b>adaddad</b><a><blockquote>       <-- passed node for example <b>
   *     <p></p>                            |
   *     <p></p>                            | right first-level siblings
   *     <p></p>                            |
   * </div>
   *
   * @return {Element[]}
   */
  getHigherLevelSiblings(from, direction ) {
    let current = from,
      siblings = [];

    /**
     * Find passed node's firs-level parent (in example - blockquote)
     */
    while (current.parentNode && current.parentNode.contentEditable !== 'true') {
      current = current.parentNode;
    }

    let sibling = direction === 'left' ? 'previousSibling' : 'nextSibling';

    /**
     * Find all left/right siblings
     */
    while (current[sibling]) {
      current = current[sibling];
      siblings.push(current);
    }

    return siblings;
  }

  /**
   * Set's caret to the next Block
   * Before moving caret, we should check if caret position is at the end of Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {Boolean} force - force navigation even if caret is not at the end
   *
   * @return {Boolean}
   */
  navigateNext(force = false) {
    let nextBlock = this.Editor.BlockManager.nextBlock;

    if (!nextBlock) {
      return false;
    }

    if (force || this.isAtEnd) {
      this.setToBlock(nextBlock);
      return true;
    }

    return false;
  }

  /**
   * Set's caret to the previous Block
   * Before moving caret, we should check if caret position is start of the Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {Boolean} force - force navigation even if caret is not at the start
   *
   * @return {Boolean}
   */
  navigatePrevious(force = false) {
    let previousBlock = this.Editor.BlockManager.previousBlock;

    if (!previousBlock) {
      return false;
    }

    if (force || this.isAtStart) {
      this.setToBlock( previousBlock, 0, true );
      return true;
    }

    return false;
  }

  /**
   * Get's deepest first node and checks if offset is zero
   * @return {boolean}
   */
  get isAtStart() {
    /**
     * Don't handle ranges
     */
    if (!Selection.isCollapsed) {
      return false;
    }

    let selection = Selection.get(),
      anchorNode = selection.anchorNode,
      firstNode = $.getDeepestNode(this.Editor.BlockManager.currentBlock.pluginsContent);

    /**
     * Workaround case when caret in the text like " |Hello!"
     * selection.anchorOffset is 1, but real caret visible position is 0
     * @type {number}
     */
    let firstLetterPosition = anchorNode.textContent.search(/\S/);

    if (firstLetterPosition === -1) { // empty text
      firstLetterPosition = 0;
    }

    /**
     * In case of
     * <div contenteditable>
     *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
     *     |adaddad         <-- anchor node
     * </div>
     */
    if ($.isEmpty(firstNode)) {
      let leftSiblings = this.getHigherLevelSiblings(anchorNode, 'left'),
        nothingAtLeft = leftSiblings.every( node => $.isEmpty(node) );



      if (nothingAtLeft && selection.anchorOffset === firstLetterPosition) {
        return true;
      }
    }

    /**
     * We use <= comparison for case:
     * "| Hello"  <--- selection.anchorOffset is 0, but firstLetterPosition is 1
     */
    return firstNode === null || anchorNode === firstNode && selection.anchorOffset <= firstLetterPosition;
  }

  /**
   * Get's deepest last node and checks if offset is last node text length
   * @return {boolean}
   */
  get isAtEnd() {
    /**
     * Don't handle ranges
     */
    if (!Selection.isCollapsed) {
      return false;
    }

    let selection = Selection.get(),
      anchorNode = selection.anchorNode,
      lastNode = $.getDeepestNode(this.Editor.BlockManager.currentBlock.pluginsContent, true);

    /**
     * In case of
     * <div contenteditable>
     *     adaddad|         <-- anchor node
     *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
     * </div>
     */
    if ($.isEmpty(lastNode)) {
      let leftSiblings = this.getHigherLevelSiblings(anchorNode, 'right'),
        nothingAtRight = leftSiblings.every( node => $.isEmpty(node) );

      if (nothingAtRight && selection.anchorOffset === anchorNode.textContent.length) {
        return true;
      }
    }

    /**
     * Workaround case:
     * hello |     <--- anchorOffset will be 5, but textContent.length will be 6.
     * Why not regular .trim():
     *  in case of ' hello |' trim() will also remove space at the beginning, so length will be lower than anchorOffset
     */
    let rightTrimmedText = lastNode.textContent.replace(/\s+$/, '');

    /**
     * We use >= comparison for case:
     * "Hello |"  <--- selection.anchorOffset is 7, but rightTrimmedText is 6
     */
    return anchorNode === lastNode && selection.anchorOffset >= rightTrimmedText.length;
  }

  /**
   * Inserts shadow element after passed element where caret can be placed
   * @param {Node} element
   */
  createShadow(element) {
    let shadowCaret = document.createElement('span');

    shadowCaret.classList.add(Caret.CSS.shadowCaret);
    element.insertAdjacentElement('beforeEnd', shadowCaret);
  }

  /**
   * Restores caret position
   * @param {Node} element
   */
  restoreCaret(element) {
    let shadowCaret = element.querySelector(`.${Caret.CSS.shadowCaret}`);

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
    let sel = new Selection();

    sel.expandToTag(shadowCaret);

    setTimeout(() => {
      let newRange = document.createRange();

      newRange.selectNode(shadowCaret);
      newRange.extractContents();
    }, 50);
  }
}
