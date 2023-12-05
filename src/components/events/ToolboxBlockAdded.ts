import { BlockAPI } from '../../../types';

/**
 * Fired when toolbox block added
 */
export const ToolboxBlockAdded = 'toolbox-block-added';

/**
 * Payload that will be passed with the event
 */
export interface ToolboxBlockAddedPayload {
  /**
   * CustomEvent describing toolbox opened
   */
  block: BlockAPI
}
