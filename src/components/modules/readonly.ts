import Module from '../__module';
import { CriticalError } from '../errors/critical';

/**
 * @module ReadOnly
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
   * Array of tools name which don't support read-only mode
   */
  private toolsDontSupportReadOnly: string[] = [];

  /**
   * Value to track read-only state
   *
   * @type {boolean}
   */
  private readOnlyEnabled = false;

  /**
   * Returns state of read only mode
   */
  public get isEnabled(): boolean {
    return this.readOnlyEnabled;
  }

  /**
   * Set initial state
   */
  public async prepare(): Promise<void> {
    const { Tools } = this.Editor;
    const { blockTools } = Tools;
    const toolsDontSupportReadOnly: string[] = [];

    Object.entries(blockTools).forEach(([name, tool]) => {
      if (!Tools.isReadOnlySupported(tool)) {
        toolsDontSupportReadOnly.push(name);
      }
    });

    this.toolsDontSupportReadOnly = toolsDontSupportReadOnly;

    if (this.config.readOnly && toolsDontSupportReadOnly.length > 0) {
      this.throwCriticalError();
    }

    this.toggle(this.config.readOnly);
  }

  /**
   * Set read-only mode or toggle current state
   * Call all Modules `toggleReadOnly` method and re-render Editor
   *
   * @param {boolean} state - (optional) read-only state or toggle
   */
  public async toggle(state = !this.readOnlyEnabled): Promise<boolean> {
    if (state && this.toolsDontSupportReadOnly.length > 0) {
      this.throwCriticalError();
    }

    const oldState = this.readOnlyEnabled;

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
     * If new state equals old one, do not re-render blocks
     */
    if (oldState === state) {
      return this.readOnlyEnabled;
    }

    /**
     * Save current Editor Blocks and render again
     */
    const savedBlocks = await this.Editor.Saver.save();

    await this.Editor.BlockManager.clear();
    await this.Editor.Renderer.render(savedBlocks.blocks);

    return this.readOnlyEnabled;
  }

  /**
   * Throws an error about tools which don't support read-only mode
   */
  private throwCriticalError(): never {
    throw new CriticalError(
      `To enable read-only mode all connected tools should support it. Tools ${this.toolsDontSupportReadOnly.join(', ')} don't support read-only mode.`
    );
  }
}
