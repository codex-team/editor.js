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
      if (event.detail > 2) {
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
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ArrowDown':
        console.log('Arrow keydown handler — native behavior')
        return;

      case 'Delete':
      case 'Backspace':
        /**
         * Handle case when user presses DELETE or BACKSPACE while having mouse button pressed with cross-input selection
         */
        this.removeSelectionFromUnselectableBlocks(); // @todo think about making it a part of the composable

        this.handleDelete(event, event.key === 'Backspace');
        return;
      case 'Enter':
        this.handleEnter(event);
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
      this.handlePrintableKey(event);
    }
  }

  private handlePrintableKey(event: KeyboardEvent): void {

    const api = this.Editor.API.methods;
    const { BlockManager, Caret } = this.Editor;

    useCrossInputSelection(api, {
      onSingleFullySelectedInput: ({ input }, { clear, insertChar } ) => {
        console.info('Printable Key / onSingleFullySelectedInput: clear input');

        event.preventDefault();

        clear();
        insertChar(event.key.length > 1 ? '' : event.key);
      },
      onSinglePartiallySelectedInput: () => {
        console.info('Printable Key / onSinglePartiallySelectedInput: default behaviour');
      },
      onCrossInputSelection: ({ blocks, clear, insertChar }) => {
        console.info('Printable Key / onCrossInputSelection: remove selected content and merge blocks if possible');

        event.preventDefault();

        /**
         * Now we need:
         * 1. Clear content under the selection
         * 2. Merge first and last blocks if they are mergeable. Otherwise, navigate to the previous block
        */
        clear();

        /** @todo make merge() helper */
        const startingBlockApi = blocks[0];
        const endingBlockApi = blocks[blocks.length - 1];

        /**
         * @todo get rid of this by adding 'merge' api method
         */
        const startingBlock = BlockManager.getBlockById(startingBlockApi.id);
        const endingBlock = BlockManager.getBlockById(endingBlockApi.id);

        const bothBlocksMergeable = areBlocksMergeable(startingBlock!, endingBlock!);

        /**
         * If Blocks could be merged, do it
         * Otherwise, just navigate to the first block
         */
        if (bothBlocksMergeable) {
          this.mergeBlocks(startingBlock!, endingBlock!);
        } else {
          Caret.setToBlock(startingBlock!, this.Editor.Caret.positions.START);
        }

        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        /**
         * Insert a char to the caret position
         */
        insertChar(event.key.length > 1 ? '' : event.key);
      }
    });
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

  private handleEnter(event: KeyboardEvent): void {
    const api = this.Editor.API.methods;

    useCrossInputSelection(api, {
      onSingleFullySelectedInput: (input, { clear }) => {
        console.info('Enter / onSingleFullySelectedInput: clear input and add the new block below');
        event.preventDefault();
        clear();

        const blockAdded = api.blocks.insert();

        api.caret.setToBlock(blockAdded, 'start');
      },
      onSinglePartiallySelectedInput: () => {
        console.warn('Enter / onSinglePartiallySelectedInput: @todo: clear selection and split block');
        event.preventDefault();
      },
      onCrossInputSelection: ({ range, firstInput, lastInput, middleInputs, blocks, clear }) => {
        console.info('Enter / onCrossInputSelection: remove selected content and set caret to the start of the next block');

        event.preventDefault();

        /**
         * Now we need:
         * 1. Clear content under the selection
         * 2. Set caret to the start of the last input
         */
        clear();

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

    useCrossInputSelection(api, {
      atStartOfInput: ({ input, block }, { mergeOrNavigatePrevious }) => {
        console.log('Delete / atStartOfFirstInput: merge or navigate to the previous block');

        event.preventDefault();

        const isFirstInputInBlock = input === block.inputs[0];

        if (isFirstInputInBlock) {
          mergeOrNavigatePrevious();
        } else {
          this.Editor.Caret.navigatePrevious();
        }
      },
      onSingleFullySelectedInput: ({ input }, { clear }) => {
        console.info('Delete / onSingleFullySelectedInput: clear input');

        event.preventDefault();

        clear();
      },
      onSinglePartiallySelectedInput: () => {
        console.info('Delete / onSinglePartiallySelectedInput: default behaviour');
      },
      onCrossInputSelection: ({ range, firstInput, lastInput, middleInputs, blocks, clear, mergeOrNavigatePrevious }) => {
        console.info('Delete / onCrossInputSelection: remove selected content and merge blocks if possible');

        event.preventDefault();

        /**
         * Now we need:
         * 1. Clear content under the selection
         * 2. Merge first and last blocks if they are mergeable. Otherwise, navigate to the previous block
        */
        clear();
        mergeOrNavigatePrevious();
      }
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
