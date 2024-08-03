
/**
 * Event that can be triggered by the Popover
 */
export enum PopoverEvent {
  /**
   * When popover closes
   */
  Closed = 'closed',

  /**
   * When it closes because item with 'closeOnActivate' property set was clicked
   */
  ClosedOnActivate = 'closed-on-activate',
}
