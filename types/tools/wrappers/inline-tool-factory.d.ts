import { InlineTool as IInlineTool, InlineTool } from '../../../types';
import { BaseToolFactory } from './base-tool-factory';
import { ToolType } from './tool-type';

interface InlineToolFactory extends BaseToolFactory<ToolType.Inline, InlineTool> {
  /**
   * Returns title for Inline Tool if specified by user
   */
  title: string;

  /**
   * Constructs new InlineTool instance from constructable
   */
  create(): IInlineTool;
}
