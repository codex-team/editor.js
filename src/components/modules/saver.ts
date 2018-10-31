/**
 * Codex Editor Saver
 *
 * @module Saver
 * @author Codex Team
 * @version 2.0.0
 */
import Module from '../__module';
import {OutputData} from '../../../types/data-formats/output-data';

declare const VERSION: string;

/**
 * @typedef {Object} SavedData
 * @property {Date} time - saving proccess time
 * @property {Object} items - extracted data
 * @property {String} version - CodexEditor version
 */

/**
 * @classdesc This method reduces all Blocks asyncronically and calls Block's save method to extract data
 *
 * @typedef {Saver} Saver
 * @property {Element} html - Editor HTML content
 * @property {String} json - Editor JSON output
 */
export default class Saver extends Module {
  private output: OutputData;

  /**
   * @constructor
   * @param config
   */
  constructor({config}) {
    super({config});

    this.output = null;
  }

  /**
   * Composes new chain of Promises to fire them alternatelly
   * @return {SavedData}
   */
  public async save(): Promise<OutputData> {
    const blocks = this.Editor.BlockManager.blocks,
      chainData = [];

    blocks.forEach((block) => {
      chainData.push(block.data);
    });

    const savedData = await Promise.all(chainData);

    return this.makeOutput(savedData);
  }

  /**
   * Creates output object with saved data, time and version of editor
   * @param {Object} allExtractedData
   * @return {SavedData}
   */
  private makeOutput(allExtractedData): OutputData {
    const blocks = [];
    let totalTime = 0;

    console.groupCollapsed('[CodexEditor saving]:');

    allExtractedData.forEach((extraction) => {
      /** Group process info */
      console.log(`«${extraction.tool}» saving info`, extraction);
      totalTime += extraction.time;
      blocks.push({
        type: extraction.tool,
        data: extraction.data,
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
