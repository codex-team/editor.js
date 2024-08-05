import { ToolsCollection } from './tools-collection';
import { ToolType } from './tool-type';
import { InlineToolFactory } from './inline-tool-factory';
import { BlockTuneFactory } from './block-tune-factory';
import { BlockTool } from '../block-tool';
import { BlockToolData } from '../block-tool-data';
import { BlockAPI } from '../../api/block';
import { ToolboxConfigEntry } from '../tool-settings';
import { ConversionConfig } from '../../configs/conversion-config';
import { PasteConfig } from '../../configs/paste-config';
import { SanitizerConfig } from '../../configs/sanitizer-config';
import { BaseToolFactory } from './base-tool-factory';

interface BlockToolFactory extends BaseToolFactory<ToolType.Block, BlockTool>{
  /**
   * InlineTool collection for current Block Tool
   */
  inlineTools: ToolsCollection<InlineToolFactory>;

  /**
   * BlockTune collection for current Block Tool
   */
  tunes: ToolsCollection<BlockTuneFactory>;

  /**
   * Creates new Tool instance
   * @param data - Tool data
   * @param block - BlockAPI for current Block
   * @param readOnly - True if Editor is in read-only mode
   */
  create(data: BlockToolData, block: BlockAPI, readOnly: boolean): BlockTool;

  /**
   * Returns true if read-only mode is supported by Tool
   */
  isReadOnlySupported: boolean;

  /**
   * Returns true if Tool supports linebreaks
   */
  isLineBreaksEnabled: boolean;

  /**
   * Returns Tool toolbox configuration (internal or user-specified)
   */
  toolbox: ToolboxConfigEntry[] | undefined;

  /**
   * Returns Tool conversion configuration
   */
  conversionConfig: ConversionConfig | undefined;

  /**
   * Returns enabled inline tools for Tool
   */
  enabledInlineTools: boolean | string[];

  /**
   * Returns enabled tunes for Tool
   */
  enabledBlockTunes: boolean | string[];

  /**
   * Returns Tool paste configuration
   */
  pasteConfig: PasteConfig;

  /**
   * Returns sanitize configuration for Block Tool including configs from related Inline Tools and Block Tunes
   */
  sanitizeConfig: SanitizerConfig;

  /**
   * Returns sanitizer configuration composed from sanitize config of Inline Tools enabled for Tool
   */
  baseSanitizeConfig: SanitizerConfig;
}

