import { PopoverItem } from './popover-item';
import Dom from '../../dom';
import { cacheable, keyCodes, isMobileScreen } from '../../utils';
import Flipper from '../../flipper';
import { PopoverItem as PopoverItemParams } from '../../../../types';
import SearchInput from './search-input';
import EventsDispatcher from '../events';
import Listeners from '../listeners';
import ScrollLocker from '../scroll-locker';

/**
 * Params required to render popover
 */
interface PopoverParams {
  /**
   * Popover items config
   */
  items: PopoverItemParams[];

  /**
   * Element of the page that creates 'scope' of the popover
   */
  scopeElement?: HTMLElement;

  /**
   * Arbitrary html element to be inserted before items list
   */
  customContent?: HTMLElement;

  /**
   * List of html elements inside custom content area that should be available for keyboard navigation
   */
  customContentFlippableItems?: HTMLElement[];

  /**
   * True if popover should contain search field
   */
  searchable?: boolean;

  /**
   * Popover texts overrides
   */
  messages?: PopoverMessages
}

/**
 * Texts used inside popover
 */
interface PopoverMessages {
  /** Text displayed when search has no results */
  nothingFound?: string;

  /** Search input label */
  search?: string
}

/**
 * Event that can be triggered by the Popover
 */
export enum PopoverEvent {
  /**
   * When popover closes
   */
  Close = 'close'
}

/**
 * Events fired by the Popover
 */
interface PopoverEventMap {
  [PopoverEvent.Close]: undefined;
}


/**
 * Class responsible for rendering popover and handling its behaviour
 */
export default class Popover extends EventsDispatcher<PopoverEventMap> {
  /**
   * Flipper - module for keyboard iteration between elements
   */
  public flipper: Flipper;

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
   * Popover CSS classes
   */
  private static get CSS(): {
    popover: string;
    popoverOpenTop: string;
    popoverOpened: string;
    search: string;
    nothingFoundMessage: string;
    nothingFoundMessageDisplayed: string;
    customContent: string;
    customContentHidden: string;
    items: string;
    overlay: string;
    overlayHidden: string;
    } {
    return {
      popover: 'ce-popover',
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
    };
  }

  /**
   * Refs to created HTML elements
   */
  private nodes: {
    wrapper: HTMLElement | null;
    popover: HTMLElement | null;
    nothingFoundMessage: HTMLElement | null;
    customContent: HTMLElement | null;
    items: HTMLElement | null;
    overlay: HTMLElement | null;
  } = {
      wrapper: null,
      popover: null,
      nothingFoundMessage: null,
      customContent: null,
      items: null,
      overlay: null,
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
  constructor(params: PopoverParams) {
    super();

    this.items = params.items.map(item => new PopoverItem(item));

    if (params.scopeElement !== undefined) {
      this.scopeElement = params.scopeElement;
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
  }

  /**
   * Returns HTML element corresponding to the popover
   */
  public getElement(): HTMLElement | null {
    return this.nodes.wrapper;
  }

  /**
   * Returns true if some item inside popover is focused
   */
  public hasFocus(): boolean {
    return this.flipper.hasFocus();
  }

  /**
   * Open popover
   */
  public show(): void {
    if (!this.shouldOpenBottom) {
      this.nodes.popover.style.setProperty('--popover-height', this.height + 'px');
      this.nodes.popover.classList.add(Popover.CSS.popoverOpenTop);
    }

    this.nodes.overlay.classList.remove(Popover.CSS.overlayHidden);
    this.nodes.popover.classList.add(Popover.CSS.popoverOpened);
    this.flipper.activate(this.flippableElements);

    if (this.search !== undefined) {
      setTimeout(() => {
        this.search.focus();
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      }, 100);
    }

    if (isMobileScreen()) {
      this.scrollLocker.lock();
    }
  }

  /**
   * Closes popover
   */
  public hide(): void {
    this.nodes.popover.classList.remove(Popover.CSS.popoverOpened);
    this.nodes.popover.classList.remove(Popover.CSS.popoverOpenTop);
    this.nodes.overlay.classList.add(Popover.CSS.overlayHidden);
    this.flipper.deactivate();
    this.items.forEach(item => item.reset());

    if (this.search !== undefined) {
      this.search.clear();
    }

    if (isMobileScreen()) {
      this.scrollLocker.unlock();
    }

    this.emit(PopoverEvent.Close);
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.flipper.deactivate();
    this.listeners.removeAll();

    if (isMobileScreen()) {
      this.scrollLocker.unlock();
    }
  }

  /**
   * Constructs HTML element corresponding to popover
   */
  private make(): void {
    this.nodes.popover = Dom.make('div', [ Popover.CSS.popover ]);

    this.nodes.nothingFoundMessage = Dom.make('div', [ Popover.CSS.nothingFoundMessage ], {
      textContent: this.messages.nothingFound,
    });

    this.nodes.popover.appendChild(this.nodes.nothingFoundMessage);
    this.nodes.items = Dom.make('div', [ Popover.CSS.items ]);

    this.items.forEach(item => {
      this.nodes.items.appendChild(item.getElement());
    });

    this.nodes.popover.appendChild(this.nodes.items);

    this.listeners.on(this.nodes.popover, 'click', (event: PointerEvent) => {
      const item = this.getTargetItem(event);

      if (item === undefined) {
        return;
      }

      this.handleItemClick(item);
    });

    this.nodes.wrapper = Dom.make('div');
    this.nodes.overlay = Dom.make('div', [Popover.CSS.overlay, Popover.CSS.overlayHidden]);

    this.listeners.on(this.nodes.overlay, 'click', () => {
      this.hide();
    });

    this.nodes.wrapper.appendChild(this.nodes.overlay);
    this.nodes.wrapper.appendChild(this.nodes.popover);
  }

  /**
   * Adds search to the popover
   */
  private addSearch(): void {
    this.search = new SearchInput({
      items: this.items,
      placeholder: this.messages.search,
      onSearch: (query: string, result: PopoverItem[]): void => {
        this.items.forEach(item => {
          const isHidden = !result.includes(item);

          item.toggleHidden(isHidden);
        });
        this.toggleNothingFoundMessage(result.length === 0);
        this.toggleCustomContent(query !== '');

        /** List of elements available for keyboard navigation considering search query applied */
        const flippableElements = query === '' ? this.flippableElements : result.map(item => item.getElement());

        if (this.flipper.isActivated) {
          /** Update flipper items with only visible */
          this.flipper.deactivate();
          this.flipper.activate(flippableElements);
        }
      },
    });

    const searchElement = this.search.getElement();

    searchElement.classList.add(Popover.CSS.search);

    this.nodes.popover.insertBefore(searchElement, this.nodes.popover.firstChild);
  }

  /**
   * Adds custom html content to the popover
   *
   * @param content - html content to append
   */
  private addCustomContent(content: HTMLElement): void {
    this.nodes.customContent = content;
    this.nodes.customContent.classList.add(Popover.CSS.customContent);
    this.nodes.popover.insertBefore(content, this.nodes.popover.firstChild);
  }

  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  private getTargetItem(event: PointerEvent): PopoverItem | undefined {
    return this.items.find(el => event.composedPath().includes(el.getElement()));
  }

  /**
   * Handles item clicks
   *
   * @param item - item to handle click of
   */
  private handleItemClick(item: PopoverItem): void {
    if (item.isDisabled) {
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
   * Creates Flipper instance which allows to navigate between popover items via keyboard
   */
  private initializeFlipper(): void {
    this.flipper = new Flipper({
      items: this.flippableElements,
      focusedItemClass: PopoverItem.CSS.focused,
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
    return customContentControlsElements.concat(popoverItemsElements);
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
    document.body.appendChild(popoverClone);
    height = popoverClone.offsetHeight;
    popoverClone.remove();

    return height;
  }

  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  private get shouldOpenBottom(): boolean {
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

    focusedItem.onFocus();
  };

  /**
   * Toggles nothing found message visibility
   *
   * @param isDisplayed - true if the message should be displayed
   */
  private toggleNothingFoundMessage(isDisplayed: boolean): void {
    this.nodes.nothingFoundMessage.classList.toggle(Popover.CSS.nothingFoundMessageDisplayed, isDisplayed);
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
