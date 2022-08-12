/**
 * Common parameters for both types of popover items: with or without confirmation
 */
interface PopoverItemBase {
  /**
   * Item icon to be appeared near a title
   */
  icon: string;

  /**
   * Displayed text
   */
  label: string;

  /**
   * Item name
   * Used in data attributes needed for cypress tests
   */
  name?: string;

  /**
   * Additional displayed text
   */
  secondaryLabel?: string;

  /**
   * True if item should be highlighted as active
   */
  isActive?: boolean;

  /**
   * True if popover should close once item is activated
   */
  closeOnActivate?: boolean;
}

/**
 * Represents popover item with confirmation state configuration
 */
export interface PopoverItemWithConfirmation extends PopoverItemBase {
  /**
   * Popover item parameters that should be applied on item activation.
   * May be used to ask user for confirmation before executing popover item activation handler.
   */
  confirmation: Partial<PopoverItem>;

  onActivate?: never;
}

/**
 * Represents default popover item without confirmation state configuration
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
 * Represents single popover item
 */
export type PopoverItem = PopoverItemWithConfirmation | PopoverItemWithoutConfirmation

