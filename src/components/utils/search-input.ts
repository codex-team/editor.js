import Dom from '../dom';
import Listeners from './listeners';
import $ from "../dom";

/**
 * Item that could be searched
 */
interface SearchableItem {
  label: string;
}

/**
 * Provides search input element and search logic
 */
export default class SearchInput {

  private wrapper: HTMLElement;
  private input: HTMLInputElement;
  private listeners: Listeners;
  private items: SearchableItem[];
  private searchQuery: string;
  private onSearch: (items: SearchableItem[]) => void;

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
    onSearch: (items: SearchableItem[]) => void;
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
    const iconWrapper = Dom.make('div', SearchInput.CSS.icon);
    const icon = $.svg('search', 16, 16);

    this.input = Dom.make('input', SearchInput.CSS.input, {
      placeholder,
    }) as HTMLInputElement;

    iconWrapper.appendChild(icon);
    this.wrapper.appendChild(iconWrapper);
    this.wrapper.appendChild(this.input);

    this.listeners.on(this.input, 'input', () => {
      this.searchQuery = this.input.value;

      this.onSearch(this.foundItems);
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
    const text = item.label.toLowerCase();
    const query = this.searchQuery.toLowerCase();

    return text.includes(query);
  }
}
