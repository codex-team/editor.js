import type { InlineTool, SanitizerConfig } from '../../../types';
import { IconBold } from '@codexteam/icons';
import type { MenuConfig } from '../../../types/tools';

/**
 * Bold Tool
 *
 * Inline Toolbar Tool
 *
 * Makes selected text bold
 */
export default class BoldInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title = 'Bold';

  /**
   * Sanitizer Rule
   * Leave <b> tags
   */
  public static get sanitize(): SanitizerConfig {
    return {
      b: {},
    };
  }

  /**
   * Native Document's command that uses for Bold
   */
  private readonly commandName: string = 'bold';

  /**
   * Create button for Inline Toolbar
   */
  public render(): MenuConfig {
    return {
      icon: IconBold,
      name: 'bold',
      onActivate: () => {
        document.execCommand(this.commandName);
      },
      isActive: () => document.queryCommandState(this.commandName),
    };
  }

  /**
   * Set a shortcut
   */
  public get shortcut(): string {
    return 'CMD+B';
  }
}
