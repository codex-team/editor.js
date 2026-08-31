/**
 * ESM declaration entry point for Node16/NodeNext consumers.
 *
 * TypeScript treats `index.d.ts` as a CommonJS declaration in this package, so
 * ESM imports need a `.d.mts` wrapper to keep `import EditorJS` typed correctly.
 */
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
