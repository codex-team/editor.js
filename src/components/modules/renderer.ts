import Module from '../__module';
import * as _ from '../utils';
import { OutputBlockData } from '../../../types';
import BlockTool from '../tools/block';

/**
 * Module that responsible for rendering Blocks on editor initialization
 */
export default class Renderer extends Module {
  /**
   * Make plugin blocks from array of plugin`s data
   *
   * @param {OutputBlockData[]} blocks - blocks to render
   * @deprecated
   */
  public async _render(blocks: OutputBlockData[]): Promise<void> {
    const chainData = blocks.map((block) => ({
      function: (): Promise<void> => this.insertBlock(block),
    }));

    /**
     * Disable onChange callback on render to not to spam those events
     */
    this.Editor.ModificationsObserver.disable();

    const sequence = await _.sequence(chainData as _.ChainData[]);

    this.Editor.ModificationsObserver.enable();

    this.Editor.UI.checkEmptiness();

    return sequence;
  }

  /**
   * Renders passed blocks as one batch
   *
   * @param blocksData - blocks to render
   */
  public async render(blocksData: OutputBlockData[]): Promise<void> {
    /**
     * Disable onChange callback on render to not to spam those events
     */
    this.Editor.ModificationsObserver.disable();

    /**
     * Create Blocks instances
     */
    const blocks = blocksData.map(({ type: tool, data, tunes, id }) => {
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
     * Set current Block to the last inserted, check emptiness, etc.
     */
    window.requestIdleCallback(() => {
      this.Editor.BlockManager.currentBlock = this.Editor.BlockManager.lastBlock;

      this.Editor.UI.checkEmptiness();
      /**
       * Enable onChange callback back
       */
      this.Editor.ModificationsObserver.enable();
    }, { timeout: 2000 });
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
