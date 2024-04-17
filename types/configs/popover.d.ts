
/**
 * Represents popover item delimiter
 */
export interface PopoverItemDelimiter {
  /**
   * Item type
   */
  type: 'delimiter'
}

/**
 * Common parameters for both types of popover items: with or without confirmation
 */
interface PopoverItemBase {
  /**
   * Item type
   */
  type: 'default';

  /**
   * Displayed text
   */
  title?: string;

  /**
   * Item icon to be appeared near a title
   */
  icon?: string;

  /**
   * Additional displayed text
   */
  secondaryLabel?: string;

  /**
   * True if item should be highlighted as active
   */
  isActive?: boolean;

  /**
   * True if item should be disabled
   */
  isDisabled?: boolean;

  /**
   * True if popover should close once item is activated
   */
  closeOnActivate?: boolean;

  /**
   * Item name
   * Used in data attributes needed for cypress tests
   */
  name?: string;

  /**
   * Defines whether item should toggle on click. 
   * Can be represented as boolean value or a string key. 
   * In case of string, works like radio buttons group and highlights as inactive any other item that has same toggle key value.
   */
  toggle?: boolean | string;
}

/**
 * Represents popover item with confirmation state configuration
 */
export interface PopoverItemWithConfirmation extends PopoverItemBase {
  /**
   * Popover item parameters that should be applied on item activation.
   * May be used to ask user for confirmation before executing popover item activation handler.
   */
  confirmation: PopoverItemDefault;

  onActivate?: never;
}

/**
 * Represents popover item without confirmation state configuration
 */
export interface PopoverItemWithoutConfirmation extends PopoverItemBase {
  confirmation?: never;

  /**
   * Popover item activation handler
   *
   * @param item - activated item
   * @param event - event that initiated item activation
   */
  onActivate: (item: PopoverItem, event?: PointerEvent) => void;

}


/**
 * Represents popover item with children (nested popover items)
 */
export interface PopoverItemWithChildren extends PopoverItemBase {
  confirmation?: never;
  onActivate?: never;

  /**
   * Items of nested popover that should be open on the current item hover/click (depending on platform)
   */
  children?: {
    items: PopoverItem[]
  }
}

/**
 * Default, non-delimiter popover item type
 */
export type PopoverItemDefault = 
  PopoverItemWithConfirmation | 
  PopoverItemWithoutConfirmation | 
  PopoverItemWithChildren;

/**
 * Represents single popover item
 */
export type PopoverItem = PopoverItemDefault |  PopoverItemDelimiter;

