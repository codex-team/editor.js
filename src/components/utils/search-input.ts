import Dom from '../dom';
import Listeners from './listeners';

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
    } {
    return {
      input: 'cdx-filter-input',
    };
  }

  /**
   * @param items - searchable items list
   * @param onSearch - search callback
   */
  constructor({ items, onSearch }: { items: SearchableItem[], onSearch: (items: SearchableItem[]) => void }) {
    this.listeners = new Listeners();
    this.items = items;
    this.onSearch = onSearch;

    this.render();
  }

  /**
   * Returns search field element
   */
  public getInput(): HTMLElement {
    return this.input;
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
   */
  private render(): void {
    this.input = Dom.make('input', SearchInput.CSS.input, {
      type: 'search',
    }) as HTMLInputElement;

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
