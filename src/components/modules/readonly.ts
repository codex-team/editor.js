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
   * Call all Modules `toggleReadOnly` method and re-render Editor
   *
   * @param {boolean} state - (optional) read-only state or toggle
   */
  public async toggle(state = !this.readOnlyEnabled): Promise<boolean> {
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

    /**
     * Save current Editor Blocks and render again
     */
    const savedBlocks = await this.Editor.Saver.save();

    await this.Editor.BlockManager.clear();
    await this.Editor.Renderer.render(savedBlocks.blocks, state);

    return this.readOnlyEnabled;
  }
}
