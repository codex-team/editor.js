import {BlockToolData} from '../tools';

/**
 * Tool's saved data
 */
export interface SavedData {
  tool: string;
  data: BlockToolData;
  time: number;
}

/**
 * Tool's data after validation
 */
export interface ValidatedData {
  tool?: string;
  data?: BlockToolData;
  time?: number;
  isValid: boolean;
}
