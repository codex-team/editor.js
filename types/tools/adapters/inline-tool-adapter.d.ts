import { InlineTool as IInlineTool, InlineTool } from '../..';
import { BaseToolAdapter } from './base-tool-adapter';
import { ToolType } from './tool-type';

interface InlineToolAdapter extends BaseToolAdapter<ToolType.Inline, InlineTool> {
  /**
   * Returns title for Inline Tool if specified by user
   */
  title: string;

  /**
   * Constructs new InlineTool instance from constructable
   */
  create(): IInlineTool;
}
