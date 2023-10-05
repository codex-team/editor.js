import { RedactorDomChanged, RedactorDomChangedPayload } from './RedactorDomChanged';
import { BlockChanged, BlockChangedPayload } from './BlockChanged';
import { BlockHovered, BlockHoveredPayload } from './BlockHovered';
import { FakeCursorAboutToBeToggled, FakeCursorAboutToBeToggledPayload } from './FakeCursorAboutToBeToggled';
import { FakeCursorHaveBeenSet, FakeCursorHaveBeenSetPayload } from './FakeCursorHaveBeenSet';
import { InlineToolbarOpened, InlineToolbarOpenedPayload } from './InlineToolbarOpened';
import { InlineToolbarClosed, InlineToolbarClosedPayload } from './InlineToolbarClosed';
import { ToolboxOpened, ToolboxOpenedPayload } from './ToolboxOpened';
import { ToolboxClosed, ToolboxClosedPayload } from './ToolboxClosed';
import { ToolboxBlockAdded, ToolboxBlockAddedPayload } from './ToolboxBlockAdded';

/**
 * Events fired by Editor Event Dispatcher
 */
export {
  RedactorDomChanged,
  BlockChanged,
  FakeCursorAboutToBeToggled,
  FakeCursorHaveBeenSet,
  InlineToolbarOpened,
  InlineToolbarClosed,
  ToolboxOpened,
  ToolboxClosed,
  ToolboxBlockAdded
};

/**
 * Event name -> Event payload
 */
export interface EditorEventMap {
  [BlockHovered]: BlockHoveredPayload;
  [RedactorDomChanged]: RedactorDomChangedPayload;
  [BlockChanged]: BlockChangedPayload;
  [FakeCursorAboutToBeToggled]: FakeCursorAboutToBeToggledPayload;
  [FakeCursorHaveBeenSet]: FakeCursorHaveBeenSetPayload;
  [InlineToolbarOpened]: InlineToolbarOpenedPayload;
  [InlineToolbarClosed]: InlineToolbarClosedPayload;
  [ToolboxOpened]: ToolboxOpenedPayload;
  [ToolboxClosed]: ToolboxClosedPayload;
  [ToolboxBlockAdded]: ToolboxBlockAddedPayload;
}
