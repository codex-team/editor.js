import Dom from '../dom';
import Listeners from './listeners';
import Flipper from '../flipper';
import SearchInput from './search-input';
import EventsDispatcher from './events';
import { isMobileScreen, keyCodes, cacheable } from '../utils';
import ScrollLocker from './scroll-locker';
import { PopoverItem, PopoverItemWithConfirmation } from '../../../types';

/**
 * Event that can be triggered by the Popover
 */
export enum PopoverEvent {
  /**
   * When popover overlay is clicked
   */
  OverlayClicked = 'overlay-clicked',
}

/**
 * Popover is the UI element for displaying vertical lists
 */
export default class Popover extends EventsDispatcher<PopoverEvent> {
  /**
   * Items list to be displayed
   */
  private readonly items: PopoverItem[];

  /**
   * Arbitrary html element to be inserted before items list
   */
  private readonly customContent: HTMLElement;

  /**
   * Stores the visibility state.
   */
  private isShown = false;

  /**
   * Created nodes
   */
  private nodes: {
    wrapper: HTMLElement;
    popover: HTMLElement;
    items: HTMLElement;
    nothingFound: HTMLElement;
    overlay: HTMLElement;
  } = {
    wrapper: null,
    popover: null,
    items: null,
    nothingFound: null,
    overlay: null,
  }

  /**
   * Additional wrapper's class name
   */
  private readonly className: string;

  /**
   * Listeners util instance
   */
  private listeners: Listeners;

  /**
   * Flipper - module for keyboard iteration between elements
   */
  private flipper: Flipper;

  /**
   * Pass true to enable local search field
   */
  private readonly searchable: boolean;

  /**
   * Instance of the Search Input
   */
  private search: SearchInput;

  /**
   * Label for the 'Filter' placeholder
   */
  private readonly filterLabel: string;

  /**
   * Label for the 'Nothing found' message
   */
  private readonly nothingFoundLabel: string;

  /**
   * Style classes
   */
  public static get CSS(): {
    popover: string;
    popoverOpened: string;
    itemsWrapper: string;
    item: string;
    itemHidden: string;
    itemFlippable: string;
    itemFocused: string;
    itemActive: string;
    itemDisabled: string;
    itemLabel: string;
    itemIcon: string;
    itemSecondaryLabel: string;
    itemConfirmation: string;
    noFoundMessage: string;
    noFoundMessageShown: string;
    popoverOverlay: string;
    popoverOverlayHidden: string;
    customContent: string;
    customContentHidden: string;
    } {
    return {
      popover: 'ce-popover',
      popoverOpened: 'ce-popover--opened',
      itemsWrapper: 'ce-popover__items',
      item: 'ce-popover__item',
      itemHidden: 'ce-popover__item--hidden',
      itemFlippable: 'ce-popover__item--flippable',
      itemFocused: 'ce-popover__item--focused',
      itemActive: 'ce-popover__item--active',
      itemDisabled: 'ce-popover__item--disabled',
      itemConfirmation: 'ce-popover__item--confirmation',
      itemLabel: 'ce-popover__item-label',
      itemIcon: 'ce-popover__item-icon',
      itemSecondaryLabel: 'ce-popover__item-secondary-label',
      noFoundMessage: 'ce-popover__no-found',
      noFoundMessageShown: 'ce-popover__no-found--shown',
      popoverOverlay: 'ce-popover__overlay',
      popoverOverlayHidden: 'ce-popover__overlay--hidden',
      customContent: 'ce-popover__custom-content',
      customContentHidden: 'ce-popover__custom-content--hidden',
    };
  }

  /**
   * ScrollLocker instance
   */
  private scrollLocker = new ScrollLocker()

  /**
   * Editor container element
   */
  private scopeElement: HTMLElement;

  /**
   * Reference to popover item that was clicked but requires second click to confirm action
   */
  private itemRequiringConfirmation = null;

  /**
   * Creates the Popover
   *
   * @param options - config
   * @param options.items - config for items to be displayed
   * @param options.className - additional class name to be added to the popover wrapper
   * @param options.filterLabel - label for the search Field
   * @param options.nothingFoundLabel - label of the 'nothing found' message
   * @param options.customContent - arbitrary html element to be inserted before items list
   * @param options.scopeElement - editor container element
   */
  constructor({ items, className, searchable, filterLabel, nothingFoundLabel, customContent, scopeElement }: {
    items: PopoverItem[];
    className?: string;
    searchable?: boolean;
    filterLabel: string;
    nothingFoundLabel: string;
    customContent?: HTMLElement;
    scopeElement: HTMLElement;
  }) {
    super();
    this.items = items;
    this.customContent = customContent;
    this.className = className || '';
    this.searchable = searchable;
    this.listeners = new Listeners();
    this.scopeElement = scopeElement;

    this.filterLabel = filterLabel;
    this.nothingFoundLabel = nothingFoundLabel;

    this.render();
    this.enableFlipper();
  }

  /**
   * Returns rendered wrapper
   */
  public getElement(): HTMLElement {
    return this.nodes.wrapper;
  }

  /**
   * Shows the Popover
   */
  public show(): void {
    /**
     * Open the popover above the button
     * if there is not enough available space below it
     */
    if (!this.shouldOpenPopoverBottom) {
      this.nodes.wrapper.style.setProperty('--popover-height', this.calculateHeight() + 'px');
      this.nodes.wrapper.classList.add(this.className + '--opened-top');
    }

    /**
     * Clear search and items scrolling
     */
    if (this.search) {
      this.search.clear();
    }

    this.nodes.items.scrollTop = 0;

    this.nodes.popover.classList.add(Popover.CSS.popoverOpened);
    this.nodes.overlay.classList.remove(Popover.CSS.popoverOverlayHidden);
    this.flipper.activate();

    if (this.searchable) {
      window.requestAnimationFrame(() => {
        this.search.focus();
      });
    }

    if (isMobileScreen()) {
      this.scrollLocker.lock();
    }

    this.isShown = true;
  }

  /**
   * Hides the Popover
   */
  public hide(): void {
    /**
     * If it's already hidden, do nothing
     * to prevent extra DOM operations
     */
    if (!this.isShown) {
      return;
    }

    this.nodes.popover.classList.remove(Popover.CSS.popoverOpened);
    this.nodes.overlay.classList.add(Popover.CSS.popoverOverlayHidden);
    this.flipper.deactivate();

    if (isMobileScreen()) {
      this.scrollLocker.unlock();
    }

    this.isShown = false;
    this.nodes.wrapper.classList.remove(this.className + '--opened-top');

    this.cleanUpConfirmationState();
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.flipper.deactivate();
    this.listeners.removeAll();
  }

  /**
   * Returns true if some item is focused
   */
  public hasFocus(): boolean {
    return this.flipper.hasFocus();
  }

  /**
   * Helps to calculate height of popover while it is not displayed on screen.
   * Renders invisible clone of popover to get actual height.
   */
  @cacheable
  private calculateHeight(): number {
    let height = 0;
    const popoverClone = this.nodes.popover.cloneNode(true) as HTMLElement;

    popoverClone.style.visibility = 'hidden';
    popoverClone.style.position = 'absolute';
    popoverClone.style.top = '-1000px';
    popoverClone.classList.add(Popover.CSS.popoverOpened);
    document.body.appendChild(popoverClone);
    height = popoverClone.offsetHeight;
    popoverClone.remove();

    return height;
  }

  /**
   * Makes the UI
   */
  private render(): void {
    this.nodes.wrapper = Dom.make('div', this.className);
    this.nodes.popover = Dom.make('div', Popover.CSS.popover);
    this.nodes.wrapper.appendChild(this.nodes.popover);

    this.nodes.overlay = Dom.make('div', [Popover.CSS.popoverOverlay, Popover.CSS.popoverOverlayHidden]);
    this.nodes.wrapper.appendChild(this.nodes.overlay);

    if (this.searchable) {
      this.addSearch(this.nodes.popover);
    }

    if (this.customContent) {
      this.customContent.classList.add(Popover.CSS.customContent);
      this.nodes.popover.appendChild(this.customContent);
    }

    this.nodes.items = Dom.make('div', Popover.CSS.itemsWrapper);
    this.items.forEach(item => {
      this.nodes.items.appendChild(this.createItem(item));
    });

    this.nodes.popover.appendChild(this.nodes.items);
    this.nodes.nothingFound = Dom.make('div', [ Popover.CSS.noFoundMessage ], {
      textContent: this.nothingFoundLabel,
    });

    this.nodes.popover.appendChild(this.nodes.nothingFound);

    this.listeners.on(this.nodes.popover, 'click', (event: PointerEvent) => {
      const clickedItem = (event.target as HTMLElement).closest(`.${Popover.CSS.item}`) as HTMLElement;

      if (clickedItem) {
        this.itemClicked(clickedItem, event as PointerEvent);
      }
    });

    this.listeners.on(this.nodes.overlay, 'click', () => {
      this.emit(PopoverEvent.OverlayClicked);
    });
  }

  /**
   * Adds the s4arch field to passed element
   *
   * @param holder - where to append search input
   */
  private addSearch(holder: HTMLElement): void {
    this.search = new SearchInput({
      items: this.items,
      placeholder: this.filterLabel,
      onSearch: (filteredItems): void => {
        const searchResultElements = [];

        this.items.forEach((item, index) => {
          const itemElement = this.nodes.items.children[index];

          if (filteredItems.includes(item)) {
            searchResultElements.push(itemElement);
            itemElement.classList.remove(Popover.CSS.itemHidden);
          } else {
            itemElement.classList.add(Popover.CSS.itemHidden);
          }
        });

        this.nodes.nothingFound.classList.toggle(Popover.CSS.noFoundMessageShown, searchResultElements.length === 0);

        /**
         * In order to make keyboard navigation work correctly, flipper should be reactivated with only visible items.
         * As custom html content is not displayed while search, it should be excluded from keyboard navigation.
         */
        const allItemsDisplayed = filteredItems.length === this.items.length;

        /**
         * Contains list of elements available for keyboard navigation considering search query applied
         */
        const flippableElements = allItemsDisplayed ? this.flippableElements : searchResultElements;

        if (this.customContent) {
          this.customContent.classList.toggle(Popover.CSS.customContentHidden, !allItemsDisplayed);
        }

        /**
         * Update flipper items with only visible
         */
        this.reactivateFlipper(flippableElements);
        this.flipper.focusFirst();
      },
    });

    const searchField = this.search.getElement();

    holder.appendChild(searchField);
  }

  /**
   * Renders the single item
   *
   * @param item - item data to be rendered
   */
  private createItem(item: PopoverItem): HTMLElement {
    const el = Dom.make('div', Popover.CSS.item);

    if (item.name) {
      el.dataset.itemName = item.name;
    }
    const label = Dom.make('div', Popover.CSS.itemLabel, {
      innerHTML: item.label,
    });

    if (item.icon) {
      el.appendChild(Dom.make('div', Popover.CSS.itemIcon, {
        innerHTML: item.icon,
      }));
    }

    el.appendChild(label);

    if (item.secondaryLabel) {
      el.appendChild(Dom.make('div', Popover.CSS.itemSecondaryLabel, {
        textContent: item.secondaryLabel,
      }));
    }

    if (item.isActive) {
      el.classList.add(Popover.CSS.itemActive);
    }

    if (item.isDisabled) {
      el.classList.add(Popover.CSS.itemDisabled);
    }

    return el;
  }

  /**
   * Item click handler
   *
   * @param itemEl - clicked item
   * @param event - click event
   */
  private itemClicked(itemEl: HTMLElement, event: PointerEvent): void {
    const allItems = this.nodes.wrapper.querySelectorAll(`.${Popover.CSS.item}`);
    const itemIndex = Array.from(allItems).indexOf(itemEl);
    const clickedItem = this.items[itemIndex];

    if (clickedItem.isDisabled) {
      return;
    }

    this.cleanUpConfirmationState();

    if (clickedItem.confirmation) {
      this.enableConfirmationStateForItem(clickedItem as PopoverItemWithConfirmation, itemEl, itemIndex);

      return;
    }

    clickedItem.onActivate(clickedItem, event);

    if (clickedItem.closeOnActivate) {
      this.hide();
    } else {
      /** If popover is not intended to close once item is activated, we need to update active state of activated item */
      clickedItem.isActive = !clickedItem.isActive;
      itemEl.classList.toggle(Popover.CSS.itemActive);
    }
  }

  /**
   * Enables confirmation state for specified item.
   * Replaces item element in popover so that is becomes highlighted in a special way
   *
   * @param item - item to enable confirmation state for
   * @param itemEl - html element corresponding to the item
   * @param itemIndex - index of the item in all items list
   */
  private enableConfirmationStateForItem(item: PopoverItemWithConfirmation, itemEl: HTMLElement, itemIndex: number): void {
    /** Save root item requiring confirmation to restore original state on popover hide */
    if (this.itemRequiringConfirmation === null) {
      this.itemRequiringConfirmation = item;
    }
    const newItemData = {
      ...item,
      ...item.confirmation,
    } as PopoverItem;

    /** Prevent confirmation loop */
    if (newItemData.confirmation === item.confirmation) {
      delete newItemData.confirmation;
    }

    this.items[itemIndex] = newItemData;

    const confirmationStateItemEl = this.createItem(newItemData as PopoverItem);

    confirmationStateItemEl.classList.add(Popover.CSS.itemConfirmation);
    itemEl.parentElement.replaceChild(confirmationStateItemEl, itemEl);

    this.reactivateFlipper(
      this.flippableElements,
      this.flippableElements.indexOf(confirmationStateItemEl)
    );
  }

  /**
   * Brings popover item in confirmation state to its original state
   */
  private cleanUpConfirmationState(): void {
    if (!this.itemRequiringConfirmation) {
      return;
    }
    const confirmationStateItemEl = this.nodes.wrapper.querySelector(`.${Popover.CSS.itemConfirmation}`);
    const allItems = this.nodes.wrapper.querySelectorAll(`.${Popover.CSS.item}`);
    const itemIndex = Array.from(allItems).indexOf(confirmationStateItemEl);
    const originalStateItemEl = this.createItem(this.itemRequiringConfirmation);

    confirmationStateItemEl.parentElement.replaceChild(originalStateItemEl, confirmationStateItemEl);
    this.items[itemIndex] = this.itemRequiringConfirmation;
    this.itemRequiringConfirmation = null;

    this.reactivateFlipper(
      this.flippableElements,
      this.flippableElements.indexOf(originalStateItemEl)
    );
  }

  /**
   * Reactivates flipper instance.
   * Should be used if popover items html elements get replaced to preserve workability of keyboard navigation
   *
   * @param items - html elements to navigate through
   * @param focusedIndex - index of element to be focused
   */
  private reactivateFlipper(items: HTMLElement[], focusedIndex?: number): void {
    this.flipper.deactivate();
    this.flipper.activate(items, focusedIndex);
  }

  /**
   * Creates Flipper instance to be able to leaf tools
   */
  private enableFlipper(): void {
    this.flipper = new Flipper({
      items: this.flippableElements,
      focusedItemClass: Popover.CSS.itemFocused,
      allowedKeys: [
        keyCodes.TAB,
        keyCodes.UP,
        keyCodes.DOWN,
        keyCodes.ENTER,
      ],
    });
  }

  /**
   * Returns list of elements available for keyboard navigation.
   * Contains both usual popover items elements and custom html content.
   */
  private get flippableElements(): HTMLElement[] {
    /**
     * Select html elements of popover items
     */
    const popoverItemsElements = Array.from(this.nodes.wrapper.querySelectorAll(`.${Popover.CSS.item}`)) as HTMLElement[];

    /**
     * Select html elements inside custom content that are marked with special css class to be available for keyboard navigation
     */
    const customContentElements = this.customContent ? Array.from(this.customContent.querySelectorAll(
      `.${Popover.CSS.itemFlippable}`
    )) as HTMLElement[] : [];

    /**
     * Combine both lists and return
     */
    return customContentElements.concat(popoverItemsElements);
  }

  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  private get shouldOpenPopoverBottom(): boolean {
    const toolboxRect = this.nodes.wrapper.getBoundingClientRect();
    const scopeElementRect = this.scopeElement.getBoundingClientRect();
    const popoverHeight = this.calculateHeight();
    const popoverPotentialBottomEdge = toolboxRect.top + popoverHeight;
    const popoverPotentialTopEdge = toolboxRect.top - popoverHeight;
    const bottomEdgeForComparison = Math.min(window.innerHeight, scopeElementRect.bottom);

    return popoverPotentialTopEdge < scopeElementRect.top || popoverPotentialBottomEdge <= bottomEdgeForComparison;
  }
}
