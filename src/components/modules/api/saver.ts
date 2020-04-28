import Module from '../../__module';
import { Saver } from '../../../../types/api';
import { OutputData } from '../../../../types';
import * as _ from '../../utils';

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
   *
   * @returns {OutputData | undefined}
   */
  public save(): Promise<OutputData> | undefined {
    if (this.Editor.ReadOnly.isEnabled) {
      _.logLabeled('Editor\'s content can not be saved in read-only mode', 'warn');

      return;
    }

    return this.Editor.Saver.save();
  }
}
