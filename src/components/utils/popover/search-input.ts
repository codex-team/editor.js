import Dom from '../../dom';
import Listeners from '../listeners';
import { IconSearch } from '@codexteam/icons';

/**
 * Item that could be searched
 */
interface SearchableItem {
  title?: string;
}

/**
 * Provides search input element and search logic
 */
export default class SearchInput {
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
  private searchQuery: string;

  /**
   * Externally passed callback for the search
   */
  private readonly onSearch: (query: string, items: SearchableItem[]) => void;

  /**
   * Styles
   */
  private static get CSS(): {
    input: string;
    icon: string;
    wrapper: string;
    } {
    return {
      wrapper: 'cdx-search-field',
      icon: 'cdx-search-field__icon',
      input: 'cdx-search-field__input',
    };
  }

  /**
   * @param options - available config
   * @param options.items - searchable items list
   * @param options.onSearch - search callback
   * @param options.placeholder - input placeholder
   */
  constructor({ items, onSearch, placeholder }: {
    items: SearchableItem[];
    onSearch: (query: string, items: SearchableItem[]) => void;
    placeholder: string;
  }) {
    this.listeners = new Listeners();
    this.items = items;
    this.onSearch = onSearch;

    this.render(placeholder);
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
    this.input.value = '';
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
   * Creates the search field
   *
   * @param placeholder - input placeholder
   */
  private render(placeholder: string): void {
    this.wrapper = Dom.make('div', SearchInput.CSS.wrapper);

    const iconWrapper = Dom.make('div', SearchInput.CSS.icon, {
      innerHTML: IconSearch,
    });

    this.input = Dom.make('input', SearchInput.CSS.input, {
      placeholder,
    }) as HTMLInputElement;

    this.wrapper.appendChild(iconWrapper);
    this.wrapper.appendChild(this.input);

    this.listeners.on(this.input, 'input', () => {
      this.searchQuery = this.input.value;

      this.onSearch(this.searchQuery, this.foundItems);
    });
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
    const query = this.searchQuery.toLowerCase();

    return text.includes(query);
  }
}
