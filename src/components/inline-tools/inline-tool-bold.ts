import { InlineTool, SanitizerConfig } from '../../../types';
import { IconBold } from '@codexteam/icons';

/**
 * Bold Tool
 *
 * Inline Toolbar Tool
 *
 * Makes selected text bolder
 */
export default class BoldInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title = 'Bold';

  /**
   * Sanitizer Rule
   * Leave <b> tags
   *
   * @returns {object}
   */
  public static get sanitize(): SanitizerConfig {
    return {
      b: {},
    } as SanitizerConfig;
  }

  /**
   * Native Document's command that uses for Bold
   */
  private readonly commandName: string = 'bold';

  /**
   * Create button for Inline Toolbar
   */
  public render(): any {
    return {
      icon: IconBold,
      name: 'bold',
      onActivate: () => {
        document.execCommand(this.commandName);
      },
    };
  }

  /**
   * Wrap range with <b> tag
   */
  public surround(): void {
    document.execCommand(this.commandName);
  }

  /**
   * Check selection and set activated state to button if there are <b> tag
   *
   * @returns {boolean}
   */
  public checkState(): boolean {
    const isActive = document.queryCommandState(this.commandName);

    return isActive;
  }

  /**
   * Set a shortcut
   *
   * @returns {boolean}
   */
  public get shortcut(): string {
    return 'CMD+B';
  }
}
