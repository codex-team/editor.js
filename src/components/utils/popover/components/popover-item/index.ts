import { PopoverItemDefault } from './popover-item-default/popover-item-default';
import { PopoverItemDelimiter } from './popover-item-delimiter/popover-item-delimiter';

export * from './popover-item-default/popover-item-default.const';

/**
 * Commoon type for popover items
 */
type PopoverItem = PopoverItemDefault | PopoverItemDelimiter;

export {
  PopoverItemDefault,
  PopoverItemDelimiter,
  PopoverItem
};
