import { cn } from '../../../classnames';

/**
 * Popover header block CSS class constructor
 */
const popoverHeaderCn = cn('ce-popover-header');

/**
 * CSS class names to be used in popover header class
 */
export const cls = {
  root: popoverHeaderCn(),
  text: popoverHeaderCn('text'),
  backButton: popoverHeaderCn('back-button'),
};
