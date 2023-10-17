import * as _ from './utils';
import $ from './dom';
import Block, { BlockToolAPI } from './block';
import { MoveEvent } from '../../types/tools';

/**
 * @class Blocks
 * @classdesc Class to work with Block instances array
 * @private
 * @property {HTMLElement} workingArea — editor`s working node
 */
export default class Blocks {
  /**
   * Array of Block instances in order of addition
   */
  public blocks: Block[];

  /**
   * Editor`s area where to add Block`s HTML
   */
  public workingArea: HTMLElement;

  /**
   * @class
   * @param {HTMLElement} workingArea — editor`s working node
   */
  constructor(workingArea: HTMLElement) {
    this.blocks = [];
    this.workingArea = workingArea;
  }

  /**
   * Get length of Block instances array
   *
   * @returns {number}
   */
  public get length(): number {
    return this.blocks.length;
  }

  /**
   * Get Block instances array
   *
   * @returns {Block[]}
   */
  public get array(): Block[] {
    return this.blocks;
  }

  /**
   * Get blocks html elements array
   *
   * @returns {HTMLElement[]}
   */
  public get nodes(): HTMLElement[] {
    return _.array(this.workingArea.children);
  }

  /**
   * Proxy trap to implement array-like setter
   *
   * @example
   * blocks[0] = new Block(...)
   * @param {Blocks} instance — Blocks instance
   * @param {PropertyKey} property — block index or any Blocks class property key to set
   * @param {Block} value — value to set
   * @returns {boolean}
   */
  public static set(instance: Blocks, property: PropertyKey, value: Block | unknown): boolean {
    /**
     * If property name is not a number (method or other property, access it via reflect
     */
    if (isNaN(Number(property))) {
      Reflect.set(instance, property, value);

      return true;
    }

    /**
     * If property is number, call insert method to emulate array behaviour
     *
     * @example
     * blocks[0] = new Block();
     */
    instance.insert(+(property as number), value as Block);

    return true;
  }

  /**
   * Proxy trap to implement array-like getter
   *
   * @param {Blocks} instance — Blocks instance
   * @param {PropertyKey} property — Blocks class property key
   * @returns {Block|*}
   */
  public static get(instance: Blocks, property: PropertyKey): Block | unknown {
    /**
     * If property is not a number, get it via Reflect object
     */
    if (isNaN(Number(property))) {
      return Reflect.get(instance, property);
    }

    /**
     * If property is a number (Block index) return Block by passed index
     */
    return instance.get(+(property as number));
  }

  /**
   * Push new Block to the blocks array and append it to working area
   *
   * @param {Block} block - Block to add
   */
  public push(block: Block): void {
    this.blocks.push(block);
    this.insertToDOM(block);
  }

  /**
   * Swaps blocks with indexes first and second
   *
   * @param {number} first - first block index
   * @param {number} second - second block index
   * @deprecated — use 'move' instead
   */
  public swap(first: number, second: number): void {
    const secondBlock = this.blocks[second];

    /**
     * Change in DOM
     */
    $.swap(this.blocks[first].holder, secondBlock.holder);

    /**
     * Change in array
     */
    this.blocks[second] = this.blocks[first];
    this.blocks[first] = secondBlock;
  }

  /**
   * Move a block from one to another index
   *
   * @param {number} toIndex - new index of the block
   * @param {number} fromIndex - block to move
   */
  public move(toIndex: number, fromIndex: number): void {
    /**
     * cut out the block, move the DOM element and insert at the desired index
     * again (the shifting within the blocks array will happen automatically).
     *
     * @see https://stackoverflow.com/a/44932690/1238150
     */
    const block = this.blocks.splice(fromIndex, 1)[0];

    // manipulate DOM
    const prevIndex = toIndex - 1;
    const previousBlockIndex = Math.max(0, prevIndex);
    const previousBlock = this.blocks[previousBlockIndex];

    if (toIndex > 0) {
      this.insertToDOM(block, 'afterend', previousBlock);
    } else {
      this.insertToDOM(block, 'beforebegin', previousBlock);
    }

    // move in array
    this.blocks.splice(toIndex, 0, block);

    // invoke hook
    const event: MoveEvent = this.composeBlockEvent('move', {
      fromIndex,
      toIndex,
    });

    block.call(BlockToolAPI.MOVED, event);
  }

  /**
   * Insert new Block at passed index
   *
   * @param {number} index — index to insert Block
   * @param {Block} block — Block to insert
   * @param {boolean} replace — it true, replace block on given index
   */
  public insert(index: number, block: Block, replace = false): void {
    if (!this.length) {
      this.push(block);

      return;
    }

    if (index > this.length) {
      index = this.length;
    }

    if (replace) {
      this.blocks[index].holder.remove();
      this.blocks[index].call(BlockToolAPI.REMOVED);
    }

    const deleteCount = replace ? 1 : 0;

    this.blocks.splice(index, deleteCount, block);

    if (index > 0) {
      const previousBlock = this.blocks[index - 1];

      this.insertToDOM(block, 'afterend', previousBlock);
    } else {
      const nextBlock = this.blocks[index + 1];

      if (nextBlock) {
        this.insertToDOM(block, 'beforebegin', nextBlock);
      } else {
        this.insertToDOM(block);
      }
    }
  }

  /**
   * Replaces block under passed index with passed block
   *
   * @param index - index of existed block
   * @param block - new block
   */
  public replace(index: number, block: Block): void {
    if (this.blocks[index] === undefined) {
      throw Error('Incorrect index');
    }

    const prevBlock = this.blocks[index];

    prevBlock.holder.replaceWith(block.holder);

    this.blocks[index] = block;
  }

  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index to insert blocks at
   */
  public insertMany(blocks: Block[], index: number ): void {
    const fragment = new DocumentFragment();

    for (const block of blocks) {
      fragment.appendChild(block.holder);
    }

    if (this.length > 0) {
      if (index > 0) {
        const previousBlockIndex = Math.min(index - 1, this.length - 1);
        const previousBlock = this.blocks[previousBlockIndex];

        previousBlock.holder.after(fragment);
      } else if (index === 0) {
        this.workingArea.prepend(fragment);
      }

      /**
       * Insert blocks to the array at the specified index
       */
      this.blocks.splice(index, 0, ...blocks);
    } else {
      this.blocks.push(...blocks);
      this.workingArea.appendChild(fragment);
    }

    /**
     * Call Rendered event for each block
     */
    blocks.forEach((block) => block.call(BlockToolAPI.RENDERED));
  }

  /**
   * Remove block
   *
   * @param {number} index - index of Block to remove
   */
  public remove(index: number): void {
    if (isNaN(index)) {
      index = this.length - 1;
    }

    this.blocks[index].holder.remove();

    this.blocks[index].call(BlockToolAPI.REMOVED);

    this.blocks.splice(index, 1);
  }

  /**
   * Remove all blocks
   */
  public removeAll(): void {
    this.workingArea.innerHTML = '';

    this.blocks.forEach((block) => block.call(BlockToolAPI.REMOVED));

    this.blocks.length = 0;
  }

  /**
   * Insert Block after passed target
   *
   * @todo decide if this method is necessary
   * @param {Block} targetBlock — target after which Block should be inserted
   * @param {Block} newBlock — Block to insert
   */
  public insertAfter(targetBlock: Block, newBlock: Block): void {
    const index = this.blocks.indexOf(targetBlock);

    this.insert(index + 1, newBlock);
  }

  /**
   * Get Block by index
   *
   * @param {number} index — Block index
   * @returns {Block}
   */
  public get(index: number): Block | undefined {
    return this.blocks[index];
  }

  /**
   * Return index of passed Block
   *
   * @param {Block} block - Block to find
   * @returns {number}
   */
  public indexOf(block: Block): number {
    return this.blocks.indexOf(block);
  }

  /**
   * Insert new Block into DOM
   *
   * @param {Block} block - Block to insert
   * @param {InsertPosition} position — insert position (if set, will use insertAdjacentElement)
   * @param {Block} target — Block related to position
   */
  private insertToDOM(block: Block, position?: InsertPosition, target?: Block): void {
    if (position) {
      target.holder.insertAdjacentElement(position, block.holder);
    } else {
      this.workingArea.appendChild(block.holder);
    }

    block.call(BlockToolAPI.RENDERED);
  }

  /**
   * Composes Block event with passed type and details
   *
   * @param {string} type - event type
   * @param {object} detail - event detail
   */
  private composeBlockEvent(type: string, detail: object): MoveEvent {
    return new CustomEvent(type, {
      detail,
    }) as MoveEvent;
  }
}
