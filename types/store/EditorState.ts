import { OutputBlockData } from '../index';

/**
 * Type of the state object
 * It contains a blocks' data by block IDs as a key
 */
export type EditorState = Record<string, OutputBlockData>;
