import { bem } from '../bem';

/**
 * Popover block CSS class constructor
 */
const className = bem('ce-popover');

/**
 * CSS class names to be used in popover
 */
export const css = {
  popover: className(),
  popoverContainer: className('container'),
  popoverOpenTop: className(null, 'open-top'),
  popoverOpenLeft: className(null, 'open-left'),
  popoverOpened: className(null, 'opened'),
  search: className('search'),
  nothingFoundMessage: className('nothing-found-message'),
  nothingFoundMessageDisplayed: className('nothing-found-message', 'displayed'),
  items: className('items'),
  overlay: className('overlay'),
  overlayHidden: className('overlay', 'hidden'),
  popoverNested: className(null, 'nested'),
  getPopoverNestedClass: (level: number) => className(null, `nested-level-${level.toString()}` ),
  popoverInline: className(null, 'inline'),
  popoverHeader: className('header'),
};

/**
 * CSS variables names to be used in popover
 */
export enum CSSVariables {
  /**
   * Stores nesting level of the popover
   */
  NestingLevel = '--nesting-level',

  /**
   * Stores actual popover height. Used for desktop popovers
   */
  PopoverHeight = '--popover-height',

  /**
   * Width of the inline popover
   */
  InlinePopoverWidth = '--inline-popover-width',

  /**
   * Offset from left of the inline popover item click on which triggers the nested popover opening
   */
  TriggerItemLeft = '--trigger-item-left',

  /**
   * Offset from top of the desktop popover item click on which triggers the nested popover opening
   */
  TriggerItemTop = '--trigger-item-top',
}
