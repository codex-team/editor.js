import BaseTool, { InternalSettings } from './base';
import { ToolType } from '../modules/tools';
import { InlineTool as IInlineTool } from '../../../types';

/**
 * InlineTool object to work with Inline Tools constructables
 */
export default class InlineTool extends BaseTool<IInlineTool> {
  /**
   * Tool type — Inline
   */
  public type = ToolType.Inline;

  /**
   * Returns title for Inline Tool if specified by user
   */
  public get title(): string {
    return this.constructable[InternalSettings.Title];
  }

  /**
   * Constructs new InlineTool instance from constructable
   */
  public instance(): IInlineTool {
    // eslint-disable-next-line new-cap
    return new this.constructable({
      api: this.api,
      config: this.settings,
    }) as IInlineTool;
  }
}
