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

    let baseConfig,
      cleanData;

    blocks.forEach((block) => {
      baseConfig = this.getSanitizerConfig(block.name);

      /**
       * if Tool provides custom sanitizer config
       * then use this config
       *
       * Merge custom config with base config
       */
      if (block.sanitize && typeof block.sanitize === 'object') {
        cleanData = this.Editor.Sanitizer.deepSanitize(block.data, block.sanitize, baseConfig);
      } else {
        cleanData = block.data;
      }

      chainData.push(cleanData);
    });

    return Promise.all(chainData)
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

  /**
   * Returns Sanitizer config
   * When Tool's "inlineToolbar" value is True, get all sanitizer rules from all tools,
   * otherwise get only enabled
   */
  private getSanitizerConfig(name) {
    const toolsConfig = this.Editor.Tools.getToolSettings(name),
      enableInlineTools = toolsConfig.inlineToolbar || [];

    let config = {};

    if (typeof enableInlineTools === 'boolean' && enableInlineTools) {
      /**
       * getting all tools sanitizer rule
       */
      this.Editor.InlineToolbar.tools.forEach( (inlineTool) => {
        config = Object.assign(config, inlineTool.sanitize);
      });
    } else {
      /**
       * getting only enabled
       */
      enableInlineTools.map( (inlineToolName) => {
        config = Object.assign(config, this.Editor.InlineToolbar.tools.get(inlineToolName).sanitize);
      });
    }
    return config;
  }
}
