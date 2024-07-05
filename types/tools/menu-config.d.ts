import { PopoverItemDefaultBaseParams, PopoverItemHtmlParams, PopoverItemParams, PopoverItemSeparatorParams, WithChildren } from "../configs";

/**
 * Menu configuration format.
 * Is used for defining Block Tunes Menu items via Block Tool's renderSettings(), Block Tune's render() and Inline Tool's render().
 */
export type MenuConfig = MenuConfigItem | MenuConfigItem[];

/**
 * Common parameters for all kinds of default Menu Config items: with or without confirmation
 */
type MenuConfigDefaultBaseParams = PopoverItemDefaultBaseParams & {
  /**
   * Displayed text.
   * Alias for title property
   * 
   * @deprecated - use title property instead
   */
  label?: string
};

/**
 * Menu Config item with confirmation
 */
type MenuConfigItemDefaultWithConfirmationParams = Omit<MenuConfigDefaultBaseParams, 'onActivate'> & {
  /**
   * Items with confirmation should not have onActivate handler
   */
  onActivate?: never;

  /**
   * Menu Config item parameters that should be applied on item activation.
   * May be used to ask user for confirmation before executing item activation handler.
   */
  confirmation: MenuConfigDefaultBaseParams;

}

/**
 * Default, non-separator and non-html Menu Config items type
 */
type MenuConfigItemDefaultParams = 
  MenuConfigItemDefaultWithConfirmationParams |
  MenuConfigDefaultBaseParams |
  WithChildren<MenuConfigDefaultBaseParams>;

/**
 * Single Menu Config item
 */
type MenuConfigItem = 
  MenuConfigItemDefaultParams |
  PopoverItemSeparatorParams |
  PopoverItemHtmlParams |
  WithChildren<PopoverItemHtmlParams>;
