import { PopoverItem, cls as popoverItemCls } from './components/popover-item';
import Dom from '../../dom';
import { cacheable, keyCodes, isMobileScreen } from '../../utils';
import Flipper from '../../flipper';
import { SearchInput, SearchableItem } from './components/search-input';
import EventsDispatcher from '../events';
import Listeners from '../listeners';
import ScrollLocker from '../scroll-locker';
import { PopoverEventMap, PopoverMessages, PopoverParams, PopoverEvent } from './popover.typings';
import { PopoverItem as PopoverItemParams } from '../../../../types';
import { PopoverHeader } from './components/popover-header';
import { PopoverStatesHistory } from './utils/popover-states-history';

/**
 * Class responsible for rendering popover and handling its behaviour
 */
export default class Popover extends EventsDispatcher<PopoverEventMap> {
  /**
   * Flipper - module for keyboard iteration between elements
   */
  public flipper: Flipper | undefined;

  /**
   * List of popover items
   */
  private items: PopoverItem[];

  /**
   * Element of the page that creates 'scope' of the popover.
   * If possible, popover will not cross specified element's borders when opening.
   */
  private scopeElement: HTMLElement = document.body;

  /**
   * List of html elements inside custom content area that should be available for keyboard navigation
   */
  private customContentFlippableItems: HTMLElement[] | undefined;

  /**
   * Instance of the Search Input
   */
  private search: SearchInput | undefined;

  /**
   * Listeners util instance
   */
  private listeners: Listeners = new Listeners();

  /**
   * ScrollLocker instance
   */
  private scrollLocker = new ScrollLocker();

  /**
   * Reference to nested popover if exists
   */
  private nestedPopover: Popover | undefined | null;

  /**
   * Reference to popover header if exists
   */
  private header: PopoverHeader | undefined | null;

  /**
   * History of popover states for back navigation.
   * Is used for mobile version of popover,
   * where we can not display nested popover of the screen and
   * have to render nested items in the same popover switching to new state
   */
  private history = new PopoverStatesHistory();

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
   * Popover CSS classes
   */
  private static get CSS(): { [key: string]: string } {
    return {
      popover: 'ce-popover',
      popoverContainer: 'ce-popover__container',
      popoverOpenTop: 'ce-popover--open-top',
      popoverOpened: 'ce-popover--opened',
      search: 'ce-popover__search',
      nothingFoundMessage: 'ce-popover__nothing-found-message',
      nothingFoundMessageDisplayed: 'ce-popover__nothing-found-message--displayed',
      customContent: 'ce-popover__custom-content',
      customContentHidden: 'ce-popover__custom-content--hidden',
      items: 'ce-popover__items',
      overlay: 'ce-popover__overlay',
      overlayHidden: 'ce-popover__overlay--hidden',
      popoverNested: 'ce-popover--nested',
      popoverHeader: 'ce-popover__header',
    };
  }

  /**
   * Refs to created HTML elements
   */
  private nodes: {
    popover: HTMLElement | null;
    popoverContainer: HTMLElement | null;
    nothingFoundMessage: HTMLElement | null;
    customContent: HTMLElement | null;
    items: HTMLElement | null;
    overlay: HTMLElement | null;
    header: HTMLElement | null;
  } = {
      popover: null,
      popoverContainer: null,
      nothingFoundMessage: null,
      customContent: null,
      items: null,
      overlay: null,
      header: null,
    };

  /**
   * Messages that will be displayed in popover
   */
  private messages: PopoverMessages = {
    nothingFound: 'Nothing found',
    search: 'Search',
  };

  /**
   * Constructs the instance
   *
   * @param params - popover construction params
   */
  constructor(private readonly params: PopoverParams) {
    super();

    this.items = params.items.map(item => new PopoverItem(item));

    if (params.scopeElement !== undefined) {
      this.scopeElement = params.scopeElement;
    }

    if (params.nestingLevel) {
      this.nestingLevel = params.nestingLevel;
    }

    if (params.messages) {
      this.messages = {
        ...this.messages,
        ...params.messages,
      };
    }

    if (params.customContentFlippableItems) {
      this.customContentFlippableItems = params.customContentFlippableItems;
    }

    this.make();

    if (params.customContent) {
      this.addCustomContent(params.customContent);
    }

    if (params.searchable) {
      this.addSearch();
    }

    this.initializeFlipper();

    /* Save state to history for proper navigation between nested and parent popovers */
    this.history.push({ items: params.items });
  }

  /**
   * Returns HTML element corresponding to the popover
   */
  public getElement(): HTMLElement {
    return this.nodes.popover as HTMLElement;
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
    this.nodes.popover?.style.setProperty('--popover-height', this.height + 'px');

    if (!this.shouldOpenBottom) {
      this.nodes.popover?.classList.add(Popover.CSS.popoverOpenTop);
    }

    this.nodes.overlay?.classList.remove(Popover.CSS.overlayHidden);
    this.nodes.popover?.classList.add(Popover.CSS.popoverOpened);
    this.flipper?.activate(this.flippableElements);

    if (this.search !== undefined) {
      this.search?.focus();
    }

    if (isMobileScreen()) {
      this.scrollLocker.lock();
    }
  }

  /**
   * Closes popover
   */
  public hide(): void {
    this.nodes.popover?.classList.remove(Popover.CSS.popoverOpened);
    this.nodes.popover?.classList.remove(Popover.CSS.popoverOpenTop);
    this.nodes.overlay?.classList.add(Popover.CSS.overlayHidden);
    this.flipper?.deactivate();
    this.items.forEach(item => item.reset());

    if (this.search !== undefined) {
      this.search.clear();
    }

    if (isMobileScreen()) {
      this.scrollLocker.unlock();
    }

    this.emit(PopoverEvent.Close);

    this.destroyNestedPopoverIfExists();

    this.previouslyHoveredItem = null;
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.flipper?.deactivate();
    this.listeners.removeAll();
    this.destroyNestedPopoverIfExists();

    if (isMobileScreen()) {
      this.scrollLocker.unlock();
    }
  }

  /**
   * Constructs HTML element corresponding to popover
   */
  private make(): void {
    this.nodes.popoverContainer = Dom.make('div', [ Popover.CSS.popoverContainer ]);

    this.nodes.nothingFoundMessage = Dom.make('div', [ Popover.CSS.nothingFoundMessage ], {
      textContent: this.messages.nothingFound,
    });

    this.nodes.popoverContainer.appendChild(this.nodes.nothingFoundMessage);
    this.nodes.items = Dom.make('div', [ Popover.CSS.items ]);

    this.items.forEach(item => {
      const itemEl = item.getElement();

      if (itemEl === null) {
        return;
      }

      this.nodes.items?.appendChild(itemEl);
    });

    this.nodes.popoverContainer.appendChild(this.nodes.items);

    this.listeners.on(this.nodes.popoverContainer, 'click', (event: Event) => this.handleClick(event));

    if (!isMobileScreen()) {
      this.listeners.on(this.nodes.popoverContainer, 'mouseover', (event: Event) => this.handleHover(event));
    }

    this.nodes.popover = Dom.make('div', [
      Popover.CSS.popover,
      this.nestingLevel > 0 ? Popover.CSS.popoverNested : undefined,
      this.params.class,
    ]);

    this.nodes.overlay = Dom.make('div', [Popover.CSS.overlay, Popover.CSS.overlayHidden]);

    this.listeners.on(this.nodes.overlay, 'click', () => {
      this.hide();
    });

    this.nodes.popover.appendChild(this.nodes.overlay);
    this.nodes.popover.appendChild(this.nodes.popoverContainer);
  }

  /**
   * Adds search to the popover
   */
  private addSearch(): void {
    this.search = new SearchInput({
      items: this.items,
      placeholder: this.messages.search,
      onSearch: (query: string, result: SearchableItem[]): void => {
        this.items.forEach(item => {
          const isHidden = !result.includes(item);

          item.toggleHidden(isHidden);
        });
        this.toggleNothingFoundMessage(result.length === 0);
        this.toggleCustomContent(query !== '');

        /** List of elements available for keyboard navigation considering search query applied */
        const flippableElements = query === '' ? this.flippableElements : result.map(item => (item as PopoverItem).getElement());

        if (this.flipper?.isActivated) {
          /** Update flipper items with only visible */
          this.flipper.deactivate();
          this.flipper.activate(flippableElements as HTMLElement[]);
        }
      },
    });

    const searchElement = this.search.getElement();

    if (searchElement === undefined) {
      return;
    }

    searchElement.classList.add(Popover.CSS.search);

    this.nodes.popoverContainer?.insertBefore(searchElement, this.nodes.popoverContainer.firstChild);
  }

  /**
   * Adds custom html content to the popover
   *
   * @param content - html content to append
   */
  private addCustomContent(content: HTMLElement): void {
    this.nodes.customContent = content;
    this.nodes.customContent.classList.add(Popover.CSS.customContent);
    this.nodes.popoverContainer?.insertBefore(content, this.nodes.popoverContainer.firstChild);
  }

  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  private getTargetItem(event: Event): PopoverItem | undefined {
    return this.items.find(el => {
      const itemEl = el.getElement();

      if (itemEl === null) {
        return false;
      }

      return event.composedPath().includes(itemEl);
    });
  }

  /**
   * Handles clicks inside popover
   *
   * @param event - item to handle click of
   */
  private handleClick(event: Event): void {
    const item = this.getTargetItem(event);

    if (item === undefined) {
      return;
    }

    if (item.isDisabled) {
      return;
    }

    if (item.children.length > 0) {
      if (isMobileScreen()) {
        /** Show nested items */
        this.updateItemsAndHeader(item.children, item.title);

        this.history.push({
          title: item.title,
          items: item.children,
        });
      } else {
        if (this.nestedPopover == null || this.nestedPopover === undefined) {
          this.showNestedPopoverForItem(item);
        }
      }

      return;
    }

    /** Cleanup other items state */
    this.items.filter(x => x !== item).forEach(x => x.reset());

    item.handleClick();

    this.toggleItemActivenessIfNeeded(item);

    if (item.closeOnActivate) {
      this.hide();
    }
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

  /**
   * Removes rendered popover items and header and displays new ones
   *
   * @param title - new popover header text
   * @param items - new popover items
   */
  private updateItemsAndHeader(items: PopoverItemParams[], title?: string ): void {
    /** Re-render header */
    if (this.header !== null && this.header !== undefined) {
      this.header.destroy();
      this.header = null;
    }
    if (title !== undefined) {
      this.header = new PopoverHeader({
        text: title,
        onBackButtonClick: () => {
          this.history.pop();

          this.updateItemsAndHeader(this.history.currentItems, this.history.currentTitle);
        },
      });
      const headerEl = this.header.getElement();

      if (headerEl !== null) {
        this.nodes.popoverContainer?.insertBefore(headerEl, this.nodes.popoverContainer.firstChild);
      }
    }

    /** Re-render items */
    this.flipper?.deactivate();
    this.items.forEach(item => item.getElement()?.remove());

    this.items = items.map(params => new PopoverItem(params));

    this.items.forEach(item => {
      const itemEl = item.getElement();

      if (itemEl === null) {
        return;
      }
      this.nodes.items?.appendChild(itemEl);
    });

    this.flipper?.activate(this.flippableElements);
  }


  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  private showNestedPopoverForItem(item: PopoverItem): void {
    this.nestedPopover = new Popover({
      items: item.children,
      nestingLevel: this.nestingLevel + 1,
    });

    const nestedPopoverEl = this.nestedPopover.getElement();

    this.nodes.popover?.appendChild(nestedPopoverEl);
    const itemEl =  item.getElement();
    const itemOffsetTop = (itemEl ? itemEl.offsetTop : 0) - this.scrollTop;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const topOffset = this.offsetTop + itemOffsetTop - 4;

    nestedPopoverEl.style.setProperty('--nested-popover-top', topOffset + 'px');
    nestedPopoverEl.style.setProperty('--nesting-level', this.nestedPopover.nestingLevel.toString());

    this.nestedPopover.show();
    this.flipper?.deactivate();
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
    this.flipper?.activate(this.flippableElements);
  }


  /**
   * Creates Flipper instance which allows to navigate between popover items via keyboard
   */
  private initializeFlipper(): void {
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

  /**
   * Returns list of elements available for keyboard navigation.
   * Contains both usual popover items elements and custom html content.
   */
  private get flippableElements(): HTMLElement[] {
    const popoverItemsElements = this.items.map(item => item.getElement());
    const customContentControlsElements = this.customContentFlippableItems || [];

    /**
     * Combine elements inside custom content area with popover items elements
     */
    return customContentControlsElements.concat(popoverItemsElements as HTMLElement[]);
  }

  /**
   * Helps to calculate height of popover while it is not displayed on screen.
   * Renders invisible clone of popover to get actual height.
   */
  @cacheable
  private get height(): number {
    let height = 0;

    if (this.nodes.popover === null) {
      return height;
    }

    const popoverClone = this.nodes.popover.cloneNode(true) as HTMLElement;

    popoverClone.style.visibility = 'hidden';
    popoverClone.style.position = 'absolute';
    popoverClone.style.top = '-1000px';

    popoverClone.classList.add(Popover.CSS.popoverOpened);
    popoverClone.querySelector('.' + Popover.CSS.popoverNested)?.remove();
    document.body.appendChild(popoverClone);

    const container =  popoverClone.querySelector('.' + Popover.CSS.popoverContainer) as HTMLElement;

    height = container.offsetHeight;

    popoverClone.remove();

    return height;
  }

  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  private get shouldOpenBottom(): boolean {
    if (this.nodes.popover === undefined || this.nodes.popover === null) {
      return false;
    }
    const popoverRect = this.nodes.popover.getBoundingClientRect();
    const scopeElementRect = this.scopeElement.getBoundingClientRect();
    const popoverHeight = this.height;
    const popoverPotentialBottomEdge = popoverRect.top + popoverHeight;
    const popoverPotentialTopEdge = popoverRect.top - popoverHeight;
    const bottomEdgeForComparison = Math.min(window.innerHeight, scopeElementRect.bottom);

    return popoverPotentialTopEdge < scopeElementRect.top || popoverPotentialBottomEdge <= bottomEdgeForComparison;
  }

  /**
   * Called on flipper navigation
   */
  private onFlip = (): void => {
    const focusedItem = this.items.find(item => item.isFocused);

    focusedItem?.onFocus();
  };

  /**
   * Toggles nothing found message visibility
   *
   * @param isDisplayed - true if the message should be displayed
   */
  private toggleNothingFoundMessage(isDisplayed: boolean): void {
    this.nodes.nothingFoundMessage?.classList.toggle(Popover.CSS.nothingFoundMessageDisplayed, isDisplayed);
  }

  /**
   * Toggles custom content visibility
   *
   * @param isDisplayed - true if custom content should be displayed
   */
  private toggleCustomContent(isDisplayed: boolean): void {
    this.nodes.customContent?.classList.toggle(Popover.CSS.customContentHidden, isDisplayed);
  }

  /**
   * - Toggles item active state, if clicked popover item has property 'toggle' set to true.
   *
   * - Performs radiobutton-like behavior if the item has property 'toggle' set to string key.
   * (All the other items with the same key get inactive, and the item gets active)
   *
   * @param clickedItem - popover item that was clicked
   */
  private toggleItemActivenessIfNeeded(clickedItem: PopoverItem): void {
    if (clickedItem.toggle === true) {
      clickedItem.toggleActive();
    }

    if (typeof clickedItem.toggle === 'string') {
      const itemsInToggleGroup = this.items.filter(item => item.toggle === clickedItem.toggle);

      /** If there's only one item in toggle group, toggle it */
      if (itemsInToggleGroup.length === 1) {
        clickedItem.toggleActive();

        return;
      }

      /** Set clicked item as active and the rest items with same toggle key value as inactive */
      itemsInToggleGroup.forEach(item => {
        item.toggleActive(item === clickedItem);
      });
    }
  }
}
