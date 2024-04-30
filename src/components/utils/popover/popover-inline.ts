import { PopoverItemDefault } from './components/popover-item';
import { PopoverDesktop } from './popover-desktop';
import { css } from './popover.const';
import { PopoverParams } from './popover.types';

/**
 *
 */
export class PopoverInline extends PopoverDesktop {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(params: PopoverParams) {
    super({
      ...params,
      class: css.popoverInline,
    });
  }


  /**
   * Returns visible element offset top
   */
  public get offsetLeft(): number {
    if (this.nodes.popoverContainer === null) {
      return 0;
    }

    return this.nodes.popoverContainer.offsetLeft;
  }

  /**
   * Open popover
   */
  public override show(): void {
    /**
     * If this is not a nested popover, set CSS variable with width of the popover
     */
    if (this.nestingLevel === 0) {
      this.nodes.popover.style.setProperty('--inline-popover-width', this.size.width + 'px');
    }
    super.show();
  }

  /**
   * Disable hover event handling
   */
  protected override handleHover(): void {
    // Do nothing
  }

  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used for correct positioning of the nested popover
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  protected override setTriggerItemPositionProperty(nestedPopoverEl: HTMLElement, item: PopoverItemDefault): void {
    const itemEl =  item.getElement();
    const itemOffsetLeft = itemEl ? itemEl.offsetLeft : 0;
    const totalLeftOffset = this.offsetLeft + itemOffsetLeft;

    nestedPopoverEl.style.setProperty('--trigger-item-left', totalLeftOffset + 'px');
  }
}
