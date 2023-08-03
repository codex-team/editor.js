import Module from '../__module';
import * as _ from '../utils';
import { OutputBlockData } from '../../../types';
import BlockTool from '../tools/block';
import { RenderingFinished } from './../events';

/**
 * Module that responsible for rendering Blocks on editor initialization
 */
export default class Renderer extends Module {
  /**
   * Renders passed blocks as one batch
   *
   * @param blocksData - blocks to render
   */
  public async render(blocksData: OutputBlockData[]): Promise<void> {
    return new Promise((resolve) => {
      /**
       * Disable onChange callback on render to not to spam those events
       */
      this.Editor.ModificationsObserver.disable();

      /**
       * Create Blocks instances
       */
      const blocks = blocksData.map(({ type: tool, data, tunes, id }) => {
        /**
         * @todo handle plugin error
         * @todo handle stub case
         */

        return this.Editor.BlockManager.composeBlock({
          id,
          tool,
          data,
          tunes,
        });
      });

      /**
       * Insert batch of Blocks
       */
      this.Editor.BlockManager.insertMany(blocks);

      /**
       * Do some post-render stuff.
       */
      window.requestIdleCallback(() => {
        this.Editor.UI.checkEmptiness();
        /**
         * Enable onChange callback back
         */
        this.Editor.ModificationsObserver.enable();
        resolve();
      }, { timeout: 2000 });
    });
  }

  /**
   * Get plugin instance
   * Add plugin instance to BlockManager
   * Insert block to working zone
   *
   * @param {object} item - Block data to insert
   * @returns {Promise<void>}
   * @deprecated
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
        _.log(`Block «${tool}» skipped because of plugins error`, 'warn', {
          data,
          error,
        });
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
        const toolboxTitle = toolboxSettings[0]?.title;

        stubData.title = toolboxTitle || stubData.title;
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
