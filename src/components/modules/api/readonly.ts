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
      toggle: (state) => this.toggle(state),
    };
  }

  /**
   * Set or toggle read-only state
   *
   * @param {Boolean|undefined} state - set or toggle state
   * @returns {Boolean} current value
   */
  public toggle(state?: boolean) {
    return this.Editor.ReadOnly.toggle(state);
  }
}
