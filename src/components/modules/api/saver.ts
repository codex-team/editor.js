import { Saver } from '../../../../types/api';
import { OutputData } from '../../../../types';
import * as _ from '../../utils';
import ApiModule from './base';

/**
 * @class SaverAPI
 * provides with methods to save data
 */
export default class SaverAPI extends ApiModule {
  /**
   * Method names that should be disabled in the Read-Only mode
   */
  public methodsToDisableInReadonly: string[] = [
    'save',
  ];

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
   * @returns {OutputData}
   */
  public save(): Promise<OutputData> {
    const errorText = 'Editor\'s content can not be saved in read-only mode';

    if (this.Editor.ReadOnly.isEnabled) {
      _.logLabeled(errorText, 'warn');

      return Promise.reject(new Error(errorText));
    }

    return this.Editor.Saver.save();
  }
}
