import { InlineTool as IInlineTool, InlineTool, InlineToolConstructable } from '../../../types';
import { BaseToolWrapper } from './base-tool-wrapper';
import { ToolType } from './tool-type';

interface InlineToolWrapper extends BaseToolWrapper<ToolType.Inline, InlineTool> {
  /**
   * Returns title for Inline Tool if specified by user
   */
  title: string;

  /**
   * Constructs new InlineTool instance from constructable
   */
  create(): IInlineTool;
}
