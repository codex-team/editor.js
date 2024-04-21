
/**
 * Set of utils for working with a Cross-Block Selection and Cross-Input Selection
 * -------------------------
 */

import type { API, BlockAPI } from '@types';
import Dom, { getClosestElement } from '../dom';
import { isEmpty } from './empty';
import { isAtStart } from './selection'


/**
 * Blocks input can be a native input or a contenteditable element
 */
export type BlockInput = HTMLElement;

/**
 * Describes an intersected input inside a block
 */
export type BlockInputIntersected = {
  input: BlockInput,
  block: BlockAPI,
};

export interface MaybeCrossInputSelection {
  isCrossBlockSelection: boolean;
  isCrossInputSelection: boolean;
  blocks: BlockAPI[];
  inputs: BlockInputIntersected[];
  range: Range | null;
  firstInput: BlockInputIntersected | null;
  lastInput: BlockInputIntersected | null;
  middleInputs: BlockInputIntersected[];
}

export type CrossInputSelection = MaybeCrossInputSelection & {
  isCrossInputSelection: true;
  firstInput: BlockInputIntersected;
  lastInput: BlockInputIntersected;
  middleInputs: BlockInputIntersected[];
  range: Range;
  clear: () => void;
  insertChar: (char: string) => void;
  mergeOrNavigatePrevious: () => Promise<void>;
}

/**
 * Return a Block API
 *
 * @param wrapper - block wrapper element (.ce-block)
 * @param api - Editor API
 */
function resolveBlockByWrapper(wrapper: Element, api: API): BlockAPI {
  const blockId = wrapper.getAttribute('data-id');

  if (blockId === null) {
    throw Error('Block wrapper is lack of data-id attribute');
  }

  const block = api.blocks.getById(blockId);

  if (block === null) {
    throw Error(`Block with id ${blockId} not found`);
  }

  return block;
}

/**
 * Find Blocks that contains passed selection
 *
 * @param range - cross-block selection range
 * @param api - Editor API
 */
function findIntersectedBlocks(range: Range, api: API): BlockAPI[] {
  const startContainer = getClosestElement(range.startContainer);
  const endContainer = getClosestElement(range.endContainer);

  const startBlockWrapper = startContainer?.closest('.ce-block');
  const endBlockWrapper = endContainer?.closest('.ce-block');

  if (isEmpty(startBlockWrapper) || isEmpty(endBlockWrapper)) {
    return [];
  }

  /**
   * Range is inside a single block
   */
  if (startBlockWrapper === endBlockWrapper) {
    return [
      resolveBlockByWrapper(startBlockWrapper, api),
    ];
  }

  const blocks = [];

  let block: Element | null = startBlockWrapper;

  /**
   * Add all blocks between start and end
   */
  while (block !== null) {
    blocks.push(block);

    if (block === endBlockWrapper) {
      break;
    }

    block = block.nextElementSibling;
  }

  return blocks.map(wrapper => resolveBlockByWrapper(wrapper, api));
}


/**
 * Each block may contain multiple inputs
 * This function finds all inputs that are intersected by passed range
 *
 * @param intersectedBlocks - blocks that contain selection
 * @param range - selection range
 */
function findIntersectedInputs(intersectedBlocks: BlockAPI[], range: Range): BlockInputIntersected[] {
  /**
   * Loop over blocks and check if inputs are intersected with the range
   */
  return intersectedBlocks.reduce((acc: BlockInputIntersected[], block: BlockAPI) => {
    const inputs = block?.inputs;

    if (!inputs) {
      return acc;
    }

    inputs.forEach((input: BlockInput) => {
      if (range.intersectsNode(input)) {
        acc.push({
          input,
          block,
        });
      }
    });

    return acc;
  }, []);
}

/**
 * Return a previeous block that can be selected
 *
 * @param block - block to start from
 * @param api - Editor API
 */
export function findPreviousSelectableBlock(block: BlockAPI, api: API): BlockAPI | null {
  const blockIndex = api.blocks.getBlockIndex(block.id);

  if (blockIndex === 0) {
    return null;
  }

  const previousBlock = api.blocks.getBlockByIndex(blockIndex - 1);

  if (previousBlock === undefined) {
    return null;
  }

  if (previousBlock.selectable) {
    return previousBlock;
  }

  return findPreviousSelectableBlock(previousBlock, api);
}

/**
 * Return a next block that can be selected
 *
 * @param block - block to start from
 * @param api - Editor API
 */
export function findNextSelectableBlock(block: BlockAPI, api: API): BlockAPI | null {
  const blockIndex = api.blocks.getBlockIndex(block.id);
  const nextBlock = api.blocks.getBlockByIndex(blockIndex + 1);

  if (nextBlock === undefined) {
    return null;
  }

  if (nextBlock.selectable) {
    return nextBlock;
  }

  return findNextSelectableBlock(nextBlock, api);
}

type RemoveRangePartFromInputOptionsEnding = {
  fromRangeStartToInputEnd: true;
}

type RemoveRangePartFromInputOptionsStarting = {
  fromInputStartToRangeEnd: true;
}

type RemoveRangePartFromInputOptions = RemoveRangePartFromInputOptionsEnding | RemoveRangePartFromInputOptionsStarting;

/**
 * Removes a part of the range from the input:
 *  - from the range start to the end of the input
 *  - from the start of the input to the range end
 *
 * @param range
 * @param input
 * @param options
 */
export function removeRangePartFromInput(range: Range, input: HTMLElement, options: RemoveRangePartFromInputOptions): void {
  const rangeClone = range.cloneRange();

  rangeClone.selectNodeContents(input);

  if ('fromRangeStartToInputEnd' in options) {
    rangeClone.setStart(range.startContainer, range.startOffset);
  } else {
    rangeClone.setEnd(range.endContainer, range.endOffset);
  }

  rangeClone.extractContents();
}

interface CBSHelpers {
  clear: () => void;
  insertChar: (char: string) => void;
  mergeOrNavigatePrevious: () => Promise<void>;
}
interface CBSOptions {
  onSingleFullySelectedInput?: (input: BlockInputIntersected, helpers: CBSHelpers) => void;
  onSinglePartiallySelectedInput?: (input: BlockInputIntersected) => void;
  onCrossInputSelection?: (selection: CrossInputSelection) => void;
  atStartOfInput?: (input: BlockInputIntersected) => void;
  atEndOfInput?: (input: BlockInputIntersected) => void;
}

function insertChar(char: string): void {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  if (!range) {
    return;
  }

  /**
   * If event.key length >1 that means key is special (e.g. Enter or Dead or Unidentified).
   * So we use empty string
   *
   * @see https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key
   * @todo fix insertContentAtCaretPosition and use it instead
   */
  // this.Editor.Caret.insertContentAtCaretPosition(event.key.length > 1 ? '' : event.key);
  range?.insertNode(document.createTextNode(char));
  range?.collapse(false);
}

/**
 * If Blocks could be merged, do it
 * Otherwise, just navigate to the target block
 */
async function mergeOrNavigate(api: API, targetBlock: BlockAPI, blockToMerge: BlockAPI) {
  const bothBlocksMergeable = api.blocks.areBlocksMergeable(targetBlock, blockToMerge);

  if (bothBlocksMergeable) {
    await api.blocks.merge(targetBlock, blockToMerge, { restoreCaret: true });
  } else {
    api.caret.setToBlock(targetBlock, 'end');
  }
}

/**
 * Returns a list of blocks and inputs that intersect with the given range
 *
 * @param api - Editor API
 */
export function useCrossInputSelection(api: API, options?: CBSOptions): MaybeCrossInputSelection {
  const selection = window.getSelection();

  /**
   * @todo handle native inputs
   */

  if (selection === null || !selection.rangeCount) {
    console.log('No selection');
    return {
      blocks: [],
      inputs: [],
      range: null,
      isCrossBlockSelection: false,
      isCrossInputSelection: false,
      firstInput: null,
      lastInput: null,
      middleInputs: [],
    };
  }

  const range = selection.getRangeAt(0);

  const intersectedBlocks = findIntersectedBlocks(range, api);
  const intersectedInputs = findIntersectedInputs(intersectedBlocks, range);

  const isCrossBlockSelection = intersectedBlocks.length > 1;

  const firstBlock = intersectedBlocks[0]; // startingBlock?
  const lastBlock = intersectedBlocks[intersectedBlocks.length - 1];
  const firstInput = intersectedInputs[0] ?? null;
  const lastInput = intersectedInputs[intersectedInputs.length - 1] ?? null;
  const middleInputs = intersectedInputs.slice(1, -1);

  /**
   * @todo handle case when fisrtInput or lastInput is null
   * and remove ? below
   */


  /**
   * @todo handle case when first block === last block (one block with several inputs)
   */

  if (intersectedInputs.length === 1) {
    const { input, block } = firstInput;
    const isInputEmpty = Dom.isEmpty(input);
    const isWholeInputSelected = !isInputEmpty && range.toString() === input.textContent;
    const atStart = isAtStart(firstInput?.input);

    if (isWholeInputSelected) {

      /**
       * Utility function to clear the content under the selection:
       */
      const clear = function clear(): void {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (!range) {
          return;
        }

        range.selectNodeContents(input);
        range.deleteContents();
      }

      options?.onSingleFullySelectedInput?.(firstInput, { clear, insertChar });
    } else if (atStart) {
      const mergeOrNavigatePrevious = async function mergeOrNavigatePrevious() {
        /**
         * In this a case when the first and the last block are the same we need to find a previous one
         */
        const lastBlockIndex = api.blocks.getBlockIndex(lastBlock.id);

        if (lastBlockIndex === null || lastBlockIndex === 0) {
          return;
        }

        const previousBlock = api.blocks.getBlockByIndex(lastBlockIndex - 1);

        if (previousBlock === undefined) {
          return;
        }

        await mergeOrNavigate(api, previousBlock, lastBlock);
      }

      options?.atStartOfInput?.(firstInput, { mergeOrNavigatePrevious });
    } else {
      options?.onSinglePartiallySelectedInput?.(firstInput);
    }
  } else {
    /**
     * Utility function to clear the content under the selection:
     * 1. Get first input and remove selected content starting from the beginning of the selection to the end of the input
     * 2. Get last input and remove selected content starting from the beginning of the input to the end of the selection
     * 3. Get all inputs between first and last and remove them (and blocks if they are empty after removing inputs)
     */
    const clear = function clear() {
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
      intersectedBlocks.forEach((block: BlockAPI) => {
        if (block.inputs.every(input => removedInputs.includes(input))) {
          api.blocks.delete(block.id);
        }
      });
    }

    const mergeOrNavigatePrevious = async function mergeOrNavigatePrevious() {
      await mergeOrNavigate(api, firstBlock, lastBlock);
    }

    options?.onCrossInputSelection?.({
      isCrossBlockSelection,
      isCrossInputSelection: true,
      blocks: intersectedBlocks,
      inputs: intersectedInputs,
      range,
      firstInput,
      lastInput,
      middleInputs,
      clear,
      insertChar,
      mergeOrNavigatePrevious,
    });
  }

  return {
    isCrossBlockSelection,
    isCrossInputSelection: intersectedInputs.length > 1,
    blocks: intersectedBlocks,
    inputs: intersectedInputs,
    range,
    firstInput,
    lastInput,
    middleInputs,
  };
}

