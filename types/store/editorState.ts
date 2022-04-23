import { OutputBlockData } from '../index';

/**
 * Type of the state object
 */
export interface EditorState {
  /**
   * Data of blocks in the editor
   */
  blocks: Record<string, OutputBlockData>;
}
