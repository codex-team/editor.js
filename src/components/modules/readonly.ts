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
 * @property {boolean} readOnlyEnabled - read-only state
 */
export default class ReadOnly extends Module {
  /**
   * Value to track read-only state
   *
   * @type {boolean}
   */
  private readOnlyEnabled = false;

  /**
   * Set initial state
   */
  public async prepare(): Promise<void> {
    this.readOnlyEnabled = this.config.readOnly;
  }

  /**
   * Set read-only mode or toggle current state
   *
   * @param {boolean} state - (optional) read-only state or toggle
   */
  public toggle(state = !this.readOnlyEnabled): boolean {
    this.readOnlyEnabled = state;

    for (const name in this.Editor) {
      /**
       * Verify module has method `toggleReadOnly` method
       */
      if (!this.Editor[name].toggleReadOnly) {
        continue;
      }

      /**
       * set or toggle read-only state
       */
      this.Editor[name].toggleReadOnly(state);
    }

    return this.readOnlyEnabled;
  }
}
