import { PopoverItem, PopoverItemDefault, PopoverItemRenderParamsMap, PopoverItemSeparator, PopoverItemType } from './components/popover-item';
import Dom from '../../dom';
import { SearchInput } from './components/search-input';
import EventsDispatcher from '../events';
import Listeners from '../listeners';
import { PopoverEventMap, PopoverMessages, PopoverParams, PopoverEvent, PopoverNodes } from './popover.types';
import { css } from './popover.const';
import { PopoverItemParams } from './components/popover-item';
import { PopoverItemHtml } from './components/popover-item/popover-item-html/popover-item-html';

/**
 * Class responsible for rendering popover and handling its behaviour
 */
export abstract class PopoverAbstract<Nodes extends PopoverNodes = PopoverNodes> extends EventsDispatcher<PopoverEventMap> {
  /**
   * List of popover items
   */
  protected items: Array<PopoverItem>;

  /**
   * Listeners util instance
   */
  protected listeners: Listeners = new Listeners();

  /**
   * Refs to created HTML elements
   */
  protected nodes: Nodes;

  /**
   * List of default popover items that are searchable and may have confirmation state
   */
  protected get itemsDefault(): PopoverItemDefault[] {
    return this.items.filter(item => item instanceof PopoverItemDefault) as PopoverItemDefault[];
  }

  /**
   * Instance of the Search Input
   */
  protected search: SearchInput | undefined;

  /**
   * Messages that will be displayed in popover
   */
  protected messages: PopoverMessages = {
    nothingFound: 'Nothing found',
    search: 'Search',
  };

  /**
   * Constructs the instance
   *
   * @param params - popover construction params
   * @param itemsRenderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(
    protected readonly params: PopoverParams,
    protected readonly itemsRenderParams: PopoverItemRenderParamsMap = {}
  ) {
    super();

    this.items = this.buildItems(params.items);

    if (params.messages) {
      this.messages = {
        ...this.messages,
        ...params.messages,
      };
    }

    /** Build html elements */
    this.nodes = {} as Nodes;

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
      this.search.focus();
    }
  }

  /**
   * Closes popover
   */
  public hide(): void {
    this.nodes.popover.classList.remove(css.popoverOpened);
    this.nodes.popover.classList.remove(css.popoverOpenTop);

    this.itemsDefault.forEach(item => item.reset());

    if (this.search !== undefined) {
      this.search.clear();
    }

    this.emit(PopoverEvent.Closed);
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.items.forEach(item => item.destroy());
    this.nodes.popover.remove();
    this.listeners.removeAll();
    this.search?.destroy();
  }

  /**
   * Looks for the item by name and imitates click on it
   *
   * @param name - name of the item to activate
   */
  public activateItemByName(name: string): void {
    const foundItem = this.items.find(item => item.name === name);

    this.handleItemClick(foundItem);
  }

  /**
   * Factory method for creating popover items
   *
   * @param items - list of items params
   */
  protected buildItems(items: PopoverItemParams[]): Array<PopoverItem> {
    return items.map(item => {
      switch (item.type) {
        case PopoverItemType.Separator:
          return new PopoverItemSeparator();
        case PopoverItemType.Html:
          return new PopoverItemHtml(item, this.itemsRenderParams[PopoverItemType.Html]);
        default:
          return new PopoverItemDefault(item, this.itemsRenderParams[PopoverItemType.Default]);
      }
    });
  }

  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  protected getTargetItem(event: Event): PopoverItemDefault | PopoverItemHtml | undefined {
    return this.items
      .filter(item => item instanceof PopoverItemDefault || item instanceof PopoverItemHtml)
      .find(item => {
        const itemEl = item.getElement();

        if (itemEl === null) {
          return false;
        }

        return event.composedPath().includes(itemEl);
      }) as PopoverItemDefault | PopoverItemHtml | undefined;
  }

  /**
   * Handles popover item click
   *
   * @param item - item to handle click of
   */
  protected handleItemClick(item: PopoverItem): void {
    if ('isDisabled' in item && item.isDisabled) {
      return;
    }

    if (item.hasChildren) {
      this.showNestedItems(item as PopoverItemDefault | PopoverItemHtml);

      if ('handleClick' in item && typeof item.handleClick === 'function') {
        item.handleClick();
      }

      return;
    }

    /** Cleanup other items state */
    this.itemsDefault.filter(x => x !== item).forEach(x => x.reset());

    if ('handleClick' in item && typeof item.handleClick === 'function') {
      item.handleClick();
    }

    this.toggleItemActivenessIfNeeded(item);

    if (item.closeOnActivate) {
      this.hide();

      this.emit(PopoverEvent.ClosedOnActivate);
    }
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

    this.handleItemClick(item);
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
    if (!(clickedItem instanceof PopoverItemDefault)) {
      return;
    }

    if (clickedItem.toggle === true) {
      clickedItem.toggleActive();
    }

    if (typeof clickedItem.toggle === 'string') {
      const itemsInToggleGroup = this.itemsDefault.filter(item => item.toggle === clickedItem.toggle);

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
  protected abstract showNestedItems(item: PopoverItemDefault | PopoverItemHtml): void;
}
