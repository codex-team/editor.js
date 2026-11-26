import type { RedactorDomChangedPayload } from './RedactorDomChanged';
import { RedactorDomChanged } from './RedactorDomChanged';
import type { BlockChangedPayload } from './BlockChanged';
import { BlockChanged } from './BlockChanged';
import type { BlockHovered, BlockHoveredPayload } from './BlockHovered';
import type { BlockStretchToggledPayload } from './BlockStretchToggled';
import { BlockStretchToggled } from './BlockStretchToggled';
import type { FakeCursorAboutToBeToggledPayload } from './FakeCursorAboutToBeToggled';
import { FakeCursorAboutToBeToggled } from './FakeCursorAboutToBeToggled';
import type { FakeCursorHaveBeenSetPayload } from './FakeCursorHaveBeenSet';
import { FakeCursorHaveBeenSet } from './FakeCursorHaveBeenSet';
import type { EditorMobileLayoutToggledPayload } from './EditorMobileLayoutToggled';
import { EditorMobileLayoutToggled } from './EditorMobileLayoutToggled';

/**
 * Events fired by Editor Event Dispatcher
 */
export {
  RedactorDomChanged,
  BlockChanged,
  BlockStretchToggled,
  FakeCursorAboutToBeToggled,
  FakeCursorHaveBeenSet,
  EditorMobileLayoutToggled
};

/**
 * Event name -> Event payload
 */
export interface EditorEventMap {
  [BlockHovered]: BlockHoveredPayload;
  [BlockStretchToggled]: BlockStretchToggledPayload;
  [RedactorDomChanged]: RedactorDomChangedPayload;
  [BlockChanged]: BlockChangedPayload;
  [FakeCursorAboutToBeToggled]: FakeCursorAboutToBeToggledPayload;
  [FakeCursorHaveBeenSet]: FakeCursorHaveBeenSetPayload;
  [EditorMobileLayoutToggled]: EditorMobileLayoutToggledPayload
}
