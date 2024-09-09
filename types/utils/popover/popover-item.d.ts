import { HintParams, HintPosition, HintTextAlignment } from "./hint";
import { PopoverItemType } from "./popover-item-type";

export { PopoverItemType } from './popover-item-type';

/**
 * Represents popover item children configuration
 */
export interface PopoverItemChildren {
  /**
   * True if children items should be searchable
   */
  searchable?: boolean;

  /**
   * True if popover with children should be displayed instantly and not after item click/hover.
   * False by default.
   * Now is used only in the inline popover.
   */
  isOpen?: boolean;

  /**
   * False if keyboard navigation should be disabled in the children popover.
   * True by default
   */
  isFlippable?: boolean;

 /**
  * Items of nested popover that should be open on the current item hover/click (depending on platform)
  */
  items?: PopoverItemParams[];

  /**
   * Called once children popover is opened
   */
  onOpen?: () => void;

  /**
   * Called once children popover is closed
   */
  onClose?: () => void;
}

/**
 * Adds children property to the item
 */
export type WithChildren<T> = Omit<T, 'onActivate'> & {
  /**
   * Popover item children configuration
   */
  children: PopoverItemChildren;

  /**
   * Items with children should not have onActivate handler
   */
  onActivate?: never;
};

/**
 * Represents popover item with confirmation.
 */
export type PopoverItemDefaultWithConfirmationParams = Omit<PopoverItemDefaultBaseParams, 'onActivate'> & {
  /**
   * Popover item parameters that should be applied on item activation.
   * May be used to ask user for confirmation before executing popover item activation handler.
   */
  confirmation: PopoverItemDefaultBaseParams;

  /**
   * Items with confirmation should not have onActivate handler
   */
  onActivate?: never;
};

/**
 * Represents popover item separator.
 * Special item type that is used to separate items in the popover.
 */
export interface PopoverItemSeparatorParams {
  /**
   * Item type
   */
  type: PopoverItemType.Separator;
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
  element: HTMLElement;

  /**
   * Hint data to be displayed on item hover
   */
  hint?: HintParams;

  /**
   * True if popover should close once item is activated
   */
  closeOnActivate?: boolean;

  /**
   * Item name
   * Used in data attributes needed for cypress tests
   */
  name?: string;
}

/**
 * Common parameters for all kinds of default popover items: with or without confirmation
 */
export interface PopoverItemDefaultBaseParams {
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
  isActive?: boolean | (() => boolean);

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
   * Used in data attributes needed for shortcuts work and for cypress tests
   */
  name?: string;

  /**
   * Defines whether item should toggle on click.
   * Can be represented as boolean value or a string key.
   * In case of string, works like radio buttons group and highlights as inactive any other item that has same toggle key value.
   */
  toggle?: boolean | string;

  /**
   * Hint data to be displayed on item hover
   */
  hint?: HintParams;

  /**
   * Popover item activation handler
   *
   * @param item - activated item
   * @param event - event that initiated item activation
   */
  onActivate: (item: PopoverItemParams, event?: PointerEvent) => void;
}

/**
 * Default, non-separator and non-html popover items type
 */
export type PopoverItemDefaultParams =
  PopoverItemDefaultBaseParams |
  PopoverItemDefaultWithConfirmationParams |
  WithChildren<PopoverItemDefaultBaseParams>;

/**
 * Represents single popover item
 */
export type PopoverItemParams =
  PopoverItemDefaultParams |
  PopoverItemSeparatorParams |
  PopoverItemHtmlParams |
  WithChildren<PopoverItemHtmlParams>;

/**
 * Parameters of how to render hint for the popover item
 */
type PopoverItemHintRenderParams = {
  /**
   * Hint position relative to the item
   */
  position?: HintPosition;

  /**
   * Horizontal alignment of the hint content.
   * 'start' by default.
   */
  alignment?: HintTextAlignment;

  /**
   * If false, hint will not be rendered.
   * True by default.
   * Used to disable hints on mobile popover
   */
  enabled?: boolean;
};


/**
 * Popover item render params.
 * The parameters that are not set by user via popover api but rather depend on technical implementation
 */
export type PopoverItemRenderParamsMap = {
  [PopoverItemType.Default]?: {
    /**
     * Wrapper tag for the item.
     * Div by default
     */
    wrapperTag?: 'div' | 'button';

    /**
     * Hint render params
     */
    hint?: PopoverItemHintRenderParams
  };

  [PopoverItemType.Html]?: {
    /**
     * Hint render params
     */
    hint?: PopoverItemHintRenderParams
  };
};
