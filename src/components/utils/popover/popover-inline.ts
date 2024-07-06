import { isMobileScreen } from '../../utils';
import { PopoverItem, PopoverItemDefault, PopoverItemType } from './components/popover-item';
import { PopoverItemHtml } from './components/popover-item/popover-item-html/popover-item-html';
import { PopoverDesktop } from './popover-desktop';
import { CSSVariables, css } from './popover.const';
import { PopoverParams } from './popover.types';

/**
 * Horizontal popover that is displayed inline with the content
 */
export class PopoverInline extends PopoverDesktop {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(params: PopoverParams) {
    const isHintEnabled = !isMobileScreen();

    super(
      {
        ...params,
        class: css.popoverInline,
      },
      {
        [PopoverItemType.Default]: {
          /**
           * We use button instead of div here to fix bug associated with focus loss (which leads to selection change) on click in safari
           *
           * @todo figure out better way to solve the issue
           */
          wrapperTag: 'button',
          hint: {
            position: 'top',
            alignment: 'center',
            enabled: isHintEnabled,
          },
        },
        [PopoverItemType.Html]: {
          hint: {
            position: 'top',
            alignment: 'center',
            enabled: isHintEnabled,
          },
        },
      }
    );

    /**
     * If active popover item has children, show them.
     * This is needed to display link url text (which is displayed as a nested popover content)
     * once you select <a> tag content in text
     */
    this.items
      .forEach((item) => {
        if (!(item instanceof PopoverItemDefault) && !(item instanceof PopoverItemHtml)) {
          return;
        }

        if (item.hasChildren && item.isChildrenOpen) {
          this.showNestedItems(item);
        }
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
      this.nodes.popover.style.setProperty(
        CSSVariables.InlinePopoverWidth,
        this.size.width + 'px'
      );
    }
    super.show();
  }

  /**
   * Disable hover event handling.
   * Overrides parent's class behavior
   */
  protected override handleHover(): void {
    return;
  }

  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used to position nested popover right below clicked item
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  protected override setTriggerItemPosition(
    nestedPopoverEl: HTMLElement,
    item: PopoverItemDefault
  ): void {
    const itemEl = item.getElement();
    const itemOffsetLeft = itemEl ? itemEl.offsetLeft : 0;
    const totalLeftOffset = this.offsetLeft + itemOffsetLeft;

    nestedPopoverEl.style.setProperty(
      CSSVariables.TriggerItemLeft,
      totalLeftOffset + 'px'
    );
  }

  /**
   * Handles displaying nested items for the item.
   * Overriding in order to add toggling behaviour
   *
   * @param item – item to toggle nested popover for
   */
  protected override showNestedItems(item: PopoverItemDefault | PopoverItemHtml): void {
    if (this.nestedPopoverTriggerItem === item) {
      this.nestedPopoverTriggerItem = null;
      this.destroyNestedPopoverIfExists();

      return;
    }

    super.showNestedItems(item);
  }

  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  protected showNestedPopoverForItem(item: PopoverItem): PopoverDesktop {
    const nestedPopover = super.showNestedPopoverForItem(item);
    const nestedPopoverEl = nestedPopover.getElement();

    /**
     * We need to add class with nesting level, shich will help position nested popover.
     * Currently only '.ce-popover--nested-level-1' class is used
     */
    nestedPopoverEl.classList.add(css.getPopoverNestedClass(nestedPopover.nestingLevel));

    return nestedPopover;
  }

  /**
   * Overrides default item click handling.
   * Helps to close nested popover once other item is clicked.
   *
   * @param item - clicked item
   */
  protected override handleItemClick(item: PopoverItem): void {
    if (item !== this.nestedPopoverTriggerItem) {
      /**
       * In case tool had special handling for toggling button (like link tool which modifies selection)
       * we need to call handleClick on nested popover trigger item
       */
      this.nestedPopoverTriggerItem?.handleClick();

      /**
       * Then close the nested popover
       */
      super.destroyNestedPopoverIfExists();
    }

    super.handleItemClick(item);
  }
}
