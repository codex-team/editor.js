import type { InlineTool, SanitizerConfig } from '../../../types';
import { IconItalic } from '@codexteam/icons';
import type { MenuConfig } from '../../../types/tools';

/**
 * Italic Tool
 *
 * Inline Toolbar Tool
 *
 * Style selected text with italic
 */
export default class ItalicInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title = 'Italic';

  /**
   * Sanitizer Rule
   * Leave <i> tags
   */
  public static get sanitize(): SanitizerConfig {
    return {
      i: {},
    };
  }

  /**
   * Native Document's command that uses for Italic
   */
  private readonly commandName: string = 'italic';

  /**
   * Create button for Inline Toolbar
   */
  public render(): MenuConfig {
    return {
      icon: IconItalic,
      name: 'italic',
      toggle: true,
      onActivate: () =>  document.execCommand(this.commandName),
      isActive: () => document.queryCommandState(this.commandName),
    };
  }

  /**
   * Set a shortcut
   */
  public get shortcut(): string {
    return 'CMD+I';
  }
}
