import Module from '../__module';
import * as _ from '../utils';
import type { BlockId, BlockToolData, OutputBlockData } from '../../../types';
import type BlockTool from '../tools/block';
import type { StubData } from '../../tools/stub';
import Block from '../block';

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
      const { Tools, BlockManager } = this.Editor;

      if (blocksData.length === 0) {
        BlockManager.insert();
      } else {
        /**
         * Create Blocks instances
         */
        const blocks = blocksData.map(({ type: tool, data, tunes, id }) => {
          if (Tools.available.has(tool) === false) {
            _.logLabeled(`Tool «${tool}» is not found. Check 'tools' property at the Editor.js config.`, 'warn');

            data = this.composeStubDataForTool(tool, data, id);
            tool = Tools.stubTool;
          }

          let block: Block;

          try {
            block = BlockManager.composeBlock({
              id,
              tool,
              data,
              tunes,
            });
          } catch (error) {
            _.log(`Block «${tool}» skipped because of plugins error`, 'error', {
              data,
              error,
            });

            /**
             * If tool throws an error during render, we should render stub instead of it
             */
            data = this.composeStubDataForTool(tool, data, id);
            tool = Tools.stubTool;

            block = BlockManager.composeBlock({
              id,
              tool,
              data,
              tunes,
            });
          }

          return block;
        });

        /**
         * Insert batch of Blocks
         */
        BlockManager.insertMany(blocks);
      }

      /**
       * Wait till browser will render inserted Blocks and resolve a promise
       */
      window.requestIdleCallback(() => {
        resolve();
      }, { timeout: 2000 });
    });
  }

  /**
   * Create data for the Stub Tool that will be used instead of unavailable tool
   *
   * @param tool - unavailable tool name to stub
   * @param data - data of unavailable block
   * @param [id] - id of unavailable block
   */
  private composeStubDataForTool(tool: string, data: BlockToolData, id?: BlockId): StubData {
    const { Tools } = this.Editor;

    let title = tool;

    if (Tools.unavailable.has(tool)) {
      const toolboxSettings = (Tools.unavailable.get(tool) as BlockTool).toolbox;

      if (toolboxSettings !== undefined && toolboxSettings[0].title !== undefined) {
        title = toolboxSettings[0].title;
      }
    }

    return {
      savedData: {
        id,
        type: tool,
        data,
      },
      title,
    };
  }
}
