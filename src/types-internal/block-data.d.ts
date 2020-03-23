import {BlockToolData} from '../../types/tools';
import {BlockTuneData} from '../../types/block-tunes';

/**
 * Tool's saved data
 */
export interface SavedData {
    tool: string;
    data: BlockToolData;
    time: number;
    tunes?: {[name: string]: BlockTuneData};
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
