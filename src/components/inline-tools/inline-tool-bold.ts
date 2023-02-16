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
   * Styles
   */
  private readonly CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-inline-tool--active',
    buttonModifier: 'ce-inline-tool--bold',
  };

  /**
   * Elements
   */
  private nodes: {button: HTMLButtonElement} = {
    button: undefined,
  };

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement;
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
    this.nodes.button.innerHTML = IconBold;

    return this.nodes.button;
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

    this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);

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
