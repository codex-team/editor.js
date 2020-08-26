import Module from '../../__module';
import { Saver } from '../../../../types/api';
import { OutputData } from '../../../../types';

/**
 * @class SaverAPI
 * provides with methods to save data
 */
export default class SaverAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Saver}
   */
  public get methods(): Saver {
    return {
      save: (sanitizeDisable = false): Promise<OutputData> => this.save(sanitizeDisable),
    };
  }

  /**
   * Return Editor's data
   *
   * @param {boolean} sanitizeDisable true to disable blocks sanitizing on save
   */
  public save(sanitizeDisable: boolean): Promise<OutputData> {
    return this.Editor.Saver.save(sanitizeDisable);
  }
}
