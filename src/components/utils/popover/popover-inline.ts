import { PopoverItem, PopoverItemDefault, PopoverItemParams } from './components/popover-item';
import { PopoverDesktop } from './popover-desktop';
import { css } from './popover.const';
import { PopoverEvent, PopoverParams } from './popover.types';

/**
 *
 */
export class PopoverInline extends PopoverDesktop {
  /**
   *
   * @param params
   */
  constructor(params: PopoverParams) {
    super({
      ...params,
      class: css.popoverInline,
    });
  }

  /**
   *
   * @param event
   */
  protected override handleHover(event: Event): void {
    // do nothing
  }
}
