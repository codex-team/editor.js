import { PopoverDesktop } from './popover-desktop';
import { PopoverInline } from './popover-inline';
import { PopoverMobile } from './popover-mobile';

export type * from '@/types/utils/popover';
export { PopoverItemType } from '@/types/utils/popover/popover-item-type';

/**
 * Union type for all popovers
 */
export type Popover = PopoverDesktop | PopoverMobile | PopoverInline;

export { PopoverDesktop, PopoverMobile, PopoverInline };
