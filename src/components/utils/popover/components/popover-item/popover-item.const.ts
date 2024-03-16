import { cn } from '../../../classnames';

/**
 * Popover item block CSS class constructor
 */
const className = cn('ce-popover-item');

/**
 * CSS class names to be used in popover item class
 */
export const cls = {
  container: className(),
  active: className(null, 'active'),
  disabled: className(null, 'disabled'),
  focused: className(null, 'focused'),
  hidden: className(null, 'hidden'),
  confirmationState: className(null, 'confirmation'),
  noHover: className(null, 'no-hover'),
  noFocus: className(null, 'no-focus'),
  title: className('title'),
  secondaryTitle: className('secondary-title'),
  icon: className('icon'),
  iconTool: className('icon', 'tool'),
  iconChevronRight: className('icon', 'chevron-right'),
  wobbleAnimation: cn('wobble')(),
};
