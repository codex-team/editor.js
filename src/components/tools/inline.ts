import BaseTool, { InternalInlineToolSettings, ToolType } from './base';
import { InlineTool as IInlineTool, InlineToolConstructable } from '../../../types';

/**
 * InlineTool object to work with Inline Tools constructables
 */
export default class InlineTool extends BaseTool<IInlineTool> {
  /**
   * Tool type — Inline
   */
  public type = ToolType.Inline;

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
