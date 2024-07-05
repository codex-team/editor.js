import { bem } from '../../../../bem';

/**
 * Popover separator block CSS class constructor
 */
const className = bem('ce-popover-item-separator');

/**
 * CSS class names to be used in popover separator class
 */
export const css = {
  container: className(),
  line: className('line'),
  hidden: className(null, 'hidden'),
};
