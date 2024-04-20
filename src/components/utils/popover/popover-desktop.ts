import Flipper from '../../flipper';
import { PopoverAbstract } from './popover-abstract';
import { PopoverItem, css as popoverItemCls } from './components/popover-item';
import { PopoverParams } from './popover.types';
import { keyCodes } from '../../utils';
import { css } from './popover.const';
import { SearchableItem } from './components/search-input';
import { cacheable } from '../../utils';
import { PopoverItemDefault } from './components/popover-item';

/**
 * Desktop popover.
 * On desktop devices popover behaves like a floating element. Nested popover appears at right or left side.
 */
export class PopoverDesktop extends PopoverAbstract {
  /**
   * Flipper - module for keyboard iteration between elements
   */
  public flipper: Flipper;

  /**
   * List of html elements inside custom content area that should be available for keyboard navigation
   */
  private customContentFlippableItems: HTMLElement[] | undefined;

  /**
   * Reference to nested popover if exists.
   * Undefined by default, PopoverDesktop when exists and null after destroyed.
   */
  private nestedPopover: PopoverDesktop | undefined | null;

  /**
   * Last hovered item inside popover.
   * Is used to determine if cursor is moving inside one item or already moved away to another one.
   * Helps prevent reopening nested popover while cursor is moving inside one item area.
   */
  private previouslyHoveredItem: PopoverItem | null = null;

  /**
   * Popover nesting level. 0 value means that it is a root popover
   */
  private nestingLevel = 0;

  /**
   * Element of the page that creates 'scope' of the popover.
   * If possible, popover will not cross specified element's borders when opening.
   */
  private scopeElement: HTMLElement = document.body;

  /**
   * Construct the instance
   *
   * @param params - popover params
   */
  constructor(params: PopoverParams) {
    super(params);

    if (params.nestingLevel !== undefined) {
      this.nestingLevel = params.nestingLevel;
    }

    if (this.nestingLevel > 0) {
      this.nodes.popover.classList.add(css.popoverNested);
    }

    if (params.customContentFlippableItems) {
      this.customContentFlippableItems = params.customContentFlippableItems;
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

    this.search?.addSearchHandler(this.handleSearch);
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

    this.flipper.deactivate();

    this.destroyNestedPopoverIfExists();

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
  protected override showNestedItems(item: PopoverItemDefault): void {
    if (this.nestedPopover !== null && this.nestedPopover !== undefined) {
      return;
    }
    this.showNestedPopoverForItem(item);
  }

  /**
   * Additionaly handles input inside search field.
   * Updates flipper items considering search query applied.
   *
   * @param query - search query text
   * @param result - search results
   */
  private handleSearch = (query: string, result: SearchableItem[]): void => {
    /** List of elements available for keyboard navigation considering search query applied */
    const flippableElements = query === '' ? this.flippableElements : result.map(item => (item as PopoverItem).getElement());

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
  private get size(): {height: number; width: number} {
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
   * Contains both usual popover items elements and custom html content.
   */
  private get flippableElements(): HTMLElement[] {
    const popoverItemsElements = this.itemsInteractive.map(item => item.getElement());
    const customContentControlsElements = this.customContentFlippableItems || [];

    /**
     * Combine elements inside custom content area with popover items elements
     */
    return customContentControlsElements.concat(popoverItemsElements as HTMLElement[]);
  }

  /**
   * Called on flipper navigation
   */
  private onFlip = (): void => {
    const focusedItem = this.itemsInteractive.find(item => item.isFocused);

    focusedItem?.onFocus();
  };

  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  private showNestedPopoverForItem(item: PopoverItemDefault): void {
    this.nestedPopover = new PopoverDesktop({
      items: item.children,
      nestingLevel: this.nestingLevel + 1,
    });

    const nestedPopoverEl = this.nestedPopover.getElement();

    this.nodes.popover.appendChild(nestedPopoverEl);
    const itemEl =  item.getElement();
    const itemOffsetTop = (itemEl ? itemEl.offsetTop : 0) - this.scrollTop;
    const topOffset = this.offsetTop + itemOffsetTop;

    nestedPopoverEl.style.setProperty('--trigger-item-top', topOffset + 'px');
    nestedPopoverEl.style.setProperty('--nesting-level', this.nestedPopover.nestingLevel.toString());

    this.nestedPopover.show();
    this.flipper.deactivate();
  }

  /**
   * Handles hover events inside popover items container
   *
   * @param event - hover event data
   */
  private handleHover(event: Event): void {
    const item = this.getTargetItem(event);

    if (item === undefined) {
      return;
    }

    if (this.previouslyHoveredItem === item) {
      return;
    }

    this.destroyNestedPopoverIfExists();

    this.previouslyHoveredItem = item;

    if (item.children.length === 0) {
      return;
    }

    this.showNestedPopoverForItem(item);
  }
}
