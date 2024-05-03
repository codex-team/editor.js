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
  customContent: className('custom-content'),
  customContentHidden: className('custom-content', 'hidden'),
  items: className('items'),
  overlay: className('overlay'),
  overlayHidden: className('overlay', 'hidden'),
  popoverNested: className(null, 'nested'),
  popoverHeader: className('header'),
};
