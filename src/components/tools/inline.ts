import BaseToolAdapter, { InternalInlineToolSettings } from './base';
import type { InlineTool as IInlineTool, InlineToolConstructable } from '@/types';
import type { InlineToolAdapter as InlineToolAdapterInterface } from '@/types/tools/adapters/inline-tool-adapter';
import { ToolType } from '@/types/tools/adapters/tool-type';

/**
 * InlineTool object to work with Inline Tools constructables
 */
export default class InlineToolAdapter extends BaseToolAdapter<ToolType.Inline, IInlineTool> implements InlineToolAdapterInterface {
  /**
   * Tool type — Inline
   */
  public type: ToolType.Inline = ToolType.Inline;

  /**
   * Tool's constructable blueprint
   */
  protected constructable: InlineToolConstructable;

  /**
   * Returns title for Inline Tool if specified by user
   */
  public get title(): string {
    return this.constructable[InternalInlineToolSettings.Title];
  }

  /**
   * Constructs new InlineTool instance from constructable
   */
  public create(): IInlineTool {
    // eslint-disable-next-line new-cap
    return new this.constructable({
      api: this.api,
      config: this.settings,
    }) as IInlineTool;
  }
}
