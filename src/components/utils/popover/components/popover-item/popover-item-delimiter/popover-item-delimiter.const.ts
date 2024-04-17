import { bem } from '../../../../bem';

/**
 * Popover delimiter block CSS class constructor
 */
const className = bem('ce-popover-item-delimiter');

/**
 * CSS class names to be used in popover delimiter class
 */
export const css = {
  container: className(),
  line: className('line'),
};
