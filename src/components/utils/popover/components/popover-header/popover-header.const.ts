import { bem } from '../../../bem';

/**
 * Popover header block CSS class constructor
 */
const className = bem('ce-popover-header');

/**
 * CSS class names to be used in popover header class
 */
export const css = {
  root: className(),
  text: className('text'),
  backButton: className('back-button'),
};
