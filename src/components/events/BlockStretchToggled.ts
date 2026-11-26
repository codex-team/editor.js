import type Block from '../block';

/**
 * Fired when the stretched state of a Block is toggled
 */
export const BlockStretchToggled = 'block stretch toggled';

/**
 * Payload that will be passed with the event
 */
export interface BlockStretchToggledPayload {
  /**
   * Block whose stretched state was toggled
   */
  block: Block;
}
