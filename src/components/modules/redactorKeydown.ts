import Module from '../__module';
import type Block from '../block';

/**
 *
 * @param node
 */
function getClosestElement(node: Node): Element {
  if (node instanceof Element) {
    return node;
  }

  return getClosestElement(node.parentElement);
}

type BlockIntersected = {
  block: Element,
  start: boolean,
  end: boolean,
};

/**
 * Find .ce-blocks that contains passed selection
 *
 * @param selection
 */
function findIntersectedBlocks(selection: Selection): Block[] {
  const range = selection.getRangeAt(0);

  console.log('range', range);

  const startContainer = getClosestElement(range.startContainer);
  const endContainer = getClosestElement(range.endContainer);

  const startBlock = startContainer.closest('.ce-block');
  const endBlock = endContainer.closest('.ce-block');

  if (startBlock === endBlock) {
    return [ startBlock ];
  }

  const blocks = [];

  let block = startBlock;

  while (block) {
    blocks.push(block);

    if (block === endBlock) {
      break;
    }

    block = block.nextSibling;
  }

  return blocks;
}


/**
 *
 */
export default class RedactorKeydown extends Module {
  /**
   *
   * @param event
   */
  public keydown(event: KeyboardEvent): void {
    console.log('RedactorKeydown::keydown', event);

    const selection = window.getSelection();

    const intersectedBlocks = findIntersectedBlocks(selection);

    console.log('intersectedBlocks', intersectedBlocks);

    
    event.preventDefault();
  }
}
