import { RedactorDomChanged, RedactorDomChangedPayload } from './RedactorDomChanged';
import { BlockChanged, BlockChangedPayload } from './BlockChanged';
import { BlockHovered, BlockHoveredPayload } from './BlockHovered';
import { FakeCursorAboutToBeSet, FakeCursorAboutToBeSetPayload } from './FakeCursorAboutToBeSet';
import { FakeCursorHaveBeenSet, FakeCursorHaveBeenSetPayload } from './FakeCursorHaveBeenSet';

/**
 * Events fired by Editor Event Dispatcher
 */
export {
  RedactorDomChanged,
  BlockChanged,
  FakeCursorAboutToBeSet,
  FakeCursorHaveBeenSet
};

/**
 * Event name -> Event payload
 */
export interface EditorEventMap extends Record<string, unknown> {
  [BlockHovered]: BlockHoveredPayload,
  [RedactorDomChanged]: RedactorDomChangedPayload,
  [BlockChanged]: BlockChangedPayload,
  [FakeCursorAboutToBeSet]: FakeCursorAboutToBeSetPayload,
  [FakeCursorHaveBeenSet]: FakeCursorHaveBeenSetPayload,
}
