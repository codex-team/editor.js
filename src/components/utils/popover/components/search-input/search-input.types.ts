/**
 * Item that could be searched
 */
export interface SearchableItem {
  /**
   * Items title
   */
  title?: string;
}


/**
 * Event that can be triggered by the Search Input
 */
export enum SearchInputEvent {
  /**
   * When search quert applied
   */
  Search = 'search'
}

/**
 * Events fired by the Search Input
 */
export interface SearchInputEventMap {
  /**
   * Fired when search quert applied
   */
  [SearchInputEvent.Search]: { query: string; items: SearchableItem[]};
}
