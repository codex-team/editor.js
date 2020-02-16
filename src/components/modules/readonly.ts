import Module from '../__module';

/**
 * @module readonly
 *
 * Has one important method:
 *    - {Function} toggleReadonly - Set read-only mode or toggle current state
 *
 * @version 1.0.0
 *
 * @typedef {ReadOnly} ReadOnly
 * @property {Boolean} readOnlyEnabled - read-only state
 */
export default class ReadOnly extends Module {

  /**
   * Value to track read-only state
   *
   * @type Boolean
   * @private
   */
  private readOnlyEnabled: boolean = false;

  /**
   * Set initial state
   */
  public async prepare(): Promise<void> {
    this.readOnlyEnabled = this.config.readOnly;
  }

  /**
   * Set read-only mode or toggle current state
   *
   * @param {Boolean} state - (optional) read-only state or toggle
   */
  public toggle(state: boolean = !this.readOnlyEnabled) {
    this.readOnlyEnabled = state;

    for (const name in this.Editor) {

      // Verify module has method
      if (this.Editor[name].toggleReadOnly) {

        // set or toggle read-only state
        this.Editor[name].toggleReadOnly(state);
      }
    }

    return this.readOnlyEnabled;
  }
}
