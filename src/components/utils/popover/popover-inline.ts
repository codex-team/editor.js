import { isMobileScreen } from '../../utils';
import type { PopoverItem, PopoverItemParams } from './components/popover-item';
import { PopoverItemDefault, PopoverItemType } from './components/popover-item';
import { PopoverItemHtml } from './components/popover-item/popover-item-html/popover-item-html';
import { PopoverDesktop } from './popover-desktop';
import { CSSVariables, css } from './popover.const';
import type { PopoverParams } from '@/types/utils/popover/popover';

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

    this.showInitiallyOpenChildren();
  }

  /**
   * Replaces tools without remounting the container or restarting its entry animation.
   *
   * @param items - freshly rendered tools for the current selection
   */
  public updateItems(items: PopoverItemParams[]): void {
    this.items.forEach(item => item.destroy());

    this.items = this.buildItems(items);
    this.nodes.items.replaceChildren(...this.items
      .map(item => item.getElement())
      .filter((element): element is HTMLElement => element !== null));

    this.nodes.popover.classList.remove(css.popoverOpenTop, css.popoverOpenLeft);
    this.showInitiallyOpenChildren();
    this.nodes.popover.inert = false;
  }

  /**
   * Prevents interaction with tools being cleared while their replacements render.
   */
  public disable(): void {
    this.nodes.popover.inert = true;
    this.destroyNestedPopoverIfExists();
    this.nestedPopoverTriggerItem = null;
    this.flipper?.deactivate();
  }

  /**
   * Whether the inline popover is open.
   */
  public get isOpen(): boolean {
    return this.nodes.popover.classList.contains(css.popoverOpened);
  }

  /**
   * Open inline popovers can change size when their tools are replaced.
   */
  public override get size(): { height: number; width: number } {
    if (!this.isOpen) {
      return super.size;
    }

    return {
      height: this.nodes.popoverContainer.offsetHeight,
      width: this.nodes.popoverContainer.offsetWidth,
    };
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
      this.destroyNestedPopoverIfExists();

      this.nestedPopoverTriggerItem = null;

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
    if (this.nodes.popover.inert) {
      return;
    }

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

  /**
   * Restores selection-dependent nested menus after constructing their items.
   */
  private showInitiallyOpenChildren(): void {
    this.items.forEach((item) => {
      if (!(item instanceof PopoverItemDefault) && !(item instanceof PopoverItemHtml)) {
        return;
      }

      if (item.hasChildren && item.isChildrenOpen) {
        this.showNestedItems(item);
      }
    });
  }
}
