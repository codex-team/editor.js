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
      save: (): Promise<OutputData> => this.save(),
    };
  }

  /**
   * Return Editor's data
   */
  public save(): Promise<OutputData> {
    return this.Editor.Saver.save();
  }
}
