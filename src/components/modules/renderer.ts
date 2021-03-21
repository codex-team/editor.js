import * as Diff from 'diff';
import equal from 'fast-deep-equal';
import Module from '../__module';
import * as _ from '../utils';
import { OutputBlockData } from '../../../types';
import BlockTool from '../tools/block';

/**
 * Editor.js Renderer Module
 *
 * @module Renderer
 * @author CodeX Team
 *
 * @version 2.0.0
 */
export default class Renderer extends Module {
  /**
   * @typedef {object} RendererBlocks
   * @property {string} type - tool name
   * @property {object} data - tool data
   */

  /**
   * @example
   *
   * blocks: [
   *   {
   *     type : 'paragraph',
   *     data : {
   *       text : 'Hello from Codex!'
   *     }
   *   },
   *   {
   *     type : 'paragraph',
   *     data : {
   *       text : 'Leave feedback if you like it!'
   *     }
   *   },
   * ]
   *
   */

  /**
   * Make plugin blocks from array of plugin`s data
   *
   * @param {OutputBlockData[]} blocks - blocks to render
   */
  public async render(blocks: OutputBlockData[]): Promise<void> {
    const currentOutputData = await this.Editor.Saver.save();

    const changes = Diff.diffArrays(currentOutputData.blocks, blocks, {
      comparator: equal,
    });

    changes.forEach((change) => {
      if (change.added) {
        change.value.forEach((changeBlock) => {
          const index = blocks.indexOf(changeBlock);

          if (index === -1) {
            throw new Error();
          }

          this.insertBlock(changeBlock, index);
        });
      } else if (change.removed) {
        change.value.forEach((changeBlock) => {
          const index = currentOutputData.blocks.indexOf(changeBlock);

          if (index === -1) {
            throw new Error();
          }

          this.Editor.BlockManager.removeBlock(index);
          currentOutputData.blocks.splice(index, 1);
        });
      }
    });

    this.Editor.UI.checkEmptiness();
  }

  /**
   * Get plugin instance
   * Add plugin instance to BlockManager
   * Insert block to working zone
   *
   * @param {object} item - Block data to insert
   * @param {number} index - index where to insert new Block
   */
  private insertBlock(item: OutputBlockData, index: number): void {
    const { Tools, BlockManager } = this.Editor;
    const { type: tool, data, tunes } = item;

    if (Tools.available.has(tool)) {
      try {
        BlockManager.insert({
          tool,
          data,
          index,
          tunes,
        });
      } catch (error) {
        _.log(`Block «${tool}» skipped because of plugins error`, 'warn', data);
        throw Error(error);
      }
    } else {
      /** If Tool is unavailable, create stub Block for it */
      const stubData = {
        savedData: {
          type: tool,
          data,
        },
        title: tool,
      };

      if (Tools.unavailable.has(tool)) {
        const toolboxSettings = (Tools.unavailable.get(tool) as BlockTool).toolbox;

        stubData.title = toolboxSettings?.title || stubData.title;
      }

      const stub = BlockManager.insert({
        tool: Tools.stubTool,
        data: stubData,
        index,
      });

      stub.stretched = true;

      _.log(`Tool «${tool}» is not found. Check 'tools' property at your initial Editor.js config.`, 'warn');
    }
  }
}
