import Module from '../__module';
import type Block from '../block';
import type { BlockAPI } from '../../../types';
import { areBlocksMergeable } from '../utils/blocks';
import { BlockInput, BlockInputIntersected, findNextSelectableBlock, findPreviousSelectableBlock, removeRangePartFromInput, useCrossInputSelection } from '../utils/cbs';
import { ModuleConfig } from 'src/types-internal/module-config';
import { isPrintableKey } from '../utils';


/**
 * @todo fix Inline Toolbar position on cross-block selection
 * @todo handle backspace at start / delete at end
 * @todo handle char typing in cross-input selection as delete
 * @todo handle cross-block selection to block with enableLineBreaks():
 *   1. Only If 2 blocks selected
 *   2. Clear selection part from that block
 *   3. Leave only selection part in the second block
 *   4. Prevent cross-input selection
 * @todo cmd+A should select 1 block, second cmd+A should select all blocks
 * @todo handle cross-input selection with keyboard
 * @todo when cbs the inline-toolbar should contain intersected lists of tools for selected blocks
 * @todo emit "selection changed" event to hide/show the Inline Toolbar
 * @todo select quote caption and move selection to the previous block. Do not release mouse button, and press delete. Quote should not be deleted
 * @todo enter in image caption should not creare the new caption
*
 * @todo select few blocks, do not release mouse button, type something. Layout should not be broken
 * @todo select part of parargrapt and the whole next header, press Enter, then press Enter again. New block should be created, now just hard line break is added
 *
 * What is done:
 * - Backspace handling
 * - Manual tripple click selection of the whole input
 * - Enter handling
 */


/**
 *
 */
export default class CrossInputSelection extends Module {
  /**
   *
   * @param {...any} params
   * @param moduleInitOptions
   */
  constructor(moduleInitOptions: ModuleConfig) {
    super(moduleInitOptions);
  }

  /**
   *
   */
  public prepare(): void {
    this.listeners.on(this.Editor.UI.nodes.redactor, 'mouseup', () => {
      this.removeSelectionFromUnselectableBlocks();
    });

    this.listeners.on(this.Editor.UI.nodes.redactor, 'keyup', () => {
      this.removeSelectionFromUnselectableBlocks();
    });

    this.readOnlyMutableListeners.on(this.Editor.UI.nodes.redactor, 'keydown', (event: KeyboardEvent) => {
      this.keydown(event);
    }, {
      capture: true,
    });

    this.listeners.on(this.Editor.UI.nodes.redactor, 'click', (event: MouseEvent) => { // @todo implement generics in Listeners
      /**
       * Handle tripple click on a block.
       * 4 or more clicks behaves the same
       */
      if (event.detail > 3) {
        this.handleTripleClick(event);
      }
    });
  }

  /**
   * When user makes a tripple click to select the whole block, range.endContainer will be a next block container.
   * To workaround this browser behavior, we should manually select the whole input
   * @param event
   */
  private handleTripleClick(event: MouseEvent): void {
    const currentClickedElement = event.target as HTMLElement;

    /**
     * @todo support native inputs
     */
    const currentInput = currentClickedElement.closest('[contenteditable=true]');

    if (!currentInput) {
      return;
    }

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!range) {
      return;
    }

    range.selectNodeContents(currentInput);
  }

  /**
   *
   * @param event
   */
  private keydown(event: KeyboardEvent): void {
    const api = this.Editor.API.methods;

    const { isCrossInputSelection } = useCrossInputSelection(api);



    /**
     * We should prevent default behavior for all keys except a few cases:
     * 1. arrows navigation
     */
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
      console.log('Arrow keydown handler — native behavior')
      return;
    }





    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        /**
         * If selection is not cross-input, do nothing
         */
        if (!isCrossInputSelection) {
          console.log('no CIS, default Delete/Backspace Key behavior');

          return;
        }

        /**
         * Handle case when user presses DELETE or BACKSPACE while having mouse button pressed with cross-input selection
         */
        this.removeSelectionFromUnselectableBlocks();

        this.handleDelete(event, event.key === 'Backspace');
        return;
      case 'Enter':
        event.preventDefault();
        this.handleEnter();
        return;
      case 'ArrowRight':
      case 'ArrowDown':
        this.handleArrowRightOrDown(event);
        return;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.handleArrowLeftOrUp(event);
        return;
      case 'Tab':
        this.handleTab(event);
        return;
    }

    if (isPrintableKey(event.keyCode) && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
      /**
       * If selection is not cross-input, do nothing
      */
      if (!isCrossInputSelection) {
        console.log('no CIS, default Printable Key behavior');

        return;
      }

      event.preventDefault();
      this.handlePrintableKey(event);
    }
  }

  private handlePrintableKey(event: KeyboardEvent): void {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    this.handleDelete(event);

    /**
     * Insert a char to the caret position
     */
    /**
     * If event.key length >1 that means key is special (e.g. Enter or Dead or Unidentified).
     * So we use empty string
     *
     * @see https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key
     * @todo fix insertContentAtCaretPosition and use it instead
     */
    // this.Editor.Caret.insertContentAtCaretPosition(event.key.length > 1 ? '' : event.key);
    range?.insertNode(document.createTextNode(event.key.length > 1 ? '' : event.key));

    return;
  }

  private handleTab(event: KeyboardEvent): void {
    console.log('handle tab (not implemented)');
  }

  private handleArrowLeftOrUp(event: KeyboardEvent): void {
    console.log('handle arrow left or up (not implemented)');
  }

  private handleArrowRightOrDown(event: KeyboardEvent): void {
    console.log('handle arrow right or down (not implemented)');
  }

  private handleEnter(): void {
    const api = this.Editor.API.methods;

    useCrossInputSelection(api, {
      onSingleFullySelectedInput: () => {
        console.warn('Enter / onSingleFullySelectedInput. @todo: clear input and add the new block below');
      },
      onSinglePartiallySelectedInput: () => {
        console.warn('Enter / onSinglePartiallySelectedInput: @todo: clear selection and split block');
      },
      onCrossInputSelection({ range, firstInput, lastInput, middleInputs, blocks, inputs }){
        console.info('Enter / onCrossInputSelection: remove selected content and set caret to the start of the next block');
        /**
         * Now we need:
         * 1. Get first input and remove selected content starting from the beginning of the selection to the end of the input
         * 2. Get last input and remove selected content starting from the beginning of the input to the end of the selection
         * 3. Get all inputs between first and last and remove them (and blocks if they are empty after removing inputs)
         * 4. Set caret to the start of the last input
         */
        removeRangePartFromInput(range, firstInput.input, { fromRangeStartToInputEnd: true });
        removeRangePartFromInput(range, lastInput.input, { fromInputStartToRangeEnd: true });

        const removedInputs: BlockInput[] = [];
        middleInputs.forEach(({ input }: BlockInputIntersected) => {
          removedInputs.push(input);
          input.remove();
        });

        /**
         * Remove blocks if they are empty
         */
        blocks.forEach((block: BlockAPI) => {
          if (block.inputs.every(input => removedInputs.includes(input))) {
            api.blocks.delete(block.id);
          }
        });

        window.getSelection()?.collapseToEnd();
      }
    });
  }

  /**
   *
   * @param event
   * @param api
   * @param isBackspace @todo suppport
   */
  private handleDelete(event: KeyboardEvent, isBackspace = false): void {
    const api = this.Editor.API.methods;

    const {
      blocks: intersectedBlocks,
      inputs: intersectedInputs,
      range,
      firstInput,
      lastInput,
      middleInputs,
      isCrossBlockSelection,
    } = useCrossInputSelection(api);

    if (!intersectedBlocks.length && !intersectedInputs.length || !range) {
      return;
    }

    /**
     * Handle case when user select the whole block.
     * We should not allow to delete it along with tool and .ce-block__content.
     * We should delete a Block via api instead
     */
    if (intersectedInputs.length === 1) {
      const { input, block } = intersectedInputs[0];
      const isWholeInputSelected = range.toString() === input.textContent;

      if (isWholeInputSelected) {
        console.log('OPA');

        api.blocks.delete(block.id);

        event.preventDefault();
      } else {
        console.log('default behavior');

        return;
      }
    }

    if (!isCrossBlockSelection) {
      return;
    }

    event.preventDefault();


    /**
     * @todo handle case when first block === last block
     */

    /**
     * Now we need:
     * 1. Get first input and remove selected content starting from the beginning of the selection to the end of the input
     * 2. Get last input and remove selected content starting from the beginning of the input to the end of the selection
     * 3. Get all inputs between first and last and remove them (and blocks if they are empty after removing inputs)
     * 4. Merge first and last blocks if they are mergeable. Otherwise, navigate to the previous block
     */
    removeRangePartFromInput(range, firstInput!.input, { fromRangeStartToInputEnd: true });
    removeRangePartFromInput(range, lastInput!.input, { fromInputStartToRangeEnd: true });

    const removedInputs: BlockInput[] = [];
    middleInputs.forEach(({ input }: BlockInputIntersected) => {
      removedInputs.push(input);
      input.remove();
    });

    /**
     * Remove blocks if they are empty
     */
    intersectedBlocks.forEach((block: BlockAPI) => {
      if (block.inputs.every(input => removedInputs.includes(input))) {
        api.blocks.delete(block.id);
      }
    });

    const startingBlockApi = intersectedBlocks[0];
    const endingBlockApi = intersectedBlocks[intersectedBlocks.length - 1];

    /**
     * get rid of this by adding 'merge' api method
     */
    const startingBlock = this.Editor.BlockManager.getBlockById(startingBlockApi.id);
    const endingBlock = this.Editor.BlockManager.getBlockById(endingBlockApi.id);

    const bothBlocksMergeable = areBlocksMergeable(startingBlock!, endingBlock!);

    /**
     * If Blocks could be merged, do it
     * Otherwise, just navigate to the first block
     */
    if (bothBlocksMergeable) {
      console.log('merge');
      this.mergeBlocks(startingBlock!, endingBlock!);
    } else {
      console.log('navigate');
      this.Editor.Caret.setToBlock(startingBlock!, this.Editor.Caret.positions.START);
    }
  }

  /**
   * Merge passed Blocks
   *
   * @param targetBlock - to which Block we want to merge
   * @param blockToMerge - what Block we want to merge
   */
  private mergeBlocks(targetBlock: Block, blockToMerge: Block): void {
    const { BlockManager, Caret, Toolbar } = this.Editor;

    Caret.createShadow(targetBlock.pluginsContent);

    BlockManager
      .mergeBlocks(targetBlock, blockToMerge)
      .then(() => {
        // window.requestAnimationFrame(() => {
        /** Restore caret position after merge */
        Caret.restoreCaret(targetBlock.pluginsContent as HTMLElement);
        // targetBlock.pluginsContent.normalize();s
        // Toolbar.close();
        // });
      });
  }


  /**
   * Prevents selection of unselectable Blocks (like, Code, Table, etc)
   */
  private removeSelectionFromUnselectableBlocks(): void {
    const api = this.Editor.API.methods;

    const { blocks: intersectedBlocks, inputs: intersectedInputs, range } = useCrossInputSelection(api);

    if (!intersectedBlocks.length && !intersectedInputs.length || !range) {
      return;
    }

    /**
     * If selection is not cross-input, do nothing
     */
    if (intersectedBlocks.length < 2) {
      return;
    }

    const startingBlock = intersectedBlocks[0];
    const endingBlock = intersectedBlocks[intersectedBlocks.length - 1];

    /**
     * If selection started in a Block that is not selectable, remove range from this Block to the next selectable Block
     */
    if (!startingBlock?.selectable) {
      const nextSelectableBlock = findNextSelectableBlock(startingBlock, api);

      if (nextSelectableBlock !== null) {
        range.setStart(nextSelectableBlock.holder, 0);
      }
    }

    /**
     * If selection ended in a Block that is not selectable, remove range from that Block to the previous selectable Block
     */
    if (!endingBlock?.selectable) {
      const previousSelectableBlock = findPreviousSelectableBlock(endingBlock, api);

      if (previousSelectableBlock !== null) {
        range.setEnd(previousSelectableBlock.holder, previousSelectableBlock.holder.childNodes.length);
      }
    }
  }
}
