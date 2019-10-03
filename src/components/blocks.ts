import _ from './utils';
import $ from './dom';
import Block, {BlockToolAPI} from './block';

/**
 * @class Blocks
 * @classdesc Class to work with Block instances array
 *
 * @private
 *
 * @property {HTMLElement} workingArea — editor`s working node
 *
 */
export default class Blocks {
  /**
   * Get length of Block instances array
   *
   * @returns {Number}
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
   *
   * @param {Blocks} instance — Blocks instance
   * @param {Number|String} index — block index
   * @param {Block} block — Block to set
   * @returns {Boolean}
   */
  public static set(instance: Blocks, index: number, block: Block) {
    if (isNaN(Number(index))) {
      return false;
    }

    instance.insert(+index, block);

    return true;
  }

  /**
   * Proxy trap to implement array-like getter
   *
   * @param {Blocks} instance — Blocks instance
   * @param {Number|String} index — Block index
   * @returns {Block|*}
   */
  public static get(instance: Blocks, index: number) {
    if (isNaN(Number(index))) {
      return instance[index];
    }

    return instance.get(+index);
  }

  /**
   * Array of Block instances in order of addition
   */
  public blocks: Block[];

  /**
   * Editor`s area where to add Block`s HTML
   */
  public workingArea: HTMLElement;

  /**
   * @constructor
   *
   * @param {HTMLElement} workingArea — editor`s working node
   */
  constructor(workingArea: HTMLElement) {
    this.blocks = [];
    this.workingArea = workingArea;
  }

  /**
   * Push new Block to the blocks array and append it to working area
   *
   * @param {Block} block
   */
  public push(block: Block): void {
    this.blocks.push(block);
    this.workingArea.appendChild(block.holder);

    block.call(BlockToolAPI.RENDERED);
  }

  /**
   * Swaps blocks with indexes first and second
   * @param {Number} first - first block index
   * @param {Number} second - second block index
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
   * Insert new Block at passed index
   *
   * @param {Number} index — index to insert Block
   * @param {Block} block — Block to insert
   * @param {Boolean} replace — it true, replace block on given index
   */
  public insert(index: number, block: Block, replace: boolean = false): void {
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

      previousBlock.holder.insertAdjacentElement('afterend', block.holder);
    } else {
      const nextBlock = this.blocks[index + 1];

      if (nextBlock) {
        nextBlock.holder.insertAdjacentElement('beforebegin', block.holder);
      } else {
        this.workingArea.appendChild(block.holder);
      }
    }

    block.call(BlockToolAPI.RENDERED);
  }

  /**
   * Remove block
   * @param {Number|null} index
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
   *
   * @param {Block} targetBlock — target after wich Block should be inserted
   * @param {Block} newBlock — Block to insert
   */
  public insertAfter(targetBlock: Block, newBlock: Block): void {
    const index = this.blocks.indexOf(targetBlock);

    this.insert(index + 1, newBlock);
  }

  /**
   * Get Block by index
   *
   * @param {Number} index — Block index
   * @returns {Block}
   */
  public get(index: number): Block {
    return this.blocks[index];
  }

  /**
   * Return index of passed Block
   *
   * @param {Block} block
   * @returns {Number}
   */
  public indexOf(block: Block): number {
    return this.blocks.indexOf(block);
  }
}
