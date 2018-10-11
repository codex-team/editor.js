import Module from '../__module';
import {Configuration} from '../interfaces/data-format';
import IBlockToolData from '../interfaces/tools/block-tool-data';
import _ from '../utils';

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
   * @constructor
   * @param {Configuration} config
   */
  constructor({config}: {config: Configuration}) {
    super({config});
  }

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
  public render(blocks: IBlockToolData[]): Promise<void> {
    const chainData = blocks.map((block) => ({function: () => this.insertBlock(block)}));

    return _.sequence(chainData);
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
    const tool = item.type;
    const data = item.data;
    const settings = item.settings;

    if (tool in this.Editor.Tools.available) {
      try {
        this.Editor.BlockManager.insert(tool, data, settings);
      } catch (error) {
        _.log(`Block «${tool}» skipped because of plugins error`, 'warn', data);
        throw Error(error);
      }
    } else {
      /**
       * @todo show warning notification message
       *
       * `${tool} blocks was skipped.`
       */
      _.log(`Tool «${tool}» is not found. Check 'tools' property at your initial CodeX Editor config.`, 'warn');
    }
  }
}
