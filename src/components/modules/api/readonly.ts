import { ReadOnly } from '../../../../types/api';
import Module from '../../__module';

/**
 * @class ReadOnlyAPI
 * @classdesc ReadOnly API
 */
export default class ReadOnlyAPI extends Module {
  /**
   * Available methods
   */
  public get methods(): ReadOnly {
    const getIsEnabled = (): boolean => this.isEnabled;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return {
      toggle: (state): Promise<boolean> => this.toggle(state),
      get isEnabled(): boolean {
        return getIsEnabled();
      },
    };
  }

  /**
   * Set or toggle read-only state
   *
   * @param {boolean|undefined} state - set or toggle state
   * @returns {boolean} current value
   */
  public toggle(state?: boolean): Promise<boolean> {
    return this.Editor.ReadOnly.toggle(state);
  }

  /**
   * Returns current read-only state
   */
  public get isEnabled(): boolean {
    return this.Editor.ReadOnly.isEnabled;
  }
}
