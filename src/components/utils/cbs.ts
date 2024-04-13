
/**
 * Set of utils for working with a Cross-Block Selection and Cross-Input Selection
 * -------------------------
 */

import type { API, BlockAPI } from '@types';
import { getClosestElement } from '../dom';
import { isEmpty } from './empty';


/**
 * Blocks input can be a native input or a contenteditable element
 */
type BlockInput = HTMLElement;

/**
 * Describes an intersected input inside a block
 */
type BlockInputIntersected = {
  input: BlockInput,
  block: BlockAPI,
};

export interface CrossInputSelection {
  blocks: BlockAPI[];
  inputs: BlockInputIntersected[];
  range: Range | null;
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


/**
 * Returns a list of blocks and inputs that intersect with the given range
 *
 * @param api - Editor API
 */
export function useCrossInputSelection(api: API): CrossInputSelection {
  const selection = window.getSelection();

  /**
   * @todo handle native inputs
   */

  if (selection === null || !selection.rangeCount || selection.isCollapsed) {
    return {
      blocks: [],
      inputs: [],
      range: null,
    };
  }

  const range = selection.getRangeAt(0);

  const intersectedBlocks = findIntersectedBlocks(range, api);
  const intersectedInputs = findIntersectedInputs(intersectedBlocks, range);

  return {
    blocks: intersectedBlocks,
    inputs: intersectedInputs,
    range,
  };
}

