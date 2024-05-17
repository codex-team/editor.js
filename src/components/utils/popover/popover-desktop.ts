import Flipper from '../../flipper';
import { PopoverAbstract } from './popover-abstract';
import { PopoverItem, PopoverItemRenderParamsMap, WithChildren, css as popoverItemCls } from './components/popover-item';
import { PopoverParams } from './popover.types';
import { keyCodes } from '../../utils';
import { css } from './popover.const';
import { SearchInputEvent, SearchableItem } from './components/search-input';
import { cacheable } from '../../utils';
import { PopoverItemDefault } from './components/popover-item';
import { PopoverItemHtml } from './components/popover-item/popover-item-html/popover-item-html';

/**
 * Desktop popover.
 * On desktop devices popover behaves like a floating element. Nested popover appears at right or left side.
 *
 * @todo support rtl for nested popovers and search
 */
export class PopoverDesktop extends PopoverAbstract {
  /**
   * Flipper - module for keyboard iteration between elements
   */
  public flipper: Flipper;

  /**
   * Popover nesting level. 0 value means that it is a root popover
   */
  protected nestingLevel = 0;

  /**
   * Reference to nested popover if exists.
   * Undefined by default, PopoverDesktop when exists and null after destroyed.
   */
  protected nestedPopover: PopoverDesktop | undefined | null;

  /**
   * Last hovered item inside popover.
   * Is used to determine if cursor is moving inside one item or already moved away to another one.
   * Helps prevent reopening nested popover while cursor is moving inside one item area.
   */
  private previouslyHoveredItem: PopoverItem | null = null;

  /**
   * Element of the page that creates 'scope' of the popover.
   * If possible, popover will not cross specified element's borders when opening.
   */
  private scopeElement: HTMLElement = document.body;

  /**
   * Construct the instance
   *
   * @param params - popover params
   * @param itemsRenderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(params: PopoverParams, itemsRenderParams?: PopoverItemRenderParamsMap) {
    super(params, itemsRenderParams);

    if (params.nestingLevel !== undefined) {
      this.nestingLevel = params.nestingLevel;
    }

    if (this.nestingLevel > 0) {
      this.nodes.popover.classList.add(css.popoverNested);
    }

    if (params.scopeElement !== undefined) {
      this.scopeElement = params.scopeElement;
    }

    if (this.nodes.popoverContainer !== null) {
      this.listeners.on(this.nodes.popoverContainer, 'mouseover', (event: Event) => this.handleHover(event));
    }

    this.flipper = new Flipper({
      items: this.flippableElements,
      focusedItemClass: popoverItemCls.focused,
      allowedKeys: [
        keyCodes.TAB,
        keyCodes.UP,
        keyCodes.DOWN,
        keyCodes.ENTER,
      ],
    });

    this.flipper.onFlip(this.onFlip);

    this.search?.on(SearchInputEvent.Search, this.handleSearch);
  }

  /**
   * Returns true if some item inside popover is focused
   */
  public hasFocus(): boolean {
    if (this.flipper === undefined) {
      return false;
    }

    return this.flipper.hasFocus();
  }

  /**
   * Scroll position inside items container of the popover
   */
  public get scrollTop(): number {
    if (this.nodes.items === null) {
      return 0;
    }

    return this.nodes.items.scrollTop;
  }

  /**
   * Returns visible element offset top
   */
  public get offsetTop(): number {
    if (this.nodes.popoverContainer === null) {
      return 0;
    }

    return this.nodes.popoverContainer.offsetTop;
  }

  /**
   * Open popover
   */
  public show(): void {
    this.nodes.popover.style.setProperty('--popover-height', this.size.height + 'px');

    if (!this.shouldOpenBottom) {
      this.nodes.popover.classList.add(css.popoverOpenTop);
    }

    if (!this.shouldOpenRight) {
      this.nodes.popover.classList.add(css.popoverOpenLeft);
    }

    super.show();
    this.flipper.activate(this.flippableElements);
  }

  /**
   * Closes popover
   */
  public hide(): void {
    super.hide();

    this.destroyNestedPopoverIfExists();

    this.flipper.deactivate();

    this.previouslyHoveredItem = null;
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.hide();
    super.destroy();
  }

  /**
   * Handles displaying nested items for the item.
   *
   * @param item – item to show nested popover for
   */
  protected override showNestedItems(item: WithChildren<PopoverItemDefault> | WithChildren<PopoverItemHtml>): void {
    if (this.nestedPopover !== null && this.nestedPopover !== undefined) {
      return;
    }
    this.showNestedPopoverForItem(item);
  }

  /**
   * Handles hover events inside popover items container
   *
   * @param event - hover event data
   */
  protected handleHover(event: Event): void {
    const item = this.getTargetItem(event);

    if (item === undefined) {
      return;
    }

    if (this.previouslyHoveredItem === item) {
      return;
    }

    this.destroyNestedPopoverIfExists();

    this.previouslyHoveredItem = item;

    if (!item.hasChildren) {
      return;
    }

    this.showNestedPopoverForItem(item);
  }

  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used for correct positioning of the nested popover
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  protected setTriggerItemPositionProperty(nestedPopoverEl: HTMLElement, item:  WithChildren<PopoverItemDefault> | WithChildren<PopoverItemHtml>): void {
    const itemEl =  item.getElement();
    const itemOffsetTop = (itemEl ? itemEl.offsetTop : 0) - this.scrollTop;
    const topOffset = this.offsetTop + itemOffsetTop;

    nestedPopoverEl.style.setProperty('--trigger-item-top', topOffset + 'px');
  }

  /**
   * Additionaly handles input inside search field.
   * Updates flipper items considering search query applied.
   *
   * @param data - search event data
   * @param data.query - search query text
   * @param data.result - search results
   */
  private handleSearch = (data: { query: string, items: SearchableItem[] }): void => {
    /** List of elements available for keyboard navigation considering search query applied */
    const flippableElements = data.query === '' ? this.flippableElements : data.items.map(item => (item as PopoverItem).getElement());

    if (this.flipper.isActivated) {
      /** Update flipper items with only visible */
      this.flipper.deactivate();
      this.flipper.activate(flippableElements as HTMLElement[]);
    }
  };

  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  private get shouldOpenBottom(): boolean {
    if (this.nodes.popover === undefined || this.nodes.popover === null) {
      return false;
    }
    const popoverRect = this.nodes.popoverContainer.getBoundingClientRect();
    const scopeElementRect = this.scopeElement.getBoundingClientRect();
    const popoverHeight = this.size.height;
    const popoverPotentialBottomEdge = popoverRect.top + popoverHeight;
    const popoverPotentialTopEdge = popoverRect.top - popoverHeight;
    const bottomEdgeForComparison = Math.min(window.innerHeight, scopeElementRect.bottom);

    return popoverPotentialTopEdge < scopeElementRect.top || popoverPotentialBottomEdge <= bottomEdgeForComparison;
  }

  /**
   * Checks if popover should be opened left.
   * It should happen when there is enough space in the right or not enough space in the left
   */
  private get shouldOpenRight(): boolean {
    if (this.nodes.popover === undefined || this.nodes.popover === null) {
      return false;
    }

    const popoverRect = this.nodes.popover.getBoundingClientRect();
    const scopeElementRect = this.scopeElement.getBoundingClientRect();
    const popoverWidth = this.size.width;
    const popoverPotentialRightEdge = popoverRect.right + popoverWidth;
    const popoverPotentialLeftEdge = popoverRect.left - popoverWidth;
    const rightEdgeForComparison = Math.min(window.innerWidth, scopeElementRect.right);

    return popoverPotentialLeftEdge < scopeElementRect.left || popoverPotentialRightEdge <= rightEdgeForComparison;
  }

  /**
   * Helps to calculate size of popover while it is not displayed on screen.
   * Renders invisible clone of popover to get actual size.
   */
  @cacheable
  protected get size(): {height: number; width: number} {
    const size = {
      height: 0,
      width: 0,
    };

    if (this.nodes.popover === null) {
      return size;
    }

    const popoverClone = this.nodes.popover.cloneNode(true) as HTMLElement;

    popoverClone.style.visibility = 'hidden';
    popoverClone.style.position = 'absolute';
    popoverClone.style.top = '-1000px';

    popoverClone.classList.add(css.popoverOpened);
    popoverClone.querySelector('.' + css.popoverNested)?.remove();
    document.body.appendChild(popoverClone);

    const container =  popoverClone.querySelector('.' + css.popoverContainer) as HTMLElement;

    size.height = container.offsetHeight;
    size.width = container.offsetWidth;

    popoverClone.remove();

    return size;
  }

  /**
   * Destroys existing nested popover
   */
  private destroyNestedPopoverIfExists(): void {
    if (this.nestedPopover === undefined || this.nestedPopover === null) {
      return;
    }

    this.nestedPopover.hide();
    this.nestedPopover.destroy();
    this.nestedPopover.getElement().remove();
    this.nestedPopover = null;
    this.flipper.activate(this.flippableElements);
  }

  /**
   * Returns list of elements available for keyboard navigation.
   */
  private get flippableElements(): HTMLElement[] {
    const result =  this.items
      .map(item => {
        if (item instanceof PopoverItemDefault) {
          return item.getElement();
        }
        if (item instanceof PopoverItemHtml) {
          return item.getControls();
        }
      })
      .flat()
      .filter(item => item !== undefined && item !== null);

    return result as HTMLElement[];
  }

  /**
   * Called on flipper navigation
   */
  private onFlip = (): void => {
    const focusedItem = this.itemsDefault.find(item => item.isFocused);

    focusedItem?.onFocus();
  };

  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  private showNestedPopoverForItem(item: WithChildren<PopoverItemDefault> | WithChildren<PopoverItemHtml>): void {
    this.nestedPopover = new PopoverDesktop({
      searchable: item.isChildrenSearchable,
      items: item.children,
      nestingLevel: this.nestingLevel + 1,
    });

    const nestedPopoverEl = this.nestedPopover.getElement();

    this.nodes.popover.appendChild(nestedPopoverEl);

    this.setTriggerItemPositionProperty(nestedPopoverEl, item);

    nestedPopoverEl.style.setProperty('--nesting-level', this.nestedPopover.nestingLevel.toString());
    nestedPopoverEl.classList.add(css.getPopoverNestedClass(this.nestedPopover.nestingLevel));

    this.nestedPopover.show();
    this.flipper.deactivate();
  }
}
