import Module from '../__module';
import type Block from '../block';
import type { API, BlockAPI } from '../../../types';
import { areBlocksMergeable } from '../utils/blocks';
import Dom from '../dom';
import { SelectionChanged } from '../events';
import { useCrossInputSelection } from '../utils/cbs';
import { ModuleConfig } from 'src/types-internal/module-config';


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

    /**
     * Handle selection change to manipulate Inline Toolbar appearance
     */
    // const selectionChangeDebounced = debounce(() => {
    //   this.removeSelectionFromUnselectableBlocks();
    // }, 30);

    // this.eventsDispatcher.on(SelectionChanged, selectionChangeDebounced);
  }

  /**
   *
   */
  public prepare(): void {
    this.listeners.on(this.Editor.UI.nodes.redactor, 'mouseup', () => {
      console.log('mouseup');
      this.removeSelectionFromUnselectableBlocks();
    });
  }

  /**
   *
   * @param event
   */
  public keydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        /**
         * Handle case when user presses DELETE or BACKSPACE while having mouse button pressed with cross-input selection
         */
        this.removeSelectionFromUnselectableBlocks();

        this.handleDelete(event, event.key === 'Backspace');
        break;
    }
  }

  /**
   *
   * @param event
   * @param api
   * @param isBackspace
   */
  private handleDelete(event: KeyboardEvent, isBackspace = false): void {
    const api = this.Editor.API.methods;

    const { blocks: intersectedBlocks, inputs: intersectedInputs, range } = useCrossInputSelection(api);

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


    const isCrossBlockSelection = intersectedBlocks.length > 1;


    if (!isCrossBlockSelection) {
      return;
    }

    event.preventDefault();

    const removedInputs: BlockInput[] = [];

    /**
     * @todo handle case when first block === last block
     */

    /**
     * Now we need:
     * 1. Get first input and remove selected content starting from the beginning of the selection to the end of the input
     * 2. Get last input and remove selected content starting from the beginning of the input to the end of the selection
     * 3. Get all inputs between first and last and remove them (and blocks if they are empty after removing inputs)
     */
    intersectedInputs.forEach(({ input, block }: BlockInputIntersected, index: number) => {
      const rangeClone = range.cloneRange();


      if (index === 0 || index === intersectedInputs.length - 1) {
        if (index === 0) {
          rangeClone.selectNodeContents(input);
          rangeClone.setStart(range.startContainer, range.startOffset);
        } else if (index === intersectedInputs.length - 1) {
          rangeClone.selectNodeContents(input);
          rangeClone.setEnd(range.endContainer, range.endOffset);
        }

        rangeClone.extractContents();
      } else {
        removedInputs.push(input);

        input.remove();
      }
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

    // this.Editor.Caret.setToBlock(startingBlock!, 'end');
    const bothBlocksMergeable = areBlocksMergeable(startingBlock!, endingBlock!);

    /**
     * If Blocks could be merged, do it
     * Otherwise, just navigate to the next block
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
      const blockIndex = api.blocks.getBlockIndex(startingBlock.id);

      /**
       * @todo find next selectable block, not just the next one
       */
      const nextBlock = api.blocks.getBlockByIndex(blockIndex + 1);

      if (!nextBlock) {
        return;
      }

      const nextBlockElement = nextBlock.holder;

      range.setStart(nextBlockElement, 0);
    }

    /**
     * If selection ended in a Block that is not selectable, remove range from that Block to the previous selectable Block
     */
    if (!endingBlock?.selectable) {
      const blockIndex = api.blocks.getBlockIndex(endingBlock.id);

      /**
       * @todo find previous selectable block, not just the previous one
       */
      const previousBlock = api.blocks.getBlockByIndex(blockIndex - 1);

      if (!previousBlock) {
        return;
      }

      const previousBlockElement = previousBlock.holder;

      range.setEnd(previousBlockElement, previousBlockElement.childNodes.length);
    }
  }
}
