import type Block from '../block';

/**
 * Fired when some block is hovered by user
 */
export const BlockHovered = 'block hovered';

/**
 * Payload that will be passed with the event
 */
export interface BlockHoveredPayload {
  /**
   * Hovered block
   */
  block: Block;
}
