import {OutputData} from '../data-formats/output-data';

export interface Saver {
  save(): Promise<OutputData>;
}
