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
   *     id   : 'oDe-EVrGWA',
   *     type : 'paragraph',
   *     data : {
   *       text : 'Hello from Codex!'
   *     }
   *   },
   *   {
   *     id   : 'Ld5BJjJCHs',
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
    const chainData = blocks.map((block) => ({ function: (): Promise<void> => this.insertBlock(block) }));

    const sequence = await _.sequence(chainData as _.ChainData[]);

    this.Editor.UI.checkEmptiness();

    return sequence;
  }

  /**
   * Get plugin instance
   * Add plugin instance to BlockManager
   * Insert block to working zone
   *
   * @param {object} item - Block data to insert
   *
   * @returns {Promise<void>}
   */
  public async insertBlock(item: OutputBlockData): Promise<void> {
    const { Tools, BlockManager } = this.Editor;
    const { type: tool, data, tunes, id } = item;

    if (Tools.available.has(tool)) {
      try {
        BlockManager.insert({
          id,
          tool,
          data,
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
          id,
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
        id,
        tool: Tools.stubTool,
        data: stubData,
      });

      stub.stretched = true;

      _.log(`Tool «${tool}» is not found. Check 'tools' property at your initial Editor.js config.`, 'warn');
    }
  }
}
