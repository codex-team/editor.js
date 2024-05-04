/**
 * Popover item types
 */
export enum PopoverItemType {
  /** Default popover item */
  Default = 'default',

  /** Separator item*/
  Separator = 'separator',

  /** Item with custom html content */
  Html = 'html'
}

/**
 * Represents popover item separator.
 * Special item type that is used to separate items in the popover.
 */
export interface PopoverItemSeparatorParams {
  /**
   * Item type
   */
  type: PopoverItemType.Separator
}

/**
 * Represents popover item with custom html content
 */
export interface PopoverItemHtmlParams {
  /**
   * Item type
   */
  type: PopoverItemType.Html;

  /**
   * Custom html content to be displayed in the popover
   */
  element: HTMLElement
}

/**
 * Common parameters for all kinds of default popover items: with or without confirmation
 */
interface PopoverItemDefaultBaseParams {
  /**
   * Item type
   */
  type?: PopoverItemType.Default;

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
export interface PopoverItemWithConfirmationParams extends PopoverItemDefaultBaseParams {
  /**
   * Popover item parameters that should be applied on item activation.
   * May be used to ask user for confirmation before executing popover item activation handler.
   */
  confirmation: PopoverItemDefaultParams;

  onActivate?: never;
}

/**
 * Represents popover item without confirmation state configuration
 */
export interface PopoverItemWithoutConfirmationParams extends PopoverItemDefaultBaseParams {
  confirmation?: never;

  /**
   * Popover item activation handler
   *
   * @param item - activated item
   * @param event - event that initiated item activation
   */
  onActivate: (item: PopoverItemParams, event?: PointerEvent) => void;

}


/**
 * Represents popover item with children (nested popover items)
 */
export interface PopoverItemWithChildrenParams extends PopoverItemDefaultBaseParams {
  confirmation?: never;
  onActivate?: never;

  /**
   * Items of nested popover that should be open on the current item hover/click (depending on platform)
   */
  children?: {
    items: PopoverItemParams[]
  }
}

/**
 * Default, non-separator popover item type
 */
export type PopoverItemDefaultParams =
  PopoverItemWithConfirmationParams |
  PopoverItemWithoutConfirmationParams |
  PopoverItemWithChildrenParams;

/**
 * Represents single popover item
 */
export type PopoverItemParams =
  PopoverItemDefaultParams |
  PopoverItemSeparatorParams |
  PopoverItemHtmlParams;

