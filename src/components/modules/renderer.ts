import Module from '../__module';
import _, {ChainData} from '../utils';
import {BlockToolData} from '../../../types';
import {BlockToolConstructable} from '../../../types/tools';

/**
 * Codex Editor Renderer Module
 *
 * @module Renderer
 * @author CodeX Team
 *
 * @version 2.0.0
 */
export default class Renderer extends Module {
  /**
   * @typedef {Object} RendererBlocks
   * @property {String} type - tool name
   * @property {Object} data - tool data
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
   * @param {RendererBlocks[]} blocks
   */
  public async render(blocks: BlockToolData[]): Promise<void> {
    this.emit('render/started');

    const chainData = blocks.map((block) => ({function: () => this.insertBlock(block)}));

    await _.sequence(chainData as ChainData[]);

    this.emit('render/finished');
  }

  /**
   * Get plugin instance
   * Add plugin instance to BlockManager
   * Insert block to working zone
   *
   * @param {Object} item
   * @returns {Promise<void>}
   * @private
   */
  public async insertBlock(item): Promise<void> {
    const { Tools, BlockManager } = this.Editor;
    const tool = item.type;
    const data = item.data;
    const settings = item.settings;

    if (tool in Tools.available) {
      try {
        BlockManager.insert(tool, data, settings);
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

      const stub = BlockManager.insert(Tools.stubTool, stubData, settings);

      stub.stretched = true;

      _.log(`Tool «${tool}» is not found. Check 'tools' property at your initial CodeX Editor config.`, 'warn');
    }
  }
}
