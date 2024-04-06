import { PopoverItem } from './components/popover-item';
import Dom from '../../dom';
import { SearchInput, SearchableItem } from './components/search-input';
import EventsDispatcher from '../events';
import Listeners from '../listeners';
import { PopoverEventMap, PopoverMessages, PopoverParams, PopoverEvent, PopoverNodes } from './popover.types';
import { css } from './popover.const';

/**
 * Class responsible for rendering popover and handling its behaviour
 */
export abstract class PopoverAbstract extends EventsDispatcher<PopoverEventMap> {
  /**
   * List of popover items
   */
  protected items: PopoverItem[];

  /**
   * Listeners util instance
   */
  protected listeners: Listeners = new Listeners();

  /**
   * Refs to created HTML elements
   */
  protected nodes: PopoverNodes;

  /**
   * Instance of the Search Input
   */
  private search: SearchInput | undefined;

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
  constructor(protected readonly params: PopoverParams) {
    super();

    this.items = params.items.map(item => new PopoverItem(item));

    if (params.messages) {
      this.messages = {
        ...this.messages,
        ...params.messages,
      };
    }

    /** Build html elements */
    this.nodes = {} as PopoverNodes;

    this.nodes.popoverContainer = Dom.make('div', [ css.popoverContainer ]);

    this.nodes.nothingFoundMessage = Dom.make('div', [ css.nothingFoundMessage ], {
      textContent: this.messages.nothingFound,
    });

    this.nodes.popoverContainer.appendChild(this.nodes.nothingFoundMessage);
    this.nodes.items = Dom.make('div', [ css.items ]);

    this.items.forEach(item => {
      const itemEl = item.getElement();

      if (itemEl === null) {
        return;
      }

      this.nodes.items.appendChild(itemEl);
    });

    this.nodes.popoverContainer.appendChild(this.nodes.items);

    this.listeners.on(this.nodes.popoverContainer, 'click', (event: Event) => this.handleClick(event));

    this.nodes.popover = Dom.make('div', [
      css.popover,
      this.params.class,
    ]);

    this.nodes.popover.appendChild(this.nodes.popoverContainer);

    if (params.customContent) {
      this.addCustomContent(params.customContent);
    }

    if (params.searchable) {
      this.addSearch();
    }
  }

  /**
   * Returns HTML element corresponding to the popover
   */
  public getElement(): HTMLElement {
    return this.nodes.popover as HTMLElement;
  }

  /**
   * Open popover
   */
  public show(): void {
    this.nodes.popover.classList.add(css.popoverOpened);

    if (this.search !== undefined) {
      this.search?.focus();
    }
  }

  /**
   * Closes popover
   */
  public hide(): void {
    this.nodes.popover.classList.remove(css.popoverOpened);
    this.nodes.popover.classList.remove(css.popoverOpenTop);

    this.items.forEach(item => item.reset());

    if (this.search !== undefined) {
      this.search.clear();
    }

    this.emit(PopoverEvent.Close);
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.listeners.removeAll();
  }

  /**
   * Handles input inside search field
   *
   * @param query - search query text
   * @param result - search results
   */
  protected onSearch = (query: string, result: SearchableItem[]): void => {
    this.items.forEach(item => {
      const isHidden = !result.includes(item);

      item.toggleHidden(isHidden);
    });
    this.toggleNothingFoundMessage(result.length === 0);
    this.toggleCustomContent(query !== '');
  };


  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  protected getTargetItem(event: Event): PopoverItem | undefined {
    return this.items.find(el => {
      const itemEl = el.getElement();

      if (itemEl === null) {
        return false;
      }

      return event.composedPath().includes(itemEl);
    });
  }

  /**
   * Adds search to the popover
   */
  private addSearch(): void {
    this.search = new SearchInput({
      items: this.items,
      placeholder: this.messages.search,
      onSearch: this.onSearch,
    });

    const searchElement = this.search.getElement();

    if (searchElement === undefined) {
      return;
    }

    searchElement.classList.add(css.search);

    this.nodes.popoverContainer.insertBefore(searchElement, this.nodes.popoverContainer.firstChild);
  }

  /**
   * Adds custom html content to the popover
   *
   * @param content - html content to append
   */
  private addCustomContent(content: HTMLElement): void {
    this.nodes.customContent = content;
    this.nodes.customContent.classList.add(css.customContent);
    this.nodes.popoverContainer.insertBefore(content, this.nodes.popoverContainer.firstChild);
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
      this.showNestedItems(item);

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
   * Toggles nothing found message visibility
   *
   * @param isDisplayed - true if the message should be displayed
   */
  private toggleNothingFoundMessage(isDisplayed: boolean): void {
    this.nodes.nothingFoundMessage.classList.toggle(css.nothingFoundMessageDisplayed, isDisplayed);
  }

  /**
   * Toggles custom content visibility
   *
   * @param isDisplayed - true if custom content should be displayed
   */
  private toggleCustomContent(isDisplayed: boolean): void {
    this.nodes.customContent?.classList.toggle(css.customContentHidden, isDisplayed);
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

  /**
   * Handles displaying nested items for the item. Behaviour differs depending on platform.
   *
   * @param item – item to show nested popover for
   */
  protected abstract showNestedItems(item: PopoverItem): void;
}
