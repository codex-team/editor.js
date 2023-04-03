/**
 * Editor.js Saver
 *
 * @module Saver
 * @author Codex Team
 * @version 2.0.0
 */
import Module from '../__module';
import { OutputData } from '../../../types';
import { SavedData, ValidatedData } from '../../../types/data-formats';
import Block from '../block';
import * as _ from '../utils';
import { sanitizeBlocks } from '../utils/sanitizer';

declare const VERSION: string;

/**
 * @classdesc This method reduces all Blocks asyncronically and calls Block's save method to extract data
 * @typedef {Saver} Saver
 * @property {Element} html - Editor HTML content
 * @property {string} json - Editor JSON output
 */
export default class Saver extends Module {
  /**
   * Composes new chain of Promises to fire them alternatelly
   *
   * @returns {OutputData}
   */
  public async save(): Promise<OutputData> {
    const { BlockManager, Tools } = this.Editor;
    const blocks = BlockManager.blocks,
        chainData = [];

    try {
      blocks.forEach((block: Block) => {
        chainData.push(this.getSavedData(block));
      });

      const extractedData = await Promise.all(chainData) as Array<Pick<SavedData, 'data' | 'tool'>>;
      const sanitizedData = await sanitizeBlocks(extractedData, (name) => {
        return Tools.blockTools.get(name).sanitizeConfig;
      });

      return this.makeOutput(sanitizedData);
    } catch (e) {
      _.logLabeled(`Saving failed due to the Error %o`, 'error', e);
    }
  }

  /**
   * Saves and validates
   *
   * @param {Block} block - Editor's Tool
   * @returns {ValidatedData} - Tool's validated data
   */
  private async getSavedData(block: Block): Promise<ValidatedData> {
    const blockData = await block.save();
    const isValid = blockData && await block.validate(blockData.data);

    return {
      ...blockData,
      isValid,
    };
  }

  /**
   * Creates output object with saved data, time and version of editor
   *
   * @param {ValidatedData} allExtractedData - data extracted from Blocks
   * @returns {OutputData}
   */
  private makeOutput(allExtractedData): OutputData {
    let totalTime = 0;
    const blocks = [];

    _.log('[Editor.js saving]:', 'groupCollapsed');

    allExtractedData.forEach(({ id, tool, data, tunes, time, isValid }) => {
      totalTime += time;

      /**
       * Capitalize Tool name
       */
      _.log(`${tool.charAt(0).toUpperCase() + tool.slice(1)}`, 'group');

      if (isValid) {
        /** Group process info */
        _.log(data);
        _.log(undefined, 'groupEnd');
      } else {
        _.log(`Block «${tool}» skipped because saved data is invalid`);
        _.log(undefined, 'groupEnd');

        return;
      }

      /** If it was stub Block, get original data */
      if (tool === this.Editor.Tools.stubTool) {
        blocks.push(data);

        return;
      }

      const output = {
        id,
        type: tool,
        data,
        ...!_.isEmpty(tunes) && {
          tunes,
        },
      };

      blocks.push(output);
    });

    _.log('Total', 'log', totalTime);
    _.log(undefined, 'groupEnd');

    return {
      time: +new Date(),
      blocks,
      version: VERSION,
    };
  }
}
