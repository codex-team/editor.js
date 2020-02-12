import Module from '../../__module';
import { ReadOnly } from '../../../../types/api';

/**
 * @class ReadOnlyAPI
 * @classdesc ReadOnly API
 */
export default class ReadOnlyAPI extends Module {
  /**
   * Available methods
   */
  get methods(): ReadOnly {
    return {
      toggleReadOnly: (state) => this.toggleReadOnly(state),
    };
  }

  /**
   * Set or toggle read-only state
   *
   * @param {Boolean|undefined} state - set or toggle state
   * @returns {Boolean} current value
   */
  public toggleReadOnly(state?: boolean) {
    return this.Editor.ReadOnly.toggleReadOnly(state);
  }
}
