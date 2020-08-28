import Module from '../__module';
import { CriticalError } from '../errors/critical';
import * as _ from '../utils';

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

    if (toolsDontSupportReadOnly.length > 0) {
      throw new CriticalError(
        `To enable read-only mode all connected tools should support it. Tools ${toolsDontSupportReadOnly.join(', ')} don't support read-only mode.`
      );
    }

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
    await this.Editor.Renderer.render(savedBlocks.blocks);

    return this.readOnlyEnabled;
  }

  /**
   * Function wraps passed method and calls if it is not in read-only mode
   *
   * @param {Function} method - decorated function
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public offDecorator(method: Function): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]): any => {
      if (!this.isEnabled) {
        return method.call(this, ...args);
      }

      _.log('Read only method is enabled, you can\' call this method', 'warn');
    };
  }
}
