import Selection from '../selection';
import Module from '../__module';
import Block, { type BlockInput } from '../block';
import $, { isCollapsedWhitespaces } from '../dom';

/**
 * Caret
 * Contains methods for working Caret
 *
 * @todo get rid of this module and separate it for utility functions
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
   * Checks if caret is at the start of the passed Block's current input
   *
   * Cases:
   *  Native input:
   *   - if offset is 0, caret is at the start
   *  Contenteditable:
   *   - caret at the first text node and offset is 0 — caret is at the start
   *   - caret not at the first text node — we need to check left siblings for emptiness
   *   - caret offset > 0, but all left part is visible (nbsp) — caret is not at the start
   *   - caret offset > 0, but all left part is invisible (whitespaces) — caret is at the start
   *
   * @param input - Block instance to check caret position. If block contains several inputs, it will check the current input
   */
  public isAtStart(input: BlockInput): boolean {
    /** @tood test and move out */
    // /**
    //  * If Block does not contain inputs, treat caret as "at start"
    //  */
    // if (!block.focusable) {
    //   return true;
    // }

    const firstNode = $.getDeepestNode(input);

    if (firstNode === null) {
      return true;
    }

    /**
     * In case of native input, we simply check if offset is 0
     */
    if ($.isNativeInput(firstNode)) {
      return (firstNode as HTMLInputElement).selectionEnd === 0;
    }

    const selection = Selection.get();

    /**
     * Case when selection have been cleared programmatically, for example after CBS
     */
    if (!selection.anchorNode) {
      return false;
    }

    let focusNode = selection.focusNode;

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
     * A fragment of text before the caret position
     * Will be checked for visual-emptiness
     */
    const textBeforeCaret = focusNode.textContent.substring(0, focusOffset);

    /**
     * In case of
     * <div contenteditable>
     *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
     *     |adaddad         <-- focus node
     * </div>
     *
     * We need to check:
     * - all left siblings are empty
     * - there is not visible chars before the caret
     */
    if ($.isLineBreakTag(firstNode as HTMLElement) || $.isEmpty(firstNode)) {
      const leftSiblings = this.getHigherLevelSiblings(focusNode as HTMLElement, 'left');
      const allSiblingsAreInvisible = leftSiblings.every((node) => {
        /**
         * Workaround case when block starts with several <br>'s (created by SHIFT+ENTER)
         *
         * @see https://github.com/codex-team/editor.js/issues/726
         * We need to allow to delete such line breaks, so in this case caret IS NOT AT START
         */
        const regularLineBreak = $.isLineBreakTag(node);
        /**
         * Workaround SHIFT+ENTER in Safari, that creates <div><br></div> instead of <br>
         */
        const lineBreakInSafari = node.children.length === 1 && $.isLineBreakTag(node.children[0] as HTMLElement);
        const isLineBreak = regularLineBreak || lineBreakInSafari;

        return $.isEmpty(node) && !isLineBreak;
      });

      const noVisibleTextBeforeCaret = isCollapsedWhitespaces(textBeforeCaret);

      return allSiblingsAreInvisible && noVisibleTextBeforeCaret;

    /**
     * If first note is not empty and it is not a focused node, then caret is not at the start
     */
    } else if (focusNode !== firstNode) {
      return false;
    }

    /**
     * The simplest case: caret at the 0 position
     */
    if (textBeforeCaret.length === 0) {
      return true;
    }

    /**
     * Corner cases: there are whitespaces before the caret  " |Hello"
     *
     * There are two types of whitespaces in HTML:
     *
     * - Visible (&nbsp;) — if exists, caret is not at the start
     * - Invisible (regular trailing spaces, tabs, etc) - if exist, caret is at the start
     */
    const noVisibleTextBeforeCaret = isCollapsedWhitespaces(textBeforeCaret);

    return noVisibleTextBeforeCaret;
  }

  /**
   * Get's deepest last node and checks if offset is last node text length
   *
   * @returns {boolean}
   */
  public get isAtEnd(): boolean {
    const { currentBlock } = this.Editor.BlockManager;

    /**
     * If Block does not contain inputs, treat caret as "at end"
     */
    if (!currentBlock.focusable) {
      return true;
    }

    const selection = Selection.get();
    let focusNode = selection.focusNode;

    const lastNode = $.getDeepestNode(currentBlock.currentInput, true);

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
     * So we use child with focusOffset - 1 as new focusNode.
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
    const { BlockManager, BlockSelection } = this.Editor;

    /**
     * Clear previous selection since we possible will select the new Block
     */
    BlockSelection.clearSelection();

    /**
     * If Block is not focusable, just select (highlight) it
     */
    if (!block.focusable) {
      /**
       * Hide current cursor
       */
      window.getSelection()?.removeAllRanges();

      /**
       * Highlight Block
       */
      BlockSelection.selectBlock(block);
      BlockManager.currentBlock = block;

      return;
    }

    let element;

    switch (position) {
      case this.positions.START:
        element = block.firstInput;
        break;
      case this.positions.END:
        element = block.lastInput;
        break;
      default:
        element = block.currentInput;
    }

    if (!element) {
      return;
    }

    const nodeToSet = $.getDeepestNode(element, position === this.positions.END);
    const contentLength = $.getContentLength(nodeToSet);

    switch (true) {
      case position === this.positions.START:
        offset = 0;
        break;
      case position === this.positions.END:
      case offset > contentLength:
        offset = contentLength;
        break;
    }

    this.set(nodeToSet as HTMLElement, offset);

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
    const nodeToSet = $.getDeepestNode(input);

    switch (position) {
      case this.positions.START:
        this.set(nodeToSet as HTMLElement, 0);
        break;

      case this.positions.END:
        this.set(nodeToSet as HTMLElement, $.getContentLength(nodeToSet));
        break;

      default:
        if (offset) {
          this.set(nodeToSet as HTMLElement, offset);
        }
    }

    currentBlock.currentInput = input;
  }

  /**
   * Creates Document Range and sets caret to the element with offset
   *
   * @param {HTMLElement} element - target node.
   * @param {number} offset - offset
   */
  public set(element: HTMLElement, offset = 0): void {
    const scrollOffset = 30;
    const { top, bottom } = Selection.setCursor(element, offset);
    const { innerHeight } = window;

    /**
     * If new cursor position is not visible, scroll to it
     */
    if (top < 0) {
      window.scrollBy(0, top - scrollOffset);
    } else if (bottom > innerHeight) {
      window.scrollBy(0, bottom - innerHeight + scrollOffset);
    }
  }

  /**
   * Set Caret to the last Block
   * If last block is not empty, append another empty block
   */
  public setToTheLastBlock(): void {
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
   * @param {boolean} force - pass true to skip check for caret position
   */
  public navigateNext(force = false): boolean {
    const { BlockManager } = this.Editor;
    const { currentBlock, nextBlock } = BlockManager;
    const { nextInput } = currentBlock;
    const isAtEnd = this.isAtEnd;
    let blockToNavigate = nextBlock;

    const navigationAllowed = force || isAtEnd;

    /** If next Tool`s input exists, focus on it. Otherwise set caret to the next Block */
    if (nextInput && navigationAllowed) {
      this.setToInput(nextInput, this.positions.START);

      return true;
    }

    if (blockToNavigate === null) {
      /**
       * This code allows to exit from the last non-initial tool:
       * https://github.com/codex-team/editor.js/issues/1103
       */

      /**
       * 1. If there is a last block and it is default, do nothing
       * 2. If there is a last block and it is non-default --> and caret not at the end <--, do nothing
       *    (https://github.com/codex-team/editor.js/issues/1414)
       */
      if (currentBlock.tool.isDefault || !navigationAllowed) {
        return false;
      }

      /**
       * If there is no nextBlock, but currentBlock is not default,
       * insert new default block at the end and navigate to it
       */
      blockToNavigate = BlockManager.insertAtEnd() as Block;
    }

    if (navigationAllowed) {
      this.setToBlock(blockToNavigate, this.positions.START);

      return true;
    }

    return false;
  }

  /**
   * Set's caret to the previous Tool`s input or Block
   * Before moving caret, we should check if caret position is start of the Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {boolean} force - pass true to skip check for caret position
   */
  public navigatePrevious(force = false): boolean {
    const { currentBlock, previousBlock } = this.Editor.BlockManager;

    if (!currentBlock) {
      return false;
    }

    const { previousInput, currentInput } = currentBlock;
    const isAtStart = this.isAtStart(currentInput);

    console.log('isAtStart', isAtStart);

    const navigationAllowed = force || isAtStart;

    /** If previous Tool`s input exists, focus on it. Otherwise set caret to the previous Block */
    if (previousInput && navigationAllowed) {
      this.setToInput(previousInput, this.positions.END);

      return true;
    }

    if (previousBlock !== null && navigationAllowed) {
      this.setToBlock(previousBlock as Block, this.positions.END);

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

    const newRange = document.createRange();

    newRange.selectNode(shadowCaret);
    newRange.extractContents();
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
      fragment.appendChild(new Text());
    }

    const lastChild = fragment.lastChild as ChildNode;

    range.deleteContents();
    range.insertNode(fragment);

    /** Cross-browser caret insertion */
    const newRange = document.createRange();

    const nodeToSetCaret = lastChild.nodeType === Node.TEXT_NODE ? lastChild : lastChild.firstChild;

    if (nodeToSetCaret !== null && nodeToSetCaret.textContent !== null) {
      newRange.setStart(nodeToSetCaret, nodeToSetCaret.textContent.length);
    }

    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  /**
   * Get all first-level (first child of [contenteditable]) siblings from passed node
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
   * @param {HTMLElement} from - element from which siblings should be searched
   * @param {'left' | 'right'} direction - direction of search
   * @returns {HTMLElement[]}
   */
  private getHigherLevelSiblings(from: HTMLElement, direction?: 'left' | 'right'): HTMLElement[] {
    let current = from;
    const siblings = [];
    const sibling = direction === 'left' ? 'previousSibling' : 'nextSibling';

    if (from.nodeType === Node.TEXT_NODE) {
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
     * Find passed node's firs-level parent (in example - blockquote)
     */
    while (current.parentNode && (current.parentNode as HTMLElement).contentEditable !== 'true') {
      current = current.parentNode as HTMLElement;
    }




    /**
     * Find all left/right siblings
     */
    while (current[sibling]) {
      current = current[sibling] as HTMLElement;
      siblings.push(current);
    }

    return siblings;
  }
}
