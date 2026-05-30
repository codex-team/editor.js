export type * from './index.js';
export {
  BlockAddedMutationType,
  BlockChangedMutationType,
  BlockMovedMutationType,
  BlockRemovedMutationType,
  LogLevels,
  PopoverEvent,
  PopoverItemType,
} from './index.js';

declare const EditorJS: typeof import('./index.js').default;

export default EditorJS;
