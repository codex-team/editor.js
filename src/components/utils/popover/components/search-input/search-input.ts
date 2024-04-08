import Dom from '../../../../dom';
import Listeners from '../../../listeners';
import { IconSearch } from '@codexteam/icons';
import { SearchableItem } from './search-input.types';
import { css } from './search-input.const';

/**
 * Provides search input element and search logic
 */
export class SearchInput {
  /**
   * Input wrapper element
   */
  private wrapper: HTMLElement;

  /**
   * Editable input itself
   */
  private input: HTMLInputElement;

  /**
   * The instance of the Listeners util
   */
  private listeners: Listeners;

  /**
   * Items for local search
   */
  private items: SearchableItem[];

  /**
   * Current search query
   */
  private searchQuery: string | undefined;

  /**
   * Externally passed callback for the search
   */
  private readonly onSearch: (query: string, items: SearchableItem[]) => void;

  /**
   * @param options - available config
   * @param options.items - searchable items list
   * @param options.onSearch - search callback
   * @param options.placeholder - input placeholder
   */
  constructor({ items, onSearch, placeholder }: {
    items: SearchableItem[];
    onSearch: (query: string, items: SearchableItem[]) => void;
    placeholder?: string;
  }) {
    this.listeners = new Listeners();
    this.items = items;
    this.onSearch = onSearch;

    /** Build ui */
    this.wrapper = Dom.make('div', css.wrapper);

    const iconWrapper = Dom.make('div', css.icon, {
      innerHTML: IconSearch,
    });

    this.input = Dom.make('input', css.input, {
      placeholder,
      /**
       * Used to prevent focusing on the input by Tab key
       * (Popover in the Toolbar lays below the blocks,
       * so Tab in the last block will focus this hidden input if this property is not set)
       */
      tabIndex: -1,
    }) as HTMLInputElement;

    this.wrapper.appendChild(iconWrapper);
    this.wrapper.appendChild(this.input);

    this.listeners.on(this.input, 'input', () => {
      if (this.input === undefined) {
        return;
      }

      this.searchQuery = this.input.value;

      this.onSearch(this.searchQuery, this.foundItems);
    });
  }

  /**
   * Returns search field element
   */
  public getElement(): HTMLElement {
    return this.wrapper;
  }

  /**
   * Sets focus to the input
   */
  public focus(): void {
    this.input.focus();
  }

  /**
   * Clears search query and results
   */
  public clear(): void {
    if (this.input !== undefined) {
      this.input.value = '';
    }

    this.searchQuery = '';
    this.onSearch('', this.foundItems);
  }

  /**
   * Clears memory
   */
  public destroy(): void {
    this.listeners.removeAll();
  }

  /**
   * Returns list of found items for the current search query
   */
  private get foundItems(): SearchableItem[] {
    return this.items.filter(item => this.checkItem(item));
  }

  /**
   * Contains logic for checking whether passed item conforms the search query
   *
   * @param item - item to be checked
   */
  private checkItem(item: SearchableItem): boolean {
    const text = item.title?.toLowerCase() || '';
    const query = this.searchQuery?.toLowerCase();

    return query !== undefined ? text.includes(query) : false;
  }
}
