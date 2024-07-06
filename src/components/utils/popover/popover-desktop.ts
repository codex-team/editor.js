import Flipper from '../../flipper';
import { PopoverAbstract } from './popover-abstract';
import { PopoverItem, PopoverItemRenderParamsMap, PopoverItemSeparator, css as popoverItemCls } from './components/popover-item';
import { PopoverEvent, PopoverParams } from './popover.types';
import { keyCodes } from '../../utils';
import { CSSVariables, css } from './popover.const';
import { SearchInput, SearchInputEvent, SearchableItem } from './components/search-input';
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
  public flipper: Flipper | undefined;

  /**
   * Popover nesting level. 0 value means that it is a root popover
   */
  public nestingLevel = 0;

  /**
   * Reference to nested popover if exists.
   * Undefined by default, PopoverDesktop when exists and null after destroyed.
   */
  protected nestedPopover: PopoverDesktop | undefined | null;

  /**
   * Item nested popover is displayed for
   */
  protected nestedPopoverTriggerItem: PopoverItem | null = null;

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

    if (params.searchable) {
      this.addSearch();
    }

    if (params.flippable !== false) {
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
    }
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
    this.nodes.popover.style.setProperty(CSSVariables.PopoverHeight, this.size.height + 'px');

    if (!this.shouldOpenBottom) {
      this.nodes.popover.classList.add(css.popoverOpenTop);
    }

    if (!this.shouldOpenRight) {
      this.nodes.popover.classList.add(css.popoverOpenLeft);
    }

    super.show();
    this.flipper?.activate(this.flippableElements);
  }

  /**
   * Closes popover
   */
  public hide = (): void => {
    super.hide();

    this.destroyNestedPopoverIfExists();

    this.flipper?.deactivate();

    this.previouslyHoveredItem = null;
  };

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
  protected override showNestedItems(item: PopoverItem): void {
    if (this.nestedPopover !== null && this.nestedPopover !== undefined) {
      return;
    }

    this.nestedPopoverTriggerItem = item;

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
  protected setTriggerItemPosition(nestedPopoverEl: HTMLElement, item: PopoverItem): void {
    const itemEl = item.getElement();
    const itemOffsetTop = (itemEl ? itemEl.offsetTop : 0) - this.scrollTop;
    const topOffset = this.offsetTop + itemOffsetTop;

    nestedPopoverEl.style.setProperty(CSSVariables.TriggerItemTop, topOffset + 'px');
  }

  /**
   * Destroys existing nested popover
   */
  protected destroyNestedPopoverIfExists(): void {
    if (this.nestedPopover === undefined || this.nestedPopover === null) {
      return;
    }

    this.nestedPopover.off(PopoverEvent.ClosedOnActivate, this.hide);
    this.nestedPopover.hide();
    this.nestedPopover.destroy();
    this.nestedPopover.getElement().remove();
    this.nestedPopover = null;
    this.flipper?.activate(this.flippableElements);

    this.nestedPopoverTriggerItem?.onChildrenClose();
  }

  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  protected showNestedPopoverForItem(item: PopoverItem): PopoverDesktop {
    this.nestedPopover = new PopoverDesktop({
      searchable: item.isChildrenSearchable,
      items: item.children,
      nestingLevel: this.nestingLevel + 1,
      flippable: item.isChildrenFlippable,
    });

    item.onChildrenOpen();

    /**
     * Close nested popover when item with 'closeOnActivate' property set was clicked
     * parent popover should also be closed
     */
    this.nestedPopover.on(PopoverEvent.ClosedOnActivate, this.hide);

    const nestedPopoverEl = this.nestedPopover.getElement();

    this.nodes.popover.appendChild(nestedPopoverEl);

    this.setTriggerItemPosition(nestedPopoverEl, item);

    /* We need nesting level value in CSS to calculate offset left for nested popover */
    nestedPopoverEl.style.setProperty(CSSVariables.NestingLevel, this.nestedPopover.nestingLevel.toString());

    this.nestedPopover.show();
    this.flipper?.deactivate();

    return this.nestedPopover;
  }

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
   * Helps to calculate size of popover that is only resolved when popover is displayed on screen.
   * Renders invisible clone of popover to get actual values.
   */
  @cacheable
  public get size(): { height: number; width: number } {
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

    const container = popoverClone.querySelector('.' + css.popoverContainer) as HTMLElement;

    size.height = container.offsetHeight;
    size.width = container.offsetWidth;
    popoverClone.remove();

    return size;
  }

  /**
   * Returns list of elements available for keyboard navigation.
   */
  private get flippableElements(): HTMLElement[] {
    const result = this.items
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
   * Adds search to the popover
   */
  private addSearch(): void {
    this.search = new SearchInput({
      items: this.itemsDefault,
      placeholder: this.messages.search,
    });

    this.search.on(SearchInputEvent.Search, this.onSearch);

    const searchElement = this.search.getElement();

    searchElement.classList.add(css.search);

    this.nodes.popoverContainer.insertBefore(searchElement, this.nodes.popoverContainer.firstChild);
  }

  /**
   * Handles input inside search field
   *
   * @param data - search input event data
   * @param data.query - search query text
   * @param data.result - search results
   */
  private onSearch = (data: { query: string, items: SearchableItem[] }): void => {
    const isEmptyQuery = data.query === '';
    const isNothingFound = data.items.length === 0;

    this.items
      .forEach((item) => {
        let isHidden = false;

        if (item instanceof PopoverItemDefault) {
          isHidden = !data.items.includes(item);
        } else if (item instanceof PopoverItemSeparator || item instanceof PopoverItemHtml) {
          /** Should hide separators if nothing found message displayed or if there is some search query applied */
          isHidden = isNothingFound || !isEmptyQuery;
        }
        item.toggleHidden(isHidden);
      });
    this.toggleNothingFoundMessage(isNothingFound);

    /** List of elements available for keyboard navigation considering search query applied */
    const flippableElements = data.query === '' ? this.flippableElements : data.items.map(item => (item as PopoverItem).getElement());

    if (this.flipper?.isActivated) {
      /** Update flipper items with only visible */
      this.flipper.deactivate();
      this.flipper.activate(flippableElements as HTMLElement[]);
    }
  };

  /**
   * Toggles nothing found message visibility
   *
   * @param isDisplayed - true if the message should be displayed
   */
  private toggleNothingFoundMessage(isDisplayed: boolean): void {
    this.nodes.nothingFoundMessage.classList.toggle(css.nothingFoundMessageDisplayed, isDisplayed);
  }
}
