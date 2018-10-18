/**
 * Codex Editor Saver
 *
 * @module Saver
 * @author Codex Team
 * @version 2.0.0
 */

/**
 * @typedef {Object} SavedData
 * @property {Date} time - saving proccess time
 * @property {Object} blocks - extracted data
 * @property {String} version - CodexEditor version
 */
interface SavedData {
  time: number;
  blocks: object[];
  version: string;
}

/**
 * @classdesc This method reduces all Blocks asyncronically and calls Block's save method to extract data
 *
 * @typedef {Saver} Saver
 * @property {Element} html - Editor HTML content
 * @property {String} json - Editor JSON output
 */

declare const Module: any;
declare const VERSION: string;

export default class Saver extends Module {
  /**
   * @constructor
   * @param config
   */
  constructor({config}) {
    super({config});

    this.output = null;
    this.blocksData = [];
  }

  /**
   * Composes new chain of Promises to fire them alternatelly
   * @return {SavedData}
   */
  public save(): Promise<SavedData> {
    const  blocks = this.Editor.BlockManager.blocks,
      chainData = [];

    blocks.forEach((block) => {
      chainData.push(block.data);
    });

    return Promise.all(chainData)
      .then((extractedData) => this.Editor.Sanitizer.sanitizeBlocks(extractedData))
      .then((allExtractedData) => this.makeOutput(allExtractedData))
      .then((outputData) => {
        return outputData;
      });
  }

  /**
   * Creates output object with saved data, time and version of editor
   * @param {Object} allExtractedData
   * @return {SavedData}
   */
  private makeOutput(allExtractedData): SavedData {
    let totalTime = 0;
    const blocks = [];

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
      version: VERSION,
      blocks,
    };
  }
}
