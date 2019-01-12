/**
 * Codex Editor Saver
 *
 * @module Saver
 * @author Codex Team
 * @version 2.0.0
 */
import Module from '../__module';
import {OutputData} from '../../../types';
import {ValidatedData} from '../../types-internal/block-data';
import Block from '../block';
import _ from '../utils';

declare const VERSION: string;

/**
 * @classdesc This method reduces all Blocks asyncronically and calls Block's save method to extract data
 *
 * @typedef {Saver} Saver
 * @property {Element} html - Editor HTML content
 * @property {String} json - Editor JSON output
 */
export default class Saver extends Module {
  /**
   * Composes new chain of Promises to fire them alternatelly
   * @return {OutputData}
   */
  public async save(): Promise<OutputData> {
    const {BlockManager, Sanitizer, ModificationsObserver} = this.Editor;
    const blocks = BlockManager.blocks,
      chainData = [];

    /**
     * Disable modifications observe while saving
     */
    ModificationsObserver.disable();

    blocks.forEach((block: Block) => {
     chainData.push(this.getSavedData(block));
    });

    const extractedData = await Promise.all(chainData);

    const sanitizedData = await Sanitizer.sanitizeBlocks(extractedData);

    ModificationsObserver.enable();

    return this.makeOutput(sanitizedData);
  }

  /**
   * Saves and validates
   * @param {Block} block - Editor's Tool
   * @return {ValidatedData} - Tool's validated data
   */
  private async getSavedData(block: Block): Promise<ValidatedData> {
      const blockData = await block.save();
      const isValid = blockData && await block.validate(blockData.data);

      return {...blockData, isValid};
  }

  /**
   * Creates output object with saved data, time and version of editor
   * @param {Object} allExtractedData
   * @return {OutputData}
   */
  private makeOutput(allExtractedData): OutputData {
    let totalTime = 0;
    const blocks = [];

    console.groupCollapsed('[CodexEditor saving]:');

    allExtractedData.forEach(({tool, data, time, isValid}) => {

      totalTime += time;

      if (isValid) {
        /** Group process info */
        console.log(`«${tool}» saving info`, {tool, data, time});
      } else {
        _.log(`Block «${tool}» skipped because saved data is invalid`, 'log');
        return;
      }

      /** If it was stub Block, get original data */
      if (tool === this.Editor.Tools.stubTool) {
        blocks.push(data);
        return;
      }

      blocks.push({
        type: tool,
        data,
      });
    });

    console.log('Total', totalTime);

    console.groupEnd();

    return {
      time: +new Date(),
      blocks,
      version: VERSION,
    };
  }
}
