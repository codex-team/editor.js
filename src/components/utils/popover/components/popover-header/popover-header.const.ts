import { bem } from '../../../bem';

/**
 * Popover header block CSS class constructor
 */
const popoverHeaderCn = bem('ce-popover-header');

/**
 * CSS class names to be used in popover header class
 */
export const css = {
  root: popoverHeaderCn(),
  text: popoverHeaderCn('text'),
  backButton: popoverHeaderCn('back-button'),
};
