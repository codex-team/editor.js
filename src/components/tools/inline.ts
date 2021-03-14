import BaseTool, { InternalSettings } from './base';
import { ToolType } from '../modules/tools';
import { InlineTool as IInlineTool } from '../../../types';

/**
 *
 */
export default class InlineTool extends BaseTool<IInlineTool> {
  public type = ToolType.Inline;


  public get title(): string {
    return this.constructable[InternalSettings.Title];
  }

  public instance(): IInlineTool {
    // eslint-disable-next-line new-cap
    return new this.constructable({
      api: this.api,
      config: this.settings,
    }) as IInlineTool;
  }
}
