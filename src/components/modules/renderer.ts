import Module from '../__module';
import * as _ from '../utils';
import { BlockToolConstructable, OutputBlockData } from '../../../types';

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
    const tool = item.type;
    const data = item.data;

    if (tool in Tools.available) {
      try {
        BlockManager.insert({
          tool,
          data,
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

      if (tool in Tools.unavailable) {
        const toolToolboxSettings = (Tools.unavailable[tool] as BlockToolConstructable).toolbox;
        const userToolboxSettings = Tools.getToolSettings(tool).toolbox;

        stubData.title = toolToolboxSettings.title || (userToolboxSettings && userToolboxSettings.title) || stubData.title;
      }

      const stub = BlockManager.insert({
        tool: Tools.stubTool,
        data: stubData,
      });

      stub.stretched = true;

      _.log(`Tool «${tool}» is not found. Check 'tools' property at your initial Editor.js config.`, 'warn');
    }
  }
}
