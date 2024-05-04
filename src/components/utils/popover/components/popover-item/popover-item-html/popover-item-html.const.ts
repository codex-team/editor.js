import { bem } from '../../../../bem';

/**
 * Popover item block CSS class constructor
 */
const className = bem('ce-popover-item-html');

/**
 * CSS class names to be used in popover item class
 */
export const css = {
  root: className(),
  hidden: className(null, 'hidden'),
};
