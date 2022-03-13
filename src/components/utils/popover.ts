import Dom from '../dom';
import Listeners from './listeners';
import Flipper from '../flipper';
import SearchInput from './search-input';

/**
 * Describe parameters for rendering the single item of Popover
 */
export interface PopoverItem {
  /**
   * Item icon to be appeared near a title
   */
  icon: string;

  /**
   * Displayed text
   */
  label: string;

  /**
   * Additional displayed text
   */
  secondaryLabel?: string;

  /**
   * Itm click handler
   *
   * @param item - clicked item
   */
  onClick: (item: PopoverItem) => void;
}

/**
 * Popover is the UI element for displaying vertical lists
 */
export default class Popover {
  /**
   * Items list to be displayed
   */
  private readonly items: PopoverItem[];

  /**
   * Created nodes
   */
  private nodes: {
    wrapper: HTMLElement;
    items: HTMLElement;
    nothingFound: HTMLElement;
  } = {
    wrapper: null,
    items: null,
    nothingFound: null,
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
  private searchable: boolean;
  private search: SearchInput;
  private filterLabel: string;
  private nothingFoundLabel: string;

  /**
   * Style classes
   */
  private static get CSS(): {
    popover: string;
    popoverOpened: string;
    itemsWrapper: string;
    item: string;
    itemHidden: string;
    itemFocused: string;
    itemLabel: string;
    itemIcon: string;
    itemSecondaryLabel: string;
    noFoundMessage: string;
    noFoundMessageShown: string;
    } {
    return {
      popover: 'ce-popover',
      popoverOpened: 'ce-popover--opened',
      itemsWrapper: 'ce-popover__items',
      item: 'ce-popover__item',
      itemHidden: 'ce-popover__item--hidden',
      itemFocused: 'ce-popover__item--focused',
      itemLabel: 'ce-popover__item-label',
      itemIcon: 'ce-popover__item-icon',
      itemSecondaryLabel: 'ce-popover__item-secondary-label',
      noFoundMessage: 'ce-popover__no-found',
      noFoundMessageShown: 'ce-popover__no-found--shown',
    };
  }

  /**
   * Creates the Popover
   *
   * @param options - config
   * @param options.items - config for items to be displayed
   * @param options.className - additional class name to be added to the popover wrapper
   * @param options.filterLabel - label for the search Field
   * @param options.nothingFoundLabel - label of the 'nothing found' message
   */
  constructor({ items, className, searchable, filterLabel, nothingFoundLabel }: {
    items: PopoverItem[];
    className?: string;
    searchable?: boolean;
    filterLabel: string;
    nothingFoundLabel: string;
  }) {
    this.items = items;
    this.className = className || '';
    this.searchable = searchable;
    this.listeners = new Listeners();

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
    this.nodes.wrapper.classList.add(Popover.CSS.popoverOpened);
    this.flipper.activate();

    if (this.searchable) {
      window.requestAnimationFrame(() => {
        this.search.focus();
      });
    }
  }

  /**
   * Hides the Popover
   */
  public hide(): void {
    this.nodes.wrapper.classList.remove(Popover.CSS.popoverOpened);
    this.flipper.deactivate();
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.listeners.removeAll();
  }

  /**
   * Returns true if some item is focused
   */
  public hasFocus(): boolean {
    return this.flipper.hasFocus();
  }

  /**
   * Makes the UI
   */
  private render(): void {
    this.nodes.wrapper = Dom.make('div', [Popover.CSS.popover, this.className]);

    if (this.searchable) {
      this.addSearch(this.nodes.wrapper);
    }

    this.nodes.items = Dom.make('div', Popover.CSS.itemsWrapper);

    this.items.forEach(item => {
      this.nodes.items.appendChild(this.createItem(item));
    });

    this.nodes.wrapper.appendChild(this.nodes.items);
    this.nodes.nothingFound = Dom.make('div', [ Popover.CSS.noFoundMessage ], {
      textContent: this.nothingFoundLabel,
    });

    this.nodes.wrapper.appendChild(this.nodes.nothingFound);

    this.listeners.on(this.nodes.wrapper, 'click', (event: KeyboardEvent|MouseEvent) => {
      const clickedItem = (event.target as HTMLElement).closest(`.${Popover.CSS.item}`) as HTMLElement;

      if (clickedItem) {
        this.itemClicked(clickedItem);
      }
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
        const itemsVisible = [];

        this.items.forEach((item, index) => {
          const itemElement = this.nodes.items.children[index];

          if (filteredItems.includes(item)) {
            itemsVisible.push(itemElement);
            itemElement.classList.remove(Popover.CSS.itemHidden);
          } else {
            itemElement.classList.add(Popover.CSS.itemHidden);
          }
        });

        this.nodes.nothingFound.classList.toggle(Popover.CSS.noFoundMessageShown, itemsVisible.length === 0);

        /**
         * Update flipper items with only visible
         */
        this.flipper.deactivate();
        this.flipper.activate(itemsVisible);
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
        innerHTML: item.secondaryLabel,
      }));
    }

    return el;
  }

  /**
   * Item click handler
   *
   * @param itemEl - clicked item
   */
  private itemClicked(itemEl: HTMLElement): void {
    const allItems = this.nodes.wrapper.querySelectorAll(`.${Popover.CSS.item}`);
    const itemIndex = Array.from(allItems).indexOf(itemEl);
    const clickedItem = this.items[itemIndex];

    clickedItem.onClick(clickedItem);
  }

  /**
   * Creates Flipper instance to be able to leaf tools
   */
  private enableFlipper(): void {
    const tools = Array.from(this.nodes.wrapper.querySelectorAll(`.${Popover.CSS.item}`)) as HTMLElement[];

    this.flipper = new Flipper({
      items: tools,
      focusedItemClass: Popover.CSS.itemFocused,
    });
  }
}
