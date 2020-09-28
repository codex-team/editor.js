import {OutputData} from '../data-formats/output-data';

/**
 * Describes Editor`s saver API
 */
export interface Saver {
  /**
   * Clones Editors data and returns promise with it
   *
   * @returns {Promise<OutputData>}
   */
  clone(): Promise<OutputData>;

  /**
   * Saves Editors data and returns promise with it
   *
   * @returns {Promise<OutputData>}
   */
  save(): Promise<OutputData>;
}
