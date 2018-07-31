import InlineTool from '../interfaces/tools/inline-tool';

declare var $: any;

/**
 * Italic Tool
 *
 * Inline Toolbar Tool
 *
 * Style selected text with italic
 */
export default class ItalicInlineTool implements InlineTool {

  /**
   * Native Document's command that uses for Italic
   */
  private readonly commandName: string = 'italic';

  /**
   * Styles
   */
  private readonly CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-inline-tool--active',
    buttonModifier: 'ce-inline-tool--italic',
  };

  /**
   * Elements
   */
  private nodes = {
    button: null,
  };

  constructor(api) {
  }

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button');
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
    this.nodes.button.appendChild($.svg('italic', 6, 15));
    return this.nodes.button;
  }

  /**
   * Wrap range with <i> tag
   * @param {Range} range
   */
  public surround(range: Range): void {
    document.execCommand(this.commandName);
  }

  /**
   * Check selection and set activated state to button if there are <i> tag
   * @param {Selection} selection
   */
  public checkState(selection: Selection): boolean {
    const isActive = document.queryCommandState(this.commandName);

    this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);
    return isActive;
  }

  /**
   * Set a shortcut
   */
  public get shortcut(): string {
    return 'CMD+I';
  }

}
