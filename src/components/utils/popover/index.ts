import { PopoverDesktop } from './popover-desktop';
import { PopoverInline } from './popover-inline';
import { PopoverMobile } from './popover-mobile';

export * from './popover.types';
export * from './components/popover-item/popover-item.types';

/**
 * Union type for all popovers
 */
export type Popover = PopoverDesktop | PopoverMobile | PopoverInline;

export { PopoverDesktop, PopoverMobile, PopoverInline };
