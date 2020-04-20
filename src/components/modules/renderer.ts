import Module from '../__module';
import * as _ from '../utils';
import { BlockToolData } from '../../../types';
import { BlockToolConstructable } from '../../../types/tools';

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
   * @param {BlockToolData[]} blocks - blocks to render
   * @param {boolean} readOnly - readOnly flag value
   */
  public async render(blocks: BlockToolData[], readOnly: boolean): Promise<void> {
    const chainData = blocks.map((block) => ({ function: (): Promise<void> => this.insertBlock(block, readOnly) }));

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
   * @param {boolean} readOnly - read only flag
   *
   * @returns {Promise<void>}
   */
  public async insertBlock(item, readOnly): Promise<void> {
    const { Tools, BlockManager } = this.Editor;
    const tool = item.type;
    const data = item.data;
    const settings = item.settings;

    if (tool in Tools.available) {
      try {
        BlockManager.insert(tool, data, settings, readOnly);
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

        stubData.title = toolToolboxSettings.title || userToolboxSettings.title || stubData.title;
      }

      const stub = BlockManager.insert(Tools.stubTool, stubData, settings, true);

      stub.stretched = true;

      _.log(`Tool «${tool}» is not found. Check 'tools' property at your initial Editor.js config.`, 'warn');
    }
  }
}
