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
   * Method names that should be disabled in the Read-Only mode
   */
  protected methodsToDisableInReadonly: string[] = [
    'save',
  ];

  /**
   * Available methods
   *
   * @returns {Saver}
   */
  public get methods(): Saver {
    const methods = {
      save: (): Promise<OutputData> => this.save(),
    };

    for (const method in methods) {
      if (this.methodsToDisableInReadonly.includes(method)) {
        methods[method] = this.Editor.ReadOnly.offDecorator(methods[method]);
      }
    }

    return methods;
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
