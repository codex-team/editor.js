import { RedactorDomChanged, RedactorDomChangedPayload } from './RedactorDomChanged';
import { BlockChanged, BlockChangedPayload } from './BlockChanged';
import { BlockHovered, BlockHoveredPayload } from './BlockHovered';

/**
 * Events fired by Editor Event Dispatcher
 */
export {
  RedactorDomChanged,
  BlockChanged
};

/**
 * Event name -> Event payload
 */
export interface EditorEventMap extends Record<string, unknown> {
  [BlockHovered]: BlockHoveredPayload,
  [RedactorDomChanged]: RedactorDomChangedPayload,
  [BlockChanged]: BlockChangedPayload,
}
